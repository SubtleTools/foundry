/**
 * Tests for mathematical utility functions
 * Covers all utility functions including fast approximations
 */

import { expect, test } from 'bun:test';
import {
  clamp01,
  cub,
  delinearize,
  delinearizeFast,
  interpAngle,
  linearize,
  linearizeFast,
  sq,
} from '../src/utils';

test('Square function (sq)', () => {
  expect(sq(0)).toBe(0);
  expect(sq(1)).toBe(1);
  expect(sq(2)).toBe(4);
  expect(sq(-3)).toBe(9);
  expect(sq(0.5)).toBe(0.25);
});

test('Cube function (cub)', () => {
  expect(cub(0)).toBe(0);
  expect(cub(1)).toBe(1);
  expect(cub(2)).toBe(8);
  expect(cub(-2)).toBe(-8);
  expect(cub(0.5)).toBe(0.125);
});

test('Clamp function (clamp01)', () => {
  expect(clamp01(0.5)).toBe(0.5);
  expect(clamp01(-0.1)).toBe(0);
  expect(clamp01(1.1)).toBe(1);
  expect(clamp01(0)).toBe(0);
  expect(clamp01(1)).toBe(1);
});

test('Angle interpolation (interpAngle)', () => {
  // Test basic interpolation
  expect(interpAngle(0, 90, 0.5)).toBeCloseTo(45, 5);
  expect(interpAngle(0, 120, 0.5)).toBeCloseTo(60, 5);

  // Test wrapping around 360 degrees
  expect(interpAngle(350, 10, 0.5)).toBeCloseTo(0, 5);
  expect(interpAngle(10, 350, 0.5)).toBeCloseTo(0, 5);

  // Test edge cases
  expect(interpAngle(0, 360, 0.5)).toBeCloseTo(0, 5);
  expect(interpAngle(180, 180, 0.5)).toBeCloseTo(180, 5);

  // Test t=0 and t=1
  expect(interpAngle(45, 135, 0)).toBeCloseTo(45, 5);
  expect(interpAngle(45, 135, 1)).toBeCloseTo(135, 5);
});

test('sRGB linearization (linearize)', () => {
  // Test sRGB gamma correction
  expect(linearize(0)).toBe(0);
  expect(linearize(1)).toBe(1);

  // Test the threshold value
  expect(linearize(0.04045)).toBeCloseTo(0.04045 / 12.92, 6);
  expect(linearize(0.05)).toBeCloseTo(((0.05 + 0.055) / 1.055) ** 2.4, 6);

  // Test some common values
  expect(linearize(0.5)).toBeCloseTo(((0.5 + 0.055) / 1.055) ** 2.4, 6);
  expect(linearize(0.2)).toBeCloseTo(((0.2 + 0.055) / 1.055) ** 2.4, 6);
  expect(linearize(0.8)).toBeCloseTo(((0.8 + 0.055) / 1.055) ** 2.4, 6);
});

test('sRGB delinearization (delinearize)', () => {
  // Test sRGB gamma correction reverse
  expect(delinearize(0)).toBe(0);
  expect(delinearize(1)).toBeCloseTo(1, 10);

  // Test the threshold value
  expect(delinearize(0.0031308)).toBeCloseTo(12.92 * 0.0031308, 6);
  expect(delinearize(0.01)).toBeCloseTo(1.055 * 0.01 ** (1.0 / 2.4) - 0.055, 6);

  // Test some common values
  expect(delinearize(0.5)).toBeCloseTo(1.055 * 0.5 ** (1.0 / 2.4) - 0.055, 6);
  expect(delinearize(0.2)).toBeCloseTo(1.055 * 0.2 ** (1.0 / 2.4) - 0.055, 6);
  expect(delinearize(0.8)).toBeCloseTo(1.055 * 0.8 ** (1.0 / 2.4) - 0.055, 6);
});

test('Fast linearization (linearizeFast)', () => {
  // Test that fast version produces reasonable approximations
  const testValues = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]; // Skip extremes where approximation is less accurate

  for (const val of testValues) {
    const accurate = linearize(val);
    const fast = linearizeFast(val);

    // Fast version should be reasonably close for middle values
    const relativeError = Math.abs(fast - accurate) / accurate;
    expect(relativeError).toBeLessThan(0.1); // 10% tolerance for fast approximation
  }

  // Test edge cases separately with looser tolerance
  expect(Math.abs(linearizeFast(0) - linearize(0))).toBeLessThan(0.01);
  expect(Math.abs(linearizeFast(1) - linearize(1))).toBeLessThan(0.01);
  expect(Math.abs(linearizeFast(0.1) - linearize(0.1)) / linearize(0.1)).toBeLessThan(0.1);

  // Test specific values to ensure function works
  expect(linearizeFast(0.5)).toBeCloseTo(linearize(0.5), 2);
  expect(linearizeFast(0.0)).toBeCloseTo(linearize(0.0), 2);
  expect(linearizeFast(1.0)).toBeCloseTo(linearize(1.0), 2);
});

test('Fast delinearization (delinearizeFast)', () => {
  // Test that fast version produces reasonable approximations
  const testValues = [0, 0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  for (const val of testValues) {
    const accurate = delinearize(val);
    const fast = delinearizeFast(val);

    // Fast version should be within reasonable tolerance of accurate version
    if (accurate > 0.001) {
      const relativeError = Math.abs(fast - accurate) / accurate;
      expect(relativeError).toBeLessThan(0.05); // 5% tolerance (delinearization is harder to approximate)
    } else {
      // For very small values, use absolute error (fast approximation less accurate at extremes)
      expect(Math.abs(fast - accurate)).toBeLessThan(0.01);
    }
  }

  // Test specific values to ensure function works
  expect(delinearizeFast(0.5)).toBeCloseTo(delinearize(0.5), 1);
  expect(delinearizeFast(0.0)).toBeCloseTo(delinearize(0.0), 1);
  expect(delinearizeFast(1.0)).toBeCloseTo(delinearize(1.0), 1);
});

test('Fast linearization branches', () => {
  // Test all three branches of delinearizeFast

  // Branch 1: v > 0.2
  expect(delinearizeFast(0.5)).toBeFinite();
  expect(delinearizeFast(0.8)).toBeFinite();
  expect(delinearizeFast(1.0)).toBeFinite();

  // Branch 2: v > 0.03 && v <= 0.2
  expect(delinearizeFast(0.1)).toBeFinite();
  expect(delinearizeFast(0.15)).toBeFinite();
  expect(delinearizeFast(0.2)).toBeFinite();

  // Branch 3: v <= 0.03
  expect(delinearizeFast(0.01)).toBeFinite();
  expect(delinearizeFast(0.025)).toBeFinite();
  expect(delinearizeFast(0.03)).toBeFinite();
});

test('Linearization round-trip accuracy', () => {
  // Test that linearize and delinearize are approximate inverses
  const testValues = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  for (const val of testValues) {
    const roundTrip1 = delinearize(linearize(val));
    const roundTrip2 = linearize(delinearize(val));

    expect(roundTrip1).toBeCloseTo(val, 10);
    expect(roundTrip2).toBeCloseTo(val, 10);
  }
});

test('Fast linearization round-trip accuracy', () => {
  // Test that fast versions produce reasonable round-trip results
  const testValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  for (const val of testValues) {
    // Don't expect perfect round-trip with fast approximations,
    // but should be reasonably close
    const fastRoundTrip1 = delinearizeFast(linearizeFast(val));
    const fastRoundTrip2 = linearizeFast(delinearizeFast(val));

    expect(Math.abs(fastRoundTrip1 - val)).toBeLessThan(0.1);
    expect(Math.abs(fastRoundTrip2 - val)).toBeLessThan(0.1);
  }
});

test('Edge cases and boundary values', () => {
  // Test edge cases for all functions

  // Negative values (should be handled gracefully)
  expect(clamp01(-1)).toBe(0);
  expect(linearize(-0.1)).toBeLessThan(0); // May produce negative values
  expect(delinearize(-0.1)).toBeLessThan(0);

  // Values > 1
  expect(clamp01(2)).toBe(1);
  expect(linearize(1.5)).toBeGreaterThan(1);
  expect(delinearize(1.5)).toBeGreaterThan(1);

  // Very small values
  expect(linearize(1e-10)).toBeCloseTo(1e-10 / 12.92, 15);
  expect(delinearize(1e-10)).toBeCloseTo(12.92 * 1e-10, 15);

  // Values at the threshold
  expect(linearize(0.04045)).toBeCloseTo(0.04045 / 12.92, 10);
  expect(delinearize(0.0031308)).toBeCloseTo(12.92 * 0.0031308, 10);
});

test('Performance characteristics', () => {
  // Simple test to ensure fast functions execute without error
  const iterations = 1000;
  const testVal = 0.5;

  // Test that fast functions can handle many iterations
  for (let i = 0; i < iterations; i++) {
    const val = i / iterations;
    expect(linearizeFast(val)).toBeFinite();
    expect(delinearizeFast(val)).toBeFinite();
  }

  // Test they produce consistent results
  expect(linearizeFast(testVal)).toBe(linearizeFast(testVal));
  expect(delinearizeFast(testVal)).toBe(delinearizeFast(testVal));
});
