/**
 * @tsports/gamut - TypeScript type definitions
 *
 * Core types and interfaces for the TypeScript port of gamut.
 */

import { Color } from '@tsports/go-colorful';

/**
 * NamedColor represents a color with a name and a reference URL.
 * Corresponds to the `Color` struct in `colors.go`.
 */
export interface NamedColor {
  name: string;
  color: Color;
  reference: string;
}

/**
 * Colors is a collection of NamedColors.
 */
export type Colors = NamedColor[];

// Re-export Color for convenience
export { Color };
