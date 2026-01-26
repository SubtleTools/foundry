# Implement Core TSPort Functionality

Implement the core TypeScript functionality for an existing TSPort package by analyzing and porting the Go source code.

**Arguments:** `$ARGUMENTS`
- `PACKAGE_PATH` - Path to the TSPort package (e.g., `packages/tsports/uniseg`)

## Workflow

### Step 1: Analysis Phase
1. Read the Go source code in `test/reference/`
2. Identify all packages, types, interfaces, and their relationships
3. Map out dependencies and determine TypeScript module structure
4. Update `port_status.md` with all Go files to be ported

**Identify Go-specific patterns that need special handling:**
- [ ] `internal/` packages (not importable externally - flatten or restructure)
- [ ] Build tags (`//go:build`, `// +build`) - conditional compilation
- [ ] `init()` functions - convert to explicit initialization
- [ ] CGO dependencies - may require native bindings or pure TS alternatives
- [ ] `vendor/` directories - identify vendored dependencies
- [ ] Go workspaces (`go.work`) - understand module relationships
- [ ] Generics (Go 1.18+) - map to TypeScript generics

### Step 2: Type Mapping

**Primitive Types:**
| Go Type | TypeScript Equivalent | Notes |
|---------|----------------------|-------|
| `int`, `int8`, `int16`, `int32` | `number` | Safe for values < 2^53 |
| `int64` | `number` or `bigint` | Use `bigint` for bitwise ops or large values |
| `uint`, `uint8`, `uint16`, `uint32` | `number` | `uint8` often maps to `Uint8Array` for byte buffers |
| `uint64` | `number` or `bigint` | Use `bigint` for bitwise ops or large values |
| `float32`, `float64` | `number` | JavaScript only has float64 |
| `complex64`, `complex128` | Custom class | Implement `Complex` class with real/imag |
| `string` | `string` | Go strings are UTF-8 bytes; JS strings are UTF-16 |
| `bool` | `boolean` | Direct mapping |
| `byte` | `number` | Alias for uint8 |
| `rune` | `number` | Alias for int32 (Unicode code point) |

**Composite Types:**
| Go Type | TypeScript Equivalent | Notes |
|---------|----------------------|-------|
| `[]T` (slice) | `T[]` | Slices are reference types with len/cap |
| `[N]T` (array) | `T[]` or `readonly [T, T, ...]` | Fixed-size; use tuple for small arrays |
| `map[K]V` | `Map<K, V>` | Use `Map` for non-string keys |
| `map[string]V` | `Record<string, V>` or `Map` | `Record` for JSON-like objects |
| `*T` (pointer) | `T \| null` | Nullable reference |
| `chan T` | Custom Channel class | See concurrency section |
| `func(A) B` | `(a: A) => B` | Function types |
| `interface{}` / `any` | `unknown` | Prefer generics when possible |
| `struct{}` | `void` or omit | Empty struct used as signal |

**CRITICAL - Numeric Precision:**

```typescript
// JavaScript number limitations:
// - Safe integers: -(2^53 - 1) to (2^53 - 1)
// - Bitwise ops: operands cast to 32-bit signed int

// WRONG: overflow in bitwise operations
const bad = 1 << 31;  // -2147483648 (not 2147483648)

// CORRECT: use BigInt for 64-bit operations
const good = 1n << 31n;  // 2147483648n

// CORRECT: explicit constants for 32-bit max values
const INT32_MAX = 2147483647;
const UINT32_MAX = 0xFFFFFFFF >>> 0;
```

### Step 3: Go-Specific Pattern Conversion

**A. Package-Level Variables & init():**
```go
// Go: package-level state with init
var globalCache = make(map[string]int)

func init() {
    globalCache["default"] = 0
}
```
```typescript
// TypeScript: explicit initialization function
const globalCache = new Map<string, number>();

export function initModule(): void {
    globalCache.set("default", 0);
}
// Call at module load or export for lazy init
```

**B. Multiple Return Values:**
```go
func Parse(s string) (result int, err error) {
    // ...
}
```
```typescript
// Option 1: Tuple return
function parse(s: string): [number, Error | null] { }

// Option 2: Result type (preferred)
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
function parse(s: string): Result<number> { }

// Option 3: Throw exceptions (for unrecoverable errors)
function parse(s: string): number { throw new Error(...) }
```

**C. Defer Statements:**
```go
func process() {
    f := openFile()
    defer f.Close()
    // ... work with f
}
```
```typescript
// Option 1: try/finally
function process(): void {
    const f = openFile();
    try {
        // ... work with f
    } finally {
        f.close();
    }
}

// Option 2: using declaration (TC39 Stage 3, supported in TS 5.2+)
function process(): void {
    using f = openFile();  // auto-disposed at end of scope
    // ... work with f
}
```

**D. Goroutines & Channels:**
```go
ch := make(chan int, 10)
go func() {
    ch <- 42
}()
result := <-ch
```
```typescript
// Simple case: Promise
const result = await new Promise<number>((resolve) => {
    setTimeout(() => resolve(42), 0);
});

// Complex case: AsyncGenerator or custom Channel class
class Channel<T> {
    private queue: T[] = [];
    private resolvers: ((value: T) => void)[] = [];

    send(value: T): void { /* ... */ }
    async receive(): Promise<T> { /* ... */ }
}
```

**E. Select Statements:**
```go
select {
case v := <-ch1:
    handle(v)
case ch2 <- value:
    sent()
case <-time.After(timeout):
    timedOut()
}
```
```typescript
// Use Promise.race for timeout patterns
const result = await Promise.race([
    ch1.receive(),
    timeout(1000).then(() => { throw new Error('timeout') }),
]);

// For multiple channels, implement select() helper
async function select<T>(cases: (() => Promise<T>)[]): Promise<T> {
    return Promise.race(cases.map(c => c()));
}
```

**F. Embedded Structs (Composition):**
```go
type Reader interface { Read(p []byte) (n int, err error) }
type Writer interface { Write(p []byte) (n int, err error) }
type ReadWriter interface {
    Reader
    Writer
}
```
```typescript
interface Reader { read(p: Uint8Array): [number, Error | null]; }
interface Writer { write(p: Uint8Array): [number, Error | null]; }
interface ReadWriter extends Reader, Writer {}
```

**G. Type Assertions & Type Switches:**
```go
switch v := x.(type) {
case int:
    handleInt(v)
case string:
    handleString(v)
default:
    handleOther(x)
}
```
```typescript
// Use discriminated unions or type guards
if (typeof x === 'number') {
    handleInt(x);
} else if (typeof x === 'string') {
    handleString(x);
} else {
    handleOther(x);
}

// Or discriminated union pattern
type Value =
    | { kind: 'int'; value: number }
    | { kind: 'string'; value: string };
```

**H. Blank Identifier:**
```go
_, err := someFunc()  // ignore first return value
```
```typescript
const [, err] = someFunc();  // destructure and ignore
// or
const result = someFunc();
const err = result[1];
```

**I. iota Constants:**
```go
const (
    Red = iota    // 0
    Green         // 1
    Blue          // 2
)
```
```typescript
// Option 1: enum
enum Color { Red = 0, Green = 1, Blue = 2 }

// Option 2: const object (preferred for tree-shaking)
const Color = { Red: 0, Green: 1, Blue: 2 } as const;
type Color = typeof Color[keyof typeof Color];
```

**J. String/Byte Conversion:**
```go
s := "hello"
b := []byte(s)       // string to bytes
s2 := string(b)      // bytes to string
```
```typescript
const s = "hello";
const b = new TextEncoder().encode(s);  // string to Uint8Array
const s2 = new TextDecoder().decode(b); // Uint8Array to string
```

**K. Reflection (`reflect` package):**
```go
t := reflect.TypeOf(v)
v := reflect.ValueOf(x)
```
```typescript
// Limited reflection available:
typeof x              // primitive type
x.constructor.name    // class name
Object.keys(x)        // object keys

// For full reflection, consider:
// - Runtime type info via decorators
// - Schema libraries (zod, io-ts)
// - Code generation from Go types
```

**L. Unsafe Operations:**
```go
import "unsafe"
ptr := unsafe.Pointer(&x)
```
```typescript
// No direct equivalent - redesign required
// Options:
// - ArrayBuffer + DataView for binary manipulation
// - WebAssembly for low-level memory access
// - Native bindings via Bun FFI
```

**M. Build Tags / Conditional Compilation:**
```go
//go:build linux
// +build linux
```
```typescript
// Option 1: Runtime detection
const isLinux = process.platform === 'linux';
if (isLinux) { /* linux-specific */ }

// Option 2: Separate entry points
// src/platform/linux.ts
// src/platform/darwin.ts
// src/platform/index.ts (re-exports based on platform)

// Option 3: Build-time substitution (bundler config)
```

**N. Generics (Go 1.18+):**
```go
func Map[T, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}
```
```typescript
function map<T, U>(s: T[], f: (v: T) => U): U[] {
    return s.map(f);
}
```

### Step 4: Special Scenarios

**A. Non-Deterministic Logic & RNG:**
- If the Go library uses seeded/deterministic output, you CANNOT use `Math.random()`
- You MUST port the exact randomness algorithm (PCG, SplitMix, `math/rand` implementations)
- Verify parity with Go using `GODEBUG=randautoseed=0` for legacy deterministic behavior

**B. Time & Duration:**
```go
d := 5 * time.Second
t := time.Now()
```
```typescript
const d = 5000;  // milliseconds (or use a Duration type)
const t = Date.now();

// Consider a Duration class for clarity
class Duration {
    constructor(public milliseconds: number) {}
    static seconds(n: number) { return new Duration(n * 1000); }
    static minutes(n: number) { return new Duration(n * 60000); }
}
```

**C. Context (`context.Context`):**
```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
```
```typescript
// Use AbortController for cancellation
const controller = new AbortController();
const signal = controller.signal;
setTimeout(() => controller.abort(), 5000);

// Pass signal to async operations
await fetch(url, { signal });
```

### Step 5: Implementation Loop

For each Go file, repeat this cycle:

```bash
# 1. Implement the TypeScript equivalent
# 2. Verify compilation
moon run build  # MUST pass with zero errors

# 3. Update port_status.md (change status to "Complete" or "Partial")

# 4. Commit only when build passes
git add .
git commit -m "feat(<package>): implement <component>"
```

**FAILURE RECOVERY:**
If `moon run build` fails:
- DO NOT commit
- Fix all TypeScript errors first
- Re-run `moon run build` until it passes
- Only then proceed with git commit

### Step 6: Error Handling Conversion
- Go multiple return values with errors → Result types or exceptions
- Implement proper error types matching Go's error patterns
- Maintain error context and wrapping strategies (like `fmt.Errorf` with `%w`)

## Quality Assurance
- All code must compile with zero TypeScript errors before commit
- Each implementation step committed atomically
- Conventional commit format: `feat:`, `fix:`, `refactor:`
- Maintain 100% API compatibility with Go original
- Update `port_status.md` after EVERY step

## Usage Examples
```bash
/porter:implement-core packages/tsports/bubbletea
/porter:implement-core packages/tsports/termenv
```
