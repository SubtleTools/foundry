/**
 * Border styles and utilities - comprehensive border support
 *
 * This module handles border definitions, border rendering, and
 * border style management with full TypeScript type safety.
 */
import { type BorderConfig, type BorderStyle, BorderType, type ColorValue, isValidBorderStyle } from './types';
/**
 * NoBorder represents no border styling.
 */
export declare const NoBorder: BorderConfig;
/**
 * Predefined border style definitions
 */
export declare const BorderStyles: Record<BorderType, BorderStyle> & {
    Normal: BorderStyle;
    Rounded: BorderStyle;
    Thick: BorderStyle;
    Double: BorderStyle;
    Hidden: BorderStyle;
    ASCII: BorderStyle;
    Block: BorderStyle;
    OuterHalfBlock: BorderStyle;
    InnerHalfBlock: BorderStyle;
    Markdown: BorderStyle;
    None: BorderStyle;
};
/**
 * Common border configurations for easy use
 */
export declare const Borders: {
    readonly None: BorderConfig;
    readonly Normal: BorderConfig;
    readonly Rounded: BorderConfig;
    readonly Thick: BorderConfig;
    readonly Double: BorderConfig;
    readonly Hidden: BorderConfig;
    readonly ASCII: BorderConfig;
    readonly Block: BorderConfig;
    readonly OuterHalfBlock: BorderConfig;
    readonly InnerHalfBlock: BorderConfig;
    readonly Markdown: BorderConfig;
};
/**
 * Utility functions for border manipulation
 */
export declare class BorderUtils {
    /**
     * Get the border style definition for a given border type
     *
     * @param borderType - The border type to get style for
     * @returns Border style definition
     */
    static getStyleDefinition(borderType: BorderType): BorderStyle;
    /**
     * Get the maximum width of a border edge based on character widths
     *
     * @param borderParts - Array of border part characters
     * @returns Maximum character width
     */
    static getBorderEdgeWidth(...borderParts: string[]): number;
    /**
     * Get the top border size (width)
     *
     * @param border - Border style definition
     * @returns Width of the top border
     */
    static getTopSize(border: BorderStyle): number;
    /**
     * Get the right border size (width)
     *
     * @param border - Border style definition
     * @returns Width of the right border
     */
    static getRightSize(border: BorderStyle): number;
    /**
     * Get the bottom border size (width)
     *
     * @param border - Border style definition
     * @returns Width of the bottom border
     */
    static getBottomSize(border: BorderStyle): number;
    /**
     * Get the left border size (width)
     *
     * @param border - Border style definition
     * @returns Width of the left border
     */
    static getLeftSize(border: BorderStyle): number;
    /**
     * Get maximum rune width of a string
     *
     * @param str - String to measure
     * @returns Maximum character width
     */
    static maxRuneWidth(str: string): number;
    /**
     * Get the first rune of a string as a string
     *
     * @param str - String to get first character from
     * @returns First character or empty string
     */
    static getFirstRuneAsString(str: string): string;
    /**
     * Create a border configuration with specific sides enabled
     *
     * @param style - Border type or custom style
     * @param sides - Object specifying which sides to enable
     * @param color - Optional border color
     * @returns Complete border configuration
     */
    static createBorder(style: BorderType | BorderStyle, sides?: {
        top?: boolean;
        right?: boolean;
        bottom?: boolean;
        left?: boolean;
    }, color?: ColorValue): BorderConfig;
    /**
     * Create a partial border (only specific sides)
     *
     * @param style - Border type or custom style
     * @param enabledSides - Array of sides to enable ('top', 'right', 'bottom', 'left')
     * @param color - Optional border color
     * @returns Border configuration with only specified sides
     */
    static createPartialBorder(style: BorderType | BorderStyle, enabledSides: Array<'top' | 'right' | 'bottom' | 'left'>, color?: ColorValue): BorderConfig;
    /**
     * Create a horizontal border (top and bottom only)
     *
     * @param style - Border type or custom style
     * @param color - Optional border color
     * @returns Border configuration for horizontal borders only
     */
    static horizontalBorder(style?: BorderType | BorderStyle, color?: ColorValue): BorderConfig;
    /**
     * Create a vertical border (left and right only)
     *
     * @param style - Border type or custom style
     * @param color - Optional border color
     * @returns Border configuration for vertical borders only
     */
    static verticalBorder(style?: BorderType | BorderStyle, color?: ColorValue): BorderConfig;
    /**
     * Validate a border configuration
     *
     * @param border - Border configuration to validate
     * @returns True if valid, false otherwise
     */
    static isValidBorder(border: BorderConfig): boolean;
    /**
     * Merge two border configurations, with the second taking precedence
     *
     * @param base - Base border configuration
     * @param override - Override border configuration
     * @returns Merged border configuration
     */
    static mergeBorders(base: BorderConfig, override: BorderConfig): BorderConfig;
}
export declare function NormalBorder(): BorderStyle;
export declare function RoundedBorder(): BorderStyle;
export declare function BlockBorder(): BorderStyle;
export declare function OuterHalfBlockBorder(): BorderStyle;
export declare function InnerHalfBlockBorder(): BorderStyle;
export declare function ThickBorder(): BorderStyle;
export declare function DoubleBorder(): BorderStyle;
export declare function HiddenBorder(): BorderStyle;
export declare function MarkdownBorder(): BorderStyle;
export declare function ASCIIBorder(): BorderStyle;
export type { BorderStyle, BorderType, BorderConfig };
export { isValidBorderStyle };
//# sourceMappingURL=borders.d.ts.map