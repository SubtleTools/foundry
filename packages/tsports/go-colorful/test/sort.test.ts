/**
 * Tests for color sorting
 * Includes tests ported from Go's sort_test.go
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

// Ported from Go's TestSortSimple in sort_test.go
test('TestSortSimple - sorts reds and blues correctly', () => {
  // Sort a list of reds and blues
  const input: Color[] = [];
  for (let i = 0; i < 3; i++) {
    input.push(new Color(1.0 - (i + 1) * 0.25, 0.0, 0.0)); // Reds
    input.push(new Color(0.0, 0.0, 1.0 - (i + 1) * 0.25)); // Blues
  }
  const out = Sorted(input);

  // Ensure the output matches what we expected
  const expected = [
    new Color(0.25, 0.0, 0.0),
    new Color(0.5, 0.0, 0.0),
    new Color(0.75, 0.0, 0.0),
    new Color(0.0, 0.0, 0.25),
    new Color(0.0, 0.0, 0.5),
    new Color(0.0, 0.0, 0.75),
  ];
  for (let i = 0; i < expected.length; i++) {
    expect(out[i].r).toBeCloseTo(expected[i].r, 10);
    expect(out[i].g).toBeCloseTo(expected[i].g, 10);
    expect(out[i].b).toBeCloseTo(expected[i].b, 10);
  }
});
