/**
 * Port metadata stored in package.json under the `portInfo` key.
 */
export interface PortInfo {
  sourceRepo: string;
  sourceVersion: string;
  tsportVersion: number;
  lastUpdated: string;
}

/**
 * Decomposed npm version into Go + TS patch components.
 *
 * The npm version is computed as:
 *   `{goMajor}.{goMinor}.{(goPatch * 100) + tsPatch}`
 *
 * This is fully reversible:
 *   `goPatch  = Math.floor(npmPatch / 100)`
 *   `tsPatch  = npmPatch % 100`
 */
export interface VersionInfo {
  goMajor: number;
  goMinor: number;
  goPatch: number;
  tsPatch: number;
}
