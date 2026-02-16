/**
 * Tree Component System
 *
 * A comprehensive hierarchical data display system for terminal output with support
 * for nested structures, custom styling, flexible enumerators, and sophisticated
 * rendering algorithms. Perfect for file trees, organization charts, status displays,
 * and any hierarchical data visualization.
 *
 * ## System Architecture
 *
 * The tree system is built on a modular, composable architecture:
 *
 * - **Node Interface**: Abstract interface for all tree elements
 * - **Tree Class**: Main implementation with full feature set
 * - **Leaf Class**: Simple node implementation for terminal nodes
 * - **Renderer System**: Pluggable rendering with customizable algorithms
 * - **Enumerator System**: Flexible prefix generation (branches, bullets, etc.)
 * - **Style Integration**: Full Style component support for rich formatting
 *
 * ## Key Features
 *
 * ### Core Functionality
 * - **Unlimited Nesting**: Support for arbitrarily deep hierarchies
 * - **Mixed Content**: Combine strings, trees, and custom objects seamlessly
 * - **Flexible Rendering**: Customizable enumerators and indentation strategies
 * - **Style System**: Per-node styling with conditional logic support
 * - **Filtering**: Show/hide nodes with filtering capabilities
 * - **Offset Support**: Partial rendering for pagination or scrolling
 *
 * ### Advanced Features
 * - **Custom Enumerators**: Tree branches, bullets, numbers, or custom symbols
 * - **Multi-line Support**: Proper handling of multi-line content with alignment
 * - **Performance Optimization**: Efficient rendering even for large trees
 * - **Responsive Design**: Automatic adaptation to terminal constraints
 *
 * ## Quick Start
 *
 * ```typescript
 * import { newTree, rootTree } from '@lipgloss/tree';
 *
 * // Simple file tree
 * const fileTree = rootTree('project/')
 *   .child(
 *     rootTree('src/')
 *       .child('index.ts')
 *       .child('utils.ts'),
 *     rootTree('docs/')
 *       .child('README.md'),
 *     'package.json'
 *   );
 *
 * console.log(fileTree.toString());
 * ```
 *
 * ## Advanced Examples
 *
 * ### Custom Enumerators
 * ```typescript
 * import { newTree, DefaultEnumerator, RoundedEnumerator } from '@lipgloss/tree';
 *
 * // Tree with custom branching style
 * const tree = newTree()
 *   .enumerator(RoundedEnumerator)
 *   .child('Item 1', 'Item 2', 'Item 3');
 *
 * // Custom enumerator
 * const customEnum: Enumerator = (children, index) => {
 *   return index === children.length() - 1 ? '└─ ' : '├─ ';
 * };
 *
 * const customTree = newTree()
 *   .enumerator(customEnum)
 *   .child('First', 'Second', 'Last');
 * ```
 *
 * ### Styled Trees
 * ```typescript
 * import { newTree, Style } from '@lipgloss/tree';
 *
 * const statusTree = newTree()
 *   .root('System Status')
 *   .rootStyle(new Style().bold(true).foreground('blue'))
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
 *     '⚠ Memory: High usage',
 *     '✗ Disk: Full'
 *   );
 * ```
 *
 * ### Organization Charts
 * ```typescript
 * const orgChart = rootTree('CEO')
 *   .enumeratorStyle(new Style().foreground('gray'))
 *   .child(
 *     rootTree('Engineering')
 *       .child('Alice (Senior Dev)')
 *       .child('Bob (Junior Dev)')
 *       .child('Charlie (DevOps)'),
 *     rootTree('Marketing')
 *       .child('Diana (Manager)')
 *       .child('Eve (Designer)'),
 *     rootTree('Sales')
 *       .child('Frank (Director)')
 *       .child('Grace (Rep)')
 *   );
 * ```
 *
 * ### Large Trees with Filtering
 * ```typescript
 * import { Filter, createFilter } from '@lipgloss/tree';
 *
 * // Create a large dataset
 * const data = new NodeChildren([
 *   new Leaf('Important item'),
 *   new Leaf('Regular item'),
 *   new Leaf('Important data'),
 *   new Leaf('Normal entry')
 * ]);
 *
 * // Filter to show only important items
 * const filtered = createFilter(data)
 *   .filter(index => {
 *     const item = data.at(index);
 *     return item?.value().includes('Important') || false;
 *   });
 *
 * const tree = newTree()
 *   .root('Filtered Results')
 *   .child(filtered);
 * ```
 *
 * ### Progressive Tree Building
 * ```typescript
 * // Build tree dynamically
 * const dynamicTree = newTree().root('Project Structure');
 *
 * // Add source files
 * const srcTree = newTree().root('src/');
 * files.forEach(file => srcTree.child(file.name));
 * dynamicTree.child(srcTree);
 *
 * // Add documentation
 * const docsTree = newTree().root('docs/');
 * docs.forEach(doc => docsTree.child(doc.title));
 * dynamicTree.child(docsTree);
 *
 * // Add configuration files
 * configFiles.forEach(config => dynamicTree.child(config.name));
 * ```
 *
 * ## Built-in Components
 *
 * ### Enumerators
 * - **DefaultEnumerator**: Standard tree branches (├── and └──)
 * - **RoundedEnumerator**: Rounded tree branches (├── and ╰──)
 * - **Custom**: Implement your own Enumerator function
 *
 * ### Node Types
 * - **Tree**: Full-featured hierarchical node with children
 * - **Leaf**: Simple terminal node for content display
 * - **NodeChildren**: Container for managing child collections
 * - **Filter**: Non-destructive filtering of node collections
 *
 * ### Rendering
 * - **TreeRenderer**: Advanced rendering engine with layout algorithms
 * - **Custom Renderers**: Implement your own rendering strategies
 *
 * ## Performance Considerations
 *
 * - **Large Trees**: Use filtering for trees with > 1000 nodes
 * - **Deep Nesting**: Consider flattening very deep hierarchies (> 20 levels)
 * - **Style Functions**: Keep conditional styling logic simple and fast
 * - **Multi-line Content**: Can impact performance with very long content
 *
 * ## Type Definitions
 *
 * All components provide comprehensive TypeScript support:
 *
 * - **Node**: Interface for all tree elements
 * - **Children**: Collection interface for child nodes
 * - **Enumerator**: Function for generating node prefixes
 * - **Indenter**: Function for controlling nested indentation
 * - **StyleFunc**: Function for conditional node styling
 * - **TreeStyle**: Configuration for tree-wide styling
 */
// Node implementations (from existing children.ts)
export { Leaf, NodeChildren, newStringData as createStringChildren, } from './children';
// Enumerators and indenters
export { DefaultEnumerator, DefaultIndenter, RoundedEnumerator, } from './enumerator';
// Filter implementation
export { createFilter, Filter } from './filter';
// Renderer
export { createRenderer, TreeRenderer } from './renderer';
// Tree class and factory functions
export { newTree as createTree, newTree, rootTree as createRoot, rootTree, Tree, } from './tree';
// Filter creation is available through the exported Filter class or createFilter function:
// const filter = new Filter(data);
// const filter = createFilter(data);
//# sourceMappingURL=index.js.map