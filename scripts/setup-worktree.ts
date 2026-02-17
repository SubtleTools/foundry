#!/usr/bin/env bun
/**
 * Create an isolated git worktree for porting a specific upstream version.
 *
 * Usage: bun run scripts/setup-worktree.ts <project> <version>
 * Example: bun run scripts/setup-worktree.ts go-colorful 1.3.0
 *
 * What it does:
 *   1. Creates branch <project>/v<version> from HEAD
 *   2. Creates worktree at .worktrees/<project>-v<version>/
 *   3. Inits upstream submodule and checks out target version tag
 *   4. Bumps package.json via bumpGoVersion()
 *   5. Generates PORT_REPORT.md
 *   6. Commits scaffolding in the worktree
 *   7. Outputs JSON result to stdout
 */

import { $ } from "bun";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import { bumpGoVersion } from "../libs/dev/versioning/bump-go";
import type { PortInfo } from "../libs/dev/versioning/types";
import { generatePortReport } from "./lib/port-report";

interface WorktreeResult {
  project: string;
  version: string;
  branch: string;
  worktreePath: string;
  portReportPath: string;
  packagePath: string;
}

const ROOT = resolve(import.meta.dir, "..");
const WORKTREES_DIR = join(ROOT, ".worktrees");

const project = process.argv[2];
const version = process.argv[3]?.replace(/^v/, "");

if (!project || !version) {
  console.error("Usage: bun run scripts/setup-worktree.ts <project> <version>");
  console.error("Example: bun run scripts/setup-worktree.ts go-colorful 1.3.0");
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`Invalid version format: "${version}". Expected X.Y.Z`);
  process.exit(1);
}

const upstreamPath = join(ROOT, "upstream", project);
const packagePath = join(ROOT, "packages/tsports", project);

if (!existsSync(upstreamPath)) {
  console.error(`Upstream not found: upstream/${project}`);
  process.exit(1);
}

if (!existsSync(packagePath)) {
  console.error(`Package not found: packages/tsports/${project}`);
  process.exit(1);
}

const branch = `${project}/v${version}`;
const worktreePath = join(WORKTREES_DIR, `${project}-v${version}`);

// If worktree already exists, report it and exit
if (existsSync(worktreePath)) {
  console.error(`Worktree already exists at ${worktreePath}`);
  const result: WorktreeResult = {
    project,
    version,
    branch,
    worktreePath,
    portReportPath: join(worktreePath, "packages/tsports", project, "PORT_REPORT.md"),
    packagePath: join(worktreePath, "packages/tsports", project),
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// Ensure .worktrees/ dir exists
mkdirSync(WORKTREES_DIR, { recursive: true });

// Add .worktrees/ to .gitignore if not already there
const gitignorePath = join(ROOT, ".gitignore");
const gitignoreContent = readFileSync(gitignorePath, "utf8");
if (!gitignoreContent.includes(".worktrees")) {
  writeFileSync(gitignorePath, gitignoreContent.trimEnd() + "\n.worktrees/\n");
  console.error("Added .worktrees/ to .gitignore");
}

// Read portInfo from package.json
const pkgJsonPath = join(packagePath, "package.json");
const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
const portInfo: PortInfo | undefined = pkg.portInfo;

if (!portInfo) {
  console.error(`No portInfo in ${pkgJsonPath}`);
  process.exit(1);
}

const currentGoVersion = portInfo.sourceVersion.replace(/^v/, "");

console.error(`Setting up worktree for ${project} v${version}...`);

// Create branch from HEAD (ignore error if it already exists)
try {
  await $`git -C ${ROOT} branch ${branch}`.quiet();
  console.error(`Created branch: ${branch}`);
} catch {
  console.error(`Branch ${branch} already exists, reusing`);
}

// Create worktree
try {
  await $`git -C ${ROOT} worktree add ${worktreePath} ${branch}`.quiet();
  console.error(`Created worktree at ${worktreePath}`);
} catch (e) {
  console.error(`Failed to create worktree: ${e}`);
  process.exit(1);
}

// Init upstream submodule in worktree and checkout target version
const wtUpstream = join(worktreePath, "upstream", project);
try {
  await $`git -C ${worktreePath} submodule update --init upstream/${project}`.quiet();
  console.error(`Initialized submodule upstream/${project}`);
} catch (e) {
  console.error(`Warning: submodule init failed (may need manual init): ${e}`);
}

// Fetch tags and checkout target version in the worktree's submodule
try {
  await $`git -C ${wtUpstream} fetch --tags`.quiet();
  await $`git -C ${wtUpstream} checkout v${version}`.quiet();
  console.error(`Checked out v${version} in upstream submodule`);
} catch (e) {
  console.error(`Failed to checkout v${version} in upstream: ${e}`);
  process.exit(1);
}

// Bump package.json in the worktree
const wtPkgJsonPath = join(worktreePath, "packages/tsports", project, "package.json");
bumpGoVersion(wtPkgJsonPath, version);
console.error(`Bumped package.json to v${version}`);

// Generate PORT_REPORT.md
const reportContent = await generatePortReport({
  packageName: pkg.name,
  sourceRepo: portInfo.sourceRepo,
  currentGoVersion,
  targetVersion: version,
});

const wtPkgDir = join(worktreePath, "packages/tsports", project);
const reportPath = join(wtPkgDir, "PORT_REPORT.md");
writeFileSync(reportPath, reportContent);
console.error(`Generated PORT_REPORT.md`);

// Stage and commit scaffolding in worktree
try {
  await $`git -C ${worktreePath} add upstream/${project} ${wtPkgJsonPath} ${reportPath}`.quiet();
  const commitMsg = `chore(${project}): scaffold port of upstream v${version}\n\n- Checkout upstream v${version}\n- Bump package.json\n- Generate PORT_REPORT.md`;
  await $`git -C ${worktreePath} commit -m ${commitMsg}`.quiet();
  console.error(`Committed scaffolding`);
} catch (e) {
  console.error(`Warning: auto-commit failed (you may need to commit manually): ${e}`);
}

// Output result JSON
const result: WorktreeResult = {
  project,
  version,
  branch,
  worktreePath,
  portReportPath: reportPath,
  packagePath: wtPkgDir,
};

console.log(JSON.stringify(result, null, 2));
