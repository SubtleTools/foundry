/**
 * Whitespace renderer for Lipgloss
 * Port of whitespace.go from Go Lipgloss
 */
import type { Renderer } from './renderer';
import { Style } from '@tsports/termenv';
/**
 * Whitespace renderer
 */
export declare class Whitespace {
    private renderer;
    private style;
    private chars;
    constructor(renderer: Renderer, opts?: WhitespaceOption[]);
    /**
     * Render whitespaces with specified width
     */
    render(width: number): string;
    setChars(chars: string): void;
    setStyle(style: Style): void;
}
/**
 * WhitespaceOption configures whitespace rendering
 */
export type WhitespaceOption = (w: Whitespace) => void;
/**
 * WithWhitespaceRenderer sets a custom renderer for whitespace
 */
export declare function WithWhitespaceRenderer(r: Renderer): WhitespaceOption;
/**
 * WithWhitespaceChars sets the characters to use for whitespace
 */
export declare function WithWhitespaceChars(chars: string): WhitespaceOption;
/**
 * WithWhitespaceForeground sets the foreground color for whitespace
 */
export declare function WithWhitespaceForeground(color: import('./types').ColorValue): WhitespaceOption;
/**
 * WithWhitespaceBackground sets the background color for whitespace
 */
export declare function WithWhitespaceBackground(color: import('./types').ColorValue): WhitespaceOption;
/**
 * Create a new whitespace renderer
 */
export declare function newWhitespace(r: Renderer, ...opts: WhitespaceOption[]): Whitespace;
//# sourceMappingURL=whitespace.d.ts.map