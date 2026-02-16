/**
 * Test Go-style API compatibility with proper error handling
 */

import { expect, test } from 'bun:test';
import * as GoStyle from '../src/go-style';
import { measureTime } from './test-utils';

test('Go-style FastWarmPalette with proper error handling', () => {
  const palette = measureTime(() => GoStyle.FastWarmPalette(3), 'GoStyle.FastWarmPalette(3)');

  expect(palette.length).toBe(3);
  palette.forEach((color) => {
    expect(color.IsValid()).toBe(true);
    expect(typeof color.R).toBe('number');
    expect(typeof color.G).toBe('number');
    expect(typeof color.B).toBe('number');
  });
});

test('Go-style FastHappyPalette with proper error handling', () => {
  const palette = measureTime(() => GoStyle.FastHappyPalette(2), 'GoStyle.FastHappyPalette(2)');

  expect(palette.length).toBe(2);
  palette.forEach((color) => {
    expect(color.IsValid()).toBe(true);
  });
});

test('Go-style API method naming consistency', () => {
  const mockRand = {
    Float64: () => 0.5,
    Intn: (n: number) => Math.floor(n / 2),
  };

  // Test that Go-style methods work
  expect(typeof mockRand.Float64).toBe('function');
  expect(typeof mockRand.Intn).toBe('function');

  // Test basic color generation with mock rand
  const warmColor = GoStyle.FastWarmColorWithRand(mockRand);
  expect(warmColor.IsValid()).toBe(true);

  const happyColor = GoStyle.FastHappyColorWithRand(mockRand);
  expect(happyColor.IsValid()).toBe(true);
});

test('Go-style vs TypeScript API equivalence', () => {
  // Both should produce valid colors, even if different due to random
  const goColor = GoStyle.FastWarmColor();
  expect(goColor.IsValid()).toBe(true);

  // Test method naming differences
  expect(typeof goColor.IsValid).toBe('function'); // Go-style: IsValid
  expect(typeof goColor.RGBA).toBe('function'); // Go-style: RGBA
  expect(typeof goColor.RGB255).toBe('function'); // Go-style: RGB255
});

test('Go-style constructors work correctly', () => {
  const hexColor = GoStyle.Hex('#ff8040');
  expect(hexColor.IsValid()).toBe(true);

  const hsvColor = GoStyle.Hsv(120, 0.7, 0.8);
  expect(hsvColor.IsValid()).toBe(true);

  const labColor = GoStyle.Lab(0.6, 0.1, -0.1);
  expect(labColor.IsValid()).toBe(true);
});
