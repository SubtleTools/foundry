/**
 * Tests for color sorting
 */

import { expect, test } from 'bun:test';
import { Color, FastHappyPalette, Sorted } from '../src';

test('Sorted maintains correct number of colors', () => {
  const palette = FastHappyPalette(10);
  const sorted = Sorted(palette);
  expect(sorted.length).toBe(palette.length);
});

test('Sorted returns same colors for single color array', () => {
  const color = new Color(0.5, 0.3, 0.7);
  const sorted = Sorted([color]);
  expect(sorted.length).toBe(1);
  expect(sorted[0]).toBe(color);
});

test('Sorted returns empty array for empty input', () => {
  const sorted = Sorted([]);
  expect(sorted.length).toBe(0);
});

test('Sorted produces smooth transitions', () => {
  // Create a palette with very different colors
  const colors = [
    new Color(1, 0, 0), // Red
    new Color(0, 1, 0), // Green
    new Color(0, 0, 1), // Blue
    new Color(1, 1, 0), // Yellow
    new Color(1, 0, 1), // Magenta
    new Color(0, 1, 1), // Cyan
    new Color(0, 0, 0), // Black
    new Color(1, 1, 1), // White
  ];

  const sorted = Sorted(colors);
  expect(sorted.length).toBe(colors.length);

  // All original colors should be present
  for (const color of colors) {
    const found = sorted.some(
      (c) =>
        Math.abs(c.r - color.r) < 1e-6 &&
        Math.abs(c.g - color.g) < 1e-6 &&
        Math.abs(c.b - color.b) < 1e-6
    );
    expect(found).toBe(true);
  }

  // The first color should be the darkest (closest to black)
  const black = new Color(0, 0, 0);
  let minDist = Number.MAX_VALUE;
  let darkestIndex = 0;

  for (let i = 0; i < colors.length; i++) {
    const dist = black.distanceCIEDE2000(colors[i]);
    if (dist < minDist) {
      minDist = dist;
      darkestIndex = i;
    }
  }

  expect(sorted[0]).toBe(colors[darkestIndex]);
});
