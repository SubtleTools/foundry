/**
 * Children implementation for managing tree nodes
 */
import type { Children, Node } from './types';
/**
 * NodeChildren implements the Children interface with an array of nodes
 */
export declare class NodeChildren implements Children {
    private nodes;
    constructor(nodes?: Node[]);
    /**
     * Get the child at the given index
     */
    at(index: number): Node | null;
    /**
     * Get the number of children
     */
    length(): number;
    /**
     * Append a child to the list
     */
    append(child: Node): NodeChildren;
    /**
     * Remove a child at the given index
     */
    remove(index: number): NodeChildren;
    /**
     * Get all nodes as array (for internal use)
     */
    getNodes(): Node[];
}
/**
 * Create NodeChildren from strings
 */
export declare function newStringData(...data: string[]): Children;
/**
 * Leaf node implementation - a node without children
 */
export declare class Leaf implements Node {
    private _value;
    private _hidden;
    constructor(value?: any, hidden?: boolean);
    /**
     * Get the value of this leaf
     */
    value(): string;
    /**
     * Set the value of this leaf
     */
    setValue(value: any): void;
    /**
     * Leaf nodes always have empty children
     */
    children(): Children;
    /**
     * Get hidden status
     */
    hidden(): boolean;
    /**
     * Set hidden status
     */
    setHidden(hidden: boolean): void;
    /**
     * String representation
     */
    toString(): string;
}
//# sourceMappingURL=children.d.ts.map