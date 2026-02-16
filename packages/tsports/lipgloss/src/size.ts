/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * String size utilities for Lipgloss
 * Port of size.go from Go Lipgloss
 */

import { stringWidth } from './ansi-utils';

/**
 * Width returns the cell width of characters in the string. ANSI sequences are
 * ignored and characters wider than one cell (such as Chinese characters and
 * emojis) are appropriately measured.
 *
 * You should use this instead of str.length or [...str].length as neither
 * will give you accurate results.
 */
export function Width(str: string): number {
  let width = 0;
  
  for (const line of str.split('\n')) {
    const w = stringWidth(line);
    if (w > width) {
      width = w;
    }
  }
  
  return width;
}

/**
 * Height returns height of a string in cells. This is done simply by
 * counting \n characters. If your strings use \r\n for newlines you should
 * convert them to \n first, or simply write a separate function for measuring
 * height.
 */
export function Height(str: string): number {
  return (str.match(/\n/g)?.length || 0) + 1;
}

/**
 * Size returns the width and height of the string in cells. ANSI sequences are
 * ignored and characters wider than one cell (such as Chinese characters and
 * emojis) are appropriately measured.
 */
export function Size(str: string): { width: number; height: number } {
  const width = Width(str);
  const height = Height(str);
  return { width, height };
}

/**
 * getLines splits a string by newlines and returns the lines and max width
 * This is used internally by positioning and alignment functions
 */
export function getLines(str: string): { lines: string[]; width: number } {
  const lines = str.split('\n');
  let width = 0;
  
  for (const line of lines) {
    const w = stringWidth(line);
    if (w > width) {
      width = w;
    }
  }
  
  return { lines, width };
}