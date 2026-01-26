import { describe, expect, it } from 'bun:test';
import { hex, toHex } from '../src/colors.js';
import { Crayola, Monokai, Wikipedia } from '../src/palette/index.js';

describe('Palette Data', () => {
  it('should find closest Wikipedia color name', () => {
    const tests = [
      { hex: '#FFBF00', exp: 'Amber' },
      { hex: '#FFBE00', exp: 'Amber' },
      { hex: '#FA6E79', exp: 'Begonia' },
      { hex: '#FB6E79', exp: 'Begonia' },
      { hex: '#0095B6', exp: 'Bondi blue' },
      { hex: '#0095B7', exp: 'Bondi blue' },
      { hex: '#F92672', exp: 'Neon pink' },
      { hex: '#AE81FF', exp: 'Medium purple' },
      { hex: '#66D9EF', exp: 'Sky blue (Crayola)' },
      { hex: '#E6DB74', exp: 'Straw' },
    ];

    for (const test of tests) {
      const c = hex(test.hex);
      const [m] = Wikipedia.name(c);
      expect(m[0]?.name).toBe(test.exp);
    }
  });

  it('should clamp to Wikipedia colors', () => {
    const cc = [hex('#FFBE00'), hex('#FB6E79'), hex('#0095B7')];
    const exp = [hex('#FFBF00'), hex('#FA6E79'), hex('#0095B6')];

    const c = Wikipedia.clamped(cc);
    for (let i = 0; i < c.length; i++) {
      expect(toHex(c[i]?.color!)).toBe(toHex(exp[i]!));
    }
  });

  it('should have correct number of Crayola colors', () => {
    expect(Crayola.getColors().length).toBe(180);
  });

  it('should have correct number of Monokai colors', () => {
    expect(Monokai.getColors().length).toBe(17);
  });

  it('should find Monokai color by name', () => {
    const [c, ok] = Monokai.color('Spray');
    expect(ok).toBe(true);
    expect(toHex(c!)).toBe('#66d9ef');
  });

  it('should filter Monokai colors by partial name', () => {
    const matches = Monokai.filter('Spray');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]?.name).toBe('Spray');
  });
});
