/**
 * Core Style class - foundation for immutable styling
 *
 * This implements the complete Style class with immutable pattern,
 * fluent API design, and efficient memory management.
 */
import { Renderer } from './renderer';
import { type BorderConfig, type BorderStyle, BorderType, type ColorValue, FontStyle, FontWeight, type HeightConfig, HorizontalAlignment, type MarginConfig, type PaddingConfig, type StyleOptions, type StyleProperties, type TextDecoration, type TransformFunction, VerticalAlignment, type WidthConfig } from './types';
export declare class Style {
    private readonly properties;
    private readonly _renderer;
    constructor(options?: StyleOptions, renderer?: Renderer);
    /**
     * Getter property that returns the render method as a bound function.
     * This enables Go-like method references: `NewStyle().color('red').render`
     * which can then be called as a function: `renderFunc('text')`
     */
    get render(): (text: string) => string;
    /**
     * Private method to efficiently clone properties for immutable operations.
     * Uses shallow cloning where safe and deep cloning for nested objects.
     *
     * @param props - Properties to clone
     * @returns Deeply cloned properties
     */
    private deepCloneProperties;
    /**
     * Private utility method to create a new Style instance with specified properties removed.
     * This is used for unset methods to handle exactOptionalPropertyTypes correctly.
     *
     * @param propertyKeys - The property keys to remove
     * @returns New Style instance without the specified properties
     */
    private unsetProperties;
    /**
     * Private method to create a new Style instance with updated properties.
     * This is the core method that ensures immutability and efficient cloning.
     *
     * @param updates - Properties to merge with current properties
     * @returns New Style instance with merged properties
     */
    private clone;
    /**
     * Render applies the style to the given text and returns the styled result.
     * This method applies colors, layout, padding, and all other styling properties
     * with automatic terminal capability detection and color degradation.
     *
     * The rendering process follows this order:
     * 1. Normalize whitespace (convert tabs to spaces)
     * 2. Apply transform function if specified
     * 3. Apply dimension constraints (width/height, wrapping, truncation)
     * 4. Apply text alignment (horizontal/vertical)
     * 5. Apply padding
     * 6. Apply text styling (bold, italic, colors)
     * 7. Apply margins
     * 8. Apply borders
     *
     * @param text - The text content to style
     * @returns The styled text with ANSI escape sequences and layout applied
     *
     * @example
     * ```typescript
     * const style = new Style().color('#ff0000').bold(true);
     * const result = style.render('Hello World');
     * console.log(result); // Red bold text
     * ```
     *
     * @example
     * ```typescript
     * // Rendering with layout constraints
     * const boxStyle = new Style()
     *   .width(20)
     *   .padding(1)
     *   .borderStyle(BorderType.Single)
     *   .alignCenter();
     * const box = boxStyle.render('Centered Content');
     * ```
     *
     * @see {@link renderWith} For rendering with a specific renderer
     * @see {@link String} For rendering preset content
     */
    renderMethod(text: string): string;
    /**
     * Complete render implementation matching Go Lipgloss exactly
     * This follows the exact same order and logic as the Go version
     */
    /**
     * Apply styling for Ascii profile (no colors, no ANSI codes) - matches Go behavior exactly
     * This handles layout, padding, alignment, etc. without any terminal escape sequences
     */
    private applyPlainTextStyling;
    /**
     * Convert a ColorValue to a TerminalColor, matching Go's colorOrNil function
     * Returns null if colors are disabled (Profile.Ascii)
     */
    private colorOrNil;
    private renderComplete;
    /**
     * Helper methods for the complete render implementation
     */
    private getBooleanProperty;
    private getNumericProperty;
    private getPositionProperty;
    private hasNoProperties;
    private maybeConvertTabs;
    private padLeft;
    private padRight;
    private padTop;
    private padBottom;
    private truncateToMaxWidth;
    private truncateToMaxHeight;
    private getColorSequence;
    private applyBorder;
    /**
     * Get the renderer instance used by this style.
     * The renderer handles the actual ANSI escape sequence generation
     * and terminal capability detection.
     *
     * @returns The renderer instance used for styling operations
     *
     * @example
     * ```typescript
     * const style = new Style();
     * const renderer = style.getRenderer();
     * const capabilities = renderer.getTerminalCapabilities();
     * ```
     *
     * @see {@link withRenderer} For creating a style with a different renderer
     * @see {@link renderWith} For one-time rendering with a specific renderer
     */
    getRenderer(): Renderer;
    /**
     * Create a new Style instance with a different renderer.
     * This allows you to change rendering behavior (e.g., color output,
     * terminal capabilities) without affecting the original style.
     *
     * @param renderer - The new renderer to use for styling operations
     * @returns A new Style instance with the specified renderer and current properties
     *
     * @example
     * ```typescript
     * const style = new Style().color('#ff0000');
     * const noColorRenderer = new Renderer({ colorOutput: false });
     * const noColorStyle = style.withRenderer(noColorRenderer);
     * ```
     *
     * @see {@link getRenderer} For accessing the current renderer
     * @see {@link renderWith} For one-time rendering with a specific renderer
     */
    withRenderer(renderer: Renderer): Style;
    /**
     * Render text with a specific renderer without changing this style's renderer.
     * This is useful for one-time rendering with different settings or testing
     * how the style would look with different terminal capabilities.
     *
     * @param text - The text content to render
     * @param renderer - The renderer to use for this specific rendering operation
     * @returns The styled text using the specified renderer
     *
     * @example
     * ```typescript
     * const style = new Style().color('#ff0000').bold(true);
     * const noColorRenderer = new Renderer({ colorOutput: false });
     *
     * // Normal rendering with colors
     * const colored = style.render('Hello');
     *
     * // One-time rendering without colors
     * const plain = style.renderWith('Hello', noColorRenderer);
     * ```
     *
     * @see {@link render} For normal rendering with the style's renderer
     * @see {@link withRenderer} For creating a new style with a different renderer
     */
    renderWith(text: string, renderer: Renderer): string;
    /**
     * Apply width and height constraints to text content.
     * Handles wrapping, truncation, and overflow scenarios.
     *
     * @param text - The text content to constrain
     * @returns Text with dimension constraints applied
     */
    private applyDimensionConstraints;
    /**
     * Apply text alignment based on style properties.
     *
     * @param text - The text content to align
     * @returns Text with alignment applied
     */
    private applyAlignment;
    /**
     * Calculate the target width for padding application.
     *
     * @param content - The content to calculate width for
     * @returns Target width or undefined if not constrained
     */
    private calculateTargetWidth;
    /**
     * Apply text styling (bold, italic, underline, strikethrough) using Go-compatible ANSI sequences.
     * This matches the exact output format of Go's lipgloss library.
     *
     * @param text - The text content to style
     * @returns Text with styling applied using Go-compatible ANSI sequences
     */
    private applyTextStyling;
    /**
     * Check if any text styling properties are set
     */
    private hasTextStyling;
    /**
     * Create a new Style instance with the same properties.
     * This creates a deep copy of the current style, useful for creating
     * variations without affecting the original.
     *
     * @returns A new Style instance with identical properties
     *
     * @example
     * ```typescript
     * const baseStyle = new Style().color('#ff0000').padding(2);
     * const variant = baseStyle.copy().backgroundColor('#0000ff');
     * // baseStyle is unchanged, variant has additional background color
     * ```
     *
     * @see {@link Copy} For Go Lipgloss API compatibility
     * @see {@link clone} For internal cloning with property updates
     */
    copy(): Style;
    /**
     * Get the current style properties (read-only).
     * Returns a frozen object containing all current style properties.
     * This is useful for introspection, debugging, or creating custom renderers.
     *
     * @returns A frozen copy of the current style properties
     *
     * @example
     * ```typescript
     * const style = new Style().color('#ff0000').bold(true).padding(2);
     * const props = style.getProperties();
     * console.log(props.color); // '#ff0000'
     * console.log(props.fontWeight); // FontWeight.Bold
     * console.log(props.padding); // { top: 2, right: 2, bottom: 2, left: 2 }
     * ```
     *
     * @see Individual getter methods for specific properties
     */
    getProperties(): Readonly<StyleProperties>;
    /**
     * Get the current foreground color.
     *
     * @returns The current foreground color value or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().color('#ff0000');
     * console.log(style.getColor()); // '#ff0000'
     *
     * const unstyledStyle = new Style();
     * console.log(unstyledStyle.getColor()); // undefined
     * ```
     *
     * @see {@link color} For setting the foreground color
     * @see {@link Foreground} For Go Lipgloss API compatibility
     */
    getColor(): ColorValue | undefined;
    /**
     * Get the current background color.
     *
     * @returns The current background color value or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().backgroundColor('#0000ff');
     * console.log(style.getBackgroundColor()); // '#0000ff'
     *
     * const unstyledStyle = new Style();
     * console.log(unstyledStyle.getBackgroundColor()); // undefined
     * ```
     *
     * @see {@link backgroundColor} For setting the background color
     * @see {@link Background} For Go Lipgloss API compatibility
     */
    getBackgroundColor(): ColorValue | undefined;
    /**
     * Get the current font weight.
     *
     * @returns The current font weight value or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().bold(true);
     * console.log(style.getFontWeight()); // FontWeight.Bold
     *
     * const faintStyle = new Style().faint(true);
     * console.log(faintStyle.getFontWeight()); // FontWeight.Faint
     * ```
     *
     * @see {@link fontWeight} For setting font weight
     * @see {@link bold} For setting bold text
     * @see {@link faint} For setting faint/dim text
     */
    getFontWeight(): FontWeight | undefined;
    /**
     * Get the current font style.
     *
     * @returns The current font style value or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().italic(true);
     * console.log(style.getFontStyle()); // FontStyle.Italic
     *
     * const normalStyle = new Style().italic(false);
     * console.log(normalStyle.getFontStyle()); // FontStyle.Normal
     * ```
     *
     * @see {@link fontStyle} For setting font style
     * @see {@link italic} For setting italic text
     */
    getFontStyle(): FontStyle | undefined;
    /**
     * Get the current text decorations.
     *
     * @returns The current text decoration configuration or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().underline(true).strikethrough(true);
     * const decorations = style.getTextDecoration();
     * console.log(decorations);
     * // { underline: true, strikethrough: true }
     * ```
     *
     * @see {@link textDecoration} For setting text decorations
     * @see {@link underline} For setting underline decoration
     * @see {@link strikethrough} For setting strikethrough decoration
     */
    getTextDecoration(): TextDecoration | undefined;
    /**
     * Get the current width configuration.
     *
     * @returns The current width configuration or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().width(40);
     * console.log(style.getWidth()); // 40
     *
     * const autoStyle = new Style().width('auto');
     * console.log(autoStyle.getWidth()); // 'auto'
     * ```
     *
     * @see {@link width} For setting width
     * @see {@link Width} For Go Lipgloss API compatibility
     */
    getWidth(): WidthConfig | undefined;
    /**
     * Get the current height configuration.
     *
     * @returns The current height configuration or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().height(20);
     * console.log(style.getHeight()); // 20
     *
     * const autoStyle = new Style().height('fit-content');
     * console.log(autoStyle.getHeight()); // 'fit-content'
     * ```
     *
     * @see {@link height} For setting height
     * @see {@link Height} For Go Lipgloss API compatibility
     */
    getHeight(): HeightConfig | undefined;
    /**
     * Get the current padding configuration.
     * Returns a copy to prevent external modification.
     *
     * @returns A copy of the current padding configuration or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().padding(2, 4);
     * const padding = style.getPadding();
     * console.log(padding);
     * // { top: 2, right: 4, bottom: 2, left: 4 }
     * ```
     *
     * @see {@link padding} For setting padding with shorthand
     * @see {@link paddingConfig} For setting padding with object
     * @see {@link getHorizontalPadding} For total horizontal padding
     * @see {@link getVerticalPadding} For total vertical padding
     */
    getPadding(): PaddingConfig | undefined;
    /**
     * Get the current margin configuration.
     * Returns a copy to prevent external modification.
     *
     * @returns A copy of the current margin configuration or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().margin(1, 2, 3, 4);
     * const margin = style.getMargin();
     * console.log(margin);
     * // { top: 1, right: 2, bottom: 3, left: 4 }
     * ```
     *
     * @see {@link margin} For setting margin with shorthand
     * @see {@link marginConfig} For setting margin with object
     * @see {@link getMargins} For margin values with defaults
     * @see {@link getHorizontalMargins} For total horizontal margins
     * @see {@link getVerticalMargins} For total vertical margins
     */
    getMargin(): MarginConfig | undefined;
    /**
     * Get the current margin background color.
     * This color is applied to the margin areas around the content.
     *
     * @returns The current margin background color or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .margin(2)
     *   .marginBackground('#ff0000');
     * console.log(style.getMarginBackground()); // '#ff0000'
     * ```
     *
     * @see {@link marginBackground} For setting margin background color
     */
    getMarginBackground(): ColorValue | undefined;
    /**
     * Get the current horizontal alignment.
     *
     * @returns The current horizontal alignment setting or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().alignCenter();
     * console.log(style.getHorizontalAlignment()); // HorizontalAlignment.Center
     *
     * const leftStyle = new Style().alignLeft();
     * console.log(leftStyle.getHorizontalAlignment()); // HorizontalAlignment.Left
     * ```
     *
     * @see {@link horizontalAlignment} For setting horizontal alignment
     * @see {@link alignLeft} {@link alignCenter} {@link alignRight} For convenience methods
     */
    getHorizontalAlignment(): HorizontalAlignment | undefined;
    /**
     * Get the current vertical alignment.
     *
     * @returns The current vertical alignment setting or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().alignMiddle();
     * console.log(style.getVerticalAlignment()); // VerticalAlignment.Center
     *
     * const topStyle = new Style().alignTop();
     * console.log(topStyle.getVerticalAlignment()); // VerticalAlignment.Top
     * ```
     *
     * @see {@link verticalAlignment} For setting vertical alignment
     * @see {@link alignTop} {@link alignMiddle} {@link alignBottom} For convenience methods
     * @see {@link valign} For Go-style string-based alignment
     */
    getVerticalAlignment(): VerticalAlignment | undefined;
    /**
     * Get the current border configuration.
     * Returns a copy to prevent external modification.
     *
     * @returns A copy of the current border configuration or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderColor('#ff0000');
     * const border = style.getBorder();
     * console.log(border.style); // BorderType.Single
     * console.log(border.color); // '#ff0000'
     * ```
     *
     * @see {@link border} For setting complete border configuration
     * @see {@link borderStyle} For setting border style
     * @see {@link borderColor} For setting border color
     */
    getBorder(): BorderConfig | undefined;
    /**
     * Get the current transform value.
     * Returns the original value passed to transform() - either a string or function.
     *
     * @returns The original transform value (string or function) or undefined if not set
     *
     * @example
     * ```typescript
     * const style1 = new Style().transform('uppercase');
     * console.log(style1.getTransform()); // 'uppercase'
     *
     * const style2 = new Style().transform(text => text.toUpperCase());
     * const transformFn = style2.getTransform();
     * console.log(typeof transformFn); // 'function'
     * ```
     *
     * @see {@link transform} For setting transform function
     */
    getTransform(): TransformFunction | string | undefined;
    /**
     * Get the current word wrap setting.
     * When true, text will wrap at word boundaries. When false, text will be truncated.
     *
     * @returns The current word wrap setting or undefined if not set (defaults to true)
     *
     * @example
     * ```typescript
     * const wrapStyle = new Style().wordWrap(true);
     * console.log(wrapStyle.getWordWrap()); // true
     *
     * const truncateStyle = new Style().wordWrap(false);
     * console.log(truncateStyle.getWordWrap()); // false
     * ```
     *
     * @see {@link wordWrap} For setting word wrap behavior
     * @see {@link maxWidth} For setting maximum width constraint
     */
    getWordWrap(): boolean | undefined;
    /**
     * Get the current maximum width setting.
     * Content exceeding this width will be wrapped or truncated based on wordWrap setting.
     *
     * @returns The current maximum width in characters or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().maxWidth(50);
     * console.log(style.getMaxWidth()); // 50
     * ```
     *
     * @see {@link maxWidth} For setting maximum width
     * @see {@link wordWrap} For controlling wrap vs truncate behavior
     * @see {@link width} For setting exact width
     */
    getMaxWidth(): number | undefined;
    /**
     * Get the current preserve whitespace setting.
     * When true, preserves all whitespace characters. When false, normalizes whitespace.
     *
     * @returns The current preserve whitespace setting or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().preserveWhitespace(true);
     * console.log(style.getPreserveWhitespace()); // true
     * ```
     *
     * @see {@link preserveWhitespace} For setting whitespace preservation
     * @see {@link tabWidth} For controlling tab expansion
     */
    getPreserveWhitespace(): boolean | undefined;
    /**
     * Get the current maximum height setting.
     * Content exceeding this height will be truncated.
     *
     * @returns The current maximum height in lines or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().maxHeight(10);
     * console.log(style.getMaxHeight()); // 10
     * ```
     *
     * @see {@link maxHeight} For setting maximum height
     * @see {@link height} For setting exact height
     */
    getMaxHeight(): number | undefined;
    /**
     * Get the current color whitespace setting.
     * When true, applies colors to whitespace characters. When false, only colors visible text.
     *
     * @returns The current color whitespace setting or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().colorWhitespace(true);
     * console.log(style.getColorWhitespace()); // true
     * ```
     *
     * @see {@link colorWhitespace} For setting whitespace coloring
     * @see {@link backgroundColor} For setting background colors that affect whitespace
     */
    getColorWhitespace(): boolean | undefined;
    /**
     * Get the current inline setting.
     * When true, renders content inline (no line breaks). When false, preserves line breaks.
     *
     * @returns The current inline rendering setting or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().inline(true);
     * console.log(style.getInline()); // true
     * ```
     *
     * @see {@link inline} For setting inline rendering
     */
    getInline(): boolean | undefined;
    /**
     * Get the current tab width setting.
     * Controls how many spaces tab characters are converted to during rendering.
     *
     * @returns The current tab width in spaces or undefined if not set (defaults to 4)
     *
     * @example
     * ```typescript
     * const style = new Style().tabWidth(8);
     * console.log(style.getTabWidth()); // 8
     * ```
     *
     * @see {@link tabWidth} For setting tab width
     * @see {@link preserveWhitespace} For controlling whitespace handling
     */
    getTabWidth(): number | undefined;
    /**
     * Get the string content set by SetString() method.
     *
     * @returns The raw string content or undefined if no content is set
     *
     * @example
     * ```typescript
     * const style = new Style().SetString('Hello World');
     * console.log(style.getString()); // 'Hello World'
     *
     * const emptyStyle = new Style();
     * console.log(emptyStyle.getString()); // undefined
     * ```
     */
    getString(): string | undefined;
    /**
     * Get the underline spaces setting.
     *
     * @returns The underline spaces setting or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().underlineSpaces(true);
     * console.log(style.getUnderlineSpaces()); // true
     * ```
     */
    getUnderlineSpaces(): boolean | undefined;
    /**
     * Get the strikethrough spaces setting.
     *
     * @returns The strikethrough spaces setting or undefined if not set
     *
     * @example
     * ```typescript
     * const style = new Style().strikethroughSpaces(true);
     * console.log(style.getStrikethroughSpaces()); // true
     * ```
     */
    getStrikethroughSpaces(): boolean | undefined;
    /**
     * Set the foreground color with validation and normalization.
     * Supports hex colors, RGB values, ANSI color codes, and named colors.
     *
     * @param color - The color value to apply (hex, RGB, ANSI, or named color)
     * @returns A new Style instance with the foreground color applied
     * @throws {Error} If the color value is invalid or unsupported
     *
     * @example
     * ```typescript
     * // Hex colors
     * const redStyle = new Style().color('#ff0000');
     * const shortHex = new Style().color('#f00');
     *
     * // RGB values
     * const greenStyle = new Style().color('rgb(0, 255, 0)');
     *
     * // ANSI colors
     * const blueStyle = new Style().color(12); // Bright blue
     *
     * // Named colors (if supported)
     * const yellowStyle = new Style().color('yellow');
     * ```
     *
     * @see {@link backgroundColor} For setting background color
     * @see {@link colors} For setting both foreground and background
     * @see {@link Foreground} For Go Lipgloss API compatibility
     * @see {@link adaptiveColors} For automatic color selection
     */
    color(color: ColorValue): Style;
    /**
     * Alias for color() method - matches Go API naming convention
     */
    foreground(color: ColorValue): Style;
    /**
     * Set the background color with validation and normalization.
     * Supports hex colors, RGB values, ANSI color codes, and named colors.
     *
     * @param color - The background color value to apply
     * @returns A new Style instance with the background color applied
     * @throws {Error} If the color value is invalid or unsupported
     *
     * @example
     * ```typescript
     * // Hex colors
     * const style = new Style().backgroundColor('#282c34');
     *
     * // RGB values
     * const rgbStyle = new Style().backgroundColor('rgb(40, 44, 52)');
     *
     * // ANSI colors
     * const ansiStyle = new Style().backgroundColor(236); // Dark gray
     * ```
     *
     * @see {@link color} For setting foreground color
     * @see {@link colors} For setting both colors at once
     * @see {@link Background} For Go Lipgloss API compatibility
     * @see {@link marginBackground} For setting margin background color
     */
    backgroundColor(color: ColorValue): Style;
    /**
     * Set both foreground and background colors at once for convenience.
     * This is equivalent to calling color() and backgroundColor() separately.
     *
     * @param foreground - The foreground color value
     * @param background - The background color value
     * @returns A new Style instance with both colors applied
     * @throws {Error} If either color value is invalid
     *
     * @example
     * ```typescript
     * const style = new Style().colors('#ffffff', '#000000'); // White on black
     *
     * // Equivalent to:
     * const equivalent = new Style()
     *   .color('#ffffff')
     *   .backgroundColor('#000000');
     * ```
     *
     * @see {@link color} For setting foreground only
     * @see {@link backgroundColor} For setting background only
     * @see {@link adaptiveColors} For automatic color selection
     */
    colors(foreground: ColorValue, background: ColorValue): Style;
    /**
     * Apply adaptive colors based on terminal background detection.
     * Automatically chooses appropriate foreground and background colors
     * based on the detected terminal theme (light or dark).
     *
     * This feature provides better readability across different terminal themes
     * without requiring manual color configuration.
     *
     * @returns A new Style instance with adaptive colors applied
     *
     * @example
     * ```typescript
     * // Automatically adapts to terminal theme
     * const adaptiveStyle = new Style().adaptiveColors();
     *
     * // On dark terminals: light text on dark background
     * // On light terminals: dark text on light background
     * const text = adaptiveStyle.render('Adaptive text');
     * ```
     *
     * @see {@link colors} For manual color setting
     * @see {@link color} {@link backgroundColor} For individual color setting
     */
    adaptiveColors(): Style;
    /**
     * Set font weight using FontWeight enum values.
     * Controls the boldness or thickness of the text.
     *
     * @param weight - The font weight to apply (Normal, Bold, or Faint)
     * @returns A new Style instance with the font weight applied
     *
     * @example
     * ```typescript
     * const boldStyle = new Style().fontWeight(FontWeight.Bold);
     * const faintStyle = new Style().fontWeight(FontWeight.Faint);
     * const normalStyle = new Style().fontWeight(FontWeight.Normal);
     * ```
     *
     * @see {@link bold} For convenient bold setting
     * @see {@link faint} For convenient faint setting
     * @see {@link FontWeight} For available weight values
     */
    fontWeight(weight: FontWeight): Style;
    /**
     * Make text bold or remove bold styling.
     * This is a convenience method for common font weight operations.
     *
     * @param enabled - Whether to enable bold styling (defaults to true)
     * @returns A new Style instance with bold styling applied or removed
     *
     * @example
     * ```typescript
     * const boldStyle = new Style().bold(); // Default: true
     * const explicitBold = new Style().bold(true);
     * const notBold = new Style().bold(false);
     *
     * // Method chaining
     * const styledText = new Style()
     *   .bold()
     *   .color('#ff0000')
     *   .render('Bold red text');
     * ```
     *
     * @see {@link fontWeight} For more granular weight control
     * @see {@link unsetBold} For explicit bold removal
     * @see {@link Bold} For Go Lipgloss API compatibility
     * @see {@link faint} For dim/faint text styling
     */
    bold(enabled?: boolean): Style;
    /**
     * Set font style using FontStyle enum values.
     * Controls text style properties like italic.
     *
     * @param style - The font style to apply (Normal or Italic)
     * @returns A new Style instance with the font style applied
     *
     * @example
     * ```typescript
     * const italicStyle = new Style().fontStyle(FontStyle.Italic);
     * const normalStyle = new Style().fontStyle(FontStyle.Normal);
     * ```
     *
     * @see {@link italic} For convenient italic setting
     * @see {@link FontStyle} For available style values
     */
    fontStyle(style: FontStyle): Style;
    /**
     * Make text italic or remove italic styling.
     * This is a convenience method for font style operations.
     *
     * @param enabled - Whether to enable italic styling (defaults to true)
     * @returns A new Style instance with italic styling applied or removed
     *
     * @example
     * ```typescript
     * const italicStyle = new Style().italic(); // Default: true
     * const explicitItalic = new Style().italic(true);
     * const notItalic = new Style().italic(false);
     *
     * // Combined with other styles
     * const emphasized = new Style()
     *   .italic()
     *   .bold()
     *   .color('#ff5733');
     * ```
     *
     * @see {@link fontStyle} For more granular style control
     * @see {@link unsetItalic} For explicit italic removal
     * @see {@link Italic} For Go Lipgloss API compatibility
     */
    italic(enabled?: boolean): Style;
    /**
     * Set text decorations using a TextDecoration configuration object.
     * Allows setting multiple decoration properties at once.
     *
     * @param decoration - The text decoration configuration object
     * @returns A new Style instance with the text decorations applied
     *
     * @example
     * ```typescript
     * const decorated = new Style().textDecoration({
     *   underline: true,
     *   strikethrough: false,
     *   reverse: false,
     *   blink: false,
     *   underlineSpaces: true,
     *   strikethroughSpaces: false
     * });
     *
     * // Partial decorations
     * const underlined = new Style().textDecoration({ underline: true });
     * ```
     *
     * @see {@link underline} {@link strikethrough} For individual decorations
     * @see {@link reverse} {@link blink} For special effects
     * @see {@link underlineSpaces} {@link strikethroughSpaces} For space handling
     */
    textDecoration(decoration: TextDecoration): Style;
    /**
     * Add or remove underline decoration.
     * This is a convenience method for underline text styling.
     *
     * @param enabled - Whether to enable underline decoration (defaults to true)
     * @returns A new Style instance with underline applied or removed
     *
     * @example
     * ```typescript
     * const underlined = new Style().underline(); // Default: true
     * const explicitUnderline = new Style().underline(true);
     * const noUnderline = new Style().underline(false);
     *
     * // Combined with other decorations
     * const highlighted = new Style()
     *   .underline()
     *   .bold()
     *   .color('#00ff00');
     * ```
     *
     * @see {@link textDecoration} For setting multiple decorations
     * @see {@link underlineSpaces} For controlling space underlining
     * @see {@link unsetUnderline} For explicit underline removal
     * @see {@link Underline} For Go Lipgloss API compatibility
     */
    underline(enabled?: boolean): Style;
    /**
     * Add or remove strikethrough decoration.
     * This is a convenience method for strikethrough text styling.
     *
     * @param enabled - Whether to enable strikethrough decoration (defaults to true)
     * @returns A new Style instance with strikethrough applied or removed
     *
     * @example
     * ```typescript
     * const struck = new Style().strikethrough(); // Default: true
     * const explicitStruck = new Style().strikethrough(true);
     * const notStruck = new Style().strikethrough(false);
     *
     * // Showing deleted content
     * const deletedText = new Style()
     *   .strikethrough()
     *   .color('#666666')
     *   .render('This text was deleted');
     * ```
     *
     * @see {@link textDecoration} For setting multiple decorations
     * @see {@link strikethroughSpaces} For controlling space strikethrough
     * @see {@link unsetStrikethrough} For explicit strikethrough removal
     * @see {@link Strikethrough} For Go Lipgloss API compatibility
     */
    strikethrough(enabled?: boolean): Style;
    /**
     * Add or remove reverse video decoration.
     * Swaps foreground and background colors for highlighting effect.
     *
     * @param enabled - Whether to enable reverse video (defaults to true)
     * @returns A new Style instance with reverse video applied or removed
     *
     * @example
     * ```typescript
     * const reversed = new Style().reverse(); // Default: true
     * const explicitReverse = new Style().reverse(true);
     * const notReversed = new Style().reverse(false);
     *
     * // Highlighting selected text
     * const selected = new Style()
     *   .color('#ffffff')
     *   .backgroundColor('#000000')
     *   .reverse()
     *   .render('Selected');
     * ```
     *
     * @see {@link textDecoration} For setting multiple decorations
     * @see {@link unsetReverse} For explicit reverse removal
     */
    reverse(enabled?: boolean): Style;
    /**
     * Add or remove blink decoration.
     * Creates blinking/flashing text effect (terminal support varies).
     *
     * @param enabled - Whether to enable blinking text (defaults to true)
     * @returns A new Style instance with blink applied or removed
     *
     * @example
     * ```typescript
     * const blinking = new Style().blink(); // Default: true
     * const explicitBlink = new Style().blink(true);
     * const notBlinking = new Style().blink(false);
     *
     * // Alert or warning text
     * const alert = new Style()
     *   .blink()
     *   .color('#ff0000')
     *   .bold()
     *   .render('WARNING!');
     * ```
     *
     * @note Blink support varies across terminals and may be disabled by users
     * @see {@link textDecoration} For setting multiple decorations
     * @see {@link unsetBlink} For explicit blink removal
     * @see {@link Blink} For Go Lipgloss API compatibility
     */
    blink(enabled?: boolean): Style;
    /**
     * Make text faint/dim or remove faint styling.
     * Creates dimmed or low-intensity text appearance.
     *
     * @param enabled - Whether to enable faint styling (defaults to true)
     * @returns A new Style instance with faint styling applied or removed
     *
     * @example
     * ```typescript
     * const faint = new Style().faint(); // Default: true
     * const explicitFaint = new Style().faint(true);
     * const notFaint = new Style().faint(false);
     *
     * // Secondary or help text
     * const helpText = new Style()
     *   .faint()
     *   .color('#888888')
     *   .render('Press any key to continue...');
     * ```
     *
     * @see {@link fontWeight} For more granular weight control
     * @see {@link bold} For bold text styling
     * @see {@link unsetFaint} For explicit faint removal
     * @see {@link Faint} For Go Lipgloss API compatibility
     */
    faint(enabled?: boolean): Style;
    /**
     * Set whether underline decoration should apply to space characters.
     * When true, spaces within underlined text are also underlined.
     *
     * @param enabled - Whether to underline spaces (defaults to true)
     * @returns A new Style instance with underline spaces setting applied
     *
     * @example
     * ```typescript
     * // Underline spaces (default behavior)
     * const withSpaces = new Style()
     *   .underline()
     *   .underlineSpaces(true);
     *
     * // Don't underline spaces
     * const withoutSpaces = new Style()
     *   .underline()
     *   .underlineSpaces(false);
     *
     * console.log(withSpaces.render('hello world')); // h̲e̲l̲l̲o̲ ̲w̲o̲r̲l̲d̲
     * console.log(withoutSpaces.render('hello world')); // h̲e̲l̲l̲o̲ w̲o̲r̲l̲d̲
     * ```
     *
     * @see {@link underline} For setting underline decoration
     * @see {@link strikethroughSpaces} For similar strikethrough control
     * @see {@link textDecoration} For complete decoration configuration
     */
    underlineSpaces(enabled?: boolean): Style;
    /**
     * Set whether strikethrough decoration should apply to space characters.
     * When true, spaces within strikethrough text are also struck through.
     *
     * @param enabled - Whether to strikethrough spaces (defaults to true)
     * @returns A new Style instance with strikethrough spaces setting applied
     *
     * @example
     * ```typescript
     * // Strikethrough spaces (default behavior)
     * const withSpaces = new Style()
     *   .strikethrough()
     *   .strikethroughSpaces(true);
     *
     * // Don't strikethrough spaces
     * const withoutSpaces = new Style()
     *   .strikethrough()
     *   .strikethroughSpaces(false);
     *
     * console.log(withSpaces.render('hello world')); // h̶e̶l̶l̶o̶ ̶w̶o̶r̶l̶d̶
     * console.log(withoutSpaces.render('hello world')); // h̶e̶l̶l̶o̶ w̶o̶r̶l̶d̶
     * ```
     *
     * @see {@link strikethrough} For setting strikethrough decoration
     * @see {@link underlineSpaces} For similar underline control
     * @see {@link textDecoration} For complete decoration configuration
     */
    strikethroughSpaces(enabled?: boolean): Style;
    /**
     * Remove bold styling by setting font weight to normal.
     * This is an explicit method for removing bold styling.
     *
     * @returns A new Style instance with bold styling removed
     *
     * @example
     * ```typescript
     * const boldStyle = new Style().bold(true);
     * const normalStyle = boldStyle.unsetBold();
     *
     * // Alternative using bold(false)
     * const alsoNormal = boldStyle.bold(false);
     * ```
     *
     * @see {@link bold} For setting/removing bold with parameter
     * @see {@link fontWeight} For setting specific font weights
     */
    unsetBold(): Style;
    /**
     * Remove italic styling by setting font style to normal.
     * This is an explicit method for removing italic styling.
     *
     * @returns A new Style instance with italic styling removed
     *
     * @example
     * ```typescript
     * const italicStyle = new Style().italic(true);
     * const normalStyle = italicStyle.unsetItalic();
     *
     * // Alternative using italic(false)
     * const alsoNormal = italicStyle.italic(false);
     * ```
     *
     * @see {@link italic} For setting/removing italic with parameter
     * @see {@link fontStyle} For setting specific font styles
     */
    unsetItalic(): Style;
    /**
     * Remove underline decoration.
     * This is an explicit method for removing underline styling.
     *
     * @returns A new Style instance with underline decoration removed
     *
     * @example
     * ```typescript
     * const underlinedStyle = new Style().underline(true);
     * const plainStyle = underlinedStyle.unsetUnderline();
     *
     * // Alternative using underline(false)
     * const alsoPlain = underlinedStyle.underline(false);
     * ```
     *
     * @see {@link underline} For setting/removing underline with parameter
     * @see {@link textDecoration} For setting multiple decorations
     */
    unsetUnderline(): Style;
    /**
     * Remove strikethrough decoration.
     * This is an explicit method for removing strikethrough styling.
     *
     * @returns A new Style instance with strikethrough decoration removed
     *
     * @example
     * ```typescript
     * const struckStyle = new Style().strikethrough(true);
     * const plainStyle = struckStyle.unsetStrikethrough();
     *
     * // Alternative using strikethrough(false)
     * const alsoPlain = struckStyle.strikethrough(false);
     * ```
     *
     * @see {@link strikethrough} For setting/removing strikethrough with parameter
     * @see {@link textDecoration} For setting multiple decorations
     */
    unsetStrikethrough(): Style;
    /**
     * Remove all text decorations.
     * Clears underline, strikethrough, reverse, blink, and space decoration settings.
     *
     * @returns A new Style instance with all text decorations removed
     *
     * @example
     * ```typescript
     * const decoratedStyle = new Style()
     *   .underline(true)
     *   .strikethrough(true)
     *   .reverse(true);
     *
     * const plainStyle = decoratedStyle.unsetTextDecorations();
     * // All decorations are now cleared
     * ```
     *
     * @see {@link textDecoration} For setting specific decorations
     * @see {@link unsetUnderline} {@link unsetStrikethrough} For individual removal
     */
    unsetTextDecorations(): Style;
    /**
     * Reset all typography styles to their defaults.
     * Removes font weight, font style, and all text decorations.
     *
     * @returns A new Style instance with all typography styling reset
     *
     * @example
     * ```typescript
     * const styledText = new Style()
     *   .bold(true)
     *   .italic(true)
     *   .underline(true)
     *   .color('#ff0000');
     *
     * const resetTypography = styledText.unsetTypography();
     * // Only color remains, typography is reset
     * ```
     *
     * @see {@link unsetBold} {@link unsetItalic} {@link unsetTextDecorations} For individual resets
     */
    unsetTypography(): Style;
    /**
     * Remove reverse video decoration.
     * This is an explicit method for removing reverse video styling.
     *
     * @returns A new Style instance with reverse video decoration removed
     *
     * @example
     * ```typescript
     * const reversedStyle = new Style().reverse(true);
     * const normalStyle = reversedStyle.unsetReverse();
     *
     * // Alternative using reverse(false)
     * const alsoNormal = reversedStyle.reverse(false);
     * ```
     *
     * @see {@link reverse} For setting/removing reverse with parameter
     * @see {@link textDecoration} For setting multiple decorations
     */
    unsetReverse(): Style;
    /**
     * Remove blink decoration.
     * This is an explicit method for removing blink styling.
     *
     * @returns A new Style instance with blink decoration removed
     *
     * @example
     * ```typescript
     * const blinkingStyle = new Style().blink(true);
     * const steadyStyle = blinkingStyle.unsetBlink();
     *
     * // Alternative using blink(false)
     * const alsoSteady = blinkingStyle.blink(false);
     * ```
     *
     * @see {@link blink} For setting/removing blink with parameter
     * @see {@link textDecoration} For setting multiple decorations
     */
    unsetBlink(): Style;
    /**
     * Remove faint styling by setting font weight to normal.
     * This is an explicit method for removing faint/dim styling.
     *
     * @returns A new Style instance with faint styling removed
     *
     * @example
     * ```typescript
     * const faintStyle = new Style().faint(true);
     * const normalStyle = faintStyle.unsetFaint();
     *
     * // Alternative using faint(false)
     * const alsoNormal = faintStyle.faint(false);
     * ```
     *
     * @see {@link faint} For setting/removing faint with parameter
     * @see {@link fontWeight} For setting specific font weights
     */
    unsetFaint(): Style;
    /**
     * Remove foreground color.
     * Clears the current foreground color setting, reverting to default.
     *
     * @returns A new Style instance with foreground color removed
     *
     * @example
     * ```typescript
     * const coloredStyle = new Style().color('#ff0000');
     * const defaultStyle = coloredStyle.unsetForeground();
     * // Text will use terminal's default foreground color
     * ```
     *
     * @see {@link color} For setting foreground color
     * @see {@link unsetBackground} For removing background color
     */
    unsetForeground(): Style;
    /**
     * Remove background color.
     * Clears the current background color setting, reverting to default.
     *
     * @returns A new Style instance with background color removed
     *
     * @example
     * ```typescript
     * const coloredStyle = new Style().backgroundColor('#0000ff');
     * const defaultStyle = coloredStyle.unsetBackground();
     * // Text will use terminal's default background color
     * ```
     *
     * @see {@link backgroundColor} For setting background color
     * @see {@link unsetForeground} For removing foreground color
     */
    unsetBackground(): Style;
    /**
     * Remove horizontal alignment.
     * Clears the current horizontal alignment setting.
     *
     * @returns A new Style instance with horizontal alignment removed
     *
     * @example
     * ```typescript
     * const centeredStyle = new Style().alignCenter();
     * const unalignedStyle = centeredStyle.unsetAlignHorizontal();
     * // Text will use natural alignment
     * ```
     *
     * @see {@link horizontalAlignment} For setting horizontal alignment
     * @see {@link unsetAlignVertical} For removing vertical alignment
     * @see {@link unsetAlign} For removing both alignments
     */
    unsetAlignHorizontal(): Style;
    /**
     * Remove vertical alignment.
     * Clears the current vertical alignment setting.
     *
     * @returns A new Style instance with vertical alignment removed
     *
     * @example
     * ```typescript
     * const middleStyle = new Style().alignMiddle();
     * const unalignedStyle = middleStyle.unsetAlignVertical();
     * // Text will use natural alignment
     * ```
     *
     * @see {@link verticalAlignment} For setting vertical alignment
     * @see {@link unsetAlignHorizontal} For removing horizontal alignment
     * @see {@link unsetAlign} For removing both alignments
     */
    unsetAlignVertical(): Style;
    /**
     * Remove both horizontal and vertical alignment.
     * Clears all alignment settings in one operation.
     *
     * @returns A new Style instance with all alignment removed
     *
     * @example
     * ```typescript
     * const alignedStyle = new Style()
     *   .alignCenter()
     *   .alignMiddle();
     *
     * const unalignedStyle = alignedStyle.unsetAlign();
     * // Both horizontal and vertical alignment cleared
     * ```
     *
     * @see {@link align} For setting both alignments
     * @see {@link unsetAlignHorizontal} {@link unsetAlignVertical} For individual removal
     */
    unsetAlign(): Style;
    /**
     * Remove width constraint.
     * Clears the current width setting, allowing content to use natural width.
     *
     * @returns A new Style instance with width constraint removed
     *
     * @example
     * ```typescript
     * const fixedWidth = new Style().width(40);
     * const naturalWidth = fixedWidth.unsetWidth();
     * // Content will use its natural width
     * ```
     *
     * @see {@link width} For setting width constraints
     * @see {@link unsetHeight} For removing height constraints
     * @see {@link unsetMaxWidth} For removing maximum width
     */
    unsetWidth(): Style;
    /**
     * Remove height constraint.
     * Clears the current height setting, allowing content to use natural height.
     *
     * @returns A new Style instance with height constraint removed
     *
     * @example
     * ```typescript
     * const fixedHeight = new Style().height(20);
     * const naturalHeight = fixedHeight.unsetHeight();
     * // Content will use its natural height
     * ```
     *
     * @see {@link height} For setting height constraints
     * @see {@link unsetWidth} For removing width constraints
     * @see {@link unsetMaxHeight} For removing maximum height
     */
    unsetHeight(): Style;
    /**
     * Remove maximum width constraint.
     * Clears the current maximum width setting.
     *
     * @returns A new Style instance with max width constraint removed
     *
     * @example
     * ```typescript
     * const constrainedStyle = new Style().maxWidth(50);
     * const unconstrainedStyle = constrainedStyle.unsetMaxWidth();
     * // Content can exceed 50 characters
     * ```
     *
     * @see {@link maxWidth} For setting maximum width
     * @see {@link unsetWidth} For removing exact width
     * @see {@link wordWrap} For controlling wrap behavior
     */
    unsetMaxWidth(): Style;
    /**
     * Remove maximum height constraint.
     * Clears the current maximum height setting.
     *
     * @returns A new Style instance with max height constraint removed
     *
     * @example
     * ```typescript
     * const constrainedStyle = new Style().maxHeight(10);
     * const unconstrainedStyle = constrainedStyle.unsetMaxHeight();
     * // Content can exceed 10 lines
     * ```
     *
     * @see {@link maxHeight} For setting maximum height
     * @see {@link unsetHeight} For removing exact height
     */
    unsetMaxHeight(): Style;
    /**
     * Remove custom tab width setting.
     * Resets tab width to the default value (4 spaces).
     *
     * @returns A new Style instance with tab width reset to default
     *
     * @example
     * ```typescript
     * const customTabStyle = new Style().tabWidth(8);
     * const defaultTabStyle = customTabStyle.unsetTabWidth();
     * // Tabs will now expand to 4 spaces (default)
     * ```
     *
     * @see {@link tabWidth} For setting custom tab width
     */
    unsetTabWidth(): Style;
    /**
     * Remove inline rendering setting.
     * Clears the inline setting, allowing normal line break behavior.
     *
     * @returns A new Style instance with inline setting removed
     *
     * @example
     * ```typescript
     * const inlineStyle = new Style().inline(true);
     * const blockStyle = inlineStyle.unsetInline();
     * // Line breaks will be preserved
     * ```
     *
     * @see {@link inline} For setting inline rendering
     */
    unsetInline(): Style;
    /**
     * Remove whitespace coloring setting.
     * Clears the whitespace coloring setting, reverting to default behavior.
     *
     * @returns A new Style instance with whitespace coloring removed
     *
     * @example
     * ```typescript
     * const coloredSpaces = new Style().colorWhitespace(true);
     * const defaultSpaces = coloredSpaces.unsetColorWhitespace();
     * // Whitespace coloring behavior reset to default
     * ```
     *
     * @see {@link colorWhitespace} For setting whitespace coloring
     * @see {@link unsetWhitespaceChars} For Go compatibility alias
     */
    unsetColorWhitespace(): Style;
    /**
     * Remove whitespace characters setting.
     * This is an alias for unsetColorWhitespace() for Go Lipgloss compatibility.
     *
     * @returns A new Style instance with whitespace character styling removed
     *
     * @example
     * ```typescript
     * const style = new Style().colorWhitespace(true);
     * const resetStyle = style.unsetWhitespaceChars();
     * // Same as style.unsetColorWhitespace()
     * ```
     *
     * @see {@link unsetColorWhitespace} For the primary method
     * @see {@link colorWhitespace} For setting whitespace coloring
     */
    unsetWhitespaceChars(): Style;
    /**
     * Remove transform function.
     * Clears the current transform function setting.
     *
     * @returns A new Style instance with transform function removed
     *
     * @example
     * ```typescript
     * const transformedStyle = new Style().transform(text => text.toUpperCase());
     * const plainStyle = transformedStyle.unsetTransform();
     * // Transform function is removed
     * ```
     *
     * @see {@link transform} For setting transform function
     */
    unsetTransform(): Style;
    /**
     * Remove preset string content.
     * Clears the string content set by SetString() method.
     *
     * @returns A new Style instance with preset string content removed
     *
     * @example
     * ```typescript
     * const presetStyle = new Style().SetString('Hello World');
     * const plainStyle = presetStyle.unsetString();
     * // Preset string content is removed
     * ```
     *
     * @see {@link SetString} For setting preset string content
     */
    unsetString(): Style;
    /**
     * Remove underline spaces setting.
     * Clears the underline spaces setting from text decoration.
     *
     * @returns A new Style instance with underline spaces setting removed
     *
     * @example
     * ```typescript
     * const style = new Style().underline(true).underlineSpaces(false);
     * const resetStyle = style.unsetUnderlineSpaces();
     * // Underline spaces setting is removed, but underline remains
     * ```
     *
     * @see {@link underlineSpaces} For setting underline spaces
     * @see {@link unsetUnderline} For removing underline decoration
     */
    unsetUnderlineSpaces(): Style;
    /**
     * Remove strikethrough spaces setting.
     * Clears the strikethrough spaces setting from text decoration.
     *
     * @returns A new Style instance with strikethrough spaces setting removed
     *
     * @example
     * ```typescript
     * const style = new Style().strikethrough(true).strikethroughSpaces(false);
     * const resetStyle = style.unsetStrikethroughSpaces();
     * // Strikethrough spaces setting is removed, but strikethrough remains
     * ```
     *
     * @see {@link strikethroughSpaces} For setting strikethrough spaces
     * @see {@link unsetStrikethrough} For removing strikethrough decoration
     */
    unsetStrikethroughSpaces(): Style;
    /**
     * Remove custom renderer setting.
     * Resets the renderer to the default renderer.
     *
     * @returns A new Style instance with default renderer
     *
     * @example
     * ```typescript
     * const customRenderer = new Renderer({ colorProfile: ColorProfile.ANSI });
     * const customStyle = new Style({}, customRenderer);
     * const defaultStyle = customStyle.unsetRenderer();
     * // Renderer is reset to default
     * ```
     *
     * @see {@link renderer} For renderer information
     */
    unsetRenderer(): Style;
    /**
     * Remove all padding.
     * Clears all padding settings (top, right, bottom, left).
     *
     * @returns A new Style instance with all padding removed
     *
     * @example
     * ```typescript
     * const paddedStyle = new Style().padding(2, 4);
     * const unpaddedStyle = paddedStyle.unsetPadding();
     * // All padding removed
     * ```
     *
     * @see {@link padding} For setting padding
     * @see {@link unsetPaddingTop} {@link unsetPaddingRight} etc. For individual removal
     */
    unsetPadding(): Style;
    /**
     * Remove top padding.
     *
     * @returns A new Style instance with top padding removed
     */
    unsetPaddingTop(): Style;
    /**
     * Remove right padding.
     *
     * @returns A new Style instance with right padding removed
     */
    unsetPaddingRight(): Style;
    /**
     * Remove bottom padding.
     *
     * @returns A new Style instance with bottom padding removed
     */
    unsetPaddingBottom(): Style;
    /**
     * Remove left padding.
     *
     * @returns A new Style instance with left padding removed
     */
    unsetPaddingLeft(): Style;
    /**
     * Remove all margin.
     *
     * @returns A new Style instance with all margin removed
     */
    unsetMargin(): Style;
    /**
     * Remove all margins.
     * This is an alias for unsetMargin() for Go Lipgloss compatibility.
     *
     * @returns A new Style instance with all margins removed
     *
     * @example
     * ```typescript
     * const marginedStyle = new Style().margin(2, 4);
     * const plainStyle = marginedStyle.unsetMargins();
     * // Same as marginedStyle.unsetMargin()
     * ```
     *
     * @see {@link unsetMargin} For the primary method
     * @see {@link margin} For setting margins
     */
    unsetMargins(): Style;
    /**
     * Remove top margin.
     * Clears only the top margin while preserving left, right, and bottom margins.
     * If no other margins remain after removal, all margin properties are cleared.
     *
     * @returns A new Style instance with top margin removed
     *
     * @example
     * ```typescript
     * const style = new Style().margin(1, 2, 3, 4); // top, right, bottom, left
     * const withoutTop = style.unsetMarginTop();
     * // Margins are now: top: 0, right: 2, bottom: 3, left: 4
     *
     * const onlyTop = new Style().marginTop(5);
     * const cleared = onlyTop.unsetMarginTop();
     * // All margin properties are cleared
     * ```
     *
     * @see {@link marginTop} For setting top margin
     * @see {@link unsetMargin} For removing all margins
     * @see {@link unsetMarginBottom} {@link unsetMarginLeft} {@link unsetMarginRight} For other sides
     */
    unsetMarginTop(): Style;
    /**
     * Remove right margin.
     * Clears only the right margin while preserving top, bottom, and left margins.
     * If no other margins remain after removal, all margin properties are cleared.
     *
     * @returns A new Style instance with right margin removed
     *
     * @example
     * ```typescript
     * const style = new Style().margin(1, 2, 3, 4); // top, right, bottom, left
     * const withoutRight = style.unsetMarginRight();
     * // Margins are now: top: 1, right: 0, bottom: 3, left: 4
     *
     * const onlyRight = new Style().marginRight(5);
     * const cleared = onlyRight.unsetMarginRight();
     * // All margin properties are cleared
     * ```
     *
     * @see {@link marginRight} For setting right margin
     * @see {@link unsetMargin} For removing all margins
     * @see {@link unsetMarginTop} {@link unsetMarginBottom} {@link unsetMarginLeft} For other sides
     */
    unsetMarginRight(): Style;
    /**
     * Remove bottom margin.
     * Clears only the bottom margin while preserving top, right, and left margins.
     * If no other margins remain after removal, all margin properties are cleared.
     *
     * @returns A new Style instance with bottom margin removed
     *
     * @example
     * ```typescript
     * const style = new Style().margin(1, 2, 3, 4); // top, right, bottom, left
     * const withoutBottom = style.unsetMarginBottom();
     * // Margins are now: top: 1, right: 2, bottom: 0, left: 4
     *
     * const onlyBottom = new Style().marginBottom(5);
     * const cleared = onlyBottom.unsetMarginBottom();
     * // All margin properties are cleared
     * ```
     *
     * @see {@link marginBottom} For setting bottom margin
     * @see {@link unsetMargin} For removing all margins
     * @see {@link unsetMarginTop} {@link unsetMarginRight} {@link unsetMarginLeft} For other sides
     */
    unsetMarginBottom(): Style;
    /**
     * Remove left margin.
     * Clears only the left margin while preserving top, right, and bottom margins.
     * If no other margins remain after removal, all margin properties are cleared.
     *
     * @returns A new Style instance with left margin removed
     *
     * @example
     * ```typescript
     * const style = new Style().margin(1, 2, 3, 4); // top, right, bottom, left
     * const withoutLeft = style.unsetMarginLeft();
     * // Margins are now: top: 1, right: 2, bottom: 3, left: 0
     *
     * const onlyLeft = new Style().marginLeft(5);
     * const cleared = onlyLeft.unsetMarginLeft();
     * // All margin properties are cleared
     * ```
     *
     * @see {@link marginLeft} For setting left margin
     * @see {@link unsetMargin} For removing all margins
     * @see {@link unsetMarginTop} {@link unsetMarginRight} {@link unsetMarginBottom} For other sides
     */
    unsetMarginLeft(): Style;
    /**
     * Remove margin background color.
     *
     * @returns A new Style instance with margin background color removed
     */
    unsetMarginBackground(): Style;
    /**
     * Remove border style.
     *
     * @returns A new Style instance with border style removed
     */
    unsetBorderStyle(): Style;
    /**
     * Remove border foreground color.
     * Removes the general border color while preserving individual side colors.
     *
     * @returns A new Style instance with border foreground color removed
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderColor('#ff0000')
     *   .unsetBorderForeground();
     * // Border style remains, but general color is removed
     * ```
     *
     * @see {@link borderColor} For setting border foreground color
     * @see {@link unsetBorderBackground} For removing border background colors
     */
    unsetBorderForeground(): Style;
    /**
     * Remove border background color.
     * Removes all border background colors from all sides.
     *
     * @returns A new Style instance with border background color removed
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderTopBackgroundColor('#ff0000')
     *   .borderBottomBackgroundColor('#00ff00')
     *   .unsetBorderBackground();
     * // Border style remains, but all background colors are removed
     * ```
     *
     * @see {@link borderTopBackgroundColor} {@link borderRightBackgroundColor} etc. For setting individual background colors
     * @see {@link unsetBorderForeground} For removing border foreground color
     */
    unsetBorderBackground(): Style;
    /**
     * Remove top border.
     *
     * @returns A new Style instance with top border removed
     */
    unsetBorderTop(): Style;
    /**
     * Remove right border.
     *
     * @returns A new Style instance with right border removed
     */
    unsetBorderRight(): Style;
    /**
     * Remove bottom border.
     *
     * @returns A new Style instance with bottom border removed
     */
    unsetBorderBottom(): Style;
    /**
     * Remove left border.
     *
     * @returns A new Style instance with left border removed
     */
    unsetBorderLeft(): Style;
    /**
     * Remove top border color.
     *
     * @returns A new Style instance with top border color removed
     */
    unsetBorderTopColor(): Style;
    /**
     * Remove right border color.
     *
     * @returns A new Style instance with right border color removed
     */
    unsetBorderRightColor(): Style;
    /**
     * Remove bottom border color.
     *
     * @returns A new Style instance with bottom border color removed
     */
    unsetBorderBottomColor(): Style;
    /**
     * Remove left border color.
     *
     * @returns A new Style instance with left border color removed
     */
    unsetBorderLeftColor(): Style;
    /**
     * Remove top border background color.
     *
     * @returns A new Style instance with top border background color removed
     */
    unsetBorderTopBackground(): Style;
    /**
     * Remove right border background color.
     *
     * @returns A new Style instance with right border background color removed
     */
    unsetBorderRightBackground(): Style;
    /**
     * Remove bottom border background color.
     *
     * @returns A new Style instance with bottom border background color removed
     */
    unsetBorderBottomBackground(): Style;
    /**
     * Remove left border background color.
     *
     * @returns A new Style instance with left border background color removed
     */
    unsetBorderLeftBackground(): Style;
    /**
     * Remove top border foreground color.
     * Removes only the top border's foreground color while preserving other border properties.
     *
     * @returns A new Style instance with top border foreground color removed
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderTopColor('#ff0000')
     *   .borderBottomColor('#00ff00')
     *   .unsetBorderTopForeground();
     * // Bottom border color remains, top border color is removed
     * ```
     *
     * @see {@link borderTopColor} For setting top border foreground color
     * @see {@link unsetBorderTopBackground} For removing top border background color
     */
    unsetBorderTopForeground(): Style;
    /**
     * Remove right border foreground color.
     * Removes only the right border's foreground color while preserving other border properties.
     *
     * @returns A new Style instance with right border foreground color removed
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderRightColor('#ff0000')
     *   .borderLeftColor('#00ff00')
     *   .unsetBorderRightForeground();
     * // Left border color remains, right border color is removed
     * ```
     *
     * @see {@link borderRightColor} For setting right border foreground color
     * @see {@link unsetBorderRightBackground} For removing right border background color
     */
    unsetBorderRightForeground(): Style;
    /**
     * Remove bottom border foreground color.
     * Removes only the bottom border's foreground color while preserving other border properties.
     *
     * @returns A new Style instance with bottom border foreground color removed
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderBottomColor('#ff0000')
     *   .borderTopColor('#00ff00')
     *   .unsetBorderBottomForeground();
     * // Top border color remains, bottom border color is removed
     * ```
     *
     * @see {@link borderBottomColor} For setting bottom border foreground color
     * @see {@link unsetBorderBottomBackground} For removing bottom border background color
     */
    unsetBorderBottomForeground(): Style;
    /**
     * Remove left border foreground color.
     * Removes only the left border's foreground color while preserving other border properties.
     *
     * @returns A new Style instance with left border foreground color removed
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderLeftColor('#ff0000')
     *   .borderRightColor('#00ff00')
     *   .unsetBorderLeftForeground();
     * // Right border color remains, left border color is removed
     * ```
     *
     * @see {@link borderLeftColor} For setting left border foreground color
     * @see {@link unsetBorderLeftBackground} For removing left border background color
     */
    unsetBorderLeftForeground(): Style;
    /**
     * Set width with support for various configuration types.
     * Controls the exact width constraint for rendered content.
     *
     * @param width - The width configuration (number, 'auto', 'fit-content', 'max-content')
     * @returns A new Style instance with the width applied
     *
     * @example
     * ```typescript
     * // Fixed width in characters
     * const fixedWidth = new Style().width(40);
     *
     * // Automatic width based on content
     * const autoWidth = new Style().width('auto');
     *
     * // Fit content exactly
     * const fitContent = new Style().width('fit-content');
     *
     * // Use maximum content width
     * const maxContent = new Style().width('max-content');
     * ```
     *
     * @see {@link height} For setting height constraints
     * @see {@link maxWidth} For setting maximum width only
     * @see {@link Width} For Go Lipgloss API compatibility
     */
    width(width: WidthConfig): Style;
    /**
     * Set height with support for various configuration types.
     * Controls the exact height constraint for rendered content.
     *
     * @param height - The height configuration (number, 'auto', 'fit-content', 'max-content')
     * @returns A new Style instance with the height applied
     *
     * @example
     * ```typescript
     * // Fixed height in lines
     * const fixedHeight = new Style().height(20);
     *
     * // Automatic height based on content
     * const autoHeight = new Style().height('auto');
     *
     * // Fit content exactly
     * const fitContent = new Style().height('fit-content');
     *
     * // Use maximum content height
     * const maxContent = new Style().height('max-content');
     * ```
     *
     * @see {@link width} For setting width constraints
     * @see {@link maxHeight} For setting maximum height only
     * @see {@link Height} For Go Lipgloss API compatibility
     */
    height(height: HeightConfig): Style;
    /**
     * Set padding using CSS-style shorthand syntax.
     * Adds space inside the content area, between content and borders.
     *
     * Supports 1-4 values following CSS conventions:
     * - 1 value: applies to all sides
     * - 2 values: first is vertical (top/bottom), second is horizontal (left/right)
     * - 3 values: top, horizontal (left/right), bottom
     * - 4 values: top, right, bottom, left (clockwise)
     *
     * @param values - Padding values in spaces/characters (1-4 numbers)
     * @returns A new Style instance with the padding applied
     *
     * @example
     * ```typescript
     * // All sides: 2 spaces
     * const allSides = new Style().padding(2);
     *
     * // Vertical: 1, Horizontal: 3
     * const vertHoriz = new Style().padding(1, 3);
     *
     * // Top: 1, Horizontal: 2, Bottom: 3
     * const threeValues = new Style().padding(1, 2, 3);
     *
     * // Top: 1, Right: 2, Bottom: 3, Left: 4
     * const allDifferent = new Style().padding(1, 2, 3, 4);
     * ```
     *
     * @see {@link paddingConfig} For object-based padding configuration
     * @see {@link paddingTop} {@link paddingRight} etc. For individual sides
     * @see {@link Padding} For Go Lipgloss API compatibility
     * @see {@link margin} For external spacing
     */
    padding(...values: number[]): Style;
    /**
     * Set padding using a PaddingConfig object for explicit control.
     * Provides direct access to individual padding properties.
     *
     * @param padding - The padding configuration object with optional top, right, bottom, left properties
     * @returns A new Style instance with the padding applied
     *
     * @example
     * ```typescript
     * const style = new Style().paddingConfig({
     *   top: 1,
     *   right: 2,
     *   bottom: 1,
     *   left: 2
     * });
     *
     * // Partial configuration
     * const topOnly = new Style().paddingConfig({ top: 3 });
     * ```
     *
     * @see {@link padding} For shorthand syntax
     * @see {@link paddingTop} {@link paddingRight} etc. For individual sides
     */
    paddingConfig(padding: PaddingConfig): Style;
    /**
     * Set top padding.
     * Adds space above the content within the content area.
     *
     * @param value - Top padding value in spaces/characters
     * @returns A new Style instance with top padding applied
     *
     * @example
     * ```typescript
     * const style = new Style().paddingTop(3);
     *
     * // Combined with other padding
     * const combined = new Style()
     *   .paddingTop(2)
     *   .paddingLeft(4);
     * ```
     *
     * @see {@link padding} For setting all sides
     * @see {@link paddingVertical} For setting top and bottom together
     * @see {@link unsetPaddingTop} For removing top padding
     */
    paddingTop(value: number): Style;
    /**
     * Set right padding.
     * Adds space to the right of the content within the content area.
     *
     * @param value - Right padding value in spaces/characters
     * @returns A new Style instance with right padding applied
     *
     * @example
     * ```typescript
     * const style = new Style().paddingRight(3);
     *
     * // Combined with other padding
     * const combined = new Style()
     *   .paddingRight(2)
     *   .paddingLeft(4);
     * ```
     *
     * @see {@link padding} For setting all sides
     * @see {@link paddingHorizontal} For setting left and right together
     * @see {@link unsetPaddingRight} For removing right padding
     */
    paddingRight(value: number): Style;
    /**
     * Set bottom padding.
     * Adds space below the content within the content area.
     *
     * @param value - Bottom padding value in spaces/characters
     * @returns A new Style instance with bottom padding applied
     *
     * @example
     * ```typescript
     * const style = new Style().paddingBottom(3);
     *
     * // Combined with other padding
     * const combined = new Style()
     *   .paddingBottom(2)
     *   .paddingTop(1);
     * ```
     *
     * @see {@link padding} For setting all sides
     * @see {@link paddingVertical} For setting top and bottom together
     * @see {@link unsetPaddingBottom} For removing bottom padding
     */
    paddingBottom(value: number): Style;
    /**
     * Set left padding.
     * Adds space to the left of the content within the content area.
     *
     * @param value - Left padding value in spaces/characters
     * @returns A new Style instance with left padding applied
     *
     * @example
     * ```typescript
     * const style = new Style().paddingLeft(3);
     *
     * // Combined with other padding
     * const combined = new Style()
     *   .paddingLeft(4)
     *   .paddingRight(2);
     * ```
     *
     * @see {@link padding} For setting all sides
     * @see {@link paddingHorizontal} For setting left and right together
     * @see {@link unsetPaddingLeft} For removing left padding
     */
    paddingLeft(value: number): Style;
    /**
     * Set horizontal padding (left and right).
     * Convenience method for setting both left and right padding to the same value.
     *
     * @param value - Horizontal padding value in spaces/characters
     * @returns A new Style instance with horizontal padding applied
     *
     * @example
     * ```typescript
     * const style = new Style().paddingHorizontal(4);
     * // Equivalent to .paddingLeft(4).paddingRight(4)
     *
     * // Combined with vertical padding
     * const box = new Style()
     *   .paddingHorizontal(3)
     *   .paddingVertical(1);
     * ```
     *
     * @see {@link paddingVertical} For setting top and bottom padding
     * @see {@link paddingLeft} {@link paddingRight} For individual sides
     * @see {@link padding} For setting all sides with shorthand
     */
    paddingHorizontal(value: number): Style;
    /**
     * Set vertical padding (top and bottom).
     * Convenience method for setting both top and bottom padding to the same value.
     *
     * @param value - Vertical padding value in spaces/characters
     * @returns A new Style instance with vertical padding applied
     *
     * @example
     * ```typescript
     * const style = new Style().paddingVertical(2);
     * // Equivalent to .paddingTop(2).paddingBottom(2)
     *
     * // Combined with horizontal padding
     * const box = new Style()
     *   .paddingVertical(1)
     *   .paddingHorizontal(3);
     * ```
     *
     * @see {@link paddingHorizontal} For setting left and right padding
     * @see {@link paddingTop} {@link paddingBottom} For individual sides
     * @see {@link padding} For setting all sides with shorthand
     */
    paddingVertical(value: number): Style;
    /**
     * Set margin using CSS-style shorthand syntax.
     * Adds space outside the content area, providing separation from other elements.
     *
     * Supports 1-4 values following CSS conventions:
     * - 1 value: applies to all sides
     * - 2 values: first is vertical (top/bottom), second is horizontal (left/right)
     * - 3 values: top, horizontal (left/right), bottom
     * - 4 values: top, right, bottom, left (clockwise)
     *
     * @param values - Margin values in spaces/characters (1-4 numbers)
     * @returns A new Style instance with the margin applied
     *
     * @example
     * ```typescript
     * // All sides: 1 space
     * const allSides = new Style().margin(1);
     *
     * // Vertical: 2, Horizontal: 4
     * const vertHoriz = new Style().margin(2, 4);
     *
     * // Top: 1, Horizontal: 2, Bottom: 3
     * const threeValues = new Style().margin(1, 2, 3);
     *
     * // Top: 1, Right: 2, Bottom: 3, Left: 4
     * const allDifferent = new Style().margin(1, 2, 3, 4);
     * ```
     *
     * @see {@link marginConfig} For object-based margin configuration
     * @see {@link marginTop} {@link marginRight} etc. For individual sides
     * @see {@link marginBackground} For setting margin background color
     * @see {@link Margin} For Go Lipgloss API compatibility
     * @see {@link padding} For internal spacing
     */
    margin(...values: number[]): Style;
    /**
     * Set margin using a MarginConfig object for explicit control.
     *
     * @param margin - The margin configuration object
     * @returns A new Style instance with the margin applied
     */
    marginConfig(margin: MarginConfig): Style;
    /**
     * Set top margin.
     *
     * @param value - Top margin value
     * @returns A new Style instance with top margin applied
     */
    marginTop(value: number): Style;
    /**
     * Set right margin.
     *
     * @param value - Right margin value
     * @returns A new Style instance with right margin applied
     */
    marginRight(value: number): Style;
    /**
     * Set bottom margin.
     *
     * @param value - Bottom margin value
     * @returns A new Style instance with bottom margin applied
     */
    marginBottom(value: number): Style;
    /**
     * Set left margin.
     *
     * @param value - Left margin value
     * @returns A new Style instance with left margin applied
     */
    marginLeft(value: number): Style;
    /**
     * Set horizontal margin (left and right).
     *
     * @param value - Horizontal margin value
     * @returns A new Style instance with horizontal margin applied
     */
    marginHorizontal(value: number): Style;
    /**
     * Set vertical margin (top and bottom).
     *
     * @param value - Vertical margin value
     * @returns A new Style instance with vertical margin applied
     */
    marginVertical(value: number): Style;
    /**
     * Set margin background color.
     * Applies a background color to the margin areas around the content.
     * This creates a colored border effect in the margin space.
     *
     * @param color - The background color for margin areas
     * @returns A new Style instance with margin background color applied
     * @throws {Error} If the color value is invalid
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .margin(2)
     *   .marginBackground('#ff0000')
     *   .backgroundColor('#ffffff');
     *
     * // Creates white content with red margin areas
     * const boxed = style.render('Content');
     * ```
     *
     * @see {@link margin} For setting margin sizes
     * @see {@link backgroundColor} For content background color
     * @see {@link unsetMarginBackground} For removing margin background
     */
    marginBackground(color: ColorValue): Style;
    /**
     * Set horizontal alignment.
     * Controls how content is positioned horizontally within its container.
     *
     * @param alignment - The horizontal alignment (Left, Center, Right)
     * @returns A new Style instance with the alignment applied
     *
     * @example
     * ```typescript
     * const leftAligned = new Style()
     *   .width(40)
     *   .horizontalAlignment(HorizontalAlignment.Left);
     *
     * const centered = new Style()
     *   .width(40)
     *   .horizontalAlignment(HorizontalAlignment.Center);
     *
     * const rightAligned = new Style()
     *   .width(40)
     *   .horizontalAlignment(HorizontalAlignment.Right);
     * ```
     *
     * @see {@link alignLeft} {@link alignCenter} {@link alignRight} For convenience methods
     * @see {@link verticalAlignment} For vertical positioning
     * @see {@link AlignHorizontal} For Go Lipgloss API compatibility
     */
    horizontalAlignment(alignment: HorizontalAlignment): Style;
    /**
     * Set vertical alignment.
     * Controls how content is positioned vertically within its container.
     *
     * @param alignment - The vertical alignment (Top, Center, Bottom)
     * @returns A new Style instance with the alignment applied
     *
     * @example
     * ```typescript
     * const topAligned = new Style()
     *   .height(20)
     *   .verticalAlignment(VerticalAlignment.Top);
     *
     * const middleAligned = new Style()
     *   .height(20)
     *   .verticalAlignment(VerticalAlignment.Center);
     *
     * const bottomAligned = new Style()
     *   .height(20)
     *   .verticalAlignment(VerticalAlignment.Bottom);
     * ```
     *
     * @see {@link alignTop} {@link alignMiddle} {@link alignBottom} For convenience methods
     * @see {@link horizontalAlignment} For horizontal positioning
     * @see {@link AlignVertical} For Go Lipgloss API compatibility
     */
    verticalAlignment(alignment: VerticalAlignment): Style;
    /**
     * Set both horizontal and vertical alignment at once.
     * Convenience method for setting both alignment directions simultaneously.
     *
     * @param horizontal - The horizontal alignment (Left, Center, Right)
     * @param vertical - The vertical alignment (optional: Top, Center, Bottom)
     * @returns A new Style instance with both alignments applied
     *
     * @example
     * ```typescript
     * // Set both alignments
     * const centered = new Style()
     *   .width(40)
     *   .height(20)
     *   .align(HorizontalAlignment.Center, VerticalAlignment.Center);
     *
     * // Set only horizontal alignment
     * const leftOnly = new Style()
     *   .width(40)
     *   .align(HorizontalAlignment.Left);
     * ```
     *
     * @see {@link center} For centering both directions
     * @see {@link horizontalAlignment} {@link verticalAlignment} For individual control
     */
    align(horizontal: HorizontalAlignment, vertical?: VerticalAlignment): Style;
    /**
     * Set horizontal alignment to left.
     * Convenience method for left-aligning content.
     *
     * @returns A new Style instance with left alignment applied
     *
     * @example
     * ```typescript
     * const leftAligned = new Style()
     *   .width(40)
     *   .alignLeft();
     *
     * // Equivalent to:
     * const equivalent = new Style()
     *   .width(40)
     *   .horizontalAlignment(HorizontalAlignment.Left);
     * ```
     *
     * @see {@link alignCenter} {@link alignRight} For other horizontal alignments
     * @see {@link horizontalAlignment} For explicit alignment setting
     */
    alignLeft(): Style;
    /**
     * Set horizontal alignment to center.
     * Convenience method for center-aligning content horizontally.
     *
     * @returns A new Style instance with center alignment applied
     *
     * @example
     * ```typescript
     * const centered = new Style()
     *   .width(40)
     *   .alignCenter();
     *
     * // Equivalent to:
     * const equivalent = new Style()
     *   .width(40)
     *   .horizontalAlignment(HorizontalAlignment.Center);
     * ```
     *
     * @see {@link alignLeft} {@link alignRight} For other horizontal alignments
     * @see {@link center} For centering both horizontally and vertically
     */
    alignCenter(): Style;
    /**
     * Set horizontal alignment to right.
     * Convenience method for right-aligning content.
     *
     * @returns A new Style instance with right alignment applied
     *
     * @example
     * ```typescript
     * const rightAligned = new Style()
     *   .width(40)
     *   .alignRight();
     *
     * // Equivalent to:
     * const equivalent = new Style()
     *   .width(40)
     *   .horizontalAlignment(HorizontalAlignment.Right);
     * ```
     *
     * @see {@link alignLeft} {@link alignCenter} For other horizontal alignments
     * @see {@link horizontalAlignment} For explicit alignment setting
     */
    alignRight(): Style;
    /**
     * Set vertical alignment to top.
     * Convenience method for top-aligning content.
     *
     * @returns A new Style instance with top alignment applied
     *
     * @example
     * ```typescript
     * const topAligned = new Style()
     *   .height(20)
     *   .alignTop();
     *
     * // Equivalent to:
     * const equivalent = new Style()
     *   .height(20)
     *   .verticalAlignment(VerticalAlignment.Top);
     * ```
     *
     * @see {@link alignMiddle} {@link alignBottom} For other vertical alignments
     * @see {@link verticalAlignment} For explicit alignment setting
     */
    alignTop(): Style;
    /**
     * Set vertical alignment to middle.
     * Convenience method for center-aligning content vertically.
     *
     * @returns A new Style instance with middle alignment applied
     *
     * @example
     * ```typescript
     * const middleAligned = new Style()
     *   .height(20)
     *   .alignMiddle();
     *
     * // Equivalent to:
     * const equivalent = new Style()
     *   .height(20)
     *   .verticalAlignment(VerticalAlignment.Center);
     * ```
     *
     * @see {@link alignTop} {@link alignBottom} For other vertical alignments
     * @see {@link center} For centering both horizontally and vertically
     */
    alignMiddle(): Style;
    /**
     * Set vertical alignment to bottom.
     * Convenience method for bottom-aligning content.
     *
     * @returns A new Style instance with bottom alignment applied
     *
     * @example
     * ```typescript
     * const bottomAligned = new Style()
     *   .height(20)
     *   .alignBottom();
     *
     * // Equivalent to:
     * const equivalent = new Style()
     *   .height(20)
     *   .verticalAlignment(VerticalAlignment.Bottom);
     * ```
     *
     * @see {@link alignTop} {@link alignMiddle} For other vertical alignments
     * @see {@link verticalAlignment} For explicit alignment setting
     */
    alignBottom(): Style;
    /**
     * Center both horizontally and vertically.
     * Convenience method for centering content in both directions.
     *
     * @returns A new Style instance with both alignments set to center
     *
     * @example
     * ```typescript
     * const centered = new Style()
     *   .width(40)
     *   .height(20)
     *   .center();
     *
     * // Equivalent to:
     * const equivalent = new Style()
     *   .width(40)
     *   .height(20)
     *   .align(HorizontalAlignment.Center, VerticalAlignment.Center);
     * ```
     *
     * @see {@link alignCenter} For horizontal centering only
     * @see {@link alignMiddle} For vertical centering only
     * @see {@link align} For setting both alignments with parameters
     */
    center(): Style;
    /**
     * Set vertical alignment using Go-style string values.
     * Provides compatibility with Go Lipgloss API using string-based alignment.
     *
     * @param alignment - The vertical alignment string ('top', 'middle', 'bottom', 'center')
     * @returns A new Style instance with vertical alignment applied
     * @throws {Error} If the alignment string is not recognized
     *
     * @example
     * ```typescript
     * const topAligned = new Style().height(20).valign('top');
     * const centered = new Style().height(20).valign('middle');
     * const bottomAligned = new Style().height(20).valign('bottom');
     *
     * // 'center' is an alias for 'middle'
     * const alsoCentered = new Style().height(20).valign('center');
     * ```
     *
     * @see {@link verticalAlignment} For enum-based alignment
     * @see {@link alignTop} {@link alignMiddle} {@link alignBottom} For convenience methods
     * @note This method is provided for Go Lipgloss compatibility
     */
    valign(alignment: string): Style;
    /**
     * Set border configuration.
     * Applies a complete border configuration including style, colors, and side visibility.
     * Supports both string/enum shortcuts and full BorderConfig objects.
     *
     * @param border - Border style string/enum or complete BorderConfig object
     * @returns A new Style instance with the border applied
     *
     * @example
     * ```typescript
     * // String shortcuts (implicit full border)
     * const normalBorder = new Style().border('normal');
     * const roundedBorder = new Style().border('rounded');
     *
     * // Full border configuration
     * const bordered = new Style().border({
     *   style: BorderType.Single,
     *   color: '#ff0000',
     *   top: true,
     *   right: true,
     *   bottom: true,
     *   left: true
     * });
     *
     * // Partial border configuration
     * const topBottomBorder = new Style().border({
     *   style: BorderType.Double,
     *   top: true,
     *   bottom: true,
     *   left: false,
     *   right: false
     * });
     * ```
     *
     * @see {@link borderStyle} For setting border style only
     * @see {@link borderColor} For setting border color only
     * @see {@link borderTop} {@link borderRight} etc. For individual sides
     */
    border(border: string | BorderType): Style;
    border(border: BorderConfig): Style;
    border(border: BorderStyle): Style;
    border(border: BorderStyle, top: boolean, right: boolean, bottom: boolean, left: boolean): Style;
    /**
     * Set border style using a BorderType.
     * Defines the visual style of the border (single, double, rounded, etc.).
     *
     * @param borderType - The border type to apply (Single, Double, Rounded, Thick, etc.)
     * @returns A new Style instance with the border style applied
     *
     * @example
     * ```typescript
     * const singleBorder = new Style().borderStyle(BorderType.Single);
     * const doubleBorder = new Style().borderStyle(BorderType.Double);
     * const roundedBorder = new Style().borderStyle(BorderType.Rounded);
     * const thickBorder = new Style().borderStyle(BorderType.Thick);
     * const noBorder = new Style().borderStyle(BorderType.None);
     * ```
     *
     * @see {@link border} For complete border configuration
     * @see {@link BorderStyle} For Go Lipgloss API compatibility
     * @see {@link BorderType} For available border styles
     */
    borderStyle(borderType: BorderType): Style;
    /**
     * Set border color for all sides.
     * Applies the same color to all border sides that are visible.
     *
     * @param color - The border color to apply (hex, RGB, ANSI, or named color)
     * @returns A new Style instance with the border color applied
     *
     * @example
     * ```typescript
     * const redBorder = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderColor('#ff0000');
     *
     * const blueBorder = new Style()
     *   .borderStyle(BorderType.Double)
     *   .borderColor('rgb(0, 0, 255)');
     * ```
     *
     * @see {@link borderTopColor} {@link borderRightColor} etc. For individual side colors
     * @see {@link BorderForeground} For Go Lipgloss API compatibility
     * @see {@link borderStyle} For setting border style
     */
    borderColor(color: ColorValue): Style;
    /**
     * Enable or disable top border.
     * Controls visibility of the top border edge.
     *
     * @param enabled - Whether to enable top border (defaults to true)
     * @returns A new Style instance with top border setting applied
     *
     * @example
     * ```typescript
     * const withTopBorder = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderTop(true);
     *
     * const withoutTopBorder = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderTop(false);
     *
     * // Create a bottom-only border
     * const bottomOnly = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderTop(false)
     *   .borderRight(false)
     *   .borderLeft(false)
     *   .borderBottom(true);
     * ```
     *
     * @see {@link borderRight} {@link borderBottom} {@link borderLeft} For other sides
     * @see {@link unsetBorderTop} For removing top border
     */
    borderTop(enabled?: boolean): Style;
    /**
     * Enable or disable right border.
     *
     * @param enabled - Whether to enable right border (defaults to true)
     * @returns A new Style instance with right border setting applied
     */
    borderRight(enabled?: boolean): Style;
    /**
     * Enable or disable bottom border.
     *
     * @param enabled - Whether to enable bottom border (defaults to true)
     * @returns A new Style instance with bottom border setting applied
     */
    borderBottom(enabled?: boolean): Style;
    /**
     * Enable or disable left border.
     *
     * @param enabled - Whether to enable left border (defaults to true)
     * @returns A new Style instance with left border setting applied
     */
    borderLeft(enabled?: boolean): Style;
    /**
     * Set top border color.
     *
     * @param color - The top border color to apply
     * @returns A new Style instance with top border color applied
     */
    borderTopColor(color: ColorValue): Style;
    /**
     * Set right border color.
     *
     * @param color - The right border color to apply
     * @returns A new Style instance with right border color applied
     */
    borderRightColor(color: ColorValue): Style;
    /**
     * Set bottom border color.
     *
     * @param color - The bottom border color to apply
     * @returns A new Style instance with bottom border color applied
     */
    borderBottomColor(color: ColorValue): Style;
    /**
     * Set left border color.
     *
     * @param color - The left border color to apply
     * @returns A new Style instance with left border color applied
     */
    borderLeftColor(color: ColorValue): Style;
    /**
     * Set top border background color.
     *
     * @param color - The top border background color to apply
     * @returns A new Style instance with top border background color applied
     */
    borderTopBackgroundColor(color: ColorValue): Style;
    /**
     * Set right border background color.
     *
     * @param color - The right border background color to apply
     * @returns A new Style instance with right border background color applied
     */
    borderRightBackgroundColor(color: ColorValue): Style;
    /**
     * Set bottom border background color.
     *
     * @param color - The bottom border background color to apply
     * @returns A new Style instance with bottom border background color applied
     */
    borderBottomBackgroundColor(color: ColorValue): Style;
    /**
     * Set left border background color.
     *
     * @param color - The left border background color to apply
     * @returns A new Style instance with left border background color applied
     */
    borderLeftBackgroundColor(color: ColorValue): Style;
    /**
     * Remove all borders.
     *
     * @returns A new Style instance with all borders removed
     */
    unsetBorder(): Style;
    /**
     * Remove specific border sides.
     *
     * @param sides - Array of sides to remove ('top', 'right', 'bottom', 'left')
     * @returns A new Style instance with specified borders removed
     */
    unsetBorderSides(...sides: Array<'top' | 'right' | 'bottom' | 'left'>): Style;
    /**
     * Set transform function for content manipulation.
     * Allows custom text processing before styling is applied.
     * The transform function receives the text content and returns modified text.
     *
     * @param transform - The transform function to apply (text: string) => string, or a string shortcut
     * @returns A new Style instance with the transform applied
     *
     * @example
     * ```typescript
     * // Convert text to uppercase using function
     * const upperCase = new Style().transform(text => text.toUpperCase());
     *
     * // Convert text to uppercase using string shortcut
     * const upperCaseShortcut = new Style().transform('uppercase');
     *
     * // Add prefix and suffix
     * const bracketed = new Style().transform(text => `[${text}]`);
     *
     * // Capitalize first letter using string shortcut
     * const capitalized = new Style().transform('capitalize');
     *
     * // Replace certain characters
     * const sanitized = new Style().transform(text =>
     *   text.replace(/[<>]/g, '')
     * );
     *
     * // Truncate with ellipsis
     * const truncated = new Style().transform(text =>
     *   text.length > 20 ? text.slice(0, 17) + '...' : text
     * );
     * ```
     *
     * @note Transform is applied before all other styling operations
     * @see {@link render} For the order of operations during rendering
     */
    transform(transform: TransformFunction | string): Style;
    /**
     * Set word wrap behavior.
     * Controls how text is handled when it exceeds the width constraint.
     * When true, text wraps at word boundaries. When false, text is truncated.
     *
     * @param wrap - Whether to enable word wrapping (true) or truncation (false)
     * @returns A new Style instance with word wrap setting applied
     *
     * @example
     * ```typescript
     * // Text will wrap to multiple lines
     * const wrapping = new Style()
     *   .width(20)
     *   .wordWrap(true);
     *
     * // Text will be truncated with ellipsis
     * const truncating = new Style()
     *   .width(20)
     *   .wordWrap(false);
     *
     * const longText = 'This is a very long piece of text that exceeds the width';
     * console.log(wrapping.render(longText));    // Multiple lines
     * console.log(truncating.render(longText));  // 'This is a very l...'
     * ```
     *
     * @see {@link width} {@link maxWidth} For setting width constraints
     * @see {@link preserveWhitespace} For whitespace handling
     */
    wordWrap(wrap: boolean): Style;
    /**
     * Set maximum width for word wrapping.
     * Establishes a maximum width constraint that content cannot exceed.
     * Content will be wrapped or truncated based on the wordWrap setting.
     *
     * @param maxWidth - The maximum width in characters
     * @returns A new Style instance with max width applied
     *
     * @example
     * ```typescript
     * // Content will wrap at 50 characters maximum
     * const constrained = new Style()
     *   .maxWidth(50)
     *   .wordWrap(true);
     *
     * // Content will be truncated at 30 characters
     * const truncated = new Style()
     *   .maxWidth(30)
     *   .wordWrap(false);
     *
     * // Combined with width for flexible layouts
     * const flexible = new Style()
     *   .width('fit-content')
     *   .maxWidth(80);
     * ```
     *
     * @see {@link width} For exact width constraints
     * @see {@link wordWrap} For controlling wrap vs truncate behavior
     * @see {@link unsetMaxWidth} For removing the constraint
     */
    maxWidth(maxWidth: number): Style;
    /**
     * Set whitespace preservation behavior.
     * Controls whether whitespace characters (spaces, tabs, newlines) are preserved
     * or normalized during text processing.
     *
     * @param preserve - Whether to preserve all whitespace characters
     * @returns A new Style instance with whitespace preservation setting applied
     *
     * @example
     * ```typescript
     * // Preserve all whitespace exactly as provided
     * const preserved = new Style().preserveWhitespace(true);
     *
     * // Normalize whitespace (convert tabs to spaces, etc.)
     * const normalized = new Style().preserveWhitespace(false);
     *
     * const text = 'Line 1\t\tTabbed\nLine 2    Spaced';
     * console.log(preserved.render(text));   // Exact formatting preserved
     * console.log(normalized.render(text));  // Tabs converted to spaces
     * ```
     *
     * @see {@link tabWidth} For controlling tab expansion
     * @see {@link colorWhitespace} For whitespace coloring
     */
    preserveWhitespace(preserve: boolean): Style;
    /**
     * Set maximum height for layout constraint.
     * Establishes a maximum height constraint that content cannot exceed.
     * Content exceeding this height will be truncated.
     *
     * @param maxHeight - The maximum height in lines
     * @returns A new Style instance with max height applied
     *
     * @example
     * ```typescript
     * // Content will be truncated after 10 lines
     * const constrained = new Style().maxHeight(10);
     *
     * // Combined with height for flexible layouts
     * const flexible = new Style()
     *   .height('fit-content')
     *   .maxHeight(20);
     *
     * const longText = Array(50).fill('Line of text').join('\n');
     * console.log(constrained.render(longText)); // Only first 10 lines
     * ```
     *
     * @see {@link height} For exact height constraints
     * @see {@link unsetMaxHeight} For removing the constraint
     * @note Unlike Go Lipgloss, this implementation supports height truncation
     */
    maxHeight(maxHeight: number): Style;
    /**
     * Set whether to color whitespace characters.
     * Controls whether foreground and background colors apply to whitespace characters
     * (spaces, tabs) or only to visible text characters.
     *
     * @param color - Whether to apply colors to whitespace characters
     * @returns A new Style instance with whitespace coloring setting applied
     *
     * @example
     * ```typescript
     * // Colors apply to all characters including spaces
     * const coloredSpaces = new Style()
     *   .color('#ffffff')
     *   .backgroundColor('#ff0000')
     *   .colorWhitespace(true);
     *
     * // Colors apply only to visible text
     * const textOnly = new Style()
     *   .color('#ffffff')
     *   .backgroundColor('#ff0000')
     *   .colorWhitespace(false);
     *
     * const text = 'Hello World';
     * console.log(coloredSpaces.render(text)); // Space is also colored
     * console.log(textOnly.render(text));     // Space uses default colors
     * ```
     *
     * @see {@link color} {@link backgroundColor} For setting colors
     * @see {@link unsetColorWhitespace} For removing the setting
     */
    colorWhitespace(color: boolean): Style;
    /**
     * Set whether to render inline (no line breaks).
     * When true, converts all newline characters to spaces, creating single-line output.
     * When false, preserves line breaks in the content.
     *
     * @param inline - Whether to render content inline (single line)
     * @returns A new Style instance with inline setting applied
     *
     * @example
     * ```typescript
     * // Convert multiline content to single line
     * const inlineStyle = new Style().inline(true);
     *
     * // Preserve line breaks
     * const blockStyle = new Style().inline(false);
     *
     * const multilineText = 'Line 1\nLine 2\nLine 3';
     * console.log(inlineStyle.render(multilineText)); // 'Line 1 Line 2 Line 3'
     * console.log(blockStyle.render(multilineText));  // Three separate lines
     * ```
     *
     * @see {@link preserveWhitespace} For general whitespace handling
     * @see {@link unsetInline} For removing inline setting
     */
    inline(inline: boolean): Style;
    /**
     * Set custom tab width in spaces.
     * Controls how many spaces tab characters (\t) are expanded to during rendering.
     * The default tab width is 4 spaces.
     *
     * @param width - The tab width in spaces (must be positive)
     * @returns A new Style instance with custom tab width applied
     *
     * @example
     * ```typescript
     * // Expand tabs to 8 spaces
     * const wideTabsStyle = new Style().tabWidth(8);
     *
     * // Expand tabs to 2 spaces (compact)
     * const compactTabsStyle = new Style().tabWidth(2);
     *
     * const tabbedText = 'Column1\tColumn2\tColumn3';
     * console.log(wideTabsStyle.render(tabbedText));    // Wide spacing
     * console.log(compactTabsStyle.render(tabbedText)); // Compact spacing
     * ```
     *
     * @see {@link preserveWhitespace} For controlling whitespace handling
     * @see {@link unsetTabWidth} For resetting to default
     */
    tabWidth(width: number): Style;
    /**
     * Merge this style with another style, creating a new Style instance.
     * Properties from the other style will override properties from this style.
     * This is useful for combining base styles with specific overrides.
     *
     * @param other - The style to merge with this one
     * @returns A new Style instance with merged properties
     *
     * @example
     * ```typescript
     * const baseStyle = new Style()
     *   .color('#ffffff')
     *   .padding(2)
     *   .bold(true);
     *
     * const overrideStyle = new Style()
     *   .color('#ff0000')
     *   .italic(true);
     *
     * const merged = baseStyle.merge(overrideStyle);
     * // Result: white->red color, padding(2), bold(true), italic(true)
     * ```
     *
     * @see {@link apply} For applying property updates directly
     * @see {@link Inherit} For inheriting only unset properties
     */
    merge(other: Style): Style;
    /**
     * Apply multiple style updates at once for efficiency.
     * Allows setting multiple properties in a single operation rather than chaining.
     *
     * @param updates - The style properties to update (partial StyleProperties object)
     * @returns A new Style instance with all updates applied
     *
     * @example
     * ```typescript
     * const style = new Style().apply({
     *   color: '#ff0000',
     *   backgroundColor: '#ffffff',
     *   fontWeight: FontWeight.Bold,
     *   padding: { top: 1, right: 2, bottom: 1, left: 2 },
     *   width: 40,
     *   horizontalAlignment: HorizontalAlignment.Center
     * });
     *
     * // Equivalent to chaining:
     * const chained = new Style()
     *   .color('#ff0000')
     *   .backgroundColor('#ffffff')
     *   .bold(true)
     *   .padding(1, 2)
     *   .width(40)
     *   .alignCenter();
     * ```
     *
     * @see {@link merge} For merging with another Style instance
     */
    apply(updates: Partial<StyleProperties>): Style;
    /**
     * Apply color with optional whitespace coloring support.
     *
     * @param text - The text to color
     * @param color - The color to apply
     * @param isBackground - Whether this is a background color
     * @returns Text with color applied
     */
    private applyColorWithWhitespaceSupport;
    /**
     * Normalize whitespace characters to match Go behavior
     * - Convert tabs to custom width spaces or default 4 spaces
     * - Preserve other whitespace as-is
     */
    private normalizeWhitespace;
    /**
     * Get the current margins as an object with named properties.
     * Returns margin values with default 0 for unset sides.
     * This is a convenience method for layout calculations and table components.
     *
     * @returns Margin values as an object with top, right, bottom, left properties
     *
     * @example
     * ```typescript
     * const style = new Style().margin(1, 2, 3, 4);
     * const margins = style.getMargins();
     * console.log(margins); // { top: 1, right: 2, bottom: 3, left: 4 }
     *
     * const noMarginStyle = new Style();
     * const defaultMargins = noMarginStyle.getMargins();
     * console.log(defaultMargins); // { top: 0, right: 0, bottom: 0, left: 0 }
     * ```
     *
     * @see {@link getHorizontalMargins} {@link getVerticalMargins} For calculated totals
     * @see {@link getMargin} For raw margin configuration
     */
    getMargins(): {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    /**
     * Get the total horizontal margins (left + right).
     * Useful for calculating available width in layout operations.
     *
     * @returns The sum of left and right margins in characters
     *
     * @example
     * ```typescript
     * const style = new Style().margin(1, 2, 3, 4); // top, right, bottom, left
     * const horizontalMargins = style.getHorizontalMargins();
     * console.log(horizontalMargins); // 6 (left: 4 + right: 2)
     *
     * // Calculate available width
     * const totalWidth = 80;
     * const availableWidth = totalWidth - style.getHorizontalMargins();
     * ```
     *
     * @see {@link getVerticalMargins} For vertical margin total
     * @see {@link getHorizontalPadding} For horizontal padding total
     */
    getHorizontalMargins(): number;
    /**
     * Get the total vertical margins (top + bottom).
     * Useful for calculating available height in layout operations.
     *
     * @returns The sum of top and bottom margins in lines
     *
     * @example
     * ```typescript
     * const style = new Style().margin(1, 2, 3, 4); // top, right, bottom, left
     * const verticalMargins = style.getVerticalMargins();
     * console.log(verticalMargins); // 4 (top: 1 + bottom: 3)
     *
     * // Calculate available height
     * const totalHeight = 25;
     * const availableHeight = totalHeight - style.getVerticalMargins();
     * ```
     *
     * @see {@link getHorizontalMargins} For horizontal margin total
     * @see {@link getVerticalPadding} For vertical padding total
     */
    getVerticalMargins(): number;
    /**
     * Get the total horizontal padding (left + right).
     * Useful for calculating content area width in layout operations.
     *
     * @returns The sum of left and right padding in characters
     *
     * @example
     * ```typescript
     * const style = new Style().padding(1, 2, 3, 4); // top, right, bottom, left
     * const horizontalPadding = style.getHorizontalPadding();
     * console.log(horizontalPadding); // 6 (left: 4 + right: 2)
     *
     * // Calculate content area width
     * const totalWidth = 40;
     * const contentWidth = totalWidth - style.getHorizontalPadding();
     * ```
     *
     * @see {@link getVerticalPadding} For vertical padding total
     * @see {@link getHorizontalMargins} For horizontal margin total
     */
    getHorizontalPadding(): number;
    /**
     * Get the total vertical padding (top + bottom).
     * Useful for calculating content area height in layout operations.
     *
     * @returns The sum of top and bottom padding in lines
     *
     * @example
     * ```typescript
     * const style = new Style().padding(1, 2, 3, 4); // top, right, bottom, left
     * const verticalPadding = style.getVerticalPadding();
     * console.log(verticalPadding); // 4 (top: 1 + bottom: 3)
     *
     * // Calculate content area height
     * const totalHeight = 20;
     * const contentHeight = totalHeight - style.getVerticalPadding();
     * ```
     *
     * @see {@link getHorizontalPadding} For horizontal padding total
     * @see {@link getVerticalMargins} For vertical margin total
     */
    getVerticalPadding(): number;
    /**
     * Set horizontal alignment using Go Lipgloss Position-style string values.
     * Matches the Go Lipgloss API exactly: alignHorizontal(position).
     *
     * @param position - The horizontal alignment position string ('left', 'center', 'right')
     * @returns A new Style instance with horizontal alignment applied
     * @throws {Error} If the position string is not recognized
     *
     * @example
     * ```typescript
     * // Go Lipgloss compatible API
     * const leftAligned = new Style().width(15).alignHorizontal('left');
     * const centered = new Style().width(15).alignHorizontal('center');
     * const rightAligned = new Style().width(15).alignHorizontal('right');
     * ```
     *
     * @see {@link alignVertical} For vertical alignment with Go compatibility
     * @see {@link horizontalAlignment} For enum-based alignment
     */
    alignHorizontal(position: string): Style;
    /**
     * Set vertical alignment using Go Lipgloss Position-style string values.
     * Matches the Go Lipgloss API exactly: alignVertical(position).
     *
     * @param position - The vertical alignment position string ('top', 'middle', 'bottom')
     * @returns A new Style instance with vertical alignment applied
     * @throws {Error} If the position string is not recognized
     *
     * @example
     * ```typescript
     * // Go Lipgloss compatible API
     * const topAligned = new Style().height(5).alignVertical('top');
     * const middleAligned = new Style().height(5).alignVertical('middle');
     * const bottomAligned = new Style().height(5).alignVertical('bottom');
     * ```
     *
     * @see {@link alignHorizontal} For horizontal alignment with Go compatibility
     * @see {@link verticalAlignment} For enum-based alignment
     */
    alignVertical(position: string): Style;
    /**
     * AlignHorizontal sets a horizontal text alignment rule.
     * This is the Go Lipgloss equivalent of horizontalAlignment().
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param position - The horizontal alignment position (Left, Center, Right)
     * @returns A new Style instance with horizontal alignment applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const centered = new Style()
     *   .Width(40)
     *   .AlignHorizontal(HorizontalAlignment.Center);
     *
     * // TypeScript native style (preferred)
     * const equivalent = new Style()
     *   .width(40)
     *   .horizontalAlignment(HorizontalAlignment.Center);
     * ```
     *
     * @see {@link horizontalAlignment} For the preferred TypeScript method
     * @see {@link AlignVertical} For vertical alignment in Go style
     */
    AlignHorizontal(position: HorizontalAlignment): Style;
    /**
     * AlignVertical sets a vertical text alignment rule.
     * This is the Go Lipgloss equivalent of verticalAlignment().
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param position - The vertical alignment position (Top, Center, Bottom)
     * @returns A new Style instance with vertical alignment applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const middleAligned = new Style()
     *   .Height(20)
     *   .AlignVertical(VerticalAlignment.Center);
     *
     * // TypeScript native style (preferred)
     * const equivalent = new Style()
     *   .height(20)
     *   .verticalAlignment(VerticalAlignment.Center);
     * ```
     *
     * @see {@link verticalAlignment} For the preferred TypeScript method
     * @see {@link AlignHorizontal} For horizontal alignment in Go style
     */
    AlignVertical(position: VerticalAlignment): Style;
    /**
     * Foreground sets the foreground color.
     * This is the Go Lipgloss equivalent of color().
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param color - The foreground color value to apply
     * @returns A new Style instance with the foreground color applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const redText = new Style().Foreground('#ff0000');
     *
     * // TypeScript native style (preferred)
     * const equivalent = new Style().color('#ff0000');
     * ```
     *
     * @see {@link color} For the preferred TypeScript method
     * @see {@link Background} For setting background color in Go style
     */
    Foreground(color: ColorValue): Style;
    /**
     * Background sets the background color.
     * This is the Go Lipgloss equivalent of backgroundColor().
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param color - The background color value to apply
     * @returns A new Style instance with the background color applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const blueBackground = new Style().Background('#0000ff');
     *
     * // TypeScript native style (preferred)
     * const equivalent = new Style().backgroundColor('#0000ff');
     * ```
     *
     * @see {@link backgroundColor} For the preferred TypeScript method
     * @see {@link Foreground} For setting foreground color in Go style
     */
    Background(color: ColorValue): Style;
    /**
     * SetString sets the underlying string value for this style.
     * The string can later be rendered with the style's Render method or String method.
     * This is a Go Lipgloss compatibility method for deferred rendering.
     *
     * @param strs - One or more strings to set as the content (will be joined)
     * @returns A new Style instance with the string content set
     *
     * @example
     * ```typescript
     * // Go Lipgloss style deferred rendering
     * const styledText = new Style()
     *   .Foreground('#ff0000')
     *   .Bold(true)
     *   .SetString('Hello', ' ', 'World!');
     *
     * console.log(styledText.String()); // Renders: bold red "Hello World!"
     * console.log(styledText.Value());  // Raw: "Hello World!"
     *
     * // TypeScript preferred approach
     * const equivalent = new Style()
     *   .color('#ff0000')
     *   .bold(true)
     *   .render('Hello World!');
     * ```
     *
     * @see {@link String} For rendering the stored content
     * @see {@link Value} For getting raw content without styling
     * @see {@link render} For direct rendering without storage
     */
    SetString(...strs: string[]): Style;
    /**
     * Value returns the raw, unformatted underlying string value.
     * This returns the string content set by SetString without any styling applied.
     * Useful for extracting content for processing or testing.
     *
     * @returns The raw string content or empty string if none set
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .color('#ff0000')
     *   .bold(true)
     *   .SetString('Hello World!');
     *
     * console.log(style.Value());  // 'Hello World!' (no styling)
     * console.log(style.String()); // Bold red 'Hello World!' (with styling)
     *
     * // Check if content was set
     * const emptyStyle = new Style();
     * console.log(emptyStyle.Value()); // ''
     * ```
     *
     * @see {@link SetString} For setting string content
     * @see {@link String} For getting styled content
     */
    Value(): string;
    /**
     * String returns the styled string.
     * If a string was set with SetString, it renders that string with the current style.
     * This is equivalent to calling Render() with the stored string content.
     *
     * @returns The styled string content with ANSI escape sequences applied
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .color('#ff0000')
     *   .bold(true)
     *   .padding(1)
     *   .SetString('Styled Text');
     *
     * console.log(style.String()); // Fully styled output with padding and colors
     *
     * // Equivalent to:
     * const equivalent = style.render('Styled Text');
     *
     * // Empty if no content set
     * const emptyStyle = new Style().color('#ff0000');
     * console.log(emptyStyle.String()); // ''
     * ```
     *
     * @see {@link SetString} For setting the content to render
     * @see {@link Value} For getting raw content without styling
     * @see {@link render} For direct rendering with parameter
     */
    String(): string;
    /**
     * Inherit overlays the style in the argument onto this style by copying each
     * explicitly set value from the argument style if it is not already explicitly set.
     * Existing set values are kept intact and not overwritten.
     * This differs from merge() which overwrites existing values.
     *
     * @param other - The style to inherit properties from
     * @returns A new Style instance with inherited properties
     *
     * @example
     * ```typescript
     * const baseTheme = new Style()
     *   .color('#ffffff')
     *   .backgroundColor('#000000')
     *   .padding(2);
     *
     * const userStyle = new Style()
     *   .color('#ff0000')
     *   .bold(true);
     *
     * const inherited = userStyle.Inherit(baseTheme);
     * // Result: color('#ff0000'), backgroundColor('#000000'), padding(2), bold(true)
     * // User's color is kept, base theme's background and padding are inherited
     *
     * const merged = userStyle.merge(baseTheme);
     * // Result: color('#ffffff'), backgroundColor('#000000'), padding(2), bold(true)
     * // Base theme's color overwrites user's color
     * ```
     *
     * @see {@link merge} For overwriting existing properties
     * @see {@link apply} For setting properties directly
     */
    Inherit(other: Style): Style;
    /**
     * Bold is a convenience method for setting bold text.
     * This matches Go Lipgloss's Bold method signature which takes a boolean.
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param enabled - Whether to enable bold text
     * @returns A new Style instance with bold setting applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const boldText = new Style().Bold(true);
     * const normalText = new Style().Bold(false);
     *
     * // TypeScript native style (preferred)
     * const equivalent = new Style().bold(true);
     * ```
     *
     * @see {@link bold} For the preferred TypeScript method
     * @see {@link Italic} {@link Underline} For other Go-style text styling
     */
    Bold(enabled: boolean): Style;
    /**
     * Italic is a convenience method for setting italic text.
     * This matches Go Lipgloss's Italic method signature which takes a boolean.
     *
     * @param enabled - Whether to enable italic text
     * @returns A new Style instance with italic setting applied
     */
    Italic(enabled: boolean): Style;
    /**
     * Underline is a convenience method for setting underlined text.
     * This matches Go Lipgloss's Underline method signature which takes a boolean.
     *
     * @param enabled - Whether to enable underlined text
     * @returns A new Style instance with underline setting applied
     */
    Underline(enabled: boolean): Style;
    /**
     * Strikethrough is a convenience method for setting strikethrough text.
     * This matches Go Lipgloss's Strikethrough method signature which takes a boolean.
     *
     * @param enabled - Whether to enable strikethrough text
     * @returns A new Style instance with strikethrough setting applied
     */
    Strikethrough(enabled: boolean): Style;
    /**
     * Blink is a convenience method for setting blinking text.
     * This matches Go Lipgloss's Blink method signature which takes a boolean.
     *
     * @param enabled - Whether to enable blinking text
     * @returns A new Style instance with blink setting applied
     */
    Blink(enabled: boolean): Style;
    /**
     * Faint is a convenience method for setting faint/dim text.
     * This matches Go Lipgloss's Faint method signature which takes a boolean.
     *
     * @param enabled - Whether to enable faint/dim text
     * @returns A new Style instance with faint setting applied
     */
    Faint(enabled: boolean): Style;
    /**
     * Width sets the width of the block.
     * This matches Go Lipgloss's Width method signature which takes an integer.
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param width - The width value to set in characters
     * @returns A new Style instance with width setting applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const fixedWidth = new Style().Width(40);
     *
     * // TypeScript native style (preferred - supports more types)
     * const equivalent = new Style().width(40);
     * const autoWidth = new Style().width('auto');
     * ```
     *
     * @see {@link width} For the preferred TypeScript method with more options
     * @see {@link Height} For setting height in Go style
     */
    Width(width: number): Style;
    /**
     * Height sets the height of the block.
     * This matches Go Lipgloss's Height method signature which takes an integer.
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param height - The height value to set in lines
     * @returns A new Style instance with height setting applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const fixedHeight = new Style().Height(20);
     *
     * // TypeScript native style (preferred - supports more types)
     * const equivalent = new Style().height(20);
     * const autoHeight = new Style().height('auto');
     * ```
     *
     * @see {@link height} For the preferred TypeScript method with more options
     * @see {@link Width} For setting width in Go style
     */
    Height(height: number): Style;
    /**
     * Padding sets padding using the same syntax as Go Lipgloss.
     * Supports 1-4 values like CSS padding shorthand.
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param values - Padding values in spaces/characters (1-4 numbers)
     * @returns A new Style instance with padding applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const padded = new Style().Padding(2);
     * const asymmetric = new Style().Padding(1, 2, 3, 4);
     *
     * // TypeScript native style (identical functionality)
     * const equivalent = new Style().padding(2);
     * ```
     *
     * @see {@link padding} For the preferred TypeScript method (identical functionality)
     * @see {@link Margin} For setting margin in Go style
     */
    Padding(...values: number[]): Style;
    /**
     * Margin sets margin using the same syntax as Go Lipgloss.
     * Supports 1-4 values like CSS margin shorthand.
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param values - Margin values in spaces/characters (1-4 numbers)
     * @returns A new Style instance with margin applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const margined = new Style().Margin(1);
     * const asymmetric = new Style().Margin(1, 2, 3, 4);
     *
     * // TypeScript native style (identical functionality)
     * const equivalent = new Style().margin(1);
     * ```
     *
     * @see {@link margin} For the preferred TypeScript method (identical functionality)
     * @see {@link Padding} For setting padding in Go style
     */
    Margin(...values: number[]): Style;
    /**
     * BorderStyle sets the border style.
     * This matches Go Lipgloss's BorderStyle method.
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param borderType - The border type to apply
     * @returns A new Style instance with border style applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const bordered = new Style().BorderStyle(BorderType.Single);
     *
     * // TypeScript native style (identical functionality)
     * const equivalent = new Style().borderStyle(BorderType.Single);
     * ```
     *
     * @see {@link borderStyle} For the preferred TypeScript method (identical functionality)
     * @see {@link BorderForeground} For setting border color in Go style
     */
    BorderStyle(borderType: BorderType): Style;
    /**
     * BorderForeground sets the border color.
     * This is the Go Lipgloss equivalent of borderColor().
     * Provided for compatibility with Go Lipgloss codebases.
     *
     * @param color - The border color to apply
     * @returns A new Style instance with border color applied
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API
     * const redBorder = new Style()
     *   .BorderStyle(BorderType.Single)
     *   .BorderForeground('#ff0000');
     *
     * // TypeScript native style (preferred)
     * const equivalent = new Style()
     *   .borderStyle(BorderType.Single)
     *   .borderColor('#ff0000');
     * ```
     *
     * @see {@link borderColor} For the preferred TypeScript method
     * @see {@link BorderStyle} For setting border style in Go style
     */
    BorderForeground(color: ColorValue): Style;
    /**
     * Copy creates a true copy of the style.
     * This is the Go Lipgloss equivalent of copy().
     * Note: This method is deprecated in Go Lipgloss but included for compatibility.
     *
     * @returns A new Style instance with copied properties
     *
     * @example
     * ```typescript
     * // Go Lipgloss style API (deprecated)
     * const original = new Style().Foreground('#ff0000').Bold(true);
     * const copied = original.Copy();
     *
     * // TypeScript native style (preferred)
     * const equivalent = original.copy();
     * ```
     *
     * @deprecated This method is deprecated in Go Lipgloss. Use copy() instead.
     * @see {@link copy} For the preferred TypeScript method
     */
    Copy(): Style;
    /**
     * Background is an alias for backgroundColor().
     * Provided for compatibility and shorter method calls.
     *
     * @param color - The background color value to apply
     * @returns A new Style instance with background color applied
     *
     * @example
     * ```typescript
     * const style = new Style().background('#ff0000');
     * // Equivalent to:
     * const equivalent = new Style().backgroundColor('#ff0000');
     * ```
     *
     * @see {@link backgroundColor} For the full method
     */
    background(color: import('./types').ColorValue): Style;
    /**
     * Gets the border sizes for this style.
     * Returns [horizontal, vertical] border sizes in characters.
     *
     * @returns A tuple of [horizontal, vertical] border sizes
     *
     * @example
     * ```typescript
     * const style = new Style().border(NormalBorder());
     * const [horizontal, vertical] = style.getBorderSizes();
     * console.log(`H: ${horizontal}, V: ${vertical}`); // H: 2, V: 2
     * ```
     */
    getBorderSizes(): [number, number];
    /**
     * Inherit copies properties from a parent style where this style doesn't have them set.
     * Unlike merge(), inherit() only applies parent properties that are not already set in this style.
     *
     * @param parent - The parent style to inherit properties from
     * @returns A new Style instance with inherited properties
     *
     * @example
     * ```typescript
     * const parent = new Style()
     *   .color('#ffffff')
     *   .backgroundColor('#000000')
     *   .padding(2);
     *
     * const child = new Style()
     *   .color('#ff0000')  // Override parent's color
     *   .inherit(parent);  // Inherit background and padding
     *
     * // Result: color('#ff0000'), backgroundColor('#000000'), padding(2)
     * ```
     *
     * @see {@link merge} For merging where parent properties override child properties
     */
    inherit(parent: Style): Style;
    /**
     * Sets the border foreground color.
     * This controls the color of border characters when a border is applied.
     *
     * @param color - The color value for the border
     * @returns A new Style instance with border color applied
     *
     * @example
     * ```typescript
     * const style = new Style()
     *   .border(NormalBorder())
     *   .borderForeground('#ff0000'); // Red border
     * ```
     */
    borderForeground(color: import('./types').ColorValue): Style;
    /**
     * Returns the renderer associated with this style.
     * This is a method (not a property) for consistency with Go Lipgloss.
     *
     * @returns The renderer instance
     *
     * @example
     * ```typescript
     * const style = renderer.newStyle();
     * const sameRenderer = style.renderer();
     * ```
     */
    renderer(): Renderer;
}
//# sourceMappingURL=style.d.ts.map