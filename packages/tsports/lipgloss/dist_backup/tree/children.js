/**
 * Children implementation for managing tree nodes
 */
/**
 * NodeChildren implements the Children interface with an array of nodes
 */
export class NodeChildren {
    constructor(nodes = []) {
        this.nodes = [...nodes];
    }
    /**
     * Get the child at the given index
     */
    at(index) {
        if (index >= 0 && index < this.nodes.length) {
            return this.nodes[index];
        }
        return null;
    }
    /**
     * Get the number of children
     */
    length() {
        return this.nodes.length;
    }
    /**
     * Append a child to the list
     */
    append(child) {
        const newNodes = [...this.nodes, child];
        return new NodeChildren(newNodes);
    }
    /**
     * Remove a child at the given index
     */
    remove(index) {
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
    getNodes() {
        return [...this.nodes];
    }
}
/**
 * Create NodeChildren from strings
 */
export function newStringData(...data) {
    const nodes = data.map((d) => new Leaf(d));
    return new NodeChildren(nodes);
}
/**
 * Leaf node implementation - a node without children
 */
export class Leaf {
    constructor(value = '', hidden = false) {
        this._value = '';
        this._hidden = hidden;
        this.setValue(value);
    }
    /**
     * Get the value of this leaf
     */
    value() {
        return this._value;
    }
    /**
     * Set the value of this leaf
     */
    setValue(value) {
        if (value === null || value === undefined) {
            this._value = '';
        }
        else if (typeof value === 'string') {
            this._value = value;
        }
        else if (typeof value === 'object' && 'toString' in value) {
            this._value = value.toString();
        }
        else {
            this._value = String(value);
        }
    }
    /**
     * Leaf nodes always have empty children
     */
    children() {
        return new NodeChildren();
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
     * String representation
     */
    toString() {
        return this.value();
    }
}
//# sourceMappingURL=children.js.map