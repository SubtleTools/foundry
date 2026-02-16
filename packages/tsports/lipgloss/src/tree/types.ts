/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Tree component types and interfaces
 * TypeScript port of Lipgloss tree package
 */

import type { Style } from '../style';

/**
 * Node defines a node in a tree.
 */
export interface Node {
  /** Returns the string value of the node */
  value(): string;

  /** Returns the children of the node */
  children(): Children;

  /** Returns whether the node is hidden */
  hidden(): boolean;

  /** Sets the hidden state of the node */
  setHidden(hidden: boolean): void;

  /** Sets the value of the node */
  setValue(value: any): void;

  /** Returns the string representation of the node */
  toString(): string;
}

/**
 * Children is the interface that wraps the basic methods of a tree model.
 */
export interface Children {
  /** Returns the content item of the given index */
  at(index: number): Node | null;

  /** Returns the number of children in the tree */
  length(): number;
}

/**
 * Enumerator enumerates a tree. Typically, this is used to draw the branches
 * for the tree nodes and is different for the last child.
 */
export type Enumerator = (children: Children, index: number) => string;

/**
 * Indenter indents the children of a tree.
 *
 * Indenters allow for displaying nested tree items with connecting borders
 * to sibling nodes.
 */
export type Indenter = (children: Children, index: number) => string;

/**
 * StyleFunc allows the tree to be styled per item.
 */
export type StyleFunc = (children: Children, index: number) => Style;

/**
 * Style is the styling applied to the tree.
 */
export interface TreeStyle {
  /** Function to style enumerators */
  enumeratorFunc: StyleFunc;

  /** Function to style items */
  itemFunc: StyleFunc;

  /** Style for the root element */
  root: Style;
}

/**
 * Filter function type for filtering tree nodes
 */
export type FilterFunc = (index: number) => boolean;
