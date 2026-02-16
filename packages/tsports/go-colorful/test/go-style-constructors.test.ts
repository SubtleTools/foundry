/**
 * Go-style constructor functions only
 */

import { expect, test } from 'bun:test';
import * as GoStyle from '../src/go-style';

test('Go-style basic constructors', () => {
  expect(GoStyle.Hex('#ff8040').IsValid()).toBe(true);
  expect(GoStyle.Hsv(120, 0.7, 0.8).IsValid()).toBe(true);
  expect(GoStyle.Hsl(240, 0.6, 0.5).IsValid()).toBe(true);
  expect(GoStyle.Lab(0.6, 0.1, -0.1).IsValid()).toBe(true);
  expect(GoStyle.Luv(0.5, 0.05, 0.1).IsValid()).toBe(true);
});

test('Go-style advanced constructors', () => {
  expect(GoStyle.Xyz(0.4, 0.5, 0.3).IsValid()).toBe(true);
  expect(GoStyle.Xyy(0.3, 0.35, 0.4).IsValid()).toBe(true);
  expect(GoStyle.LinearRgb(0.2, 0.7, 0.5).IsValid()).toBe(true);
  expect(GoStyle.FastLinearRgb(0.3, 0.6, 0.8).IsValid()).toBe(true);
});
