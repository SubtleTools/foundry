#!/usr/bin/env bun
/**
 * Check for new upstream versions of a single project.
 * Outputs JSON to stdout. Human messages go to stderr only.
 *
 * Usage: bun run scripts/check-version-for-project.ts <project>
 * Example: bun run scripts/check-version-for-project.ts go-colorful
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { stripV, isNewer, getGitTags } from "./lib/versions";

interface VersionCheckResult {
  project: string;
  packagePath: string;
  upstreamPath: string;
  sourceRepo: string;
  currentPortedVersion: string;
  latestVersion: string;
  newerVersions: string[];
  hasUpdates: boolean;
}

const ROOT = join(import.meta.dir, "..");
const project = process.argv[2];

if (!project) {
  console.error("Usage: bun run scripts/check-version-for-project.ts <project>");
  console.error("Example: bun run scripts/check-version-for-project.ts go-colorful");
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

const pkgJsonPath = join(packagePath, "package.json");
const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

if (!pkg.portInfo) {
  console.error(`No portInfo in ${pkgJsonPath}`);
  process.exit(1);
}

const sourceRepo: string = pkg.portInfo.sourceRepo;
const currentPortedVersion = stripV(pkg.portInfo.sourceVersion);

console.error(`Checking versions for ${project} (currently ported: v${currentPortedVersion})...`);

const allTags = await getGitTags(upstreamPath);
if (allTags.length === 0) {
  console.error(`No tags found in upstream/${project}. Try: git -C upstream/${project} fetch --tags`);
  process.exit(1);
}

const newerVersions = allTags
  .filter((tag) => isNewer(tag, currentPortedVersion))
  .map((tag) => stripV(tag));

const latestVersion = stripV(allTags[0]);

const result: VersionCheckResult = {
  project,
  packagePath,
  upstreamPath,
  sourceRepo,
  currentPortedVersion,
  latestVersion,
  newerVersions,
  hasUpdates: newerVersions.length > 0,
};

if (result.hasUpdates) {
  console.error(`Found ${newerVersions.length} newer version(s): ${newerVersions.join(", ")}`);
} else {
  console.error(`Already up to date at v${currentPortedVersion}`);
}

// JSON to stdout only
console.log(JSON.stringify(result, null, 2));
