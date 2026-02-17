import { Color as TSColor } from '@tsports/go-colorful';
import { Color as GoStyleColor } from '@tsports/go-colorful/go-style';
import * as colors from './colors.js';
import * as generator from './generator.js';

/**
 * Helper to convert TS-style colors to Go-style colors
 */
function wrap(c: unknown): unknown {
  if (Array.isArray(c)) {
    return c.map(wrap);
  }
  if (c instanceof TSColor) {
    return GoStyleColor.fromTSColor(c);
  }
  return c;
}

/**
 * Helper to wrap a function to return Go-style colors
 */
// biome-ignore lint: wrapper needs loose types to bridge TS and Go-style APIs
function wrapFn<F extends (...args: any[]) => any>(fn: F): (...args: Parameters<F>) => ReturnType<F> {
  return ((...args: Parameters<F>) => wrap(fn(...args))) as any;
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
