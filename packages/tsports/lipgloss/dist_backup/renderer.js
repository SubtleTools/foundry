/**
 * Renderer implementation matching Go Lipgloss exactly
 */
import { defaultOutputInstance, Profile as TermenvProfile, } from '@tsports/termenv';
/**
 * Renderer is a lipgloss terminal renderer - matches Go's Renderer struct exactly
 */
export class Renderer {
    constructor(output) {
        this._getColorProfileOnce = false;
        this._explicitColorProfile = false;
        this._getBackgroundColorOnce = false;
        this._explicitBackgroundColor = false;
        this._output = output || defaultOutputInstance();
    }
    /**
     * Output returns the termenv output
     */
    output() {
        return this._output;
    }
    /**
     * SetOutput sets the termenv output
     */
    setOutput(output) {
        this._output = output;
    }
    /**
     * ColorProfile returns the detected termenv color profile
     */
    colorProfile() {
        if (!this._explicitColorProfile && !this._getColorProfileOnce) {
            this._getColorProfileOnce = true;
            this._colorProfile = this.getColorProfileWithForceColor();
        }
        return this._colorProfile;
    }
    /**
     * SetColorProfile sets the color profile on the renderer
     */
    setColorProfile(profile) {
        this._colorProfile = profile;
        this._explicitColorProfile = true;
    }
    /**
     * HasDarkBackground returns whether the renderer will render to a dark background
     */
    hasDarkBackground() {
        if (!this._explicitBackgroundColor && !this._getBackgroundColorOnce) {
            this._getBackgroundColorOnce = true;
            this._hasDarkBackground = this._output.hasDarkBackground();
        }
        return this._hasDarkBackground;
    }
    /**
     * SetHasDarkBackground sets the background color detection value on the renderer
     */
    setHasDarkBackground(isDark) {
        this._hasDarkBackground = isDark;
        this._explicitBackgroundColor = true;
    }
    /**
     * Render applies styling properties to text and returns the styled result
     */
    /**
     * Create a new style associated with this renderer
     */
    newStyle() {
        const { Style } = require('./style');
        const style = new Style();
        // Associate this renderer with the style
        style._renderer = this;
        return style;
    }
    render(text, properties) {
        // This is just basic color/text styling - the full implementation should be in Style.render()
        // This mimics the Go approach where the Renderer is simpler and Style handles the complex logic
        if (!this.supportsColor()) {
            return text;
        }
        // Create a termenv style object using the output
        let te = this._output.string();
        // Apply basic styling similar to Go implementation
        if (properties.bold) {
            te = te.bold();
        }
        if (properties.italic) {
            te = te.italic();
        }
        if (properties.underline) {
            te = te.underline();
        }
        if (properties.strikethrough) {
            te = te.strikethrough();
        }
        if (properties.faint) {
            te = te.faint();
        }
        // Apply colors if present
        if (properties.color) {
            const color = this._output.color(properties.color);
            if (color) {
                te = te.foreground(color);
            }
        }
        if (properties.backgroundColor) {
            const bgColor = this._output.color(properties.backgroundColor);
            if (bgColor) {
                te = te.background(bgColor);
            }
        }
        // Use termenv's styling method like Go does
        return te.styled(text);
    }
    /**
     * supportsColor returns whether the renderer supports colors
     */
    supportsColor() {
        const profile = this.colorProfile();
        return profile !== TermenvProfile.Ascii;
    }
    /**
     * Handle FORCE_COLOR environment variable - matches Go implementation exactly
     * NOTE: NO_COLOR takes precedence over FORCE_COLOR according to the NO_COLOR standard
     */
    getColorProfileWithForceColor() {
        // Always use termenv's environment-aware detection which properly handles NO_COLOR precedence
        // The termenv implementation already correctly handles the precedence:
        // 1. NO_COLOR takes precedence (returns Ascii)
        // 2. FORCE_COLOR is handled by the underlying profile detection
        // 3. Falls back to environment detection
        return this._output.envColorProfile();
    }
}
// Default renderer instance - matches Go's global renderer exactly
export const renderer = new Renderer();
/**
 * DefaultRenderer returns the default renderer
 */
export function defaultRenderer() {
    return renderer;
}
/**
 * SetDefaultRenderer sets the default global renderer
 */
export function setDefaultRenderer(r) {
    // In Go this would reassign the global variable,
    // but in TS we need to copy the properties
    renderer.setOutput(r.output());
    if (r._explicitColorProfile) {
        renderer.setColorProfile(r.colorProfile());
    }
    if (r._explicitBackgroundColor) {
        renderer.setHasDarkBackground(r.hasDarkBackground());
    }
}
/**
 * NewRenderer creates a new Renderer
 */
export function newRenderer(output) {
    return new Renderer(output);
}
/**
 * Convenience functions that use the default renderer - match Go API exactly
 */
export function colorProfile() {
    return renderer.colorProfile();
}
export function setColorProfile(profile) {
    renderer.setColorProfile(profile);
}
export function hasDarkBackground() {
    return renderer.hasDarkBackground();
}
export function setHasDarkBackground(isDark) {
    renderer.setHasDarkBackground(isDark);
}
//# sourceMappingURL=renderer.js.map