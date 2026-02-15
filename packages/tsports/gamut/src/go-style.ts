import { Color as AugmentedColor } from '@tsports/go-colorful';
import * as colors from './colors.js';
import * as generator from './generator.js';

type ColorLike = unknown;

/**
 * Helper to convert simple colors to augmented colors
 */
function wrap(c: ColorLike): ColorLike {
  if (Array.isArray(c)) {
    return c.map(wrap);
  }
  if (c && (typeof c.RGBA === 'function' || typeof c.rgba === 'function')) {
    return AugmentedColor.fromTSColor(c.toTSColor ? c.toTSColor() : c);
  }
  return c;
}

/**
 * Helper to wrap a function to return augmented colors
 */
function wrapFn(fn: (...args: unknown[]) => unknown): (...args: unknown[]) => unknown {
  return (...args: unknown[]) => wrap(fn(...args));
}

// Re-export colors functions in PascalCase
export const Hex = wrapFn(colors.hex);
export const ToHex = colors.toHex;
export const HueOffset = wrapFn(colors.hueOffset);
export const Tetradic = wrapFn(colors.tetradic);
export const Triadic = wrapFn(colors.triadic);
export const Quadratic = wrapFn(colors.quadratic);
export const Analogous = wrapFn(colors.analogous);
export const SplitComplementary = wrapFn(colors.splitComplementary);
export const Complementary = wrapFn(colors.complementary);
export const Contrast = wrapFn(colors.contrast);
export const Monochromatic = wrapFn(colors.monochromatic);
export const Blends = wrapFn(colors.blends);
export const Shades = wrapFn(colors.shades);
export const Tints = wrapFn(colors.tints);
export const Tones = wrapFn(colors.tones);
export const Cool = colors.cool;
export const Warm = colors.warm;
export const Lighter = wrapFn(colors.lighter);
export const Darker = wrapFn(colors.darker);

// Re-export Generator functions and types
export const Generate = wrapFn(generator.generate);
export type { ColorGenerator } from './generator.js';
export {
  BroadGranularity,
  FineGranularity,
  HappyGenerator,
  PastelGenerator,
  SimilarHueGenerator,
  WarmGenerator,
} from './generator.js';
// Re-export Palette and Types
export { Palette } from './palette.js';
export { Role } from './theme/roles.js';

// Re-export Theme and Role
export { MonokaiTheme, Theme } from './theme/themes.js';
export type { Color, ColorfulColor, Colors } from './types.js';
