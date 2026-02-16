/**
 * Basic tests to verify the TypeScript port works correctly
 */

import { expect, test } from 'bun:test';
import { Color, HCL, Hex, HSL, HSV, Lab } from '../src';

test('Color creation and basic properties', () => {
  const c = new Color(0.5, 0.3, 0.7);
  expect(c.r).toBe(0.5);
  expect(c.g).toBe(0.3);
  expect(c.b).toBe(0.7);
  expect(c.isValid()).toBe(true);
});

test('RGB255 conversion', () => {
  const c = new Color(1.0, 0.0, 0.5);
  const [r, g, b] = c.rgb255();
  expect(r).toBe(255);
  expect(g).toBe(0);
  expect(b).toBe(128);
});

test('Hex color parsing and generation', () => {
  const c1 = Hex('#FF0080');
  expect(c1.r).toBeCloseTo(1.0, 5);
  expect(c1.g).toBeCloseTo(0.0, 5);
  expect(c1.b).toBeCloseTo(0.5019607843137255, 5);
  expect(c1.hex()).toBe('#ff0080');

  const c2 = Hex('#f08');
  expect(c2.r).toBeCloseTo(1.0, 5);
  expect(c2.g).toBeCloseTo(0.0, 5);
  expect(c2.b).toBeCloseTo(0.5333333333333333, 5);
});

test('HSV color space', () => {
  const c = HSV(216.0, 0.56, 0.722);
  expect(c.r).toBeCloseTo(0.3176, 3);
  expect(c.g).toBeCloseTo(0.4794, 3);
  expect(c.b).toBeCloseTo(0.722, 3);

  const [h, s, v] = c.hsv();
  expect(h).toBeCloseTo(216.0, 1);
  expect(s).toBeCloseTo(0.56, 2);
  expect(v).toBeCloseTo(0.722, 3);
});

test('HSL color space', () => {
  const c = new Color(0.5, 0.3, 0.7);
  const [h, s, l] = c.hsl();
  expect(h).toBeCloseTo(270.0, 0);
  expect(s).toBeCloseTo(0.4, 1);
  expect(l).toBeCloseTo(0.5, 1);

  const c2 = HSL(270.0, 0.4, 0.5);
  expect(c2.r).toBeCloseTo(0.5, 2);
  expect(c2.g).toBeCloseTo(0.3, 2);
  expect(c2.b).toBeCloseTo(0.7, 2);
});

test('Lab color space', () => {
  const c = Lab(0.50785, 0.040585, -0.370945);
  expect(c.r).toBeCloseTo(0.3137, 3);
  expect(c.g).toBeCloseTo(0.4784, 3);
  expect(c.b).toBeCloseTo(0.7216, 3);

  const [l, a, b] = c.lab();
  expect(l).toBeCloseTo(0.50785, 4);
  expect(a).toBeCloseTo(0.040585, 4);
  expect(b).toBeCloseTo(-0.370945, 4);
});

test('HCL color space', () => {
  const c = HCL(276.244, 0.37316, 0.507849);
  expect(c.r).toBeCloseTo(0.3137, 3);
  expect(c.g).toBeCloseTo(0.4784, 3);
  expect(c.b).toBeCloseTo(0.7216, 3);

  const [h, chroma, lightness] = c.hcl();
  expect(h).toBeCloseTo(276.244, 1);
  expect(chroma).toBeCloseTo(0.37316, 4);
  expect(lightness).toBeCloseTo(0.507849, 4);
});

test('Color distance calculations', () => {
  const c1 = new Color(150.0 / 255.0, 10.0 / 255.0, 150.0 / 255.0);
  const c2 = new Color(53.0 / 255.0, 10.0 / 255.0, 150.0 / 255.0);

  const distRgb = c1.distanceRgb(c2);
  const distLab = c1.distanceLab(c2);
  const distCIE94 = c1.distanceCIE94(c2);

  expect(distRgb).toBeCloseTo(0.3803921568627451, 5);
  expect(distLab).toBeCloseTo(0.320426, 4);
  expect(distCIE94).toBeCloseTo(0.19795, 4);
});

test('Color blending', () => {
  const c1 = Hex('#fdffcc');
  const c2 = Hex('#242a42');

  const blended = c1.blendLab(c2, 0.5);
  expect(blended.r).toBeGreaterThan(0);
  expect(blended.g).toBeGreaterThan(0);
  expect(blended.b).toBeGreaterThan(0);
  expect(blended.isValid()).toBe(true);
});

test('Color clamping', () => {
  const c = new Color(-0.5, 1.5, 0.5);
  expect(c.isValid()).toBe(false);

  const clamped = c.clamped();
  expect(clamped.isValid()).toBe(true);
  expect(clamped.r).toBe(0.0);
  expect(clamped.g).toBe(1.0);
  expect(clamped.b).toBe(0.5);
});
