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
import { Leaf, NodeChildren } from './children';
import { createRenderer } from './renderer';
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
export class Tree {
    constructor() {
        this._value = '';
        this._hidden = false;
        this._children = new NodeChildren();
        this._offset = [0, 0];
        this._renderer = null;
    }
    /**
     * Get the value of this tree node
     */
    value() {
        return this._value;
    }
    /**
     * Set the value of this tree node
     */
    setValue(value) {
        if (value instanceof Tree) {
            this._value = value.value();
            this._children = value._children;
        }
        else if (typeof value === 'object' && value !== null && 'toString' in value) {
            this._value = value.toString();
        }
        else if (typeof value === 'string' || value === null || value === undefined) {
            this._value = value || '';
        }
        else {
            this._value = String(value);
        }
    }
    /**
     * Get hidden status
     */
    hidden() {
        return this._hidden;
    }
    /**
     * Set hidden status
     */
    setHidden(hidden) {
        this._hidden = hidden;
    }
    /**
     * Hide this tree (chainable)
     */
    hide(hide) {
        this._hidden = hide;
        return this;
    }
    /**
     * Set offset for child display
     */
    offset(start, end) {
        if (start > end) {
            [start, end] = [end, start];
        }
        if (start < 0) {
            start = 0;
        }
        if (end < 0 || end > this._children.length()) {
            end = this._children.length();
        }
        this._offset[0] = start;
        this._offset[1] = end;
        return this;
    }
    /**
     * Get children with offset applied
     */
    children() {
        const nodes = [];
        const totalLength = this._children.length();
        const start = this._offset[0];
        const endOffset = this._offset[1];
        // If no offset is set, return all children
        if (start === 0 && endOffset === 0) {
            return this._children;
        }
        // Go implementation: for i := t.offset[0]; i < t.children.Length()-t.offset[1]; i++
        const end = totalLength - endOffset;
        for (let i = start; i < end; i++) {
            const node = this._children.at(i);
            if (node) {
                nodes.push(node);
            }
        }
        return new NodeChildren(nodes);
    }
    /**
     * String representation
     */
    toString() {
        return this.ensureRenderer().render(this, true, '');
    }
    /**
     * Add children to this tree
     */
    child(...children) {
        for (const child of children) {
            if (child instanceof Tree) {
                const newItem = this.ensureParent(child);
                this._children = this._children.append(newItem);
            }
            else if (this.isNode(child)) {
                this._children = this._children.append(child);
            }
            else if (this.isChildren(child)) {
                for (let i = 0; i < child.length(); i++) {
                    const node = child.at(i);
                    if (node) {
                        this._children = this._children.append(node);
                    }
                }
            }
            else if (Array.isArray(child)) {
                return this.child(...child);
            }
            else if (child !== null && child !== undefined) {
                const leaf = new Leaf(child);
                this._children = this._children.append(leaf);
            }
        }
        return this;
    }
    /**
     * Set the root value
     */
    root(value) {
        this.setValue(value);
        return this;
    }
    /**
     * Set enumerator style
     */
    enumeratorStyle(style) {
        this.ensureRenderer().style.enumeratorFunc = () => style;
        return this;
    }
    /**
     * Set enumerator style function
     */
    enumeratorStyleFunc(func) {
        const styleFunc = func || (() => new Style());
        this.ensureRenderer().style.enumeratorFunc = styleFunc;
        return this;
    }
    /**
     * Set root style
     */
    rootStyle(style) {
        this.ensureRenderer().style.root = style;
        return this;
    }
    /**
     * Set item style
     */
    itemStyle(style) {
        this.ensureRenderer().style.itemFunc = () => style;
        return this;
    }
    /**
     * Set item style function
     */
    itemStyleFunc(func) {
        const styleFunc = func || (() => new Style());
        this.ensureRenderer().style.itemFunc = styleFunc;
        return this;
    }
    /**
     * Set enumerator
     */
    enumerator(enumerator) {
        this.ensureRenderer().enumerator = enumerator;
        return this;
    }
    /**
     * Set indenter
     */
    indenter(indenter) {
        this.ensureRenderer().indenter = indenter;
        return this;
    }
    /**
     * Get the renderer (for internal use)
     */
    getRenderer() {
        return this._renderer;
    }
    /**
     * Ensure renderer is initialized
     */
    ensureRenderer() {
        if (!this._renderer) {
            this._renderer = createRenderer();
        }
        return this._renderer;
    }
    /**
     * Handle parent assignment for trees without roots
     */
    ensureParent(item) {
        if (item.value() !== '' || this._children.length() === 0) {
            return item;
        }
        const lastIndex = this._children.length() - 1;
        const parent = this._children.at(lastIndex);
        if (parent instanceof Tree) {
            // Add item's children to parent
            for (let i = 0; i < item._children.length(); i++) {
                const child = item._children.at(i);
                if (child) {
                    parent.child(child);
                }
            }
            // Remove the original parent and return it
            this._children = this._children.remove(lastIndex);
            return parent;
        }
        else if (parent instanceof Leaf) {
            // Convert leaf to tree and add children
            item.setValue(parent.value());
            this._children = this._children.remove(lastIndex);
            return item;
        }
        return item;
    }
    /**
     * Type guard for Node
     */
    isNode(value) {
        return (value &&
            typeof value === 'object' &&
            'value' in value &&
            'children' in value &&
            'hidden' in value &&
            'setHidden' in value &&
            'setValue' in value);
    }
    /**
     * Type guard for Children
     */
    isChildren(value) {
        return (value &&
            typeof value === 'object' &&
            'at' in value &&
            'length' in value &&
            typeof value.at === 'function' &&
            typeof value.length === 'function');
    }
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
export function newTree() {
    return new Tree();
}
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
export function rootTree(root) {
    return newTree().root(root);
}
//# sourceMappingURL=tree.js.map