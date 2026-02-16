/**
 * Text alignment utilities - comprehensive alignment support
 *
 * This module handles text alignment (left, center, right, justify)
 * and positioning utilities with full TypeScript type safety.
 */
import { getTextWidth, wrapText } from './layout';
import { HorizontalAlignment, VerticalAlignment } from './types';
import { getLines } from './size';
import { stringWidth } from './ansi-utils';
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
export const Align = {
    // Horizontal alignment
    /** @see {HorizontalAlignment.Left} */
    Left: HorizontalAlignment.Left,
    /** @see {HorizontalAlignment.Center} */
    Center: HorizontalAlignment.Center,
    /** @see {HorizontalAlignment.Right} */
    Right: HorizontalAlignment.Right,
    // Vertical alignment
    /** @see {VerticalAlignment.Top} */
    Top: VerticalAlignment.Top,
    /** @see {VerticalAlignment.Center} */
    Middle: VerticalAlignment.Center,
    /** @see {VerticalAlignment.Bottom} */
    Bottom: VerticalAlignment.Bottom,
};
/**
 * Utility functions for text alignment and positioning
 */
/**
 * Perform text alignment. If the string is multi-lined, we also make all lines
 * the same width by padding them with spaces. If a termenv style is passed,
 * use that to style the spaces added.
 */
export function alignTextHorizontal(str, pos, width, style) {
    const { lines, width: widestLine } = getLines(str);
    const result = [];
    // stringWidth imported at the top
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineWidth = stringWidth(line);
        let shortAmount = widestLine - lineWidth; // difference from the widest line
        shortAmount += Math.max(0, width - (shortAmount + lineWidth)); // difference from the total width, if set
        let processedLine = line;
        if (shortAmount > 0) {
            const posVal = Math.min(1, Math.max(0, pos)); // Position value helper
            if (posVal === 1.0) { // Right
                const spaces = ' '.repeat(shortAmount);
                const styledSpaces = style ? style.styled(spaces) : spaces;
                processedLine = styledSpaces + line;
            }
            else if (posVal === 0.5) { // Center
                // Note: remainder goes on the right
                const left = Math.floor(shortAmount / 2);
                const right = left + (shortAmount % 2);
                const leftSpaces = ' '.repeat(left);
                const rightSpaces = ' '.repeat(right);
                const styledLeftSpaces = style ? style.styled(leftSpaces) : leftSpaces;
                const styledRightSpaces = style ? style.styled(rightSpaces) : rightSpaces;
                processedLine = styledLeftSpaces + line + styledRightSpaces;
            }
            else { // Left (default)
                const spaces = ' '.repeat(shortAmount);
                const styledSpaces = style ? style.styled(spaces) : spaces;
                processedLine = line + styledSpaces;
            }
        }
        result.push(processedLine);
    }
    return result.join('\n');
}
/**
 * Align text vertically within a given height
 */
export function alignTextVertical(str, pos, height, style) {
    const strHeight = (str.match(/\n/g)?.length || 0) + 1;
    if (height < strHeight) {
        return str;
    }
    const posVal = Math.min(1, Math.max(0, pos)); // Position value helper
    if (posVal === 0.0) { // Top
        return str + '\n'.repeat(height - strHeight);
    }
    else if (posVal === 0.5) { // Center
        let topPadding = Math.floor((height - strHeight) / 2);
        let bottomPadding = Math.floor((height - strHeight) / 2);
        if (strHeight + topPadding + bottomPadding > height) {
            topPadding--;
        }
        else if (strHeight + topPadding + bottomPadding < height) {
            bottomPadding++;
        }
        return '\n'.repeat(topPadding) + str + '\n'.repeat(bottomPadding);
    }
    else if (posVal === 1.0) { // Bottom
        return '\n'.repeat(height - strHeight) + str;
    }
    return str;
}
export class AlignUtils {
    /**
     * Align text horizontally within a given width
     *
     * @param text - The text to align
     * @param width - The target width
     * @param alignment - The horizontal alignment
     * @returns Aligned text with padding
     */
    static alignHorizontal(text, width, alignment) {
        // Input validation - handle negative dimensions gracefully
        if (!Number.isFinite(width) || width < 0) {
            return text;
        }
        if (width <= 0)
            return text;
        const displayWidth = AlignUtils.getDisplayWidth(text);
        if (displayWidth >= width)
            return text;
        const padding = width - displayWidth;
        switch (alignment) {
            case HorizontalAlignment.Left:
                return text + ' '.repeat(padding);
            case HorizontalAlignment.Right:
                return ' '.repeat(padding) + text;
            case HorizontalAlignment.Center: {
                const leftPad = Math.floor(padding / 2);
                const rightPad = padding - leftPad;
                const result = ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
                return result;
            }
            default:
                return text;
        }
    }
    /**
     * Align multiple lines of text vertically within a given height
     *
     * @param lines - Array of text lines
     * @param height - The target height
     * @param alignment - The vertical alignment
     * @param width - Optional width for consistent empty line width
     * @returns Array of lines with empty lines added for alignment
     */
    static alignVertical(lines, height, alignment, width) {
        // Input validation - handle negative dimensions gracefully
        if (!Number.isFinite(height) || height < 0) {
            return lines;
        }
        if (width !== undefined && (!Number.isFinite(width) || width < 0)) {
            return lines;
        }
        if (lines.length === 0 || height <= 0)
            return lines;
        // Go Lipgloss behavior: height is minimum height, never truncate content
        if (lines.length >= height)
            return lines;
        const emptyLines = height - lines.length;
        const emptyLine = width !== undefined ? ' '.repeat(Math.max(0, width)) : '';
        switch (alignment) {
            case VerticalAlignment.Top:
                return [...lines, ...Array(emptyLines).fill(emptyLine)];
            case VerticalAlignment.Bottom:
                return [...Array(emptyLines).fill(emptyLine), ...lines];
            case VerticalAlignment.Center: {
                const topPad = Math.floor(emptyLines / 2);
                const bottomPad = emptyLines - topPad;
                return [...Array(topPad).fill(emptyLine), ...lines, ...Array(bottomPad).fill(emptyLine)];
            }
            default:
                return lines;
        }
    }
    /**
     * Create a position object from horizontal and vertical alignments
     *
     * @param horizontal - Horizontal alignment
     * @param vertical - Vertical alignment
     * @returns Position object
     */
    static createPosition(horizontal, vertical) {
        const position = {};
        if (horizontal !== undefined) {
            position.horizontal = horizontal;
        }
        if (vertical !== undefined) {
            position.vertical = vertical;
        }
        return position;
    }
    /**
     * Center text both horizontally and vertically
     *
     * @param text - The text to center
     * @param width - Target width
     * @param height - Target height
     * @returns Centered text as array of lines
     */
    static center(text, width, height) {
        // Input validation - handle negative dimensions gracefully
        if (!Number.isFinite(width) || width < 0) {
            return [text];
        }
        if (!Number.isFinite(height) || height < 0) {
            return [text];
        }
        const lines = text.split('\n');
        // First align horizontally
        const hAligned = lines.map((line) => AlignUtils.alignHorizontal(line, width, HorizontalAlignment.Center));
        // Then align vertically with consistent width
        return AlignUtils.alignVertical(hAligned, height, VerticalAlignment.Center, width);
    }
    /**
     * Justify text to fit within a given width by adding spaces
     *
     * @param text - The text to justify
     * @param width - The target width
     * @returns Justified text
     */
    static justify(text, width) {
        const words = text.trim().split(/\s+/);
        if (words.length <= 1) {
            return AlignUtils.alignHorizontal(text, width, HorizontalAlignment.Left);
        }
        const totalLetters = words.join('').length;
        const totalSpaces = width - totalLetters;
        const gaps = words.length - 1;
        if (gaps === 0 || totalSpaces <= 0) {
            return text;
        }
        const spacesPerGap = Math.floor(totalSpaces / gaps);
        const extraSpaces = totalSpaces % gaps;
        let result = '';
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word === undefined)
                break; // Type safety for noUncheckedIndexedAccess
            result += word;
            if (i < words.length - 1) {
                result += ' '.repeat(spacesPerGap + (i < extraSpaces ? 1 : 0));
            }
        }
        return result;
    }
    /**
     * Get the display width of text (accounting for ANSI sequences and Unicode)
     *
     * @param text - The text to measure
     * @returns Display width
     */
    static getDisplayWidth(text) {
        return getTextWidth(text);
    }
    /**
     * Wrap text to fit within a specified width
     *
     * @param text - The text to wrap
     * @param width - Maximum width per line
     * @param breakWords - Whether to break words if they're too long
     * @returns Array of wrapped lines
     */
    static wrapText(text, width, breakWords = false) {
        // Input validation - handle negative dimensions gracefully
        if (!Number.isFinite(width) || width < 0) {
            return [text];
        }
        if (width <= 0)
            return [text];
        if (!text)
            return [''];
        // Use the more sophisticated wrapText from layout.ts
        return wrapText(text, width, !breakWords);
    }
    /**
     * Align text lines horizontally within a container
     *
     * @param text - The text content (can be multi-line)
     * @param width - The target width for alignment
     * @param alignment - The horizontal alignment
     * @returns Text with each line aligned
     */
    static alignText(text, width, alignment) {
        // Input validation - handle negative dimensions gracefully
        if (!Number.isFinite(width) || width < 0) {
            return text;
        }
        if (width <= 0)
            return text;
        // Note: Even empty text should get width padding to match Go behavior
        const lines = text.split('\n');
        const alignedLines = lines.map((line) => AlignUtils.alignHorizontal(line, width, alignment));
        return alignedLines.join('\n');
    }
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
    static alignTextBox(text, width, height, horizontalAlignment = HorizontalAlignment.Left, verticalAlignment = VerticalAlignment.Top) {
        // Input validation - handle negative dimensions gracefully
        if (!Number.isFinite(width) || width < 0) {
            return [text];
        }
        if (!Number.isFinite(height) || height < 0) {
            return [text];
        }
        if (!text)
            return Array(Math.max(0, height)).fill(' '.repeat(Math.max(0, width)));
        // Split text into lines
        const lines = text.split('\n');
        // Apply horizontal alignment to each line
        const hAligned = lines.map((line) => AlignUtils.alignHorizontal(line, width, horizontalAlignment));
        // Apply vertical alignment
        return AlignUtils.alignVertical(hAligned, height, verticalAlignment, width);
    }
    /**
     * Get the optimal width for a text block
     *
     * @param text - The text content
     * @returns The maximum width needed to display the text
     */
    static getOptimalWidth(text) {
        if (!text)
            return 0;
        const lines = text.split('\n');
        let maxWidth = 0;
        for (const line of lines) {
            const width = AlignUtils.getDisplayWidth(line);
            maxWidth = Math.max(maxWidth, width);
        }
        return maxWidth;
    }
}
/**
 * Type guard to check if a value is a valid Position object
 *
 * @param value - The value to check
 * @returns True if the value is a valid Position
 */
export function isValidPosition(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const obj = value;
    // Check if horizontal alignment is valid (if present)
    if ('horizontal' in obj) {
        const horizontal = obj.horizontal;
        if (horizontal !== HorizontalAlignment.Left &&
            horizontal !== HorizontalAlignment.Center &&
            horizontal !== HorizontalAlignment.Right) {
            return false;
        }
    }
    // Check if vertical alignment is valid (if present)
    if ('vertical' in obj) {
        const vertical = obj.vertical;
        if (vertical !== VerticalAlignment.Top &&
            vertical !== VerticalAlignment.Center &&
            vertical !== VerticalAlignment.Bottom) {
            return false;
        }
    }
    // Check that only valid keys are present
    const validKeys = ['horizontal', 'vertical'];
    for (const key in obj) {
        if (!validKeys.includes(key)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=align.js.map