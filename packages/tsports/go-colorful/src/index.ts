/**
 * A TypeScript port of the go-colorful package for working with colors.
 *
 * Provides all kinds of functions for working with colors, including:
 * - Color space conversions (RGB, HSL, HSV, Lab, Luv, HCL, XYZ, etc.)
 * - Color distance calculations
 * - Color blending in various spaces
 * - Color generation (warm, happy colors)
 * - Palette generation
 * - Color sorting
 * - HSLuv color space support
 */

// Main Color class and factories
export * from './colors';

// Capitalized constructor aliases for compatibility
export {
  Hex,
  Hsv,
  Hsl,
  HSL,
  HSV,
  HCL,
  Hcl,
  HclWhiteRef,
  HPLuv,
  HpLuv,
  HSLuv,
  HsLuv,
  Lab,
  LabWhiteRef,
  Luv,
  LuvLCh,
  LuvLChWhiteRef,
  LuvWhiteRef,
  OkLab,
  OkLch,
  FastLinearRgb,
  LinearRgb,
  XYZ,
  Xyz,
  Xyy,
  MakeColor,
} from './colors';

// Utility functions
export { LabToHcl } from './colors';

// Constants
export { D50, D65, Delta } from './constants';

// Color generation
export {
  FastHappyColor,
  FastHappyColorWithRand,
  FastWarmColor,
  FastWarmColorWithRand,
  HappyColor,
  HappyColorWithRand,
  WarmColor,
  WarmColorWithRand,
} from './colorgens';

export { ErrUnsupportedType, HexColor } from './hexcolor';

// Palette generation - Happy
export {
  FastHappyPalette,
  FastHappyPaletteWithRand,
  HappyPalette,
  HappyPaletteWithRand,
} from './happy_palettegen';

// Palette generation - Warm
export {
  FastWarmPalette,
  FastWarmPaletteWithRand,
  WarmPalette,
  WarmPaletteWithRand,
} from './warm_palettegen';

// Palette generation - Soft
export {
  SoftPalette,
  SoftPaletteEx,
  SoftPaletteExWithRand,
  SoftPaletteWithRand,
  type SoftPaletteSettings,
} from './soft_palettegen';

// Types and interfaces
export type { RandInterface } from './rand';

// Color sorting
export { Sorted } from './sort';

// Go-style API (optional import for Go-like syntax)
export * as GoStyle from './go-style';
