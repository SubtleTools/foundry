/**
 * Robust palette generation tests with proper error handling and performance monitoring
 */

import { expect, test } from 'bun:test';
import { FastHappyPalette, FastWarmPalette, HappyPalette, SoftPalette, WarmPalette } from '../src';
import { assertNoError, measureTime, withTimeout } from './test-utils';

test('FastWarmPalette works reliably with performance monitoring', () => {
  const palette = measureTime(() => FastWarmPalette(5), 'FastWarmPalette(5)');

  expect(palette.length).toBe(5);
  for (const color of palette) {
    expect(color.isValid()).toBe(true);
  }
});

test('FastHappyPalette works reliably with performance monitoring', () => {
  const palette = measureTime(() => FastHappyPalette(7), 'FastHappyPalette(7)');

  expect(palette.length).toBe(7);
  for (const color of palette) {
    expect(color.isValid()).toBe(true);
  }
});

test('SoftPalette with proper error handling and timeout protection', () => {
  const palette = withTimeout(
    () => {
      const result = measureTime(() => SoftPalette(4), 'SoftPalette(4)');
      return assertNoError(result, 'SoftPalette(4)');
    },
    5000,
    'SoftPalette should complete within 5 seconds'
  );

  expect(palette.length).toBe(4);
  for (const color of palette) {
    expect(color.isValid()).toBe(true);
  }
});

test('WarmPalette with robust error handling and performance monitoring', () => {
  const palette = withTimeout(
    () => {
      const result = measureTime(() => WarmPalette(3), 'WarmPalette(3)');
      return assertNoError(result, 'WarmPalette(3)');
    },
    5000,
    'WarmPalette should complete within 5 seconds'
  );

  expect(palette.length).toBe(3);

  for (const color of palette) {
    expect(color.isValid()).toBe(true);

    const [_h, c, l] = color.hcl();
    expect(c).toBeGreaterThanOrEqual(0.1);
    expect(c).toBeLessThanOrEqual(0.4);
    expect(l).toBeGreaterThanOrEqual(0.2);
    expect(l).toBeLessThanOrEqual(0.5);
  }
});

test('HappyPalette with robust error handling and performance monitoring', () => {
  const palette = withTimeout(
    () => {
      const result = measureTime(() => HappyPalette(3), 'HappyPalette(3)');
      return assertNoError(result, 'HappyPalette(3)');
    },
    5000,
    'HappyPalette should complete within 5 seconds'
  );

  expect(palette.length).toBe(3);

  for (const color of palette) {
    expect(color.isValid()).toBe(true);

    const [_h, c, l] = color.hcl();
    expect(c).toBeGreaterThanOrEqual(0.3);
    expect(l).toBeGreaterThanOrEqual(0.4);
    expect(l).toBeLessThanOrEqual(0.8);
  }
});

test('Error handling: SoftPalette with impossible constraints', () => {
  // This should return an error, not throw or timeout
  const result = measureTime(
    () => SoftPalette(100000), // Way too many colors
    'SoftPalette(100000) - should return error'
  );

  const [palette, error] = result;
  expect(error).not.toBeNull();
  expect(error?.message).toContain('more colors requested');
  expect(palette.length).toBe(0);
});

test('Performance benchmark: Compare fast vs slow palette generation', () => {
  const fastResult = measureTime(() => FastWarmPalette(10), 'FastWarmPalette(10)');

  const slowResult = measureTime(() => {
    const result = WarmPalette(10);
    return assertNoError(result, 'WarmPalette(10)');
  }, 'WarmPalette(10)');

  expect(fastResult.length).toBe(10);
  expect(slowResult.length).toBe(10);

  // Both should generate valid colors
  fastResult.forEach((color) => {
    expect(color.isValid()).toBe(true);
  });
  slowResult.forEach((color) => {
    expect(color.isValid()).toBe(true);
  });
});
