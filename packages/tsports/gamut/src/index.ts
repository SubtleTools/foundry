/**
 * @tsports/gamut - A standard library for colors and palettes
 *
 * Ported from gamut.go
 */

// Re-export color manipulation functions
export * from './colors.js';
// Re-export generator logic
export * from './generator.js';
// Re-export Go-style API (PascalCase aliases)
export * from './go-style.js';
// Re-export palettes
export * as palette from './palette/index.js';
export { Palette } from './palette.js';

// Re-export themes
export * as theme from './theme/index.js';
// Re-export types
export type { Color, ColorfulColor, Colors } from './types.js';
