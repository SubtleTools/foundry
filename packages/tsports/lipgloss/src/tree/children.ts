/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Children implementation for managing tree nodes
 */

import type { Children, Node } from './types';

/**
 * NodeChildren implements the Children interface with an array of nodes
 */
export class NodeChildren implements Children {
  private nodes: Node[];

  constructor(nodes: Node[] = []) {
    this.nodes = [...nodes];
  }

  /**
   * Get the child at the given index
   */
  at(index: number): Node | null {
    if (index >= 0 && index < this.nodes.length) {
      return this.nodes[index]!;
    }
    return null;
  }

  /**
   * Get the number of children
   */
  length(): number {
    return this.nodes.length;
  }

  /**
   * Append a child to the list
   */
  append(child: Node): NodeChildren {
    const newNodes = [...this.nodes, child];
    return new NodeChildren(newNodes);
  }

  /**
   * Remove a child at the given index
   */
  remove(index: number): NodeChildren {
    if (index < 0 || index >= this.nodes.length) {
      return this;
    }
    const newNodes = [...this.nodes];
    newNodes.splice(index, 1);
    return new NodeChildren(newNodes);
  }

  /**
   * Get all nodes as array (for internal use)
   */
  getNodes(): Node[] {
    return [...this.nodes];
  }
}

/**
 * Create NodeChildren from strings
 */
export function newStringData(...data: string[]): Children {
  const nodes = data.map((d) => new Leaf(d));
  return new NodeChildren(nodes);
}

/**
 * Leaf node implementation - a node without children
 */
export class Leaf implements Node {
  private _value: string;
  private _hidden: boolean;

  constructor(value: any = '', hidden: boolean = false) {
    this._value = '';
    this._hidden = hidden;
    this.setValue(value);
  }

  /**
   * Get the value of this leaf
   */
  value(): string {
    return this._value;
  }

  /**
   * Set the value of this leaf
   */
  setValue(value: any): void {
    if (value === null || value === undefined) {
      this._value = '';
    } else if (typeof value === 'string') {
      this._value = value;
    } else if (typeof value === 'object' && 'toString' in value) {
      this._value = value.toString();
    } else {
      this._value = String(value);
    }
  }

  /**
   * Leaf nodes always have empty children
   */
  children(): Children {
    return new NodeChildren();
  }

  /**
   * Get hidden status
   */
  hidden(): boolean {
    return this._hidden;
  }

  /**
   * Set hidden status
   */
  setHidden(hidden: boolean): void {
    this._hidden = hidden;
  }

  /**
   * String representation
   */
  toString(): string {
    return this.value();
  }
}
