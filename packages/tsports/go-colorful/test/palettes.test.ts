/**
 * Tests for palette generation
 */

import { expect, test } from 'bun:test';
import { FastHappyPalette, FastWarmPalette, HappyPalette, SoftPalette, WarmPalette } from '../src';

test('FastWarmPalette generates correct number of colors', () => {
  const palette = FastWarmPalette(5);
  expect(palette.length).toBe(5);

  for (const color of palette) {
    expect(color.isValid()).toBe(true);
  }
});

test('FastHappyPalette generates correct number of colors', () => {
  const palette = FastHappyPalette(7);
  expect(palette.length).toBe(7);

  for (const color of palette) {
    expect(color.isValid()).toBe(true);
  }
});

test('SoftPalette generates correct number of colors', () => {
  const [palette, error] = SoftPalette(4);
  expect(error).toBeNull();
  expect(palette.length).toBe(4);

  for (const color of palette) {
    expect(color.isValid()).toBe(true);
  }
});

test('WarmPalette generates warm colors', () => {
  const [palette, error] = WarmPalette(3);
  expect(error).toBeNull();
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

test('HappyPalette generates happy colors', () => {
  const [palette, error] = HappyPalette(3);
  expect(error).toBeNull();
  expect(palette.length).toBe(3);

  for (const color of palette) {
    expect(color.isValid()).toBe(true);

    const [_h, c, l] = color.hcl();
    expect(c).toBeGreaterThanOrEqual(0.3);
    expect(l).toBeGreaterThanOrEqual(0.4);
    expect(l).toBeLessThanOrEqual(0.8);
  }
});

test('SoftPalette with too many colors returns error', () => {
  const [palette, error] = SoftPalette(100000);
  expect(error).not.toBeNull();
  expect(palette.length).toBe(0);
});
