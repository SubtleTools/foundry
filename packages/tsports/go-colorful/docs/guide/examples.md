# Examples

This page contains practical examples of using @tsports/go-colorful.

## Basic Color Operations

```typescript
import { hex, Color } from '@tsports/go-colorful';

// Create a color from hex
const orange = hex('#FF8C00');

// Convert between color spaces
console.log(orange.rgb());     // [1, 0.549, 0]
console.log(orange.hsl());     // [33, 1, 0.5]
console.log(orange.hsv());     // [33, 1, 1]
console.log(orange.lab());     // [74.93, 23.93, 78.95]

// Get hex representation
console.log(orange.hex());     // "#ff8c00"
```

## Color Distance and Similarity

```typescript
import { hex } from '@tsports/go-colorful';

const red = hex('#FF0000');
const pink = hex('#FF69B4');
const blue = hex('#0000FF');

// Calculate perceptual distance
console.log(red.distanceCIE76(pink));  // Smaller distance (similar colors)
console.log(red.distanceCIE76(blue));  // Larger distance (different colors)

// Use more accurate distance measures
console.log(red.distanceCIE94(pink));
console.log(red.distanceCIEDE2000(pink));
```

## Color Palette Generation

```typescript
import { happyPalette, warmPalette, softPalette } from '@tsports/go-colorful';

// Generate different types of palettes
const happyColors = happyPalette(5);
const warmColors = warmPalette(4);
const softColors = softPalette(6);

// Use the colors
happyColors.forEach((color, index) => {
  console.log(`Happy Color ${index}: ${color.hex()}`);
});

// Generate with custom settings
import { softPaletteEx } from '@tsports/go-colorful';

const customSoft = softPaletteEx(8, {
  checkColor: (l, a, b) => l > 0.3 && l < 0.7, // Custom lightness range
  iterations: 50,
  manySamples: true
});
```

## Color Blending and Interpolation

```typescript
import { hex } from '@tsports/go-colorful';

const red = hex('#FF0000');
const blue = hex('#0000FF');

// Blend colors in different color spaces
const blendedRGB = red.blendRgb(blue, 0.5);      // 50% blend in RGB
const blendedLab = red.blendLab(blue, 0.5);      // 50% blend in LAB
const blendedHcl = red.blendHcl(blue, 0.5);      // 50% blend in HCL

console.log(blendedRGB.hex());  // Purple-ish
console.log(blendedLab.hex());  // Different purple
console.log(blendedHcl.hex());  // Another purple variant
```

## Working with Gradients

```typescript
import { hex } from '@tsports/go-colorful';

const start = hex('#FF0000');  // Red
const end = hex('#0000FF');    // Blue

// Create a gradient with 10 steps
const steps = 10;
for (let i = 0; i <= steps; i++) {
  const t = i / steps;
  const color = start.blendLab(end, t);
  console.log(`Step ${i}: ${color.hex()}`);
}
```

## Advanced Color Space Conversions

```typescript
import { hex } from '@tsports/go-colorful';

const color = hex('#4CAF50'); // Material Green

// Convert to various color spaces
const [r, g, b] = color.rgb();
const [h, s, l] = color.hsl();
const [h2, s2, v] = color.hsv();
const [lLab, aLab, bLab] = color.lab();
const [lLuv, uLuv, vLuv] = color.luv();
const [hHcl, cHcl, lHcl] = color.hcl();
const [lOklab, aOklab, bOklab] = color.okLab();
const [lOklch, cOklch, hOklch] = color.okLch();

console.log('RGB:', [r, g, b]);
console.log('HSL:', [h, s, l]);
console.log('LAB:', [lLab, aLab, bLab]);
console.log('OKLab:', [lOklab, aOklab, bOklab]);
```

## Migration from Go

If you're migrating from the Go version of go-colorful, you can use the Go-compatible API:

```typescript
import { Hex, Hsl, HappyPalette, MakeColor } from '@tsports/go-colorful/go-style';

// Direct replacement for Go code
const c1 = Hex('#FF0000');
const c2 = Hsl(240, 1, 0.5);
const c3 = MakeColor(1, 0, 0);

// Generate palette exactly like in Go
const palette = HappyPalette(5);
```

## Color Sorting

```typescript
import { hex, sorted } from '@tsports/go-colorful';

const colors = [
  hex('#FF0000'), // Red
  hex('#00FF00'), // Green  
  hex('#0000FF'), // Blue
  hex('#FFFF00'), // Yellow
  hex('#FF00FF'), // Magenta
  hex('#00FFFF'), // Cyan
];

// Sort by different criteria
const sortedByHue = sorted(colors, 'hue');
const sortedByLightness = sorted(colors, 'lightness');
const sortedByChroma = sorted(colors, 'chroma');

console.log('By hue:', sortedByHue.map(c => c.hex()));
console.log('By lightness:', sortedByLightness.map(c => c.hex()));