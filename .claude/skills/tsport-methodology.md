---
name: tsport-methodology
description: Core TSports porting methodology, conventions, and patterns. Use when working on any Go-to-TypeScript porting task.
trigger: always-on
---

# TSPort Core Methodology

You are working within the TSports project, which ports Go libraries to TypeScript while maintaining API compatibility and following established conventions.

## Dual API Pattern (CRITICAL)

TSports maintains TWO API styles:

1. **`src/index.ts` - TypeScript-Native API (Primary)**:
   - Use **camelCase** for all functions and methods
   - Examples: `hex()`, `toHex()`, `lighter()`
   - This is the PRIMARY API for TypeScript users

2. **`src/go-style.ts` - Go-Compatible API (Secondary)**:
   - Use **PascalCase** for all functions and methods
   - Examples: `Hex()`, `ToHex()`, `Lighter()`
   - Thin wrapper over TypeScript-native implementation
   - Export path: `@tsports/package-name/go-style`

## Type Mapping Reference

### Primitive Types
- `int`, `int32` → `number` (safe < 2^53)
- `int64`, `uint64` → `bigint` (for bitwise ops or large values)
- `float64` → `number`
- `string` → `string` (note: Go=UTF-8, JS=UTF-16)
- `bool` → `boolean`
- `byte` → `number`
- `rune` → `number`

### Composite Types
- `[]T` → `T[]`
- `map[K]V` → `Map<K, V>`
- `*T` → `T | null`
- `chan T` → Custom Channel class or Promise
- `func(A) B` → `(a: A) => B`
- `interface{}` → `unknown`

### Critical Numeric Handling
```typescript
// WRONG: overflow in bitwise operations
const bad = 1 << 31;  // -2147483648 (not 2147483648)

// CORRECT: use BigInt for 64-bit operations
const good = 1n << 31n;  // 2147483648n
```

## Go Reference Location

The Go source reference is ALWAYS located at `test/reference/` after running `bun run setup`. This is where you compare implementations.

## Quality Workflow

Every implementation step MUST follow this pattern:

```bash
# 1. Implement TypeScript code
# 2. Verify compilation
moon run build  # MUST pass with zero errors

# 3. Update port_status.md
# 4. Only commit when build passes
git add .
git commit -m "feat(<package>): <description>"
```

**NEVER commit code with TypeScript compilation errors.**

## Testing Strategy

When fixing test issues:
1. **Check Go Reference First**: Always look at `test/reference/` to see what the Go code does
2. **Verify Test Equivalence**: Ensure TS test matches Go test logic
3. **Compare Outputs**: Use JSON comparison for deterministic verification
4. **Document Deviations**: If behavior differs, document why in compatibility report

## RNG & Determinism

If the library uses random number generation:
- **NEVER use `Math.random()`** for deterministic operations
- **Port the exact RNG algorithm** (PCG, SplitMix, etc.)
- **Verify with Go**: Use `GODEBUG=randautoseed=0` for legacy deterministic behavior

## String/Byte Handling

Remember:
- Go strings are UTF-8 byte sequences: `len("世界")` = 6 bytes
- JS strings are UTF-16 code units: `"世界".length` = 2 characters
- Use `TextEncoder`/`TextDecoder` for byte-level operations

## Package Manager

**ALWAYS use Bun, NEVER npm:**
- `bun install`
- `bun run test`
- `moon run build` (uses Bun internally)

## Common Go Patterns → TypeScript

### Multiple Return Values
```go
result, err := Parse(s)
```
```typescript
// Option 1: Tuple
const [result, err] = parse(s);

// Option 2: Result type (preferred)
type Result<T> = { ok: true; value: T } | { ok: false; error: Error };
```

### Defer
```go
defer f.Close()
```
```typescript
try {
  // work
} finally {
  f.close();
}
```

### Goroutines
```go
go doWork()
```
```typescript
// Simple: Promise
void doWork();

// Complex: async/await or Web Workers
```

## File Organization

```
packages/tsports/<package-name>/
├── src/
│   ├── index.ts              # TypeScript-native API (camelCase)
│   ├── go-style.ts           # Go-compatible API (PascalCase)
│   └── types.ts              # Core types
├── test/
│   ├── reference/            # Go source (ALWAYS here)
│   ├── basic.test.ts
│   └── automated-cases.test.ts
├── port_status.md            # Track porting progress
├── compatibility_report.md   # Verification results
└── package.json
```

## When to Update port_status.md

Update after EVERY implementation step:
- File started: `⚠️ Partial`
- File complete: `✅ Complete`
- File verified: `✅ Verified`
