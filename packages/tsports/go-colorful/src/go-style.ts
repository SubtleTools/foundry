/**
 * Go-style API wrapper that provides identical naming and function signatures to the Go colorful package.
 * This module wraps the TypeScript implementation to match Go conventions exactly.
 */

import {
  Color as TSColor,
  fastLinearRgb,
  hcl,
  hclWhiteRef,
  hex,
  hpLuv,
  hsLuv,
  hsl,
  hsv,
  lab,
  labWhiteRef,
  linearRgb,
  luv,
  luvLCh,
  luvLChWhiteRef,
  luvWhiteRef,
  makeColor,
  okLab,
  okLch,
  xyy,
  xyz,
} from './colors';
import { D50 as TSD50, D65 as TSD65, Delta as TSDelta } from './constants';
import {
  FastHappyColor as TSFastHappyColor,
  FastHappyColorWithRand as TSFastHappyColorWithRand,
  FastWarmColor as TSFastWarmColor,
  FastWarmColorWithRand as TSFastWarmColorWithRand,
  HappyColor as TSHappyColor,
  HappyColorWithRand as TSHappyColorWithRand,
  WarmColor as TSWarmColor,
  WarmColorWithRand as TSWarmColorWithRand,
} from './colorgens';
import {
  FastHappyPalette as TSFastHappyPalette,
  FastHappyPaletteWithRand as TSFastHappyPaletteWithRand,
  HappyPalette as TSHappyPalette,
  HappyPaletteWithRand as TSHappyPaletteWithRand,
} from './happy_palettegen';
import {
  FastWarmPalette as TSFastWarmPalette,
  FastWarmPaletteWithRand as TSFastWarmPaletteWithRand,
  WarmPalette as TSWarmPalette,
  WarmPaletteWithRand as TSWarmPaletteWithRand,
} from './warm_palettegen';
import {
  SoftPalette as TSSoftPalette,
  SoftPaletteEx as TSSoftPaletteEx,
  SoftPaletteExWithRand as TSSoftPaletteExWithRand,
  SoftPaletteWithRand as TSSoftPaletteWithRand,
  type SoftPaletteSettings as TSSoftPaletteSettings,
} from './soft_palettegen';
import { Sorted as TSSorted } from './sort';

// Re-export standalone conversion functions with Go-style PascalCase names
export {
  XyzToLinearRgb,
  LinearRgbToXyz,
  XyzToLab,
  XyzToLabWhiteRef,
  LabToXyz,
  LabToXyzWhiteRef,
  XyzToLuv,
  XyzToLuvWhiteRef,
  LuvToXyz,
  LuvToXyzWhiteRef,
  XyzToXyy,
  XyzToXyyWhiteRef,
  XyyToXyz,
  LabToHcl,
  HclToLab,
  LuvToLuvLCh,
  LuvLChToLuv,
  XyzToOkLab,
  OkLabToXyz,
  OkLabToOkLch,
  OkLchToOkLab,
  XyzToOkLch,
  OkLchToXyz,
} from './colors';

// Re-export HSLuv conversion functions with Go-style names
export {
  luvLChToHSLuv as LuvLChToHSLuv,
  hsLuvToLuvLCh as HSLuvToLuvLCh,
  luvLChToHPLuv as LuvLChToHPLuv,
  hpLuvToLuvLCh as HPLuvToLuvLCh,
} from './hsluv';

// Type Color represents a color in sRGB space with RGB values in [0..1]
export class Color {
  R: number;
  G: number;
  B: number;

  constructor(R: number, G: number, B: number) {
    this.R = R;
    this.G = G;
    this.B = B;
  }

  toTSColor(): TSColor {
    return new TSColor(this.R, this.G, this.B);
  }

  static fromTSColor(c: TSColor): Color {
    return new Color(c.r, c.g, c.b);
  }

  // Standard Go color.Color interface
  RGBA(): [number, number, number, number] {
    return this.toTSColor().rgba();
  }

  // RGB255 returns RGB values as 8-bit integers
  RGB255(): [number, number, number] {
    return this.toTSColor().rgb255();
  }

  // values is used to simplify HSLuv testing
  values(): [number, number, number] {
    return [this.R, this.G, this.B];
  }

  // IsValid checks whether the color exists in RGB space, i.e. all values are in [0..1]
  IsValid(): boolean {
    return this.toTSColor().isValid();
  }

  // Clamped returns color clamped to valid range, clamping each value to [0..1]
  Clamped(): Color {
    return Color.fromTSColor(this.toTSColor().clamped());
  }

  /// Distance Functions ///

  // DistanceRgb computes the distance between two colors in RGB space.
  // This is not a good measure! Rather do it in Lab space.
  DistanceRgb(c2: Color): number {
    return this.toTSColor().distanceRgb(c2.toTSColor());
  }

  // DistanceLinearRgb computes the distance between two colors in linear RGB
  // space. This is not useful for measuring how humans perceive color.
  DistanceLinearRgb(c2: Color): number {
    return this.toTSColor().distanceLinearRgb(c2.toTSColor());
  }

  // DistanceLinearRGB is an alias for DistanceLinearRgb (matches Go exactly)
  DistanceLinearRGB(c2: Color): number {
    return this.DistanceLinearRgb(c2);
  }

  // DistanceRiemersma is a color distance algorithm developed by Thiadmer Riemersma
  DistanceRiemersma(c2: Color): number {
    return this.toTSColor().distanceRiemersma(c2.toTSColor());
  }

  // AlmostEqualRgb tests whether two colors are approximately equal in RGB space
  AlmostEqualRgb(c2: Color): boolean {
    return this.toTSColor().almostEqualRgb(c2.toTSColor());
  }

  // DistanceLab is an alias for DistanceCIE76 (perceptual color distance in Lab space)
  DistanceLab(c2: Color): number {
    return this.toTSColor().distanceLab(c2.toTSColor());
  }

  // DistanceCIE76 computes CIE76 color difference (ΔE*76) in Lab space
  DistanceCIE76(c2: Color): number {
    return this.toTSColor().distanceCIE76(c2.toTSColor());
  }

  // DistanceLuv computes color difference in Luv space
  DistanceLuv(c2: Color): number {
    return this.toTSColor().distanceLuv(c2.toTSColor());
  }

  // DistanceHSLuv computes color difference in HSLuv space
  DistanceHSLuv(c2: Color): number {
    return this.toTSColor().distanceHSLuv(c2.toTSColor());
  }

  // DistanceHPLuv computes color difference in HPLuv space
  DistanceHPLuv(c2: Color): number {
    return this.toTSColor().distanceHPLuv(c2.toTSColor());
  }

  // DistanceCIE94 computes CIE94 color difference (ΔE*94) in Lab space
  DistanceCIE94(c2: Color): number {
    return this.toTSColor().distanceCIE94(c2.toTSColor());
  }

  // DistanceCIEDE2000 computes CIEDE2000 color difference (ΔE*00) in Lab space
  DistanceCIEDE2000(c2: Color): number {
    return this.toTSColor().distanceCIEDE2000(c2.toTSColor());
  }

  // DistanceCIEDE2000klch computes CIEDE2000 color difference with custom kL, kC, kH
  DistanceCIEDE2000klch(c2: Color, kL: number, kC: number, kH: number): number {
    return this.toTSColor().distanceCIEDE2000klch(c2.toTSColor(), kL, kC, kH);
  }

  /// Blending Functions ///

  // BlendRgb blends two colors in RGB space
  BlendRgb(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendRgb(c2.toTSColor(), t));
  }

  // BlendLinearRgb blends two colors in linear RGB space
  BlendLinearRgb(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendLinearRgb(c2.toTSColor(), t));
  }

  // BlendHsv blends two colors in HSV space
  BlendHsv(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendHsv(c2.toTSColor(), t));
  }

  // BlendLab blends two colors in Lab space
  BlendLab(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendLab(c2.toTSColor(), t));
  }

  // BlendLuv blends two colors in Luv space
  BlendLuv(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendLuv(c2.toTSColor(), t));
  }

  // BlendHcl blends two colors in HCL space
  BlendHcl(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendHcl(c2.toTSColor(), t));
  }

  // BlendLuvLCh blends two colors in LuvLCh space
  BlendLuvLCh(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendLuvLCh(c2.toTSColor(), t));
  }

  // BlendOkLab blends two colors in OkLab space
  BlendOkLab(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendOkLab(c2.toTSColor(), t));
  }

  // BlendOkLch blends two colors in OkLch space
  BlendOkLch(c2: Color, t: number): Color {
    return Color.fromTSColor(this.toTSColor().blendOkLch(c2.toTSColor(), t));
  }

  /// Color Space Conversions ///

  // Hsv converts the color to HSV space
  Hsv(): [number, number, number] {
    return this.toTSColor().hsv();
  }

  // Hsl converts the color to HSL space
  Hsl(): [number, number, number] {
    return this.toTSColor().hsl();
  }

  // Hex converts the color to a hex string
  Hex(): string {
    return this.toTSColor().hex();
  }

  // hex is a lowercase alias for Hex for compatibility
  hex(): string {
    return this.Hex();
  }

  // LinearRgb converts the color to linear RGB
  LinearRgb(): [number, number, number] {
    return this.toTSColor().linearRgb();
  }

  // FastLinearRgb converts the color to linear RGB using fast approximation
  FastLinearRgb(): [number, number, number] {
    return this.toTSColor().fastLinearRgb();
  }

  // Xyz converts the color to CIE XYZ space using D65 white point
  Xyz(): [number, number, number] {
    return this.toTSColor().xyz();
  }

  // Xyy converts the color to CIE xyY space using D65 white point
  Xyy(): [number, number, number] {
    return this.toTSColor().xyy();
  }

  // XyyWhiteRef converts the color to CIE xyY space with custom white point
  XyyWhiteRef(wref: [number, number, number]): [number, number, number] {
    return this.toTSColor().xyyWhiteRef(wref);
  }

  // Lab converts the color to CIE L*a*b* space using D65 white point
  Lab(): [number, number, number] {
    return this.toTSColor().lab();
  }

  // LabWhiteRef converts the color to CIE L*a*b* space with custom white point
  LabWhiteRef(wref: [number, number, number]): [number, number, number] {
    return this.toTSColor().labWhiteRef(wref);
  }

  // Luv converts the color to CIE L*u*v* space using D65 white point
  Luv(): [number, number, number] {
    return this.toTSColor().luv();
  }

  // LuvWhiteRef converts the color to CIE L*u*v* space with custom white point
  LuvWhiteRef(wref: [number, number, number]): [number, number, number] {
    return this.toTSColor().luvWhiteRef(wref);
  }

  // Hcl converts the color to CIE L*C*h° (HCL) space using D65 white point
  Hcl(): [number, number, number] {
    return this.toTSColor().hcl();
  }

  // HclWhiteRef converts the color to CIE L*C*h° (HCL) space with custom white point
  HclWhiteRef(wref: [number, number, number]): [number, number, number] {
    return this.toTSColor().hclWhiteRef(wref);
  }

  // LuvLCh converts the color to LuvLCh space using D65 white point
  LuvLCh(): [number, number, number] {
    return this.toTSColor().luvLCh();
  }

  // LuvLChWhiteRef converts the color to LuvLCh space with custom white point
  LuvLChWhiteRef(wref: [number, number, number]): [number, number, number] {
    return this.toTSColor().luvLChWhiteRef(wref);
  }

  // OkLab converts the color to OkLab space
  OkLab(): [number, number, number] {
    return this.toTSColor().okLab();
  }

  // OkLch converts the color to OkLch space
  OkLch(): [number, number, number] {
    return this.toTSColor().okLch();
  }

  // HSLuv converts the color to HSLuv space
  HSLuv(): [number, number, number] {
    return this.toTSColor().hsLuv();
  }

  // HPLuv converts the color to HPLuv space
  HPLuv(): [number, number, number] {
    return this.toTSColor().hpLuv();
  }
}

/// Constants ///

// Delta is the tolerance used when comparing colors using AlmostEqualRgb
export const Delta = TSDelta;

// D65 is the default reference white point
export const D65: [number, number, number] = TSD65 as [number, number, number];

// D50 is another common reference white point
export const D50: [number, number, number] = TSD50 as [number, number, number];

/// Constructor Functions ///

// MakeColor constructs a colorful.Color from something implementing color.Color
export function MakeColor(col: { RGBA(): [number, number, number, number] }): [Color, boolean] {
  const [r, g, b, a] = col.RGBA();
  const [tsColor, ok] = makeColor({ r, g, b, a });
  return [Color.fromTSColor(tsColor), ok];
}

// Hex parses a hex color string and returns a Color
export function Hex(hexCode: string): Color {
  return Color.fromTSColor(hex(hexCode));
}

// Hsv creates a color from HSV values
export function Hsv(h: number, s: number, v: number): Color {
  return Color.fromTSColor(hsv(h, s, v));
}

// Hsl creates a color from HSL values
export function Hsl(h: number, s: number, l: number): Color {
  return Color.fromTSColor(hsl(h, s, l));
}

// Lab creates a color from CIE L*a*b* values using D65 white point
export function Lab(l: number, a: number, b: number): Color {
  return Color.fromTSColor(lab(l, a, b));
}

// LabWhiteRef creates a color from CIE L*a*b* values with custom white point
export function LabWhiteRef(
  l: number,
  a: number,
  b: number,
  wref: [number, number, number]
): Color {
  return Color.fromTSColor(labWhiteRef(l, a, b, wref));
}

// Luv creates a color from CIE L*u*v* values using D65 white point
export function Luv(l: number, u: number, v: number): Color {
  return Color.fromTSColor(luv(l, u, v));
}

// LuvWhiteRef creates a color from CIE L*u*v* values with custom white point
export function LuvWhiteRef(
  l: number,
  u: number,
  v: number,
  wref: [number, number, number]
): Color {
  return Color.fromTSColor(luvWhiteRef(l, u, v, wref));
}

// Hcl creates a color from CIE L*C*h° (HCL) values using D65 white point
export function Hcl(h: number, c: number, l: number): Color {
  return Color.fromTSColor(hcl(h, c, l));
}

// HclWhiteRef creates a color from CIE L*C*h° (HCL) values with custom white point
export function HclWhiteRef(
  h: number,
  c: number,
  l: number,
  wref: [number, number, number]
): Color {
  return Color.fromTSColor(hclWhiteRef(h, c, l, wref));
}

// LuvLCh creates a color from LuvLCh values using D65 white point
export function LuvLCh(l: number, c: number, h: number): Color {
  return Color.fromTSColor(luvLCh(l, c, h));
}

// LuvLChWhiteRef creates a color from LuvLCh values with custom white point
export function LuvLChWhiteRef(
  l: number,
  c: number,
  h: number,
  wref: [number, number, number]
): Color {
  return Color.fromTSColor(luvLChWhiteRef(l, c, h, wref));
}

// Xyz creates a color from CIE XYZ values
export function Xyz(x: number, y: number, z: number): Color {
  return Color.fromTSColor(xyz(x, y, z));
}

// Xyy creates a color from CIE xyY values
export function Xyy(x: number, y: number, Y: number): Color {
  return Color.fromTSColor(xyy(x, y, Y));
}

// LinearRgb creates a color from linear RGB values
export function LinearRgb(r: number, g: number, b: number): Color {
  return Color.fromTSColor(linearRgb(r, g, b));
}

// FastLinearRgb creates a color from linear RGB values using fast approximation
export function FastLinearRgb(r: number, g: number, b: number): Color {
  return Color.fromTSColor(fastLinearRgb(r, g, b));
}

// OkLab creates a color from OkLab values
export function OkLab(l: number, a: number, b: number): Color {
  return Color.fromTSColor(okLab(l, a, b));
}

// OkLch creates a color from OkLch values
export function OkLch(l: number, c: number, h: number): Color {
  return Color.fromTSColor(okLch(l, c, h));
}

// HSLuv creates a color from HSLuv values
export function HSLuv(h: number, s: number, l: number): Color {
  return Color.fromTSColor(hsLuv(h, s, l));
}

// HPLuv creates a color from HPLuv values
export function HPLuv(h: number, s: number, l: number): Color {
  return Color.fromTSColor(hpLuv(h, s, l));
}

/// Color Generation Functions ///

// FastWarmColor generates a random warm color using fast approximation
export function FastWarmColor(): Color {
  return Color.fromTSColor(TSFastWarmColor());
}

// WarmColor generates a random warm color
export function WarmColor(): Color {
  return Color.fromTSColor(TSWarmColor());
}

// FastHappyColor generates a random happy color using fast approximation
export function FastHappyColor(): Color {
  return Color.fromTSColor(TSFastHappyColor());
}

// HappyColor generates a random happy color
export function HappyColor(): Color {
  return Color.fromTSColor(TSHappyColor());
}

// FastWarmColorWithRand generates a random warm color with custom random source
export function FastWarmColorWithRand(rand: RandInterface): Color {
  // Convert Go-style rand to TypeScript-style rand
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  return Color.fromTSColor(TSFastWarmColorWithRand(tsRand));
}

// WarmColorWithRand generates a random warm color with custom random source
export function WarmColorWithRand(rand: RandInterface): Color {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  return Color.fromTSColor(TSWarmColorWithRand(tsRand));
}

// FastHappyColorWithRand generates a random happy color with custom random source
export function FastHappyColorWithRand(rand: RandInterface): Color {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  return Color.fromTSColor(TSFastHappyColorWithRand(tsRand));
}

// HappyColorWithRand generates a random happy color with custom random source
export function HappyColorWithRand(rand: RandInterface): Color {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  return Color.fromTSColor(TSHappyColorWithRand(tsRand));
}

/// Palette Generation Functions ///

// FastWarmPalette generates a palette of warm colors using fast approximation
export function FastWarmPalette(colorsCount: number): Color[] {
  return TSFastWarmPalette(colorsCount).map((c) => Color.fromTSColor(c));
}

// WarmPalette generates a palette of warm colors
export function WarmPalette(colorsCount: number): [Color[], Error | null] {
  const [colors, error] = TSWarmPalette(colorsCount);
  return [colors.map((c) => Color.fromTSColor(c)), error];
}

// FastHappyPalette generates a palette of happy colors using fast approximation
export function FastHappyPalette(colorsCount: number): Color[] {
  return TSFastHappyPalette(colorsCount).map((c) => Color.fromTSColor(c));
}

// HappyPalette generates a palette of happy colors
export function HappyPalette(colorsCount: number): [Color[], Error | null] {
  const [colors, error] = TSHappyPalette(colorsCount);
  return [colors.map((c) => Color.fromTSColor(c)), error];
}

// SoftPalette generates a palette of soft, harmonious colors
export function SoftPalette(colorsCount: number): [Color[], Error | null] {
  const [colors, error] = TSSoftPalette(colorsCount);
  return [colors.map((c) => Color.fromTSColor(c)), error];
}

// SoftPaletteEx generates a palette of soft colors with custom settings
export function SoftPaletteEx(
  colorsCount: number,
  settings: SoftPaletteSettings
): [Color[], Error | null] {
  const [colors, error] = TSSoftPaletteEx(colorsCount, settings);
  return [colors.map((c) => Color.fromTSColor(c)), error];
}

// FastWarmPaletteWithRand generates warm colors with custom random source
export function FastWarmPaletteWithRand(colorsCount: number, rand: RandInterface): Color[] {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  return TSFastWarmPaletteWithRand(colorsCount, tsRand).map((c) => Color.fromTSColor(c));
}

// WarmPaletteWithRand generates warm colors with custom random source
export function WarmPaletteWithRand(
  colorsCount: number,
  rand: RandInterface
): [Color[], Error | null] {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  const [colors, error] = TSWarmPaletteWithRand(colorsCount, tsRand);
  return [colors.map((c) => Color.fromTSColor(c)), error];
}

// FastHappyPaletteWithRand generates happy colors with custom random source
export function FastHappyPaletteWithRand(colorsCount: number, rand: RandInterface): Color[] {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  return TSFastHappyPaletteWithRand(colorsCount, tsRand).map((c) => Color.fromTSColor(c));
}

// HappyPaletteWithRand generates happy colors with custom random source
export function HappyPaletteWithRand(
  colorsCount: number,
  rand: RandInterface
): [Color[], Error | null] {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  const [colors, error] = TSHappyPaletteWithRand(colorsCount, tsRand);
  return [colors.map((c) => Color.fromTSColor(c)), error];
}

// SoftPaletteWithRand generates soft colors with custom random source
export function SoftPaletteWithRand(
  colorsCount: number,
  rand: RandInterface
): [Color[], Error | null] {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  const [colors, error] = TSSoftPaletteWithRand(colorsCount, tsRand);
  return [colors.map((c) => Color.fromTSColor(c)), error];
}

// SoftPaletteExWithRand generates soft colors with custom settings and random source
export function SoftPaletteExWithRand(
  colorsCount: number,
  settings: SoftPaletteSettings,
  rand: RandInterface
): [Color[], Error | null] {
  const tsRand = {
    float64: () => rand.Float64(),
    intn: (n: number) => rand.Intn(n),
  };
  const [colors, error] = TSSoftPaletteExWithRand(colorsCount, settings, tsRand);
  return [colors.map((c) => Color.fromTSColor(c)), error];
}

/// Color Sorting ///

// Sorted sorts colors for smooth transitions using minimum spanning tree
export function Sorted(colors: Color[]): Color[] {
  const tsColors = colors.map((c) => c.toTSColor());
  return TSSorted(tsColors).map((c) => Color.fromTSColor(c));
}

/// Type Aliases and Interfaces ///

// RandInterface defines the interface for custom random number generators (Go-style)
export interface RandInterface {
  Float64(): number;
  Intn(n: number): number;
}

// SoftPaletteSettings defines settings for soft palette generation
export type SoftPaletteSettings = TSSoftPaletteSettings;

// HexColor provides database and JSON serialization support
export class HexColor {
  Color: Color;

  constructor(color: Color) {
    this.Color = color;
  }

  static FromColor(color: Color): HexColor {
    return new HexColor(color);
  }

  ToColor(): Color {
    return this.Color;
  }

  // Convert to hex string
  Hex(): string {
    return this.Color.Hex();
  }

  // Database/SQL interfaces
  Scan(value: unknown): void {
    if (typeof value !== 'string') {
      throw new Error(`unsupported type: got ${typeof value}, want a string`);
    }
    this.Color = Hex(value);
  }

  Value(): string {
    return this.Hex();
  }

  // JSON interfaces
  MarshalJSON(): string {
    return this.Hex();
  }

  UnmarshalJSON(data: string): void {
    let hexCode: string;
    try {
      hexCode = JSON.parse(data);
    } catch (err) {
      throw new Error(`invalid JSON: ${err}`);
    }
    this.Color = Hex(hexCode);
  }
}

/// Go-Compatible Deterministic Palette Generation ///

import { GO_DEFAULT_SEED, newSeededRand } from './go-compatible-rand';

/**
 * FastWarmPaletteSeeded generates a warm palette with a specific seed for deterministic output.
 * This function can produce identical results to Go's FastWarmPalette when using the same seed.
 *
 * @param colorsCount Number of colors to generate
 * @param seed Random seed (default: 1, same as Go's default)
 * @returns Array of warm colors
 */
export function FastWarmPaletteSeeded(
  colorsCount: number,
  seed: number = GO_DEFAULT_SEED
): Color[] {
  return FastWarmPaletteWithRand(colorsCount, newSeededRand(seed));
}

/**
 * FastHappyPaletteSeeded generates a happy palette with a specific seed for deterministic output.
 * This function can produce identical results to Go's FastHappyPalette when using the same seed.
 *
 * @param colorsCount Number of colors to generate
 * @param seed Random seed (default: 1, same as Go's default)
 * @returns Array of happy colors
 */
export function FastHappyPaletteSeeded(
  colorsCount: number,
  seed: number = GO_DEFAULT_SEED
): Color[] {
  return FastHappyPaletteWithRand(colorsCount, newSeededRand(seed));
}
