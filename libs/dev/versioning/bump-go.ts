import { readFileSync, writeFileSync } from 'node:fs';
import { formatNpmVersion, formatPortInfo } from './format';

/**
 * Update a package to track a new Go upstream version.
 * Resets tsPatch to 0 and writes the new npm version + portInfo.
 *
 * @param packageJsonPath  Absolute path to package.json
 * @param goVersion        New Go version, e.g. "1.3.0" (leading "v" is stripped)
 */
export function bumpGoVersion(packageJsonPath: string, goVersion: string): void {
  const stripped = goVersion.replace(/^v/, '');

  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(stripped)) {
    throw new Error(`Go version must be in format X.Y.Z (e.g., 1.2.3), got "${goVersion}"`);
  }

  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const oldVersion = pkg.version;
  const newVersion = formatNpmVersion(stripped, 0);

  pkg.version = newVersion;
  pkg.goSourceVersion = `v${stripped}`;
  pkg.portInfo = formatPortInfo(pkg.portInfo?.sourceRepo ?? '', stripped, 0);

  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);

  console.log(`Updated version: ${oldVersion} → ${newVersion}`);
  console.log(`Go source version: v${stripped}`);
  console.log(`TSPort patch: 0 (reset)`);
}
