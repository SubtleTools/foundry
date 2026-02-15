#!/usr/bin/env bun

/**
 * Automates the setup phase of porting a new upstream Go version.
 *
 * Usage: bun run scripts/port-version.ts <package-name> <go-version>
 * Example: bun run scripts/port-version.ts go-colorful 1.3.0
 *
 * What it does:
 *   1. Validates inputs and reads current portInfo
 *   2. Creates a feature branch (<package>/v<version>)
 *   3. Updates the Go reference checkout to the target version tag
 *   4. Bumps package.json version via @dev/versioning
 *   5. Generates a PORT_REPORT.md with diff analysis
 *   6. Auto-commits the scaffolding
 */

import { $ } from "bun";
import { existsSync, readFileSync, statSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { bumpGoVersion } from "../libs/dev/versioning/bump-go";
import { parseNpmVersion } from "../libs/dev/versioning/parse";
import type { PortInfo } from "../libs/dev/versioning/types";

const ROOT = join(import.meta.dir, "..");

// ─── CLI ─────────────────────────────────────────────────────────────────────

const packageName = process.argv[2];
const targetVersion = process.argv[3]?.replace(/^v/, "");

if (!packageName || !targetVersion) {
  console.error("Usage: bun run scripts/port-version.ts <package-name> <go-version>");
  console.error("Example: bun run scripts/port-version.ts go-colorful 1.3.0");
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(targetVersion)) {
  console.error(`Invalid version format: "${targetVersion}". Expected X.Y.Z`);
  process.exit(1);
}

const pkgDir = join(ROOT, "packages/tsports", packageName);

if (!existsSync(pkgDir)) {
  console.error(`Package not found: packages/tsports/${packageName}`);
  console.error("Available packages:");
  const { stdout } = await $`ls ${join(ROOT, "packages/tsports")}`.quiet();
  console.error(stdout.toString().trim().split("\n").map((s: string) => `  - ${s}`).join("\n"));
  process.exit(1);
}

// ─── Read current state ──────────────────────────────────────────────────────

const pkgJsonPath = join(pkgDir, "package.json");
const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
const portInfo: PortInfo | undefined = pkg.portInfo;

if (!portInfo) {
  console.error(`No portInfo found in ${pkgJsonPath}`);
  process.exit(1);
}

const currentGoVersion = portInfo.sourceVersion.replace(/^v/, "");
const currentVersionInfo = parseNpmVersion(pkg.version);

console.log(`\n📦 ${pkg.name} — porting upstream ${currentGoVersion} → ${targetVersion}\n`);

if (currentGoVersion === targetVersion) {
  console.error(`Already at Go version ${targetVersion}. Nothing to do.`);
  process.exit(0);
}

// ─── Create feature branch ───────────────────────────────────────────────────

const branchName = `${packageName}/v${targetVersion}`;

try {
  // Check for uncommitted changes
  const { stdout: statusOut } = await $`git -C ${ROOT} status --porcelain`.quiet();
  const status = statusOut.toString().trim();
  if (status) {
    console.warn("⚠️  Working tree has uncommitted changes. Proceeding anyway.\n");
  }

  await $`git -C ${ROOT} checkout -b ${branchName}`.quiet();
  console.log(`🌿 Created branch: ${branchName}`);
} catch {
  // Branch might already exist
  try {
    await $`git -C ${ROOT} checkout ${branchName}`.quiet();
    console.log(`🌿 Switched to existing branch: ${branchName}`);
  } catch (e) {
    console.error(`Failed to create/switch to branch ${branchName}:`, e);
    process.exit(1);
  }
}

// ─── Update Go reference ─────────────────────────────────────────────────────

// Detect reference location (new pattern vs legacy)
const refNew = join(pkgDir, "test/reference");
const refLegacy = join(pkgDir, "test/automation/reference");
let refDir: string;

if (existsSync(refNew)) {
  refDir = refNew;
} else if (existsSync(refLegacy)) {
  refDir = refLegacy;
} else {
  // Neither exists — clone fresh into new-pattern location
  refDir = refNew;
}

const sourceRepo = portInfo.sourceRepo;
console.log(`\n📂 Updating Go reference in ${refDir.replace(ROOT + "/", "")}`);

const gitDir = join(refDir, ".git");

if (existsSync(refDir) && existsSync(gitDir)) {
  // Check if .git is a file (broken submodule pointer) or directory
  const gitStat = statSync(gitDir);

  if (gitStat.isFile()) {
    // Broken submodule — nuke and re-clone
    console.log("   Removing broken submodule reference...");
    rmSync(refDir, { recursive: true, force: true });
    await cloneReference(sourceRepo, refDir, targetVersion);
  } else {
    // Normal .git directory — fetch and checkout
    try {
      await $`git -C ${refDir} fetch --tags`.quiet();
      await $`git -C ${refDir} checkout v${targetVersion}`.quiet();
      console.log(`   ✓ Checked out v${targetVersion}`);
    } catch {
      console.log("   Fetch/checkout failed, re-cloning...");
      rmSync(refDir, { recursive: true, force: true });
      await cloneReference(sourceRepo, refDir, targetVersion);
    }
  }
} else if (existsSync(refDir) && !existsSync(gitDir)) {
  // Directory exists but no .git — remove and re-clone
  rmSync(refDir, { recursive: true, force: true });
  await cloneReference(sourceRepo, refDir, targetVersion);
} else {
  await cloneReference(sourceRepo, refDir, targetVersion);
}

async function cloneReference(repo: string, dir: string, version: string) {
  const parent = join(dir, "..");
  const dirName = dir.split("/").pop()!;
  await $`mkdir -p ${parent}`;
  await $`git clone ${repo} ${dir}`.quiet();
  await $`git -C ${dir} checkout v${version}`.quiet();
  console.log(`   ✓ Cloned and checked out v${version}`);
}

// Ensure .git/ is in .gitignore
const gitignorePath = join(pkgDir, ".gitignore");
if (existsSync(gitignorePath)) {
  const gitignoreContent = readFileSync(gitignorePath, "utf8");
  const refRelative = refDir.replace(pkgDir + "/", "");
  const ignoreEntry = `${refRelative}/.git/`;
  if (!gitignoreContent.includes(ignoreEntry)) {
    writeFileSync(gitignorePath, gitignoreContent.trimEnd() + `\n\n# Go reference git metadata\n${ignoreEntry}\n`);
    console.log(`   ✓ Added ${ignoreEntry} to .gitignore`);
  }
}

// ─── Bump version ────────────────────────────────────────────────────────────

console.log(`\n📝 Bumping version...`);
bumpGoVersion(pkgJsonPath, targetVersion);

// ─── Generate diff report ────────────────────────────────────────────────────

console.log(`\n📊 Generating PORT_REPORT.md...`);

const [owner, repo] = extractOwnerRepo(sourceRepo);
let reportContent = `# Port Report: ${pkg.name} v${targetVersion}\n\n`;
reportContent += `**Upstream**: ${sourceRepo}\n`;
reportContent += `**Previous version**: v${currentGoVersion}\n`;
reportContent += `**Target version**: v${targetVersion}\n`;
reportContent += `**Generated**: ${new Date().toISOString()}\n\n`;

try {
  const { stdout: diffJson } = await $`gh api repos/${owner}/${repo}/compare/v${currentGoVersion}...v${targetVersion}`.quiet();
  const diff = JSON.parse(diffJson.toString());

  reportContent += `## Summary\n\n`;
  reportContent += `- **Commits**: ${diff.total_commits}\n`;
  reportContent += `- **Files changed**: ${diff.files?.length ?? 0}\n\n`;

  if (diff.files && diff.files.length > 0) {
    reportContent += `## Changed Files\n\n`;
    reportContent += `| File | Status | +Lines | -Lines | Relevant? |\n`;
    reportContent += `|------|--------|--------|--------|-----------|\n`;

    const goFiles: Array<{ filename: string; status: string; additions: number; deletions: number; patch?: string }> = [];

    for (const file of diff.files) {
      const isGo = file.filename.endsWith(".go");
      const isTest = file.filename.includes("_test.go");
      const isDoc = file.filename.startsWith("doc/") || file.filename.startsWith(".github/");
      const relevant = isGo && !isTest && !isDoc ? "**YES**" : isTest ? "test" : "no";

      reportContent += `| ${file.filename} | ${file.status} | +${file.additions} | -${file.deletions} | ${relevant} |\n`;

      if (isGo && !isTest && !isDoc) {
        goFiles.push(file);
      }
    }

    if (goFiles.length > 0) {
      reportContent += `\n## Files to Port\n\n`;
      reportContent += `These Go source files have changes that need to be reflected in TypeScript:\n\n`;

      for (const file of goFiles) {
        const tsFile = file.filename.replace(".go", ".ts");
        reportContent += `### ${file.filename}\n\n`;
        reportContent += `- **Status**: ${file.status}\n`;
        reportContent += `- **Changes**: +${file.additions} / -${file.deletions}\n`;
        reportContent += `- **TS counterpart**: \`src/${tsFile}\` (verify path)\n`;

        // Try to extract function-level changes from the patch
        if (file.patch) {
          const functions = extractFunctionChanges(file.patch);
          if (functions.added.length > 0) {
            reportContent += `- **New functions**: ${functions.added.map((f) => `\`${f}\``).join(", ")}\n`;
          }
          if (functions.modified.length > 0) {
            reportContent += `- **Modified functions**: ${functions.modified.map((f) => `\`${f}\``).join(", ")}\n`;
          }
        }

        reportContent += `\n`;
      }
    }

    // Suggested porting order
    reportContent += `## Suggested Porting Order\n\n`;
    const newFiles = goFiles.filter((f) => f.status === "added");
    const modifiedFiles = goFiles.filter((f) => f.status === "modified");

    if (newFiles.length > 0) {
      reportContent += `### New files (create from scratch)\n\n`;
      for (const f of newFiles) {
        reportContent += `1. \`${f.filename}\` → \`src/${f.filename.replace(".go", ".ts")}\`\n`;
      }
      reportContent += `\n`;
    }

    if (modifiedFiles.length > 0) {
      reportContent += `### Modified files (update existing)\n\n`;
      // Sort by number of changes (smallest first for quick wins)
      modifiedFiles.sort((a, b) => a.additions + a.deletions - (b.additions + b.deletions));
      for (const f of modifiedFiles) {
        reportContent += `1. \`${f.filename}\` (+${f.additions}/-${f.deletions})\n`;
      }
      reportContent += `\n`;
    }
  }
} catch (e) {
  reportContent += `## Diff Analysis\n\n`;
  reportContent += `⚠️ Could not fetch diff from GitHub API. You can view it manually:\n\n`;
  reportContent += `\`\`\`\ngh api repos/${owner}/${repo}/compare/v${currentGoVersion}...v${targetVersion}\n\`\`\`\n\n`;
  reportContent += `Or visit: https://github.com/${owner}/${repo}/compare/v${currentGoVersion}...v${targetVersion}\n`;
}

reportContent += `## Checklist\n\n`;
reportContent += `- [ ] Review all changed Go files above\n`;
reportContent += `- [ ] Port new functions/types to TypeScript\n`;
reportContent += `- [ ] Update existing functions with Go changes\n`;
reportContent += `- [ ] Add Go-style API wrappers for new exports (\`src/go-style.ts\`)\n`;
reportContent += `- [ ] Update \`src/index.ts\` exports\n`;
reportContent += `- [ ] Update/add tests\n`;
reportContent += `- [ ] Run \`bun test\` and verify all tests pass\n`;
reportContent += `- [ ] Update CHANGELOG.md\n`;
reportContent += `- [ ] Commit and merge to main\n`;

const reportPath = join(pkgDir, "PORT_REPORT.md");
writeFileSync(reportPath, reportContent);
console.log(`   ✓ Written to ${reportPath.replace(ROOT + "/", "")}`);

// ─── Auto-commit scaffolding ─────────────────────────────────────────────────

console.log(`\n💾 Committing scaffolding...`);
try {
  await $`git -C ${ROOT} add ${pkgJsonPath} ${reportPath} ${refDir}`.quiet();
  if (existsSync(gitignorePath)) {
    await $`git -C ${ROOT} add ${gitignorePath}`.quiet();
  }
  await $`git -C ${ROOT} commit -m ${"chore(" + packageName + "): scaffold port of upstream v" + targetVersion + "\n\n" + "- Update Go reference to v" + targetVersion + "\n" + "- Bump version " + pkg.version + " → " + (await readNewVersion()) + "\n" + "- Generate PORT_REPORT.md with diff analysis"}`.quiet();
  console.log(`   ✓ Committed scaffolding`);
} catch (e) {
  console.warn(`   ⚠️ Auto-commit failed (you may need to commit manually)`);
}

async function readNewVersion(): Promise<string> {
  const updated = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  return updated.version;
}

// ─── Done ────────────────────────────────────────────────────────────────────

console.log(`
╭──────────────────────────────────────────────────────────╮
│  Setup complete! Ready to port.                          │
╰──────────────────────────────────────────────────────────╯

Branch:  ${branchName}
Report:  packages/tsports/${packageName}/PORT_REPORT.md

Next steps:
  1. Read PORT_REPORT.md for what changed
  2. Port the Go changes to TypeScript in src/
  3. Update go-style.ts with new exports
  4. Run tests: cd packages/tsports/${packageName} && bun test
  5. Commit your work
  6. Merge ${branchName} → main
`);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractOwnerRepo(url: string): [string, string] {
  // Handle https://github.com/owner/repo and git@github.com:owner/repo.git
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  if (!match) {
    throw new Error(`Cannot extract owner/repo from URL: ${url}`);
  }
  return [match[1], match[2]];
}

function extractFunctionChanges(patch: string): { added: string[]; modified: string[] } {
  const added: string[] = [];
  const modified: string[] = [];
  const seen = new Set<string>();

  for (const line of patch.split("\n")) {
    // Go function definition pattern
    const funcMatch = line.match(/^[+-]\s*func\s+(?:\([^)]+\)\s+)?(\w+)\s*\(/);
    if (funcMatch && !seen.has(funcMatch[1])) {
      seen.add(funcMatch[1]);
      if (line.startsWith("+")) {
        // Check if there's a corresponding removal (modified) or just added
        const removeLine = patch.includes(`-func ${funcMatch[1]}(`) || patch.includes(`- func ${funcMatch[1]}(`);
        if (removeLine) {
          modified.push(funcMatch[1]);
        } else {
          added.push(funcMatch[1]);
        }
      }
    }
  }

  return { added, modified };
}
