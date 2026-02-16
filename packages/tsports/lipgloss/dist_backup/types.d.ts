/**
 * Core TypeScript interfaces and types for Lipgloss
 *
 * This module defines the complete type system for the Lipgloss library,
 * providing type safety and excellent IntelliSense support.
 */
export interface TerminalColor {
    /**
     * Resolve this color using the renderer's color profile and background detection.
     * This matches Go's color(r *Renderer) termenv.Color method.
     */
    color(renderer: any): any;
    /**
     * Get RGBA values for this color.
     * Note: This is deprecated in Go and should not be relied upon.
     * @deprecated Use color() method with renderer instead
     */
    RGBA(): [number, number, number, number];
}
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
export declare enum HorizontalAlignment {
    /** Align content to the left edge of the container */
    Left = "left",
    /** Center content horizontally within the container */
    Center = "center",
    /** Align content to the right edge of the container */
    Right = "right"
}
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
export declare enum VerticalAlignment {
    /** Align content to the top edge of the container */
    Top = "top",
    /** Center content vertically within the container */
    Center = "center",
    /** Align content to the bottom edge of the container */
    Bottom = "bottom"
}
/**
 * Position interface combining horizontal and vertical alignment options.
 * Used for positioning content within styled elements in both dimensions.
 *
 * @example
 * ```typescript
 * // Center content both horizontally and vertically
 * const centerPosition: Position = {
 *   horizontal: HorizontalAlignment.Center,
 *   vertical: VerticalAlignment.Center
 * };
 *
 * // Bottom-right positioning
 * const bottomRight: Position = {
 *   horizontal: HorizontalAlignment.Right,
 *   vertical: VerticalAlignment.Bottom
 * };
 *
 * // Only specify one dimension (other remains default)
 * const leftAligned: Position = {
 *   horizontal: HorizontalAlignment.Left
 *   // vertical alignment will use default
 * };
 * ```
 *
 * @see {@link HorizontalAlignment} For horizontal alignment options
 * @see {@link VerticalAlignment} For vertical alignment options
 */
export interface Position {
    /** Horizontal alignment of content within the container */
    horizontal?: HorizontalAlignment;
    /** Vertical alignment of content within the container */
    vertical?: VerticalAlignment;
}
/**
 * RGB color representation using red, green, and blue components.
 * Each component should be an integer between 0 and 255 inclusive.
 *
 * @example
 * ```typescript
 * // Pure red color
 * const red: RGBColor = { r: 255, g: 0, b: 0 };
 *
 * // Purple color
 * const purple: RGBColor = { r: 128, g: 0, b: 128 };
 *
 * // White color
 * const white: RGBColor = { r: 255, g: 255, b: 255 };
 * ```
 *
 * @see {@link RGBAColor} For RGB with alpha transparency
 * @see {@link HSLColor} For HSL color representation
 * @see {@link ColorValue} Union type that includes RGB colors
 */
export interface RGBColor {
    /** Red component (0-255) */
    r: number;
    /** Green component (0-255) */
    g: number;
    /** Blue component (0-255) */
    b: number;
}
/**
 * RGBA color representation extending RGB with an alpha (transparency) channel.
 * RGB components should be integers between 0-255, alpha should be between 0.0-1.0.
 *
 * @example
 * ```typescript
 * // Semi-transparent red (50% opacity)
 * const semiRed: RGBAColor = { r: 255, g: 0, b: 0, a: 0.5 };
 *
 * // Fully opaque blue
 * const blue: RGBAColor = { r: 0, g: 0, b: 255, a: 1.0 };
 *
 * // Completely transparent (invisible)
 * const transparent: RGBAColor = { r: 0, g: 0, b: 0, a: 0.0 };
 * ```
 *
 * @see {@link RGBColor} For RGB without alpha channel
 * @see {@link ColorValue} Union type that includes RGBA colors
 */
export interface RGBAColor extends RGBColor {
    /** Alpha channel for transparency (0.0 = fully transparent, 1.0 = fully opaque) */
    a: number;
}
/**
 * HSL color representation using hue, saturation, and lightness components.
 * This color model is often more intuitive for color manipulation than RGB.
 *
 * @example
 * ```typescript
 * // Pure red color
 * const red: HSLColor = { h: 0, s: 100, l: 50 };
 *
 * // Light blue
 * const lightBlue: HSLColor = { h: 200, s: 80, l: 70 };
 *
 * // Grayscale (no saturation)
 * const gray: HSLColor = { h: 0, s: 0, l: 50 };
 *
 * // Creating color variations
 * const baseColor: HSLColor = { h: 120, s: 100, l: 50 }; // Green
 * const lighterGreen: HSLColor = { ...baseColor, l: 75 };
 * const darkerGreen: HSLColor = { ...baseColor, l: 25 };
 * ```
 *
 * @see {@link RGBColor} For RGB color representation
 * @see {@link ColorValue} Union type that includes HSL colors
 */
export interface HSLColor {
    /** Hue component in degrees (0-360) */
    h: number;
    /** Saturation percentage (0-100) */
    s: number;
    /** Lightness percentage (0-100) */
    l: number;
}
/**
 * ANSI 256-color codes for terminal color support.
 * Valid values are integers from 0 to 255.
 *
 * Color ranges:
 * - 0-15: Standard 16 colors (black, red, green, etc.)
 * - 16-231: 216 colors in a 6×6×6 RGB cube
 * - 232-255: 24 grayscale colors
 *
 * @example
 * ```typescript
 * // Standard colors
 * const red: ANSIColor = 1;
 * const green: ANSIColor = 2;
 * const blue: ANSIColor = 4;
 *
 * // Bright colors
 * const brightRed: ANSIColor = 9;
 * const brightGreen: ANSIColor = 10;
 *
 * // 256-color palette
 * const orange: ANSIColor = 208;
 * const purple: ANSIColor = 129;
 *
 * // Grayscale
 * const darkGray: ANSIColor = 236;
 * const lightGray: ANSIColor = 250;
 * ```
 *
 * @see {@link ColorValue} Union type that includes ANSI colors
 * @see {@link NamedColor} For human-readable color names
 */
export type ANSIColor = number;
/**
 * Named colors based on common terminal color names.
 * These correspond to the standard 16-color ANSI palette and provide
 * human-readable alternatives to numeric color codes.
 *
 * @example
 * ```typescript
 * // Basic colors
 * const errorStyle = Style().color('red').fontWeight(FontWeight.Bold);
 * const successStyle = Style().color('green');
 * const warningStyle = Style().color('yellow');
 *
 * // Bright variants for emphasis
 * const highlightStyle = Style().color('brightWhite').backgroundColor('blue');
 * const accentStyle = Style().color('brightMagenta');
 *
 * // Grayscale
 * const subtleStyle = Style().color('brightBlack'); // Gray
 * const headerStyle = Style().color('white').backgroundColor('black');
 * ```
 *
 * Color mapping:
 * - Basic colors: black, red, green, yellow, blue, magenta, cyan, white
 * - Bright variants: brightBlack (gray), brightRed, brightGreen, etc.
 *
 * @see {@link ANSIColor} For numeric color codes
 * @see {@link ColorValue} Union type that includes named colors
 */
export type NamedColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'darkgray' | 'brightBlack' | 'brightRed' | 'brightGreen' | 'brightYellow' | 'brightBlue' | 'brightMagenta' | 'brightCyan' | 'brightWhite';
/**
 * Flexible color value supporting multiple color formats and representations.
 * This union type allows colors to be specified in the most convenient format
 * for any given use case, with automatic conversion handled internally.
 *
 * @example
 * ```typescript
 * // Hex colors (3 or 6 digits)
 * const red1: ColorValue = '#ff0000';
 * const red2: ColorValue = '#f00';
 *
 * // RGB function strings
 * const blue: ColorValue = 'rgb(0, 100, 255)';
 *
 * // Named colors
 * const green: ColorValue = 'green';
 * const brightYellow: ColorValue = 'brightYellow';
 *
 * // Object-based colors
 * const purple: ColorValue = { r: 128, g: 0, b: 128 };
 * const semiTransparent: ColorValue = { r: 255, g: 0, b: 0, a: 0.5 };
 * const hslColor: ColorValue = { h: 240, s: 100, l: 50 };
 *
 * // ANSI color codes
 * const orange: ColorValue = 208;
 *
 * // No color (transparent/default)
 * const noColor: ColorValue = null;
 *
 * // Usage in styles
 * const style = Style()
 *   .color('#ff6b6b')           // Hex
 *   .backgroundColor('blue')    // Named
 *   .border({ color: { r: 100, g: 200, b: 50 } }); // RGB object
 * ```
 *
 * Supported formats:
 * - **Hex strings**: `#rgb` or `#rrggbb` format
 * - **RGB strings**: `rgb(r,g,b)` format with space tolerance
 * - **Named colors**: Standard terminal color names
 * - **RGB objects**: `{r, g, b}` with 0-255 values
 * - **RGBA objects**: `{r, g, b, a}` with alpha 0.0-1.0
 * - **HSL objects**: `{h, s, l}` with h: 0-360, s/l: 0-100
 * - **ANSI codes**: Numbers 0-255 for terminal color palette
 * - **null**: No color / transparent / use default
 *
 * @see {@link isValidColor} Type guard to validate color values
 * @see {@link RGBColor} RGB object format
 * @see {@link RGBAColor} RGBA object format
 * @see {@link HSLColor} HSL object format
 * @see {@link ANSIColor} ANSI color code format
 * @see {@link NamedColor} Named color constants
 */
export type ColorValue = string | NamedColor | RGBColor | RGBAColor | HSLColor | ANSIColor | TerminalColor | null;
/**
 * Custom border style definition allowing fine-grained control over border characters.
 * Each property defines the Unicode character to use for that specific border position.
 * This interface enables creation of custom border styles beyond the predefined ones.
 *
 * @example
 * ```typescript
 * // Custom double-line border
 * const doubleBorder: BorderStyle = {
 *   top: '═',
 *   right: '║',
 *   bottom: '═',
 *   left: '║',
 *   topLeft: '╔',
 *   topRight: '╗',
 *   bottomLeft: '╚',
 *   bottomRight: '╝'
 * };
 *
 * // ASCII-safe border
 * const asciiBorder: BorderStyle = {
 *   top: '-',
 *   right: '|',
 *   bottom: '-',
 *   left: '|',
 *   topLeft: '+',
 *   topRight: '+',
 *   bottomLeft: '+',
 *   bottomRight: '+'
 * };
 *
 * // Custom artistic border
 * const starBorder: BorderStyle = {
 *   top: '*',
 *   right: '*',
 *   bottom: '*',
 *   left: '*',
 *   topLeft: '✦',
 *   topRight: '✦',
 *   bottomLeft: '✦',
 *   bottomRight: '✦'
 * };
 *
 * // Usage in border configuration
 * const style = Style().border({ style: doubleBorder });
 * ```
 *
 * Border character positions:
 * ```
 * topLeft ── top ── topRight
 *    │               │
 *   left            right
 *    │               │
 * bottomLeft ─ bottom ─ bottomRight
 * ```
 *
 * For table borders with intersections:
 * ```
 * topLeft ── middleTop ── topRight
 *    │          │           │
 * middleLeft ─ middle ─ middleRight
 *    │          │           │
 * bottomLeft ─ middleBottom ─ bottomRight
 * ```
 *
 * @see {@link BorderType} For predefined border styles
 * @see {@link BorderConfig} For complete border configuration
 * @see {@link isValidBorderStyle} Type guard for border style validation
 */
export interface BorderStyle {
    /** Character for top horizontal border */
    top?: string;
    /** Character for right vertical border */
    right?: string;
    /** Character for bottom horizontal border */
    bottom?: string;
    /** Character for left vertical border */
    left?: string;
    /** Character for top-left corner */
    topLeft?: string;
    /** Character for top-right corner */
    topRight?: string;
    /** Character for bottom-left corner */
    bottomLeft?: string;
    /** Character for bottom-right corner */
    bottomRight?: string;
    /** Character for left side of middle intersections (table borders) */
    middleLeft?: string;
    /** Character for right side of middle intersections (table borders) */
    middleRight?: string;
    /** Character for center intersection point (table borders) */
    middle?: string;
    /** Character for top side of middle intersections (table borders) */
    middleTop?: string;
    /** Character for bottom side of middle intersections (table borders) */
    middleBottom?: string;
}
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
export declare enum BorderType {
    /** No border - removes all border characters */
    None = "none",
    /** Standard single-line box drawing characters (┌┐└┘─│) */
    Normal = "normal",
    /** Rounded corners using modern Unicode characters (╭╮╰╯─│) */
    Rounded = "rounded",
    /** Thick/bold single-line characters (┏┓┗┛━┃) */
    Thick = "thick",
    /** Double-line box drawing characters (╔╗╚╝═║) */
    Double = "double",
    /** Hidden border (takes up space but invisible) */
    Hidden = "hidden",
    /** ASCII-compatible characters (+|-) for maximum compatibility */
    ASCII = "ascii",
    /** Solid block characters for filled borders */
    Block = "block",
    /** Half-block characters on the outside */
    OuterHalfBlock = "outerHalfBlock",
    /** Half-block characters on the inside */
    InnerHalfBlock = "innerHalfBlock",
    /** Markdown-style table borders using pipes and dashes */
    Markdown = "markdown"
}
/**
 * Complete border configuration interface providing comprehensive border styling options.
 * Combines border style, colors, visibility controls, and individual side customization.
 *
 * @example
 * ```typescript
 * // Simple border with predefined style
 * const simpleBorder: BorderConfig = {
 *   style: BorderType.Normal,
 *   color: 'blue'
 * };
 *
 * // Custom border with selective sides
 * const customBorder: BorderConfig = {
 *   style: BorderType.Thick,
 *   top: true,
 *   bottom: true,
 *   left: false,
 *   right: false,
 *   color: 'red'
 * };
 *
 * // Multi-colored border sides
 * const rainbowBorder: BorderConfig = {
 *   style: BorderType.Normal,
 *   topColor: 'red',
 *   rightColor: 'green',
 *   bottomColor: 'blue',
 *   leftColor: 'yellow'
 * };
 *
 * // Border with background colors
 * const fancyBorder: BorderConfig = {
 *   style: BorderType.Double,
 *   color: 'white',
 *   topBackgroundColor: 'red',
 *   bottomBackgroundColor: 'blue'
 * };
 *
 * // Usage in styles
 * const style = Style().border(simpleBorder);
 * ```
 *
 * Configuration precedence:
 * 1. Individual side colors override general color
 * 2. Individual side background colors override general background
 * 3. Side visibility (top/right/bottom/left) controls which borders are drawn
 *
 * @see {@link BorderType} For predefined border styles
 * @see {@link BorderStyle} For custom border character definitions
 * @see {@link ColorValue} For color value formats
 * @see {@link StyleProperties.border} Style property that uses this interface
 */
export interface BorderConfig {
    /** Border style - either predefined BorderType or custom BorderStyle */
    style?: BorderType | BorderStyle;
    /** Default color for all border sides */
    color?: ColorValue;
    /** Whether to show top border */
    top?: boolean;
    /** Whether to show right border */
    right?: boolean;
    /** Whether to show bottom border */
    bottom?: boolean;
    /** Whether to show left border */
    left?: boolean;
    /** Color for top border (overrides general color) */
    topColor?: ColorValue;
    /** Color for right border (overrides general color) */
    rightColor?: ColorValue;
    /** Color for bottom border (overrides general color) */
    bottomColor?: ColorValue;
    /** Color for left border (overrides general color) */
    leftColor?: ColorValue;
    /** Background color for top border area */
    topBackgroundColor?: ColorValue;
    /** Background color for right border area */
    rightBackgroundColor?: ColorValue;
    /** Background color for bottom border area */
    bottomBackgroundColor?: ColorValue;
    /** Background color for left border area */
    leftBackgroundColor?: ColorValue;
}
/**
 * Padding configuration for inner spacing within styled elements.
 * Controls the space between the content and the border/edge of the element.
 * Follows CSS-style individual side specification.
 *
 * @example
 * ```typescript
 * // Uniform padding on all sides
 * const uniformPadding: PaddingConfig = {
 *   top: 2,
 *   right: 4,
 *   bottom: 2,
 *   left: 4
 * };
 *
 * // Vertical padding only
 * const verticalPadding: PaddingConfig = {
 *   top: 1,
 *   bottom: 1
 *   // left and right remain 0 (default)
 * };
 *
 * // Asymmetric padding
 * const asymmetricPadding: PaddingConfig = {
 *   top: 0,
 *   right: 3,
 *   bottom: 1,
 *   left: 1
 * };
 *
 * // Usage in styles
 * const style = Style().padding(uniformPadding);
 *
 * // Helper methods can also be used
 * const quickStyle = Style().paddingTop(2).paddingLeft(4);
 * ```
 *
 * Padding values represent character units:
 * - `top`/`bottom`: Number of lines of vertical spacing
 * - `left`/`right`: Number of characters of horizontal spacing
 *
 * @see {@link MarginConfig} For outer spacing configuration
 * @see {@link StyleProperties.padding} Style property that uses this interface
 */
export interface PaddingConfig {
    /** Top padding in lines */
    top?: number;
    /** Right padding in characters */
    right?: number;
    /** Bottom padding in lines */
    bottom?: number;
    /** Left padding in characters */
    left?: number;
}
/**
 * Margin configuration for outer spacing around styled elements.
 * Controls the space between the element and its surrounding elements or container.
 * Follows CSS-style individual side specification.
 *
 * @example
 * ```typescript
 * // Uniform margin on all sides
 * const uniformMargin: MarginConfig = {
 *   top: 1,
 *   right: 2,
 *   bottom: 1,
 *   left: 2
 * };
 *
 * // Top and bottom margins only
 * const verticalMargin: MarginConfig = {
 *   top: 2,
 *   bottom: 2
 *   // left and right remain 0 (default)
 * };
 *
 * // Large left margin for indentation
 * const indentedMargin: MarginConfig = {
 *   left: 8
 * };
 *
 * // Usage in styles
 * const style = Style().margin(uniformMargin);
 *
 * // Helper methods for common patterns
 * const centeredStyle = Style().marginLeft(10).marginRight(10);
 * ```
 *
 * Margin values represent character units:
 * - `top`/`bottom`: Number of lines of vertical spacing
 * - `left`/`right`: Number of characters of horizontal spacing
 *
 * Unlike CSS, margins in terminal layouts typically don't collapse.
 *
 * @see {@link PaddingConfig} For inner spacing configuration
 * @see {@link StyleProperties.margin} Style property that uses this interface
 * @see {@link StyleProperties.marginBackground} For margin background color
 */
export interface MarginConfig {
    /** Top margin in lines */
    top?: number;
    /** Right margin in characters */
    right?: number;
    /** Bottom margin in lines */
    bottom?: number;
    /** Left margin in characters */
    left?: number;
}
/**
 * Width configuration options for controlling element width.
 * Supports both explicit numeric values and automatic sizing modes.
 *
 * @example
 * ```typescript
 * // Fixed width
 * const fixedWidth: WidthConfig = 50;
 *
 * // Auto-sizing based on content
 * const autoWidth: WidthConfig = 'auto';
 *
 * // Fit to content without forcing line breaks
 * const fitContent: WidthConfig = 'fit-content';
 *
 * // Take maximum available space for content
 * const maxContent: WidthConfig = 'max-content';
 *
 * // Usage in styles
 * const narrowBox = Style().width(20);
 * const autoBox = Style().width('auto');
 * const responsiveBox = Style().width('fit-content');
 * ```
 *
 * Width modes:
 * - **number**: Fixed width in characters
 * - **'auto'**: Automatically size based on available space and content
 * - **'fit-content'**: Shrink to fit content, respecting min/max constraints
 * - **'max-content'**: Expand to accommodate content without wrapping
 *
 * @see {@link HeightConfig} For height configuration options
 * @see {@link StyleProperties.width} Style property that uses this type
 * @see {@link StyleProperties.maxWidth} For maximum width constraints
 */
export type WidthConfig = number | 'auto' | 'fit-content' | 'max-content';
/**
 * Height configuration options for controlling element height.
 * Supports both explicit numeric values and automatic sizing modes.
 *
 * @example
 * ```typescript
 * // Fixed height
 * const fixedHeight: HeightConfig = 10;
 *
 * // Auto-sizing based on content
 * const autoHeight: HeightConfig = 'auto';
 *
 * // Fit to content height
 * const fitContent: HeightConfig = 'fit-content';
 *
 * // Take maximum space needed for content
 * const maxContent: HeightConfig = 'max-content';
 *
 * // Usage in styles
 * const tallBox = Style().height(15);
 * const autoBox = Style().height('auto');
 * const responsiveBox = Style().height('fit-content');
 * ```
 *
 * Height modes:
 * - **number**: Fixed height in lines/rows
 * - **'auto'**: Automatically size based on available space and content
 * - **'fit-content'**: Shrink to fit content, respecting min/max constraints
 * - **'max-content'**: Expand to accommodate all content without truncation
 *
 * @see {@link WidthConfig} For width configuration options
 * @see {@link StyleProperties.height} Style property that uses this type
 * @see {@link StyleProperties.maxHeight} For maximum height constraints
 */
export type HeightConfig = number | 'auto' | 'fit-content' | 'max-content';
/**
 * Text decoration options for applying visual text effects.
 * Controls various text styling options beyond basic color and weight.
 * Support varies by terminal capability.
 *
 * @example
 * ```typescript
 * // Simple underline
 * const underlined: TextDecoration = {
 *   underline: true
 * };
 *
 * // Multiple decorations
 * const emphasized: TextDecoration = {
 *   underline: true,
 *   blink: true
 * };
 *
 * // Strikethrough for deleted text
 * const deleted: TextDecoration = {
 *   strikethrough: true
 * };
 *
 * // Reverse colors for highlighting
 * const highlighted: TextDecoration = {
 *   reverse: true
 * };
 *
 * // Usage in styles
 * const linkStyle = Style().textDecoration({ underline: true });
 * const warningStyle = Style().textDecoration({ blink: true, reverse: true });
 * ```
 *
 * Terminal compatibility notes:
 * - `underline`: Widely supported
 * - `strikethrough`: Modern terminals only
 * - `overline`: Limited support
 * - `blink`: Often disabled by user preference
 * - `reverse`: Widely supported (swaps foreground/background)
 * - `conceal`: Security feature, limited support
 *
 * @see {@link FontWeight} For font weight options
 * @see {@link FontStyle} For font style options
 * @see {@link StyleProperties.textDecoration} Style property that uses this interface
 */
export interface TextDecoration {
    /** Add underline beneath text */
    underline?: boolean;
    /** Strike through text with horizontal line */
    strikethrough?: boolean;
    /** Add overline above text (limited terminal support) */
    overline?: boolean;
    /** Make text blink (often disabled by users) */
    blink?: boolean;
    /** Reverse foreground and background colors */
    reverse?: boolean;
    /** Hide text (security feature, limited support) */
    conceal?: boolean;
    /** Whether to underline spaces (default: true when underline is enabled) */
    underlineSpaces?: boolean;
    /** Whether to strikethrough spaces (default: true when strikethrough is enabled) */
    strikethroughSpaces?: boolean;
}
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
export declare enum FontWeight {
    /** Normal font weight */
    Normal = "normal",
    /** Bold/heavy font weight for emphasis */
    Bold = "bold",
    /** Faint/light font weight for subtle text */
    Faint = "faint"
}
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
export declare enum FontStyle {
    /** Normal/upright font style */
    Normal = "normal",
    /** Italic/slanted font style for emphasis */
    Italic = "italic"
}
/**
 * Transform function type for content manipulation and preprocessing.
 * Allows custom transformation of text content before styling is applied.
 *
 * @example
 * ```typescript
 * // Uppercase transform
 * const uppercase: TransformFunction = (content: string) => content.toUpperCase();
 *
 * // Prefix transform
 * const prefixed: TransformFunction = (content: string) => `>> ${content}`;
 *
 * // Word wrap transform
 * const wordWrap: TransformFunction = (content: string) => {
 *   return content.replace(/(.{1,40})(\s+|$)/g, '$1\n').trim();
 * };
 *
 * // Remove extra whitespace
 * const normalize: TransformFunction = (content: string) => {
 *   return content.replace(/\s+/g, ' ').trim();
 * };
 *
 * // Usage in styles
 * const shoutStyle = Style().transform(uppercase);
 * const quotedStyle = Style().transform(prefixed);
 *
 * // Chaining transforms
 * const processedStyle = Style().transform((content) => {
 *   return uppercase(prefixed(content));
 * });
 * ```
 *
 * Transform function characteristics:
 * - Must be pure functions (no side effects)
 * - Applied before other text processing (alignment, wrapping, etc.)
 * - Can modify content length and structure
 * - Should handle edge cases (empty strings, whitespace)
 *
 * @param content The input string to transform
 * @returns The transformed string
 *
 * @see {@link StyleProperties.transform} Style property that uses this type
 */
export type TransformFunction = (content: string) => string;
/**
 * Comprehensive style properties interface defining all possible styling options.
 * This is the primary interface for configuring the appearance and layout of styled elements.
 * All Style methods ultimately modify these properties.
 *
 * @example
 * ```typescript
 * // Complete style configuration
 * const cardStyle: StyleProperties = {
 *   // Colors
 *   color: 'white',
 *   backgroundColor: 'blue',
 *
 *   // Typography
 *   fontWeight: FontWeight.Bold,
 *   fontStyle: FontStyle.Normal,
 *   textDecoration: { underline: true },
 *
 *   // Layout
 *   width: 40,
 *   height: 10,
 *   padding: { top: 1, right: 2, bottom: 1, left: 2 },
 *   margin: { top: 1, bottom: 1 },
 *
 *   // Alignment
 *   horizontalAlignment: HorizontalAlignment.Center,
 *   verticalAlignment: VerticalAlignment.Center,
 *
 *   // Border
 *   border: {
 *     style: BorderType.Rounded,
 *     color: 'cyan'
 *   },
 *
 *   // Advanced options
 *   wordWrap: true,
 *   maxWidth: 80,
 *   transform: (content) => content.toUpperCase()
 * };
 *
 * // Usage with Style class
 * const style = Style(cardStyle);
 * const rendered = style.render('Hello, World!');
 * ```
 *
 * Property categories:
 * - **Colors**: `color`, `backgroundColor`, `marginBackground`
 * - **Typography**: `fontWeight`, `fontStyle`, `textDecoration`
 * - **Layout**: `width`, `height`, `padding`, `margin`
 * - **Alignment**: `horizontalAlignment`, `verticalAlignment`
 * - **Borders**: `border` with comprehensive border styling
 * - **Advanced**: `transform`, `wordWrap`, `maxWidth`, `preserveWhitespace`, etc.
 *
 * @see {@link Style} The main class that uses this interface
 * @see {@link StyleOptions} Extended interface with renderer options
 * @see {@link StyleUpdate} Partial type for style updates
 */
export interface StyleProperties {
    /** Foreground (text) color */
    color?: ColorValue;
    /** Background color */
    backgroundColor?: ColorValue;
    /** Font weight (normal, bold, faint) */
    fontWeight?: FontWeight;
    /** Font style (normal, italic) */
    fontStyle?: FontStyle;
    /** Text decorations (underline, strikethrough, etc.) */
    textDecoration?: TextDecoration;
    /** Width of the styled element */
    width?: WidthConfig;
    /** Height of the styled element */
    height?: HeightConfig;
    /** Padding (inner spacing) */
    padding?: PaddingConfig;
    /** Margin (outer spacing) */
    margin?: MarginConfig;
    /** Background color for margin areas */
    marginBackground?: ColorValue;
    /** Horizontal alignment of content */
    horizontalAlignment?: HorizontalAlignment;
    /** Vertical alignment of content */
    verticalAlignment?: VerticalAlignment;
    /** Border configuration */
    border?: BorderConfig;
    /** Border foreground color */
    borderForeground?: ColorValue;
    /** Transform function to apply to content */
    transform?: TransformFunction;
    /** Whether to apply word wrapping */
    wordWrap?: boolean;
    /** Maximum line length for word wrapping */
    maxWidth?: number;
    /** Whether to preserve whitespace */
    preserveWhitespace?: boolean;
    /** Maximum height of the styled element */
    maxHeight?: number;
    /** Whether to color whitespace characters */
    colorWhitespace?: boolean;
    /** Whether to render inline (no line breaks) */
    inline?: boolean;
    /** Custom tab width in spaces */
    tabWidth?: number;
    /** Internal: string content set by SetString() method */
    _stringContent?: string;
    /** Internal: original transform value (string or function) passed to transform() method */
    _transformValue?: TransformFunction | string;
}
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
export declare enum ColorProfile {
    /** No color support - monochrome output only */
    NoColor = 0,
    /** Alias for NoColor for compatibility with ASCII-only terminals */
    Ascii = 0,
    /** Basic 16 color support (standard ANSI colors) */
    ANSI = 1,
    /** Extended 256 color support (includes RGB cube and grayscale) */
    ANSI256 = 2,
    /** True color 24-bit RGB support (16.7 million colors) */
    TrueColor = 3
}
/**
 * Renderer configuration options for customizing the styling output behavior.
 * Controls how styles are rendered and which terminal features are used.
 *
 * @example
 * ```typescript
 * // Force color output for CI/CD environments
 * const ciOptions: RendererOptions = {
 *   forceColor: true,
 *   colorLevel: 3, // True color
 *   unicode: false // ASCII-safe for logs
 * };
 *
 * // Mobile/narrow terminal configuration
 * const mobileOptions: RendererOptions = {
 *   terminalWidth: 40,
 *   unicode: true,
 *   lineEnding: '\n'
 * };
 *
 * // ASCII-only environment
 * const asciiOptions: RendererOptions = {
 *   colorLevel: 0,
 *   unicode: false,
 *   lineEnding: '\r\n' // Windows line endings
 * };
 * ```
 *
 * @see {@link OutputOptions} For extended output configuration
 * @see {@link StyleOptions} For style creation with renderer options
 * @see {@link ColorProfile} For color level meanings
 */
export interface RendererOptions {
    /** Force color output even when not detected (useful for CI/CD) */
    forceColor?: boolean;
    /** Color level override (0=none, 1=ANSI, 2=256-color, 3=true-color) */
    colorLevel?: 0 | 1 | 2 | 3;
    /** Terminal width for layout calculations (characters) */
    terminalWidth?: number;
    /** Whether to use Unicode characters (false for ASCII-safe output) */
    unicode?: boolean;
    /** Custom line ending sequence (default: platform-specific) */
    lineEnding?: string;
}
/**
 * Extended output options for advanced renderer configuration.
 * Provides comprehensive control over output behavior, terminal detection,
 * and performance optimizations.
 *
 * @example
 * ```typescript
 * // Production environment with caching
 * const prodOptions: OutputOptions = {
 *   colorProfile: ColorProfile.TrueColor,
 *   cache: true,
 *   terminalWidth: 120,
 *   hasDarkBackground: true
 * };
 *
 * // Testing environment
 * const testOptions: OutputOptions = {
 *   assumeTTY: true,
 *   forceColor: true,
 *   colorProfile: ColorProfile.ANSI256,
 *   unsafe: true // Skip safety checks for speed
 * };
 *
 * // CI/CD environment
 * const ciOptions: OutputOptions = {
 *   forceColor: true,
 *   unicode: false,
 *   cache: false,
 *   lineEnding: '\n'
 * };
 *
 * // Light theme terminal
 * const lightOptions: OutputOptions = {
 *   hasDarkBackground: false,
 *   colorProfile: ColorProfile.TrueColor
 * };
 * ```
 *
 * Option categories:
 * - **Color Control**: `forceColor`, `colorProfile`, `hasDarkBackground`
 * - **Layout**: `terminalWidth`, `unicode`, `lineEnding`
 * - **Performance**: `cache`, `assumeTTY`, `unsafe`
 *
 * @see {@link RendererOptions} For basic renderer configuration
 * @see {@link ColorProfile} For color profile options
 */
export interface OutputOptions {
    /** Force color output even when not detected (overrides auto-detection) */
    forceColor?: boolean;
    /** Color profile override (ColorProfile enum value) */
    colorProfile?: ColorProfile;
    /** Dark background flag override (affects color choices) */
    hasDarkBackground?: boolean;
    /** Terminal width for layout calculations (characters) */
    terminalWidth?: number;
    /** Whether to use Unicode characters (false for ASCII-safe output) */
    unicode?: boolean;
    /** Custom line ending sequence (default: platform-specific) */
    lineEnding?: string;
    /** Enable output caching for performance (repeated renders) */
    cache?: boolean;
    /** Assume TTY environment for testing (bypasses detection) */
    assumeTTY?: boolean;
    /** Skip TTY safety checks (faster but potentially unsafe) */
    unsafe?: boolean;
}
/**
 * Style creation options extending StyleProperties with renderer configuration.
 * Used when creating new Style instances with both styling and renderer options.
 *
 * @example
 * ```typescript
 * // Create style with renderer options
 * const styledText: StyleOptions = {
 *   // Style properties
 *   color: 'blue',
 *   fontWeight: FontWeight.Bold,
 *   padding: { top: 1, left: 2 },
 *   border: { style: BorderType.Rounded },
 *
 *   // Renderer configuration
 *   renderer: {
 *     forceColor: true,
 *     unicode: true,
 *     terminalWidth: 80
 *   }
 * };
 *
 * // Usage with Style constructor
 * const style = new Style(styledText);
 *
 * // Or with factory function
 * const style2 = Style(styledText);
 * ```
 *
 * This interface combines:
 * - All StyleProperties for visual styling
 * - RendererOptions for output behavior control
 *
 * @see {@link StyleProperties} For available style properties
 * @see {@link RendererOptions} For renderer configuration options
 * @see {@link Style} Constructor that accepts StyleOptions
 */
export interface StyleOptions extends StyleProperties {
    /** Renderer-specific options for output behavior control */
    renderer?: RendererOptions;
}
/**
 * Type guard to check if a value is a valid color
 */
export declare function isValidColor(value: unknown): value is ColorValue;
/**
 * Type guard to check if a value is a valid border style
 */
export declare function isValidBorderStyle(value: unknown): value is BorderType | BorderStyle;
/**
 * Utility type for partial style updates, allowing incremental style modifications.
 * Used for methods that update existing styles without requiring all properties.
 *
 * @example
 * ```typescript
 * // Partial updates for style merging
 * const baseStyle = Style().color('blue').padding({ top: 1 });
 *
 * const colorUpdate: StyleUpdate = {
 *   color: 'red',
 *   fontWeight: FontWeight.Bold
 * };
 *
 * const borderUpdate: StyleUpdate = {
 *   border: {
 *     style: BorderType.Thick,
 *     color: 'green'
 *   }
 * };
 *
 * // Apply updates
 * const updatedStyle = baseStyle.merge(colorUpdate).merge(borderUpdate);
 *
 * // Or use with spread operator
 * const combinedProps: StyleProperties = {
 *   ...baseStyle.properties,
 *   ...colorUpdate,
 *   ...borderUpdate
 * };
 * ```
 *
 * Common use cases:
 * - Style merging and composition
 * - Theme overrides and customization
 * - Conditional style application
 * - Partial style serialization/deserialization
 *
 * @see {@link StyleProperties} For the complete style interface
 * @see {@link Style.merge} Method that accepts StyleUpdate
 */
export type StyleUpdate = Partial<StyleProperties>;
/**
 * Utility type for style method results providing type safety for style operations.
 * Ensures that style methods return valid StyleProperties-compatible types.
 *
 * @example
 * ```typescript
 * // Type-safe style method implementation
 * function createStyledButton<T extends StyleProperties>(
 *   baseStyle: T
 * ): StyleResult<T> {
 *   return {
 *     ...baseStyle,
 *     padding: { top: 1, right: 2, bottom: 1, left: 2 },
 *     border: { style: BorderType.Normal },
 *     fontWeight: FontWeight.Bold
 *   } as StyleResult<T>;
 * }
 *
 * // Usage with type checking
 * const buttonStyle = createStyledButton({
 *   color: 'white',
 *   backgroundColor: 'blue'
 * });
 * ```
 *
 * This utility type:
 * - Ensures return types conform to StyleProperties
 * - Provides compile-time type checking for style operations
 * - Maintains type safety in style transformation functions
 *
 * @template T The input type, must extend StyleProperties
 * @see {@link StyleProperties} For the base style interface
 * @see {@link StyleUpdate} For partial style updates
 */
export type StyleResult<T> = T extends StyleProperties ? T : never;
//# sourceMappingURL=types.d.ts.map