# Add Compatibility Tests

Create comprehensive compatibility tests that verify the TypeScript port produces identical results to the Go original.

**Arguments:** `$ARGUMENTS`
- `PACKAGE_PATH` - Path to the TSPort package (e.g., `packages/tsports/go-colorful`)

## Workflow

### Step 1: Analyze Go Test Patterns

Review Go tests in `test/reference/` to identify:

**Go Testing Conventions:**
| Go Pattern | Description | TypeScript Equivalent |
|------------|-------------|----------------------|
| `*_test.go` | Test files | `*.test.ts` |
| `func TestXxx(t *testing.T)` | Test function | `test('xxx', () => {})` or `it()` |
| `func BenchmarkXxx(b *testing.B)` | Benchmark | `bench()` in Vitest/Bun |
| `func ExampleXxx()` | Runnable doc example | JSDoc `@example` + test |
| `t.Run("subtest", ...)` | Subtests | `describe()` + `test()` |
| `t.Parallel()` | Parallel execution | `test.concurrent()` |
| `t.Helper()` | Mark as helper | N/A (stack traces differ) |
| `t.Skip()` | Skip test | `test.skip()` |
| `t.Fatal()` / `t.Error()` | Assertion failure | `expect().toBe()` / `throw` |
| `testdata/` directory | Test fixtures | `test/fixtures/` |
| `golden` files | Expected output | Snapshot testing or `expected.json` |

**Common Go Test Patterns to Port:**
```go
// Table-driven tests
func TestParse(t *testing.T) {
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
            if got != tt.want {
                t.Errorf("got %v, want %v", got, tt.want)
            }
        })
    }
}
```
```typescript
// TypeScript table-driven equivalent
describe('parse', () => {
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
});
```

### Step 2: Set Up Test Infrastructure

The Moon template provides:
- `test/basic.test.ts` - Basic test template
- `test/automated-cases.test.ts` - Full compatibility testing framework
- `test/reference/` - Cloned Go source for reference

### Step 3: Create Test Cases

Create test cases in `test/cases/` directory:

```
test/cases/001-basic-functionality/
├── case.go          # Go test implementation
├── case.ts          # TypeScript test implementation
└── expected.json    # Expected outputs (optional)
```

Each test case should:
1. Execute the same operation in both Go and TypeScript
2. Compare outputs for exact compatibility
3. Document any expected differences with justification

**Go Test Case Template:**
```go
// case.go
package main

import (
    "encoding/json"
    "fmt"
    "os"

    "github.com/original/package"
)

func main() {
    result := package.SomeFunction("input")

    // Output JSON for comparison
    output, _ := json.Marshal(map[string]interface{}{
        "result": result,
    })
    fmt.Println(string(output))
}
```

**TypeScript Test Case Template:**
```typescript
// case.ts
import { someFunction } from '../../src';

const result = someFunction('input');

console.log(JSON.stringify({ result }));
```

### Step 4: Handle Go-Specific Test Scenarios

**A. Deterministic RNG Testing:**
```go
// Go uses different RNG in 1.20+
// For deterministic comparison, use legacy seeding:
import "math/rand"

func init() {
    rand.Seed(42)  // Fixed seed for reproducibility
}
```
```bash
# Run Go tests with legacy deterministic behavior
GODEBUG=randautoseed=0 go run case.go
```
```typescript
// TypeScript: Port the exact RNG algorithm, don't use Math.random()
import { PCGRand } from './rng';

const rng = new PCGRand(42n);  // Same seed
const value = rng.next();
```

**B. Integer Precision Testing:**
For packages with 64-bit integer operations, test boundary values:

```typescript
describe('64-bit integer operations', () => {
    // Test near 32-bit boundary (where JS bitwise ops truncate)
    test('values near 2^31', () => {
        expect(someOp(2147483647)).toBe(expected);   // INT32_MAX
        expect(someOp(2147483648)).toBe(expected);   // INT32_MAX + 1
        expect(someOp(-2147483648)).toBe(expected);  // INT32_MIN
    });

    // Test near 53-bit boundary (where JS number loses precision)
    test('values near 2^53', () => {
        expect(someOp(9007199254740991n)).toBe(expected);   // MAX_SAFE_INTEGER
        expect(someOp(9007199254740992n)).toBe(expected);   // MAX_SAFE_INTEGER + 1
    });

    // Test bitwise operations
    test('bitwise shifts', () => {
        expect(1n << 31n).toBe(2147483648n);  // Not -2147483648
        expect(1n << 63n).toBe(9223372036854775808n);
    });
});
```

**C. Floating Point Comparison:**
```typescript
// Use epsilon for floating point comparisons
const EPSILON = 1e-10;

function floatEquals(a: number, b: number): boolean {
    return Math.abs(a - b) < EPSILON;
}

test('floating point operations', () => {
    const goResult = 0.30000000000000004;  // From Go
    const tsResult = 0.1 + 0.2;
    expect(floatEquals(goResult, tsResult)).toBe(true);
});
```

**D. Time-Based Testing:**
```go
// Go time operations
t := time.Date(2024, 1, 15, 10, 30, 0, 0, time.UTC)
```
```typescript
// Use fixed dates, avoid time zones
const t = new Date(Date.UTC(2024, 0, 15, 10, 30, 0));  // Month is 0-indexed!
```

**E. Error Message Comparison:**
```typescript
// Don't compare exact error messages (they differ)
// Instead, compare error types/conditions
test('error handling', () => {
    // WRONG: exact message comparison
    expect(() => parse('')).toThrow('empty string');

    // CORRECT: error type/condition
    expect(() => parse('')).toThrow();
    expect(() => parse('')).toThrow(ParseError);
});
```

**F. Unicode/String Handling:**
```typescript
// Go strings are UTF-8 bytes, JS strings are UTF-16
describe('unicode handling', () => {
    test('emoji handling', () => {
        const emoji = '👨‍👩‍👧‍👦';  // Family emoji (complex grapheme cluster)
        // Go: len(emoji) = 25 (bytes)
        // JS: emoji.length = 11 (UTF-16 code units)

        // Use proper grapheme segmentation
        const segments = new Intl.Segmenter().segment(emoji);
        expect([...segments].length).toBe(1);  // 1 grapheme
    });

    test('byte length vs character length', () => {
        const str = '日本語';
        // Go: len(str) = 9 (bytes)
        // JS: str.length = 3 (characters)
        const bytes = new TextEncoder().encode(str);
        expect(bytes.length).toBe(9);
    });
});
```

### Step 5: Run Tests

```bash
# Run TypeScript tests
moon run test

# Run Go reference tests for comparison
cd test/reference && go test ./...

# Run specific Go test case
cd test/cases/001-basic && go run case.go

# Compare outputs
diff <(go run case.go) <(bun run case.ts)
```

### Step 6: Commit Test Infrastructure

```bash
moon run build  # Ensure no type errors in tests
moon run test   # All tests must pass
git add .
git commit -m "test(<package>): add compatibility test suite"
```

## Test Categories

1. **Unit Tests** - Individual function/method behavior
2. **Integration Tests** - Module interactions
3. **Compatibility Tests** - Go vs TypeScript output comparison
4. **Edge Case Tests** - Boundary conditions, nil/null, empty inputs
5. **Performance Tests** - Comparable execution characteristics
6. **Regression Tests** - Prevent future breakage

## Quality Standards
- Tests verify 100% output compatibility with Go
- All tests must pass before committing
- Update `port_status.md` with test coverage status
- Document any intentional deviations with justification

## Usage Examples
```bash
/porter:add-tests packages/tsports/go-colorful
/porter:add-tests packages/tsports/uniseg
```
