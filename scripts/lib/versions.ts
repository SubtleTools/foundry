/**
 * Shared version comparison and git tag utilities.
 * Extracted from check-upstream-versions.ts for reuse.
 */

import { execSync } from "child_process";

export function stripV(version: string): string {
  return version.startsWith("v") ? version.slice(1) : version;
}

export function compareVersions(a: string, b: string): number {
  const aParts = stripV(a).split(".").map(Number);
  const bParts = stripV(b).split(".").map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;
    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }
  return 0;
}

export function isNewer(version: string, base: string): boolean {
  return compareVersions(version, base) > 0;
}

export async function getGitTags(gitDir: string): Promise<string[]> {
  try {
    const output = execSync("git tag --sort=-v:refname", {
      cwd: gitDir,
      encoding: "utf-8",
    });
    return output
      .trim()
      .split("\n")
      .filter((tag) => tag && !tag.includes("async_worker"));
  } catch {
    return [];
  }
}

export async function getCurrentVersion(gitDir: string): Promise<string | null> {
  try {
    const output = execSync(
      "git describe --tags --exact-match 2>/dev/null || git describe --tags 2>/dev/null",
      {
        cwd: gitDir,
        encoding: "utf-8",
      }
    );
    return output.trim();
  } catch {
    return null;
  }
}
