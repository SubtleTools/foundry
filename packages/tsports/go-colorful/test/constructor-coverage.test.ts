/**
 * Tests for constructor functions that need better coverage
 */
import { expect, test } from 'bun:test';
import * as Colors from '../src/colors';

test('Constructor error handling', () => {
  // Test edge cases for constructors - these don't throw, they return valid colors
  const validColor1 = Colors.Hsv(0, 0, 0);
  expect(validColor1.IsValid()).toBe(true);

  const validColor2 = Colors.Hsl(360, 1, 1);
  expect(validColor2.IsValid()).toBe(true);

  const validColor3 = Colors.Lab(0.5, 0.2, -0.1);
  expect(validColor3.IsValid()).toBe(true);

  const validColor4 = Colors.Luv(0.5, 0.1, 0.1);
  expect(validColor4.IsValid()).toBe(true);

  // Test some hex colors that should work
  const hexColor1 = Colors.Hex('#FF0000');
  expect(hexColor1.IsValid()).toBe(true);

  const hexColor2 = Colors.Hex('#000000');
  expect(hexColor2.IsValid()).toBe(true);
});

test('MakeColor edge cases', () => {
  // Test valid color conversion
  const mockColor = {
    RGBA(): [number, number, number, number] {
      return [32768, 16384, 65535, 65535]; // 16-bit values
    },
  };

  const [color, ok] = Colors.MakeColor(mockColor);
  expect(ok).toBe(true);
  expect(color.R).toBeCloseTo(0.5, 4);
  expect(color.G).toBeCloseTo(0.25, 5);
  expect(color.B).toBeCloseTo(1, 5);

  // Test zero alpha case
  const mockColorZeroAlpha = {
    RGBA(): [number, number, number, number] {
      return [32768, 16384, 65535, 0];
    },
  };

  const [, ok2] = Colors.MakeColor(mockColorZeroAlpha);
  expect(ok2).toBe(false);
});

test('White reference constructors', () => {
  const customWhite: [number, number, number] = [0.9642, 1.0, 0.8249];

  const labColor = Colors.LabWhiteRef(0.5, 0.2, -0.3, customWhite);
  expect(labColor.IsValid()).toBe(true);

  const luvColor = Colors.LuvWhiteRef(0.5, 0.2, -0.3, customWhite);
  expect(luvColor.IsValid()).toBe(true);

  const hclColor = Colors.HclWhiteRef(180, 0.4, 0.5, customWhite);
  expect(hclColor.IsValid()).toBe(true);
});

test('LabToHcl utility function', () => {
  const [h, c, l] = Colors.LabToHcl(50, 20, -30);
  expect(h).toBeGreaterThanOrEqual(0);
  expect(h).toBeLessThanOrEqual(360);
  expect(c).toBeGreaterThanOrEqual(0);
  expect(l).toBeGreaterThanOrEqual(0);
});

test('Linear RGB constructors', () => {
  const linearColor = Colors.LinearRgb(0.5, 0.6, 0.7);
  expect(linearColor.IsValid()).toBe(true);

  const fastLinearColor = Colors.FastLinearRgb(0.5, 0.6, 0.7);
  expect(fastLinearColor.IsValid()).toBe(true);
});

test('XYZ and Xyy constructors', () => {
  const xyzColor = Colors.Xyz(0.5, 0.6, 0.4);
  expect(xyzColor.IsValid()).toBe(true);

  const xyyColor = Colors.Xyy(0.3, 0.4, 0.6);
  expect(xyyColor.IsValid()).toBe(true);
});
