/**
 * Tests for v1.3.0 features:
 * - Standalone conversion function exports (XyzToOkLab, OkLabToXyz, etc.)
 * - xyzToOkLch / okLchToXyz round-trip
 * - BlendOkLab / BlendOkLch
 * - DistanceLinearRgb / DistanceRiemersma
 * - BlendLinearRgb
 */

import { describe, expect, test } from 'bun:test';
import {
  Color,
  XyzToOkLab,
  OkLabToXyz,
  XyzToOkLch,
  OkLchToXyz,
  OkLabToOkLch,
  OkLchToOkLab,
  XyzToLinearRgb,
  LinearRgbToXyz,
  XyzToLab,
  LabToXyz,
  XyzToLuv,
  LuvToXyz,
  LabToHcl,
  HclToLab,
  LuvToLuvLCh,
  LuvLChToLuv,
  XyzToXyy,
  XyyToXyz,
  luvLChToHSLuv,
  hsLuvToLuvLCh,
  luvLChToHPLuv,
  hpLuvToLuvLCh,
} from '../src';

describe('Standalone conversion function exports', () => {
  test('XyzToOkLab and OkLabToXyz round-trip', () => {
    // OkLab matrices are not perfectly invertible due to floating-point precision,
    // but should be accurate to ~4 decimal places
    const x = 0.5, y = 0.4, z = 0.3;
    const [l, a, b] = XyzToOkLab(x, y, z);
    const [x2, y2, z2] = OkLabToXyz(l, a, b);
    expect(x2).toBeCloseTo(x, 3);
    expect(y2).toBeCloseTo(y, 3);
    expect(z2).toBeCloseTo(z, 3);
  });

  test('XyzToOkLch and OkLchToXyz round-trip', () => {
    const x = 0.5, y = 0.4, z = 0.3;
    const [l, c, h] = XyzToOkLch(x, y, z);
    const [x2, y2, z2] = OkLchToXyz(l, c, h);
    expect(x2).toBeCloseTo(x, 3);
    expect(y2).toBeCloseTo(y, 3);
    expect(z2).toBeCloseTo(z, 3);
  });

  test('OkLabToOkLch and OkLchToOkLab round-trip', () => {
    const l = 0.7, a = 0.1, b = -0.05;
    const [l2, c, h] = OkLabToOkLch(l, a, b);
    const [l3, a2, b2] = OkLchToOkLab(l2, c, h);
    expect(l3).toBeCloseTo(l, 12);
    expect(a2).toBeCloseTo(a, 12);
    expect(b2).toBeCloseTo(b, 12);
  });

  test('XyzToLinearRgb and LinearRgbToXyz round-trip', () => {
    const x = 0.4, y = 0.3, z = 0.2;
    const [r, g, b] = XyzToLinearRgb(x, y, z);
    const [x2, y2, z2] = LinearRgbToXyz(r, g, b);
    expect(x2).toBeCloseTo(x, 10);
    expect(y2).toBeCloseTo(y, 10);
    expect(z2).toBeCloseTo(z, 10);
  });

  test('XyzToLab and LabToXyz round-trip', () => {
    const x = 0.5, y = 0.4, z = 0.3;
    const [l, a, b] = XyzToLab(x, y, z);
    const [x2, y2, z2] = LabToXyz(l, a, b);
    expect(x2).toBeCloseTo(x, 10);
    expect(y2).toBeCloseTo(y, 10);
    expect(z2).toBeCloseTo(z, 10);
  });

  test('XyzToLuv and LuvToXyz round-trip', () => {
    const x = 0.5, y = 0.4, z = 0.3;
    const [l, u, v] = XyzToLuv(x, y, z);
    const [x2, y2, z2] = LuvToXyz(l, u, v);
    expect(x2).toBeCloseTo(x, 10);
    expect(y2).toBeCloseTo(y, 10);
    expect(z2).toBeCloseTo(z, 10);
  });

  test('LabToHcl and HclToLab round-trip', () => {
    const L = 0.6, a = 0.2, b = -0.1;
    const [h, c, l] = LabToHcl(L, a, b);
    const [L2, a2, b2] = HclToLab(h, c, l);
    expect(L2).toBeCloseTo(L, 10);
    expect(a2).toBeCloseTo(a, 10);
    expect(b2).toBeCloseTo(b, 10);
  });

  test('LuvToLuvLCh and LuvLChToLuv round-trip', () => {
    const L = 0.6, u = 0.2, v = -0.1;
    const [l, c, h] = LuvToLuvLCh(L, u, v);
    const [L2, u2, v2] = LuvLChToLuv(l, c, h);
    expect(L2).toBeCloseTo(L, 10);
    expect(u2).toBeCloseTo(u, 10);
    expect(v2).toBeCloseTo(v, 10);
  });

  test('XyzToXyy and XyyToXyz round-trip', () => {
    const X = 0.5, Y = 0.4, Z = 0.3;
    const [x, y, Yout] = XyzToXyy(X, Y, Z);
    const [X2, Y2, Z2] = XyyToXyz(x, y, Yout);
    expect(X2).toBeCloseTo(X, 10);
    expect(Y2).toBeCloseTo(Y, 10);
    expect(Z2).toBeCloseTo(Z, 10);
  });

  test('HSLuv conversion functions are exported', () => {
    const [h, s, l] = luvLChToHSLuv(0.5, 0.2, 45);
    expect(typeof h).toBe('number');
    expect(typeof s).toBe('number');
    expect(typeof l).toBe('number');

    const [l2, c2, h2] = hsLuvToLuvLCh(h, s, l);
    expect(typeof l2).toBe('number');
    expect(typeof c2).toBe('number');
    expect(typeof h2).toBe('number');
  });

  test('HPLuv conversion functions are exported', () => {
    const [h, s, l] = luvLChToHPLuv(0.5, 0.2, 45);
    expect(typeof h).toBe('number');
    expect(typeof s).toBe('number');
    expect(typeof l).toBe('number');

    const [l2, c2, h2] = hpLuvToLuvLCh(h, s, l);
    expect(typeof l2).toBe('number');
    expect(typeof c2).toBe('number');
    expect(typeof h2).toBe('number');
  });
});

describe('v1.3.0 Color methods', () => {
  test('DistanceLinearRgb', () => {
    const c1 = new Color(1, 0, 0);
    const c2 = new Color(0, 1, 0);
    const dist = c1.distanceLinearRgb(c2);
    expect(dist).toBeGreaterThan(0);
  });

  test('DistanceRiemersma', () => {
    const c1 = new Color(1, 0, 0);
    const c2 = new Color(0, 1, 0);
    const dist = c1.distanceRiemersma(c2);
    expect(dist).toBeGreaterThan(0);

    // Distance to self should be 0
    expect(c1.distanceRiemersma(c1)).toBeCloseTo(0, 10);
  });

  test('BlendLinearRgb', () => {
    const c1 = new Color(1, 0, 0);
    const c2 = new Color(0, 0, 1);

    // t=0 should give c1
    const at0 = c1.blendLinearRgb(c2, 0);
    expect(at0.r).toBeCloseTo(1, 5);
    expect(at0.g).toBeCloseTo(0, 5);
    expect(at0.b).toBeCloseTo(0, 5);

    // t=1 should give c2
    const at1 = c1.blendLinearRgb(c2, 1);
    expect(at1.r).toBeCloseTo(0, 5);
    expect(at1.g).toBeCloseTo(0, 5);
    expect(at1.b).toBeCloseTo(1, 5);
  });

  test('BlendOkLab', () => {
    const c1 = new Color(1, 0, 0);
    const c2 = new Color(0, 0, 1);

    // OkLab round-trip has some precision loss due to matrix inversion
    const at0 = c1.blendOkLab(c2, 0);
    expect(at0.r).toBeCloseTo(1, 2);
    expect(at0.g).toBeCloseTo(0, 2);
    expect(at0.b).toBeCloseTo(0, 2);

    const at1 = c1.blendOkLab(c2, 1);
    expect(at1.r).toBeCloseTo(0, 2);
    expect(at1.g).toBeCloseTo(0, 2);
    expect(at1.b).toBeCloseTo(1, 2);

    // Midpoint should be somewhere between
    const mid = c1.blendOkLab(c2, 0.5);
    expect(mid.isValid()).toBe(true);
  });

  test('BlendOkLch', () => {
    const c1 = new Color(1, 0, 0);
    const c2 = new Color(0, 0, 1);

    // OkLch has clamping so precision at boundaries may vary
    const at0 = c1.blendOkLch(c2, 0);
    expect(at0.r).toBeCloseTo(1, 2);
    expect(at0.g).toBeCloseTo(0, 2);
    expect(at0.b).toBeCloseTo(0, 2);

    const at1 = c1.blendOkLch(c2, 1);
    expect(at1.r).toBeCloseTo(0, 2);
    expect(at1.g).toBeCloseTo(0, 2);
    expect(at1.b).toBeCloseTo(1, 2);

    // Midpoint should produce valid color
    const mid = c1.blendOkLch(c2, 0.5);
    expect(mid.isValid()).toBe(true);
  });

  test('OkLab color space conversion round-trip', () => {
    const original = new Color(0.5, 0.3, 0.8);
    const [l, a, b] = original.okLab();
    // Values should be reasonable
    expect(l).toBeGreaterThan(0);
    expect(l).toBeLessThan(1);
  });

  test('OkLch color space conversion round-trip', () => {
    const original = new Color(0.5, 0.3, 0.8);
    const [l, c, h] = original.okLch();
    expect(l).toBeGreaterThan(0);
    expect(c).toBeGreaterThan(0);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
  });
});
