# Migration Guide: Using @dev/test-utils

This guide explains how to migrate existing packages to use the shared `@dev/test-utils` library.

## Quick Migration Steps

### 1. Update tsconfig.json

Add the `@dev/test-utils` path mapping to your package's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // ... existing paths ...
      "@dev/test-utils": ["../../../libs/dev/test-utils/index.ts"],
      "@dev/test-utils/*": ["../../../libs/dev/test-utils/*"]
    }
  }
}
```

### 2. Replace test/utils/comparison.ts

Replace the entire contents of `test/utils/comparison.ts` with:

```typescript
/**
 * Re-export comparison utilities from shared library
 */

export {
  compareOutputs,
  formatDifferences,
  compareHexColors,
  normalizeHexColorsInJson,
  compareAnsiRgb,
  normalizeAnsiRgbSequences,
} from '@dev/test-utils/comparison';

export { runTestCase, runBothTestCases } from '@dev/test-utils/execution';

export type {
  ComparisonResult,
  ComparisonDifference,
  ComparisonOptions,
} from '@dev/test-utils/types';
```

### 3. Replace test/utils/test-filter.ts

Replace the entire contents of `test/utils/test-filter.ts` with:

```typescript
/**
 * Re-export filtering utilities from shared library
 */

export { getTestFilter, applyFilter, logFilterInfo } from '@dev/test-utils/filtering';
```

### 4. Run Tests

Verify everything works:

```bash
bun test
```

## Migration Order (Recommended)

Migrate packages in this order to minimize complexity:

1. **go-osc52** ✅ (Completed - simplest, basic comparison only)
2. **uniseg** (Simple - basic comparison only)
3. **gamut** (Moderate - hex color tolerance)
4. **termenv** (Moderate - ANSI tolerance)
5. **go-colorful** (Moderate - float tolerance)
6. **lipgloss** (Complex - golden files + tables)

## Package-Specific Notes

### gamut
- Uses hex color tolerance (±1 per RGB channel)
- No additional migration needed beyond basic steps

### termenv
- Uses ANSI RGB tolerance (±1 per channel)
- No additional migration needed beyond basic steps

### lipgloss
- Uses golden file testing
- Uses table comparison utilities
- May need to import additional utilities:

```typescript
import { requireEqual, generateGoldenFromGo } from '@dev/test-utils/golden';
```

### go-colorful
- Uses floating-point tolerance for color calculations
- Tolerance is now centrally configured in `@dev/test-utils/config`

## Configuration

If your tests require specific tolerance settings:

```typescript
import { setToleranceConfig } from '@dev/test-utils/config';

beforeAll(() => {
  setToleranceConfig({
    hexColorTolerance: 1,      // ±1 per RGB channel
    ansiRgbTolerance: 1,       // ±1 per RGB channel in ANSI codes
    floatRelativeTolerance: 0.05,  // 5% relative error
  });
});
```

## Troubleshooting

### Import errors

If you see errors like `Cannot find module '@dev/test-utils'`:

1. Verify path mapping in `tsconfig.json`
2. Check that paths use relative paths: `../../../libs/dev/test-utils/index.ts`
3. Restart your TypeScript language server

### Test failures after migration

1. Check that all imports are correctly updated
2. Verify TypeScript can resolve the paths: `bun run tsc --noEmit`
3. Compare test output before and after migration

## Benefits

- **No code duplication**: Single source of truth for test utilities
- **Consistent behavior**: All packages use identical comparison logic
- **Easy updates**: Bug fixes automatically apply to all packages
- **Better DX**: New packages inherit full test infrastructure
- **Centralized configuration**: Global tolerance settings

## Rollback

If needed, you can rollback by:

1. Restore the original `test/utils/comparison.ts` and `test/utils/test-filter.ts` from git
2. Remove the `@dev/test-utils` path mapping from `tsconfig.json`
3. Run `bun test` to verify
