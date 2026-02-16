/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * List types and interfaces
 *
 * This module defines the core type definitions for the list component system.
 * These types enable flexible and type-safe list creation with various
 * enumerator and indentation strategies.
 *
 * @example Type Usage
 * ```typescript
 * import { Enumerator, Indenter, Items } from './types';
 *
 * // Custom enumerator implementation
 * const customEnum: Enumerator = (items, index) => {
 *   return `[${index + 1}]`;
 * };
 *
 * // Custom indenter implementation
 * const customIndent: Indenter = (items, index) => {
 *   return '    '; // Four spaces
 * };
 * ```
 */

import type { Children } from '../tree/types';

/**
 * Items type alias representing a collection of list items.
 *
 * This type is an alias for the `Children` type from the tree component,
 * providing a semantic name for list contexts while maintaining compatibility
 * with the underlying tree structure.
 *
 * The Items interface provides methods to access and iterate over list items:
 * - `at(index: number): Node | null` - Get item at specific index
 * - `length(): number` - Get total number of items
 *
 * @example Working with Items
 * ```typescript
 * // Custom enumerator that accesses item properties
 * const contextualEnum: Enumerator = (items: Items, index: number) => {
 *   const totalItems = items.length();
 *   const isLast = index === totalItems - 1;
 *
 *   if (isLast) {
 *     return '└─'; // Last item gets a different symbol
 *   }
 *   return '├─';   // Other items get standard symbol
 * };
 * ```
 */
export type Items = Children;

/**
 * Enumerator function type for generating list item prefixes.
 *
 * Enumerators are responsible for generating the prefix string that appears
 * before each list item (bullets, numbers, letters, etc.). They receive
 * the current list items and the index of the item being enumerated.
 *
 * @param items - The current list items collection
 * @param index - Zero-based index of the item being enumerated
 * @returns The prefix string to display before the item
 *
 * @example Basic Enumerator
 * ```typescript
 * const numberedEnumerator: Enumerator = (items, index) => {
 *   return `${index + 1}.`;
 * };
 * ```
 *
 * @example Context-Aware Enumerator
 * ```typescript
 * const smartEnumerator: Enumerator = (items, index) => {
 *   const total = items.length();
 *   const isFirst = index === 0;
 *   const isLast = index === total - 1;
 *
 *   if (isFirst) return '▶ '; // First item
 *   if (isLast) return '◀ ';  // Last item
 *   return '• ';              // Middle items
 * };
 * ```
 *
 * @example Progressive Numbering
 * ```typescript
 * const progressiveEnum: Enumerator = (items, index) => {
 *   const progress = Math.round((index / items.length()) * 100);
 *   return `${progress}% `;
 * };
 * ```
 */
export type Enumerator = (items: Items, index: number) => string;

/**
 * Indenter function type for controlling nested content indentation.
 *
 * Indenters control how nested content is visually separated from its parent.
 * They are particularly important for nested lists and multi-line content,
 * providing the spacing and connecting characters for hierarchical display.
 *
 * @param items - The current list items collection
 * @param index - Zero-based index of the item being indented
 * @returns The indentation string to use for nested content
 *
 * @example Basic Indenter
 * ```typescript
 * const spaceIndenter: Indenter = (items, index) => {
 *   return '  '; // Two spaces for each level
 * };
 * ```
 *
 * @example Tree-Style Indenter
 * ```typescript
 * const treeIndenter: Indenter = (items, index) => {
 *   const isLast = index === items.length() - 1;
 *   return isLast ? '    ' : '│   ';
 * };
 * ```
 *
 * @example Variable Indentation
 * ```typescript
 * const variableIndenter: Indenter = (items, index) => {
 *   // More indentation for later items
 *   const baseIndent = 2;
 *   const extraIndent = Math.floor(index / 5);
 *   return ' '.repeat(baseIndent + extraIndent);
 * };
 * ```
 *
 * @example Decorative Indenter
 * ```typescript
 * const decorativeIndenter: Indenter = (items, index) => {
 *   const decorations = ['┆ ', '┊ ', '┋ '];
 *   return decorations[index % decorations.length];
 * };
 * ```
 */
export type Indenter = (items: Items, index: number) => string;
