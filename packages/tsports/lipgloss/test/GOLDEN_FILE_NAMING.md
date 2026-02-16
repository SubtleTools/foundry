# Golden File Naming Convention

## Overview

Golden files in the TSPort test system now use semantic naming that clearly indicates which color profile each file represents. This makes debugging and maintenance significantly easier.

## Naming Scheme

Golden files use the following format:

```
{category}_{testId}_{profile}.golden
```

Where `{profile}` is one of:

- **`ascii`** - Ascii profile (NO_COLOR=1, no color output)
- **`ansi`** - ANSI profile (16 colors, FORCE_COLOR=0)
- **`ansi256`** - ANSI256 profile (256 colors, FORCE_COLOR=1 or FORCE_COLOR=2)
- **`truecolor`** - TrueColor profile (24-bit RGB, FORCE_COLOR=3)

## Examples

```
basic_001-basic-render_ascii.golden
basic_001-basic-render_ansi.golden
basic_001-basic-render_ansi256.golden
basic_001-basic-render_truecolor.golden

border_301-border-normal_ascii.golden
border_301-border-normal_truecolor.golden

color_2001-color-red_ascii.golden
color_2001-color-red_truecolor.golden
```

## Color Profile Mapping

The naming directly maps to the termenv color profiles:

| Profile Name | termenv Enum | Environment | Color Depth | Description |
|--------------|--------------|-------------|-------------|-------------|
| `ascii` | `Profile.Ascii` (3) | `NO_COLOR=1` | No color | Plain text output |
| `ansi` | `Profile.ANSI` (2) | `FORCE_COLOR=0` | 16 colors | Basic terminal colors (0-15) |
| `ansi256` | `Profile.ANSI256` (1) | `FORCE_COLOR=1` or `FORCE_COLOR=2` | 256 colors | Extended color palette (0-255) |
| `truecolor` | `Profile.TrueColor` (0) | `FORCE_COLOR=3` | 16.7M colors | 24-bit RGB colors |

## Benefits

### 1. **Clarity**
No more guessing which color mode `{test}_color.golden` represents. Is it ANSI, ANSI256, or TrueColor? Now it's explicit.

### 2. **Debugging**
When a test fails, you immediately know which color profile is causing issues:
```
✗ Golden file test failed for basic_001-basic-render (truecolor)
```

### 3. **Completeness**
Easy to see at a glance which color profiles have golden files:
```bash
$ ls testdata/ | grep basic_001
basic_001-basic-render_ascii.golden
basic_001-basic-render_truecolor.golden
# Missing: ansi and ansi256 - we should add these!
```

### 4. **Maintainability**
When updating golden files, the naming makes it clear which environment to use:
- Need to update TrueColor golden? Use `FORCE_COLOR=3`
- Need to update Ascii golden? Use `NO_COLOR=1`

## Migration from Old Naming

Golden files using the old naming scheme have been migrated:

- `{test}_no_color.golden` → `{test}_ascii.golden`
- `{test}_color.golden` → `{test}_truecolor.golden`

The migration was performed automatically using `/work/tsports/packages/tsports/lipgloss/test/migrate-golden-files.ts`.

## Implementation Details

### Golden File Utilities

The `test/utils/golden.ts` module provides functions for working with the new naming scheme:

- **`getColorProfileSuffix(env)`** - Determines profile suffix from environment variables
- **`requireEqualWithProfile(path, actual, name, env)`** - Compares output against profile-specific golden file
- **`generateGoldenFromGoWithProfile(path, goPath, name, env)`** - Generates golden file from Go reference with specific profile
- **`generateGoldenFromGoReferenceWithProfile(path, code, name, env)`** - Generates golden file from inline Go code with specific profile

### Test Runner Integration

The automated test runner (`automated-cases.test.ts`) uses the new naming:

```typescript
test('should match Go output exactly (Ascii - NO_COLOR)', async () => {
  const env = { FORCE_COLOR: '0', NO_COLOR: '1' };
  const tsOutput = runTestCase(testCase.path, false, env);

  requireEqualWithProfile(
    __filename,
    tsOutput,
    `${testCase.category}_${testCase.id}`,
    env  // Profile determined from env
  );
});

test('should match Go output exactly (TrueColor - FORCE_COLOR=3)', async () => {
  const env = { FORCE_COLOR: '3' };
  const tsOutput = runTestCase(testCase.path, false, env);

  requireEqualWithProfile(
    __filename,
    tsOutput,
    `${testCase.category}_${testCase.id}`,
    env  // Profile determined from env
  );
});
```

## Best Practices

### 1. **Generate Golden Files for All Profiles**

When creating new test cases, generate golden files for all relevant color profiles:

```bash
# Generate Ascii golden
NO_COLOR=1 bun run test:golden:generate

# Generate TrueColor golden
FORCE_COLOR=3 bun run test:golden:generate

# Generate ANSI256 golden (if needed)
FORCE_COLOR=1 bun run test:golden:generate

# Generate ANSI golden (if needed)
FORCE_COLOR=0 bun run test:golden:generate
```

### 2. **Test All Profiles**

Ensure your TypeScript implementation works correctly across all color profiles:

```typescript
const profiles = [
  { name: 'Ascii', env: { NO_COLOR: '1', FORCE_COLOR: '0' } },
  { name: 'ANSI', env: { FORCE_COLOR: '0' } },
  { name: 'ANSI256', env: { FORCE_COLOR: '1' } },
  { name: 'TrueColor', env: { FORCE_COLOR: '3' } },
];

for (const profile of profiles) {
  test(`should work with ${profile.name}`, async () => {
    const output = runTestCase(testCase.path, false, profile.env);
    requireEqualWithProfile(__filename, output, testName, profile.env);
  });
}
```

### 3. **Document Profile-Specific Behavior**

If your test case behaves differently across color profiles, document why:

```typescript
// Note: ANSI profile converts RGB colors to nearest 16-color equivalent
// This causes slight visual differences but is expected behavior
test('should match Go output (ANSI - approximate colors)', async () => {
  // ...
});
```

## Troubleshooting

### Golden File Mismatch

If a test fails with a golden file mismatch:

1. Check which profile failed (it's in the error message)
2. Verify the environment variables match the profile
3. Regenerate the golden file if the Go reference changed
4. Compare the diff to understand if it's a real issue or expected difference

### Missing Golden Files

If you see "Golden file not found" errors:

1. Check if the golden file exists for that profile:
   ```bash
   ls testdata/ | grep testname_ascii
   ls testdata/ | grep testname_truecolor
   ```

2. Generate the missing golden file:
   ```bash
   # For Ascii
   NO_COLOR=1 bun run test:golden:generate

   # For TrueColor
   FORCE_COLOR=3 bun run test:golden:generate
   ```

### Legacy Golden Files

If you find files with the old naming scheme:

1. Run the migration script:
   ```bash
   bun run test/migrate-golden-files.ts --apply
   ```

2. Review any files flagged as "legacy" that couldn't be auto-migrated

## Future Improvements

### Potential Enhancements

1. **Automatic Golden File Generation** - Generate all profile variants automatically
2. **Profile Coverage Report** - Show which tests have golden files for which profiles
3. **Diff Viewer** - Better visualization of profile-specific differences
4. **Snapshot Testing** - Integration with snapshot testing frameworks

## References

- [termenv Profile documentation](https://github.com/muesli/termenv)
- [TSPort Test Architecture](./README.md)
- [Color Profile Implementation](../src/color.ts)
- [Golden File Utilities](./utils/golden.ts)
