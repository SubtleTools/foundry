/**
 * Shared type definitions for test utilities
 */

export interface ComparisonResult {
  match: boolean;
  tsOutput: string;
  goOutput: string;
  differences?: ComparisonDifference[];
}

export interface ComparisonDifference {
  position: number;
  tsChar: string;
  goChar: string;
  context: {
    ts: string;
    go: string;
  };
}

export interface ComparisonOptions {
  /** Enable hex color tolerance */
  tolerateHexColors?: boolean;

  /** Enable ANSI RGB tolerance */
  tolerateAnsiRgb?: boolean;

  /** Enable table structure comparison */
  useTableComparison?: boolean;

  /** Max differences to report (default: 5) */
  maxDifferences?: number;
}

export interface ToleranceConfig {
  /** Tolerance for hex color comparison (per RGB channel, 0-255) */
  hexColorTolerance: number;

  /** Tolerance for ANSI RGB codes (per channel, 0-255) */
  ansiRgbTolerance: number;

  /** Relative error tolerance for floating-point comparisons (0.0-1.0) */
  floatRelativeTolerance: number;

  /** Absolute error tolerance for near-zero floating-point values */
  floatAbsoluteTolerance: number;
}
