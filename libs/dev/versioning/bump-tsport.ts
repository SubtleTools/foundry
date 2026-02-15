import { readFileSync, writeFileSync } from "fs";
import { formatNpmVersion } from "./format";
import { parseNpmVersion } from "./parse";

/**
 * Increment the TS-specific patch number for a package.
 * Reads the current version, bumps tsPatch by 1, and writes back.
 *
 * @param packageJsonPath  Absolute path to package.json
 */
export function bumpTsportVersion(packageJsonPath: string): void {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const oldVersion = pkg.version;

  const info = parseNpmVersion(oldVersion);
  const newTsPatch = info.tsPatch + 1;

  if (newTsPatch > 99) {
    throw new Error(
      `tsPatch would exceed 99 (current: ${info.tsPatch}). ` +
        `Consider bumping the Go version instead.`,
    );
  }

  const goVersion = `${info.goMajor}.${info.goMinor}.${info.goPatch}`;
  const newVersion = formatNpmVersion(goVersion, newTsPatch);

  pkg.version = newVersion;
  pkg.portInfo = {
    ...pkg.portInfo,
    tsportVersion: newTsPatch,
    lastUpdated: new Date().toISOString(),
  };

  writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");

  console.log(`TSPort version bumped: ${oldVersion} → ${newVersion}`);
  console.log(
    `Go source version: ${pkg.goSourceVersion ?? `v${goVersion}`} (unchanged)`,
  );
  console.log(`TSPort patch: ${newTsPatch}`);
}
