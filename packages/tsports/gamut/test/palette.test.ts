import { beforeAll, describe, expect, it } from 'bun:test';
import { hex, toHex } from '../src/colors.js';
import { Palette } from '../src/palette.js';

describe('Palette', () => {
  let p1: Palette;
  let p2: Palette;
  let p3: Palette;

  beforeAll(() => {
    p1 = new Palette();
    p1.addColors([
      { name: 'Spray', color: hex('#66D9EF'), reference: '' },
      { name: 'Tree Poppy', color: hex('#FD971F'), reference: '' },
      { name: 'Armadillo', color: hex('#49483E'), reference: '' },
      { name: 'El Paso', color: hex('#3E3D32'), reference: '' },
      { name: 'Center Stage', color: hex('#A6E22E'), reference: '' },
      { name: 'Feverish Pink', color: hex('#F92672'), reference: '' },
      { name: 'Lavish Lavender', color: hex('#AE81FF'), reference: '' },
      { name: 'Funky Yellow', color: hex('#E6DB74'), reference: '' },
      { name: 'Cocoon', color: hex('#75715E'), reference: '' },
    ]);

    p2 = new Palette();
    p2.addColors([
      { name: 'Extra White', color: hex('#F8F8F2'), reference: '' },
      { name: 'Caviar', color: hex('#272822'), reference: '' },
      { name: 'Caviar Dark', color: hex('#141411'), reference: '' },
      { name: 'Blue Beyond', color: hex('#89BDFF'), reference: '' },
      { name: 'Urbane Bronze', color: hex('#595959'), reference: '' },
      { name: 'Tricorn Black', color: hex('#383830'), reference: '' },
      { name: 'Soothing White', color: hex('#E6E6E6'), reference: '' },
      { name: 'Ice Plant', color: hex('#FD5FF1'), reference: '' },
    ]);

    p3 = new Palette();
    p3.addColors([
      { name: 'Spray', color: hex('#66D9EF'), reference: '' },
      { name: 'Extra White', color: hex('#F8F8F2'), reference: '' },
    ]);
  });

  it('should handle hex conversions', () => {
    const exp = '#66d9ef';
    const c = hex(exp);
    expect(toHex(c)).toBe(exp);
  });

  it('should find closest matching color name', () => {
    const cases = [
      { hex: '#66D9EF', exp: 'Spray' },
      { hex: '#66D9EE', exp: 'Spray' },
      { hex: '#3E3D32', exp: 'El Paso' },
      { hex: '#3F3D32', exp: 'El Paso' },
    ];

    for (const test of cases) {
      const c = hex(test.hex);
      const [m] = p1.name(c);
      expect(m[0]?.name).toBe(test.exp);
    }
  });

  it('should clamp colors to palette', () => {
    const cc = [hex('#66D9EE'), hex('#3F3D32')];
    const exp = [hex('#66D9EF'), hex('#3E3D32')];

    const c = p1.clamped(cc);
    expect(c.length).toBe(exp.length);
    for (let i = 0; i < c.length; i++) {
      const item = c[i];
      const expected = exp[i];
      if (item && expected) {
        expect(toHex(item.color)).toBe(toHex(expected));
      }
    }
  });

  it('should list all colors', () => {
    expect(p1.getColors().length).toBe(9);
  });

  it('should mix palettes', () => {
    let p = p1.mixedWith(p2);
    expect(p.getColors().length).toBe(p1.getColors().length + p2.getColors().length);

    p = p1.mixedWith(p3);
    expect(p.getColors().length).toBe(10); // some p3 colors are duped in p1

    p = p1.mixedWith(p1);
    expect(p.getColors().length).toBe(p1.getColors().length);
  });

  it('should filter colors by name', () => {
    const cc = p1.filter('el');
    expect(cc.length).toBe(2);
  });

  it('should retrieve color by name', () => {
    const [c, ok] = p1.color('Spray');
    expect(ok).toBe(true);
    if (c) {
      expect(toHex(c)).toBe('#66d9ef');
    }

    // test case insensitivity
    const [c2, ok2] = p1.color('spray');
    expect(ok2).toBe(true);
    if (c2) {
      expect(toHex(c2)).toBe('#66d9ef');
    }

    const [, ok3] = p1.color('Foobar red');
    expect(ok3).toBe(false);
  });
});
