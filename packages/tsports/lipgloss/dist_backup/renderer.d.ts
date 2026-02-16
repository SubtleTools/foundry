/**
 * Renderer implementation matching Go Lipgloss exactly
 */
import { type Output, type Profile } from '@tsports/termenv';
/**
 * Renderer is a lipgloss terminal renderer - matches Go's Renderer struct exactly
 */
export declare class Renderer {
    private _output;
    private _colorProfile?;
    private _hasDarkBackground?;
    private _getColorProfileOnce;
    private _explicitColorProfile;
    private _getBackgroundColorOnce;
    private _explicitBackgroundColor;
    constructor(output?: Output);
    /**
     * Output returns the termenv output
     */
    output(): Output;
    /**
     * SetOutput sets the termenv output
     */
    setOutput(output: Output): void;
    /**
     * ColorProfile returns the detected termenv color profile
     */
    colorProfile(): Profile;
    /**
     * SetColorProfile sets the color profile on the renderer
     */
    setColorProfile(profile: Profile): void;
    /**
     * HasDarkBackground returns whether the renderer will render to a dark background
     */
    hasDarkBackground(): boolean;
    /**
     * SetHasDarkBackground sets the background color detection value on the renderer
     */
    setHasDarkBackground(isDark: boolean): void;
    /**
     * Render applies styling properties to text and returns the styled result
     */
    /**
     * Create a new style associated with this renderer
     */
    newStyle(): import('./style').Style;
    render(text: string, properties: import('./types').StyleProperties): string;
    /**
     * supportsColor returns whether the renderer supports colors
     */
    supportsColor(): boolean;
    /**
     * Handle FORCE_COLOR environment variable - matches Go implementation exactly
     * NOTE: NO_COLOR takes precedence over FORCE_COLOR according to the NO_COLOR standard
     */
    private getColorProfileWithForceColor;
}
export declare const renderer: Renderer;
/**
 * DefaultRenderer returns the default renderer
 */
export declare function defaultRenderer(): Renderer;
/**
 * SetDefaultRenderer sets the default global renderer
 */
export declare function setDefaultRenderer(r: Renderer): void;
/**
 * NewRenderer creates a new Renderer
 */
export declare function newRenderer(output: Output): Renderer;
/**
 * Convenience functions that use the default renderer - match Go API exactly
 */
export declare function colorProfile(): Profile;
export declare function setColorProfile(profile: Profile): void;
export declare function hasDarkBackground(): boolean;
export declare function setHasDarkBackground(isDark: boolean): void;
//# sourceMappingURL=renderer.d.ts.map