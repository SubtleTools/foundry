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
export declare function NewRange(start: number, end: number, style: Style): Range;
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
export declare function StyleRanges(text: string, ...ranges: Range[]): string;
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
export declare function CreateRanges(style: Style, positions: [number, number][]): Range[];
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
export declare function StyleWord(text: string, word: string, style: Style, caseSensitive?: boolean): Range[];
//# sourceMappingURL=ranges.d.ts.map