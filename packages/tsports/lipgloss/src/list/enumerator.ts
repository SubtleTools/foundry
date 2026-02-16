/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * List enumerators for different list styles
 *
 * This module provides various built-in enumerator functions that determine
 * how list items are prefixed. Each enumerator produces a different visual
 * style suitable for different types of content organization.
 *
 * Available enumerators:
 * - **Alphabet**: A., B., C., ... AA., AB., ...
 * - **Arabic**: 1., 2., 3., ...
 * - **Roman**: I., II., III., IV., ...
 * - **Bullet**: • (simple bullet points)
 * - **Asterisk**: * (asterisk bullets)
 * - **Dash**: - (dash bullets)
 *
 * @example Different Enumerator Styles
 * ```typescript
 * import { newList, Alphabet, Arabic, Roman, Bullet } from './list';
 *
 * // Alphabetic enumeration
 * const alphabetic = newList()
 *   .enumerator(Alphabet)
 *   .items('Alpha', 'Beta', 'Gamma');
 *
 * // Numeric enumeration
 * const numbered = newList()
 *   .enumerator(Arabic)
 *   .items('Step 1', 'Step 2', 'Step 3');
 *
 * // Roman numerals
 * const roman = newList()
 *   .enumerator(Roman)
 *   .items('Chapter I', 'Chapter II', 'Chapter III');
 *
 * // Simple bullets
 * const bullets = newList()
 *   .enumerator(Bullet)
 *   .items('Task A', 'Task B', 'Task C');
 * ```
 */

import type { Enumerator, Indenter, Items } from './types';

// Re-export types for convenience
export type { Enumerator, Indenter };

/**
 * Length of the alphabet for alphabetic enumerations.
 * Used for calculating letter combinations (A-Z, then AA-ZZ, etc.)
 */
const ABC_LENGTH = 26;

/**
 * Alphabet enumerator for alphabetic list item numbering.
 *
 * Generates alphabetic labels in sequence: A., B., C., ..., Z., AA., AB., ...
 * This enumerator supports unlimited items by using multiple letters for
 * items beyond the 26th position.
 *
 * Pattern sequence:
 * - Items 1-26: A., B., C., ..., Z.
 * - Items 27-52: AA., AB., AC., ..., AZ.
 * - Items 53-78: BA., BB., BC., ..., BZ.
 * - And so on...
 *
 * @param _items - The list items (unused by this enumerator)
 * @param index - Zero-based index of the current item
 * @returns The alphabetic label for the item at the given index
 *
 * @example Basic Usage
 * ```typescript
 * const list = newList()
 *   .enumerator(Alphabet)
 *   .items('Section Alpha', 'Section Beta', 'Section Gamma');
 *
 * console.log(list.toString());
 * // Output:
 * // A. Section Alpha
 * // B. Section Beta
 * // C. Section Gamma
 * ```
 *
 * @example Extended Sequence
 * ```typescript
 * // Create a list with 30 items to see multi-letter labels
 * const items = Array.from({length: 30}, (_, i) => `Item ${i + 1}`);
 * const extendedList = newList().enumerator(Alphabet).items(...items);
 *
 * // Shows: A., B., ..., Z., AA., AB., AC., AD.
 * ```
 */
export const Alphabet: Enumerator = (_items: Items, index: number): string => {
  // Handle triple letters (AAA, AAB, etc.)
  if (index >= ABC_LENGTH * ABC_LENGTH + ABC_LENGTH) {
    const firstChar = String.fromCharCode(65 + Math.floor(index / (ABC_LENGTH * ABC_LENGTH)) - 1);
    const secondChar = String.fromCharCode(65 + Math.floor((index / ABC_LENGTH) % ABC_LENGTH) - 1);
    const thirdChar = String.fromCharCode(65 + (index % ABC_LENGTH));
    return `${firstChar}${secondChar}${thirdChar}.`;
  }

  // Handle double letters (AA, AB, etc.)
  if (index >= ABC_LENGTH) {
    const firstChar = String.fromCharCode(65 + Math.floor(index / ABC_LENGTH) - 1);
    const secondChar = String.fromCharCode(65 + (index % ABC_LENGTH));
    return `${firstChar}${secondChar}.`;
  }

  // Handle single letters (A, B, C, etc.)
  const char = String.fromCharCode(65 + (index % ABC_LENGTH));
  return `${char}.`;
};

/**
 * Arabic numeral enumerator for standard numeric list item numbering.
 *
 * Generates sequential numbers: 1., 2., 3., 4., ...
 * This is the most common enumerator style for ordered lists and
 * procedural content like instructions or steps.
 *
 * @param _items - The list items (unused by this enumerator)
 * @param index - Zero-based index of the current item
 * @returns The numeric label for the item at the given index
 *
 * @example Basic Usage
 * ```typescript
 * const steps = newList()
 *   .enumerator(Arabic)
 *   .items(
 *     'Read the documentation',
 *     'Install dependencies',
 *     'Run the application'
 *   );
 *
 * console.log(steps.toString());
 * // Output:
 * // 1. Read the documentation
 * // 2. Install dependencies
 * // 3. Run the application
 * ```
 *
 * @example Large Numbers
 * ```typescript
 * const largeList = newList().enumerator(Arabic);
 * for (let i = 1; i <= 100; i++) {
 *   largeList.item(`Item ${i}`);
 * }
 * // Produces: 1., 2., 3., ..., 99., 100.
 * ```
 */
export const Arabic: Enumerator = (_items: Items, index: number): string => {
  return `${index + 1}.`;
};

/**
 * Roman numeral enumerator for classical list item numbering.
 *
 * Generates Roman numerals: I., II., III., IV., V., ...
 * This enumerator is ideal for formal documents, legal content,
 * or classical academic formatting.
 *
 * Supports numbers up to 3999 (MMMCMXCIX) using standard Roman numeral rules:
 * - I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000
 * - Subtractive notation: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900
 *
 * @param _items - The list items (unused by this enumerator)
 * @param index - Zero-based index of the current item
 * @returns The Roman numeral label for the item at the given index
 *
 * @example Basic Usage
 * ```typescript
 * const chapters = newList()
 *   .enumerator(Roman)
 *   .items(
 *     'Introduction',
 *     'Methodology',
 *     'Results',
 *     'Conclusion'
 *   );
 *
 * console.log(chapters.toString());
 * // Output:
 * // I. Introduction
 * // II. Methodology
 * // III. Results
 * // IV. Conclusion
 * ```
 *
 * @example Classical Document Structure
 * ```typescript
 * const outline = newList()
 *   .enumerator(Roman)
 *   .items(
 *     'Executive Summary',
 *     'Background and Context',
 *     'Analysis and Findings',
 *     'Recommendations',
 *     'Implementation Plan'
 *   );
 * // Produces: I., II., III., IV., V.
 * ```
 */
export const Roman: Enumerator = (_items: Items, index: number): string => {
  const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  const arabicValues = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

  let num = index + 1; // Convert 0-based index to 1-based
  let result = '';

  for (let i = 0; i < arabicValues.length; i++) {
    const value = arabicValues[i];
    const numeral = romanNumerals[i];
    if (value !== undefined && numeral !== undefined) {
      while (num >= value) {
        num -= value;
        result += numeral;
      }
    }
  }

  return `${result}.`;
};

/**
 * Bullet enumerator for unordered list items.
 *
 * Generates uniform bullet points (•) for all items, creating clean
 * unordered lists. This is the default enumerator and ideal for
 * non-sequential content like feature lists or task items.
 *
 * @param _items - The list items (unused by this enumerator)
 * @param _index - The item index (unused by this enumerator)
 * @returns The bullet character '•'
 *
 * @example Basic Usage
 * ```typescript
 * const features = newList()
 *   .enumerator(Bullet)
 *   .items(
 *     'Fast performance',
 *     'Easy to use',
 *     'Cross-platform support'
 *   );
 *
 * console.log(features.toString());
 * // Output:
 * // • Fast performance
 * // • Easy to use
 * // • Cross-platform support
 * ```
 *
 * @example Task List
 * ```typescript
 * const tasks = newList()
 *   .enumerator(Bullet)
 *   .items(
 *     'Review code changes',
 *     'Update documentation',
 *     'Run tests',
 *     'Deploy to staging'
 *   );
 * ```
 */
export const Bullet: Enumerator = (_items: Items, _index: number): string => {
  return '•';
};

/**
 * Asterisk enumerator for markdown-style unordered lists.
 *
 * Generates asterisk symbols (*) for all items, providing a
 * markdown-compatible format that's widely recognized and
 * easy to type.
 *
 * @param _items - The list items (unused by this enumerator)
 * @param _index - The item index (unused by this enumerator)
 * @returns The asterisk character '*'
 *
 * @example Basic Usage
 * ```typescript
 * const notes = newList()
 *   .enumerator(Asterisk)
 *   .items(
 *     'Remember to test edge cases',
 *     'Check browser compatibility',
 *     'Update changelog'
 *   );
 *
 * console.log(notes.toString());
 * // Output:
 * // * Remember to test edge cases
 * // * Check browser compatibility
 * // * Update changelog
 * ```
 *
 * @example Markdown Export
 * ```typescript
 * // Perfect for generating markdown content
 * const markdownList = newList()
 *   .enumerator(Asterisk)
 *   .items('Item 1', 'Item 2', 'Item 3');
 *
 * // Can be directly used in markdown files
 * ```
 */
export const Asterisk: Enumerator = (_items: Items, _index: number): string => {
  return '*';
};

/**
 * Dash enumerator for alternative unordered list styling.
 *
 * Generates dash symbols (-) for all items, providing another
 * markdown-compatible format with a more subtle visual style
 * than asterisks or bullets.
 *
 * @param _items - The list items (unused by this enumerator)
 * @param _index - The item index (unused by this enumerator)
 * @returns The dash character '-'
 *
 * @example Basic Usage
 * ```typescript
 * const guidelines = newList()
 *   .enumerator(Dash)
 *   .items(
 *     'Keep functions small and focused',
 *     'Use descriptive variable names',
 *     'Write comprehensive tests'
 *   );
 *
 * console.log(guidelines.toString());
 * // Output:
 * // - Keep functions small and focused
 * // - Use descriptive variable names
 * // - Write comprehensive tests
 * ```
 *
 * @example Subtle Lists
 * ```typescript
 * // Good for lists that need to be less visually prominent
 * const requirements = newList()
 *   .enumerator(Dash)
 *   .itemStyle(new Style().foreground('gray'))
 *   .items('Node.js 16+', 'TypeScript 4.5+', 'npm or yarn');
 * ```
 */
export const Dash: Enumerator = (_items: Items, _index: number): string => {
  return '-';
};
