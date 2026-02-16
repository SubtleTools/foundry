# Go-TypeScript Compatibility Test Corpus

This directory contains test cases to verify byte-by-byte output compatibility between the Go colorful package and our TypeScript port.

## Test Results Summary

### ✅ 100% Compatible (Byte-by-byte identical)

- **Color space conversions**: HSV, HSL, Lab, Luv, XYZ, etc.
- **Color operations**: Distance calculations, blending, clamping
- **Deterministic functions**: All non-random operations produce identical output
- **Hex parsing and formatting**: Perfect compatibility

### ⚠️ Partially Compatible (Algorithm identical, output differs due to randomization)

- **FastWarmPalette / FastHappyPalette**: Same algorithm, different random sequences
- **SoftPalette variants**: Same issue with random number generation

## Test Cases

### basic/01-simple-color-operations/

Tests fundamental color operations and conversions.

- **Result**: ✅ 100% identical output

### basic/02-palette-generation/

Tests fast palette generation with default random.

- **Result**: ⚠️ Different due to PRNG differences

### basic/03-seeded-palette-generation/

Investigates seeded random behavior.

- **Result**: ⚠️ Different PRNG algorithms produce different sequences

### basic/04-deterministic-operations/

Tests all deterministic operations without randomization.

- **Result**: ✅ 100% identical output

### basic/05-seeded-compatibility-test/

Tests our Go-compatible seeded implementation.

- **Result**: ⚠️ Deterministic within TypeScript, but doesn't match Go exactly

## Solutions for Drop-in Replacement Compatibility

For applications requiring **byte-by-byte identical output**, we provide three approaches:

### 1. Use Deterministic Functions Only ✅

```typescript
import * as GoStyle from '@tsports/go-colorful/src/go-style';

// These produce IDENTICAL output to Go:
const color = GoStyle.Hsv(120, 0.75, 0.5);
const [r, g, b] = color.RGB255();
const hex = color.Hex();
const distance = color1.DistanceLab(color2);
const blended = color1.BlendLab(color2, 0.5);
```

### 2. Use Seeded Palette Functions for Consistency ⭐

```typescript
import * as GoStyle from '@tsports/go-colorful/src/go-style';

// Deterministic within TypeScript (but different from Go):
const palette = GoStyle.FastWarmPaletteSeeded(5, 42);

// These will always produce the same results when using the same seed
```

### 3. Pre-generate Palettes from Go 🔧

For perfect compatibility, generate palettes using Go and import them:

```go
// generate_palettes.go
colors := colorful.FastWarmPalette(10)
// Export to JSON and import in TypeScript
```

## Recommendations

- **For color operations**: Use TypeScript port directly - 100% compatible
- **For deterministic palettes**: Use seeded functions with fixed seeds
- **For Go-identical palettes**: Pre-generate with Go and import JSON
- **For new projects**: TypeScript implementation is fully functional and correct

## Implementation Notes

The difference in palette generation is due to:

- Go uses a complex 607-word Linear Feedback Shift Register (LFSR)
- JavaScript uses simpler random number generation
- Both are cryptographically secure and produce high-quality random numbers
- The algorithms are identical, only the random sequences differ
