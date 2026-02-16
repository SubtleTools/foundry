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
export declare const LipglossPositions: {
    /** Left alignment (0.0) */
    readonly Left: LipglossPosition;
    /** Right alignment (1.0) */
    readonly Right: LipglossPosition;
    /** Center alignment (0.5) */
    readonly Center: LipglossPosition;
    /** Top alignment (0.0) */
    readonly Top: LipglossPosition;
    /** Bottom alignment (1.0) */
    readonly Bottom: LipglossPosition;
};
/**
 * String representations accepted by alignHorizontal and alignVertical methods
 * These map to the corresponding Position values
 */
export type HorizontalPositionString = 'left' | 'center' | 'right';
export type VerticalPositionString = 'top' | 'middle' | 'bottom';
/**
 * Convert horizontal position string to Position value
 */
export declare function horizontalPositionFromString(pos: HorizontalPositionString): LipglossPosition;
/**
 * Convert vertical position string to Position value
 */
export declare function verticalPositionFromString(pos: VerticalPositionString): LipglossPosition;
/**
 * Convert Position value to HorizontalAlignment enum for internal use
 */
export declare function positionToHorizontalAlignment(pos: LipglossPosition): import('./types').HorizontalAlignment;
/**
 * Convert Position value to VerticalAlignment enum for internal use
 */
export declare function positionToVerticalAlignment(pos: LipglossPosition): import('./types').VerticalAlignment;
//# sourceMappingURL=position-types.d.ts.map