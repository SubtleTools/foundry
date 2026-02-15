import type { PortInfo, VersionInfo } from "./types";

/**
 * Encode a Go version + TS patch into an npm-compatible version string.
 *
 * @param goVersion  Go semver string, e.g. "1.2.3" (no leading "v")
 * @param tsPatch    TypeScript-specific patch number (0–99)
 *
 * @example
 *   formatNpmVersion("1.2.3", 5) // "1.2.305"
 *   formatNpmVersion("1.2.0", 0) // "1.2.0"
 *   formatNpmVersion("2.0.14", 0) // "2.0.1400"
 */
export function formatNpmVersion(goVersion: string, tsPatch: number): string {
  const match = goVersion.replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(
      `Invalid Go version "${goVersion}". Expected format: X.Y.Z`,
    );
  }

  if (tsPatch < 0 || tsPatch > 99) {
    throw new Error(`tsPatch must be 0–99, got ${tsPatch}`);
  }

  const major = match[1];
  const minor = match[2];
  const goPatch = Number(match[3]);
  const npmPatch = goPatch * 100 + tsPatch;

  return `${major}.${minor}.${npmPatch}`;
}

/**
 * Build a complete PortInfo object.
 */
export function formatPortInfo(
  sourceRepo: string,
  goVersion: string,
  tsPatch: number,
): PortInfo {
  const stripped = goVersion.replace(/^v/, "");
  return {
    sourceRepo,
    sourceVersion: `v${stripped}`,
    tsportVersion: tsPatch,
    lastUpdated: new Date().toISOString(),
  };
}
