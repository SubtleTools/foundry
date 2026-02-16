/**
 * Filter implementation for tree filtering
 * TypeScript port of Lipgloss tree package
 */
import type { Children, FilterFunc, Node } from './types';
/**
 * Filter applies a filter on some data. You could use this to create a new
 * tree whose values all satisfy the condition provided in the Filter() function.
 */
export declare class Filter implements Children {
    private data;
    private filterFunc?;
    constructor(data: Children);
    /**
     * Returns the item at the given index.
     * The index is relative to the filtered results.
     */
    at(index: number): Node | null;
    /**
     * Filter uses a filter function to set a condition that all the data must satisfy to be in the Tree.
     */
    filter(f: FilterFunc): Filter;
    /**
     * Returns the number of children in the tree.
     */
    length(): number;
}
/**
 * NewFilter initializes a new Filter.
 */
export declare function createFilter(data: Children): Filter;
//# sourceMappingURL=filter.d.ts.map