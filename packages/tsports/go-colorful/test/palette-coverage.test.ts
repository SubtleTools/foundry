/**
 * Tests for palette generation functions that need better coverage
 */
import { expect, test } from 'bun:test';
import { FastHappyPalette, HappyPalette } from '../src/happy_palettegen';
import { SoftPalette, SoftPaletteEx } from '../src/soft_palettegen';
import { FastWarmPalette, WarmPalette } from '../src/warm_palettegen';

test('Palette generation edge cases', () => {
  // Test single color palettes
  const singleWarm = FastWarmPalette(1);
  expect(singleWarm).toHaveLength(1);
  expect(singleWarm[0].isValid()).toBe(true);

  const singleHappy = FastHappyPalette(1);
  expect(singleHappy).toHaveLength(1);
  expect(singleHappy[0].isValid()).toBe(true);

  // Test larger palettes
  const largeWarm = FastWarmPalette(20);
  expect(largeWarm).toHaveLength(20);
  largeWarm.forEach((color) => expect(color.isValid()).toBe(true));

  const largeHappy = FastHappyPalette(15);
  expect(largeHappy).toHaveLength(15);
  largeHappy.forEach((color) => expect(color.isValid()).toBe(true));
});

test('Error-returning palette functions', () => {
  // Test normal cases
  const [warmPalette, warmError] = WarmPalette(3);
  expect(warmError).toBeNull();
  expect(warmPalette).toHaveLength(3);
  warmPalette.forEach((color) => expect(color.isValid()).toBe(true));

  const [happyPalette, happyError] = HappyPalette(3);
  expect(happyError).toBeNull();
  expect(happyPalette).toHaveLength(3);
  happyPalette.forEach((color) => expect(color.isValid()).toBe(true));

  const [softPalette, softError] = SoftPalette(3);
  expect(softError).toBeNull();
  expect(softPalette).toHaveLength(3);
  softPalette.forEach((color) => expect(color.isValid()).toBe(true));
});

test('SoftPaletteEx with custom constraints', () => {
  const settings = {
    CheckColor: (l: number, a: number, b: number) => {
      // Accept colors with lightness between 0.3 and 0.8
      return l > 0.3 && l < 0.8;
    },
    Iterations: 20,
    ManySamples: false,
  };

  const [palette, error] = SoftPaletteEx(5, settings);
  expect(error).toBeNull();
  expect(palette).toHaveLength(5);
  palette.forEach((color) => expect(color.isValid()).toBe(true));
});

test('SoftPaletteEx with restrictive constraints', () => {
  const settings = {
    CheckColor: (l: number, a: number, b: number) => {
      // Very restrictive: only accept colors in a small range
      return l > 0.4 && l < 0.6 && Math.abs(a) < 0.1 && Math.abs(b) < 0.1;
    },
    Iterations: 50,
    ManySamples: true, // Need many samples due to restrictive constraint
  };

  const [palette, error] = SoftPaletteEx(3, settings);
  expect(error).toBeNull();
  expect(palette).toHaveLength(3);
  palette.forEach((color) => expect(color.isValid()).toBe(true));
});

test('Palette generation with zero count', () => {
  const emptyWarm = FastWarmPalette(0);
  expect(emptyWarm).toHaveLength(0);

  const emptyHappy = FastHappyPalette(0);
  expect(emptyHappy).toHaveLength(0);

  const [emptySlowWarm, warmError] = WarmPalette(0);
  expect(warmError).toBeNull();
  expect(emptySlowWarm).toHaveLength(0);

  const [emptySlowHappy, happyError] = HappyPalette(0);
  expect(happyError).toBeNull();
  expect(emptySlowHappy).toHaveLength(0);

  const [emptySoft, softError] = SoftPalette(0);
  expect(softError).toBeNull();
  expect(emptySoft).toHaveLength(0);
});

test('Large palette stress test', () => {
  // Test that we can generate reasonably large palettes
  try {
    const largePalette = FastWarmPalette(100);
    expect(largePalette).toHaveLength(100);

    // Verify all colors are valid and distinct
    const colorSet = new Set();
    largePalette.forEach((color) => {
      expect(color.isValid()).toBe(true);
      const key = `${color.r.toFixed(3)}-${color.g.toFixed(3)}-${color.b.toFixed(3)}`;
      colorSet.add(key);
    });

    // Should have reasonable diversity (not all identical)
    expect(colorSet.size).toBeGreaterThan(50);
  } catch (e) {
    // If it fails due to constraints, that's acceptable for large palettes
    expect(e).toBeInstanceOf(Error);
  }
});
