/**
 * Layout utilities for padding, margins, and text measurement
 *
 * This module provides utilities for:
 * - CSS-style padding/margin shorthand parsing
 * - Accurate text width calculation with Unicode support
 * - Layout computation and overflow handling
 */
import { stringWidth } from '@tsports/uniseg';
import { stripAnsi } from './ansi-utils.js';
import { HorizontalAlignment, } from './types';
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
export function parsePaddingShorthand(values) {
    if (values.length === 0) {
        throw new Error('At least one padding value is required');
    }
    // Validate that all values are non-negative numbers
    for (const value of values) {
        if (typeof value !== 'number' || value < 0 || !Number.isFinite(value)) {
            throw new Error(`Invalid padding value: ${value}. Must be a non-negative number.`);
        }
    }
    switch (values.length) {
        case 1: {
            // All sides
            const all = values[0];
            return { top: all, right: all, bottom: all, left: all };
        }
        case 2: {
            // Vertical, horizontal
            const vertical = values[0];
            const horizontal = values[1];
            return {
                top: vertical,
                right: horizontal,
                bottom: vertical,
                left: horizontal,
            };
        }
        case 3: {
            // Top, horizontal, bottom
            const top = values[0];
            const horizontal = values[1];
            const bottom = values[2];
            return {
                top: top,
                right: horizontal,
                bottom: bottom,
                left: horizontal,
            };
        }
        case 4: {
            // Top, right, bottom, left
            const top = values[0];
            const right = values[1];
            const bottom = values[2];
            const left = values[3];
            return { top: top, right: right, bottom: bottom, left: left };
        }
        default:
            throw new Error(`Invalid padding shorthand: expected 1-4 values, got ${values.length}`);
    }
}
/**
 * Parse CSS-style margin shorthand values into individual margin values
 * Uses the same logic as padding shorthand parsing
 *
 * @param values - Array of 1-4 margin values
 * @returns MarginConfig with individual top, right, bottom, left values
 */
export function parseMarginShorthand(values) {
    // Reuse the padding parsing logic since they follow the same pattern
    return parsePaddingShorthand(values);
}
/**
 * Handle ES module vs CommonJS import differences
 */
/**
 * Get the accurate display width of a string, accounting for:
 * - Unicode characters
 * - ANSI escape sequences
 * - Zero-width characters
 * - Full-width characters (CJK)
 *
 * @param text - The text to measure
 * @returns The display width of the text in terminal columns
 */
/**
 * Go runewidth library compatibility overrides
 * These characters have different widths between string-width and Go's runewidth
 */
const GO_RUNEWIDTH_OVERRIDES = {
    '♟': 1, // Black pawn - string-width reports 2, but Go runewidth reports 1
};
export function getTextWidth(text) {
    if (!text)
        return 0;
    try {
        // Strip ANSI codes first
        const plainText = stripAnsi(text);
        // Check for Go runewidth overrides first
        if (plainText.length === 1 && GO_RUNEWIDTH_OVERRIDES[plainText]) {
            return GO_RUNEWIDTH_OVERRIDES[plainText];
        }
        // For strings containing override characters, calculate width character by character
        let hasOverrides = false;
        for (const char of plainText) {
            if (GO_RUNEWIDTH_OVERRIDES[char]) {
                hasOverrides = true;
                break;
            }
        }
        if (hasOverrides) {
            let totalWidth = 0;
            for (const char of plainText) {
                if (GO_RUNEWIDTH_OVERRIDES[char]) {
                    totalWidth += GO_RUNEWIDTH_OVERRIDES[char];
                }
                else {
                    // Use string-width for individual character to get its width
                    totalWidth += stringWidth(char);
                }
            }
            return totalWidth;
        }
        // Use proper visual width for correct Unicode/CJK character handling
        // This matches Go's behavior with runewidth which accounts for full-width characters
        return stringWidth(plainText);
    }
    catch (error) {
        // Fallback to basic length
        console.warn('Text width calculation failed, using fallback:', error);
        return stripAnsi(text).length;
    }
}
/**
 * Split text into lines and calculate the width of each line
 *
 * @param text - The text to analyze
 * @returns Array of line widths
 */
export function getLineWidths(text) {
    if (!text)
        return [0];
    const lines = text.split('\n');
    return lines.map((line) => getTextWidth(line));
}
/**
 * Get the maximum width (widest line) in a multi-line text
 *
 * @param text - The text to analyze
 * @returns The width of the widest line
 */
export function getMaxTextWidth(text) {
    const lineWidths = getLineWidths(text);
    return lineWidths.length > 0 ? Math.max(...lineWidths) : 0;
}
/**
 * Calculate the total padding width (left + right)
 *
 * @param padding - Padding configuration
 * @returns Total horizontal padding
 */
export function getHorizontalPadding(padding) {
    if (!padding)
        return 0;
    return (padding.left || 0) + (padding.right || 0);
}
/**
 * Calculate the total padding height (top + bottom)
 *
 * @param padding - Padding configuration
 * @returns Total vertical padding
 */
export function getVerticalPadding(padding) {
    if (!padding)
        return 0;
    return (padding.top || 0) + (padding.bottom || 0);
}
/**
 * Calculate the total margin width (left + right)
 *
 * @param margin - Margin configuration
 * @returns Total horizontal margin
 */
export function getHorizontalMargin(margin) {
    if (!margin)
        return 0;
    return (margin.left || 0) + (margin.right || 0);
}
/**
 * Calculate the total margin height (top + bottom)
 *
 * @param margin - Margin configuration
 * @returns Total vertical margin
 */
export function getVerticalMargin(margin) {
    if (!margin)
        return 0;
    return (margin.top || 0) + (margin.bottom || 0);
}
/**
 * Truncate text to fit within a specified width
 *
 * @param text - The text to truncate
 * @param maxWidth - Maximum allowed width
 * @param ellipsis - String to append when truncating (default: '...')
 * @returns Truncated text
 */
export function truncateText(text, maxWidth, ellipsis = '...') {
    if (maxWidth <= 0)
        return '';
    const textWidth = getTextWidth(text);
    if (textWidth <= maxWidth)
        return text;
    const ellipsisWidth = getTextWidth(ellipsis);
    if (ellipsisWidth >= maxWidth) {
        // If ellipsis is too wide, just truncate without it
        return truncateToWidth(text, maxWidth);
    }
    const targetWidth = maxWidth - ellipsisWidth;
    const truncated = truncateToWidth(text, targetWidth);
    return truncated + ellipsis;
}
/**
 * Truncate text to exactly fit within a width (without ellipsis)
 * Handles Unicode characters properly
 *
 * @param text - The text to truncate
 * @param maxWidth - Maximum allowed width
 * @returns Truncated text
 */
export function truncateToWidth(text, maxWidth) {
    if (maxWidth <= 0)
        return '';
    if (!text)
        return '';
    const textWidth = getTextWidth(text);
    if (textWidth <= maxWidth)
        return text;
    // Binary search approach for efficiency with Unicode
    let left = 0;
    let right = text.length;
    while (left < right) {
        const mid = Math.floor((left + right + 1) / 2);
        const substring = text.slice(0, mid);
        if (getTextWidth(substring) <= maxWidth) {
            left = mid;
        }
        else {
            right = mid - 1;
        }
    }
    return text.slice(0, left);
}
/**
 * Wrap text to fit within a specified width
 *
 * @param text - The text to wrap
 * @param maxWidth - Maximum width per line
 * @param preserveWhitespace - Whether to preserve existing whitespace
 * @returns Array of wrapped lines
 */
export function wrapText(text, maxWidth, preserveWhitespace = false) {
    if (maxWidth <= 0)
        return [''];
    if (!text)
        return [''];
    // Split by existing line breaks first
    const inputLines = text.split('\n');
    const wrappedLines = [];
    for (const line of inputLines) {
        if (getTextWidth(line) <= maxWidth) {
            wrappedLines.push(line);
            continue;
        }
        // Line needs wrapping
        if (preserveWhitespace) {
            // Simple character-based wrapping when preserving whitespace
            wrappedLines.push(...wrapLineCharacterBased(line, maxWidth));
        }
        else {
            // Word-based wrapping
            wrappedLines.push(...wrapLineWordBased(line, maxWidth));
        }
    }
    return wrappedLines;
}
/**
 * Wrap a single line using word boundaries
 *
 * @param line - The line to wrap
 * @param maxWidth - Maximum width per line
 * @returns Array of wrapped lines
 */
function wrapLineWordBased(line, maxWidth) {
    const words = line.split(/(\s+)/); // Keep separators
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        const testLine = currentLine + word;
        const testWidth = getTextWidth(testLine);
        if (testWidth <= maxWidth) {
            currentLine = testLine;
        }
        else {
            if (currentLine) {
                lines.push(currentLine);
                currentLine = word;
            }
            else {
                // Word is too long, break it character-wise
                lines.push(...wrapLineCharacterBased(word, maxWidth));
            }
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines.length > 0 ? lines : [''];
}
/**
 * Wrap a single line using character boundaries
 *
 * @param line - The line to wrap
 * @param maxWidth - Maximum width per line
 * @returns Array of wrapped lines
 */
function wrapLineCharacterBased(line, maxWidth) {
    const lines = [];
    let currentLine = '';
    // For very narrow widths (1-2), handle spaces specially to match Go behavior
    if (maxWidth <= 2) {
        // Remove consecutive spaces and split on remaining spaces
        const processedLine = line.replace(/\s+/g, ' ');
        let i = 0;
        while (i < processedLine.length) {
            const char = processedLine[i];
            if (!char)
                break;
            if (char === ' ') {
                // For width=1, skip spaces entirely
                if (maxWidth === 1) {
                    i++;
                    continue;
                }
                // For width=2, include spaces if they fit
                const testLine = currentLine + char;
                const testWidth = getTextWidth(testLine);
                if (testWidth <= maxWidth) {
                    currentLine = testLine;
                }
                else {
                    // Space doesn't fit, start new line but don't include the space
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                    currentLine = '';
                }
            }
            else {
                const testLine = currentLine + char;
                const testWidth = getTextWidth(testLine);
                if (testWidth <= maxWidth) {
                    currentLine = testLine;
                }
                else {
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                    currentLine = char;
                }
            }
            i++;
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        return lines.length > 0 ? lines : [''];
    }
    // Normal character-based wrapping for wider constraints
    for (const char of line) {
        const testLine = currentLine + char;
        const testWidth = getTextWidth(testLine);
        if (testWidth <= maxWidth) {
            currentLine = testLine;
        }
        else {
            if (currentLine) {
                lines.push(currentLine);
            }
            currentLine = char;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines.length > 0 ? lines : [''];
}
/**
 * Calculate the actual content width based on WidthConfig
 *
 * @param widthConfig - Width configuration
 * @param contentWidth - Natural width of the content
 * @param availableWidth - Available width from parent container
 * @returns Calculated width
 */
export function calculateWidth(widthConfig, contentWidth, availableWidth) {
    if (widthConfig === undefined) {
        return contentWidth;
    }
    if (typeof widthConfig === 'number') {
        return Math.max(0, widthConfig);
    }
    switch (widthConfig) {
        case 'auto':
            return contentWidth;
        case 'fit-content':
            return availableWidth !== undefined ? Math.min(contentWidth, availableWidth) : contentWidth;
        case 'max-content':
            return contentWidth;
        default:
            return contentWidth;
    }
}
/**
 * Calculate the actual content height based on HeightConfig
 *
 * @param heightConfig - Height configuration
 * @param contentHeight - Natural height of the content (number of lines)
 * @param availableHeight - Available height from parent container
 * @returns Calculated height
 */
export function calculateHeight(heightConfig, contentHeight, availableHeight) {
    if (heightConfig === undefined) {
        return contentHeight;
    }
    if (typeof heightConfig === 'number') {
        return Math.max(0, heightConfig);
    }
    switch (heightConfig) {
        case 'auto':
            return contentHeight;
        case 'fit-content':
            return availableHeight !== undefined
                ? Math.min(contentHeight, availableHeight)
                : contentHeight;
        case 'max-content':
            return contentHeight;
        default:
            return contentHeight;
    }
}
/**
 * Apply Go-style width constraints (word-preferring wrapping with exact width padding)
 * This matches the behavior of Go's Lipgloss width constraint implementation
 *
 * @param text - The text to constrain
 * @param targetWidth - The target width in characters
 * @returns Width-constrained text with exact padding
 */
export function applyGoStyleWidthConstraint(text, targetWidth) {
    if (targetWidth <= 0)
        return text;
    // For empty text, create a single line filled with spaces to the target width
    if (!text) {
        return ' '.repeat(targetWidth);
    }
    const lines = text.split('\n');
    const constrainedLines = [];
    for (const line of lines) {
        if (getTextWidth(line) <= targetWidth) {
            // Pad line to exact width
            const padding = targetWidth - getTextWidth(line);
            constrainedLines.push(line + ' '.repeat(padding));
        }
        else {
            // Go-style width constraint: wrap long lines to fit within width
            // This matches Go's behavior for width constraints
            const wrapped = wrapLineGoStyle(line, targetWidth);
            for (const wrappedLine of wrapped) {
                // Pad each wrapped line to exact width
                const padding = targetWidth - getTextWidth(wrappedLine);
                constrainedLines.push(wrappedLine + ' '.repeat(Math.max(0, padding)));
            }
        }
    }
    return constrainedLines.join('\n');
}
/**
 * Wrap a line using Go-style algorithm: prefer word boundaries, break words when necessary
 * For very narrow widths (1-2 chars), use character-based wrapping to match Go behavior
 *
 * @param line - The line to wrap
 * @param maxWidth - Maximum width per line
 * @returns Array of wrapped lines
 */
export function wrapLineGoStyle(line, maxWidth) {
    // For very narrow widths, Go uses character-based wrapping
    if (maxWidth <= 2) {
        return wrapLineCharacterBased(line, maxWidth);
    }
    const words = line.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if (!currentLine) {
            // First word on line
            if (getTextWidth(word) <= maxWidth) {
                currentLine = word;
            }
            else {
                // Word is too long, break it using character boundaries
                const brokenLines = wrapLineCharacterBased(word, maxWidth);
                lines.push(...brokenLines.slice(0, -1)); // Add all but last
                currentLine = brokenLines[brokenLines.length - 1] || '';
            }
        }
        else {
            // Try to add word to current line
            const testLine = currentLine + ' ' + word;
            if (getTextWidth(testLine) <= maxWidth) {
                currentLine = testLine;
            }
            else {
                // Word doesn't fit, start new line
                lines.push(currentLine);
                if (getTextWidth(word) <= maxWidth) {
                    currentLine = word;
                }
                else {
                    // Word is too long, break it using character boundaries
                    const brokenLines = wrapLineCharacterBased(word, maxWidth);
                    lines.push(...brokenLines.slice(0, -1)); // Add all but last
                    currentLine = brokenLines[brokenLines.length - 1] || '';
                }
            }
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines.length > 0 ? lines : [''];
}
/**
 * Apply padding to text content
 *
 * @param text - The text content
 * @param padding - Padding configuration
 * @param width - Target width (optional)
 * @returns Padded text
 */
export function applyPadding(text, padding, width, horizontalAlignment) {
    if (!text && !padding)
        return text;
    const lines = text.split('\n');
    const topPadding = padding.top || 0;
    const rightPadding = padding.right || 0;
    const bottomPadding = padding.bottom || 0;
    const leftPadding = padding.left || 0;
    // Calculate the width for each line if width is specified
    const targetContentWidth = width !== undefined ? width - leftPadding - rightPadding : undefined;
    // First pass: apply left padding and determine content widths
    const leftPaddedLines = lines.map((line) => ({
        original: line,
        leftPadded: ' '.repeat(leftPadding) + line,
        contentWidth: getTextWidth(line),
    }));
    // Find the maximum content width to ensure consistent total line width
    const maxContentWidth = leftPaddedLines.reduce((max, lineInfo) => Math.max(max, lineInfo.contentWidth), 0);
    // Calculate the target total width for all lines
    let targetTotalWidth;
    if (width !== undefined) {
        targetTotalWidth = width;
    }
    else {
        // No explicit width constraint: ensure all lines have consistent width
        // Total width = left padding + max content width + right padding
        targetTotalWidth = leftPadding + maxContentWidth + rightPadding;
    }
    // Second pass: apply horizontal padding to ensure consistent line widths
    const paddedLines = leftPaddedLines.map((lineInfo) => {
        const { original, leftPadded, contentWidth } = lineInfo;
        if (targetContentWidth !== undefined) {
            // When width is specified, pad to exact total width with alignment
            const contentSpaceNeeded = Math.max(0, targetContentWidth - contentWidth);
            if (horizontalAlignment && contentSpaceNeeded > 0) {
                // Distribute the extra space according to alignment
                switch (horizontalAlignment) {
                    case HorizontalAlignment.Left:
                        return leftPadded + ' '.repeat(contentSpaceNeeded + rightPadding);
                    case HorizontalAlignment.Center: {
                        const leftExtra = Math.floor(contentSpaceNeeded / 2);
                        const rightExtra = contentSpaceNeeded - leftExtra;
                        return (' '.repeat(leftPadding + leftExtra) + original + ' '.repeat(rightExtra + rightPadding));
                    }
                    case HorizontalAlignment.Right:
                        return (' '.repeat(leftPadding + contentSpaceNeeded) + original + ' '.repeat(rightPadding));
                    default:
                        return leftPadded + ' '.repeat(contentSpaceNeeded + rightPadding);
                }
            }
            else {
                // No alignment specified or no extra space needed, use left alignment
                return leftPadded + ' '.repeat(contentSpaceNeeded + rightPadding);
            }
        }
        else {
            // No width constraint - ensure all lines have the same total width
            // Calculate how much right padding is needed to reach target width
            const currentWidth = getTextWidth(leftPadded);
            const rightPaddingNeeded = Math.max(0, targetTotalWidth - currentWidth);
            return leftPadded + ' '.repeat(rightPaddingNeeded);
        }
    });
    // Use the same target total width for empty lines to ensure consistency
    const emptyLine = ' '.repeat(targetTotalWidth);
    // Add top padding
    const topLines = Array(topPadding).fill(emptyLine);
    // Add bottom padding
    const bottomLines = Array(bottomPadding).fill(emptyLine);
    return [...topLines, ...paddedLines, ...bottomLines].join('\n');
}
/**
 * Apply margin to text content with optional background color
 *
 * @param text - The text content
 * @param margin - Margin configuration
 * @param marginBackground - Optional background color for margin areas
 * @param inline - Whether this is inline rendering (affects top/bottom margins)
 * @returns Text with margins applied
 */
export function applyMargin(text, margin, marginBackground, inline = false) {
    if (!text && !margin)
        return text;
    const lines = text.split('\n');
    const topMargin = margin.top || 0;
    const rightMargin = margin.right || 0;
    const bottomMargin = margin.bottom || 0;
    const leftMargin = margin.left || 0;
    // Apply horizontal margins to each line
    let result = lines.map((line) => {
        let paddedLine = line;
        // Add left margin
        if (leftMargin > 0) {
            paddedLine = ' '.repeat(leftMargin) + paddedLine;
        }
        // Add right margin
        if (rightMargin > 0) {
            paddedLine = paddedLine + ' '.repeat(rightMargin);
        }
        return paddedLine;
    });
    // Apply vertical margins (only for non-inline rendering)
    if (!inline && (topMargin > 0 || bottomMargin > 0)) {
        // Calculate the width for margin lines
        // Use the maximum width of the content including horizontal margins
        const maxWidth = Math.max(...result.map((line) => getTextWidth(line)));
        const marginLine = ' '.repeat(maxWidth);
        // Add top margin
        if (topMargin > 0) {
            const topLines = Array(topMargin).fill(marginLine);
            result = [...topLines, ...result];
        }
        // Add bottom margin
        if (bottomMargin > 0) {
            const bottomLines = Array(bottomMargin).fill(marginLine);
            result = [...result, ...bottomLines];
        }
    }
    return result.join('\n');
}
/**
 * Apply margin background color using ANSI escape sequences
 * This is a separate function to handle color styling for margin areas
 *
 * @param text - The text with margins already applied
 * @param marginBackground - Background color for margin areas
 * @returns Text with margin background color applied
 */
export function applyMarginBackground(text, marginBackground) {
    // This would integrate with the color system to apply background colors
    // For now, return text as-is since color application will be handled
    // by the Style class and ColorManager
    return text;
}
//# sourceMappingURL=layout.js.map