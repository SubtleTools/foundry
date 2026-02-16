/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * List implementation for creating bulleted and numbered lists
 *
 * This module provides a complete list rendering system with support for various
 * enumerator styles (bullets, numbers, alphabetic), nested lists, conditional styling,
 * and flexible content including text, other lists, and complex components.
 *
 * @example Basic Usage
 * ```typescript
 * import { newList, Arabic } from './list';
 *
 * const list = newList()
 *   .enumerator(Arabic)
 *   .items('First item', 'Second item', 'Third item');
 *
 * console.log(list.toString());
 * // Output:
 * // 1. First item
 * // 2. Second item
 * // 3. Third item
 * ```
 *
 * @example Nested Lists
 * ```typescript
 * const sublist = newList()
 *   .enumerator(Bullet)
 *   .items('Sub A', 'Sub B');
 *
 * const mainList = newList()
 *   .enumerator(Arabic)
 *   .items('Item 1', sublist, 'Item 3');
 * ```
 *
 * @example Conditional Styling
 * ```typescript
 * const styledList = newList()
 *   .itemStyleFunc((items, index) => {
 *     return index === 0
 *       ? new Style().bold(true).foreground('red')
 *       : new Style();
 *   })
 *   .items('Important', 'Normal', 'Normal');
 * ```
 */

import type { Style } from '../style';
import { Tree } from '../tree/tree';
import type { Children } from '../tree/types';
import { Bullet } from './enumerator';
import type { Enumerator, Indenter, Items } from './types';

/**
 * StyleFunc defines a function type for conditional list item styling.
 *
 * This function receives the current list items and the index being styled,
 * allowing for dynamic styling based on position, content, or any other criteria.
 *
 * @param items - The current list items (Children from tree component)
 * @param index - The zero-based index of the item being styled
 * @returns The Style to apply to the item at the given index
 *
 * @example
 * ```typescript
 * const highlightFirst: StyleFunc = (items, index) => {
 *   return index === 0
 *     ? new Style().bold(true).foreground('yellow')
 *     : new Style();
 * };
 *
 * list.itemStyleFunc(highlightFirst);
 * ```
 */
export type StyleFunc = (items: Items, index: number) => Style;

/**
 * List represents a list of items that can be displayed with various formatting options.
 *
 * Lists are highly flexible containers that can hold any type of content including:
 * - Text strings
 * - Other List instances (for nesting)
 * - Table components
 * - Any object with a toString() method
 *
 * Key features:
 * - Multiple enumerator styles (bullets, numbers, alphabetic, roman numerals)
 * - Nested list support with automatic indentation
 * - Conditional styling for both enumerators and items
 * - Offset support for partial list display
 * - Hide/show functionality
 * - Seamless integration with the Tree component system
 *
 * The List class is built on top of the Tree component, inheriting its hierarchical
 * rendering capabilities while providing a simplified API optimized for list-like content.
 *
 * @example Creating Different List Types
 * ```typescript
 * // Bullet list
 * const bullets = newList()
 *   .enumerator(Bullet)
 *   .items('Task 1', 'Task 2', 'Task 3');
 *
 * // Numbered list
 * const numbered = newList()
 *   .enumerator(Arabic)
 *   .items('Step 1', 'Step 2', 'Step 3');
 *
 * // Alphabetic list
 * const alphabetic = newList()
 *   .enumerator(Alphabet)
 *   .items('Section A', 'Section B', 'Section C');
 * ```
 *
 * @example Advanced Configuration
 * ```typescript
 * const advancedList = newList()
 *   .enumerator(Arabic)
 *   .enumeratorStyle(new Style().foreground('blue').bold(true))
 *   .itemStyle(new Style().paddingLeft(1))
 *   .indenter(() => '  ') // Custom indentation
 *   .items('Configure', 'Build', 'Deploy');
 * ```
 */
export class List {
  private tree: Tree;

  constructor() {
    this.tree = new Tree();
    this.setupDefaults();
  }

  /**
   * Set up default list configuration.
   *
   * Initializes the list with sensible defaults:
   * - Bullet enumerator for unordered lists
   * - Simple space indenter for nested items
   *
   * @private
   */
  private setupDefaults(): void {
    this.tree
      .enumerator((children: Children, index: number) => {
        // Convert Tree Children to List Items for enumerator
        return Bullet(children, index);
      })
      .indenter(() => ' '); // Default simple space indenter for lists
  }

  /**
   * Check if this list is currently hidden.
   *
   * Hidden lists will not render any output when toString() is called.
   * This is useful for conditional display logic.
   *
   * @returns True if the list is hidden, false otherwise
   *
   * @example
   * ```typescript
   * const list = newList().items('A', 'B', 'C');
   * console.log(list.hidden()); // false
   *
   * list.hide(true);
   * console.log(list.hidden()); // true
   * console.log(list.toString()); // "" (empty output)
   * ```
   */
  hidden(): boolean {
    return this.tree.hidden();
  }

  /**
   * Set the hidden state of this list.
   *
   * When hidden, the list produces no output during rendering. This is useful
   * for implementing conditional display logic or temporarily removing lists
   * from complex layouts.
   *
   * @param hide - True to hide the list, false to show it
   * @returns This List instance for method chaining
   *
   * @example
   * ```typescript
   * const list = newList().items('Task 1', 'Task 2');
   *
   * // Conditionally hide based on some criteria
   * const isEmpty = false;
   * list.hide(isEmpty);
   *
   * // Chain with other operations
   * list.hide(false).enumerator(Arabic).itemStyle(boldStyle);
   * ```
   */
  hide(hide: boolean): List {
    this.tree.hide(hide);
    return this;
  }

  /**
   * Set the display offset for list items.
   *
   * The offset allows you to display only a portion of the list items,
   * which is useful for pagination, scrolling, or showing only relevant
   * sections of large lists.
   *
   * @param start - Zero-based index of the first item to display
   * @param end - Zero-based index after the last item to display (exclusive)
   * @returns This List instance for method chaining
   *
   * @example
   * ```typescript
   * const list = newList()
   *   .items('A', 'B', 'C', 'D', 'E')
   *   .offset(1, 4); // Show items B, C, D (indices 1, 2, 3)
   *
   * console.log(list.toString());
   * // Output shows only items B, C, D with appropriate numbering
   * ```
   *
   * @example Pagination
   * ```typescript
   * const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
   * const pageSize = 2;
   * const page = 1; // Second page (0-indexed)
   *
   * const list = newList()
   *   .items(...items)
   *   .offset(page * pageSize, (page + 1) * pageSize);
   * // Shows items 3 and 4
   * ```
   */
  offset(start: number, end: number): List {
    this.tree.offset(start, end);
    return this;
  }

  /**
   * Get the root value of this list.
   *
   * The root value is typically empty for lists, as they are primarily
   * containers for items. However, this can be useful when lists are
   * used as tree nodes with a header or title.
   *
   * @returns The root value as a string
   *
   * @example
   * ```typescript
   * const list = newList().items('A', 'B', 'C');
   * console.log(list.value()); // "" (typically empty)
   * ```
   */
  value(): string {
    return this.tree.value();
  }

  /**
   * Render the list as a formatted string.
   *
   * This method produces the final formatted output of the list, applying
   * all configured styles, enumerators, and formatting options. The output
   * includes proper indentation for nested lists and styling for both
   * enumerators and items.
   *
   * @returns The formatted list as a string, ready for display
   *
   * @example
   * ```typescript
   * const list = newList()
   *   .enumerator(Arabic)
   *   .items('First', 'Second', 'Third');
   *
   * console.log(list.toString());
   * // Output:
   * // 1. First
   * // 2. Second
   * // 3. Third
   * ```
   *
   * @example With Nested Lists
   * ```typescript
   * const sublist = newList()
   *   .enumerator(Bullet)
   *   .items('Sub A', 'Sub B');
   *
   * const mainList = newList()
   *   .enumerator(Arabic)
   *   .items('Main 1', sublist, 'Main 2');
   *
   * console.log(mainList.toString());
   * // Output:
   * // 1. Main 1
   * // 2. • Sub A
   * //    • Sub B
   * // 3. Main 2
   * ```
   */
  toString(): string {
    return this.tree.toString();
  }

  /**
   * Render the list to a string.
   *
   * This is an alias for toString() to match the Go API.
   *
   * @returns The rendered list as a string
   */
  render(): string {
    return this.toString();
  }

  /**
   * Set a uniform style for all list enumerators.
   *
   * This method applies the same style to every enumerator (bullet, number, etc.)
   * in the list. For more granular control, use enumeratorStyleFunc().
   *
   * @param style - The Style to apply to all enumerators
   * @returns This List instance for method chaining
   *
   * @example
   * ```typescript
   * const list = newList()
   *   .enumerator(Arabic)
   *   .enumeratorStyle(new Style().foreground('blue').bold(true))
   *   .items('Step 1', 'Step 2', 'Step 3');
   *
   * // All enumerators (1., 2., 3.) will be blue and bold
   * ```
   */
  enumeratorStyle(style: Style): List {
    this.tree.enumeratorStyle(style);
    return this;
  }

  /**
   * Set a conditional styling function for list enumerators.
   *
   * This function is called for each enumerator, allowing you to apply different
   * styles based on the item's position, content, or any other criteria.
   *
   * @param func - Function that returns a Style for each enumerator
   * @returns This List instance for method chaining
   *
   * @example Highlight First Item
   * ```typescript
   * const list = newList()
   *   .enumerator(Arabic)
   *   .enumeratorStyleFunc((items, index) => {
   *     return index === 0
   *       ? new Style().foreground('red').bold(true)
   *       : new Style().foreground('gray');
   *   })
   *   .items('Important', 'Normal', 'Normal');
   *
   * // First enumerator (1.) will be red and bold
   * // Others will be gray
   * ```
   *
   * @example Alternate Colors
   * ```typescript
   * const alternatingStyle = (items, index) => {
   *   return index % 2 === 0
   *     ? new Style().foreground('blue')
   *     : new Style().foreground('green');
   * };
   *
   * list.enumeratorStyleFunc(alternatingStyle);
   * ```
   */
  enumeratorStyleFunc(func: StyleFunc): List {
    this.tree.enumeratorStyleFunc((children: Children, index: number) => {
      return func(children, index);
    });
    return this;
  }

  /**
   * Set the indenter function for nested list items.
   *
   * The indenter controls how nested content is visually separated from parent items.
   * This is particularly important for nested lists and multi-line content.
   *
   * @param indenter - Function that returns indentation string for each level
   * @returns This List instance for method chaining
   *
   * @example Custom Indentation
   * ```typescript
   * const list = newList()
   *   .indenter(() => '  ') // Two spaces for each level
   *   .items('Parent', sublist, 'Another parent');
   * ```
   *
   * @example Context-Aware Indentation
   * ```typescript
   * const smartIndenter: Indenter = (items, index) => {
   *   // Use more indentation for the last item
   *   return index === items.length() - 1 ? '    ' : '  ';
   * };
   *
   * list.indenter(smartIndenter);
   * ```
   */
  indenter(indenter: Indenter): List {
    this.tree.indenter((children: Children, index: number) => {
      return indenter(children, index);
    });
    return this;
  }

  /**
   * Set a uniform style for all list items.
   *
   * This method applies the same style to every item in the list.
   * For more granular control, use itemStyleFunc().
   *
   * @param style - The Style to apply to all items
   * @returns This List instance for method chaining
   *
   * @example
   * ```typescript
   * const list = newList()
   *   .itemStyle(new Style().paddingLeft(2).foreground('green'))
   *   .items('Task 1', 'Task 2', 'Task 3');
   *
   * // All items will have left padding and green color
   * ```
   */
  itemStyle(style: Style): List {
    this.tree.itemStyle(style);
    return this;
  }

  /**
   * Set a conditional styling function for list items.
   *
   * This function is called for each item, allowing you to apply different
   * styles based on the item's position, content, or any other criteria.
   *
   * @param func - Function that returns a Style for each item
   * @returns This List instance for method chaining
   *
   * @example Priority-Based Styling
   * ```typescript
   * const priorities = ['high', 'medium', 'low'];
   * const items = ['Critical bug', 'Feature request', 'Documentation'];
   *
   * const list = newList()
   *   .itemStyleFunc((items, index) => {
   *     const priority = priorities[index];
   *     switch (priority) {
   *       case 'high': return new Style().foreground('red').bold(true);
   *       case 'medium': return new Style().foreground('yellow');
   *       case 'low': return new Style().foreground('gray');
   *       default: return new Style();
   *     }
   *   })
   *   .items(...items);
   * ```
   *
   * @example Zebra Striping
   * ```typescript
   * const zebraStyle = (items, index) => {
   *   return index % 2 === 0
   *     ? new Style().background('lightgray')
   *     : new Style();
   * };
   *
   * list.itemStyleFunc(zebraStyle);
   * ```
   */
  itemStyleFunc(func: StyleFunc): List {
    this.tree.itemStyleFunc((children: Children, index: number) => {
      return func(children, index);
    });
    return this;
  }

  /**
   * Add a single item to the list.
   *
   * Items can be of any type and will be converted to strings for display.
   * Special handling is provided for List instances, which will be rendered
   * as nested sublists with proper indentation.
   *
   * @param item - The item to add (string, number, List, or any object with toString())
   * @returns This List instance for method chaining
   *
   * @example Adding Simple Items
   * ```typescript
   * const list = newList()
   *   .item('First item')
   *   .item(42)
   *   .item(new Date().toLocaleDateString());
   * ```
   *
   * @example Adding Nested Lists
   * ```typescript
   * const sublist = newList()
   *   .enumerator(Bullet)
   *   .items('Sub A', 'Sub B');
   *
   * const mainList = newList()
   *   .item('Main item 1')
   *   .item(sublist)
   *   .item('Main item 2');
   * ```
   */
  item(item: unknown): List {
    if (item instanceof List) {
      // If it's another list, add its tree
      this.tree.child(item.tree);
    } else {
      // For any other item, add it directly
      this.tree.child(item);
    }
    return this;
  }

  /**
   * Add multiple items to the list.
   *
   * This is a convenience method for adding several items at once.
   * Each item is processed through the item() method, so all the same
   * rules apply for nested lists and type conversion.
   *
   * @param items - The items to add
   * @returns This List instance for method chaining
   *
   * @example
   * ```typescript
   * const list = newList()
   *   .items('Item 1', 'Item 2', 'Item 3');
   *
   * // Equivalent to:
   * const list2 = newList()
   *   .item('Item 1')
   *   .item('Item 2')
   *   .item('Item 3');
   * ```
   *
   * @example Mixed Content Types
   * ```typescript
   * const sublist = newList().items('Sub A', 'Sub B');
   * const table = createTable().rows(['Col1', 'Col2']);
   *
   * const list = newList()
   *   .items(
   *     'Text item',
   *     42,
   *     sublist,
   *     table,
   *     { name: 'Custom object' }
   *   );
   * ```
   */
  items(...items: unknown[]): List {
    for (const item of items) {
      this.item(item);
    }
    return this;
  }

  /**
   * Set the enumerator function for this list.
   *
   * The enumerator determines how each list item is prefixed (bullets, numbers, etc.).
   * Several built-in enumerators are available: Bullet, Arabic, Alphabet, Roman,
   * Asterisk, and Dash.
   *
   * @param enumerator - The enumerator function to use
   * @returns This List instance for method chaining
   *
   * @example Different Enumerator Styles
   * ```typescript
   * import { Arabic, Bullet, Alphabet, Roman } from './enumerator';
   *
   * // Numbered list (1., 2., 3.)
   * const numbered = newList()
   *   .enumerator(Arabic)
   *   .items('First', 'Second', 'Third');
   *
   * // Bullet list (•, •, •)
   * const bullets = newList()
   *   .enumerator(Bullet)
   *   .items('Item A', 'Item B', 'Item C');
   *
   * // Alphabetic list (A., B., C.)
   * const alphabetic = newList()
   *   .enumerator(Alphabet)
   *   .items('Alpha', 'Beta', 'Gamma');
   *
   * // Roman numerals (I., II., III.)
   * const roman = newList()
   *   .enumerator(Roman)
   *   .items('First', 'Second', 'Third');
   * ```
   *
   * @example Custom Enumerator
   * ```typescript
   * const customEnumerator: Enumerator = (items, index) => {
   *   const emojis = ['🥇', '🥈', '🥉'];
   *   return emojis[index] || '🏅';
   * };
   *
   * const rankedList = newList()
   *   .enumerator(customEnumerator)
   *   .items('Gold winner', 'Silver winner', 'Bronze winner');
   * ```
   */
  enumerator(enumerator: Enumerator): List {
    this.tree.enumerator((children: Children, index: number) => {
      return enumerator(children, index);
    });
    return this;
  }

  /**
   * Get the underlying tree instance.
   *
   * This method exposes the internal Tree component for advanced use cases
   * or integration with other tree-based components. Most users should not
   * need to access this directly.
   *
   * @returns The underlying Tree instance
   * @internal
   *
   * @example
   * ```typescript
   * const list = newList().items('A', 'B', 'C');
   * const tree = list.getTree();
   *
   * // Advanced tree operations...
   * tree.enumeratorStyleFunc(customStyleFunc);
   * ```
   */
  getTree(): Tree {
    return this.tree;
  }
}

/**
 * Create a new List instance with optional initial items.
 *
 * This is the primary factory function for creating lists. It provides a
 * convenient way to create and populate a list in a single call, or create
 * an empty list for later population.
 *
 * @param items - Optional initial items to add to the list
 * @returns A new List instance
 *
 * @example Empty List
 * ```typescript
 * const list = newList();
 *
 * // Later add items
 * list.items('Item 1', 'Item 2', 'Item 3');
 * ```
 *
 * @example Pre-populated List
 * ```typescript
 * const list = newList('Task 1', 'Task 2', 'Task 3');
 *
 * // Equivalent to:
 * const list2 = newList().items('Task 1', 'Task 2', 'Task 3');
 * ```
 *
 * @example Mixed Content
 * ```typescript
 * const sublist = newList('Sub A', 'Sub B');
 *
 * const mixedList = newList(
 *   'Text item',
 *   42,
 *   sublist,
 *   { name: 'Custom object' }
 * );
 * ```
 *
 * @example Fluent API
 * ```typescript
 * const styledList = newList('Item 1', 'Item 2')
 *   .enumerator(Arabic)
 *   .enumeratorStyle(new Style().foreground('blue'))
 *   .itemStyle(new Style().paddingLeft(1));
 * ```
 */
export function newList(...items: unknown[]): List {
  const list = new List();
  if (items.length > 0) {
    list.items(...items);
  }
  return list;
}
