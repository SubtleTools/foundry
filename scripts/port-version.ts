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
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { bumpGoVersion } from "../libs/dev/versioning/bump-go";
import type { PortInfo } from "../libs/dev/versioning/types";
import { generatePortReport } from "./lib/port-report";

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

const refDir = join(ROOT, "upstream", packageName);
if (!existsSync(refDir)) {
  console.error(`Upstream submodule not found: ${refDir}`);
  console.error(`Run: git submodule update --init upstream/${packageName}`);
  process.exit(1);
}

console.log(`\n📂 Updating Go reference in upstream/${packageName}`);

// Update submodule to target version
await $`git -C ${refDir} fetch --tags`.quiet();
await $`git -C ${refDir} checkout v${targetVersion}`.quiet();
console.log(`   ✓ Checked out v${targetVersion}`);

// ─── Bump version ────────────────────────────────────────────────────────────

console.log(`\n📝 Bumping version...`);
bumpGoVersion(pkgJsonPath, targetVersion);

// ─── Generate diff report ────────────────────────────────────────────────────

console.log(`\n📊 Generating PORT_REPORT.md...`);

const reportContent = await generatePortReport({
  packageName: pkg.name,
  sourceRepo: portInfo.sourceRepo,
  currentGoVersion,
  targetVersion,
});

const reportPath = join(pkgDir, "PORT_REPORT.md");
writeFileSync(reportPath, reportContent);
console.log(`   ✓ Written to ${reportPath.replace(ROOT + "/", "")}`);

// ─── Auto-commit scaffolding ─────────────────────────────────────────────────

console.log(`\n💾 Committing scaffolding...`);
try {
  await $`git -C ${ROOT} add ${pkgJsonPath} ${reportPath}`.quiet();
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
