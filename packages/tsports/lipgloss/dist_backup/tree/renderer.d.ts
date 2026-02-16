/**
 * Tree renderer implementation
 * TypeScript port of Lipgloss tree package
 */
import { type Enumerator, type Indenter, type Node, type TreeStyle } from './types';
/**
 * Creates a new renderer with default settings
 */
export declare function createRenderer(): TreeRenderer;
/**
 * TreeRenderer is responsible for actually rendering the tree.
 */
export declare class TreeRenderer {
    style: TreeStyle;
    enumerator: Enumerator;
    indenter: Indenter;
    constructor(options: {
        style: TreeStyle;
        enumerator: Enumerator;
        indenter: Indenter;
    });
    /**
     * Type guard to check if a node is a Tree instance with getRenderer method
     */
    private isTreeInstance;
    /**
     * render is responsible for actually rendering the tree.
     */
    render(node: Node, root: boolean, prefix: string): string;
}
//# sourceMappingURL=renderer.d.ts.map