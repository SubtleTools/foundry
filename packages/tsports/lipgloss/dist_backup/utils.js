/**
 * Utility functions for text manipulation, measurement, and ANSI handling
 *
 * This module provides utilities for:
 * - Text width and height measurement (matching Go's Width/Height/Size functions)
 * - Rune and character manipulation utilities
 * - Whitespace rendering and manipulation
 * - Text positioning and placement functions
 * - String padding utilities
 * - Helper functions that complement existing join.ts and ranges.ts modules
 */
import { stripAnsi } from './ansi-utils.js';
import { getTextWidth } from './layout';
import { Style } from './style';
import { ColorProfile } from './types';
import { Profile as TermenvProfile } from '@tsports/termenv';
// Position constants for common alignments
export const Top = 0.0;
export const Bottom = 1.0;
export const Center = 0.5;
export const Left = 0.0;
export const Right = 1.0;
/**
 * Constant indicating no tab conversion should be performed.
 * Used with tab-related styling functions to disable automatic tab conversion.
 *
 * @example
 * ```typescript
 * // Disable tab conversion
 * const style = new Style().tabWidth(NoTabConversion);
 * ```
 */
export const NoTabConversion = -1;
/**
 * Normalize position value to be between 0 and 1
 */
function normalizePosition(pos) {
    return Math.min(1, Math.max(0, pos));
}
/**
 * Calculates the visual width of a string in terminal columns.
 *
 * This function accurately measures the display width of text by:
 * - Ignoring ANSI escape sequences (colors, styles)
 * - Properly measuring wide Unicode characters (CJK, emojis: width 2)
 * - Handling combining characters and zero-width characters
 * - Finding the maximum width across multiple lines
 *
 * **Performance**: O(n) where n is the string length. For multi-line strings,
 * processes each line separately to find the maximum width.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.Width()` function.
 *
 * @example
 * ```typescript
 * import { Width } from 'lipgloss';
 *
 * Width('Hello');          // 5
 * Width('Hello\nWorld!');   // 6 (max of 5 and 6)
 * Width('\x1b[31mRed\x1b[0m'); // 3 (ignores ANSI codes)
 * Width('你好');            // 4 (CJK characters are width 2 each)
 * Width('🎉');              // 2 (emoji width)
 * ```
 *
 * @param str - The string to measure
 * @returns The display width in terminal columns (0 for empty string)
 *
 * @see {@link Height} - For measuring string height
 * @see {@link Size} - For getting both width and height
 * @see {@link getTextWidth} - Low-level width calculation function
 */
export function Width(str) {
    if (!str)
        return 0;
    const lines = str.split('\n');
    let maxWidth = 0;
    for (const line of lines) {
        const width = getTextWidth(line);
        if (width > maxWidth) {
            maxWidth = width;
        }
    }
    return maxWidth;
}
/**
 * Calculates the height of a string in terminal lines.
 *
 * This function counts the number of lines by counting newline characters (`\n`).
 * For cross-platform compatibility, convert `\r\n` line endings to `\n` first.
 *
 * **Performance**: O(n) - single pass through the string.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.Height()` function.
 *
 * @example
 * ```typescript
 * import { Height } from 'lipgloss';
 *
 * Height('Hello');           // 1
 * Height('Hello\nWorld');     // 2
 * Height('Line1\nLine2\nLine3'); // 3
 * Height('');                 // 1 (empty string has height 1)
 *
 * // Convert Windows line endings first
 * const text = 'Line1\r\nLine2\r\n';
 * Height(text.replace(/\r\n/g, '\n')); // 2
 * ```
 *
 * @param str - The string to measure
 * @returns The height in lines (minimum 1, even for empty strings)
 *
 * @see {@link Width} - For measuring string width
 * @see {@link Size} - For getting both width and height
 */
export function Height(str) {
    if (!str)
        return 1;
    return str.split('\n').length;
}
/**
 * Calculates both width and height of a string in terminal cells.
 *
 * This is a convenience function that combines {@link Width} and {@link Height}
 * measurements into a single object. More efficient than calling both functions
 * separately for multi-line strings.
 *
 * **Performance**: O(n) - single pass to calculate both dimensions.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.Size()` function.
 *
 * @example
 * ```typescript
 * import { Size } from 'lipgloss';
 *
 * Size('Hello');              // { width: 5, height: 1 }
 * Size('Hello\nWorld!');       // { width: 6, height: 2 }
 * Size('\x1b[31mRed\x1b[0m');   // { width: 3, height: 1 }
 * Size('你好\n世界');           // { width: 4, height: 2 }
 *
 * const { width, height } = Size(myText);
 * console.log(`Dimensions: ${width}x${height}`);
 * ```
 *
 * @param str - The string to measure
 * @returns Object containing width and height in terminal cells
 *
 * @see {@link Width} - For width-only measurement
 * @see {@link Height} - For height-only measurement
 */
export function Size(str) {
    return {
        width: Width(str),
        height: Height(str),
    };
}
/**
 * Splits a string into lines and calculates the maximum line width.
 *
 * This utility function processes multi-line text and returns both the individual
 * lines and the width of the widest line. Used internally by many layout functions.
 *
 * **Performance**: O(n) - single pass through the string.
 *
 * **Go Compatibility**: Equivalent to Go's internal `getLines` function.
 *
 * @example
 * ```typescript
 * import { getLines } from 'lipgloss';
 *
 * const { lines, widest } = getLines('Hello\nWorld!\nFoo');
 * // lines: ['Hello', 'World!', 'Foo']
 * // widest: 6 (length of 'World!')
 *
 * // Handles Unicode correctly
 * const { lines, widest } = getLines('你好\n世界');
 * // lines: ['你好', '世界']
 * // widest: 4 (each CJK char is width 2)
 * ```
 *
 * @param str - The string to split and analyze
 * @returns Object with `lines` array and `widest` line width
 *
 * @see {@link Width} - For single-line width calculation
 * @see {@link join.getLines} - Similar function in join.ts module
 */
export function getLines(str) {
    if (!str)
        return { lines: [''], widest: 0 };
    const lines = str.split('\n');
    let widest = 0;
    for (const line of lines) {
        const width = getTextWidth(line);
        if (width > widest) {
            widest = width;
        }
    }
    return { lines, widest };
}
/**
 * Applies different styles to specific character indices within a string.
 *
 * This function allows fine-grained styling by applying one style to characters
 * at specified indices and another style to all other characters. Indices are
 * based on Unicode code points (runes), not byte positions.
 *
 * **Performance**: O(n + m) where n is string length and m is indices length.
 * Uses a Set for O(1) index lookups.
 *
 * **Go Compatibility**: Similar to Go's rune-based styling functions.
 *
 * @example
 * ```typescript
 * import { StyleRunes, NewStyle } from 'lipgloss';
 *
 * const highlight = new Style().backgroundColor('yellow');
 * const normal = new Style();
 *
 * // Highlight characters at positions 1, 3, 5
 * const result = StyleRunes(
 *   'Hello World',
 *   [1, 3, 5],
 *   highlight,  // 'e', 'l', ' ' will be highlighted
 *   normal      // all other characters use normal style
 * );
 *
 * // Works with Unicode
 * StyleRunes('你好世界', [0, 2], highlight, normal);
 * // Highlights first and third characters (你, 世)
 * ```
 *
 * @param str - The input string to style
 * @param indices - Array of zero-based character indices to highlight
 * @param matched - Style applied to characters at specified indices
 * @param unmatched - Style applied to all other characters
 * @returns String with styles applied to specified character ranges
 *
 * @see {@link StyleRanges} - For styling character ranges instead of indices
 * @see {@link ranges.StyleWord} - For styling specific words
 */
export function StyleRunes(str, indices, matched, unmatched) {
    if (!str)
        return '';
    // Convert slice of indices to a Set for faster lookups
    const indexSet = new Set(indices);
    const runes = Array.from(str); // Properly split Unicode characters
    let result = '';
    let currentGroup = '';
    for (let i = 0; i < runes.length; i++) {
        const rune = runes[i];
        const isMatched = indexSet.has(i);
        const nextIsMatched = indexSet.has(i + 1);
        const targetStyle = isMatched ? matched : unmatched;
        currentGroup += rune;
        // Flush group when style changes or at end
        if (isMatched !== nextIsMatched || i === runes.length - 1) {
            result += targetStyle.render(currentGroup);
            currentGroup = '';
        }
    }
    return result;
}
/**
 * Renders whitespace with optional styling and custom fill characters.
 *
 * This function creates whitespace of a specified width, optionally with:
 * - Custom foreground/background colors
 * - Custom characters instead of spaces (for patterns, dots, etc.)
 * - Proper handling of wide Unicode characters in fill patterns
 *
 * **Performance**: O(w) where w is the target width. Efficiently cycles through
 * custom characters when provided.
 *
 * **Go Compatibility**: Equivalent to Go's `whitespace.render()` functionality.
 *
 * @example
 * ```typescript
 * import { renderWhitespace } from 'lipgloss';
 *
 * // Basic whitespace
 * renderWhitespace(5); // '     '
 *
 * // Styled whitespace
 * renderWhitespace(5, {
 *   foreground: 'red',
 *   background: 'yellow'
 * }); // colored spaces
 *
 * // Custom fill characters
 * renderWhitespace(10, { chars: '.-' });
 * // '.-.-.-.-.-'
 *
 * // Unicode fill patterns
 * renderWhitespace(6, { chars: '·' });
 * // '······'
 * ```
 *
 * @param width - The width of whitespace to render (0 returns empty string)
 * @param options - Configuration for styling and fill characters
 * @param options.foreground - Foreground color for the whitespace
 * @param options.background - Background color for the whitespace
 * @param options.chars - Custom characters to cycle through (default: single space)
 * @returns Rendered whitespace string with specified width and styling
 *
 * @see {@link Place} - For positioning text with whitespace filling
 * @see {@link WhitespaceOptions} - For available styling options
 */
export function renderWhitespace(width, options = {}) {
    if (width <= 0)
        return '';
    const { chars = ' ', foreground, background } = options;
    if (!chars)
        return ' '.repeat(width);
    const runes = Array.from(chars);
    if (runes.length === 0)
        return ' '.repeat(width);
    let result = '';
    let runeIndex = 0;
    let currentWidth = 0;
    // Cycle through runes and print them into the whitespace
    while (currentWidth < width) {
        const rune = runes[runeIndex];
        const runeWidth = getTextWidth(rune);
        if (currentWidth + runeWidth <= width) {
            result += rune;
            currentWidth += runeWidth;
        }
        else {
            // Fill remaining space with regular spaces
            result += ' '.repeat(width - currentWidth);
            break;
        }
        runeIndex = (runeIndex + 1) % runes.length;
    }
    // Apply colors if specified
    if (foreground || background) {
        let style = new Style();
        if (foreground)
            style = style.color(foreground);
        if (background)
            style = style.backgroundColor(background);
        result = style.render(result);
    }
    return result;
}
/**
 * Creates a whitespace option function that sets the foreground color for whitespace rendering.
 *
 * This function returns a WhitespaceOption that can be used to configure the foreground
 * (text) color of whitespace characters when rendering spaces, padding, and other fill areas.
 * The color applies to the whitespace characters themselves.
 *
 * **Performance**: O(1) - creates a simple configuration function.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.WithWhitespaceForeground()` function.
 *
 * @example
 * ```typescript
 * import { WithWhitespaceForeground, renderWhitespace } from 'lipgloss';
 *
 * // Create a foreground color option
 * const redText = WithWhitespaceForeground('red');
 *
 * // Apply to whitespace options
 * const options = {};
 * redText(options);
 * // options now contains: { foreground: 'red' }
 *
 * // Use with renderWhitespace
 * const redSpaces = renderWhitespace(10, {
 *   foreground: 'red',
 *   chars: '·'
 * });
 *
 * // Combine multiple color formats
 * WithWhitespaceForeground('#ff0000');  // Hex color
 * WithWhitespaceForeground({ r: 255, g: 0, b: 0 });  // RGB object
 * WithWhitespaceForeground(196);        // ANSI 256 color
 * WithWhitespaceForeground('brightRed'); // Named color
 *
 * // Use in complex layouts with Place functions
 * const styledLayout = Place(20, 5, Center, Center, 'Hello', {
 *   foreground: 'blue',
 *   background: 'yellow',
 *   chars: '═'
 * });
 * ```
 *
 * **Color Format Support**:
 * - **Named colors**: `'red'`, `'blue'`, `'brightGreen'`, etc.
 * - **Hex strings**: `'#ff0000'`, `'#f00'`
 * - **RGB objects**: `{ r: 255, g: 0, b: 0 }`
 * - **RGBA objects**: `{ r: 255, g: 0, b: 0, a: 0.5 }`
 * - **HSL objects**: `{ h: 0, s: 100, l: 50 }`
 * - **ANSI codes**: `196`, `21`, etc.
 * - **No color**: `null`
 *
 * @param color - The foreground color for whitespace characters in any supported format
 * @returns WhitespaceOption function that sets the foreground color
 *
 * @see {@link WithWhitespaceBackground} - For setting whitespace background color
 * @see {@link WithWhitespaceChars} - For setting custom whitespace characters
 * @see {@link WhitespaceOptions} - For the complete options interface
 * @see {@link ColorValue} - For supported color formats
 * @see {@link renderWhitespace} - For rendering whitespace with options
 * @see {@link Place} - For positioning text with styled whitespace fill
 */
export function WithWhitespaceForeground(color) {
    return (options) => {
        options.foreground = color;
    };
}
/**
 * Creates a whitespace option function that sets the background color for whitespace rendering.
 *
 * This function returns a WhitespaceOption that can be used to configure the background
 * color of whitespace areas when rendering spaces, padding, and other fill areas.
 * The color applies to the background behind the whitespace characters.
 *
 * **Performance**: O(1) - creates a simple configuration function.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.WithWhitespaceBackground()` function.
 *
 * @example
 * ```typescript
 * import { WithWhitespaceBackground, renderWhitespace } from 'lipgloss';
 *
 * // Create a background color option
 * const yellowBg = WithWhitespaceBackground('yellow');
 *
 * // Apply to whitespace options
 * const options = {};
 * yellowBg(options);
 * // options now contains: { background: 'yellow' }
 *
 * // Use with renderWhitespace
 * const highlightedSpaces = renderWhitespace(10, {
 *   background: 'yellow',
 *   foreground: 'black',
 *   chars: ' '
 * });
 *
 * // Combine with foreground for contrast
 * const contrastOptions = {};
 * WithWhitespaceBackground('#003366')(contrastOptions); // Dark blue background
 * WithWhitespaceForeground('#66ccff')(contrastOptions); // Light blue text
 *
 * // Create visual separators
 * const separator = renderWhitespace(50, {
 *   background: 'blue',
 *   chars: '═'
 * });
 *
 * // Use in layouts for visual distinction
 * const paddedContent = Place(30, 8, Center, Center, 'Content', {
 *   background: 'gray',
 *   foreground: 'white',
 *   chars: '·'
 * });
 * ```
 *
 * **Color Format Support**:
 * - **Named colors**: `'red'`, `'blue'`, `'brightGreen'`, etc.
 * - **Hex strings**: `'#ff0000'`, `'#f00'`
 * - **RGB objects**: `{ r: 255, g: 0, b: 0 }`
 * - **RGBA objects**: `{ r: 255, g: 0, b: 0, a: 0.5 }`
 * - **HSL objects**: `{ h: 0, s: 100, l: 50 }`
 * - **ANSI codes**: `196`, `21`, etc.
 * - **No color**: `null`
 *
 * **Visual Effect**: The background color creates a colored area behind the whitespace
 * characters, making them stand out or blend with the overall design.
 *
 * @param color - The background color for whitespace areas in any supported format
 * @returns WhitespaceOption function that sets the background color
 *
 * @see {@link WithWhitespaceForeground} - For setting whitespace text color
 * @see {@link WithWhitespaceChars} - For setting custom whitespace characters
 * @see {@link WhitespaceOptions} - For the complete options interface
 * @see {@link ColorValue} - For supported color formats
 * @see {@link renderWhitespace} - For rendering whitespace with options
 * @see {@link Place} - For positioning text with styled whitespace fill
 */
export function WithWhitespaceBackground(color) {
    return (options) => {
        options.background = color;
    };
}
/**
 * Creates a whitespace option function that sets custom characters for whitespace rendering.
 *
 * This function returns a WhitespaceOption that can be used to configure what characters
 * are used when rendering whitespace, allowing for decorative patterns, dots, lines,
 * or any other visual representation instead of plain spaces.
 *
 * **Performance**: O(1) - creates a simple configuration function.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.WithWhitespaceChars()` function.
 *
 * @example
 * ```typescript
 * import { WithWhitespaceChars, renderWhitespace, Place } from 'lipgloss';
 *
 * // Create custom character options
 * const dots = WithWhitespaceChars('·');
 * const dashes = WithWhitespaceChars('-');
 * const pattern = WithWhitespaceChars('.-');
 *
 * // Apply to whitespace options
 * const options = {};
 * dots(options);
 * // options now contains: { chars: '·' }
 *
 * // Single character patterns
 * renderWhitespace(10, { chars: '·' });    // '··········'
 * renderWhitespace(10, { chars: '─' });    // '──────────'
 * renderWhitespace(10, { chars: '*' });    // '**********'
 *
 * // Multi-character patterns (cycles through)
 * renderWhitespace(10, { chars: '.-' });   // '.-.-.-.-.-'
 * renderWhitespace(10, { chars: '123' });  // '1231231231'
 * renderWhitespace(8, { chars: 'abc' });   // 'abcabcab'
 *
 * // Unicode characters and emojis
 * renderWhitespace(5, { chars: '▓' });     // '▓▓▓▓▓'
 * renderWhitespace(5, { chars: '░▒▓' });   // '░▒▓░▒'
 * renderWhitespace(4, { chars: '🌟' });    // '🌟🌟🌟🌟'
 *
 * // Use in layout functions
 * const decoratedBox = Place(20, 5, Center, Center, 'Hello', {
 *   chars: '·',
 *   foreground: 'gray'
 * });
 *
 * // Create visual separators
 * const separator = renderWhitespace(50, {
 *   chars: '═',
 *   foreground: 'blue'
 * });
 *
 * // Table-like patterns
 * const tableRow = renderWhitespace(30, {
 *   chars: ' ',
 *   background: 'white',
 *   foreground: 'black'
 * });
 * ```
 *
 * **Character Handling**:
 * - **Single character**: Repeats the same character
 * - **Multiple characters**: Cycles through them in sequence
 * - **Unicode support**: Full support for Unicode characters including emojis
 * - **Wide characters**: Properly handles CJK characters and other wide Unicode
 * - **Empty string**: Falls back to regular spaces
 *
 * **Pattern Examples**:
 * - `'·'` - Dotted fill (subtle, good for padding)
 * - `'-'` - Dashed lines (good for separators)
 * - `'='` - Double lines (strong separators)
 * - `'░▒▓'` - Gradient pattern (visual depth)
 * - `'+-'` - Alternating cross pattern
 * - `'123'` - Numbered sequence (debugging/counting)
 *
 * @param chars - The characters to use for whitespace rendering (cycles if multiple)
 * @returns WhitespaceOption function that sets the whitespace characters
 *
 * @see {@link WithWhitespaceForeground} - For setting character colors
 * @see {@link WithWhitespaceBackground} - For setting background colors
 * @see {@link WhitespaceOptions} - For the complete options interface
 * @see {@link renderWhitespace} - For rendering whitespace with options
 * @see {@link Place} - For positioning text with styled whitespace fill
 */
export function WithWhitespaceChars(chars) {
    return (options) => {
        options.chars = chars;
    };
}
/**
 * Places text within a rectangular area with specified alignment.
 *
 * This function positions a string or multi-line text block within a box of
 * given dimensions, filling empty space with whitespace (optionally styled).
 * Combines horizontal and vertical positioning in a single operation.
 *
 * **Performance**: O(n) where n is the total characters in the result.
 * Internally calls {@link PlaceHorizontal} and {@link PlaceVertical}.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.Place()` function.
 *
 * @example
 * ```typescript
 * import { Place, Center, Top, Right } from 'lipgloss';
 *
 * // Center text in a 20x5 box
 * const centered = Place(20, 5, Center, Center, 'Hello');
 *
 * // Top-right alignment
 * const topRight = Place(20, 5, Right, Top, 'Hi');
 *
 * // Custom position (30% from left, 70% from top)
 * const custom = Place(20, 5, 0.3, 0.7, 'Text');
 *
 * // With styled fill
 * const styled = Place(20, 5, Center, Center, 'Hello', {
 *   background: 'blue',
 *   chars: '·'
 * });
 * ```
 *
 * @param width - Target width of the containing box
 * @param height - Target height of the containing box
 * @param hPos - Horizontal position (0=left, 0.5=center, 1=right)
 * @param vPos - Vertical position (0=top, 0.5=center, 1=bottom)
 * @param str - Text content to position within the box
 * @param options - Styling options for the fill whitespace
 * @returns Text positioned within the specified dimensions
 *
 * @see {@link PlaceHorizontal} - For horizontal-only positioning
 * @see {@link PlaceVertical} - For vertical-only positioning
 * @see {@link Position} - For position value documentation
 */
export function Place(width, height, hPos, vPos, str, options = {}) {
    return PlaceVertical(height, vPos, PlaceHorizontal(width, hPos, str, options), options);
}
/**
 * Positions text horizontally within a specified width.
 *
 * This function aligns text horizontally by adding whitespace padding.
 * Each line is padded individually to the target width. If the content
 * is already wider than the target width, no changes are made.
 *
 * **Performance**: O(n×l) where n is total characters and l is number of lines.
 * Each line is processed individually for optimal alignment.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.PlaceHorizontal()` function.
 *
 * @example
 * ```typescript
 * import { PlaceHorizontal, Left, Center, Right } from 'lipgloss';
 *
 * const text = 'Hello\nWorld';
 *
 * // Left align in 20-character width
 * PlaceHorizontal(20, Left, text);
 * // 'Hello               \nWorld               '
 *
 * // Center align
 * PlaceHorizontal(20, Center, text);
 * // '       Hello        \n       World        '
 *
 * // Right align
 * PlaceHorizontal(20, Right, text);
 * // '               Hello\n               World'
 *
 * // Custom position (25% from left)
 * PlaceHorizontal(20, 0.25, text);
 * ```
 *
 * @param width - Target width for each line (minimum width, no effect if content is wider)
 * @param pos - Horizontal position (0=left, 0.5=center, 1=right, or any value 0-1)
 * @param str - Text content to position (can be multi-line)
 * @param options - Styling options for the padding whitespace
 * @returns Text with horizontal alignment applied to each line
 *
 * @see {@link PlaceVertical} - For vertical positioning
 * @see {@link Place} - For combined horizontal and vertical positioning
 * @see {@link Position} - For position value documentation
 */
export function PlaceHorizontal(width, pos, str, options = {}) {
    const { lines, widest: contentWidth } = getLines(str);
    const gap = width - contentWidth;
    if (gap <= 0) {
        return str;
    }
    const normalizedPos = normalizePosition(pos);
    const result = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineWidth = getTextWidth(line);
        // Calculate how much shorter this line is compared to the widest line
        const shortfall = Math.max(0, contentWidth - lineWidth);
        const totalGap = gap + shortfall;
        if (normalizedPos === 0) {
            // Left alignment
            result.push(line + renderWhitespace(totalGap, options));
        }
        else if (normalizedPos === 1) {
            // Right alignment
            result.push(renderWhitespace(totalGap, options) + line);
        }
        else {
            // Center or custom position
            const split = Math.round(totalGap * normalizedPos);
            const leftGap = totalGap - split;
            const rightGap = split;
            result.push(renderWhitespace(leftGap, options) + line + renderWhitespace(rightGap, options));
        }
    }
    return result.join('\n');
}
/**
 * Positions text vertically within a specified height.
 *
 * This function aligns text vertically by adding empty lines above and/or below
 * the content. If the content is already taller than the target height,
 * no changes are made.
 *
 * **Performance**: O(h×w) where h is target height and w is content width.
 * Creates empty lines matching the content width for proper alignment.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.PlaceVertical()` function.
 *
 * @example
 * ```typescript
 * import { PlaceVertical, Top, Center, Bottom } from 'lipgloss';
 *
 * const text = 'Hello\nWorld';
 *
 * // Top align in 5-line height
 * PlaceVertical(5, Top, text);
 * // 'Hello\nWorld\n     \n     \n     '
 *
 * // Center align
 * PlaceVertical(5, Center, text);
 * // '     \nHello\nWorld\n     \n     '
 *
 * // Bottom align
 * PlaceVertical(5, Bottom, text);
 * // '     \n     \n     \nHello\nWorld'
 *
 * // Custom position (25% from top)
 * PlaceVertical(5, 0.25, text);
 * ```
 *
 * @param height - Target height in lines (minimum height, no effect if content is taller)
 * @param pos - Vertical position (0=top, 0.5=center, 1=bottom, or any value 0-1)
 * @param str - Text content to position (can be multi-line)
 * @param options - Styling options for the padding whitespace lines
 * @returns Text with vertical alignment applied
 *
 * @see {@link PlaceHorizontal} - For horizontal positioning
 * @see {@link Place} - For combined horizontal and vertical positioning
 * @see {@link Position} - For position value documentation
 */
export function PlaceVertical(height, pos, str, options = {}) {
    const contentHeight = Height(str);
    const gap = height - contentHeight;
    if (gap <= 0) {
        return str;
    }
    const normalizedPos = normalizePosition(pos);
    const { widest: width } = getLines(str);
    const emptyLine = renderWhitespace(width, options);
    if (normalizedPos === 0) {
        // Top alignment
        const bottomLines = Array(gap).fill(emptyLine);
        return str + '\n' + bottomLines.join('\n');
    }
    else if (normalizedPos === 1) {
        // Bottom alignment
        const topLines = Array(gap).fill(emptyLine);
        return topLines.join('\n') + '\n' + str;
    }
    else {
        // Center or custom position
        const split = Math.round(gap * normalizedPos);
        const topGap = gap - split;
        const bottomGap = split;
        const topLines = Array(topGap).fill(emptyLine);
        const bottomLines = Array(bottomGap).fill(emptyLine);
        const parts = [];
        if (topLines.length > 0) {
            parts.push(topLines.join('\n'));
        }
        parts.push(str);
        if (bottomLines.length > 0) {
            parts.push(bottomLines.join('\n'));
        }
        return parts.join('\n');
    }
}
/**
 * Finds the maximum display width of any single character in a string.
 *
 * This function analyzes each Unicode character (rune) and returns the width
 * of the widest one. Useful for border calculations and layout algorithms
 * that need to account for variable-width characters.
 *
 * **Performance**: O(n) - examines each character once.
 *
 * **Go Compatibility**: Equivalent to Go's internal `maxRuneWidth` function.
 *
 * @example
 * ```typescript
 * import { maxRuneWidth } from 'lipgloss';
 *
 * maxRuneWidth('Hello');      // 1 (all ASCII chars are width 1)
 * maxRuneWidth('你好');       // 2 (CJK characters are width 2)
 * maxRuneWidth('A🎉B');       // 2 (emoji is width 2)
 * maxRuneWidth('Café');       // 1 (combining chars don't add width)
 * maxRuneWidth('');           // 0 (empty string)
 * ```
 *
 * @param str - The string to analyze for character widths
 * @returns Maximum character width found (0 for empty string)
 *
 * @see {@link getTextWidth} - For total string width calculation
 * @see {@link toRunes} - For splitting strings into Unicode characters
 */
export function maxRuneWidth(str) {
    if (!str)
        return 0;
    const runes = Array.from(str);
    let maxWidth = 0;
    for (const rune of runes) {
        const width = getTextWidth(rune);
        if (width > maxWidth) {
            maxWidth = width;
        }
    }
    return maxWidth;
}
/**
 * Extracts the first Unicode character (rune) from a string.
 *
 * This function properly handles Unicode by treating the string as a sequence
 * of Unicode code points rather than UTF-16 code units, ensuring correct
 * behavior with emojis, CJK characters, and combining characters.
 *
 * **Performance**: O(1) - only processes the first character.
 *
 * **Go Compatibility**: Equivalent to Go's `getFirstRuneAsString` function.
 *
 * @example
 * ```typescript
 * import { getFirstRune } from 'lipgloss';
 *
 * getFirstRune('Hello');      // 'H'
 * getFirstRune('你好');       // '你'
 * getFirstRune('🎉Party');    // '🎉'
 * getFirstRune('');           // ''
 * getFirstRune('Café');       // 'C'
 * ```
 *
 * @param str - The input string to extract from
 * @returns First Unicode character as a string, or empty string if input is empty
 *
 * @see {@link toRunes} - For splitting entire strings into Unicode characters
 * @see {@link runeCount} - For counting Unicode characters in a string
 */
export function getFirstRune(str) {
    if (!str)
        return '';
    const runes = Array.from(str);
    return runes[0] || '';
}
/**
 * Pads a string to a specific width by adding spaces to the right.
 *
 * This function extends a string to the target width by appending spaces.
 * If the string is already at or wider than the target width, it's returned unchanged.
 *
 * **Performance**: O(n + p) where n is string length and p is padding needed.
 *
 * @example
 * ```typescript
 * import { padRight } from 'lipgloss';
 *
 * padRight('Hello', 10);      // 'Hello     '
 * padRight('你好', 6);        // '你好  ' (CJK chars are width 2 each)
 * padRight('Already long', 5); // 'Already long' (unchanged)
 * ```
 *
 * @param str - String to pad
 * @param width - Target width in terminal columns
 * @returns String padded to the target width with trailing spaces
 *
 * @see {@link padLeft} - For left padding
 * @see {@link padCenter} - For center padding
 * @see {@link PlaceHorizontal} - For more advanced alignment with custom fill
 */
export function padRight(str, width) {
    const currentWidth = getTextWidth(str);
    const padding = Math.max(0, width - currentWidth);
    return str + ' '.repeat(padding);
}
/**
 * Pads a string to a specific width by adding spaces to the left.
 *
 * This function extends a string to the target width by prepending spaces.
 * If the string is already at or wider than the target width, it's returned unchanged.
 *
 * **Performance**: O(n + p) where n is string length and p is padding needed.
 *
 * @example
 * ```typescript
 * import { padLeft } from 'lipgloss';
 *
 * padLeft('Hello', 10);       // '     Hello'
 * padLeft('你好', 6);         // '  你好' (CJK chars are width 2 each)
 * padLeft('Already long', 5);  // 'Already long' (unchanged)
 * ```
 *
 * @param str - String to pad
 * @param width - Target width in terminal columns
 * @returns String padded to the target width with leading spaces
 *
 * @see {@link padRight} - For right padding
 * @see {@link padCenter} - For center padding
 * @see {@link PlaceHorizontal} - For more advanced alignment with custom fill
 */
export function padLeft(str, width) {
    const currentWidth = getTextWidth(str);
    const padding = Math.max(0, width - currentWidth);
    return ' '.repeat(padding) + str;
}
/**
 * Pads a string to a specific width by adding spaces to both sides.
 *
 * This function centers a string within the target width by distributing
 * padding evenly on both sides. If odd padding is needed, the extra space
 * goes to the right side.
 *
 * **Performance**: O(n + p) where n is string length and p is padding needed.
 *
 * @example
 * ```typescript
 * import { padCenter } from 'lipgloss';
 *
 * padCenter('Hello', 11);     // '   Hello   '
 * padCenter('Hello', 10);     // '  Hello   ' (extra space on right)
 * padCenter('你好', 8);       // '  你好  ' (CJK chars are width 2 each)
 * padCenter('Too long', 5);   // 'Too long' (unchanged)
 * ```
 *
 * @param str - String to pad
 * @param width - Target width in terminal columns
 * @returns String centered within the target width using spaces
 *
 * @see {@link padLeft} - For left padding
 * @see {@link padRight} - For right padding
 * @see {@link Place} - For center positioning with custom fill
 */
export function padCenter(str, width) {
    const currentWidth = getTextWidth(str);
    const totalPadding = Math.max(0, width - currentWidth);
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    return ' '.repeat(leftPadding) + str + ' '.repeat(rightPadding);
}
/**
 * Converts a string into an array of Unicode characters (runes).
 *
 * This function properly splits a string into individual Unicode code points,
 * handling multi-byte characters, emojis, and combining characters correctly.
 * Each element in the returned array represents one visible character.
 *
 * **Performance**: O(n) where n is the number of Unicode code points.
 *
 * **Go Compatibility**: Similar to Go's rune slice conversion.
 *
 * @example
 * ```typescript
 * import { toRunes } from 'lipgloss';
 *
 * toRunes('Hello');           // ['H', 'e', 'l', 'l', 'o']
 * toRunes('你好');            // ['你', '好']
 * toRunes('🎉🎊');            // ['🎉', '🎊']
 * toRunes('Café');            // ['C', 'a', 'f', 'é']
 * toRunes('');                // []
 * ```
 *
 * @param str - The input string to split into Unicode characters
 * @returns Array where each element is a single Unicode character as a string
 *
 * @see {@link runeCount} - For counting Unicode characters without creating array
 * @see {@link getFirstRune} - For getting just the first Unicode character
 * @see {@link StyleRunes} - For styling specific character indices
 */
export function toRunes(str) {
    return Array.from(str);
}
/**
 * Counts the number of Unicode characters (runes) in a string.
 *
 * This function returns the actual number of visible characters, which may
 * differ from `str.length` for strings containing multi-byte Unicode characters,
 * emojis, or surrogate pairs.
 *
 * **Performance**: O(n) where n is the number of Unicode code points.
 * More efficient than `toRunes(str).length` as it doesn't create an array.
 *
 * **Go Compatibility**: Equivalent to `len([]rune(str))` in Go.
 *
 * @example
 * ```typescript
 * import { runeCount } from 'lipgloss';
 *
 * runeCount('Hello');         // 5 (same as str.length)
 * runeCount('你好');          // 2 (str.length would be 2)
 * runeCount('🎉🎊');          // 2 (str.length would be 4)
 * runeCount('Café');          // 4 (same as str.length)
 * runeCount('');              // 0
 *
 * // Comparison with str.length
 * const emoji = '🎉';
 * emoji.length;               // 2 (UTF-16 code units)
 * runeCount(emoji);           // 1 (actual character count)
 * ```
 *
 * @param str - The input string to count characters in
 * @returns Number of Unicode characters (code points)
 *
 * @see {@link toRunes} - For splitting string into individual characters
 * @see {@link Width} - For measuring display width (accounts for character width)
 */
export function runeCount(str) {
    return Array.from(str).length;
}
/**
 * Removes all ANSI escape sequences from a string.
 *
 * This function strips color codes, style codes, cursor positioning, and other
 * ANSI escape sequences, leaving only the visible text content. Useful for
 * length calculations and plain text processing.
 *
 * **Performance**: O(n) - single pass through the string with regex matching.
 *
 * **Implementation**: Uses the `strip-ansi` library with compatibility handling
 * for both ES modules and CommonJS.
 *
 * @example
 * ```typescript
 * import { stripANSI } from 'lipgloss';
 *
 * stripANSI('\x1b[31mRed text\x1b[0m');           // 'Red text'
 * stripANSI('\x1b[1mBold\x1b[22m text');          // 'Bold text'
 * stripANSI('Normal text');                      // 'Normal text'
 * stripANSI('\x1b[2J\x1b[H Clear screen');       // ' Clear screen'
 *
 * // Useful for length calculations
 * const styled = '\x1b[31mHello\x1b[0m';
 * styled.length;                                 // 12 (includes ANSI codes)
 * stripANSI(styled).length;                      // 5 (just 'Hello')
 * ```
 *
 * @param str - String potentially containing ANSI escape sequences
 * @returns String with all ANSI sequences removed
 *
 * @see {@link hasANSI} - For checking if a string contains ANSI sequences
 * @see {@link Width} - For measuring display width (already handles ANSI)
 */
export function stripANSI(str) {
    return stripAnsi(str);
}
/**
 * Checks whether a string contains ANSI escape sequences.
 *
 * This function determines if a string has any ANSI escape sequences by
 * comparing it with its stripped version. Useful for conditional processing
 * or validation.
 *
 * **Performance**: O(n) - requires stripping ANSI to compare.
 *
 * @example
 * ```typescript
 * import { hasANSI } from 'lipgloss';
 *
 * hasANSI('\x1b[31mRed text\x1b[0m');            // true
 * hasANSI('Plain text');                         // false
 * hasANSI('');                                   // false
 * hasANSI('Text with \x1b[1m bold \x1b[0m');     // true
 *
 * // Conditional processing
 * if (hasANSI(userInput)) {
 *   console.log('Input contains styling');
 * }
 * ```
 *
 * @param str - String to check for ANSI escape sequences
 * @returns True if the string contains any ANSI escape sequences
 *
 * @see {@link stripANSI} - For removing ANSI sequences
 */
export function hasANSI(str) {
    return str !== stripANSI(str);
}
/**
 * Repeat a string a specified number of times
 * This is a convenience function that handles edge cases
 *
 * @param str - String to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 */
export function repeat(str, count) {
    if (count <= 0 || !str)
        return '';
    return str.repeat(Math.floor(count));
}
/**
 * Create a string of spaces with a specific width
 * Useful for padding and alignment
 *
 * @param width - Number of spaces to create
 * @returns String of spaces
 */
export function spaces(width) {
    return repeat(' ', width);
}
/**
 * Trim whitespace from both ends of a string
 * This is a convenience function that also handles Unicode whitespace
 *
 * @param str - String to trim
 * @returns Trimmed string
 */
export function trim(str) {
    return str.trim();
}
/**
 * Trim whitespace from the left end of a string
 *
 * @param str - String to trim
 * @returns Left-trimmed string
 */
export function trimLeft(str) {
    return str.trimStart();
}
/**
 * Trim whitespace from the right end of a string
 *
 * @param str - String to trim
 * @returns Right-trimmed string
 */
export function trimRight(str) {
    return str.trimEnd();
}
// Go Lipgloss Global API Compatibility Functions
/**
 * Initialize the global color profile from environment variables
 * This ensures that NO_COLOR, FORCE_COLOR, and other environment variables
 * are respected by default, matching Go's behavior
 */
function initializeGlobalColorProfile() {
    if (typeof process === 'undefined') {
        return ColorProfile.TrueColor;
    }
    // NO_COLOR takes highest precedence - disable all colors
    if (process.env.NO_COLOR) {
        return ColorProfile.Ascii;
    }
    // FORCE_COLOR=0 explicitly disables colors
    if (process.env.FORCE_COLOR === '0') {
        return ColorProfile.Ascii;
    }
    // Use termenv's environment detection directly (avoiding chicken-and-egg with renderer)
    try {
        const { defaultOutputInstance } = require('@tsports/termenv');
        const termenvProfile = defaultOutputInstance().envColorProfile();
        return termenvToLipglossProfile(termenvProfile);
    }
    catch (error) {
        // Fallback if termenv is not available during initialization
        return ColorProfile.TrueColor;
    }
}
let _colorProfile = initializeGlobalColorProfile();
let _hasDarkBackground = null;
// Ensure the default renderer is synced with the global color profile
// This must happen after the global profile is initialized
(() => {
    try {
        const { defaultRenderer } = require('./renderer');
        const termenvProfile = lipglossToTermenvProfile(_colorProfile);
        defaultRenderer().setColorProfile(termenvProfile);
    }
    catch (error) {
        // Ignore errors during initialization (renderer might not be ready)
    }
})();
/**
 * Creates a new Style instance for text styling.
 *
 * This is the primary way to create styles in lipgloss, providing a fluent
 * API for applying colors, borders, padding, margins, and other styling properties.
 *
 * **Performance**: O(1) - lightweight object creation.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.new Style()` function.
 *
 * @example
 * ```typescript
 * import { NewStyle } from 'lipgloss';
 *
 * // Basic styling
 * const redText = new Style().color('red');
 * console.log(redText.render('Hello'));
 *
 * // Method chaining
 * const fancyStyle = new Style()
 *   .color('white')
 *   .backgroundColor('blue')
 *   .padding(1)
 *   .margin(1)
 *   .bold(true);
 *
 * // Reusable styles
 * const headerStyle = new Style().fontSize(20).bold(true);
 * const subheaderStyle = headerStyle.copy().fontSize(16);
 * ```
 *
 * @returns A new Style instance ready for configuration
 *
 * @see {@link Style} - For the Style class documentation
 * @see {@link Style.copy} - For creating style variations
 */
export function NewStyle() {
    return new Style();
}
/**
 * Returns the current terminal color profile setting.
 *
 * The color profile determines how many colors are available for rendering:
 * - `NoColor`: No color support
 * - `ANSI`: 16 basic colors
 * - `ANSI256`: 256 colors
 * - `TrueColor`: 16.7 million colors (24-bit)
 *
 * **Performance**: O(1) - returns cached value.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.ColorProfile()` function.
 *
 * @example
 * ```typescript
 * import { GetColorProfile, ColorProfile } from 'lipgloss';
 *
 * const profile = GetColorProfile();
 *
 * switch (profile) {
 *   case ColorProfile.TrueColor:
 *     console.log('Full color support available');
 *     break;
 *   case ColorProfile.ANSI256:
 *     console.log('256 color support available');
 *     break;
 *   case ColorProfile.ANSI:
 *     console.log('Basic 16 color support');
 *     break;
 *   case ColorProfile.NoColor:
 *     console.log('No color support');
 *     break;
 * }
 * ```
 *
 * @returns The current color profile setting
 *
 * @see {@link SetColorProfile} - For changing the color profile
 * @see {@link ColorProfile} - For available color profile options
 */
export function GetColorProfile() {
    return _colorProfile;
}
/**
 * Sets the color profile for terminal color rendering.
 *
 * This function configures the color capabilities that lipgloss will use
 * when rendering colors. Set this based on your terminal's capabilities or
 * user preferences.
 *
 * **Performance**: O(1) - updates global setting.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.SetColorProfile()` function.
 *
 * @example
 * ```typescript
 * import { SetColorProfile, ColorProfile } from 'lipgloss';
 *
 * // Force true color mode
 * SetColorProfile(ColorProfile.TrueColor);
 *
 * // Limit to 256 colors for compatibility
 * SetColorProfile(ColorProfile.ANSI256);
 *
 * // Disable colors entirely
 * SetColorProfile(ColorProfile.NoColor);
 *
 * // Auto-detect based on environment
 * if (process.env.COLORTERM === 'truecolor') {
 *   SetColorProfile(ColorProfile.TrueColor);
 * } else if (process.env.TERM?.includes('256color')) {
 *   SetColorProfile(ColorProfile.ANSI256);
 * }
 * ```
 *
 * @param profile - The color profile to use for rendering
 *
 * @see {@link GetColorProfile} - For reading the current color profile
 * @see {@link ColorProfile} - For available color profile options
 */
/**
 * Convert lipgloss ColorProfile to termenv Profile
 * These enums have different value mappings that need to be converted
 */
function lipglossToTermenvProfile(lipglossProfile) {
    switch (lipglossProfile) {
        case ColorProfile.Ascii:
            return TermenvProfile.Ascii; // 0 -> 3
        case ColorProfile.ANSI:
            return TermenvProfile.ANSI; // 1 -> 2
        case ColorProfile.ANSI256:
            return TermenvProfile.ANSI256; // 2 -> 1
        case ColorProfile.TrueColor:
            return TermenvProfile.TrueColor; // 3 -> 0
        default:
            return TermenvProfile.Ascii;
    }
}
/**
 * Convert termenv Profile to lipgloss ColorProfile
 * These enums have different value mappings that need to be converted
 */
function termenvToLipglossProfile(termenvProfile) {
    switch (termenvProfile) {
        case TermenvProfile.Ascii:
            return ColorProfile.Ascii; // 3 -> 0
        case TermenvProfile.ANSI:
            return ColorProfile.ANSI; // 2 -> 1  
        case TermenvProfile.ANSI256:
            return ColorProfile.ANSI256; // 1 -> 2
        case TermenvProfile.TrueColor:
            return ColorProfile.TrueColor; // 0 -> 3
        default:
            return ColorProfile.Ascii;
    }
}
export function SetColorProfile(profile) {
    // Check environment variables that force no colors
    // NO_COLOR and FORCE_COLOR=0 take precedence over explicit color profile settings
    if (typeof process !== 'undefined') {
        if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
            _colorProfile = ColorProfile.Ascii;
            profile = ColorProfile.Ascii;
        }
        else {
            _colorProfile = profile;
        }
    }
    else {
        _colorProfile = profile;
    }
    // Convert lipgloss ColorProfile to termenv Profile before passing to renderer
    const termenvProfile = lipglossToTermenvProfile(profile);
    // Also set the default renderer's color profile to keep them in sync
    // We use dynamic import to avoid circular dependency issues
    try {
        const { setColorProfile: rendererSetColorProfile } = require('./renderer');
        rendererSetColorProfile(termenvProfile);
    }
    catch (error) {
        // If renderer is not available, just update the local profile
        // This can happen during initialization or in testing scenarios
    }
}
/**
 * Determines if the terminal likely has a dark background.
 *
 * This function attempts to detect the terminal's background color to help
 * choose appropriate foreground colors. Detection is based on environment
 * variables and known terminal characteristics.
 *
 * **Performance**: O(1) - uses cached value after first detection.
 *
 * **Go Compatibility**: Direct equivalent to Go's `lipgloss.HasDarkBackground()` function.
 *
 * **Detection Method**:
 * - Checks environment variables (`TERM_PROGRAM`, `COLORTERM`, `TERM`)
 * - Uses heuristics based on known terminal defaults
 * - Defaults to dark background for modern terminals
 * - Can be overridden with {@link SetHasDarkBackground}
 *
 * @example
 * ```typescript
 * import { HasDarkBackground, NewStyle } from 'lipgloss';
 *
 * // Choose colors based on background
 * const textStyle = new Style().color(
 *   HasDarkBackground() ? 'white' : 'black'
 * );
 *
 * // Conditional styling
 * if (HasDarkBackground()) {
 *   console.log('Using light text on dark background');
 * } else {
 *   console.log('Using dark text on light background');
 * }
 * ```
 *
 * @returns True if the terminal likely has a dark background
 *
 * @see {@link SetHasDarkBackground} - For manually overriding the detection
 */
export function HasDarkBackground() {
    if (_hasDarkBackground !== null) {
        return _hasDarkBackground;
    }
    // Attempt to detect dark background based on environment
    // This is a best-effort detection for terminal environments
    // Check for common terminal environment variables that might indicate dark themes
    const termProgram = process.env.TERM_PROGRAM;
    const colorTerm = process.env.COLORTERM;
    const term = process.env.TERM;
    // Default to dark background for most modern terminals
    if (termProgram === 'iTerm.app' ||
        termProgram === 'Apple_Terminal' ||
        colorTerm === 'truecolor' ||
        term?.includes('256color')) {
        return true;
    }
    // Check if we're in a known light terminal
    if (termProgram === 'Terminal.app' && process.env.TERM_PROGRAM_VERSION) {
        // macOS Terminal - default to light unless configured otherwise
        return false;
    }
    // Default assumption for modern terminals
    return true;
}
/**
 * Manually overrides the dark background detection.
 *
 * This function allows applications to explicitly set whether the terminal
 * has a dark background, overriding the automatic detection. Useful when
 * the automatic detection is incorrect or when you have additional context.
 *
 * **Performance**: O(1) - sets cached value.
 *
 * @example
 * ```typescript
 * import { SetHasDarkBackground, HasDarkBackground } from 'lipgloss';
 *
 * // Override based on user preference
 * const userPrefersDark = getUserThemePreference();
 * SetHasDarkBackground(userPrefersDark);
 *
 * // Now HasDarkBackground() will return the override value
 * console.log(HasDarkBackground()); // Returns userPrefersDark
 *
 * // Reset to automatic detection
 * SetHasDarkBackground(null); // Clears override
 * ```
 *
 * @param isDark - Whether the terminal has a dark background
 *
 * @see {@link HasDarkBackground} - For reading the current background detection
 */
export function SetHasDarkBackground(isDark) {
    _hasDarkBackground = isDark;
}
//# sourceMappingURL=utils.js.map