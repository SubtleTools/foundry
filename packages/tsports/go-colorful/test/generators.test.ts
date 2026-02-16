/**
 * Tests for color generators
 */

import { expect, test } from 'bun:test';
import { FastHappyColor, FastWarmColor, HappyColor, WarmColor } from '../src';

test('FastWarmColor generates valid warm colors', () => {
  for (let i = 0; i < 10; i++) {
    const c = FastWarmColor();
    expect(c.isValid()).toBe(true);

    const [_h, s, v] = c.hsv();
    expect(s).toBeGreaterThanOrEqual(0.5);
    expect(s).toBeLessThanOrEqual(0.8);
    expect(v).toBeGreaterThanOrEqual(0.3);
    expect(v).toBeLessThanOrEqual(0.6);
  }
});

test('WarmColor generates valid warm colors', () => {
  for (let i = 0; i < 10; i++) {
    const c = WarmColor();
    expect(c.isValid()).toBe(true);

    const [_h, chroma, lightness] = c.hcl();
    expect(chroma).toBeGreaterThanOrEqual(0.1);
    expect(chroma).toBeLessThanOrEqual(0.4);
    expect(lightness).toBeGreaterThanOrEqual(0.2);
    expect(lightness).toBeLessThanOrEqual(0.5);
  }
});

test('FastHappyColor generates valid happy colors', () => {
  for (let i = 0; i < 10; i++) {
    const c = FastHappyColor();
    expect(c.isValid()).toBe(true);

    const [_h, s, v] = c.hsv();
    expect(s).toBeGreaterThanOrEqual(0.7);
    expect(s).toBeLessThanOrEqual(1.0);
    expect(v).toBeGreaterThanOrEqual(0.6);
    expect(v).toBeLessThanOrEqual(0.9);
  }
});

test('HappyColor generates valid happy colors', () => {
  for (let i = 0; i < 10; i++) {
    const c = HappyColor();
    expect(c.isValid()).toBe(true);

    const [_h, chroma, lightness] = c.hcl();
    expect(chroma).toBeGreaterThanOrEqual(0.3);
    expect(lightness).toBeGreaterThanOrEqual(0.4);
    expect(lightness).toBeLessThanOrEqual(0.8);
  }
});
