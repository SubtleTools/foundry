/**
 * Tree Implementation for Hierarchical Data Display
 *
 * This module provides a complete tree rendering system for displaying hierarchical
 * data structures in terminal environments. It supports nested content, custom
 * styling, flexible enumerators, and sophisticated rendering algorithms.
 *
 * ## Core Concepts
 *
 * - **Hierarchical Structure**: Support for unlimited nesting levels
 * - **Flexible Content**: Any content type can be tree nodes or leaves
 * - **Custom Enumerators**: Pluggable prefix generation (branches, bullets, etc.)
 * - **Style Integration**: Full Style system support for rich formatting
 * - **Rendering Pipeline**: Sophisticated layout algorithms for optimal display
 *
 * @example Basic Tree Usage
 * ```typescript
 * import { newTree } from './tree';
 *
 * const tree = newTree()
 *   .root('Project Files')
 *   .child(
 *     newTree().root('src')
 *       .child('index.ts')
 *       .child('utils.ts'),
 *     newTree().root('docs')
 *       .child('README.md')
 *       .child('API.md'),
 *     'package.json'
 *   );
 *
 * console.log(tree.toString());
 * ```
 *
 * @example Custom Styling
 * ```typescript
 * const styledTree = newTree()
 *   .root('System Status')
 *   .enumeratorStyle(new Style().foreground('blue'))
 *   .itemStyleFunc((children, index) => {
 *     return index === 0
 *       ? new Style().foreground('green').bold(true)
 *       : new Style().foreground('gray');
 *   })
 *   .child('✓ Database Connected', '✓ Cache Active', '⚠ High Memory Usage');
 * ```
 */
import { Style } from '../style';
import { type TreeRenderer } from './renderer';
import { type Children, type Enumerator, type Indenter, type Node, type StyleFunc } from './types';
/**
 * Tree class implements a hierarchical node structure for displaying nested content.
 *
 * The Tree class provides a comprehensive solution for rendering hierarchical data
 * with support for custom styling, flexible enumerators, and sophisticated layout
 * algorithms. It serves as both a container for other nodes and a renderable
 * component itself.
 *
 * ## Key Features
 *
 * - **Flexible Hierarchy**: Support for unlimited nesting levels
 * - **Mixed Content**: Can contain strings, other trees, or any renderable objects
 * - **Custom Rendering**: Pluggable enumerators and indenters
 * - **Style System**: Full integration with the Style component
 * - **Offset Support**: Partial rendering for pagination or scrolling
 * - **Hide/Show**: Conditional rendering support
 *
 * ## Architecture
 *
 * The Tree class implements the Node interface and delegates rendering to a
 * TreeRenderer instance. This separation allows for customizable rendering
 * strategies while maintaining a consistent API.
 *
 * @example File System Tree
 * ```typescript
 * const fileTree = new Tree()
 *   .root('my-project/')
 *   .child(
 *     new Tree().root('src/')
 *       .child('index.ts')
 *       .child('components/')
 *       .child(
 *         new Tree()
 *           .child('Button.tsx')
 *           .child('Modal.tsx')
 *       ),
 *     new Tree().root('tests/')
 *       .child('index.test.ts')
 *       .child('components.test.ts'),
 *     'package.json',
 *     'README.md'
 *   );
 * ```
 *
 * @example Organization Chart
 * ```typescript
 * const orgChart = new Tree()
 *   .root('CEO')
 *   .enumerator(DefaultEnumerator)
 *   .child(
 *     new Tree().root('CTO')
 *       .child('Senior Engineer')
 *       .child('Junior Engineer'),
 *     new Tree().root('CFO')
 *       .child('Accountant')
 *       .child('Analyst'),
 *     new Tree().root('CMO')
 *       .child('Content Manager')
 *       .child('Social Media Manager')
 *   );
 * ```
 *
 * @example Status Dashboard
 * ```typescript
 * const statusTree = new Tree()
 *   .root('System Health')
 *   .itemStyleFunc((children, index) => {
 *     const item = children.at(index);
 *     const text = item?.value() || '';
 *
 *     if (text.includes('✓')) return new Style().foreground('green');
 *     if (text.includes('⚠')) return new Style().foreground('yellow');
 *     if (text.includes('✗')) return new Style().foreground('red');
 *     return new Style();
 *   })
 *   .child(
 *     '✓ Database: Connected',
 *     '✓ Cache: Active',
 *     '⚠ Memory: 85% used',
 *     '✗ Disk: Full'
 *   );
 * ```
 */
export declare class Tree implements Node {
    private _value;
    private _hidden;
    private _children;
    private _offset;
    private _renderer;
    constructor();
    /**
     * Get the value of this tree node
     */
    value(): string;
    /**
     * Set the value of this tree node
     */
    setValue(value: any): void;
    /**
     * Get hidden status
     */
    hidden(): boolean;
    /**
     * Set hidden status
     */
    setHidden(hidden: boolean): void;
    /**
     * Hide this tree (chainable)
     */
    hide(hide: boolean): Tree;
    /**
     * Set offset for child display
     */
    offset(start: number, end: number): Tree;
    /**
     * Get children with offset applied
     */
    children(): Children;
    /**
     * String representation
     */
    toString(): string;
    /**
     * Add children to this tree
     */
    child(...children: any[]): Tree;
    /**
     * Set the root value
     */
    root(value: any): Tree;
    /**
     * Set enumerator style
     */
    enumeratorStyle(style: Style): Tree;
    /**
     * Set enumerator style function
     */
    enumeratorStyleFunc(func: StyleFunc | null): Tree;
    /**
     * Set root style
     */
    rootStyle(style: Style): Tree;
    /**
     * Set item style
     */
    itemStyle(style: Style): Tree;
    /**
     * Set item style function
     */
    itemStyleFunc(func: StyleFunc | null): Tree;
    /**
     * Set enumerator
     */
    enumerator(enumerator: Enumerator): Tree;
    /**
     * Set indenter
     */
    indenter(indenter: Indenter): Tree;
    /**
     * Get the renderer (for internal use)
     */
    getRenderer(): TreeRenderer | null;
    /**
     * Ensure renderer is initialized
     */
    private ensureRenderer;
    /**
     * Handle parent assignment for trees without roots
     */
    private ensureParent;
    /**
     * Type guard for Node
     */
    private isNode;
    /**
     * Type guard for Children
     */
    private isChildren;
}
/**
 * Create a new Tree instance with default configuration.
 *
 * This factory function provides the standard way to create Tree instances
 * with sensible defaults. The returned tree can be immediately configured
 * using the fluent API.
 *
 * @returns A new Tree instance ready for configuration
 *
 * @example Empty Tree
 * ```typescript
 * const tree = newTree()
 *   .child('Child 1')
 *   .child('Child 2')
 *   .child('Child 3');
 * ```
 *
 * @example Nested Structure
 * ```typescript
 * const tree = newTree()
 *   .child(
 *     newTree().root('Parent 1')
 *       .child('Child 1.1')
 *       .child('Child 1.2'),
 *     newTree().root('Parent 2')
 *       .child('Child 2.1')
 *   );
 * ```
 */
export declare function newTree(): Tree;
/**
 * Create a new Tree instance with a root value.
 *
 * This convenience function creates a tree and immediately sets its root value.
 * It's equivalent to calling `newTree().root(value)` but more concise for
 * trees that have a meaningful root.
 *
 * @param root - The root value for the tree
 * @returns A new Tree instance with the specified root value
 *
 * @example File System Tree
 * ```typescript
 * const projectTree = rootTree('my-project/')
 *   .child(
 *     rootTree('src/')
 *       .child('index.ts')
 *       .child('components.ts'),
 *     rootTree('docs/')
 *       .child('README.md'),
 *     'package.json'
 *   );
 * ```
 *
 * @example Organization Structure
 * ```typescript
 * const company = rootTree('Acme Corp')
 *   .child(
 *     rootTree('Engineering')
 *       .child('Alice (Senior Dev)')
 *       .child('Bob (Junior Dev)'),
 *     rootTree('Marketing')
 *       .child('Carol (Manager)')
 *       .child('Dave (Designer)')
 *   );
 * ```
 */
export declare function rootTree(root: any): Tree;
//# sourceMappingURL=tree.d.ts.map