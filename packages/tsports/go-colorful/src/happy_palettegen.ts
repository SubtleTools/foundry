/**
 * Happy palette generation
 * Uses the HSV color space to generate colors with similar S,V but distributed
 * evenly along their Hue. This is fast but not always pretty.
 * If you've got time to spare, use Lab (the non-fast below).
 */

import { type Color, hsv, labToHcl } from './colors';
import { getDefaultGlobalRand, type RandInterface } from './rand';
import { SoftPaletteExWithRand } from './soft_palettegen';

export const FastHappyPaletteWithRand = (colorsCount: number, rand: RandInterface): Color[] => {
  const colors: Color[] = [];
  for (let i = 0; i < colorsCount; i++) {
    colors.push(
      hsv(i * (360.0 / colorsCount), 0.8 + rand.float64() * 0.2, 0.65 + rand.float64() * 0.2)
    );
  }
  return colors;
};

export const FastHappyPalette = (colorsCount: number): Color[] => {
  return FastHappyPaletteWithRand(colorsCount, getDefaultGlobalRand());
};

export const HappyPaletteWithRand = (
  colorsCount: number,
  rand: RandInterface
): [Color[], Error | null] => {
  const pimpy = (l: number, a: number, b: number): boolean => {
    const [, c] = labToHcl(l, a, b);
    return 0.3 <= c && 0.4 <= l && l <= 0.8;
  };
  return SoftPaletteExWithRand(
    colorsCount,
    { checkColor: pimpy, iterations: 50, manySamples: true },
    rand
  );
};

export const HappyPalette = (colorsCount: number): [Color[], Error | null] => {
  return HappyPaletteWithRand(colorsCount, getDefaultGlobalRand());
};
