/**
 * Go-style Color class methods only (no constructors or palette generation)
 */

import { expect, test } from 'bun:test';
import * as GoStyle from '../src/go-style';

test('Go-style Color distance methods', () => {
  const c1 = new GoStyle.Color(0.8, 0.4, 0.6);
  const c2 = new GoStyle.Color(0.2, 0.7, 0.3);

  expect(typeof c1.DistanceLinearRgb(c2)).toBe('number');
  expect(typeof c1.DistanceLinearRGB(c2)).toBe('number');
  expect(typeof c1.DistanceRiemersma(c2)).toBe('number');
  expect(typeof c1.DistanceLab(c2)).toBe('number');
  expect(typeof c1.DistanceCIE76(c2)).toBe('number');
  expect(typeof c1.DistanceLuv(c2)).toBe('number');
});

test('Go-style Color conversion methods', () => {
  const color = new GoStyle.Color(0.6, 0.5, 0.8);

  expect(color.Hsv()).toHaveLength(3);
  expect(color.Hsl()).toHaveLength(3);
  expect(color.LinearRgb()).toHaveLength(3);
  expect(color.FastLinearRgb()).toHaveLength(3);
  expect(color.Xyz()).toHaveLength(3);
  expect(color.Xyy()).toHaveLength(3);
  expect(color.Lab()).toHaveLength(3);
  expect(color.Luv()).toHaveLength(3);

  expect(typeof color.Hex()).toBe('string');
});
