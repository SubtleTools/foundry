import { describe, expect, test } from 'bun:test';
import { Hex } from '../src/go-style.js';
import { blends, hex } from '../src/index.js';
import { Monokai } from '../src/palette/index.js';

describe('Gamut Basic Tests', () => {
  test('hex parsing', () => {
    const c = hex('#ABCDEF');
    expect(c.hex().toUpperCase()).toBe('#ABCDEF');
  });

  test('invalid hex returns black', () => {
    const c = hex('invalid');
    expect(c.hex()).toBe('#000000');
  });

  test('blends', () => {
    const c1 = hex('#FFFFFF');
    const c2 = hex('#000000');
    const b = blends(c1, c2, 1);
    expect(b.length).toBe(1);
  });

  test('Monokai palette', () => {
    const [c, ok] = Monokai.color('Spray');
    expect(ok).toBe(true);
    // Note: go-colorful hex() returns lowercase usually
    expect(c?.hex().toUpperCase()).toBe('#66D9EF');
  });

  test('Monokai palette filter', () => {
    const matches = Monokai.filter('Spray');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].name).toBe('Spray');
  });

  test('Go-Style Hex alias', () => {
    const c = Hex('#123456');
    expect(c.hex()).toBe('#123456');
  });
});
