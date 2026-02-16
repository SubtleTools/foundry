/**
 * Position types and constants that match Go Lipgloss Position API
 *
 * In Go Lipgloss:
 * - Position is a float64 (0.0 = start, 1.0 = end, 0.5 = center)
 * - Constants: Left=0.0, Right=1.0, Center=0.5, Top=0.0, Bottom=1.0
 */
/**
 * Position constants that match Go Lipgloss exactly
 */
export const LipglossPositions = {
    /** Left alignment (0.0) */
    Left: 0.0,
    /** Right alignment (1.0) */
    Right: 1.0,
    /** Center alignment (0.5) */
    Center: 0.5,
    /** Top alignment (0.0) */
    Top: 0.0,
    /** Bottom alignment (1.0) */
    Bottom: 1.0,
};
/**
 * Convert horizontal position string to Position value
 */
export function horizontalPositionFromString(pos) {
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
export function verticalPositionFromString(pos) {
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
export function positionToHorizontalAlignment(pos) {
    const { HorizontalAlignment } = require('./types');
    if (pos <= 0.0) {
        return HorizontalAlignment.Left;
    }
    else if (pos >= 1.0) {
        return HorizontalAlignment.Right;
    }
    else {
        return HorizontalAlignment.Center;
    }
}
/**
 * Convert Position value to VerticalAlignment enum for internal use
 */
export function positionToVerticalAlignment(pos) {
    const { VerticalAlignment } = require('./types');
    if (pos <= 0.0) {
        return VerticalAlignment.Top;
    }
    else if (pos >= 1.0) {
        return VerticalAlignment.Bottom;
    }
    else {
        return VerticalAlignment.Center;
    }
}
//# sourceMappingURL=position-types.js.map