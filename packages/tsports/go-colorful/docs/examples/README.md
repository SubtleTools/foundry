# Examples

This directory contains TypeScript examples converted from the original Go examples in [go-colorful](https://github.com/lucasb-eyer/go-colorful).

## Running Examples

All examples can be run directly with Bun:

```bash
bun run docs/examples/colordist.ts
bun run docs/examples/colorblend.ts
bun run docs/examples/colorgens.ts
bun run docs/examples/palettegens.ts
bun run docs/examples/colorsort.ts
bun run docs/examples/gradientgen.ts
```

## Example Descriptions

### [colordist.ts](colordist.ts)
**Color Distance Comparison**

Demonstrates different color distance metrics and why CIE-based distances are more perceptually accurate than RGB distances.

**Key Concepts:**
- RGB vs perceptual color distances
- CIE-L*a*b*, CIE-L*u*v*, CIE94, and CIEDE2000 distance metrics
- Why perceptual distance matters for color comparisons

### [colorblend.ts](colorblend.ts)
**Color Blending in Different Spaces**

Shows how different color spaces produce different blending results, and demonstrates the issue of invalid RGB colors when blending in CIE spaces.

**Key Concepts:**
- RGB, HSV, LAB, LUV, and HCL blending
- Invalid RGB colors and clamping
- Perceptually uniform vs. non-uniform blending

### [colorgens.ts](colorgens.ts)
**Random Color Generation**

Demonstrates different approaches to generating random colors with specific characteristics (warm colors, happy colors) using different color spaces.

**Key Concepts:**
- Warm vs happy color generation
- CIE-L*C*h° vs HSV generation methods
- Fast vs accurate color generation
- Custom random sources for reproducible results

### [palettegens.ts](palettegens.ts)
**Palette Generation**

Shows how to generate distinguishable color palettes using various algorithms and constraints.

**Key Concepts:**
- Warm, happy, and soft palette generation
- Custom palette constraints with `SoftPaletteEx`
- Perceptual distance optimization for palette colors
- Analyzing palette properties

### [colorsort.ts](colorsort.ts)
**Color Sorting**

Demonstrates the `Sorted` function which orders colors to minimize perceptual jumps between adjacent colors.

**Key Concepts:**
- Component-based vs perceptual sorting
- Minimizing average adjacent color distance
- Smooth color transitions in sequences

### [gradientgen.ts](gradientgen.ts)
**Gradient Generation**

Shows how to create smooth color gradients using keypoints and HCL blending.

**Key Concepts:**
- Gradient keypoint interpolation
- HCL blending for smooth transitions
- Spectral gradient creation
- Gradient analysis and optimization

## Differences from Go Examples

The TypeScript examples have been adapted to:

1. **Use TypeScript syntax and conventions**
2. **Provide console output instead of image generation** (for simplicity)
3. **Include additional analysis and explanations**
4. **Demonstrate both TypeScript-style and Go-style APIs**
5. **Add error handling and validation**

## Image Generation

The original Go examples generate PNG images. While the TypeScript examples focus on console output for simplicity, you can adapt them for image generation using libraries like:

- **Canvas API** (for browsers)
- **node-canvas** (for Node.js)
- **Sharp** (for Node.js image processing)

Example adaptation for canvas:

```typescript
// Browser canvas example
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;

canvas.width = 400;
canvas.height = 100;

// Generate gradient
for (let x = 0; x < canvas.width; x++) {
    const t = x / (canvas.width - 1);
    const color = startColor.blendHcl(endColor, t);
    
    ctx.fillStyle = color.hex();
    ctx.fillRect(x, 0, 1, canvas.height);
}
```

## Original Go Examples

The original Go examples (with image generation) can be found in:
- `test/automation/reference/doc/colordist/colordist.go`
- `test/automation/reference/doc/colorblend/colorblend.go`
- `test/automation/reference/doc/colorgens/colorgens.go`
- `test/automation/reference/doc/palettegens/palettegens.go`
- `test/automation/reference/doc/colorsort/colorsort.go`
- `test/automation/reference/doc/gradientgen/gradientgen.go`

Generated images from the original examples are available in the `../images/` directory.