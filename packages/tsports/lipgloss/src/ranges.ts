/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Style Ranges functionality for applying styles to specific character ranges within text.
 *
 * This module provides precise, fine-grained styling control over text content,
 * allowing you to apply different styles to specific character ranges within a string.
 * Essential for syntax highlighting, search result highlighting, and complex text formatting.
 *
 * **Key Features**:
 * - Range-based styling with start/end positions
 * - Unicode-aware character positioning
 * - ANSI escape sequence preservation
 * - Non-overlapping range validation
 * - Word-based styling utilities
 * - Efficient character range processing
 *
 * **Go Compatibility**: Direct port of Go Lipgloss ranges functionality.
 *
 * **Performance**: Optimized for both small and large text processing with
 * efficient ANSI-aware substring extraction and minimal string copying.
 */

import { stringWidth } from '@tsports/uniseg';
import { stripAnsi } from './ansi-utils.js';
import { getTextWidth } from './layout';
import type { Style } from './style';

/**
 * Represents a character range within text for targeted styling.
 *
 * A Range defines a contiguous span of characters that should receive the same
 * styling treatment. Ranges use zero-based indexing and exclude the end position
 * (half-open interval: [start, end)).
 *
 * **Important**: Ranges must not overlap. Overlapping ranges will cause an error
 * during processing to ensure predictable styling behavior.
 *
 * @example
 * ```typescript
 * import { NewRange, NewStyle } from 'lipgloss';
 *
 * const highlight = new Style().backgroundColor('yellow');
 *
 * // Highlight characters 5-10 (positions 5, 6, 7, 8, 9)
 * const range = NewRange(5, 10, highlight);
 * // range covers: [5, 6, 7, 8, 9] (end=10 is excluded)
 * ```
 */
export interface Range {
  /** Starting character position (inclusive) */
  start: number;
  /** Ending character position (exclusive) */
  end: number;
  /** Style to apply to this range */
  style: Style;
}

/**
 * Creates a new Range for use with StyleRanges and related functions.
 *
 * This is the primary way to create character ranges for styling. The range
 * uses zero-based indexing with a half-open interval (start is inclusive,
 * end is exclusive).
 *
 * **Performance**: O(1) - simple object creation.
 *
 * **Go Compatibility**: Similar to Go's range creation patterns.
 *
 * @example
 * ```typescript
 * import { NewRange, NewStyle, StyleRanges } from 'lipgloss';
 *
 * const text = 'Hello, World!';
 * const bold = new Style().bold(true);
 * const italic = new Style().italic(true);
 *
 * // Style "Hello" (positions 0-5)
 * const range1 = NewRange(0, 5, bold);
 *
 * // Style "World" (positions 7-12)
 * const range2 = NewRange(7, 12, italic);
 *
 * const styled = StyleRanges(text, range1, range2);
 * // Result: "**Hello**, _World_!"
 * ```
 *
 * @param start - Starting character position (inclusive, zero-based)
 * @param end - Ending character position (exclusive, zero-based)
 * @param style - Style to apply to characters in this range
 * @returns A new Range object ready for use with styling functions
 *
 * @see {@link StyleRanges} - For applying ranges to text
 * @see {@link Range} - For the Range interface documentation
 */
export function NewRange(start: number, end: number, style: Style): Range {
  return { start, end, style };
}

/**
 * Validates a range to ensure it has valid start/end positions.
 *
 * This internal function performs comprehensive validation of range boundaries
 * to prevent runtime errors and ensure predictable behavior.
 *
 * **Validation Rules**:
 * - Start position must be non-negative
 * - End position must be >= start position
 * - Start position must not exceed text length
 *
 * **Performance**: O(1) - simple boundary checks.
 *
 * @param range - Range to validate
 * @param textLength - Length of the text being styled (in Unicode characters)
 * @throws {Error} If range has invalid boundaries
 *
 * @internal
 */
function validateRange(range: Range, textLength: number): void {
  // Clamp negative start to 0 for graceful handling
  if (range.start < 0) {
    range.start = 0;
  }
  
  // Clamp negative end to start position
  if (range.end < range.start) {
    range.end = range.start;
  }
  
  // Clamp start to text length
  if (range.start > textLength) {
    range.start = textLength;
    range.end = textLength;
  }
  
  // Clamp end to text length
  if (range.end > textLength) {
    range.end = textLength;
  }
}

/**
 * Checks if two ranges have overlapping character positions.
 *
 * This function determines if two ranges would conflict when applied to the same text.
 * Ranges are considered overlapping if they share any character positions.
 *
 * **Algorithm**: Uses interval overlap detection (range1.start < range2.end && range2.start < range1.end).
 *
 * **Performance**: O(1) - simple comparison operations.
 *
 * @param range1 - First range to check
 * @param range2 - Second range to check
 * @returns True if the ranges have any overlapping positions
 *
 * @internal
 */
function rangesOverlap(range1: Range, range2: Range): boolean {
  return range1.start < range2.end && range2.start < range1.end;
}

/**
 * Validates that no ranges in an array have overlapping positions.
 *
 * This function ensures that all ranges can be safely applied without conflicts.
 * It performs pairwise comparison of all ranges to detect any overlaps.
 *
 * **Performance**: O(n²) where n is the number of ranges. For large numbers
 * of ranges, consider pre-sorting and using a more efficient algorithm.
 *
 * @param ranges - Array of ranges to validate for overlaps
 * @throws {Error} If any two ranges overlap, with details about the conflicting ranges
 *
 * @internal
 */
function validateNoOverlaps(ranges: Range[]): void {
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const rangeI = ranges[i];
      const rangeJ = ranges[j];
      if (!rangeI || !rangeJ) continue;

      if (rangesOverlap(rangeI, rangeJ)) {
        throw new Error(
          `Ranges overlap: [${rangeI.start}, ${rangeI.end}) and [${rangeJ.start}, ${rangeJ.end})`
        );
      }
    }
  }
}

/**
 * Extracts a substring while preserving ANSI escape sequences.
 *
 * This advanced function performs substring extraction based on visual character
 * positions rather than byte positions, ensuring that ANSI escape sequences
 * (colors, styles) are properly preserved in the extracted text.
 *
 * **Algorithm**:
 * 1. Strips ANSI codes to determine visual character positions
 * 2. Walks through original text character by character
 * 3. Tracks ANSI escape sequences and includes them when needed
 * 4. Extracts only the visual characters within the specified range
 * 5. Handles Unicode characters and tabs correctly
 *
 * **Performance**: O(n) where n is the length of the input text.
 *
 * **Use Cases**:
 * - Extracting styled substrings for range styling
 * - Preserving colors when cutting text
 * - Unicode-aware text processing
 *
 * @example
 * ```typescript
 * // Internal function, but demonstrates the concept
 * const styledText = '\x1b[31mRed \x1b[32mGreen \x1b[0mNormal';
 * // cutAnsiAware(styledText, 4, 9) would extract "Green" with its color codes
 * ```
 *
 * @param text - The text to extract from (may contain ANSI sequences)
 * @param start - Starting visual character position (inclusive)
 * @param end - Ending visual character position (exclusive)
 * @returns Extracted substring with ANSI sequences preserved
 *
 * @internal
 * @see {@link StyleRanges} - Primary consumer of this function
 */
function cutAnsiAware(text: string, start: number, end: number): string {
  if (start < 0 || end < start) {
    return '';
  }

  // Get plain text and expand tabs for visual positioning
  const plainText = stripAnsi(text);
  const expandedPlainText = plainText.replace(/\t/g, '    '); // Expand tabs to 4 spaces

  if (start >= expandedPlainText.length) {
    return '';
  }

  // Clamp end to expanded text length
  const clampedEnd = Math.min(end, expandedPlainText.length);

  // For simple case where no ANSI codes exist, return expanded substring
  if (text === plainText) {
    return expandedPlainText.substring(start, clampedEnd);
  }

  // For text with ANSI codes, we need to map positions and expand tabs
  let visualPos = 0;
  let result = '';
  let inAnsiSequence = false;
  let ansiBuffer = '';
  let capturing = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (!char) continue;

    // Handle ANSI escape sequences
    if (char === '\x1b' && i + 1 < text.length && text[i + 1] === '[') {
      inAnsiSequence = true;
      ansiBuffer = char;
      continue;
    }

    if (inAnsiSequence) {
      ansiBuffer += char;
      // ANSI sequence ends with a letter (typically m for color codes)
      if (/[a-zA-Z]/.test(char)) {
        inAnsiSequence = false;
        // Include ANSI sequences if they appear before the end of our cut
        // This ensures acting styles from before the cut are preserved, and
        // styles within the cut are included.
        if (visualPos <= clampedEnd) {
          result += ansiBuffer;
        }
        ansiBuffer = '';
      }
      continue;
    }

    // Handle tabs - they expand to 4 spaces visually
    if (char === '\t') {
      const tabSpaces = '    '; // 4 spaces

      // Check if any part of the tab expansion falls within our range
      for (let tabPos = 0; tabPos < 4; tabPos++) {
        if (visualPos >= start && visualPos < clampedEnd) {
          if (!capturing) {
            capturing = true;
          }
          result += ' '; // Add one space for each position
        } else if (capturing && visualPos >= clampedEnd) {
          // We've captured all we need
          return result;
        }
        visualPos++;
      }
      continue;
    }

    // Regular character - check if we should start/continue/stop capturing
    if (visualPos >= start && visualPos < clampedEnd) {
      if (!capturing) {
        capturing = true;
      }
      result += char;
    } else if (capturing && visualPos >= clampedEnd) {
      // We've captured all we need
      break;
    }

    visualPos++;
  }

  return result;
}

/**
 * Applies styles to specific character ranges within text.
 *
 * This is the primary function for range-based styling. It processes an array
 * of non-overlapping ranges and applies their associated styles to the specified
 * character positions while preserving existing ANSI formatting.
 *
 * **Algorithm**:
 * 1. Validates all ranges for correctness and non-overlap
 * 2. Sorts ranges by start position for efficient processing
 * 3. Processes text segments: unstyled → styled → unstyled → styled...
 * 4. Preserves ANSI codes in unstyled segments
 * 5. Applies new styles to range-specified segments
 *
 * **Performance**: O(n + r×log(r)) where n is text length and r is number of ranges.
 *
 * **Go Compatibility**: Direct equivalent to Go's range styling functionality.
 *
 * @example
 * ```typescript
 * import { StyleRanges, NewRange, NewStyle } from 'lipgloss';
 *
 * const text = 'The quick brown fox jumps over the lazy dog';
 * const bold = new Style().bold(true);
 * const italic = new Style().italic(true);
 * const underline = new Style().underline(true);
 *
 * const styled = StyleRanges(
 *   text,
 *   NewRange(4, 9, bold),      // "quick" in bold
 *   NewRange(10, 15, italic),  // "brown" in italic
 *   NewRange(20, 25, underline) // "jumps" underlined
 * );
 *
 * // Advanced: Syntax highlighting example
 * const code = 'function hello(name) { return "Hello " + name; }';
 * const keyword = new Style().color('blue').bold(true);
 * const string = new Style().color('green');
 * const function_name = new Style().color('yellow');
 *
 * const highlighted = StyleRanges(
 *   code,
 *   NewRange(0, 8, keyword),      // "function"
 *   NewRange(9, 14, function_name), // "hello"
 *   NewRange(25, 32, keyword),    // "return"
 *   NewRange(33, 41, string),     // "Hello "
 * );
 * ```
 *
 * @param text - The text to apply styling to
 * @param ranges - Variable number of Range objects (must not overlap)
 * @returns Text with styles applied to the specified character ranges
 * @throws {Error} If ranges are invalid, out of bounds, or overlapping
 *
 * @see {@link NewRange} - For creating ranges
 * @see {@link CreateRanges} - For creating multiple ranges with the same style
 * @see {@link StyleWord} - For word-based range creation
 */
export function StyleRanges(text: string, ...ranges: Range[]): string {
  if (ranges.length === 0) {
    return text;
  }

  // Get plain text for range validation and processing
  const stripped = stripAnsi(text);
  const expandedStripped = stripped.replace(/\t/g, '    '); // Expand tabs for validation

  // Validate all ranges against expanded text
  for (const range of ranges) {
    validateRange(range, expandedStripped.length);
  }

  // Validate no overlaps
  validateNoOverlaps(ranges);

  // Sort ranges by start position for processing
  const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);

  let result = '';
  let lastIdx = 0;

  // Process each range
  for (const range of sortedRanges) {
    // Add the text before this range (preserve original ANSI codes)
    if (range.start > lastIdx) {
      result += cutAnsiAware(text, lastIdx, range.start);
    }

    // Add the styled range (apply new style to expanded plain text)
    const rangeText = cutAnsiAware(stripped, range.start, range.end);
    result += range.style.render(rangeText);

    lastIdx = range.end;
  }

  // Add any remaining text after the last range (preserve original ANSI codes)
  if (lastIdx < expandedStripped.length) {
    result += cutAnsiAware(text, lastIdx, expandedStripped.length);
  }

  return result;
}

/**
 * Creates multiple ranges with the same style from position pairs.
 *
 * This utility function simplifies creating multiple ranges that share the same
 * styling when you have a list of position pairs. Useful for applying consistent
 * styling to multiple text segments.
 *
 * **Performance**: O(n) where n is the number of position pairs.
 *
 * @example
 * ```typescript
 * import { CreateRanges, StyleRanges, NewStyle } from 'lipgloss';
 *
 * const text = 'Error: File not found. Error: Invalid input.';
 * const errorStyle = new Style().color('red').bold(true);
 *
 * // Highlight all "Error:" occurrences
 * const errorRanges = CreateRanges(errorStyle, [
 *   [0, 6],   // First "Error:"
 *   [24, 30]  // Second "Error:"
 * ]);
 *
 * const styled = StyleRanges(text, ...errorRanges);
 *
 * // Equivalent to:
 * // const styled = StyleRanges(
 * //   text,
 * //   NewRange(0, 6, errorStyle),
 * //   NewRange(24, 30, errorStyle)
 * // );
 * ```
 *
 * @param style - Style to apply to all created ranges
 * @param positions - Array of [start, end] position pairs for range creation
 * @returns Array of Range objects, each with the specified style
 *
 * @see {@link NewRange} - For creating individual ranges
 * @see {@link StyleRanges} - For applying the created ranges
 */
export function CreateRanges(style: Style, positions: [number, number][]): Range[] {
  return positions.map(([start, end]) => NewRange(start, end, style));
}

/**
 * Creates ranges for styling all occurrences of a specific word in text.
 *
 * This convenience function automatically finds all instances of a word within
 * text and creates styling ranges for them. Useful for highlighting search terms,
 * keywords, or specific vocabulary.
 *
 * **Algorithm**:
 * 1. Strips ANSI codes for accurate position finding
 * 2. Searches for word occurrences (with optional case sensitivity)
 * 3. Creates a Range for each found occurrence
 * 4. Returns array of ranges ready for use with StyleRanges
 *
 * **Performance**: O(n×m) where n is text length and m is word length.
 *
 * **Note**: This function finds substring matches, not whole-word matches.
 * For whole-word matching, you'll need to implement additional boundary checking.
 *
 * @example
 * ```typescript
 * import { StyleWord, StyleRanges, NewStyle } from 'lipgloss';
 *
 * const text = 'The cat in the hat sat on the mat.';
 * const highlight = new Style().backgroundColor('yellow');
 *
 * // Highlight all occurrences of "at"
 * const ranges = StyleWord(text, 'at', highlight);
 * const styled = StyleRanges(text, ...ranges);
 * // Will highlight: "c[at]", "h[at]", "s[at]", "m[at]"
 *
 * // Case-sensitive search
 * const code = 'let userName = user.Name || User.name;';
 * const keyword = new Style().color('blue');
 * const userRanges = StyleWord(code, 'user', keyword, true);
 * // Only highlights lowercase "user", not "User"
 *
 * // Combine with other ranges
 * const errorText = 'Error: file error. Check error log.';
 * const errorRanges = StyleWord(errorText, 'error', highlight);
 * const otherRanges = [NewRange(0, 5, new Style().color('red'))];
 * const styled = StyleRanges(errorText, ...errorRanges, ...otherRanges);
 * ```
 *
 * @param text - The text to search within for word occurrences
 * @param word - The word/substring to find and style
 * @param style - Style to apply to each found occurrence
 * @param caseSensitive - Whether to perform case-sensitive matching (default: false)
 * @returns Array of Range objects for each word occurrence
 *
 * @see {@link StyleRanges} - For applying the returned ranges
 * @see {@link CreateRanges} - For creating ranges from known positions
 */
export function StyleWord(
  text: string,
  word: string,
  style: Style,
  caseSensitive: boolean = false
): Range[] {
  if (!word) return [];

  // Work with stripped and expanded text for accurate position finding
  const stripped = stripAnsi(text);
  const expandedStripped = stripped.replace(/\t/g, '    '); // Expand tabs
  const searchText = caseSensitive ? expandedStripped : expandedStripped.toLowerCase();
  const searchWord = caseSensitive ? word : word.toLowerCase();

  const ranges: Range[] = [];
  let startPos = 0;

  while (true) {
    const index = searchText.indexOf(searchWord, startPos);
    if (index === -1) break;

    ranges.push(NewRange(index, index + word.length, style));
    startPos = index + word.length;
  }

  return ranges;
}
