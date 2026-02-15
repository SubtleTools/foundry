# Versioning

TSPorts uses a custom version encoding that packs both the **Go upstream version** and a **TypeScript-specific patch number** into a single npm-compatible semver string.

## Why Not Standard Semver?

Standard semver prerelease tags (e.g., `1.2.3-tsport.5`) break npm range resolution — `^1.2.3` won't match `1.2.3-tsport.5`. We need versions that:

1. Are valid semver so npm/bun can resolve ranges normally
2. Preserve the Go upstream version so you know exactly which Go release a port tracks
3. Allow independent TS-side bug fixes without implying a new Go release

## The Encoding Scheme

```
npm version = {GoMajor}.{GoMinor}.{(GoPatch * 100) + tsPatch}
```

The npm patch component encodes two numbers:
- **Go patch**: `Math.floor(npmPatch / 100)`
- **TS patch**: `npmPatch % 100`

This gives up to **100 TS-specific patches** (0–99) per Go patch version.

### Decode Table

| Go Version | TS Patch | npm Version | How to decode |
|------------|----------|-------------|---------------|
| 1.2.0 | 0 | `1.2.0` | 0 / 100 = 0, 0 % 100 = 0 |
| 1.2.0 | 3 | `1.2.3` | 3 / 100 = 0, 3 % 100 = 3 |
| 1.2.3 | 0 | `1.2.300` | 300 / 100 = 3, 300 % 100 = 0 |
| 1.2.3 | 5 | `1.2.305` | 305 / 100 = 3, 305 % 100 = 5 |
| 0.4.7 | 1 | `0.4.701` | 701 / 100 = 7, 701 % 100 = 1 |
| 2.0.14 | 0 | `2.0.1400` | 1400 / 100 = 14, 1400 % 100 = 0 |

## `portInfo` in package.json

Every package stores its source tracking metadata:

```json
{
  "version": "1.2.305",
  "portInfo": {
    "sourceRepo": "https://github.com/lucasb-eyer/go-colorful",
    "sourceVersion": "v1.2.3",
    "tsportVersion": 5,
    "lastUpdated": "2024-08-26T15:30:00.000Z"
  }
}
```

| Field | Description |
|-------|-------------|
| `sourceRepo` | URL of the Go repository being ported |
| `sourceVersion` | Exact Go version tag (with `v` prefix) |
| `tsportVersion` | TS patch number (0–99), also encoded in the npm version |
| `lastUpdated` | ISO timestamp of last version bump |

## Bumping Versions

### When upstream Go releases a new version

Use the `version-bump-go` moon task. This resets the TS patch to 0:

```bash
# From the package directory
moon run version-bump-go -- 1.3.0

# Or via bun directly
bun run ../../../libs/dev/versioning/cli-bump-go.ts 1.3.0
```

**What it does:**
1. Reads `package.json`
2. Computes new npm version: `formatNpmVersion("1.3.0", 0)` → `"1.3.0"`
3. Updates `version`, `portInfo.sourceVersion`, `portInfo.tsportVersion` (reset to 0), and `portInfo.lastUpdated`
4. Writes `package.json`

### When you fix a TS-only bug

Use the `version-bump-tsport` moon task. This increments the TS patch by 1:

```bash
moon run version-bump-tsport
```

**What it does:**
1. Reads current version and decodes it (e.g., `1.2.300` → Go 1.2.3, TS patch 0)
2. Increments TS patch (0 → 1)
3. Encodes new version (`1.2.301`)
4. Updates `version`, `portInfo.tsportVersion`, and `portInfo.lastUpdated`
5. Errors if TS patch would exceed 99

## Inter-Package Dependencies

Packages depend on each other using workspace ranges:

```json
{
  "dependencies": {
    "@tsports/go-colorful": "^1.2.0"
  }
}
```

Because the encoding produces valid semver, `^1.2.0` correctly matches `1.2.0`, `1.2.1` (TS patch 1), `1.2.300` (Go 1.2.3), etc. Standard npm/bun range resolution works as expected.

## Source Code

The versioning library lives at `libs/dev/versioning/` and exports:

| Export | Description |
|--------|-------------|
| `parseNpmVersion(version)` | Decode npm version → `VersionInfo` |
| `parsePortInfo(pkg)` | Extract `VersionInfo` from a package.json object |
| `formatNpmVersion(goVersion, tsPatch)` | Encode Go version + TS patch → npm version |
| `formatPortInfo(repo, goVersion, tsPatch)` | Build a complete `PortInfo` object |
| `bumpGoVersion(path, goVersion)` | Update package.json for a new Go release |
| `bumpTsportVersion(path)` | Increment TS patch in package.json |

## Branch and Tag Strategy

When porting a new upstream Go version:

- **Feature branch**: `<package>/v<version>` (e.g., `go-colorful/v1.3.0`). Work on this branch, merge to main when the port is complete.
- **Release tag**: `@tsports/<package>@<npm-version>` (e.g., `@tsports/go-colorful@1.3.0`). Tag on main after merging.

This keeps main stable while upstream version ports are in progress. Use `bun run scripts/port-version.ts` to automate branch creation and scaffolding — see [Creating a New Port](./creating-a-new-port.md#porting-a-new-upstream-version).

See also: [Shared Libraries](./shared-libraries.md) for how `@dev/versioning` is consumed.
