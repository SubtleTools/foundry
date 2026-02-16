/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Tree renderer implementation
 * TypeScript port of Lipgloss tree package
 */

import { JoinHorizontal, JoinVertical, Left, Top } from '../join';
import { getTextWidth, getMaxTextWidth } from '../layout';
import { Style } from '../style';
import { NodeChildren } from './children';
import { DefaultEnumerator, DefaultIndenter } from './enumerator';
import {
  type Children,
  type Enumerator,
  type Indenter,
  type Node,
  StyleFunc,
  type TreeStyle,
} from './types';

/**
 * Creates a new renderer with default settings
 */
export function createRenderer(): TreeRenderer {
  return new TreeRenderer({
    style: {
      enumeratorFunc: (children: Children, index: number): Style => new Style().paddingRight(1),
      itemFunc: (children: Children, index: number): Style => new Style(),
      root: new Style(),
    },
    enumerator: DefaultEnumerator,
    indenter: DefaultIndenter,
  });
}

/**
 * TreeRenderer is responsible for actually rendering the tree.
 */
export class TreeRenderer {
  public style: TreeStyle;
  public enumerator: Enumerator;
  public indenter: Indenter;

  constructor(options: {
    style: TreeStyle;
    enumerator: Enumerator;
    indenter: Indenter;
  }) {
    this.style = options.style;
    this.enumerator = options.enumerator;
    this.indenter = options.indenter;
  }

  /**
   * Type guard to check if a node is a Tree instance with getRenderer method
   */
  private isTreeInstance(node: Node): node is Node & { getRenderer(): TreeRenderer | null } {
    return (
      node &&
      typeof node === 'object' &&
      'getRenderer' in node &&
      typeof (node as any).getRenderer === 'function'
    );
  }

  /**
   * render is responsible for actually rendering the tree.
   */
  render(node: Node, root: boolean, prefix: string): string {
    if (node.hidden()) {
      return '';
    }

    const strs: string[] = [];
    let maxLen = 0;
    let children = node.children();
    const enumerator = this.enumerator;
    const indenter = this.indenter;

    // Print the root node name if it's not empty.
    if (node.value() !== '' && root) {
      strs.push(this.style.root.render(node.value()));
    }

    // First pass: calculate maximum prefix length and remove hidden trailing children
    for (let i = 0; i < children.length(); i++) {
      if (i < children.length() - 1) {
        const child = children.at(i + 1);
        if (child && child.hidden()) {
          // Don't count the last child if it's hidden. This renders the
          // last visible element with the right prefix
          if (children instanceof NodeChildren) {
            children = children.remove(i + 1);
            i--; // Adjust index since we removed an element
          }
        }
      }
      const enumPrefix = enumerator(children, i);
      const styledPrefix = this.style.enumeratorFunc(children, i).render(enumPrefix);
      maxLen = Math.max(getMaxTextWidth(styledPrefix), maxLen);
    }

    // Second pass: render all children
    for (let i = 0; i < children.length(); i++) {
      const child = children.at(i);
      if (!child || child.hidden()) {
        continue;
      }

      const indent = indenter(children, i);
      let nodePrefix = enumerator(children, i);
      const enumStyle = this.style.enumeratorFunc(children, i);
      const itemStyle = this.style.itemFunc(children, i);

      nodePrefix = enumStyle.render(nodePrefix);

      // Right-align the prefix to ensure consistent spacing
      const prefixWidth = getMaxTextWidth(nodePrefix);
      if (maxLen > prefixWidth) {
        nodePrefix = ' '.repeat(maxLen - prefixWidth) + nodePrefix;
      }

      const item = itemStyle.render(child.value());
      let multilinePrefix = prefix;

      // Handle multiline prefixes and items
      // This dance below is to account for multiline prefixes, e.g. "|\n|".
      // In that case, we need to make sure that both the parent prefix and
      // the current node's prefix have the same height.
      const itemHeight = item.split('\n').length;
      let prefixHeight = nodePrefix.split('\n').length;

      // Extend nodePrefix height to match item height
      // Safety check to prevent infinite loops
      let loopCount1 = 0;
      while (itemHeight > prefixHeight && loopCount1 < 100) {
        const oldPrefixHeight = prefixHeight;
        nodePrefix = JoinVertical(Left, nodePrefix, enumStyle.render(indent));
        prefixHeight = nodePrefix.split('\n').length;

        // If JoinVertical didn't increase height, break to prevent infinite loop
        if (prefixHeight <= oldPrefixHeight) {
          break;
        }
        loopCount1++;
      }

      // Extend multilinePrefix height to match nodePrefix height
      const finalPrefixHeight = nodePrefix.split('\n').length;
      let multilinePrefixHeight = multilinePrefix.split('\n').length;

      // Safety check to prevent infinite loops
      let loopCount2 = 0;
      while (finalPrefixHeight > multilinePrefixHeight && loopCount2 < 100) {
        const oldMultilinePrefixHeight = multilinePrefixHeight;
        multilinePrefix = JoinVertical(Left, multilinePrefix, prefix);
        multilinePrefixHeight = multilinePrefix.split('\n').length;

        // If JoinVertical didn't increase height, break to prevent infinite loop
        if (multilinePrefixHeight <= oldMultilinePrefixHeight) {
          break;
        }
        loopCount2++;
      }

      strs.push(JoinHorizontal(Top, multilinePrefix, nodePrefix, item));

      // Recursively render children if they exist
      if (child.children().length() > 0) {
        // Check if the child has a custom renderer, which means the
        // user set a custom enumerator, style, etc.
        // If it has one, we'll use it to render itself.
        // Otherwise, we keep using the current renderer.
        let renderer: TreeRenderer = this;

        // Check for custom renderer if child is a Tree instance
        if (this.isTreeInstance(child)) {
          const customRenderer = child.getRenderer();
          if (customRenderer) {
            renderer = customRenderer;
          }
        }

        const childRender = renderer.render(child, false, prefix + enumStyle.render(indent));

        if (childRender !== '') {
          strs.push(childRender);
        }
      }
    }

    return strs.join('\n');
  }
}
