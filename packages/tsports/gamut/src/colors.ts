/**
 * @tsports/gamut - Color manipulation functions
 *
 * Ported from colors.go
 */

import { Color, Hex as ColorfulHex, HCL, HSL, HSV, MakeColor } from '@tsports/go-colorful';

/**
 * hex returns the color encoded by a hex-string, e.g. "#ABCDEF".
 * Returns black if the hex string is invalid.
 */
export function hex(s: string): Color {
  try {
    return ColorfulHex(s);
  } catch (_e) {
    return new Color(0, 0, 0);
  }
}

/**
 * toHex returns the hex encoding of a color, e.g. "#ABCDEF".
 */
export function toHex(c: Color): string {
  const [cc] = MakeColor(c);
  return cc.hex();
}

/**
 * hueOffset returns color with a different hue angle.
 */
export function hueOffset(c: Color, degrees: number): Color {
  const [col] = MakeColor(c);
  let [h, s, v] = col.hsv();

  h += degrees;
  if (h < 0) {
    h += 360;
  } else if (h >= 360) {
    h -= 360;
  }

  return HSV(h, s, v).clamped();
}

/**
 * tetradic returns the tetradic values for any given color.
 */
export function tetradic(c1: Color, c2: Color): Color[] {
  const cc: Color[] = [];
  cc.push(complementary(c1));
  cc.push(complementary(c2));
  return cc;
}

/**
 * triadic returns the triadic values for any given color.
 */
export function triadic(c: Color): Color[] {
  const cc: Color[] = [];
  cc.push(hueOffset(c, -120));
  cc.push(hueOffset(c, 120));
  return cc;
}

/**
 * quadratic returns the quadratic values for any given color.
 */
export function quadratic(c: Color): Color[] {
  const cc: Color[] = [];
  cc.push(hueOffset(c, -90));
  cc.push(complementary(c));
  cc.push(hueOffset(c, 90));
  return cc;
}

/**
 * analogous returns the analogous values for any given color.
 */
export function analogous(c: Color): Color[] {
  const cc: Color[] = [];
  cc.push(hueOffset(c, -30));
  cc.push(hueOffset(c, 30));
  return cc;
}

/**
 * splitComplementary returns the split complementary values for any given color.
 */
export function splitComplementary(c: Color): Color[] {
  return analogous(complementary(c));
}

/**
 * complementary returns the complementary value for any given color.
 */
export function complementary(c: Color): Color {
  return hueOffset(c, 180);
}

/**
 * contrast returns the color with the most contrast (hence either black or white).
 */
export function contrast(c: Color): Color {
  const [col] = MakeColor(c);
  const wf = new Color(1, 1, 1);
  const bf = new Color(0, 0, 0);

  const [, , l] = col.hcl();
  if (l < 0.5) {
    return wf;
  }
  return bf;
}

/**
 * monochromatic returns the specified amount of monochromatic colors based on
 * a given color's hues.
 */
export function monochromatic(c: Color, count: number): Color[] {
  const [col] = MakeColor(c);

  const [h, s] = col.hsl();
  const dl = 1.0 / (count + 1);

  const cc: Color[] = [];
  for (let i = 1; i <= count; i++) {
    cc.push(HSL(h, s, dl * i).clamped());
  }

  return cc;
}

/**
 * blends returns a slice of interpolated colors, blended between two colors
 * using CIE-L*a*b* space.
 */
export function blends(c1: Color, c2: Color, count: number): Color[] {
  const [col1] = MakeColor(c1);
  const [col2] = MakeColor(c2);

  const dl = 1.0 / (count + 1);

  const cc: Color[] = [];
  for (let i = 1; i <= count; i++) {
    cc.push(col1.blendLab(col2, dl * i).clamped());
  }

  return cc;
}

/**
 * shades returns the specified amount of a color's shades.
 */
export function shades(c: Color, count: number): Color[] {
  const [col] = MakeColor(c);
  return blends(col, new Color(0.0, 0.0, 0.0), count);
}

/**
 * tints returns the specified amount of a color's tints.
 */
export function tints(c: Color, count: number): Color[] {
  const [col] = MakeColor(c);
  return blends(col, new Color(1.0, 1.0, 1.0), count);
}

/**
 * tones returns the specified amount of a color's tone.
 */
export function tones(c: Color, count: number): Color[] {
  const [col] = MakeColor(c);
  return blends(col, new Color(0.5, 0.5, 0.5), count);
}

/**
 * cool returns whether a color is considered to have a cool temperature.
 */
export function cool(c: Color): boolean {
  const [col] = MakeColor(c);
  const [h] = col.hsv();

  return 90 <= h && h < 270;
}

/**
 * warm returns whether a color is considered to have a warm temperature.
 */
export function warm(c: Color): boolean {
  return !cool(c);
}

/**
 * lighter returns a lighter version of the specified color.
 */
export function lighter(c: Color, percent: number): Color {
  const [col] = MakeColor(c);
  const [h, cv, l] = col.hcl();

  return HCL(h, cv, l + l * percent).clamped();
}

/**
 * darker returns a darker version of the specified color.
 */
export function darker(c: Color, percent: number): Color {
  const [col] = MakeColor(c);
  const [h, cv, l] = col.hcl();

  return HCL(h, cv, l - l * percent).clamped();
}
