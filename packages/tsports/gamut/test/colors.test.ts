import { describe, expect, it } from 'bun:test';
import {
  analogous,
  complementary,
  contrast,
  cool,
  darker,
  hex,
  hueOffset,
  lighter,
  monochromatic,
  quadratic,
  shades,
  splitComplementary,
  tetradic,
  tints,
  toHex,
  tones,
  triadic,
  warm,
} from '../src/colors.js';

describe('Color manipulation', () => {
  it('should detect warm/cool colors', () => {
    const cases = [
      { hex: '#2f1b82', cool: true },
      { hex: '#ff1b82', cool: false },
    ];

    for (const c of cases) {
      const col = hex(c.hex);
      expect(cool(col)).toBe(c.cool);
      expect(warm(col)).toBe(!c.cool);
    }
  });

  it('should adjust lightness', () => {
    const cases = [
      { fn: lighter, percent: 0.1, hex: '#2f1b82', exp: '#352087' },
      { fn: lighter, percent: 0.8, hex: '#ea621f', exp: '#ffe49a' },
      { fn: darker, percent: 0.3, hex: '#2f1b82', exp: '#1b0d72' },
      { fn: darker, percent: 0.8, hex: '#ea621f', exp: '#5e0000' },
    ];

    for (const c of cases) {
      const col = hex(c.hex);
      const res = c.fn(col, c.percent);
      expect(toHex(res)).toBe(c.exp);
    }
  });

  it('should find complementary color', () => {
    const cases = [
      { hex: '#2f1b82', comp: '#6e821b' },
      { hex: '#00ffff', comp: '#ff0000' },
    ];

    for (const c of cases) {
      const col = hex(c.hex);
      const res = complementary(col);
      expect(toHex(res)).toBe(c.comp);
    }
  });

  it('should find contrast color', () => {
    const cases = [
      { hex: '#2f1b82', contrast: '#ffffff' },
      { hex: '#ff1b82', contrast: '#000000' },
    ];

    for (const c of cases) {
      const col = hex(c.hex);
      const res = contrast(col);
      expect(toHex(res)).toBe(c.contrast);
    }
  });

  it('should calculate hue offsets', () => {
    const cases = [
      { fn: triadic, hex: '#2f1b82', exp: ['#1b822f', '#822f1b'] },
      { fn: quadratic, hex: '#2f1b82', exp: ['#1b8262', '#6e821b', '#821b3b'] },
      { fn: analogous, hex: '#2f1b82', exp: ['#1b3b82', '#621b82'] },
      { fn: splitComplementary, hex: '#2f1b82', exp: ['#82621b', '#3b821b'] },
    ];

    for (const c of cases) {
      const col = hex(c.hex);
      const res = c.fn(col).map(toHex);
      expect(res).toEqual(c.exp);
    }
  });

  it('should calculate lightness offsets', () => {
    const cases = [
      {
        fn: monochromatic,
        count: 8,
        hex: '#2f1b82',
        exp: [
          '#110a2f',
          '#22135e',
          '#331d8d',
          '#4427bc',
          '#6043d8',
          '#8872e2',
          '#b0a1ec',
          '#d7d0f5',
        ],
      },
      {
        fn: shades,
        count: 8,
        hex: '#2f1b82',
        exp: [
          '#2c1973',
          '#291864',
          '#251656',
          '#211447',
          '#1d123a',
          '#190f2d',
          '#150b20',
          '#0c0514',
        ],
      },
      {
        fn: tints,
        count: 8,
        hex: '#2f1b82',
        exp: [
          '#4b3290',
          '#634a9e',
          '#7a62ac',
          '#917ab9',
          '#a794c7',
          '#bdaed5',
          '#d3c8e3',
          '#e9e3f1',
        ],
      },
      {
        fn: tones,
        count: 8,
        hex: '#2f1b82',
        exp: [
          '#3d2782',
          '#483282',
          '#523d82',
          '#5b4882',
          '#635382',
          '#6b5e82',
          '#726981',
          '#797480',
        ],
      },
    ];

    for (const c of cases) {
      const col = hex(c.hex);
      const res = c.fn(col, c.count).map(toHex);
      expect(res).toEqual(c.exp);
    }
  });

  it('should calculate tetradic colors', () => {
    const c1 = hex('#2f1b82');
    const c2 = hueOffset(c1, 60);
    const exp1 = '#6e821b';
    const exp2 = '#1b822f';

    const tc = tetradic(c1, c2);
    expect(toHex(tc[0]!)).toBe(exp1);
    expect(toHex(tc[1]!)).toBe(exp2);
  });
});
