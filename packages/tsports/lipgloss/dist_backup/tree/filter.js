/**
 * Filter implementation for tree filtering
 * TypeScript port of Lipgloss tree package
 */
/**
 * Filter applies a filter on some data. You could use this to create a new
 * tree whose values all satisfy the condition provided in the Filter() function.
 */
export class Filter {
    constructor(data) {
        this.data = data;
    }
    /**
     * Returns the item at the given index.
     * The index is relative to the filtered results.
     */
    at(index) {
        let j = 0;
        for (let i = 0; i < this.data.length(); i++) {
            if (!this.filterFunc || this.filterFunc(i)) {
                if (j === index) {
                    return this.data.at(i);
                }
                j++;
            }
        }
        return null;
    }
    /**
     * Filter uses a filter function to set a condition that all the data must satisfy to be in the Tree.
     */
    filter(f) {
        this.filterFunc = f;
        return this;
    }
    /**
     * Returns the number of children in the tree.
     */
    length() {
        if (!this.filterFunc) {
            return this.data.length();
        }
        let j = 0;
        for (let i = 0; i < this.data.length(); i++) {
            if (this.filterFunc(i)) {
                j++;
            }
        }
        return j;
    }
}
/**
 * NewFilter initializes a new Filter.
 */
export function createFilter(data) {
    return new Filter(data);
}
//# sourceMappingURL=filter.js.map