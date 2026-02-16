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
export declare const Top: Position;
export declare const Bottom: Position;
export declare const Center: Position;
export declare const Left: Position;
export declare const Right: Position;
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
export declare function JoinHorizontal(pos: Position, ...strs: string[]): string;
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
export declare function JoinVertical(pos: Position, ...strs: string[]): string;
//# sourceMappingURL=join.d.ts.map