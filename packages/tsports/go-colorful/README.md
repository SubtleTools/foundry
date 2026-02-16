# go-colorful

A TypeScript port of the [go-colorful](https://github.com/lucasb-eyer/go-colorful) package providing comprehensive color space manipulation and conversion functions.

## Features

This library provides 100% API compatibility with the original Go package, including:

### Color Space Support

- **RGB**: Standard Red, Green, Blue color space
- **HSL**: Hue, Saturation, Lightness
- **HSV**: Hue, Saturation, Value
- **Hex**: HTML hex colors like `#FF0080`
- **Linear RGB**: Gamma-corrected RGB space
- **CIE XYZ**: CIE standard color space
- **CIE xyY**: Chromaticity + luminance representation
- **CIE L*a*b***: Perceptually uniform color space
- **CIE L*u*v***: Alternative perceptual color space
- **CIE L*C*h° (HCL)**: Polar coordinates of L*a*b* (better HSV)
- **CIE LCh(uv)**: Polar coordinates of L*u*v*
- **OkLab**: Improved perceptual color space
- **OkLch**: Polar coordinates of OkLab
- **HSLuv**: Better alternative to HSL
- **HPLuv**: Variant of HSLuv for pastel colors

### Color Operations

- **Distance calculations**: RGB, Lab, Luv, CIE76, CIE94, CIEDE2000, Riemersma
- **Color blending**: In RGB, Linear RGB, HSV, Lab, Luv, HCL, LuvLCh, OkLab, OkLch
- **Color validation**: Check if colors are in valid RGB gamut
- **Color clamping**: Force colors into valid RGB range

### Color Generation

- **Random colors**: Generate warm, happy, or random colors
- **Palette generation**: Create harmonious color palettes
- **Color sorting**: Sort colors for smooth visual transitions

## Installation

```bash
bun add @tsports/go-colorful
```

## Two API Styles

This package provides **two identical APIs** with different naming conventions:

1. **TypeScript Style** (default) - Uses camelCase methods and TypeScript conventions
2. **Go Style** - Uses exact Go naming conventions (PascalCase) for easy porting

Both APIs are functionally identical and produce the exact same results.

## Usage

### TypeScript Style API (Default)

```typescript
import { Color, Hex, HSV, Lab, HCL } from '@tsports/go-colorful';

// Create colors in different ways
const c1 = new Color(0.313725, 0.478431, 0.721569); // Direct RGB
const c2 = Hex("#517AB8");        // From hex string
const c3 = HSV(216.0, 0.56, 0.722); // From HSV
const c4 = Lab(0.507850, 0.040585, -0.370945); // From Lab
const c5 = HCL(276.2440, 0.373160, 0.507849);  // From HCL

console.log(c1.hex()); // "#517ab8"
// camelCase methods: isValid(), rgb255(), hsv(), lab(), etc.
```

### Go Style API (For Go Developers)

```typescript
import * as GoStyle from '@tsports/go-colorful/go-style';

// Same functionality, Go naming conventions
const c1 = new GoStyle.Color(0.313725, 0.478431, 0.721569); // R, G, B fields
const c2 = GoStyle.Hex("#517AB8");        // From hex string
const c3 = GoStyle.Hsv(216.0, 0.56, 0.722); // From HSV
const c4 = GoStyle.Lab(0.507850, 0.040585, -0.370945); // From Lab
const c5 = GoStyle.Hcl(276.2440, 0.373160, 0.507849);  // From HCL

console.log(c1.Hex()); // "#517ab8"
// PascalCase methods: IsValid(), RGB255(), Hsv(), Lab(), etc.
```

### Color Space Conversions

```typescript
// TypeScript Style
const color = Hex("#517AB8");
const [h, s, v] = color.hsv();
const [l, a, b] = color.lab();
const [hcl_h, c, hcl_l] = color.hcl();
const [r, g, b_255] = color.rgb255();

// Go Style - same results, different method names
const goColor = GoStyle.Hex("#517AB8");
const [h2, s2, v2] = goColor.Hsv();    // Note: Hsv not hsv
const [l2, a2, b2] = goColor.Lab();    // Note: Lab not lab
const [r2, g2, b2_255] = goColor.RGB255(); // Note: RGB255 not rgb255

console.log(`HSV: ${h.toFixed(1)}, ${s.toFixed(3)}, ${v.toFixed(3)}`);
```

### Color Distance & Comparison

```typescript
import { Color } from '@tsports/go-colorful';

const c1 = new Color(0.5, 0.1, 0.8);
const c2 = new Color(0.3, 0.2, 0.6);

// Different distance metrics
console.log('RGB distance:', c1.distanceRgb(c2));
console.log('Lab distance:', c1.distanceLab(c2)); // Perceptually accurate
console.log('CIEDE2000 distance:', c1.distanceCIEDE2000(c2)); // Most accurate
```

### Color Blending

```typescript
import { Hex } from '@tsports/go-colorful';

const warm = Hex("#fdffcc");
const cool = Hex("#242a42");

// Blend in different color spaces
const blended_rgb = warm.blendRgb(cool, 0.5);
const blended_lab = warm.blendLab(cool, 0.5);     // Better for gradients
const blended_hcl = warm.blendHcl(cool, 0.5);     // Best for most uses
```

### Random Color Generation

```typescript
import {
  FastWarmColor,
  WarmColor,
  FastHappyColor,
  HappyColor
} from '@tsports/go-colorful';

// Generate random colors
const warmColor = WarmColor();     // Slow but consistent
const fastWarm = FastWarmColor();  // Fast but less consistent

const happyColor = HappyColor();   // Bright colors
const fastHappy = FastHappyColor(); // Fast bright colors
```

### Palette Generation

```typescript
import {
  SoftPalette,
  WarmPalette,
  HappyPalette,
  FastWarmPalette
} from '@tsports/go-colorful';

// Generate color palettes
const [softColors, error] = SoftPalette(5);
const [warmColors, warmError] = WarmPalette(8);
const [happyColors, happyError] = HappyPalette(6);
const fastWarmColors = FastWarmPalette(10);

if (!error) {
  console.log('Generated', softColors.length, 'colors');
}
```

### Color Sorting

```typescript
import { Sorted, FastHappyPalette } from '@tsports/go-colorful';

// Generate random colors and sort them for smooth transitions
const randomColors = FastHappyPalette(20);
const sortedColors = Sorted(randomColors);

console.log('Colors sorted for smooth visual transition');
```

## API Compatibility

This TypeScript port provides 100% API compatibility with the original Go package:

### TypeScript Style API

- **Modern TypeScript conventions**: camelCase methods, lowercase properties
- **Best for new projects**: Follows TypeScript/JavaScript community standards
- **Examples**: `color.isValid()`, `color.distanceLab()`, `color.rgb255()`

### Go Style API

- **Identical to Go**: Exact method names, PascalCase, same signatures
- **Perfect for porting**: Copy Go code with minimal changes
- **Examples**: `color.IsValid()`, `color.DistanceLab()`, `color.RGB255()`

**Key Features of Both APIs:**

- Classes instead of structs (Color class vs Color struct)
- Error handling uses exceptions for invalid inputs instead of Go's error return pattern
- Some functions return tuples `[result, error]` to match Go's multiple return values
- **100% identical results** - both APIs produce exactly the same output

## Performance

The library includes both fast and accurate versions of many operations:

- `FastLinearRgb` vs `LinearRgb`
- `FastWarmColor` vs `WarmColor`
- `FastHappyPalette` vs `HappyPalette`

Fast versions use approximations and simpler color spaces (like HSV) while accurate versions use perceptually uniform spaces (like HCL) but are slower.

## Development

To install dependencies:

```bash
bun install
```

To run tests:

```bash
bun test
```

To build:

```bash
bun run build
```

## License

MIT License - same as the original go-colorful package.

## Credits

This is a port of the excellent [go-colorful](https://github.com/lucasb-eyer/go-colorful) library by Lucas Beyer and contributors. All color science and algorithms are from the original implementation.

---

<div align="center">
  <strong>Made with ❤️ by <a href="https://saulo.engineer">Saulo Vallory</a> <a href="https://github.com/svallory"><img src="assets/github.svg" alt="GitHub" style="vertical-align: middle; margin-left: 4px;"></a></strong>
</div>
