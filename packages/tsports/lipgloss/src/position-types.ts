/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Position types and constants that match Go Lipgloss Position API
 *
 * In Go Lipgloss:
 * - Position is a float64 (0.0 = start, 1.0 = end, 0.5 = center)
 * - Constants: Left=0.0, Right=1.0, Center=0.5, Top=0.0, Bottom=1.0
 */

/**
 * Position represents a position along a horizontal or vertical axis.
 * It's used in situations where an axis is involved, like alignment, joining, placement and so on.
 *
 * A value of 0 represents the start (the left or top) and 1 represents the end
 * (the right or bottom). 0.5 represents the center.
 */
export type LipglossPosition = number;

/**
 * Position constants that match Go Lipgloss exactly
 */
export const LipglossPositions = {
  /** Left alignment (0.0) */
  Left: 0.0 as LipglossPosition,
  /** Right alignment (1.0) */
  Right: 1.0 as LipglossPosition,
  /** Center alignment (0.5) */
  Center: 0.5 as LipglossPosition,
  /** Top alignment (0.0) */
  Top: 0.0 as LipglossPosition,
  /** Bottom alignment (1.0) */
  Bottom: 1.0 as LipglossPosition,
} as const;

/**
 * String representations accepted by alignHorizontal and alignVertical methods
 * These map to the corresponding Position values
 */
export type HorizontalPositionString = 'left' | 'center' | 'right';
export type VerticalPositionString = 'top' | 'middle' | 'bottom';

/**
 * Convert horizontal position string to Position value
 */
export function horizontalPositionFromString(pos: HorizontalPositionString): LipglossPosition {
  switch (pos) {
    case 'left':
      return LipglossPositions.Left;
    case 'center':
      return LipglossPositions.Center;
    case 'right':
      return LipglossPositions.Right;
    default:
      return LipglossPositions.Left; // Default fallback
  }
}

/**
 * Convert vertical position string to Position value
 */
export function verticalPositionFromString(pos: VerticalPositionString): LipglossPosition {
  switch (pos) {
    case 'top':
      return LipglossPositions.Top;
    case 'middle':
      return LipglossPositions.Center; // Note: 'middle' maps to Center (0.5)
    case 'bottom':
      return LipglossPositions.Bottom;
    default:
      return LipglossPositions.Top; // Default fallback
  }
}

/**
 * Convert Position value to HorizontalAlignment enum for internal use
 */
export function positionToHorizontalAlignment(
  pos: LipglossPosition
): import('./types').HorizontalAlignment {
  const { HorizontalAlignment } = require('./types');

  if (pos <= 0.0) {
    return HorizontalAlignment.Left;
  } else if (pos >= 1.0) {
    return HorizontalAlignment.Right;
  } else {
    return HorizontalAlignment.Center;
  }
}

/**
 * Convert Position value to VerticalAlignment enum for internal use
 */
export function positionToVerticalAlignment(
  pos: LipglossPosition
): import('./types').VerticalAlignment {
  const { VerticalAlignment } = require('./types');

  if (pos <= 0.0) {
    return VerticalAlignment.Top;
  } else if (pos >= 1.0) {
    return VerticalAlignment.Bottom;
  } else {
    return VerticalAlignment.Center;
  }
}
