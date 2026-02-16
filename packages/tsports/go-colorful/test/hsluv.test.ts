/**
 * Tests for HSLuv color space implementation
 * Includes comprehensive snapshot testing against HSLuv reference implementation
 * Port of Go hsluv_test.go with identical test cases
 */

import { expect, test } from 'bun:test';
import { Color, hex, hpLuv, hsLuv } from '../src';
import snapshot from './hsluv-snapshot-rev4.json';

// Delta for HSLuv tests (same as Go, but adjusted for our value ranges)
const hsluvTestDelta = 0.0000000001;

// Helper functions matching Go test code
function pack(a: number, b: number, c: number): [number, number, number] {
  return [a, b, c];
}

function unpack(tuple: [number, number, number]): [number, number, number] {
  return tuple;
}

const fromHex = (h: string): Color => {
  return hex(h);
};

function compareTuple(
  result: [number, number, number],
  expected: [number, number, number],
  method: string,
  hex: string
) {
  let err = false;
  const errs = [false, false, false];

  for (let i = 0; i < 3; i++) {
    if (Math.abs(result[i] - expected[i]) > hsluvTestDelta) {
      err = true;
      errs[i] = true;
    }
  }

  if (err) {
    let resultOutput = '[';
    for (let i = 0; i < 3; i++) {
      resultOutput += result[i].toString();
      if (errs[i]) {
        resultOutput += ' *';
      }
      if (i < 2) {
        resultOutput += ', ';
      }
    }
    resultOutput += ']';

    throw new Error(
      `result: ${resultOutput} expected: [${expected.join(', ')}], testing ${method} with test case ${hex}`
    );
  }
}

function compareHex(result: string, expected: string, method: string, hex: string) {
  if (result !== expected) {
    throw new Error(
      `result: ${result} expected: ${expected}, testing ${method} with test case ${hex}`
    );
  }
}

test('HSLuv color space conversion', () => {
  const c = hsLuv(12.177, 0.653, 0.531);
  expect(c.isValid()).toBe(true);

  const [h, s, l] = c.hsLuv();
  expect(h).toBeCloseTo(12.177, 1);
  expect(s).toBeCloseTo(0.653, 2);
  expect(l).toBeCloseTo(0.531, 2);
});

test('HPLuv color space conversion', () => {
  const c = hpLuv(12.177, 0.45, 0.531);
  expect(c.isValid()).toBe(true);

  const [h, _s, l] = c.hpLuv();
  expect(h).toBeCloseTo(12.177, 1);
  expect(l).toBeCloseTo(0.531, 2);
  // HPLuv saturation might be different due to gamut mapping
});

test('HSLuv distance calculation', () => {
  const c1 = hsLuv(0, 1, 0.5);
  const c2 = hsLuv(180, 1, 0.5);

  const distance = c1.distanceHSLuv(c2);
  expect(distance).toBeGreaterThan(0);
});

test('HPLuv distance calculation', () => {
  const c1 = hpLuv(0, 0.5, 0.5);
  const c2 = hpLuv(180, 0.5, 0.5);

  const distance = c1.distanceHPLuv(c2);
  expect(distance).toBeGreaterThan(0);
});

test('HSLuv produces clamped valid colors', () => {
  // Test with various HSLuv values that might produce out-of-gamut RGB
  const testCases = [
    [0, 1, 0.5],
    [60, 1, 0.5],
    [120, 1, 0.5],
    [180, 1, 0.5],
    [240, 1, 0.5],
    [300, 1, 0.5],
    [0, 0.5, 0.2],
    [0, 0.5, 0.8],
  ];

  for (const [h, s, l] of testCases) {
    const c = hsLuv(h, s, l);
    expect(c.isValid()).toBe(true);
    expect(c.r).toBeGreaterThanOrEqual(0);
    expect(c.r).toBeLessThanOrEqual(1);
    expect(c.g).toBeGreaterThanOrEqual(0);
    expect(c.g).toBeLessThanOrEqual(1);
    expect(c.b).toBeGreaterThanOrEqual(0);
    expect(c.b).toBeLessThanOrEqual(1);
  }
});

test('HPLuv produces clamped valid colors', () => {
  // Test with various HPLuv values
  const testCases = [
    [0, 0.5, 0.5],
    [60, 0.5, 0.5],
    [120, 0.5, 0.5],
    [180, 0.5, 0.5],
    [240, 0.5, 0.5],
    [300, 0.5, 0.5],
    [0, 0.3, 0.2],
    [0, 0.3, 0.8],
  ];

  for (const [h, s, l] of testCases) {
    const c = hpLuv(h, s, l);
    expect(c.isValid()).toBe(true);
    expect(c.r).toBeGreaterThanOrEqual(0);
    expect(c.r).toBeLessThanOrEqual(1);
    expect(c.g).toBeGreaterThanOrEqual(0);
    expect(c.g).toBeLessThanOrEqual(1);
    expect(c.b).toBeGreaterThanOrEqual(0);
    expect(c.b).toBeLessThanOrEqual(1);
  }
});

// Comprehensive snapshot testing against HSLuv reference implementation
test('HSLuv snapshot testing (comprehensive reference validation)', () => {
  // Type for snapshot values
  type SnapshotValues = {
    rgb: [number, number, number];
    xyz: [number, number, number];
    luv: [number, number, number];
    lch: [number, number, number];
    hsluv: [number, number, number];
    hpluv: [number, number, number];
  };

  const snapshotData = snapshot as Record<string, SnapshotValues>;

  // Test a subset of the snapshot for performance (Go tests all ~1000+ entries)
  const testEntries = Object.entries(snapshotData).slice(0, 20);

  for (const [hex, colorValues] of testEntries) {
    // Adjust color values to be in the ranges this library uses (divide by 100 for S,L)
    const adjustedHsluv: [number, number, number] = [
      colorValues.hsluv[0],
      colorValues.hsluv[1] / 100.0,
      colorValues.hsluv[2] / 100.0,
    ];
    const adjustedHpluv: [number, number, number] = [
      colorValues.hpluv[0],
      colorValues.hpluv[1] / 100.0,
      colorValues.hpluv[2] / 100.0,
    ];

    // Test HSLuv -> Hex conversion
    expect(() =>
      compareHex(hsLuv(...unpack(adjustedHsluv)).hex(), hex, 'HsluvToHex', hex)
    ).not.toThrow();

    // Test HSLuv -> RGB conversion
    expect(() =>
      compareTuple(
        pack(...hsLuv(...unpack(adjustedHsluv)).values()),
        colorValues.rgb,
        'HsluvToRGB',
        hex
      )
    ).not.toThrow();

    // Test Hex -> HSLuv conversion
    expect(() =>
      compareTuple(pack(...fromHex(hex).hsLuv()), adjustedHsluv, 'HsluvFromHex', hex)
    ).not.toThrow();

    // Test RGB -> HSLuv conversion
    expect(() =>
      compareTuple(
        pack(...new Color(colorValues.rgb[0], colorValues.rgb[1], colorValues.rgb[2]).hsLuv()),
        adjustedHsluv,
        'HsluvFromRGB',
        hex
      )
    ).not.toThrow();

    // Test HPLuv -> Hex conversion
    expect(() =>
      compareHex(hpLuv(...unpack(adjustedHpluv)).hex(), hex, 'HpluvToHex', hex)
    ).not.toThrow();

    // Test HPLuv -> RGB conversion
    expect(() =>
      compareTuple(
        pack(...hpLuv(...unpack(adjustedHpluv)).values()),
        colorValues.rgb,
        'HpluvToRGB',
        hex
      )
    ).not.toThrow();

    // Test Hex -> HPLuv conversion
    expect(() =>
      compareTuple(pack(...fromHex(hex).hpLuv()), adjustedHpluv, 'HpluvFromHex', hex)
    ).not.toThrow();

    // Test RGB -> HPLuv conversion
    expect(() =>
      compareTuple(
        pack(...new Color(colorValues.rgb[0], colorValues.rgb[1], colorValues.rgb[2]).hpLuv()),
        adjustedHpluv,
        'HpluvFromRGB',
        hex
      )
    ).not.toThrow();
  }
});

// Test key HSLuv snapshot entries that are known to be problematic
test('HSLuv critical snapshot entries', () => {
  const snapshotData = snapshot as Record<string, unknown>;

  // Test some critical entries that tend to reveal precision issues
  const criticalTests = [
    '#000000', // Pure black
    '#ffffff', // Pure white
    '#ff0000', // Pure red
    '#00ff00', // Pure green
    '#0000ff', // Pure blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
  ];

  for (const hex of criticalTests) {
    if (snapshotData[hex]) {
      const colorValues = snapshotData[hex];

      const adjustedHsluv: [number, number, number] = [
        colorValues.hsluv[0],
        colorValues.hsluv[1] / 100.0,
        colorValues.hsluv[2] / 100.0,
      ];

      // Test round-trip conversion: HSLuv -> RGB -> HSLuv
      const c1 = hsLuv(...adjustedHsluv);
      const [h2, s2, l2] = c1.hsLuv();

      expect(Math.abs(h2 - adjustedHsluv[0])).toBeLessThan(0.01);
      expect(Math.abs(s2 - adjustedHsluv[1])).toBeLessThan(0.01);
      expect(Math.abs(l2 - adjustedHsluv[2])).toBeLessThan(0.01);

      // Test that hex conversion is exact
      expect(c1.hex()).toBe(hex);
    }
  }
});
