/**
 * Core TypeScript interfaces and types for Lipgloss
 *
 * This module defines the complete type system for the Lipgloss library,
 * providing type safety and excellent IntelliSense support.
 */
/**
 * Alignment options for horizontal positioning of content within a styled element.
 *
 * @example
 * ```typescript
 * // Left-align text in a styled box
 * const style = Style().width(20).horizontalAlignment(HorizontalAlignment.Left);
 *
 * // Center-align content
 * const centered = Style().horizontalAlignment(HorizontalAlignment.Center);
 * ```
 *
 * @see {@link VerticalAlignment} For vertical positioning options
 * @see {@link Position} For combined horizontal and vertical positioning
 * @see {@link StyleProperties.horizontalAlignment} Style property that uses this enum
 */
export var HorizontalAlignment;
(function (HorizontalAlignment) {
    /** Align content to the left edge of the container */
    HorizontalAlignment["Left"] = "left";
    /** Center content horizontally within the container */
    HorizontalAlignment["Center"] = "center";
    /** Align content to the right edge of the container */
    HorizontalAlignment["Right"] = "right";
})(HorizontalAlignment || (HorizontalAlignment = {}));
/**
 * Alignment options for vertical positioning of content within a styled element.
 *
 * @example
 * ```typescript
 * // Top-align content in a tall box
 * const style = Style().height(10).verticalAlignment(VerticalAlignment.Top);
 *
 * // Center content vertically
 * const centered = Style().verticalAlignment(VerticalAlignment.Center);
 * ```
 *
 * @see {@link HorizontalAlignment} For horizontal positioning options
 * @see {@link Position} For combined horizontal and vertical positioning
 * @see {@link StyleProperties.verticalAlignment} Style property that uses this enum
 */
export var VerticalAlignment;
(function (VerticalAlignment) {
    /** Align content to the top edge of the container */
    VerticalAlignment["Top"] = "top";
    /** Center content vertically within the container */
    VerticalAlignment["Center"] = "center";
    /** Align content to the bottom edge of the container */
    VerticalAlignment["Bottom"] = "bottom";
})(VerticalAlignment || (VerticalAlignment = {}));
/**
 * Predefined border styles providing common border appearances.
 * These enum values correspond to built-in border character sets
 * optimized for different terminal capabilities and aesthetic preferences.
 *
 * @example
 * ```typescript
 * // Standard box border
 * const normalStyle = Style().border({ style: BorderType.Normal });
 *
 * // Rounded corners for modern terminals
 * const roundedStyle = Style().border({ style: BorderType.Rounded });
 *
 * // ASCII-safe for compatibility
 * const compatStyle = Style().border({ style: BorderType.ASCII });
 *
 * // Thick border for emphasis
 * const boldStyle = Style().border({ style: BorderType.Thick });
 *
 * // No border (removes all border characters)
 * const noBorderStyle = Style().border({ style: BorderType.None });
 * ```
 *
 * Visual examples:
 * ```
 * Normal:    ┌─────┐    Rounded:   ╭─────╮
 *            │     │               │     │
 *            └─────┘               ╰─────╯
 *
 * Thick:     ┏━━━━━┓    Double:    ╔═════╗
 *            ┃     ┃               ║     ║
 *            ┗━━━━━┛               ╚═════╝
 *
 * ASCII:     +-----+    Block:     █████
 *            |     |               █   █
 *            +-----+               █████
 * ```
 *
 * Migration from Go Lipgloss:
 * - `lipgloss.NormalBorder()` → `BorderType.Normal`
 * - `lipgloss.RoundedBorder()` → `BorderType.Rounded`
 * - `lipgloss.ThickBorder()` → `BorderType.Thick`
 * - `lipgloss.DoubleBorder()` → `BorderType.Double`
 *
 * @see {@link BorderStyle} For custom border character definitions
 * @see {@link BorderConfig} For complete border configuration
 */
export var BorderType;
(function (BorderType) {
    /** No border - removes all border characters */
    BorderType["None"] = "none";
    /** Standard single-line box drawing characters (┌┐└┘─│) */
    BorderType["Normal"] = "normal";
    /** Rounded corners using modern Unicode characters (╭╮╰╯─│) */
    BorderType["Rounded"] = "rounded";
    /** Thick/bold single-line characters (┏┓┗┛━┃) */
    BorderType["Thick"] = "thick";
    /** Double-line box drawing characters (╔╗╚╝═║) */
    BorderType["Double"] = "double";
    /** Hidden border (takes up space but invisible) */
    BorderType["Hidden"] = "hidden";
    /** ASCII-compatible characters (+|-) for maximum compatibility */
    BorderType["ASCII"] = "ascii";
    /** Solid block characters for filled borders */
    BorderType["Block"] = "block";
    /** Half-block characters on the outside */
    BorderType["OuterHalfBlock"] = "outerHalfBlock";
    /** Half-block characters on the inside */
    BorderType["InnerHalfBlock"] = "innerHalfBlock";
    /** Markdown-style table borders using pipes and dashes */
    BorderType["Markdown"] = "markdown";
})(BorderType || (BorderType = {}));
/**
 * Font weight options for controlling text thickness and emphasis.
 * Maps to terminal font weight capabilities.
 *
 * @example
 * ```typescript
 * // Normal text weight
 * const normalText = Style().fontWeight(FontWeight.Normal);
 *
 * // Bold for emphasis
 * const boldText = Style().fontWeight(FontWeight.Bold);
 *
 * // Faint for subtle text
 * const subtleText = Style().fontWeight(FontWeight.Faint);
 *
 * // Combined with colors
 * const errorStyle = Style()
 *   .color('red')
 *   .fontWeight(FontWeight.Bold);
 *
 * const hintStyle = Style()
 *   .color('gray')
 *   .fontWeight(FontWeight.Faint);
 * ```
 *
 * Terminal support:
 * - `Normal`: Universal support
 * - `Bold`: Widely supported, may render as bright colors on some terminals
 * - `Faint`: Modern terminals, may render as dim colors
 *
 * Migration from Go Lipgloss:
 * - `lipgloss.Bold()` → `FontWeight.Bold`
 * - `lipgloss.Faint()` → `FontWeight.Faint`
 *
 * @see {@link FontStyle} For font style options
 * @see {@link TextDecoration} For text decoration options
 * @see {@link StyleProperties.fontWeight} Style property that uses this enum
 */
export var FontWeight;
(function (FontWeight) {
    /** Normal font weight */
    FontWeight["Normal"] = "normal";
    /** Bold/heavy font weight for emphasis */
    FontWeight["Bold"] = "bold";
    /** Faint/light font weight for subtle text */
    FontWeight["Faint"] = "faint";
})(FontWeight || (FontWeight = {}));
/**
 * Font style options for controlling text slant and emphasis.
 * Maps to terminal font style capabilities.
 *
 * @example
 * ```typescript
 * // Normal text style
 * const normalText = Style().fontStyle(FontStyle.Normal);
 *
 * // Italic for emphasis or special text
 * const italicText = Style().fontStyle(FontStyle.Italic);
 *
 * // Combined styling
 * const emphasisStyle = Style()
 *   .fontStyle(FontStyle.Italic)
 *   .fontWeight(FontWeight.Bold)
 *   .color('blue');
 *
 * // For code comments
 * const commentStyle = Style()
 *   .fontStyle(FontStyle.Italic)
 *   .color('brightBlack');
 * ```
 *
 * Terminal support:
 * - `Normal`: Universal support
 * - `Italic`: Modern terminals with font support; may render as reverse or underline on older terminals
 *
 * Migration from Go Lipgloss:
 * - `lipgloss.Italic()` → `FontStyle.Italic`
 *
 * @see {@link FontWeight} For font weight options
 * @see {@link TextDecoration} For text decoration options
 * @see {@link StyleProperties.fontStyle} Style property that uses this enum
 */
export var FontStyle;
(function (FontStyle) {
    /** Normal/upright font style */
    FontStyle["Normal"] = "normal";
    /** Italic/slanted font style for emphasis */
    FontStyle["Italic"] = "italic";
})(FontStyle || (FontStyle = {}));
/**
 * Color profile enumeration for terminal color support levels.
 * Defines the color capabilities available in different terminal environments.
 * Used for automatic color downgrading and capability detection.
 *
 * @example
 * ```typescript
 * // Detect and use appropriate color profile
 * const profile = detectColorProfile();
 *
 * if (profile >= ColorProfile.TrueColor) {
 *   // Use full RGB colors
 *   style.color({ r: 255, g: 128, b: 64 });
 * } else if (profile >= ColorProfile.ANSI256) {
 *   // Use 256-color palette
 *   style.color(208); // Orange
 * } else if (profile >= ColorProfile.ANSI) {
 *   // Use basic 16 colors
 *   style.color('yellow');
 * } else {
 *   // No color support
 *   style.fontWeight(FontWeight.Bold);
 * }
 *
 * // Force specific profile
 * const options: OutputOptions = {
 *   colorProfile: ColorProfile.ANSI256
 * };
 * ```
 *
 * Profile capabilities:
 * - **NoColor/Ascii**: No color support, text-only styling
 * - **ANSI**: Standard 16 colors (black, red, green, etc.)
 * - **ANSI256**: Extended 256-color palette
 * - **TrueColor**: Full 24-bit RGB color support
 *
 * Detection priority:
 * 1. Environment variables (COLORTERM, TERM, etc.)
 * 2. Terminal application detection
 * 3. Platform-specific defaults
 *
 * @see {@link OutputOptions.colorProfile} For setting color profile
 * @see {@link RendererOptions.colorLevel} For numeric color level
 */
export var ColorProfile;
(function (ColorProfile) {
    /** No color support - monochrome output only */
    ColorProfile[ColorProfile["NoColor"] = 0] = "NoColor";
    /** Alias for NoColor for compatibility with ASCII-only terminals */
    ColorProfile[ColorProfile["Ascii"] = 0] = "Ascii";
    /** Basic 16 color support (standard ANSI colors) */
    ColorProfile[ColorProfile["ANSI"] = 1] = "ANSI";
    /** Extended 256 color support (includes RGB cube and grayscale) */
    ColorProfile[ColorProfile["ANSI256"] = 2] = "ANSI256";
    /** True color 24-bit RGB support (16.7 million colors) */
    ColorProfile[ColorProfile["TrueColor"] = 3] = "TrueColor";
})(ColorProfile || (ColorProfile = {}));
/**
 * Type guard to check if a value is a valid color
 */
export function isValidColor(value) {
    if (value === null)
        return true;
    // Check number (ANSI color codes)
    if (typeof value === 'number') {
        return Number.isInteger(value) && value >= 0 && value <= 255;
    }
    // Check string (hex colors, RGB format, or named colors)
    if (typeof value === 'string') {
        // Allow empty string (represents no color/transparent)
        if (value === '') {
            return true;
        }
        // Check for hex colors
        if (value.startsWith('#')) {
            return /^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(value);
        }
        // Check for RGB format: rgb(r,g,b) or rgb(r, g, b)
        if (value.startsWith('rgb(') && value.endsWith(')')) {
            const rgbMatch = value.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1], 10);
                const g = parseInt(rgbMatch[2], 10);
                const b = parseInt(rgbMatch[3], 10);
                return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
            }
            return false;
        }
        // Check for string ANSI color codes (0-255)
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && value === numValue.toString()) {
            return Number.isInteger(numValue) && numValue >= 0 && numValue <= 255;
        }
        // Check for named colors
        const namedColors = [
            'black',
            'red',
            'green',
            'yellow',
            'blue',
            'magenta',
            'cyan',
            'white',
            'gray',
            'darkgray',
            'brightBlack',
            'brightRed',
            'brightGreen',
            'brightYellow',
            'brightBlue',
            'brightMagenta',
            'brightCyan',
            'brightWhite',
        ];
        return namedColors.includes(value);
    }
    // Check objects (RGB, RGBA, HSL)
    if (typeof value === 'object' && value !== null) {
        const obj = value;
        // Check RGB/RGBA
        if ('r' in obj && 'g' in obj && 'b' in obj) {
            const isValidRGB = typeof obj.r === 'number' &&
                typeof obj.g === 'number' &&
                typeof obj.b === 'number' &&
                Number.isFinite(obj.r) &&
                obj.r >= 0 &&
                obj.r <= 255 &&
                Number.isFinite(obj.g) &&
                obj.g >= 0 &&
                obj.g <= 255 &&
                Number.isFinite(obj.b) &&
                obj.b >= 0 &&
                obj.b <= 255;
            // Check alpha if present
            if ('a' in obj) {
                return (isValidRGB &&
                    typeof obj.a === 'number' &&
                    Number.isFinite(obj.a) &&
                    obj.a >= 0 &&
                    obj.a <= 1);
            }
            return isValidRGB;
        }
        // Check HSL
        if ('h' in obj && 's' in obj && 'l' in obj) {
            return (typeof obj.h === 'number' &&
                typeof obj.s === 'number' &&
                typeof obj.l === 'number' &&
                Number.isFinite(obj.h) &&
                obj.h >= 0 &&
                obj.h <= 360 &&
                Number.isFinite(obj.s) &&
                obj.s >= 0 &&
                obj.s <= 100 &&
                Number.isFinite(obj.l) &&
                obj.l >= 0 &&
                obj.l <= 100);
        }
    }
    return false;
}
/**
 * Type guard to check if a value is a valid border style
 */
export function isValidBorderStyle(value) {
    if (typeof value === 'string' && Object.values(BorderType).includes(value)) {
        return true;
    }
    if (typeof value === 'object' && value !== null) {
        const obj = value;
        const validKeys = [
            'top',
            'right',
            'bottom',
            'left',
            'topLeft',
            'topRight',
            'bottomLeft',
            'bottomRight',
            'middleLeft',
            'middleRight',
            'middle',
            'middleTop',
            'middleBottom',
        ];
        return Object.keys(obj).every((key) => validKeys.includes(key) && typeof obj[key] === 'string');
    }
    return false;
}
//# sourceMappingURL=types.js.map