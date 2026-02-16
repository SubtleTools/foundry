/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * ANSI utility functions
 */

import { getTextWidth } from './layout';

/**
 * Calculate display width of string (alias for getTextWidth)
 * This is used by Go reference ports to maintain API compatibility
 */
export function stringWidth(str: string): number {
  return getTextWidth(str);
}

/**
 * Strip ANSI escape sequences from a string
 * Based on the ANSI stripping logic from @tsports/termenv
 */
export function stripAnsi(str: string): string {
  if (!str) return str;

  let result = '';
  let i = 0;

  while (i < str.length) {
    // Handle ANSI escape sequences
    if (str[i] === '\x1b' && str[i + 1] === '[') {
      // Skip ANSI escape sequence
      i += 2;
      while (i < str.length) {
        const char = str[i];
        if (!char || /[a-zA-Z]/.test(char)) break;
        i++;
      }
      if (i < str.length) i++; // Skip the final letter
      continue;
    }

    // Regular character, add to result
    result += str[i];
    i++;
  }

  return result;
}
