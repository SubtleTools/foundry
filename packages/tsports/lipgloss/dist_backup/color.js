/**
 * Color types and implementations matching Go Lipgloss exactly
 */
import { Profile as TermenvProfile, color as termenvColor, noColor as termenvNoColor, ProfileUtils, } from '@tsports/termenv';
/**
 * NoColor represents the absence of color styling
 * Matches Go's NoColor{} struct exactly
 */
export class NoColor {
    color(renderer) {
        return termenvNoColor();
    }
    RGBA() {
        return [0x0, 0x0, 0x0, 0xffff];
    }
}
/**
 * Color represents a color by hex or ANSI value
 * Matches Go's Color string type exactly
 */
export class ColorClass {
    constructor(value) {
        this.value = value;
    }
    color(renderer) {
        // Match Go's implementation: r.ColorProfile().Color(string(c))
        // Use ProfileUtils.color with the renderer's color profile instead of output's detected profile
        const color = ProfileUtils.color(renderer.colorProfile(), this.value);
        return color || termenvNoColor();
    }
    RGBA() {
        // Basic hex color parsing - simplified for now
        if (this.value.startsWith('#') && this.value.length === 7) {
            const hex = this.value.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return [r, g, b, 255];
        }
        return [0, 0, 0, 255];
    }
    toString() {
        return this.value;
    }
}
/**
 * ANSIColor represents an ANSI color value
 * Matches Go's ANSIColor uint type exactly
 */
export class ANSIColorClass {
    constructor(value) {
        this.value = value;
        this.value = Math.max(0, Math.floor(value));
    }
    color(renderer) {
        return new Color(this.value.toString()).color(renderer);
    }
    RGBA() {
        return new Color(this.value.toString()).RGBA();
    }
    toString() {
        return this.value.toString();
    }
    valueOf() {
        return this.value;
    }
}
/**
 * AdaptiveColor provides different colors for light and dark backgrounds
 * Matches Go's AdaptiveColor struct exactly
 */
export class AdaptiveColor {
    constructor(light, dark) {
        this.light = light;
        this.dark = dark;
    }
    color(renderer) {
        if (renderer.hasDarkBackground()) {
            return new Color(this.dark).color(renderer);
        }
        return new Color(this.light).color(renderer);
    }
    RGBA() {
        return new Color(this.dark).RGBA();
    }
}
/**
 * CompleteColor specifies exact values for different color profiles
 * Matches Go's CompleteColor struct exactly
 */
export class CompleteColor {
    constructor(trueColor, ansi256, ansi) {
        this.trueColor = trueColor;
        this.ansi256 = ansi256;
        this.ansi = ansi;
    }
    color(renderer) {
        const profile = renderer.colorProfile();
        switch (profile) {
            case TermenvProfile.TrueColor:
                return termenvColor(this.trueColor) || termenvNoColor();
            case TermenvProfile.ANSI256:
                return termenvColor(this.ansi256) || termenvNoColor();
            case TermenvProfile.ANSI:
                return termenvColor(this.ansi) || termenvNoColor();
            default:
                return termenvNoColor();
        }
    }
    RGBA() {
        return new Color(this.trueColor).RGBA();
    }
}
/**
 * CompleteAdaptiveColor combines CompleteColor with AdaptiveColor
 * Matches Go's CompleteAdaptiveColor struct exactly
 */
export class CompleteAdaptiveColor {
    constructor(light, dark) {
        this.light = light;
        this.dark = dark;
    }
    color(renderer) {
        if (renderer.hasDarkBackground()) {
            return this.dark.color(renderer);
        }
        return this.light.color(renderer);
    }
    RGBA() {
        return this.dark.RGBA();
    }
}
// Global instances and convenience functions - matching Go API exactly
export const noColor = new NoColor();
// Export factory functions that match Go's constructors exactly
export function NewColor(value) {
    return new ColorClass(value);
}
export function NewANSIColor(value) {
    return new ANSIColorClass(value);
}
export function NewAdaptiveColor(light, dark) {
    return new AdaptiveColor(light, dark);
}
export function NewCompleteColor(trueColor, ansi256, ansi) {
    return new CompleteColor(trueColor, ansi256, ansi);
}
export function NewCompleteAdaptiveColor(light, dark) {
    return new CompleteAdaptiveColor(light, dark);
}
// Go-compatible factory functions
export function Color(value) {
    // Handle empty string case - return empty string directly
    if (value === '') {
        return '';
    }
    return new ColorClass(value);
}
export function ANSIColor(value) {
    return new ANSIColorClass(value);
}
// Note: Renderer will be imported by consumer code to avoid circular dependencies
//# sourceMappingURL=color.js.map