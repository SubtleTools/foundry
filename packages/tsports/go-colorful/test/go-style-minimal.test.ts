/**
 * Minimal Go-style API tests to verify basic functionality
 */

import { expect, test } from 'bun:test';
import * as GoStyle from '../src/go-style';

test('Go-style Color class basic functionality', () => {
  const goColor = new GoStyle.Color(0.5, 0.7, 0.9);
  expect(goColor.R).toBe(0.5);
  expect(goColor.G).toBe(0.7);
  expect(goColor.B).toBe(0.9);
  expect(goColor.IsValid()).toBe(true);
});

test('Go-style basic constructor functions', () => {
  expect(GoStyle.Hex('#ff0000').IsValid()).toBe(true);
  expect(GoStyle.Hsv(120, 0.5, 0.8).IsValid()).toBe(true);
  expect(GoStyle.Lab(0.5, 0.1, -0.2).IsValid()).toBe(true);
});

test('Go-style basic distance calculations', () => {
  const c1 = new GoStyle.Color(1, 0, 0);
  const c2 = new GoStyle.Color(0, 1, 0);

  expect(typeof c1.DistanceRgb(c2)).toBe('number');
  expect(c1.DistanceRgb(c2)).toBeGreaterThan(0);
});
