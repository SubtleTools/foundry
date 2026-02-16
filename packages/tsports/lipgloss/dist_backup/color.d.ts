/**
 * Color types and implementations matching Go Lipgloss exactly
 */
import type { Color as TermenvColor } from '@tsports/termenv';
import type { Renderer } from './renderer.js';
/**
 * TerminalColor interface - matches Go's interface exactly
 */
export interface TerminalColor {
    color(renderer: Renderer): TermenvColor;
    RGBA(): [number, number, number, number];
}
/**
 * NoColor represents the absence of color styling
 * Matches Go's NoColor{} struct exactly
 */
export declare class NoColor implements TerminalColor {
    color(renderer: Renderer): TermenvColor;
    RGBA(): [number, number, number, number];
}
/**
 * Color represents a color by hex or ANSI value
 * Matches Go's Color string type exactly
 */
export declare class ColorClass implements TerminalColor {
    private value;
    constructor(value: string);
    color(renderer: Renderer): TermenvColor;
    RGBA(): [number, number, number, number];
    toString(): string;
}
/**
 * ANSIColor represents an ANSI color value
 * Matches Go's ANSIColor uint type exactly
 */
export declare class ANSIColorClass implements TerminalColor {
    private value;
    constructor(value: number);
    color(renderer: Renderer): TermenvColor;
    RGBA(): [number, number, number, number];
    toString(): string;
    valueOf(): number;
}
/**
 * AdaptiveColor provides different colors for light and dark backgrounds
 * Matches Go's AdaptiveColor struct exactly
 */
export declare class AdaptiveColor implements TerminalColor {
    readonly light: string;
    readonly dark: string;
    constructor(light: string, dark: string);
    color(renderer: Renderer): TermenvColor;
    RGBA(): [number, number, number, number];
}
/**
 * CompleteColor specifies exact values for different color profiles
 * Matches Go's CompleteColor struct exactly
 */
export declare class CompleteColor implements TerminalColor {
    readonly trueColor: string;
    readonly ansi256: string;
    readonly ansi: string;
    constructor(trueColor: string, ansi256: string, ansi: string);
    color(renderer: Renderer): TermenvColor;
    RGBA(): [number, number, number, number];
}
/**
 * CompleteAdaptiveColor combines CompleteColor with AdaptiveColor
 * Matches Go's CompleteAdaptiveColor struct exactly
 */
export declare class CompleteAdaptiveColor implements TerminalColor {
    readonly light: CompleteColor;
    readonly dark: CompleteColor;
    constructor(light: CompleteColor, dark: CompleteColor);
    color(renderer: Renderer): TermenvColor;
    RGBA(): [number, number, number, number];
}
export declare const noColor: NoColor;
export declare function NewColor(value: string): ColorClass;
export declare function NewANSIColor(value: number): ANSIColorClass;
export declare function NewAdaptiveColor(light: string, dark: string): AdaptiveColor;
export declare function NewCompleteColor(trueColor: string, ansi256: string, ansi: string): CompleteColor;
export declare function NewCompleteAdaptiveColor(light: CompleteColor, dark: CompleteColor): CompleteAdaptiveColor;
export declare function Color(value: string): ColorClass | string;
export declare function ANSIColor(value: number): ANSIColorClass;
//# sourceMappingURL=color.d.ts.map