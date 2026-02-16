/**
 * Go Compatibility Layer for Lipgloss TypeScript
 *
 * This module provides a Go-compatible API layer for developers who want to use
 * the exact same function names and patterns as Go Lipgloss. It wraps the native
 * TypeScript API to provide 100% Go compatibility.
 *
 * @example
 * ```typescript
 * // Go-style import and usage (factory functions only - camelCase methods)
 * import { NewStyle, NewTable } from '@tsports/lipgloss/go-compat';
 *
 * const style = NewStyle()
 *   .foreground('red')
 *   .backgroundColor('blue')
 *   .bold(true);
 *
 * // For EXACT Go API compatibility with PascalCase methods:
 * import { NewStyle, NewTable } from '@tsports/lipgloss/go-compat';
 *
 * const goStyle = NewStyle()
 *   .Foreground('red')        // Exact Go API
 *   .Background('blue')       // Exact Go API
 *   .Bold(true);              // Exact Go API
 *
 * const goTable = NewTable()
 *   .Headers('Name', 'Age')   // Exact Go API
 *   .Row('Alice', '25');      // Exact Go API
 * ```
 */
import { NewRange } from './ranges';
import { Renderer } from './renderer';
import { Style } from './style';
import { newTable } from './table';
// =============================================================================
// FACTORY FUNCTIONS (Go-style)
// =============================================================================
/**
 * Creates a new Style instance (Go-compatible).
 * Identical to Go's lipgloss.NewStyle() function.
 *
 * @returns A new Style instance with Go-compatible API
 */
export function NewStyle() {
    return createGoProxy(new Style());
}
/**
 * Creates a new Renderer instance (Go-compatible).
 * Identical to Go's lipgloss.NewRenderer() function.
 *
 * @returns A new Renderer instance with Go-compatible API
 */
export function NewRenderer() {
    return createGoProxy(new Renderer());
}
/**
 * Creates a new Table instance (Go-compatible).
 * Identical to Go's lipgloss.NewTable() function.
 *
 * @returns A new Table instance with Go-compatible API
 */
export function NewTable() {
    return createGoProxy(newTable());
}
/**
 * Creates a color value (Go-compatible).
 * Identical to Go's lipgloss.Color() function.
 *
 * @param colorValue - Color string (hex, named, or ANSI code)
 * @returns Color value that can be used with .Foreground() and .Background()
 */
export function Color(colorValue) {
    return colorValue;
}
/**
 * Returns the normal border style (Go-compatible).
 * Identical to Go's lipgloss.NormalBorder() function.
 */
export function NormalBorder() {
    const { BorderStyles } = require('./index');
    return BorderStyles.Normal;
}
/**
 * Returns the rounded border style (Go-compatible).
 * Identical to Go's lipgloss.RoundedBorder() function.
 */
export function RoundedBorder() {
    const { BorderStyles } = require('./index');
    return BorderStyles.Rounded;
}
/**
 * Returns the block border style (Go-compatible).
 * Identical to Go's lipgloss.BlockBorder() function.
 */
export function BlockBorder() {
    const { BorderStyles } = require('./index');
    return BorderStyles.Block;
}
/**
 * Returns the thick border style (Go-compatible).
 * Identical to Go's lipgloss.ThickBorder() function.
 */
export function ThickBorder() {
    const { BorderStyles } = require('./index');
    return BorderStyles.Thick;
}
/**
 * Returns the double border style (Go-compatible).
 * Identical to Go's lipgloss.DoubleBorder() function.
 */
export function DoubleBorder() {
    const { BorderStyles } = require('./index');
    return BorderStyles.Double;
}
/**
 * Returns the hidden border style (Go-compatible).
 * Identical to Go's lipgloss.HiddenBorder() function.
 */
export function HiddenBorder() {
    const { BorderStyles } = require('./index');
    return BorderStyles.Hidden;
}
// =============================================================================
// GO-STYLE CONSTANTS AND ALIASES
// =============================================================================
/**
 * Center alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Center constant.
 */
export const Center = 0.5;
/**
 * Left alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Left constant.
 */
export const Left = 0.0;
/**
 * Right alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Right constant.
 */
export const Right = 1.0;
/**
 * Top alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Top constant.
 */
export const Top = 0.0;
/**
 * Bottom alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Bottom constant.
 */
export const Bottom = 1.0;
/**
 * Middle alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Middle constant.
 */
export const Middle = 0.5;
// Method name mapping for Go compatibility
const GO_METHOD_MAP = {
    // Style methods - CRITICAL: These must exactly match Go Lipgloss API
    Color: 'color',
    Foreground: 'color', // Go's .Foreground() -> TS .color()
    BackgroundColor: 'backgroundColor',
    Background: 'backgroundColor', // Go's .Background() -> TS .backgroundColor()
    Bold: 'bold',
    Italic: 'italic',
    Underline: 'underline',
    Strikethrough: 'strikethrough',
    Reverse: 'reverse',
    Blink: 'blink',
    Faint: 'faint',
    Width: 'width',
    Height: 'height',
    MaxWidth: 'maxWidth',
    MaxHeight: 'maxHeight',
    Padding: 'padding',
    PaddingTop: 'paddingTop',
    PaddingRight: 'paddingRight',
    PaddingBottom: 'paddingBottom',
    PaddingLeft: 'paddingLeft',
    Margin: 'margin',
    MarginTop: 'marginTop',
    MarginRight: 'marginRight',
    MarginBottom: 'marginBottom',
    MarginLeft: 'marginLeft',
    AlignHorizontal: 'align',
    AlignVertical: 'align',
    Align: 'align',
    Border: 'border',
    BorderStyle: 'borderStyle',
    BorderTop: 'borderTop',
    BorderRight: 'borderRight',
    BorderBottom: 'borderBottom',
    BorderLeft: 'borderLeft',
    BorderForeground: 'borderForeground',
    Render: 'render',
    String: 'String',
    Copy: 'copy',
    Inherit: 'inherit',
    // Table methods
    SetHeaders: 'setHeaders',
    Headers: 'setHeaders', // Alternative Go alias
    Row: 'row',
    Rows: 'rows',
    SetBorder: 'setBorder',
    // Renderer methods
    SetColorProfile: 'setColorProfile',
};
/**
 * Creates a dynamic proxy that automatically maps PascalCase method calls to camelCase.
 * This allows Go developers to use exact Go method names like .Foreground(), .Bold(), etc.
 *
 * @param instance - The TypeScript class instance to wrap
 * @returns Proxy that supports both original and PascalCase method names
 */
/**
 * Resolves method conflicts based on object type and available methods.
 * This allows the same Go method name to map to different TypeScript methods
 * depending on the object type (Style vs Table vs Renderer).
 */
function resolveContextAwareMethod(target, methodName) {
    // Handle context-specific method conflicts
    switch (methodName) {
        case 'Border':
            // For tables: Border -> setBorder, For styles: Border -> border
            if ('setHeaders' in target)
                return 'setBorder'; // Table-like object
            if ('color' in target)
                return 'border'; // Style-like object
            break;
        case 'Render':
            // For renderers: Render -> render, For styles: Render -> render
            // Both use the same method name, but we can differentiate if needed
            return 'render';
        default: {
            // Check explicit mapping
            const mappedMethod = GO_METHOD_MAP[methodName];
            if (mappedMethod && mappedMethod in target && typeof target[mappedMethod] === 'function') {
                return mappedMethod;
            }
        }
    }
    return null;
}
function createGoProxy(instance) {
    const proxy = new Proxy(instance, {
        get(target, prop) {
            if (typeof prop === 'string' && prop.length > 0) {
                const firstChar = prop.charAt(0);
                if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase()) {
                    // Try context-aware method resolution first
                    const contextMethod = resolveContextAwareMethod(target, prop);
                    if (contextMethod &&
                        contextMethod in target &&
                        typeof target[contextMethod] === 'function') {
                        return (...args) => {
                            const result = target[contextMethod](...args);
                            // If method returns a chainable instance, wrap it in a new proxy
                            if (result &&
                                typeof result === 'object' &&
                                result.constructor === target.constructor) {
                                return createGoProxy(result);
                            }
                            return result;
                        };
                    }
                    // Fallback: Convert PascalCase to camelCase (e.g., SomeMethod -> someMethod)
                    const camelCase = firstChar.toLowerCase() + prop.slice(1);
                    if (camelCase in target && typeof target[camelCase] === 'function') {
                        return (...args) => {
                            const result = target[camelCase](...args);
                            // If method returns a chainable instance, wrap it in a new proxy
                            if (result &&
                                typeof result === 'object' &&
                                result.constructor === target.constructor) {
                                return createGoProxy(result);
                            }
                            return result;
                        };
                    }
                }
            }
            // Fall back to original property, but wrap chainable methods in proxy
            const originalProp = target[prop];
            if (typeof originalProp === 'function') {
                return (...args) => {
                    const result = originalProp.apply(target, args);
                    // If method returns a chainable instance, wrap it in a new proxy
                    if (result && typeof result === 'object' && result.constructor === target.constructor) {
                        return createGoProxy(result);
                    }
                    return result;
                };
            }
            return originalProp;
        },
    });
    return proxy;
}
/**
 * Creates a new Go-compatible Style instance with PascalCase methods.
 * This version provides exact Go API compatibility.
 *
 * @example
 * ```typescript
 * import { createNewStyle } from '@tsports/lipgloss/go-compat';
 *
 * const style = createNewStyle()
 *   .Foreground('red')      // Go-style PascalCase
 *   .Background('blue')     // Go-style PascalCase
 *   .Bold(true)             // Go-style PascalCase
 *   .Padding(1, 2);         // Go-style PascalCase
 * ```
 */
export function createNewStyle() {
    return createGoProxy(new Style());
}
/**
 * Creates a new Go-compatible Table instance with PascalCase methods.
 *
 * @example
 * ```typescript
 * import { createNewTable } from '@tsports/lipgloss/go-compat';
 *
 * const table = createNewTable()
 *   .Headers('Name', 'Age')   // Go-style PascalCase
 *   .Row('Alice', '25')       // Go-style PascalCase
 *   .Border(true);            // Go-style PascalCase
 * ```
 */
export function createNewTable() {
    return createGoProxy(newTable());
}
/**
 * Creates a new Go-compatible Renderer instance with PascalCase methods.
 *
 * @example
 * ```typescript
 * import { createNewRenderer } from '@tsports/lipgloss/go-compat';
 *
 * const renderer = createNewRenderer()
 *   .SetColorProfile(ColorProfile.TrueColor);  // Go-style PascalCase
 * ```
 */
export function createNewRenderer() {
    return createGoProxy(new Renderer());
}
// =============================================================================
// RE-EXPORTS FOR GO COMPATIBILITY
// =============================================================================
// Export the NewRange function (already Go-compatible)
export { NewRange };
// Export utility functions with Go-compatible names
// Export enums and types
export { BorderStyles, Borders, BorderType, ColorProfile, Colors, FontStyle, FontWeight, GetColorProfile, Height, HorizontalAlignment, JoinHorizontal, JoinVertical, Place, PlaceHorizontal, PlaceVertical, SetColorProfile, Size, VerticalAlignment, Width, } from './index';
//# sourceMappingURL=go-compat.js.map