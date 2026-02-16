/**
 * String size utilities for Lipgloss
 * Port of size.go from Go Lipgloss
 */
/**
 * Width returns the cell width of characters in the string. ANSI sequences are
 * ignored and characters wider than one cell (such as Chinese characters and
 * emojis) are appropriately measured.
 *
 * You should use this instead of str.length or [...str].length as neither
 * will give you accurate results.
 */
export declare function Width(str: string): number;
/**
 * Height returns height of a string in cells. This is done simply by
 * counting \n characters. If your strings use \r\n for newlines you should
 * convert them to \n first, or simply write a separate function for measuring
 * height.
 */
export declare function Height(str: string): number;
/**
 * Size returns the width and height of the string in cells. ANSI sequences are
 * ignored and characters wider than one cell (such as Chinese characters and
 * emojis) are appropriately measured.
 */
export declare function Size(str: string): {
    width: number;
    height: number;
};
/**
 * getLines splits a string by newlines and returns the lines and max width
 * This is used internally by positioning and alignment functions
 */
export declare function getLines(str: string): {
    lines: string[];
    width: number;
};
//# sourceMappingURL=size.d.ts.map