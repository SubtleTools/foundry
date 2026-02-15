# Shared Libraries

Internal libraries live under `libs/dev/` and are consumed via TypeScript path mappings — they are **not published to npm** and have no `package.json`.

## How `@dev/*` Libraries Work

These are raw TypeScript files resolved at compile time through `tsconfig.json` path aliases. The root `tsconfig.options.json` defines:

```json
{
  "paths": {
    "@dev/test-utils": ["./libs/dev/test-utils/index.ts"],
    "@dev/test-utils/*": ["./libs/dev/test-utils/*"],
    "@dev/versioning": ["./libs/dev/versioning/index.ts"],
    "@dev/versioning/*": ["./libs/dev/versioning/*"]
  }
}
```

Each package's `tsconfig.json` extends the root config, so these paths are available everywhere. Bun resolves the same paths at runtime.

**Key points:**
- No build step — consumers import raw `.ts` files
- No `package.json` — these aren't npm packages
- No version numbers — they're internal, pinned to the monorepo
- Add new libs by creating a directory under `libs/dev/` and adding path mappings to `tsconfig.options.json`

## `@dev/test-utils`

Shared test utilities for all TSPorts packages. Provides comparison helpers, golden file testing, test filtering, and test execution runners.

### Module Structure

```
libs/dev/test-utils/
├── index.ts                  # Main exports
├── config.ts                 # Global tolerance configuration
├── types.ts                  # Shared TypeScript interfaces
├── comparison/
│   ├── base.ts               # Core output comparison with diff reporting
│   ├── colors.ts             # Hex color tolerance (±N per RGB channel)
│   ├── ansi.ts               # ANSI escape sequence comparison
│   └── index.ts
├── filtering/
│   ├── test-filter.ts        # CLI/env-based test case filtering
│   └── index.ts
├── execution/
│   ├── runner.ts             # Test case runner with env management
│   └── index.ts
└── golden/
    ├── golden.ts             # Golden file assertions (requireEqual, etc.)
    ├── setup.ts              # Test discovery and setup helpers
    ├── update.ts             # Golden file generation/update utilities
    └── index.ts
```

### Usage

Import from the top-level module or specific subpaths:

```typescript
// Top-level import
import { compareOutputs, requireEqual, getTestFilter } from '@dev/test-utils';

// Subpath imports (for tree-shaking or clarity)
import { compareOutputs } from '@dev/test-utils/comparison';
import { requireEqual, requireEqualToGo } from '@dev/test-utils/golden';
import { getTestFilter, applyFilter } from '@dev/test-utils/filtering';
import { runTestCase } from '@dev/test-utils/execution';
```

### Tolerance Configuration

Configure comparison tolerance globally per test suite:

```typescript
import { setToleranceConfig } from '@dev/test-utils';

beforeAll(() => {
  setToleranceConfig({
    hexColorTolerance: 1,      // ±1 per RGB channel for hex color strings
    ansiRgbTolerance: 1,       // ±1 per channel for ANSI RGB sequences
    floatRelativeTolerance: 0.05, // 5% relative tolerance for floats
  });
});
```

### Golden File Testing

Compare TypeScript output against Go reference output:

```typescript
import { requireEqual, requireEqualToGo } from '@dev/test-utils/golden';

// Compare against a stored golden file
requireEqual("test-name", actualOutput, { profile: "truecolor" });

// Generate golden from Go and compare
requireEqualToGo("test-name", actualOutput, goCode);
```

### Key Exports

| Category | Exports | Purpose |
|----------|---------|---------|
| Comparison | `compareOutputs`, `formatDifferences` | Core output diffing |
| Colors | `compareHexColors`, `normalizeHexColorsInJson` | Hex color tolerance |
| ANSI | `compareAnsiRgb`, `normalizeAnsiRgbSequences` | ANSI sequence tolerance |
| Filtering | `getTestFilter`, `applyFilter`, `logFilterInfo` | CLI/env test filtering |
| Execution | `runTestCase`, `runBothTestCases` | Test case runner |
| Golden | `requireEqual`, `requireEqualToGo`, `generateGoldenFromGo` | Golden file assertions |
| Setup | `setupGoldenFiles`, `findTestCases`, `defaultShouldSkip` | Test discovery |
| Update | `updateGoldenFiles`, `cleanGoldenFiles` | Golden file management |

## `@dev/versioning`

Version encoding/decoding library and CLI scripts for bumping package versions. See [versioning.md](./versioning.md) for the full scheme documentation.

### Module Structure

```
libs/dev/versioning/
├── index.ts              # Main exports
├── types.ts              # PortInfo, VersionInfo interfaces
├── parse.ts              # parseNpmVersion, parsePortInfo
├── format.ts             # formatNpmVersion, formatPortInfo
├── bump-go.ts            # bumpGoVersion (resets TS patch to 0)
├── bump-tsport.ts        # bumpTsportVersion (increments TS patch)
├── cli-bump-go.ts        # CLI entry point for moon task
└── cli-bump-tsport.ts    # CLI entry point for moon task
```

### Usage

```typescript
import { parseNpmVersion, formatNpmVersion } from '@dev/versioning';

const info = parseNpmVersion("1.2.305");
// { goMajor: 1, goMinor: 2, goPatch: 3, tsPatch: 5 }

const version = formatNpmVersion("1.2.3", 5);
// "1.2.305"
```

The CLI scripts (`cli-bump-go.ts`, `cli-bump-tsport.ts`) are invoked by moon tasks defined in each package's `moon.yml`:

```yaml
tasks:
  version-bump-go:
    command: "bun"
    args: ["run", "../../../libs/dev/versioning/cli-bump-go.ts"]
  version-bump-tsport:
    command: "bun"
    args: ["run", "../../../libs/dev/versioning/cli-bump-tsport.ts"]
```

## Adding a New Shared Library

1. Create a directory: `libs/dev/your-lib/`
2. Add an `index.ts` with your exports
3. Add path mappings to `tsconfig.options.json`:

```json
{
  "paths": {
    "@dev/your-lib": ["./libs/dev/your-lib/index.ts"],
    "@dev/your-lib/*": ["./libs/dev/your-lib/*"]
  }
}
```

4. Import from any package: `import { something } from '@dev/your-lib'`

No `package.json`, no build step, no version — just TypeScript files and path aliases.
