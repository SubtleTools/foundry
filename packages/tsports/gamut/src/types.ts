/**
 * @tsports/gamut - TypeScript type definitions
 *
 * Core types and interfaces for the TypeScript port of gamut.
 */

import type { Color as ColorfulColor } from '@tsports/go-colorful';

/**
 * Color represents a color with a name and a reference URL.
 * Corresponds to the `Color` struct in `colors.go`.
 *
 * Note: This is different from go-colorful's Color type.
 * This struct wraps a colorful.Color with metadata (name, reference).
 */
export interface Color {
  name: string;
  color: ColorfulColor;
  reference: string;
}

/**
 * Colors is a collection of Color objects.
 */
export type Colors = Color[];

// Re-export go-colorful's Color under a different name for internal use
export type { ColorfulColor };
