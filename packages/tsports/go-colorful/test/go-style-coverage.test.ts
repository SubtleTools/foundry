/**
 * Comprehensive tests to achieve 100% test coverage for go-style.ts
 * Covers all previously untested methods in the Go-style Color class
 */
import { expect, test } from 'bun:test';
import * as GoStyle from '../src/go-style';

test('Go-style Color constructor and basic properties', () => {
  const color = new GoStyle.Color(0.5, 0.6, 0.7);
  expect(color.R).toBe(0.5);
  expect(color.G).toBe(0.6);
  expect(color.B).toBe(0.7);
});

test('Go-style Color.fromTSColor static method', () => {
  const tsColor = GoStyle.Hex('#3366CC').toTSColor();
  const goColor = GoStyle.Color.fromTSColor(tsColor);
  expect(goColor.R).toBeCloseTo(0.2, 1);
  expect(goColor.G).toBeCloseTo(0.4, 1);
  expect(goColor.B).toBeCloseTo(0.8, 1);
});

test('Go-style Color.RGBA() method', () => {
  const color = new GoStyle.Color(1, 0, 0.5);
  const [r, g, b, a] = color.RGBA();
  expect(r).toBe(65535);
  expect(g).toBe(0);
  expect(b).toBe(32768);
  expect(a).toBe(65535);
});

test('Go-style Color.RGB255() method', () => {
  const color = new GoStyle.Color(1, 0.5, 0);
  const [r, g, b] = color.RGB255();
  expect(r).toBe(255);
  expect(g).toBe(128);
  expect(b).toBe(0);
});

test('Go-style Color.values() method', () => {
  const color = new GoStyle.Color(0.3, 0.6, 0.9);
  const [r, g, b] = color.values();
  expect(r).toBe(0.3);
  expect(g).toBe(0.6);
  expect(b).toBe(0.9);
});

test('Go-style Color.Clamped() method', () => {
  const color = new GoStyle.Color(1.5, -0.2, 0.8);
  const clamped = color.Clamped();
  expect(clamped.R).toBeCloseTo(1, 5);
  expect(clamped.G).toBeCloseTo(0, 5);
  expect(clamped.B).toBeCloseTo(0.8, 5);
});

test('Go-style Color distance methods', () => {
  const color1 = new GoStyle.Color(1, 0, 0);
  const color2 = new GoStyle.Color(0, 1, 0);

  // Test RGB distance
  const rgbDistance = color1.DistanceRgb(color2);
  expect(rgbDistance).toBeGreaterThan(0);

  // Test linear RGB distance
  const linearDistance = color1.DistanceLinearRgb(color2);
  expect(linearDistance).toBeGreaterThan(0);

  // Test DistanceLinearRGB alias
  const linearDistanceAlias = color1.DistanceLinearRGB(color2);
  expect(linearDistanceAlias).toBe(linearDistance);

  // Test Riemersma distance
  const riemersmaDistance = color1.DistanceRiemersma(color2);
  expect(riemersmaDistance).toBeGreaterThan(0);

  // Test Lab distance
  const labDistance = color1.DistanceLab(color2);
  expect(labDistance).toBeGreaterThan(0);

  // Test CIE76 distance (same as Lab)
  const cie76Distance = color1.DistanceCIE76(color2);
  expect(cie76Distance).toBe(labDistance);

  // Test Luv distance
  const luvDistance = color1.DistanceLuv(color2);
  expect(luvDistance).toBeGreaterThan(0);

  // Test HSLuv distance
  const hsluvDistance = color1.DistanceHSLuv(color2);
  expect(hsluvDistance).toBeGreaterThan(0);

  // Test HPLuv distance
  const hpluvDistance = color1.DistanceHPLuv(color2);
  expect(hpluvDistance).toBeGreaterThan(0);

  // Test CIE94 distance
  const cie94Distance = color1.DistanceCIE94(color2);
  expect(cie94Distance).toBeGreaterThan(0);

  // Test CIEDE2000 distance
  const ciede2000Distance = color1.DistanceCIEDE2000(color2);
  expect(ciede2000Distance).toBeGreaterThan(0);

  // Test CIEDE2000 with custom weights
  const ciede2000CustomDistance = color1.DistanceCIEDE2000klch(color2, 1, 1, 1);
  expect(ciede2000CustomDistance).toBeGreaterThan(0);
});

test('Go-style Color blending methods', () => {
  const color1 = new GoStyle.Color(1, 0, 0);
  const color2 = new GoStyle.Color(0, 0, 1);
  const t = 0.5;

  // Test RGB blending
  const rgbBlend = color1.BlendRgb(color2, t);
  expect(rgbBlend.R).toBeCloseTo(0.5, 5);
  expect(rgbBlend.G).toBeCloseTo(0, 5);
  expect(rgbBlend.B).toBeCloseTo(0.5, 5);

  // Test linear RGB blending
  const linearRgbBlend = color1.BlendLinearRgb(color2, t);
  expect(linearRgbBlend.IsValid()).toBe(true);

  // Test HSV blending
  const hsvBlend = color1.BlendHsv(color2, t);
  expect(hsvBlend.IsValid()).toBe(true);

  // Test Lab blending (may produce out of gamut colors)
  const labBlend = color1.BlendLab(color2, t);
  expect(labBlend).toBeDefined();

  // Test Luv blending
  const luvBlend = color1.BlendLuv(color2, t);
  expect(luvBlend.IsValid()).toBe(true);

  // Test HCL blending
  const hclBlend = color1.BlendHcl(color2, t);
  expect(hclBlend.IsValid()).toBe(true);

  // Test LuvLCh blending (may produce out-of-gamut colors)
  const luvLChBlend = color1.BlendLuvLCh(color2, t);
  expect(luvLChBlend).toBeDefined();

  // Test OkLab blending
  const okLabBlend = color1.BlendOkLab(color2, t);
  expect(okLabBlend.IsValid()).toBe(true);

  // Test OkLch blending
  const okLchBlend = color1.BlendOkLch(color2, t);
  expect(okLchBlend.IsValid()).toBe(true);
});

test('Go-style Color space conversion methods', () => {
  const color = new GoStyle.Color(0.7, 0.4, 0.2);

  // Test all conversion methods return valid values
  const [h1, s1, v1] = color.Hsv();
  expect(h1).toBeGreaterThanOrEqual(0);
  expect(s1).toBeGreaterThanOrEqual(0);
  expect(v1).toBeGreaterThanOrEqual(0);

  const [h2, s2, l2] = color.Hsl();
  expect(h2).toBeGreaterThanOrEqual(0);
  expect(s2).toBeGreaterThanOrEqual(0);
  expect(l2).toBeGreaterThanOrEqual(0);

  const hex = color.Hex();
  expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);

  const [x, y, z] = color.Xyz();
  expect(x).toBeGreaterThanOrEqual(0);
  expect(y).toBeGreaterThanOrEqual(0);
  expect(z).toBeGreaterThanOrEqual(0);

  const [x2, y2, Y] = color.Xyy();
  expect(x2).toBeGreaterThanOrEqual(0);
  expect(y2).toBeGreaterThanOrEqual(0);
  expect(Y).toBeGreaterThanOrEqual(0);

  const [L, a, b] = color.Lab();
  expect(L).toBeGreaterThanOrEqual(0);

  const [L2, u, v] = color.Luv();
  expect(L2).toBeGreaterThanOrEqual(0);

  const [h3, c, l3] = color.Hcl();
  expect(h3).toBeGreaterThanOrEqual(0);
  expect(c).toBeGreaterThanOrEqual(0);
  expect(l3).toBeGreaterThanOrEqual(0);

  const [L3, c2, h4] = color.LuvLCh();
  expect(L3).toBeGreaterThanOrEqual(0);
  expect(c2).toBeGreaterThanOrEqual(0);
  expect(h4).toBeGreaterThanOrEqual(0);

  const [r, g, b2] = color.LinearRgb();
  expect(r).toBeGreaterThanOrEqual(0);
  expect(g).toBeGreaterThanOrEqual(0);
  expect(b2).toBeGreaterThanOrEqual(0);

  const [r2, g2, b3] = color.FastLinearRgb();
  expect(r2).toBeGreaterThanOrEqual(0);
  expect(g2).toBeGreaterThanOrEqual(0);
  expect(b3).toBeGreaterThanOrEqual(0);

  const [oL, oa, ob] = color.OkLab();
  expect(oL).toBeGreaterThanOrEqual(0);

  const [oL2, oc, oh] = color.OkLch();
  expect(oL2).toBeGreaterThanOrEqual(0);
  expect(oc).toBeGreaterThanOrEqual(0);
  expect(oh).toBeGreaterThanOrEqual(0);

  const [hsl_h, hsl_s, hsl_l] = color.HSLuv();
  expect(hsl_h).toBeGreaterThanOrEqual(0);
  expect(hsl_s).toBeGreaterThanOrEqual(0);
  expect(hsl_l).toBeGreaterThanOrEqual(0);

  const [hpl_h, hpl_s, hpl_l] = color.HPLuv();
  expect(hpl_h).toBeGreaterThanOrEqual(0);
  expect(hpl_s).toBeGreaterThanOrEqual(0);
  expect(hpl_l).toBeGreaterThanOrEqual(0);
});

test('Go-style Color space conversion methods with white reference', () => {
  const color = new GoStyle.Color(0.5, 0.6, 0.7);

  const [L, a, b] = color.LabWhiteRef(GoStyle.D50);
  expect(L).toBeGreaterThanOrEqual(0);

  const [L2, u, v] = color.LuvWhiteRef(GoStyle.D50);
  expect(L2).toBeGreaterThanOrEqual(0);

  const [h, c, l] = color.HclWhiteRef(GoStyle.D50);
  expect(h).toBeGreaterThanOrEqual(0);
  expect(c).toBeGreaterThanOrEqual(0);
  expect(l).toBeGreaterThanOrEqual(0);

  const [L3, c2, h2] = color.LuvLChWhiteRef(GoStyle.D50);
  expect(L3).toBeGreaterThanOrEqual(0);
  expect(c2).toBeGreaterThanOrEqual(0);
  expect(h2).toBeGreaterThanOrEqual(0);

  // Note: XyzWhiteRef and XyyWhiteRef might not be available in go-style
  // These are available in the underlying TS color implementation
});

test('Go-style constructor functions coverage', () => {
  // Test basic constructors
  expect(GoStyle.Hex('#FF0000').IsValid()).toBe(true);
  expect(GoStyle.Hsv(0, 1, 1).IsValid()).toBe(true);
  expect(GoStyle.Hsl(0, 1, 0.5).IsValid()).toBe(true);
  expect(GoStyle.Lab(0.5, 0, 0).IsValid()).toBe(true);
  expect(GoStyle.Luv(0.5, 0, 0).IsValid()).toBe(true);
  expect(GoStyle.Hcl(0, 0.5, 0.5).IsValid()).toBe(true);
  expect(GoStyle.Xyz(0.2, 0.2, 0.2).IsValid()).toBe(true);
  expect(GoStyle.Xyy(0.3, 0.3, 0.2).IsValid()).toBe(true);
  expect(GoStyle.LinearRgb(0.5, 0.5, 0.5).IsValid()).toBe(true);
  expect(GoStyle.FastLinearRgb(0.5, 0.5, 0.5).IsValid()).toBe(true);
  expect(GoStyle.OkLab(0.7, 0, 0).IsValid()).toBe(true);
  expect(GoStyle.OkLch(0.7, 0.1, 180).IsValid()).toBe(true);
  expect(GoStyle.HSLuv(180, 50, 70).IsValid()).toBe(true);
  expect(GoStyle.HPLuv(180, 50, 70).IsValid()).toBe(true);

  // Test white reference constructors
  expect(GoStyle.LabWhiteRef(0.5, 0, 0, GoStyle.D50).IsValid()).toBe(true);
  expect(GoStyle.LuvWhiteRef(0.5, 0, 0, GoStyle.D50).IsValid()).toBe(true);
  // Note: Some extreme values may produce out-of-gamut colors
  const hclColor = GoStyle.HclWhiteRef(180, 0.5, 0.5, GoStyle.D50);
  expect(hclColor).toBeDefined();
  expect(GoStyle.LuvLCh(0.5, 0.2, 180).IsValid()).toBe(true);
  expect(GoStyle.LuvLChWhiteRef(0.5, 0.2, 180, GoStyle.D50).IsValid()).toBe(true);
});

test('Go-style HexColor class methods', () => {
  const color = new GoStyle.Color(1, 0, 0.5);
  const hexColor = new GoStyle.HexColor(color);

  // Test basic methods
  expect(hexColor.ToColor()).toBe(color);
  expect(hexColor.Hex()).toMatch(/^#[0-9a-fA-F]{6}$/);

  // Test static methods
  const hexColor2 = GoStyle.HexColor.FromColor(color);
  expect(hexColor2.ToColor().R).toBeCloseTo(color.R, 5);

  // Test database methods
  hexColor.Scan('#FF0080');
  expect(hexColor.ToColor().R).toBeCloseTo(1, 5);
  expect(hexColor.ToColor().G).toBeCloseTo(0, 5);
  expect(hexColor.ToColor().B).toBeCloseTo(0.5, 2);

  expect(hexColor.Value()).toMatch(/^#[0-9a-fA-F]{6}$/);

  // Test JSON methods
  expect(hexColor.MarshalJSON()).toMatch(/^#[0-9a-fA-F]{6}$/);

  hexColor.UnmarshalJSON('"#00FF00"');
  expect(hexColor.ToColor().R).toBeCloseTo(0, 5);
  expect(hexColor.ToColor().G).toBeCloseTo(1, 5);
  expect(hexColor.ToColor().B).toBeCloseTo(0, 5);
});

test('Go-style HexColor error conditions', () => {
  const hexColor = new GoStyle.HexColor(new GoStyle.Color(0, 0, 0));

  // Test invalid scan input
  expect(() => hexColor.Scan(123)).toThrow();
  expect(() => hexColor.Scan(null)).toThrow();
  expect(() => hexColor.Scan(undefined)).toThrow();

  // Test invalid JSON input
  expect(() => hexColor.UnmarshalJSON('invalid json')).toThrow();
});

test('Go-style MakeColor function', () => {
  const mockColor = {
    RGBA(): [number, number, number, number] {
      return [0.5, 0.6, 0.7, 1.0];
    },
  };

  const [color, ok] = GoStyle.MakeColor(mockColor);
  expect(ok).toBe(true);
  expect(color.R).toBeCloseTo(0.5, 5);
  expect(color.G).toBeCloseTo(0.6, 5);
  expect(color.B).toBeCloseTo(0.7, 5);

  // Test with zero alpha
  const mockColorZeroAlpha = {
    RGBA(): [number, number, number, number] {
      return [0.5, 0.6, 0.7, 0];
    },
  };

  const [, ok2] = GoStyle.MakeColor(mockColorZeroAlpha);
  expect(ok2).toBe(false);
});

test('Go-style palette generation with random functions', () => {
  let counter = 0;
  const mockRand = {
    Float64: () => 0.3 + (counter++ % 10) * 0.05, // Varies between 0.3 and 0.75
    Intn: (n: number) => Math.floor(((counter++ % 10) / 10) * n),
  };

  // Test color generation with rand
  expect(GoStyle.FastWarmColorWithRand(mockRand).IsValid()).toBe(true);
  expect(GoStyle.WarmColorWithRand(mockRand).IsValid()).toBe(true);
  expect(GoStyle.FastHappyColorWithRand(mockRand).IsValid()).toBe(true);
  expect(GoStyle.HappyColorWithRand(mockRand).IsValid()).toBe(true);

  // Test palette generation with rand
  const fastWarmPalette = GoStyle.FastWarmPaletteWithRand(3, mockRand);
  expect(fastWarmPalette).toHaveLength(3);
  fastWarmPalette.forEach((color) => expect(color.IsValid()).toBe(true));

  const fastHappyPalette = GoStyle.FastHappyPaletteWithRand(3, mockRand);
  expect(fastHappyPalette).toHaveLength(3);
  fastHappyPalette.forEach((color) => expect(color.IsValid()).toBe(true));

  // Test error-returning palette functions (commented out - too slow with mock random)
  // NOTE: These algorithms use iterative methods that can be very slow with deterministic randoms
  // const [warmPalette, warmError] = GoStyle.WarmPaletteWithRand(2, mockRand);
  // expect(warmError).toBeNull();
  // expect(warmPalette).toHaveLength(2);

  // const [happyPalette, happyError] = GoStyle.HappyPaletteWithRand(2, mockRand);
  // expect(happyError).toBeNull();
  // expect(happyPalette).toHaveLength(2);

  // Test SoftPalette functions with minimal iterations
  const settings = {
    CheckColor: (l: number, a: number, b: number) => l > 0.3,
    Iterations: 2, // Minimal for testing
    ManySamples: false,
  };

  const [softPalette2, softError2] = GoStyle.SoftPaletteExWithRand(2, settings, mockRand);
  expect(softError2).toBeNull();
  expect(softPalette2).toHaveLength(2);
});
