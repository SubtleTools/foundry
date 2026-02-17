#!/usr/bin/env bun
/**
 * Validates that @tsports/* inter-package dependency versions match the
 * upstream Go module dependency versions declared in go.mod.
 *
 * If upstream lipgloss depends on go-colorful@1.2.0, then @tsports/lipgloss
 * must depend on @tsports/go-colorful with a version matching Go v1.2.0.
 *
 * Exit code 0 = all deps match. Exit code 1 = mismatches found.
 *
 * Usage:
 *   bun run scripts/check-dep-versions.ts          # check all packages
 *   bun run scripts/check-dep-versions.ts lipgloss  # check one package
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { stripV } from "./lib/versions";

const ROOT = join(import.meta.dir, "..");

/**
 * Map Go module paths to tsports package directory names.
 * Only modules that have a @tsports/* port are listed.
 */
const GO_MODULE_TO_TSPORT: Record<string, string> = {
  "github.com/lucasb-eyer/go-colorful": "go-colorful",
  "github.com/muesli/termenv": "termenv",
  "github.com/rivo/uniseg": "uniseg",
  "github.com/aymanbagabas/go-osc52/v2": "go-osc52",
  "github.com/aymanbagabas/go-osc52": "go-osc52",
  "github.com/muesli/gamut": "gamut",
  "github.com/charmbracelet/lipgloss": "lipgloss",
};

interface GoModDep {
  module: string;
  version: string; // e.g. "v1.2.0"
}

interface Mismatch {
  package: string;
  dependency: string;
  goModVersion: string;
  tsportVersion: string;
  expectedNpmVersion: string;
}

/**
 * Parse go.mod require blocks and return dependencies.
 */
function parseGoMod(goModPath: string): GoModDep[] {
  if (!existsSync(goModPath)) return [];

  const content = readFileSync(goModPath, "utf8");
  const deps: GoModDep[] = [];

  // Match both single-line and block require statements
  // Single: require github.com/foo/bar v1.2.3
  // Block: require ( ... )
  const blockRegex = /require\s*\(([\s\S]*?)\)/g;
  const singleRegex = /^require\s+(\S+)\s+(\S+)/gm;

  // Parse block requires
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(content)) !== null) {
    const block = match[1];
    for (const line of block.split("\n")) {
      const trimmed = line.trim().replace(/\s*\/\/.*$/, ""); // strip comments
      if (!trimmed) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        deps.push({ module: parts[0], version: parts[1] });
      }
    }
  }

  // Parse single-line requires
  while ((match = singleRegex.exec(content)) !== null) {
    deps.push({ module: match[1], version: match[2] });
  }

  return deps;
}

/**
 * Convert a Go version to the expected npm version.
 * Go v1.2.0 → npm 1.2.0 (with tsPatch=0, that's 1.2.0)
 * Go v2.0.1 → npm 2.0.100
 */
function goVersionToNpmBase(goVersion: string): string {
  const stripped = stripV(goVersion);
  const parts = stripped.split(".");
  if (parts.length !== 3) return stripped;

  const major = parts[0];
  const minor = parts[1];
  const patch = parseInt(parts[2], 10);
  // The npm patch encodes goPatch*100 + tsPatch.
  // The minimum valid npm version for this Go version is goPatch*100.
  return `${major}.${minor}.${patch * 100}`;
}

/**
 * Check if an npm version range (from package.json) is compatible with
 * the expected Go version. The npm version encodes goPatch*100+tsPatch,
 * so any tsPatch (0-99) is fine as long as the Go version matches.
 */
function isCompatible(npmVersionOrRange: string, goVersion: string): boolean {
  const stripped = stripV(goVersion);
  const goParts = stripped.split(".").map(Number);
  if (goParts.length !== 3) return false;

  const [goMajor, goMinor, goPatch] = goParts;
  const minNpm = goPatch * 100;
  const maxNpm = minNpm + 99;

  // Handle workspace protocol
  const cleanRange = npmVersionOrRange
    .replace(/^workspace:/, "")
    .replace(/^\^/, "")
    .replace(/^~/, "")
    .replace(/^>=/, "");

  if (cleanRange === "*" || cleanRange === "") {
    // workspace:* — always matches (depends on whatever is in the workspace)
    // We still want to validate the actual installed version
    return true;
  }

  // Try to parse as a concrete version
  const npmParts = cleanRange.split(".").map(Number);
  if (npmParts.length !== 3 || npmParts.some(isNaN)) return false;

  const [npmMajor, npmMinor, npmPatch] = npmParts;
  return npmMajor === goMajor && npmMinor === goMinor && npmPatch >= minNpm && npmPatch <= maxNpm;
}

/**
 * For workspace:* deps, read the actual version from the dependency's package.json.
 */
function getActualWorkspaceVersion(depPkgName: string): string | null {
  // Map @tsports/X → packages/tsports/X
  const match = depPkgName.match(/^@tsports\/(.+)$/);
  if (!match) return null;
  const depDir = join(ROOT, "packages/tsports", match[1]);
  const depPkgJsonPath = join(depDir, "package.json");
  if (!existsSync(depPkgJsonPath)) return null;
  const depPkg = JSON.parse(readFileSync(depPkgJsonPath, "utf8"));
  return depPkg.version ?? null;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const targetPackage = process.argv[2];
const packagesDir = join(ROOT, "packages/tsports");

// Discover packages to check
let packages: string[];
if (targetPackage) {
  if (!existsSync(join(packagesDir, targetPackage))) {
    console.error(`Package not found: packages/tsports/${targetPackage}`);
    process.exit(1);
  }
  packages = [targetPackage];
} else {
  packages = ["gamut", "go-colorful", "go-osc52", "lipgloss", "termenv", "uniseg"];
}

const allMismatches: Mismatch[] = [];

for (const pkg of packages) {
  const pkgDir = join(packagesDir, pkg);
  const pkgJsonPath = join(pkgDir, "package.json");
  const upstreamDir = join(ROOT, "upstream", pkg);
  const goModPath = join(upstreamDir, "go.mod");

  if (!existsSync(pkgJsonPath)) continue;

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const deps: Record<string, string> = pkgJson.dependencies ?? {};

  // Parse upstream go.mod
  const goModDeps = parseGoMod(goModPath);

  // For each Go dep that has a @tsports counterpart, validate
  for (const goDep of goModDeps) {
    const tsportName = GO_MODULE_TO_TSPORT[goDep.module];
    if (!tsportName) continue;

    const npmPkgName = `@tsports/${tsportName}`;
    const npmRange = deps[npmPkgName];

    if (!npmRange) {
      // This package doesn't declare the dep — might be indirect in Go.
      // Only flag if it's a direct dependency in go.mod (not // indirect)
      continue;
    }

    // For workspace:* ranges, check the actual installed version
    let versionToCheck = npmRange;
    let isWorkspaceStar = npmRange === "workspace:*";
    if (isWorkspaceStar) {
      const actual = getActualWorkspaceVersion(npmPkgName);
      if (!actual) {
        console.error(`  Cannot resolve workspace version for ${npmPkgName}`);
        continue;
      }
      versionToCheck = actual;
    }

    if (!isCompatible(versionToCheck, goDep.version)) {
      allMismatches.push({
        package: pkg,
        dependency: npmPkgName,
        goModVersion: goDep.version,
        tsportVersion: isWorkspaceStar ? `workspace:* → ${versionToCheck}` : versionToCheck,
        expectedNpmVersion: goVersionToNpmBase(goDep.version),
      });
    }
  }
}

// ─── Output ──────────────────────────────────────────────────────────────────

if (allMismatches.length === 0) {
  console.log("All @tsports/* dependency versions match upstream go.mod.");
  process.exit(0);
}

console.error("Dependency version mismatches found:\n");
for (const m of allMismatches) {
  console.error(`  ${m.package} → ${m.dependency}`);
  console.error(`    go.mod requires: ${m.goModVersion}`);
  console.error(`    tsport version:  ${m.tsportVersion}`);
  const ep = m.expectedNpmVersion.split(".");
  console.error(`    expected npm:    >=${m.expectedNpmVersion}, <=${ep[0]}.${ep[1]}.${parseInt(ep[2]) + 99}`);
  console.error();
}

console.error(
  `${allMismatches.length} mismatch(es) found. Fix package.json dependency versions to match upstream go.mod.\n` +
  `Tip: workspace:* resolves to whatever version is in the workspace. If the workspace\n` +
  `version advanced past what go.mod requires, pin the dependency version instead.`
);
process.exit(1);
