/**
 * Text alignment utilities - comprehensive alignment support
 *
 * This module handles text alignment (left, center, right, justify)
 * and positioning utilities with full TypeScript type safety.
 */
import { HorizontalAlignment, type Position, VerticalAlignment } from './types';
/**
 * Alignment utilities for easy access to alignment constants.
 *
 * @example
 * ```typescript
 * // Use alignment constants
 * const leftAligned = AlignUtils.alignHorizontal(text, 20, Align.Left);
 * const centered = AlignUtils.center(text, 30, 10);
 * const rightAligned = AlignUtils.alignHorizontal(text, 20, Align.Right);
 *
 * // Vertical alignment
 * const topAligned = AlignUtils.alignVertical(lines, 10, Align.Top);
 * const middleAligned = AlignUtils.alignVertical(lines, 10, Align.Middle);
 * const bottomAligned = AlignUtils.alignVertical(lines, 10, Align.Bottom);
 * ```
 */
export declare const Align: {
    /** @see {HorizontalAlignment.Left} */
    readonly Left: HorizontalAlignment.Left;
    /** @see {HorizontalAlignment.Center} */
    readonly Center: HorizontalAlignment.Center;
    /** @see {HorizontalAlignment.Right} */
    readonly Right: HorizontalAlignment.Right;
    /** @see {VerticalAlignment.Top} */
    readonly Top: VerticalAlignment.Top;
    /** @see {VerticalAlignment.Center} */
    readonly Middle: VerticalAlignment.Center;
    /** @see {VerticalAlignment.Bottom} */
    readonly Bottom: VerticalAlignment.Bottom;
};
/**
 * Utility functions for text alignment and positioning
 */
/**
 * Perform text alignment. If the string is multi-lined, we also make all lines
 * the same width by padding them with spaces. If a termenv style is passed,
 * use that to style the spaces added.
 */
export declare function alignTextHorizontal(str: string, pos: import('./position-types').LipglossPosition, width: number, style?: import('@tsports/termenv').Style): string;
/**
 * Align text vertically within a given height
 */
export declare function alignTextVertical(str: string, pos: import('./position-types').LipglossPosition, height: number, style?: import('@tsports/termenv').Style): string;
export declare class AlignUtils {
    /**
     * Align text horizontally within a given width
     *
     * @param text - The text to align
     * @param width - The target width
     * @param alignment - The horizontal alignment
     * @returns Aligned text with padding
     */
    static alignHorizontal(text: string, width: number, alignment: HorizontalAlignment): string;
    /**
     * Align multiple lines of text vertically within a given height
     *
     * @param lines - Array of text lines
     * @param height - The target height
     * @param alignment - The vertical alignment
     * @param width - Optional width for consistent empty line width
     * @returns Array of lines with empty lines added for alignment
     */
    static alignVertical(lines: string[], height: number, alignment: VerticalAlignment, width?: number): string[];
    /**
     * Create a position object from horizontal and vertical alignments
     *
     * @param horizontal - Horizontal alignment
     * @param vertical - Vertical alignment
     * @returns Position object
     */
    static createPosition(horizontal?: HorizontalAlignment, vertical?: VerticalAlignment): Position;
    /**
     * Center text both horizontally and vertically
     *
     * @param text - The text to center
     * @param width - Target width
     * @param height - Target height
     * @returns Centered text as array of lines
     */
    static center(text: string, width: number, height: number): string[];
    /**
     * Justify text to fit within a given width by adding spaces
     *
     * @param text - The text to justify
     * @param width - The target width
     * @returns Justified text
     */
    static justify(text: string, width: number): string;
    /**
     * Get the display width of text (accounting for ANSI sequences and Unicode)
     *
     * @param text - The text to measure
     * @returns Display width
     */
    static getDisplayWidth(text: string): number;
    /**
     * Wrap text to fit within a specified width
     *
     * @param text - The text to wrap
     * @param width - Maximum width per line
     * @param breakWords - Whether to break words if they're too long
     * @returns Array of wrapped lines
     */
    static wrapText(text: string, width: number, breakWords?: boolean): string[];
    /**
     * Align text lines horizontally within a container
     *
     * @param text - The text content (can be multi-line)
     * @param width - The target width for alignment
     * @param alignment - The horizontal alignment
     * @returns Text with each line aligned
     */
    static alignText(text: string, width: number, alignment: HorizontalAlignment): string;
    /**
     * Align text with both horizontal and vertical alignment
     *
     * @param text - The text content (can be multi-line)
     * @param width - The target width
     * @param height - The target height
     * @param horizontalAlignment - The horizontal alignment
     * @param verticalAlignment - The vertical alignment
     * @returns Aligned text as array of lines
     */
    static alignTextBox(text: string, width: number, height: number, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment): string[];
    /**
     * Get the optimal width for a text block
     *
     * @param text - The text content
     * @returns The maximum width needed to display the text
     */
    static getOptimalWidth(text: string): number;
}
/**
 * Type guard to check if a value is a valid Position object
 *
 * @param value - The value to check
 * @returns True if the value is a valid Position
 */
export declare function isValidPosition(value: unknown): value is Position;
export type { Position };
//# sourceMappingURL=align.d.ts.map