/**
 * API compatibility verification tests
 * Tests that the TypeScript port provides the exact same API as the Go version
 */

import { expect, test } from 'bun:test';
import * as colorful from '../src';

test('All expected functions are exported', () => {
  // Core color constructors
  expect(typeof colorful.Color).toBe('function');
  expect(typeof colorful.Hex).toBe('function');
  expect(typeof colorful.HSL).toBe('function');
  expect(typeof colorful.HSV).toBe('function');
  expect(typeof colorful.Lab).toBe('function');
  expect(typeof colorful.LabWhiteRef).toBe('function');
  expect(typeof colorful.Luv).toBe('function');
  expect(typeof colorful.LuvWhiteRef).toBe('function');
  expect(typeof colorful.HCL).toBe('function');
  expect(typeof colorful.HclWhiteRef).toBe('function');
  expect(typeof colorful.LuvLCh).toBe('function');
  expect(typeof colorful.LuvLChWhiteRef).toBe('function');
  expect(typeof colorful.XYZ).toBe('function');
  expect(typeof colorful.Xyy).toBe('function');
  expect(typeof colorful.LinearRgb).toBe('function');
  expect(typeof colorful.FastLinearRgb).toBe('function');
  expect(typeof colorful.OkLab).toBe('function');
  expect(typeof colorful.OkLch).toBe('function');
  expect(typeof colorful.HSLuv).toBe('function');
  expect(typeof colorful.HPLuv).toBe('function');

  // Color generators
  expect(typeof colorful.FastWarmColor).toBe('function');
  expect(typeof colorful.FastWarmColorWithRand).toBe('function');
  expect(typeof colorful.WarmColor).toBe('function');
  expect(typeof colorful.WarmColorWithRand).toBe('function');
  expect(typeof colorful.FastHappyColor).toBe('function');
  expect(typeof colorful.FastHappyColorWithRand).toBe('function');
  expect(typeof colorful.HappyColor).toBe('function');
  expect(typeof colorful.HappyColorWithRand).toBe('function');

  // Palette generators
  expect(typeof colorful.FastWarmPalette).toBe('function');
  expect(typeof colorful.FastWarmPaletteWithRand).toBe('function');
  expect(typeof colorful.WarmPalette).toBe('function');
  expect(typeof colorful.WarmPaletteWithRand).toBe('function');
  expect(typeof colorful.FastHappyPalette).toBe('function');
  expect(typeof colorful.FastHappyPaletteWithRand).toBe('function');
  expect(typeof colorful.HappyPalette).toBe('function');
  expect(typeof colorful.HappyPaletteWithRand).toBe('function');
  expect(typeof colorful.SoftPalette).toBe('function');
  expect(typeof colorful.SoftPaletteWithRand).toBe('function');
  expect(typeof colorful.SoftPaletteEx).toBe('function');
  expect(typeof colorful.SoftPaletteExWithRand).toBe('function');

  // Color sorting
  expect(typeof colorful.Sorted).toBe('function');

  // Helper functions
  expect(typeof colorful.MakeColor).toBe('function');

  // Classes and interfaces
  expect(typeof colorful.HexColor).toBe('function');

  // Constants
  expect(typeof colorful.Delta).toBe('number');
  expect(Array.isArray(colorful.D65)).toBe(true);
  expect(Array.isArray(colorful.D50)).toBe(true);
});

test('Color methods are available', () => {
  const c = new colorful.Color(0.5, 0.3, 0.7);

  // Basic properties
  expect(typeof c.r).toBe('number');
  expect(typeof c.g).toBe('number');
  expect(typeof c.b).toBe('number');

  // Utility methods
  expect(typeof c.isValid).toBe('function');
  expect(typeof c.clamped).toBe('function');
  expect(typeof c.rgb255).toBe('function');
  expect(typeof c.hex).toBe('function');
  expect(typeof c.values).toBe('function');

  // Color space conversions
  expect(typeof c.hsv).toBe('function');
  expect(typeof c.hsl).toBe('function');
  expect(typeof c.linearRgb).toBe('function');
  expect(typeof c.fastLinearRgb).toBe('function');
  expect(typeof c.xyz).toBe('function');
  expect(typeof c.xyy).toBe('function');
  expect(typeof c.xyyWhiteRef).toBe('function');
  expect(typeof c.lab).toBe('function');
  expect(typeof c.labWhiteRef).toBe('function');
  expect(typeof c.luv).toBe('function');
  expect(typeof c.luvWhiteRef).toBe('function');
  expect(typeof c.hcl).toBe('function');
  expect(typeof c.hclWhiteRef).toBe('function');
  expect(typeof c.luvLCh).toBe('function');
  expect(typeof c.luvLChWhiteRef).toBe('function');
  expect(typeof c.okLab).toBe('function');
  expect(typeof c.okLch).toBe('function');
  expect(typeof c.hsLuv).toBe('function');
  expect(typeof c.hpLuv).toBe('function');

  // Distance calculations
  expect(typeof c.distanceRgb).toBe('function');
  expect(typeof c.distanceLinearRgb).toBe('function');
  expect(typeof c.distanceRiemersma).toBe('function');
  expect(typeof c.almostEqualRgb).toBe('function');
  expect(typeof c.distanceLab).toBe('function');
  expect(typeof c.distanceCIE76).toBe('function');
  expect(typeof c.distanceLuv).toBe('function');
  expect(typeof c.distanceHSLuv).toBe('function');
  expect(typeof c.distanceHPLuv).toBe('function');
  expect(typeof c.distanceCIE94).toBe('function');
  expect(typeof c.distanceCIEDE2000).toBe('function');
  expect(typeof c.distanceCIEDE2000klch).toBe('function');

  // Blending methods
  expect(typeof c.blendRgb).toBe('function');
  expect(typeof c.blendLinearRgb).toBe('function');
  expect(typeof c.blendHsv).toBe('function');
  expect(typeof c.blendLab).toBe('function');
  expect(typeof c.blendLuv).toBe('function');
  expect(typeof c.blendHcl).toBe('function');
  expect(typeof c.blendLuvLCh).toBe('function');
  expect(typeof c.blendOkLab).toBe('function');
  expect(typeof c.blendOkLch).toBe('function');
});

test('Color constructor compatibility', () => {
  // Test that Color constructor works like in Go
  const c1 = new colorful.Color(1.0, 0.5, 0.0);
  expect(c1.r).toBe(1.0);
  expect(c1.g).toBe(0.5);
  expect(c1.b).toBe(0.0);

  // Test hex constructor compatibility
  const c2 = colorful.Hex('#ff8000');
  expect(c2.r).toBe(1.0);
  expect(c2.g).toBeCloseTo(0.5019, 3);
  expect(c2.b).toBe(0.0);

  // Test that hex method works
  expect(c2.hex()).toBe('#ff8000');
});

test('Color space conversion consistency', () => {
  // Test round-trip conversions
  const original = new colorful.Color(0.7, 0.2, 0.9);

  // HSV round-trip
  const [h, s, v] = original.hsv();
  const fromHsv = colorful.HSV(h, s, v);
  expect(fromHsv.r).toBeCloseTo(original.r, 5);
  expect(fromHsv.g).toBeCloseTo(original.g, 5);
  expect(fromHsv.b).toBeCloseTo(original.b, 5);

  // Lab round-trip
  const [l, a, b] = original.lab();
  const fromLab = colorful.Lab(l, a, b);
  expect(fromLab.r).toBeCloseTo(original.r, 3);
  expect(fromLab.g).toBeCloseTo(original.g, 3);
  expect(fromLab.b).toBeCloseTo(original.b, 3);

  // HCL round-trip
  const [hcl_h, hcl_c, hcl_l] = original.hcl();
  const fromHcl = colorful.HCL(hcl_h, hcl_c, hcl_l);
  expect(fromHcl.r).toBeCloseTo(original.r, 3);
  expect(fromHcl.g).toBeCloseTo(original.g, 3);
  expect(fromHcl.b).toBeCloseTo(original.b, 3);
});

test('Constants have expected values', () => {
  expect(colorful.Delta).toBe(1.0 / 255.0);
  expect(colorful.D65).toEqual([0.95047, 1.0, 1.08883]);
  expect(colorful.D50).toEqual([0.96422, 1.0, 0.82521]);
});

test('Error handling compatibility', () => {
  // Test invalid hex colors throw errors
  expect(() => colorful.Hex('#invalid')).toThrow();
  expect(() => colorful.Hex('#12')).toThrow();
  expect(() => colorful.Hex('not-a-color')).toThrow();

  // Test SoftPalette returns error for invalid requests
  const [colors, error] = colorful.SoftPalette(100000);
  expect(error).not.toBeNull();
  expect(colors.length).toBe(0);
});
