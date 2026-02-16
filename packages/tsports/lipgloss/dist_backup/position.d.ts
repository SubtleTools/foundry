/**
 * Position and placement functions for Lipgloss
 * Port of position.go from Go Lipgloss
 */
import { type WhitespaceOption } from './whitespace';
import type { Renderer } from './renderer';
import type { LipglossPosition } from './position-types';
/**
 * Place places a string or text block vertically in an unstyled box of a given
 * width or height.
 */
export declare function Place(width: number, height: number, hPos: LipglossPosition, vPos: LipglossPosition, str: string, ...opts: WhitespaceOption[]): string;
/**
 * PlaceHorizontal places a string or text block horizontally in an unstyled
 * block of a given width. If the given width is shorter than the max width of
 * the string (measured by its longest line) this will be a noop.
 */
export declare function PlaceHorizontal(width: number, pos: LipglossPosition, str: string, ...opts: WhitespaceOption[]): string;
/**
 * PlaceVertical places a string or text block vertically in an unstyled block
 * of a given height. If the given height is shorter than the height of the
 * string (measured by its newlines) then this will be a noop.
 */
export declare function PlaceVertical(height: number, pos: LipglossPosition, str: string, ...opts: WhitespaceOption[]): string;
export declare function setDefaultRenderer(renderer: Renderer): void;
/**
 * Renderer methods for positioning
 */
declare module './renderer' {
    interface Renderer {
        Place(width: number, height: number, hPos: LipglossPosition, vPos: LipglossPosition, str: string, ...opts: WhitespaceOption[]): string;
        PlaceHorizontal(width: number, pos: LipglossPosition, str: string, ...opts: WhitespaceOption[]): string;
        PlaceVertical(height: number, pos: LipglossPosition, str: string, ...opts: WhitespaceOption[]): string;
    }
}
/**
 * Add positioning methods to Renderer prototype
 */
export declare function addPositionMethods(): void;
//# sourceMappingURL=position.d.ts.map