/**
 * Warm palette generation
 * Uses the HSV color space to generate colors with similar S,V but distributed
 * evenly along their Hue. This is fast but not always pretty.
 * If you've got time to spare, use Lab (the non-fast below).
 */

import { type Color, hsv, labToHcl } from './colors';
import { getDefaultGlobalRand, type RandInterface } from './rand';
import { SoftPaletteExWithRand } from './soft_palettegen';

export const FastWarmPaletteWithRand = (colorsCount: number, rand: RandInterface): Color[] => {
  const colors: Color[] = [];
  for (let i = 0; i < colorsCount; i++) {
    colors.push(
      hsv(i * (360.0 / colorsCount), 0.55 + rand.float64() * 0.2, 0.35 + rand.float64() * 0.2)
    );
  }
  return colors;
};

export const FastWarmPalette = (colorsCount: number): Color[] => {
  return FastWarmPaletteWithRand(colorsCount, getDefaultGlobalRand());
};

export const WarmPaletteWithRand = (
  colorsCount: number,
  rand: RandInterface
): [Color[], Error | null] => {
  const warmy = (l: number, a: number, b: number): boolean => {
    const [, c] = labToHcl(l, a, b);
    return 0.1 <= c && c <= 0.4 && 0.2 <= l && l <= 0.5;
  };
  return SoftPaletteExWithRand(
    colorsCount,
    { checkColor: warmy, iterations: 50, manySamples: true },
    rand
  );
};

export const WarmPalette = (colorsCount: number): [Color[], Error | null] => {
  return WarmPaletteWithRand(colorsCount, getDefaultGlobalRand());
};
