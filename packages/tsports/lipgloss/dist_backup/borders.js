/**
 * Border styles and utilities - comprehensive border support
 *
 * This module handles border definitions, border rendering, and
 * border style management with full TypeScript type safety.
 */
import { BorderType, isValidBorderStyle, } from './types';
/**
 * NoBorder represents no border styling.
 */
export const NoBorder = {
    style: BorderType.None,
    top: false,
    right: false,
    bottom: false,
    left: false,
};
/**
 * Predefined border style definitions
 */
export const BorderStyles = {
    [BorderType.None]: {},
    [BorderType.Normal]: {
        top: '─',
        right: '│',
        bottom: '─',
        left: '│',
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        middleLeft: '├',
        middleRight: '┤',
        middle: '┼',
        middleTop: '┬',
        middleBottom: '┴',
    },
    [BorderType.Rounded]: {
        top: '─',
        right: '│',
        bottom: '─',
        left: '│',
        topLeft: '╭',
        topRight: '╮',
        bottomLeft: '╰',
        bottomRight: '╯',
        middleLeft: '├',
        middleRight: '┤',
        middle: '┼',
        middleTop: '┬',
        middleBottom: '┴',
    },
    [BorderType.Thick]: {
        top: '━',
        right: '┃',
        bottom: '━',
        left: '┃',
        topLeft: '┏',
        topRight: '┓',
        bottomLeft: '┗',
        bottomRight: '┛',
        middleLeft: '┣',
        middleRight: '┫',
        middle: '╋',
        middleTop: '┳',
        middleBottom: '┻',
    },
    [BorderType.Double]: {
        top: '═',
        right: '║',
        bottom: '═',
        left: '║',
        topLeft: '╔',
        topRight: '╗',
        bottomLeft: '╚',
        bottomRight: '╝',
        middleLeft: '╠',
        middleRight: '╣',
        middle: '╬',
        middleTop: '╦',
        middleBottom: '╩',
    },
    [BorderType.Hidden]: {
        top: ' ',
        right: ' ',
        bottom: ' ',
        left: ' ',
        topLeft: ' ',
        topRight: ' ',
        bottomLeft: ' ',
        bottomRight: ' ',
        middleLeft: ' ',
        middleRight: ' ',
        middle: ' ',
        middleTop: ' ',
        middleBottom: ' ',
    },
    [BorderType.ASCII]: {
        top: '-',
        right: '|',
        bottom: '-',
        left: '|',
        topLeft: '+',
        topRight: '+',
        bottomLeft: '+',
        bottomRight: '+',
        middleLeft: '+',
        middleRight: '+',
        middle: '+',
        middleTop: '+',
        middleBottom: '+',
    },
    [BorderType.Block]: {
        top: '█',
        right: '█',
        bottom: '█',
        left: '█',
        topLeft: '█',
        topRight: '█',
        bottomLeft: '█',
        bottomRight: '█',
        middleLeft: '█',
        middleRight: '█',
        middle: '█',
        middleTop: '█',
        middleBottom: '█',
    },
    [BorderType.OuterHalfBlock]: {
        top: '▀',
        right: '▐',
        bottom: '▄',
        left: '▌',
        topLeft: '▛',
        topRight: '▜',
        bottomLeft: '▙',
        bottomRight: '▟',
        middleLeft: '▌',
        middleRight: '▐',
        middle: '█',
        middleTop: '▀',
        middleBottom: '▄',
    },
    [BorderType.InnerHalfBlock]: {
        top: '▄',
        right: '▌',
        bottom: '▀',
        left: '▐',
        topLeft: '▗',
        topRight: '▖',
        bottomLeft: '▝',
        bottomRight: '▘',
        middleLeft: '▐',
        middleRight: '▌',
        middle: '▄',
        middleTop: '▄',
        middleBottom: '▀',
    },
    [BorderType.Markdown]: {
        top: '-',
        right: '|',
        bottom: '-',
        left: '|',
        topLeft: '|',
        topRight: '|',
        bottomLeft: '|',
        bottomRight: '|',
        middleLeft: '|',
        middleRight: '|',
        middle: '|',
        middleTop: '|',
        middleBottom: '|',
    },
    // Capitalized aliases for Go compatibility
    get Normal() { return this[BorderType.Normal]; },
    get Rounded() { return this[BorderType.Rounded]; },
    get Thick() { return this[BorderType.Thick]; },
    get Double() { return this[BorderType.Double]; },
    get Hidden() { return this[BorderType.Hidden]; },
    get ASCII() { return this[BorderType.ASCII]; },
    get Block() { return this[BorderType.Block]; },
    get OuterHalfBlock() { return this[BorderType.OuterHalfBlock]; },
    get InnerHalfBlock() { return this[BorderType.InnerHalfBlock]; },
    get Markdown() { return this[BorderType.Markdown]; },
    get None() { return this[BorderType.None]; },
};
/**
 * Common border configurations for easy use
 */
export const Borders = {
    None: { style: BorderType.None },
    Normal: { style: BorderType.Normal },
    Rounded: { style: BorderType.Rounded },
    Thick: { style: BorderType.Thick },
    Double: { style: BorderType.Double },
    Hidden: { style: BorderType.Hidden },
    ASCII: { style: BorderType.ASCII },
    Block: { style: BorderType.Block },
    OuterHalfBlock: { style: BorderType.OuterHalfBlock },
    InnerHalfBlock: { style: BorderType.InnerHalfBlock },
    Markdown: { style: BorderType.Markdown },
};
/**
 * Utility functions for border manipulation
 */
export class BorderUtils {
    /**
     * Get the border style definition for a given border type
     *
     * @param borderType - The border type to get style for
     * @returns Border style definition
     */
    static getStyleDefinition(borderType) {
        return BorderStyles[borderType] || BorderStyles[BorderType.None];
    }
    /**
     * Get the maximum width of a border edge based on character widths
     *
     * @param borderParts - Array of border part characters
     * @returns Maximum character width
     */
    static getBorderEdgeWidth(...borderParts) {
        let maxWidth = 0;
        for (const part of borderParts) {
            const width = BorderUtils.maxRuneWidth(part);
            if (width > maxWidth) {
                maxWidth = width;
            }
        }
        return maxWidth;
    }
    /**
     * Get the top border size (width)
     *
     * @param border - Border style definition
     * @returns Width of the top border
     */
    static getTopSize(border) {
        return BorderUtils.getBorderEdgeWidth(border.topLeft || '', border.top || '', border.topRight || '');
    }
    /**
     * Get the right border size (width)
     *
     * @param border - Border style definition
     * @returns Width of the right border
     */
    static getRightSize(border) {
        return BorderUtils.getBorderEdgeWidth(border.topRight || '', border.right || '', border.bottomRight || '');
    }
    /**
     * Get the bottom border size (width)
     *
     * @param border - Border style definition
     * @returns Width of the bottom border
     */
    static getBottomSize(border) {
        return BorderUtils.getBorderEdgeWidth(border.bottomLeft || '', border.bottom || '', border.bottomRight || '');
    }
    /**
     * Get the left border size (width)
     *
     * @param border - Border style definition
     * @returns Width of the left border
     */
    static getLeftSize(border) {
        return BorderUtils.getBorderEdgeWidth(border.topLeft || '', border.left || '', border.bottomLeft || '');
    }
    /**
     * Get maximum rune width of a string
     *
     * @param str - String to measure
     * @returns Maximum character width
     */
    static maxRuneWidth(str) {
        if (!str)
            return 0;
        let maxWidth = 0;
        for (const char of str) {
            // For simplicity, treat most characters as width 1
            // In a full implementation, this would use proper Unicode width calculation
            const width = char.charCodeAt(0) > 127 ? 2 : 1;
            if (width > maxWidth) {
                maxWidth = width;
            }
        }
        return maxWidth;
    }
    /**
     * Get the first rune of a string as a string
     *
     * @param str - String to get first character from
     * @returns First character or empty string
     */
    static getFirstRuneAsString(str) {
        if (!str)
            return str;
        return str[0] || '';
    }
    /**
     * Create a border configuration with specific sides enabled
     *
     * @param style - Border type or custom style
     * @param sides - Object specifying which sides to enable
     * @param color - Optional border color
     * @returns Complete border configuration
     */
    static createBorder(style, sides = { top: true, right: true, bottom: true, left: true }, color) {
        const config = {
            style,
            top: sides.top ?? true,
            right: sides.right ?? true,
            bottom: sides.bottom ?? true,
            left: sides.left ?? true,
        };
        if (color !== undefined) {
            config.color = color;
        }
        return config;
    }
    /**
     * Create a partial border (only specific sides)
     *
     * @param style - Border type or custom style
     * @param enabledSides - Array of sides to enable ('top', 'right', 'bottom', 'left')
     * @param color - Optional border color
     * @returns Border configuration with only specified sides
     */
    static createPartialBorder(style, enabledSides, color) {
        const config = {
            style,
            top: enabledSides.includes('top'),
            right: enabledSides.includes('right'),
            bottom: enabledSides.includes('bottom'),
            left: enabledSides.includes('left'),
        };
        if (color !== undefined) {
            config.color = color;
        }
        return config;
    }
    /**
     * Create a horizontal border (top and bottom only)
     *
     * @param style - Border type or custom style
     * @param color - Optional border color
     * @returns Border configuration for horizontal borders only
     */
    static horizontalBorder(style = BorderType.Normal, color) {
        return BorderUtils.createPartialBorder(style, ['top', 'bottom'], color);
    }
    /**
     * Create a vertical border (left and right only)
     *
     * @param style - Border type or custom style
     * @param color - Optional border color
     * @returns Border configuration for vertical borders only
     */
    static verticalBorder(style = BorderType.Normal, color) {
        return BorderUtils.createPartialBorder(style, ['left', 'right'], color);
    }
    /**
     * Validate a border configuration
     *
     * @param border - Border configuration to validate
     * @returns True if valid, false otherwise
     */
    static isValidBorder(border) {
        if (!border.style)
            return false;
        if (typeof border.style === 'string') {
            return Object.values(BorderType).includes(border.style);
        }
        return isValidBorderStyle(border.style);
    }
    /**
     * Merge two border configurations, with the second taking precedence
     *
     * @param base - Base border configuration
     * @param override - Override border configuration
     * @returns Merged border configuration
     */
    static mergeBorders(base, override) {
        const style = override.style ?? base.style;
        if (!style) {
            throw new Error('Border style is required');
        }
        const merged = { style };
        // Handle optional boolean properties
        const top = override.top ?? base.top;
        if (top !== undefined)
            merged.top = top;
        const right = override.right ?? base.right;
        if (right !== undefined)
            merged.right = right;
        const bottom = override.bottom ?? base.bottom;
        if (bottom !== undefined)
            merged.bottom = bottom;
        const left = override.left ?? base.left;
        if (left !== undefined)
            merged.left = left;
        // Handle optional color properties
        const color = override.color ?? base.color;
        if (color !== undefined) {
            merged.color = color;
        }
        // Handle individual side colors
        const topColor = override.topColor ?? base.topColor;
        if (topColor !== undefined)
            merged.topColor = topColor;
        const rightColor = override.rightColor ?? base.rightColor;
        if (rightColor !== undefined)
            merged.rightColor = rightColor;
        const bottomColor = override.bottomColor ?? base.bottomColor;
        if (bottomColor !== undefined)
            merged.bottomColor = bottomColor;
        const leftColor = override.leftColor ?? base.leftColor;
        if (leftColor !== undefined)
            merged.leftColor = leftColor;
        // Handle individual side background colors
        const topBackgroundColor = override.topBackgroundColor ?? base.topBackgroundColor;
        if (topBackgroundColor !== undefined)
            merged.topBackgroundColor = topBackgroundColor;
        const rightBackgroundColor = override.rightBackgroundColor ?? base.rightBackgroundColor;
        if (rightBackgroundColor !== undefined)
            merged.rightBackgroundColor = rightBackgroundColor;
        const bottomBackgroundColor = override.bottomBackgroundColor ?? base.bottomBackgroundColor;
        if (bottomBackgroundColor !== undefined)
            merged.bottomBackgroundColor = bottomBackgroundColor;
        const leftBackgroundColor = override.leftBackgroundColor ?? base.leftBackgroundColor;
        if (leftBackgroundColor !== undefined)
            merged.leftBackgroundColor = leftBackgroundColor;
        return merged;
    }
}
// Convenience functions matching Go API
export function NormalBorder() {
    return BorderStyles[BorderType.Normal];
}
export function RoundedBorder() {
    return BorderStyles[BorderType.Rounded];
}
export function BlockBorder() {
    return BorderStyles[BorderType.Block];
}
export function OuterHalfBlockBorder() {
    return BorderStyles[BorderType.OuterHalfBlock];
}
export function InnerHalfBlockBorder() {
    return BorderStyles[BorderType.InnerHalfBlock];
}
export function ThickBorder() {
    return BorderStyles[BorderType.Thick];
}
export function DoubleBorder() {
    return BorderStyles[BorderType.Double];
}
export function HiddenBorder() {
    return BorderStyles[BorderType.Hidden];
}
export function MarkdownBorder() {
    return BorderStyles[BorderType.Markdown];
}
export function ASCIIBorder() {
    return BorderStyles[BorderType.ASCII];
}
export { isValidBorderStyle };
//# sourceMappingURL=borders.js.map