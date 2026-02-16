/**
 * List Component System
 *
 * A comprehensive list rendering system for terminal output with support for various
 * enumerator styles, nested lists, conditional styling, and flexible content management.
 *
 * ## Key Features
 *
 * - **Multiple Enumerator Styles**: Bullets, numbers, alphabetic, Roman numerals
 * - **Nested List Support**: Full hierarchical list rendering with proper indentation
 * - **Conditional Styling**: Apply different styles based on item position or content
 * - **Flexible Content**: Support for text, numbers, other lists, and custom objects
 * - **Tree Integration**: Built on the Tree component for advanced hierarchical features
 * - **Offset Support**: Display partial lists for pagination or scrolling
 *
 * ## Quick Start
 *
 * ```typescript
 * import { newList, Arabic, Bullet } from '@lipgloss/list';
 *
 * // Create a numbered list
 * const steps = newList()
 *   .enumerator(Arabic)
 *   .items(
 *     'Install dependencies',
 *     'Configure environment',
 *     'Run application'
 *   );
 *
 * console.log(steps.toString());
 * // Output:
 * // 1. Install dependencies
 * // 2. Configure environment
 * // 3. Run application
 * ```
 *
 * ## Advanced Usage
 *
 * ### Nested Lists
 * ```typescript
 * const sublist = newList()
 *   .enumerator(Bullet)
 *   .items('Sub task A', 'Sub task B');
 *
 * const mainList = newList()
 *   .enumerator(Arabic)
 *   .items('Main task 1', sublist, 'Main task 2');
 * ```
 *
 * ### Conditional Styling
 * ```typescript
 * const priorityList = newList()
 *   .itemStyleFunc((items, index) => {
 *     return index === 0
 *       ? new Style().foreground('red').bold(true)
 *       : new Style();
 *   })
 *   .items('Critical task', 'Normal task', 'Low priority');
 * ```
 *
 * ### Custom Enumerators
 * ```typescript
 * const customEnum: Enumerator = (items, index) => {
 *   const emojis = ['🥇', '🥈', '🥉'];
 *   return emojis[index] || '🏅';
 * };
 *
 * const rankings = newList()
 *   .enumerator(customEnum)
 *   .items('First place', 'Second place', 'Third place');
 * ```
 *
 * ## Available Enumerators
 *
 * - **Arabic**: 1., 2., 3., ... (standard numbering)
 * - **Alphabet**: A., B., C., ... (alphabetic sequence)
 * - **Roman**: I., II., III., ... (Roman numerals)
 * - **Bullet**: • (simple bullets)
 * - **Asterisk**: * (markdown-style)
 * - **Dash**: - (subtle bullets)
 *
 * ## Type Definitions
 *
 * All types are fully documented and provide excellent TypeScript support:
 *
 * - **Enumerator**: Function that generates item prefixes
 * - **Indenter**: Function that controls nested content indentation
 * - **StyleFunc**: Function for conditional item styling
 * - **Items**: Collection interface for list items
 *
 * @example Complete Example
 * ```typescript
 * import {
 *   newList,
 *   Arabic,
 *   Bullet,
 *   Style,
 *   type Enumerator,
 *   type StyleFunc
 * } from '@lipgloss/list';
 *
 * // Create a styled, nested list
 * const todoList = newList()
 *   .enumerator(Arabic)
 *   .enumeratorStyle(new Style().foreground('blue').bold(true))
 *   .itemStyle(new Style().paddingLeft(1))
 *   .items(
 *     'Plan project structure',
 *     newList()
 *       .enumerator(Bullet)
 *       .items('Define components', 'Set up testing', 'Create documentation'),
 *     'Implement core features',
 *     'Test and deploy'
 *   );
 *
 * console.log(todoList.toString());
 * ```
 */
export * from './enumerator';
export { Alphabet, Arabic, Asterisk, Bullet, Dash, type Enumerator, type Indenter, Roman, } from './enumerator';
export * from './list';
export { List, newList, type StyleFunc } from './list';
export type { Items } from './types';
export * from './types';
//# sourceMappingURL=index.d.ts.map