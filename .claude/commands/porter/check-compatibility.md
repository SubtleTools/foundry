# Check Go-TypeScript Compatibility

Verify that the TypeScript port produces identical results to the Go original across all test scenarios.

**Arguments:** `$ARGUMENTS`
- `PACKAGE_PATH` - Path to the TSPort package to check (e.g., `packages/tsports/go-colorful`)

## Workflow

### Step 1: Run TypeScript Build and Tests
```bash
cd $PACKAGE_PATH
moon run build   # Must pass with zero errors
moon run test    # Run all TypeScript tests
```

### Step 2: Run Go Reference Tests
```bash
cd $PACKAGE_PATH/test/reference
go test ./...
go test -v ./...  # Verbose for detailed output
go test -race ./...  # Race detector (if applicable)
```

### Step 3: API Surface Comparison

**Extract Go Public API:**
```bash
# List all exported types and functions
go doc -all ./... > go-api.txt

# Or use go list for structured output
go list -f '{{.Name}}: {{.Doc}}' ./...
```

**Compare with TypeScript exports:**
```typescript
// Check src/index.ts exports match Go's public API
// Every exported Go function/type should have a TypeScript equivalent
```

**API Mapping Checklist:**
| Go Export | TypeScript Export | Status |
|-----------|-------------------|--------|
| `func NewXxx()` | `new Xxx()` or `Xxx.create()` | ✅/❌ |
| `func (x *Xxx) Method()` | `xxx.method()` | ✅/❌ |
| `type Xxx struct` | `class Xxx` or `interface Xxx` | ✅/❌ |
| `type Xxx interface` | `interface Xxx` | ✅/❌ |
| `const XxxValue` | `export const XxxValue` | ✅/❌ |
| `var DefaultXxx` | `export const defaultXxx` | ✅/❌ |

### Step 4: Compatibility Test Matrix

| Check Category | What to Verify | How to Test |
|---------------|----------------|-------------|
| **Output Equality** | Identical results for same inputs | JSON diff of outputs |
| **Error Conditions** | Same inputs trigger errors | Test error cases |
| **Edge Cases** | Nil, empty, zero values | Boundary testing |
| **Type Semantics** | TypeScript types model Go correctly | Type-level tests |
| **Performance** | Comparable execution time | Benchmarks |

### Step 5: Go-Specific Compatibility Checks

**A. Numeric Precision:**
```bash
# Generate Go reference values
cat > /tmp/numeric_test.go << 'EOF'
package main

import (
    "encoding/json"
    "fmt"
    "math"
)

func main() {
    tests := map[string]interface{}{
        "int32_max":     int32(2147483647),
        "int32_min":     int32(-2147483648),
        "int64_max":     int64(9223372036854775807),
        "uint64_max":    uint64(18446744073709551615),
        "float64_pi":    math.Pi,
        "float64_e":     math.E,
        "bitshift_31":   1 << 31,
        "bitshift_63":   int64(1) << 63,
    }
    json.NewEncoder(os.Stdout).Encode(tests)
}
EOF
go run /tmp/numeric_test.go > go_numeric.json
```

```typescript
// Compare TypeScript values
const tests = {
    int32_max: 2147483647,
    int32_min: -2147483648,
    int64_max: 9223372036854775807n,  // BigInt required
    uint64_max: 18446744073709551615n, // BigInt required
    float64_pi: Math.PI,
    float64_e: Math.E,
    bitshift_31: 1n << 31n,  // BigInt to avoid overflow
    bitshift_63: 1n << 63n,
};
```

**B. String/Byte Encoding:**
```go
// Go: strings are UTF-8 byte sequences
s := "Hello, 世界! 👋"
fmt.Printf("len=%d, runes=%d, bytes=%v\n",
    len(s),           // 20 bytes
    utf8.RuneCountInString(s), // 12 runes
    []byte(s))
```
```typescript
// TypeScript: verify byte-level compatibility
const s = "Hello, 世界! 👋";
const encoder = new TextEncoder();
const bytes = encoder.encode(s);
console.log(`len=${bytes.length}, chars=${s.length}, bytes=[${bytes}]`);
// len=20, chars=14 (UTF-16 code units differ from runes!)
```

**C. RNG Determinism (if applicable):**
```bash
# Run Go with legacy deterministic RNG
GODEBUG=randautoseed=0 go run -ldflags="-X main.seed=42" test.go > go_random.json
```
```typescript
// TypeScript must use ported RNG algorithm
import { GoRand } from './rng';
const rng = new GoRand(42n);
const values = Array.from({ length: 10 }, () => rng.next());
// Compare with go_random.json
```

**D. Time Zone Handling:**
```go
// Go time handling
t := time.Date(2024, 1, 15, 10, 30, 0, 0, time.UTC)
fmt.Println(t.Unix())        // 1705315800
fmt.Println(t.UnixNano())    // 1705315800000000000
fmt.Println(t.Format(time.RFC3339)) // 2024-01-15T10:30:00Z
```
```typescript
// TypeScript equivalent
const t = new Date(Date.UTC(2024, 0, 15, 10, 30, 0));  // Month 0-indexed!
console.log(Math.floor(t.getTime() / 1000));  // 1705315800
console.log(t.getTime() * 1_000_000);         // 1705315800000000000
console.log(t.toISOString());                 // 2024-01-15T10:30:00.000Z
```

**E. Error Handling Parity:**
```go
// Go error patterns
result, err := SomeFunction(input)
if err != nil {
    if errors.Is(err, ErrNotFound) { /* specific handling */ }
    return fmt.Errorf("context: %w", err)
}
```
```typescript
// TypeScript: verify same conditions trigger errors
try {
    const result = someFunction(input);
} catch (e) {
    if (e instanceof NotFoundError) { /* specific handling */ }
    throw new Error(`context: ${e.message}`, { cause: e });
}
```

**F. Interface Satisfaction:**
```go
// Go: implicit interface satisfaction
var _ io.Reader = (*MyType)(nil)  // Compile-time check
```
```typescript
// TypeScript: explicit implements
class MyType implements Reader {
    read(p: Uint8Array): [number, Error | null] { /* ... */ }
}

// Add compile-time check
const _: Reader = new MyType();  // Type error if not satisfied
```

**G. Nil vs Null/Undefined:**
```go
// Go nil behavior
var s []int    // nil slice
len(s)         // 0 (not panic)
append(s, 1)   // works

var m map[string]int  // nil map
len(m)                // 0
m["key"]              // 0, false (not panic)
m["key"] = 1          // PANIC
```
```typescript
// TypeScript must handle null/undefined consistently
let s: number[] | null = null;
// s.length  // ERROR - need null check
s?.length ?? 0  // Safe

let m: Map<string, number> | null = null;
// m.get('key')  // ERROR - need null check
m?.get('key') ?? 0  // Safe
```

### Step 6: Generate Compatibility Report

Create or update `compatibility_report.md`:

```markdown
# Compatibility Report: <package-name>

## Summary
- **Go Version Tested**: go1.22.0
- **TypeScript Version**: 5.4.0
- **API Coverage**: X/Y public APIs ported (X%)
- **Test Compatibility**: X/Y tests pass (X%)
- **Known Deviations**: N items documented

## API Compatibility Matrix

| Go API | TS API | Status | Notes |
|--------|--------|--------|-------|
| `NewColor(hex)` | `Color.fromHex(hex)` | ✅ | Factory method |
| `(c *Color) Hex()` | `color.hex()` | ✅ | Method name lowercase |
| `(c *Color) RGB()` | `color.rgb()` | ✅ | Returns tuple |
| `RandomColor()` | `randomColor()` | ⚠️ | Requires seeded RNG |

## Numeric Precision

| Test Case | Go Result | TS Result | Status |
|-----------|-----------|-----------|--------|
| `1 << 31` | 2147483648 | 2147483648n | ✅ (BigInt) |
| `math.Pi` | 3.141592653589793 | 3.141592653589793 | ✅ |

## String Encoding

| Input | Go len() | Go runes | TS length | TS bytes | Status |
|-------|----------|----------|-----------|----------|--------|
| "hello" | 5 | 5 | 5 | 5 | ✅ |
| "世界" | 6 | 2 | 2 | 6 | ✅ |
| "👋" | 4 | 1 | 2 | 4 | ⚠️ Document |

## Test Results
- TypeScript tests: PASS (X/Y)
- Go reference tests: PASS (X/Y)
- Cross-comparison tests: PASS (X/Y)

## Known Deviations

### 1. String Length Semantics
- **Go**: `len(s)` returns byte count
- **TypeScript**: `s.length` returns UTF-16 code unit count
- **Resolution**: Use `new TextEncoder().encode(s).length` for byte count

### 2. Random Number Generation
- **Go**: Uses PCG algorithm in Go 1.20+
- **TypeScript**: Ported PCG implementation required
- **Verification**: `GODEBUG=randautoseed=0` for deterministic testing
```

### Step 7: Update Port Status

Update `port_status.md` with compatibility check results:
- Mark files as "Verified" after compatibility passes
- Note any files with compatibility issues

### Step 8: Commit Report

```bash
git add compatibility_report.md port_status.md
git commit -m "docs(<package>): add compatibility verification report"
```

## Quality Standards
- 100% API compatibility required (or documented exceptions)
- All compatibility tests must pass
- Deviations must be documented and justified
- Performance should be comparable or better

## Usage Examples
```bash
/porter:check-compatibility packages/tsports/go-colorful
/porter:check-compatibility packages/tsports/uniseg
```
