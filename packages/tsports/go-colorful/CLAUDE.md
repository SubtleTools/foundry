# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **TypeScript port of go-colorful**, a comprehensive color manipulation library originally written in Go. The package provides:

- Complete color space conversion support (RGB, HSL, HSV, Lab, Luv, HCL, XYZ, OkLab, OkLch, HSLuv, HPLuv)
- Perceptual color distance algorithms (CIE76, CIE94, CIEDE2000, Riemersma)
- Color blending in multiple color spaces
- Color generation (warm, happy, random colors)
- Palette generation algorithms
- Color sorting using minimum spanning trees

**Key Architecture Decision**: The package provides **two identical APIs**:

1. **TypeScript Style API** (default): camelCase methods (`color.distanceLab()`, `color.rgb255()`)
2. **Go Style API** (`/go-style` export): PascalCase methods matching Go exactly (`color.DistanceLab()`, `color.RGB255()`)

Both APIs produce identical results and are backed by the same implementation.

## Commands

### Development

```bash
bun install              # Install dependencies
bun run build           # Full build (typecheck + bundle + declarations)
bun run build:typecheck # TypeScript type checking only
bun run build:bundle    # Bundle source files
bun run build:dts       # Generate type declarations
bun run clean           # Remove build artifacts
```

### Testing

```bash
bun test                # Run all tests via custom test script
bun test --coverage     # Run tests with coverage report
bun run test            # Same as 'bun test'

# Run specific test file
bun test test/basic.test.ts

# The test script (scripts/test.js) automatically:
# - Finds all *.test.ts files in test/
# - Excludes automated-cases and automated-comparison tests
# - Runs them with bun test
```

### Code Quality

```bash
bun run lint            # Lint with Biome
bun run format          # Format with dprint
bun run format:check    # Check formatting without changes
```

### Documentation

```bash
bun run docs            # Generate TypeDoc documentation
bun run docs:build      # Build VitePress documentation site
```

## Architecture

### Core Color Class (`src/color.ts`)

The `Color` class is the foundation of the library:

- Stores colors internally as sRGB values (`r`, `g`, `b` in range 0-1)
- Implements ~80+ methods for color space conversions, distance calculations, and blending
- All color operations return new `Color` instances (immutable pattern)

### Dual API Implementation (`src/go-style.ts`)

The Go-style API is a **wrapper layer** that:

- Wraps the TypeScript `Color` class with a Go-compatible class
- Uses uppercase property names (`R`, `G`, `B` instead of `r`, `g`, `b`)
- Wraps all methods with PascalCase equivalents
- Delegates all actual computation to the TypeScript implementation

**Important**: When modifying functionality, always update the TypeScript API first (`src/color.ts`), then the Go-style wrapper will automatically reflect changes.

### Color Space Constructors (`src/constructors.ts`)

Factory functions for creating colors from different color spaces:

- Each constructor converts from its color space to sRGB
- Naming: `Hex()`, `HSL()`, `Lab()`, etc. for TypeScript API
- Go-style equivalents exported from `src/go-style.ts`

### Palette Generation Architecture

The package includes three palette generation algorithms, each in its own file:

- **`src/soft_palettegen.ts`**: Soft, pastel palettes using k-means clustering in LAB space
- **`src/warm_palettegen.ts`**: Warm color palettes using HCL color space
- **`src/happy_palettegen.ts`**: Bright, happy color palettes using HCL

All palette generators:

- Return `[Color[], Error | null]` tuples (Go-style error handling)
- Support both slow/accurate and fast versions
- Accept optional custom random number generators

### Random Number Generation

Custom random number interface (`src/rand.ts`) allows:

- Deterministic testing with seed control
- Compatibility with Go's random number semantics
- Abstraction over JavaScript's `Math.random()`

## Testing Strategy

### Test File Organization

- **`test/basic.test.ts`**: Core Color class functionality
- **`test/compatibility.test.ts`**: Cross-verification with Go implementation results
- **`test/go-style-*.test.ts`**: Go-style API tests
- **`test/algorithm-verification.test.ts`**: Color distance and blending algorithms
- **`test/generators.test.ts`**: Color generation functions
- **`test/hexcolor.test.ts`**: Hex color parsing and formatting
- **`test/constructor-coverage.test.ts`**: Color space constructor coverage

### Running Specific Tests

The custom test runner (`scripts/test.js`) is used because:

- It filters out automated test generation files
- It provides consistent test discovery across environments
- It integrates with the monorepo's moon build system

To run a single test file directly:

```bash
bun test test/basic.test.ts
```

To run tests matching a pattern:

```bash
bun test --test-name-pattern "HSV"
```

## Key Implementation Details

### Color Space Conversions

Conversions follow this general pattern:

1. sRGB → Linear RGB → XYZ → Target Space
2. For perceptually uniform spaces (Lab, Luv, HCL), conversions go through XYZ
3. Fast variants skip gamma correction for performance

### Gamma Correction

- `linearize()`: sRGB → Linear RGB (accurate, uses sRGB gamma curve)
- `linearizeFast()`: Fast approximation using simple power function
- `delinearize()`: Linear RGB → sRGB (accurate)
- `delinearizeFast()`: Fast approximation

### White Point References

Most color spaces use **D65** illuminant (standard for sRGB).
Some operations support custom white points:

- `LabWhiteRef()`, `LuvWhiteRef()`, etc.
- D50 is also provided for compatibility

### Distance Calculations

Color distance methods in order of perceptual accuracy:

1. `distanceCIEDE2000()` - Most accurate, slowest
2. `distanceCIE94()` - Good balance
3. `distanceCIE76()` / `distanceLab()` - Simple Euclidean in Lab space
4. `distanceRgb()` - Not perceptually uniform (avoid for UX)

## Common Patterns

### Creating Colors

```typescript
// TypeScript Style
import { Color, Hex, HSL, Lab } from '@tsports/go-colorful';

const c1 = new Color(0.5, 0.3, 0.8);  // Direct RGB
const c2 = Hex("#FF0080");            // From hex
const c3 = HSL(300, 0.8, 0.6);        // From HSL

// Go Style
import * as GoStyle from '@tsports/go-colorful/go-style';

const c4 = new GoStyle.Color(0.5, 0.3, 0.8);
const c5 = GoStyle.Hex("#FF0080");
```

### Adding New Color Space Support

1. Add conversion functions to `src/color.ts` (TypeScript API)
2. Add constructor function to `src/constructors.ts`
3. Add wrapper methods to `src/go-style.ts` (Go API)
4. Add tests in `test/` with cross-verification against Go if possible
5. Export from `src/index.ts` and `src/go-style.ts`

### Adding New Distance/Blending Methods

1. Implement on `Color` class in `src/color.ts` using camelCase
2. Add Go-style wrapper in `src/go-style.ts` using PascalCase
3. Add tests covering edge cases and comparing to reference implementation
4. Update documentation if it's a novel algorithm

## Build System Notes

- Uses **Bun** for all operations (not npm/node)
- Type checking is separate from bundling (can catch type errors without rebuilding)
- Generates both `.js` and `.d.ts` files in `dist/`
- Two entry points: `dist/index.js` and `dist/go-style.js`
- Tree-shakeable exports via `package.json` exports field

## Dependencies

**Zero runtime dependencies** - the package is completely self-contained.

DevDependencies:

- `@biomejs/biome` - Fast linting
- `dprint` - Code formatting
- `typedoc` - API documentation generation
- `typescript` - Type checking and declaration generation
- `@moonrepo/cli` - Monorepo tooling integration

## Performance Considerations

The library includes fast variants of expensive operations:

- `FastLinearRgb()` vs `LinearRgb()` - Gamma correction approximation
- `FastWarmColor()` vs `WarmColor()` - Uses HSV instead of HCL
- `FastHappyPalette()` vs `HappyPalette()` - Simpler color space

Trade-off: Fast variants are less perceptually accurate but sufficient for many use cases.
