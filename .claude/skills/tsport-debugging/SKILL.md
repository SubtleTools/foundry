---
name: tsport-debugging
description: Debug and fix issues in TSPort packages. Use when tests fail, types don't match, or behavior differs from Go.
trigger:
  - "fix"
  - "test fail"
  - "error"
  - "doesn't work"
  - "not matching"
  - "compatibility"
---

# TSPort Debugging & Fixing

When fixing issues in a TSPort package, follow this systematic approach.

## The Golden Rule

**ALWAYS check what the Go reference does first.** The Go implementation in `upstream/<pkg>/` is the source of truth.

## Common Issue Categories

### 1. Test Failures

**Workflow:**
1. **Read the failing test** - Understand what it's testing
2. **Check Go reference** - Look at `upstream/<pkg>/` for the equivalent Go test
3. **Compare test logic** - Ensure TS test matches Go test structure
4. **Compare outputs** - Run both and diff JSON outputs
5. **Fix discrepancy** - Update TS to match Go behavior

**Common Causes:**
- Test case doesn't match Go test logic
- Missing edge case handling
- Wrong type mapping
- RNG determinism issue
- Floating-point precision difference
- String encoding mismatch (UTF-8 vs UTF-16)

**Example Debug Flow:**
```bash
# Run TS test
moon run test

# Run Go reference test
cd upstream/<pkg>
go test -v ./...

# For specific test case comparison
cd test/cases/001-example
diff <(go run case.go) <(bun run case.ts)
```

### 2. Type Errors

**Common Type Issues:**
- 64-bit integers need `bigint`, not `number`
- Pointer types should be `T | null`
- Slices are `T[]`, not `Array<T>` (same thing, but Go convention)
- Maps with non-string keys need `Map<K, V>`, not `Record`

**Fix Pattern:**
```typescript
// WRONG: overflow
const x = 1 << 31;  // -2147483648

// RIGHT: BigInt
const x = 1n << 31n;  // 2147483648n

// WRONG: nullable not handled
function process(data: Data) { }

// RIGHT: null safety
function process(data: Data | null) { }
```

### 3. Behavior Differences

**Investigation Steps:**
1. Add debug logging to both Go and TS implementations
2. Compare outputs for same inputs
3. Check if Go uses special libraries/algorithms
4. Verify numeric precision matches

**Common Deviations:**
- **RNG**: If random, check if Go uses seeded RNG (port the algorithm)
- **Strings**: Go len() counts bytes, JS length counts UTF-16 code units
- **Time**: Time zones, precision differences
- **Errors**: Don't compare error messages, compare error conditions

### 4. Missing Examples or Golden File Tests

**When asked to "add examples and golden file tests":**

1. **Find Go examples** in `upstream/<pkg>/`:
   ```bash
   # Look for example functions
   grep -r "func Example" upstream/<pkg>/

   # Look for test data
   find upstream/<pkg>/ -name "testdata" -o -name "golden"
   ```

2. **Create TS examples** in `examples/` directory:
   ```typescript
   // examples/basic-usage.ts
   import { someFunction } from '../src';

   const result = someFunction('input');
   console.log(result);
   ```

3. **Add golden file tests**:
   - Copy expected outputs from Go testdata
   - Create `test/golden/` directory
   - Add test cases that compare against golden files:
   ```typescript
   test('matches golden output', () => {
     const result = someFunction(input);
     const golden = JSON.parse(readFileSync('test/golden/output.json', 'utf-8'));
     expect(result).toEqual(golden);
   });
   ```

4. **Verify golden files match Go**:
   ```bash
   # Generate Go golden output
   cd upstream/<pkg> && go test -update

   # Compare with TS output
   diff test/golden/go-output.json test/golden/ts-output.json
   ```

### 5. Adopting Dependencies

**When asked to "adopt package X in port Y":**

1. **Find Go import usage** in `upstream/<pkg>/`:
   ```bash
   cd packages/tsports/Y/upstream/<pkg>
   grep -r "github.com/.*/X" .
   ```

2. **Identify usage patterns**:
   - Which functions/types from X are used?
   - How are they used?
   - Are there any X-specific idioms?

3. **Update TypeScript imports**:
   ```typescript
   // BEFORE
   import { OldType } from './old-implementation';

   // AFTER
   import { NewType } from '@tsports/X';
   ```

4. **Verify compatibility**:
   - Check that `@tsports/X` exports match Go package X
   - Ensure function signatures are equivalent
   - Test with existing test suite

5. **Update package.json**:
   ```bash
   bun add @tsports/X
   ```

6. **Run tests**:
   ```bash
   moon run build  # Must pass
   moon run test   # Must pass
   ```

### 6. Floating-Point Precision Issues

**Problem**: Tests fail due to tiny numeric differences

**Solution**: Use epsilon comparison
```typescript
const EPSILON = 1e-10;

function floatEquals(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}

// In tests
expect(floatEquals(result, expected)).toBe(true);
```

**Check if Go uses similar tolerance**:
```bash
cd upstream/<pkg>
grep -r "epsilon\|tolerance\|AlmostEqual" .
```

### 7. Unicode/String Issues

**Problem**: String length or character handling differs

**Diagnosis**:
```typescript
const str = "世界👋";

// Go len()
const bytes = new TextEncoder().encode(str).length;  // byte count

// JS length
const codeUnits = str.length;  // UTF-16 code units

// Grapheme clusters (what users see)
const graphemes = [...new Intl.Segmenter().segment(str)].length;
```

**Fix**: Use appropriate measurement based on Go's intent
- Byte operations → `TextEncoder`
- Rune count → Use grapheme segmentation
- String iteration → Use iterators or segmentation

## Debugging Checklist

When fixing any issue:
- [ ] Read Go reference implementation
- [ ] Understand what Go does for this case
- [ ] Check if TS implementation matches Go logic
- [ ] Verify type mappings are correct
- [ ] Check for special cases (nil, empty, zero values)
- [ ] Run both Go and TS tests
- [ ] Compare outputs (use JSON diff)
- [ ] Update compatibility_report.md if needed
- [ ] Ensure `moon run build` passes
- [ ] Commit with descriptive message

## Quick Commands

```bash
# See what Go reference does
cd packages/tsports/<package>/upstream/<pkg>
go doc -all ./...

# Run specific Go test
go test -run TestSpecificCase -v

# Run specific TS test
bun test -t "specific case"

# Compare outputs
diff <(cd upstream/<pkg> && go run case.go) <(bun run test/case.ts)

# Check for algorithm details
grep -r "algorithm\|implementation\|formula" upstream/<pkg>/
```

## When to Document Deviations

Some differences are acceptable - document them in `compatibility_report.md`:
- Performance optimizations that change internal structure
- Use of TypeScript-native APIs (e.g., `Map` instead of object)
- Error message wording (logic must match, wording can differ)
- Internal implementation details (if public API matches)

**Never acceptable without documentation:**
- Different public API behavior
- Different return values for same inputs
- Missing functionality
- Type safety regressions
