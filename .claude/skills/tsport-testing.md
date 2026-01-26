---
name: tsport-testing
description: Testing strategies for TSPort packages. Use when adding tests, verifying compatibility, or debugging test failures.
trigger:
  - "test"
  - "compatibility"
  - "golden file"
  - "test case"
  - "verify"
---

# TSPort Testing Strategy

Testing is critical for TSPorts to ensure Go-TypeScript compatibility.

## Test Structure

```
test/
├── reference/              # Go source (cloned from upstream)
├── basic.test.ts          # Basic functionality tests
├── automated-cases.test.ts # Compatibility test framework
├── cases/                 # Test case pairs
│   ├── 001-basic/
│   │   ├── case.go       # Go implementation
│   │   ├── case.ts       # TypeScript implementation
│   │   └── expected.json # Expected output (optional)
├── golden/                # Golden output files
└── utils/                 # Test utilities
    ├── comparison.ts      # Output comparison helpers
    └── test-filter.ts     # Test case filtering
```

## Test Categories

### 1. Unit Tests (basic.test.ts)

Test individual functions/methods:
```typescript
describe('color conversion', () => {
  test('hex to rgb', () => {
    const color = Color.fromHex('#FF0000');
    expect(color?.rgb()).toEqual([255, 0, 0]);
  });

  test('handles invalid input', () => {
    expect(Color.fromHex('invalid')).toBeNull();
  });
});
```

### 2. Compatibility Tests (automated-cases.test.ts)

Compare Go and TypeScript outputs:
```typescript
describe('Go compatibility', () => {
  // Automatically discovers cases in test/cases/
  const cases = discoverTestCases();

  test.each(cases)('$name', async ({ goOutput, tsOutput }) => {
    expect(tsOutput).toEqual(goOutput);
  });
});
```

### 3. Golden File Tests

Compare against saved expected outputs:
```typescript
test('matches golden output', () => {
  const result = complexOperation(input);
  const golden = readGoldenFile('complex-operation.json');
  expect(result).toMatchObject(golden);
});
```

## Creating Test Cases

### Step 1: Identify Go Test

Look in `test/reference/` for Go tests:
```bash
cd test/reference
find . -name "*_test.go" | head -5
```

### Step 2: Create Case Directory

```bash
mkdir -p test/cases/001-color-conversion
cd test/cases/001-color-conversion
```

### Step 3: Write Go Test Case

```go
// case.go
package main

import (
    "encoding/json"
    "fmt"
    "os"

    "github.com/lucasb-eyer/go-colorful"
)

func main() {
    c := colorful.Hex("#FF0000")
    r, g, b := c.RGB255()

    result := map[string]interface{}{
        "r": r,
        "g": g,
        "b": b,
    }

    json.NewEncoder(os.Stdout).Encode(result)
}
```

### Step 4: Write TypeScript Test Case

```typescript
// case.ts
import { Color } from '../../src';

const c = Color.fromHex('#FF0000');
const [r, g, b] = c.rgb255();

console.log(JSON.stringify({ r, g, b }));
```

### Step 5: Compare Outputs

```bash
# Run both and compare
diff <(go run case.go) <(bun run case.ts)

# Should output nothing if identical
```

## Special Test Scenarios

### RNG Determinism

```go
// Go: Use fixed seed for reproducibility
import "math/rand"

func init() {
    rand.Seed(42)
}
```

```typescript
// TypeScript: Port the RNG algorithm
import { PCGRand } from './rng';

const rng = new PCGRand(42n);  // Same seed
const value = rng.next();
```

**Verify with legacy Go RNG:**
```bash
GODEBUG=randautoseed=0 go run case.go
```

### Floating-Point Comparison

```typescript
// Don't use exact equality
expect(result).toBe(0.30000000000000004);  // WRONG

// Use epsilon tolerance
const EPSILON = 1e-10;
expect(Math.abs(result - expected)).toBeLessThan(EPSILON);  // RIGHT

// Or use jest matcher
expect(result).toBeCloseTo(expected, 10);  // 10 decimal places
```

### Integer Boundary Testing

Test near JavaScript numeric limits:
```typescript
describe('integer operations', () => {
  test('near 32-bit boundary', () => {
    expect(op(2147483647)).toBe(expected);   // INT32_MAX
    expect(op(2147483648n)).toBe(expected);  // INT32_MAX + 1 (needs BigInt)
  });

  test('near 53-bit boundary', () => {
    expect(op(9007199254740991)).toBe(expected);  // MAX_SAFE_INTEGER
    expect(op(9007199254740992n)).toBe(expected); // Needs BigInt
  });

  test('bitwise operations', () => {
    expect(1n << 31n).toBe(2147483648n);  // Not -2147483648
  });
});
```

### String Encoding

```typescript
describe('string handling', () => {
  test('byte length vs character length', () => {
    const str = '世界';

    // Go len(str) = 6 (bytes)
    const bytes = new TextEncoder().encode(str);
    expect(bytes.length).toBe(6);

    // JS str.length = 2 (UTF-16 code units)
    expect(str.length).toBe(2);
  });

  test('grapheme clusters', () => {
    const emoji = '👨‍👩‍👧‍👦';  // Family emoji

    // Count graphemes (what users see)
    const segments = new Intl.Segmenter().segment(emoji);
    expect([...segments].length).toBe(1);
  });
});
```

### Error Handling

```typescript
// Don't compare exact error messages
expect(() => parse('')).toThrow('empty string');  // WRONG - messages differ

// Compare error types/conditions
expect(() => parse('')).toThrow();                // RIGHT - just throws
expect(() => parse('')).toThrow(ParseError);      // RIGHT - specific type
```

## Table-Driven Tests

Port Go table-driven tests to TypeScript:

**Go:**
```go
tests := []struct {
    name    string
    input   string
    want    int
    wantErr bool
}{
    {"valid", "42", 42, false},
    {"invalid", "abc", 0, true},
}
for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        got, err := Parse(tt.input)
        if (err != nil) != tt.wantErr {
            t.Errorf("error = %v, wantErr %v", err, tt.wantErr)
        }
    })
}
```

**TypeScript:**
```typescript
const tests = [
  { name: 'valid', input: '42', want: 42, wantErr: false },
  { name: 'invalid', input: 'abc', want: 0, wantErr: true },
];

test.each(tests)('$name', ({ input, want, wantErr }) => {
  if (wantErr) {
    expect(() => parse(input)).toThrow();
  } else {
    expect(parse(input)).toBe(want);
  }
});
```

## Running Tests

```bash
# Run all TypeScript tests
moon run test

# Run specific test file
bun test basic.test.ts

# Run with filter
bun test -t "color conversion"

# Run Go reference tests
cd test/reference
go test ./...

# Run specific Go test
go test -run TestColorConversion -v

# Compare outputs
cd test/cases/001-example
diff <(go run case.go) <(bun run case.ts)
```

## Test Quality Checklist

- [ ] All Go tests have TypeScript equivalents
- [ ] Test cases cover edge cases (nil, empty, zero values)
- [ ] Numeric precision handled correctly
- [ ] String encoding differences accounted for
- [ ] Error conditions tested (not just error messages)
- [ ] Table-driven tests ported correctly
- [ ] Golden files match Go output
- [ ] Tests run in CI/CD pipeline
- [ ] All tests pass: `moon run test`

## Debugging Test Failures

1. **Identify the failing test**:
   ```bash
   moon run test 2>&1 | grep "FAIL"
   ```

2. **Check what Go does**:
   ```bash
   cd test/reference
   go test -run FailingTest -v
   ```

3. **Compare logic**:
   - Read Go test code
   - Read TS test code
   - Identify differences

4. **Add debug output**:
   ```typescript
   console.log('Input:', input);
   console.log('Go output:', goResult);
   console.log('TS output:', tsResult);
   console.log('Diff:', JSON.stringify(diff(goResult, tsResult)));
   ```

5. **Fix and verify**:
   ```bash
   moon run build  # Must pass
   moon run test   # Must pass
   ```

## Performance Testing

For performance-critical ports:
```typescript
import { bench } from 'vitest';

bench('color conversion', () => {
  Color.fromHex('#FF0000').rgb();
});
```

Compare with Go benchmarks:
```bash
cd test/reference
go test -bench . -benchmem
```

## Continuous Integration

Ensure `.github/workflows/ci.yml` runs:
- TypeScript build (`moon run build`)
- TypeScript tests (`moon run test`)
- Go reference tests (`cd test/reference && go test ./...`)
- Compatibility verification
