import type { PortInfo, VersionInfo } from "./types";

/**
 * Decode an npm version string into Go + TS patch components.
 *
 * @example
 *   parseNpmVersion("1.2.305") // { goMajor: 1, goMinor: 2, goPatch: 3, tsPatch: 5 }
 *   parseNpmVersion("2.0.1400") // { goMajor: 2, goMinor: 0, goPatch: 14, tsPatch: 0 }
 */
export function parseNpmVersion(version: string): VersionInfo {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(
      `Invalid npm version "${version}". Expected format: X.Y.Z`,
    );
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const npmPatch = Number(match[3]);

  return {
    goMajor: major,
    goMinor: minor,
    goPatch: Math.floor(npmPatch / 100),
    tsPatch: npmPatch % 100,
  };
}

/**
 * Extract a VersionInfo from a package.json object (reads `version` + `portInfo`).
 */
export function parsePortInfo(pkg: {
  version: string;
  portInfo?: PortInfo;
}): VersionInfo {
  return parseNpmVersion(pkg.version);
}
