# Getting Started

## Installation

Install the package using your preferred package manager:

::: code-group

```bash [bun]
bun add @tsports/go-colorful
```

```bash [npm]
npm install @tsports/go-colorful
```

```bash [yarn]
yarn add @tsports/go-colorful
```

:::

## Quick Start

### TypeScript-Native API (Recommended)

```typescript
import { Color, hex, hsl, hsv, lab, makeColor } from '@tsports/go-colorful';

// Create colors from different color spaces
const red = hex('#FF0000');
const blue = hsl(240, 1, 0.5);
const green = hsv(120, 1, 1);
const white = lab(100, 0, 0);

// Work with Color objects
console.log(red.hex());        // "#ff0000"
console.log(blue.rgb());       // [0, 0, 1]
console.log(green.hsl());      // [120, 1, 1]
console.log(white.distanceCIE76(red)); // Color distance

// Generate color palettes
import { happyPalette, warmPalette, softPalette } from '@tsports/go-colorful';

const happy = happyPalette(5);    // 5 happy colors
const warm = warmPalette(3);      // 3 warm colors
const soft = softPalette(4);      // 4 soft colors
```

### Go-Compatible API

Perfect for developers migrating from Go - import from the `go-style` module:

```typescript
import { Hex, Hsl, Hsv, Lab, HappyPalette, WarmPalette } from '@tsports/go-colorful/go-style';

// Exact Go API with PascalCase functions
const red = Hex('#FF0000');
const blue = Hsl(240, 1, 0.5);
const green = Hsv(120, 1, 1);

// Go-style palette generation
const happyColors = HappyPalette(5);
const warmColors = WarmPalette(3);
```

#### Available Go-Compatible Functions

The `go-style` export provides all Go functions with exact naming:

**Color Constructors:**
- `Hex(hex)` - Create color from hex string
- `Hsl(h, s, l)` - Create color from HSL values
- `Hsv(h, s, v)` - Create color from HSV values
- `Lab(l, a, b)` - Create color from LAB values
- `Luv(l, u, v)` - Create color from LUV values
- `Hcl(h, c, l)` - Create color from HCL values
- `MakeColor(r, g, b)` - Create color from RGB values

**Palette Generators:**
- `HappyPalette(colorsCount)` - Generate happy colors
- `WarmPalette(colorsCount)` - Generate warm colors
- `SoftPalette(colorsCount)` - Generate soft colors

**Fast Variants:**
- `FastHappyPalette(colorsCount)` - Fast happy palette generation
- `FastWarmPalette(colorsCount)` - Fast warm palette generation

## Next Steps

- Check out the [Examples](/guide/examples) for more detailed usage
- Browse the complete [API Reference](/api/) for all available functions
- See the [GitHub repository](https://github.com/TSports/go-colorful) for source code and issues