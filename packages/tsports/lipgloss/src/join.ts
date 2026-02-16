/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Join utilities for combining styled strings horizontally and vertically.
 *
 * This module provides advanced text layout capabilities for combining multiple
 * text blocks with precise alignment control. Essential for building complex
 * terminal user interfaces and layouts.
 *
 * **Features**:
 * - Horizontal joining with vertical position alignment
 * - Vertical joining with horizontal position alignment
 * - Percentage-based positioning (0.0 to 1.0)
 * - Proper handling of multi-line content with mixed dimensions
 * - Unicode-aware width calculations
 * - ANSI-safe text processing
 *
 * **Go Compatibility**: Direct port of Go Lipgloss join functionality.
 */

import { getTextWidth } from './layout';

/**
 * Optimize ANSI sequences by merging consecutive identical color codes
 * This fixes the issue where JoinHorizontal creates fragmented ANSI codes like:
 * [38;2;125;86;244m╭───╮[39m[38;2;125;86;244m╭───╮[39m
 * into: [38;2;125;86;244m╭───╮╭───╮[39m
 */
function optimizeAnsiSequences(content: string): string {
  if (!content) {
    return content;
  }

  let optimized = content;
  let hasChanges = true;

  // Keep optimizing until no more changes are made
  while (hasChanges) {
    hasChanges = false;
    const originalLength = optimized.length;

    // Merge consecutive identical foreground color sequences
    optimized = optimized.replace(
      /(\x1b\[38;2;\d+;\d+;\d+m)(.*?)\x1b\[0m(\x1b\[38;2;\d+;\d+;\d+m)(.*?)\x1b\[0m/g,
      (match, start1, content1, start2, content2) => {
        // Only merge if the color codes are identical
        if (start1 === start2) {
          return `${start1}${content1}${content2}\x1b[0m`;
        }
        return match;
      }
    );

    // Merge consecutive identical background color sequences
    optimized = optimized.replace(
      /(\x1b\[48;2;\d+;\d+;\d+m)(.*?)\x1b\[0m(\x1b\[48;2;\d+;\d+;\d+m)(.*?)\x1b\[0m/g,
      (match, start1, content1, start2, content2) => {
        // Only merge if the color codes are identical
        if (start1 === start2) {
          return `${start1}${content1}${content2}\x1b[0m`;
        }
        return match;
      }
    );

    hasChanges = optimized.length !== originalLength;
  }

  return optimized;
}

/**
 * Position type for precise alignment calculations.
 *
 * Represents a position along a horizontal or vertical axis using a normalized
 * value between 0.0 and 1.0. This allows for both standard alignments and
 * custom percentage-based positioning.
 *
 * **Value Meanings**:
 * - `0.0`: Top alignment (vertical) or Left alignment (horizontal)
 * - `0.5`: Center alignment (both directions)
 * - `1.0`: Bottom alignment (vertical) or Right alignment (horizontal)
 * - Any value between 0 and 1 for percentage-based positioning
 *
 * @example
 * ```typescript
 * // Standard alignments
 * const topAlign: Position = 0.0;     // or use Top constant
 * const centerAlign: Position = 0.5;  // or use Center constant
 * const bottomAlign: Position = 1.0;  // or use Bottom constant
 *
 * // Custom positioning
 * const quarterFromTop: Position = 0.25;
 * const threeQuartersDown: Position = 0.75;
 * ```
 */
export type Position = number;

/**
 * Pre-defined position constants for common alignments.
 *
 * These constants provide convenient access to standard alignment positions
 * without needing to remember the numeric values.
 *
 * @example
 * ```typescript
 * import { JoinHorizontal, Top, Center, Bottom } from 'lipgloss';
 *
 * // Use constants instead of magic numbers
 * JoinHorizontal(Top, blockA, blockB);     // Instead of JoinHorizontal(0.0, ...)
 * JoinHorizontal(Center, blockA, blockB);  // Instead of JoinHorizontal(0.5, ...)
 * JoinHorizontal(Bottom, blockA, blockB);  // Instead of JoinHorizontal(1.0, ...)
 * ```
 */
export const Top: Position = 0.0;
export const Bottom: Position = 1.0;
export const Center: Position = 0.5;
export const Left: Position = 0.0;
export const Right: Position = 1.0;

/**
 * Validates and normalizes a position value to be within the valid range of 0 to 1.
 *
 * This internal utility ensures that position values are always within the
 * expected range, clamping values that are outside the bounds. Also handles
 * invalid input types gracefully.
 *
 * **Performance**: O(1) - simple min/max operations with type checking.
 *
 * @param pos - Raw position value (may be outside 0-1 range or invalid type)
 * @returns Clamped position between 0 and 1 inclusive
 *
 * @internal
 */
function normalizePosition(pos: Position): number {
  // Handle invalid types by defaulting to 0 (top/left alignment)
  if (typeof pos !== 'number' || !Number.isFinite(pos)) {
    return 0;
  }
  return Math.min(1, Math.max(0, pos));
}

/**
 * Splits a string into lines and calculates the maximum line width.
 *
 * This internal utility function processes multi-line text and returns both
 * the individual lines and the width of the widest line. Used by join functions
 * to determine layout dimensions.
 *
 * **Performance**: O(n) where n is the total string length.
 *
 * **Go Compatibility**: Equivalent to Go's internal `getLines` function.
 *
 * @param str - String to process (may contain newlines)
 * @returns Tuple containing [lines array, maximum width in columns]
 *
 * @internal
 * @see {@link utils.getLines} - Similar function in utils module with object return
 */
function getLines(str: string): [string[], number] {
  // Handle null/undefined strings safely
  if (str == null) {
    return [[''], 0];
  }

  const lines = str.split('\n');
  let maxWidth = 0;

  for (const line of lines) {
    const width = getTextWidth(line);
    if (width > maxWidth) {
      maxWidth = width;
    }
  }

  return [lines, maxWidth];
}

/**
 * Joins multiple text blocks horizontally with vertical alignment control.
 *
 * This function places text blocks side-by-side, automatically handling different
 * heights by adding empty lines and aligning them according to the specified
 * vertical position. Each block maintains its original width.
 *
 * **Algorithm**:
 * 1. Splits each input string into lines
 * 2. Finds the maximum height across all blocks
 * 3. Pads shorter blocks with empty lines at the specified position
 * 4. Concatenates lines horizontally, padding each block to its maximum width
 *
 * **Performance**: O(n×h) where n is total characters and h is max height.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.JoinHorizontal()` function.
 *
 * @example
 * ```typescript
 * import { JoinHorizontal, Top, Center, Bottom } from 'lipgloss';
 *
 * const blockA = 'Line 1\nLine 2\nLine 3\nLine 4';
 * const blockB = 'A\nB';
 * const blockC = 'X\nY\nZ';
 *
 * // Top alignment (default-like behavior)
 * JoinHorizontal(Top, blockA, blockB, blockC);
 * // Result:
 * // Line 1AX
 * // Line 2BY
 * // Line 3 Z
 * // Line 4
 *
 * // Center alignment
 * JoinHorizontal(Center, blockA, blockB, blockC);
 * // Result:
 * // Line 1
 * // Line 2AX
 * // Line 3BY
 * // Line 4 Z
 *
 * // Bottom alignment
 * JoinHorizontal(Bottom, blockA, blockB, blockC);
 * // Result:
 * //
 * //
 * // Line 1A
 * // Line 2BX
 * // Line 3 Y
 * // Line 4 Z
 *
 * // Custom position (25% from top)
 * JoinHorizontal(0.25, blockA, blockB, blockC);
 * ```
 *
 * @param pos - Vertical alignment position (0.0=top, 0.5=center, 1.0=bottom)
 * @param strs - Text blocks to join horizontally (variable arguments)
 * @returns Combined string with all blocks arranged horizontally
 *
 * @see {@link JoinVertical} - For vertical joining with horizontal alignment
 * @see {@link Position} - For position value documentation
 * @see {@link Top}, {@link Center}, {@link Bottom} - For common alignment constants
 */
export function JoinHorizontal(pos: Position, ...strs: string[]): string {
  if (strs.length === 0) {
    return '';
  }
  if (strs.length === 1) {
    return strs[0] ?? '';
  }

  // Filter out null/undefined strings and convert to empty strings
  const validStrs = strs.map((str) => str ?? '');

  // Groups of strings broken into multiple lines
  const blocks: string[][] = [];

  // Max line widths for the above text blocks
  const maxWidths: number[] = [];

  // Height of the tallest block
  let maxHeight = 0;

  // Break text blocks into lines and get max widths for each text block
  for (const str of validStrs) {
    const [lines, maxWidth] = getLines(str);
    blocks.push(lines);
    maxWidths.push(maxWidth);

    if (lines.length > maxHeight) {
      maxHeight = lines.length;
    }
  }

  // Add extra lines to make each side the same height
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!block || block.length >= maxHeight) {
      continue;
    }

    const extraLinesCount = maxHeight - block.length;
    const extraLines = Array(extraLinesCount).fill('');
    const normalizedPos = normalizePosition(pos);

    if (normalizedPos === 0) {
      // Top
      blocks[i] = [...block, ...extraLines];
    } else if (normalizedPos === 1) {
      // Bottom
      blocks[i] = [...extraLines, ...block];
    } else {
      // Somewhere in the middle
      const split = Math.round(extraLinesCount * normalizedPos);
      const top = split;
      const bottom = extraLinesCount - split;

      const topLines = Array(top).fill('');
      const bottomLines = Array(bottom).fill('');
      blocks[i] = [...topLines, ...block, ...bottomLines];
    }
  }

  // Merge lines
  const result: string[] = [];

  // All blocks now have the same number of lines
  for (let i = 0; i < maxHeight; i++) {
    let line = '';

    for (let j = 0; j < blocks.length; j++) {
      const block = blocks[j];
      const blockLine = block?.[i] ?? '';
      line += blockLine;

      // Pad the line to make all lines the same length
      const currentWidth = getTextWidth(blockLine);
      const maxWidth = maxWidths[j] ?? 0;
      const padding = maxWidth - currentWidth;
      line += ' '.repeat(Math.max(0, padding));
    }

    result.push(line);
  }

  // Match Go behavior: only join lines with newlines, no trailing newline
  // Go code: if i < len(blocks[0])-1 { b.WriteRune('\n') }
  let finalResult = '';
  for (let i = 0; i < result.length; i++) {
    finalResult += result[i];
    if (i < result.length - 1) {
      finalResult += '\n';
    }
  }
  // Disable ANSI optimization to match Go behavior exactly
  // Go keeps all reset sequences separate for exact byte compatibility
  return finalResult;
}

/**
 * Joins multiple text blocks vertically with horizontal alignment control.
 *
 * This function stacks text blocks on top of each other, automatically handling
 * different widths by padding each line and aligning them according to the
 * specified horizontal position. Each block maintains its original height.
 *
 * **Algorithm**:
 * 1. Splits each input string into lines
 * 2. Finds the maximum width across all blocks
 * 3. Pads each line to the maximum width based on the specified position
 * 4. Concatenates all lines vertically
 *
 * **Performance**: O(n×w) where n is total characters and w is max width.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.JoinVertical()` function.
 *
 * @example
 * ```typescript
 * import { JoinVertical, Left, Center, Right } from 'lipgloss';
 *
 * const blockA = 'Hello';
 * const blockB = 'World Wide Web';
 * const blockC = 'End';
 *
 * // Left alignment
 * JoinVertical(Left, blockA, blockB, blockC);
 * // Result:
 * // Hello
 * // World Wide Web
 * // End
 *
 * // Center alignment
 * JoinVertical(Center, blockA, blockB, blockC);
 * // Result:
 * //     Hello
 * // World Wide Web
 * //      End
 *
 * // Right alignment
 * JoinVertical(Right, blockA, blockB, blockC);
 * // Result:
 * //          Hello
 * // World Wide Web
 * //            End
 *
 * // Custom position (25% from left)
 * JoinVertical(0.25, blockA, blockB, blockC);
 * // Result:
 * //    Hello
 * // World Wide Web
 * //    End
 * ```
 *
 * @param pos - Horizontal alignment position (0.0=left, 0.5=center, 1.0=right)
 * @param strs - Text blocks to join vertically (variable arguments)
 * @returns Combined string with all blocks arranged vertically
 *
 * @see {@link JoinHorizontal} - For horizontal joining with vertical alignment
 * @see {@link Position} - For position value documentation
 * @see {@link Left}, {@link Center}, {@link Right} - For common alignment constants
 */
export function JoinVertical(pos: Position, ...strs: string[]): string {
  if (strs.length === 0) {
    return '';
  }
  if (strs.length === 1) {
    return strs[0] ?? '';
  }

  // Filter out null/undefined strings and convert to empty strings
  const validStrs = strs.map((str) => str ?? '');

  const blocks: string[][] = [];
  let maxWidth = 0;

  // Break strings into lines and find the maximum width
  for (const str of validStrs) {
    const [lines, width] = getLines(str);
    blocks.push(lines);
    if (width > maxWidth) {
      maxWidth = width;
    }
  }

  const result: string[] = [];
  const normalizedPos = normalizePosition(pos);

  // Process each block
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!block) continue;

    for (let j = 0; j < block.length; j++) {
      const line = block[j];
      if (line === undefined) continue;
      const lineWidth = getTextWidth(line);
      const paddingNeeded = maxWidth - lineWidth;

      let paddedLine: string;

      if (normalizedPos === 0) {
        // Left
        paddedLine = line + ' '.repeat(Math.max(0, paddingNeeded));
      } else if (normalizedPos === 1) {
        // Right
        paddedLine = ' '.repeat(Math.max(0, paddingNeeded)) + line;
      } else {
        // Somewhere in the middle
        if (paddingNeeded < 1) {
          paddedLine = line;
        } else {
          const split = Math.round(paddingNeeded * normalizedPos);
          const right = paddingNeeded - split;
          const left = paddingNeeded - right;

          paddedLine = ' '.repeat(left) + line + ' '.repeat(right);
        }
      }

      result.push(paddedLine);
    }
  }

  // Match Go behavior: only write newlines except after the last line
  // Go code: if !(i == len(blocks)-1 && j == len(block)-1) { b.WriteRune('\n') }
  let finalResult = '';
  for (let lineIdx = 0; lineIdx < result.length; lineIdx++) {
    finalResult += result[lineIdx];
    // Add newline only if this is not the last line
    if (lineIdx < result.length - 1) {
      finalResult += '\n';
    }
  }
  // Disable ANSI optimization to match Go behavior exactly
  // Go keeps all reset sequences separate for exact byte compatibility
  return finalResult;
}
