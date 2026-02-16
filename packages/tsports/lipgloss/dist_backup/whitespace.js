/**
 * Whitespace renderer for Lipgloss
 * Port of whitespace.go from Go Lipgloss
 */
import { stringWidth } from './ansi-utils';
/**
 * Whitespace renderer
 */
export class Whitespace {
    constructor(renderer, opts = []) {
        this.renderer = renderer;
        this.style = renderer.colorProfile().string();
        this.chars = '';
        for (const opt of opts) {
            opt(this);
        }
    }
    /**
     * Render whitespaces with specified width
     */
    render(width) {
        if (this.chars === '') {
            this.chars = ' ';
        }
        const runes = Array.from(this.chars);
        let j = 0;
        let result = '';
        // Cycle through runes and print them into the whitespace
        for (let i = 0; i < width;) {
            result += runes[j];
            j++;
            if (j >= runes.length) {
                j = 0;
            }
            i += stringWidth(runes[j] || ' ');
        }
        return this.style.styled(result);
    }
    setChars(chars) {
        this.chars = chars;
    }
    setStyle(style) {
        this.style = style;
    }
}
/**
 * WithWhitespaceRenderer sets a custom renderer for whitespace
 */
export function WithWhitespaceRenderer(r) {
    return (w) => {
        w.renderer = r;
    };
}
/**
 * WithWhitespaceChars sets the characters to use for whitespace
 */
export function WithWhitespaceChars(chars) {
    return (w) => {
        w.setChars(chars);
    };
}
/**
 * WithWhitespaceForeground sets the foreground color for whitespace
 */
export function WithWhitespaceForeground(color) {
    return (w) => {
        const colorObj = w.renderer._output.color(color);
        if (colorObj) {
            w.setStyle(w.style.foreground(colorObj));
        }
    };
}
/**
 * WithWhitespaceBackground sets the background color for whitespace
 */
export function WithWhitespaceBackground(color) {
    return (w) => {
        const colorObj = w.renderer._output.color(color);
        if (colorObj) {
            w.setStyle(w.style.background(colorObj));
        }
    };
}
/**
 * Create a new whitespace renderer
 */
export function newWhitespace(r, ...opts) {
    return new Whitespace(r, opts);
}
//# sourceMappingURL=whitespace.js.map