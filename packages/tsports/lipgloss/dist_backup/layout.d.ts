/**
 * Layout utilities for padding, margins, and text measurement
 *
 * This module provides utilities for:
 * - CSS-style padding/margin shorthand parsing
 * - Accurate text width calculation with Unicode support
 * - Layout computation and overflow handling
 */
import { type ColorValue, type HeightConfig, HorizontalAlignment, type MarginConfig, type PaddingConfig, type WidthConfig } from './types';
/**
 * Parse CSS-style padding shorthand values into individual padding values
 * Supports 1-4 value syntax:
 * - 1 value: all sides
 * - 2 values: vertical, horizontal
 * - 3 values: top, horizontal, bottom
 * - 4 values: top, right, bottom, left
 *
 * @param values - Array of 1-4 padding values
 * @returns PaddingConfig with individual top, right, bottom, left values
 */
export declare function parsePaddingShorthand(values: number[]): PaddingConfig;
/**
 * Parse CSS-style margin shorthand values into individual margin values
 * Uses the same logic as padding shorthand parsing
 *
 * @param values - Array of 1-4 margin values
 * @returns MarginConfig with individual top, right, bottom, left values
 */
export declare function parseMarginShorthand(values: number[]): MarginConfig;
export declare function getTextWidth(text: string): number;
/**
 * Split text into lines and calculate the width of each line
 *
 * @param text - The text to analyze
 * @returns Array of line widths
 */
export declare function getLineWidths(text: string): number[];
/**
 * Get the maximum width (widest line) in a multi-line text
 *
 * @param text - The text to analyze
 * @returns The width of the widest line
 */
export declare function getMaxTextWidth(text: string): number;
/**
 * Calculate the total padding width (left + right)
 *
 * @param padding - Padding configuration
 * @returns Total horizontal padding
 */
export declare function getHorizontalPadding(padding?: PaddingConfig): number;
/**
 * Calculate the total padding height (top + bottom)
 *
 * @param padding - Padding configuration
 * @returns Total vertical padding
 */
export declare function getVerticalPadding(padding?: PaddingConfig): number;
/**
 * Calculate the total margin width (left + right)
 *
 * @param margin - Margin configuration
 * @returns Total horizontal margin
 */
export declare function getHorizontalMargin(margin?: MarginConfig): number;
/**
 * Calculate the total margin height (top + bottom)
 *
 * @param margin - Margin configuration
 * @returns Total vertical margin
 */
export declare function getVerticalMargin(margin?: MarginConfig): number;
/**
 * Truncate text to fit within a specified width
 *
 * @param text - The text to truncate
 * @param maxWidth - Maximum allowed width
 * @param ellipsis - String to append when truncating (default: '...')
 * @returns Truncated text
 */
export declare function truncateText(text: string, maxWidth: number, ellipsis?: string): string;
/**
 * Truncate text to exactly fit within a width (without ellipsis)
 * Handles Unicode characters properly
 *
 * @param text - The text to truncate
 * @param maxWidth - Maximum allowed width
 * @returns Truncated text
 */
export declare function truncateToWidth(text: string, maxWidth: number): string;
/**
 * Wrap text to fit within a specified width
 *
 * @param text - The text to wrap
 * @param maxWidth - Maximum width per line
 * @param preserveWhitespace - Whether to preserve existing whitespace
 * @returns Array of wrapped lines
 */
export declare function wrapText(text: string, maxWidth: number, preserveWhitespace?: boolean): string[];
/**
 * Calculate the actual content width based on WidthConfig
 *
 * @param widthConfig - Width configuration
 * @param contentWidth - Natural width of the content
 * @param availableWidth - Available width from parent container
 * @returns Calculated width
 */
export declare function calculateWidth(widthConfig: WidthConfig | undefined, contentWidth: number, availableWidth?: number): number;
/**
 * Calculate the actual content height based on HeightConfig
 *
 * @param heightConfig - Height configuration
 * @param contentHeight - Natural height of the content (number of lines)
 * @param availableHeight - Available height from parent container
 * @returns Calculated height
 */
export declare function calculateHeight(heightConfig: HeightConfig | undefined, contentHeight: number, availableHeight?: number): number;
/**
 * Apply Go-style width constraints (word-preferring wrapping with exact width padding)
 * This matches the behavior of Go's Lipgloss width constraint implementation
 *
 * @param text - The text to constrain
 * @param targetWidth - The target width in characters
 * @returns Width-constrained text with exact padding
 */
export declare function applyGoStyleWidthConstraint(text: string, targetWidth: number): string;
/**
 * Wrap a line using Go-style algorithm: prefer word boundaries, break words when necessary
 * For very narrow widths (1-2 chars), use character-based wrapping to match Go behavior
 *
 * @param line - The line to wrap
 * @param maxWidth - Maximum width per line
 * @returns Array of wrapped lines
 */
export declare function wrapLineGoStyle(line: string, maxWidth: number): string[];
/**
 * Apply padding to text content
 *
 * @param text - The text content
 * @param padding - Padding configuration
 * @param width - Target width (optional)
 * @returns Padded text
 */
export declare function applyPadding(text: string, padding: PaddingConfig, width?: number, horizontalAlignment?: HorizontalAlignment): string;
/**
 * Apply margin to text content with optional background color
 *
 * @param text - The text content
 * @param margin - Margin configuration
 * @param marginBackground - Optional background color for margin areas
 * @param inline - Whether this is inline rendering (affects top/bottom margins)
 * @returns Text with margins applied
 */
export declare function applyMargin(text: string, margin: MarginConfig, marginBackground?: ColorValue, inline?: boolean): string;
/**
 * Apply margin background color using ANSI escape sequences
 * This is a separate function to handle color styling for margin areas
 *
 * @param text - The text with margins already applied
 * @param marginBackground - Background color for margin areas
 * @returns Text with margin background color applied
 */
export declare function applyMarginBackground(text: string, marginBackground: ColorValue): string;
//# sourceMappingURL=layout.d.ts.map