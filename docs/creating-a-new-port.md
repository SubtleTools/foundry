# Creating a New Port

This guide walks through adding a new TSPort package from scratch.

## Prerequisites

- [Bun](https://bun.sh/) installed
- [Go](https://go.dev/) installed (for building reference tests)
- [Moon](https://moonrepo.dev/) installed (globally or via `bunx`)
- Familiarity with the Go package you're porting

## Step 1: Scaffold from Template

Generate the package skeleton using the Moon template:

```bash
moon generate tsport-package
```

You'll be prompted for:

| Variable | Required | Example |
|----------|----------|---------|
| `goRepo` | Yes | `https://github.com/rivo/uniseg` |
| `packageName` | Yes | `@tsports/uniseg` |
| `description` | No | `Unicode text segmentation` |
| `keywords` | No | `unicode,text,grapheme` |

Or pass them inline:

```bash
moon generate tsport-package -- \
  --goRepo="https://github.com/rivo/uniseg" \
  --packageName="@tsports/uniseg" \
  --description="Unicode text segmentation"
```

This creates the package under `packages/tsports/<name>/` with:

```
packages/tsports/<name>/
├── src/
│   ├── index.ts        # TypeScript API (camelCase)
│   ├── go-style.ts     # Go-compatible API (PascalCase)
│   └── types.ts        # Type definitions
├── test/
│   ├── basic.test.ts   # Starter test file
│   ├── reference/      # Go reference (populated by setup)
│   └── utils/          # Test utilities
├── scripts/
│   └── setup-reference.ts
├── moon.yml            # Moon task definitions
├── package.json        # With portInfo pre-filled
├── tsconfig.json
└── README.md
```

## Step 2: Set Up Go Reference

Run the setup script to clone the Go source as a reference:

```bash
cd packages/tsports/<name>
moon run setup
```

This clones the Go repository into `test/reference/` as a git submodule. The reference code is used to:
- Generate golden test files (expected output from Go)
- Verify the TS port produces identical results
- Serve as a living spec when the Go API is unclear

See `templates/tsport-package/SETUP.md` for detailed setup instructions including patch management.

## Step 3: Port the Code

Follow the **dual API pattern** used by all packages:

### `src/index.ts` — TypeScript-idiomatic API

```typescript
// camelCase, TypeScript conventions
export function parseGraphemes(text: string): string[] { ... }
export function stringWidth(s: string): number { ... }
```

### `src/go-style.ts` — Go-compatible API

```typescript
// PascalCase, mirrors Go function names
import { parseGraphemes, stringWidth } from './index';

export const ParseGraphemes = parseGraphemes;
export const StringWidth = stringWidth;
```

### `src/types.ts` — Shared type definitions

```typescript
export interface GraphemeCluster {
  text: string;
  width: number;
}
```

### Exports in `package.json`

The template pre-configures exports:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./go-style": "./src/go-style.ts",
    "./types": "./src/types.ts",
    "./package.json": "./package.json",
    "./README.md": "./README.md"
  }
}
```

## Step 4: Write Tests

Tests compare TS output against Go reference output. Use the shared test utilities:

### Configure tolerance (if needed)

```typescript
import { setToleranceConfig } from '@dev/test-utils';

beforeAll(() => {
  setToleranceConfig({
    hexColorTolerance: 1,        // For color packages
    floatRelativeTolerance: 0.05, // For math-heavy packages
  });
});
```

### Golden file tests

Compare output against stored golden files generated from Go:

```typescript
import { requireEqual } from '@dev/test-utils/golden';
import { describe, test } from 'bun:test';

describe('myFunction', () => {
  test('basic case', () => {
    const result = myFunction(input);
    requireEqual('basic-case', result);
  });
});
```

### Go comparison tests

Run Go code and compare directly:

```typescript
import { requireEqualToGo } from '@dev/test-utils/golden';

test('matches Go output', () => {
  const tsResult = myFunction(input);
  requireEqualToGo('test-name', tsResult, goSourceCode);
});
```

### Run tests

```bash
moon run test              # Run this package's tests
moon run :test             # Run all packages' tests (from repo root)
bun test                   # Run with bun directly (from package dir)
bun test --grep "pattern"  # Filter specific tests
```

See [Shared Libraries](./shared-libraries.md) for the full `@dev/test-utils` API.

## Step 5: Version and Publish

### Initial version

The template sets the initial version based on the Go source version with TS patch 0. For Go v1.2.3, the npm version will be `1.2.300`.

The `portInfo` field in `package.json` is pre-populated:

```json
{
  "version": "1.2.300",
  "portInfo": {
    "sourceRepo": "https://github.com/example/package",
    "sourceVersion": "v1.2.3",
    "tsportVersion": 0,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

### Bumping versions

```bash
# When Go upstream releases a new version (resets TS patch to 0)
moon run version-bump-go -- 1.3.0

# When you fix a TS-only bug (increments TS patch)
moon run version-bump-tsport
```

See [Versioning](./versioning.md) for full details on how the encoding scheme works.

## Checklist

Before considering a port complete:

- [ ] `src/index.ts` exports the full public API (camelCase)
- [ ] `src/go-style.ts` re-exports with Go names (PascalCase)
- [ ] `src/types.ts` defines all public types
- [ ] `package.json` has correct `exports`, `portInfo`, and dependencies
- [ ] Tests cover core functionality with golden file comparisons
- [ ] `moon run test` passes
- [ ] `moon run lint` passes
- [ ] `moon run build` succeeds
- [ ] README documents the package with usage examples

## Further Reading

- `templates/tsport-package/README.md` — template documentation and variables
- `templates/tsport-package/SETUP.md` — detailed Go reference setup, patch management, and test architecture
- [Project Overview](./project-overview.md) — monorepo structure and conventions
- [Shared Libraries](./shared-libraries.md) — `@dev/test-utils` and `@dev/versioning` APIs
