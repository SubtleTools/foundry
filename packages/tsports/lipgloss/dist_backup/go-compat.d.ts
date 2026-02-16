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
import type { PascalCase } from 'type-fest';
import { NewRange } from './ranges';
import { Renderer } from './renderer';
import { Style } from './style';
import { type Table } from './table';
/**
 * Creates a new Style instance (Go-compatible).
 * Identical to Go's lipgloss.NewStyle() function.
 *
 * @returns A new Style instance with Go-compatible API
 */
export declare function NewStyle(): GoStyle;
/**
 * Creates a new Renderer instance (Go-compatible).
 * Identical to Go's lipgloss.NewRenderer() function.
 *
 * @returns A new Renderer instance with Go-compatible API
 */
export declare function NewRenderer(): GoRenderer;
/**
 * Creates a new Table instance (Go-compatible).
 * Identical to Go's lipgloss.NewTable() function.
 *
 * @returns A new Table instance with Go-compatible API
 */
export declare function NewTable(): GoTable;
/**
 * Creates a color value (Go-compatible).
 * Identical to Go's lipgloss.Color() function.
 *
 * @param colorValue - Color string (hex, named, or ANSI code)
 * @returns Color value that can be used with .Foreground() and .Background()
 */
export declare function Color(colorValue: string): string;
/**
 * Returns the normal border style (Go-compatible).
 * Identical to Go's lipgloss.NormalBorder() function.
 */
export declare function NormalBorder(): any;
/**
 * Returns the rounded border style (Go-compatible).
 * Identical to Go's lipgloss.RoundedBorder() function.
 */
export declare function RoundedBorder(): any;
/**
 * Returns the block border style (Go-compatible).
 * Identical to Go's lipgloss.BlockBorder() function.
 */
export declare function BlockBorder(): any;
/**
 * Returns the thick border style (Go-compatible).
 * Identical to Go's lipgloss.ThickBorder() function.
 */
export declare function ThickBorder(): any;
/**
 * Returns the double border style (Go-compatible).
 * Identical to Go's lipgloss.DoubleBorder() function.
 */
export declare function DoubleBorder(): any;
/**
 * Returns the hidden border style (Go-compatible).
 * Identical to Go's lipgloss.HiddenBorder() function.
 */
export declare function HiddenBorder(): any;
/**
 * Center alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Center constant.
 */
export declare const Center = 0.5;
/**
 * Left alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Left constant.
 */
export declare const Left = 0;
/**
 * Right alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Right constant.
 */
export declare const Right = 1;
/**
 * Top alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Top constant.
 */
export declare const Top = 0;
/**
 * Bottom alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Bottom constant.
 */
export declare const Bottom = 1;
/**
 * Middle alignment constant (Go-compatible).
 * Identical to Go's lipgloss.Middle constant.
 */
export declare const Middle = 0.5;
/**
 * Type that converts all method names from camelCase to PascalCase.
 * This provides TypeScript autocomplete and type checking for Go-style method names.
 */
type GoStyleMethods<T> = {
    [K in keyof T as T[K] extends Function ? PascalCase<K & string> : never]: T[K] extends (...args: infer Args) => infer Return ? Return extends T ? (...args: Args) => GoStyleMethods<T> : (...args: Args) => Return : never;
};
/**
 * Go-compatible Style class with automatic PascalCase method generation.
 * This provides the exact same API as Go Lipgloss with methods like:
 * .Foreground(), .Background(), .Bold(), .Italic(), .Padding(), etc.
 */
export type GoStyle = Style & GoStyleMethods<Style>;
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
export declare function createNewStyle(): GoStyle;
/**
 * Go-compatible Table class with automatic PascalCase method generation.
 */
export type GoTable = Table & GoStyleMethods<Table>;
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
export declare function createNewTable(): GoTable;
/**
 * Go-compatible Renderer class with automatic PascalCase method generation.
 */
export type GoRenderer = Renderer & GoStyleMethods<Renderer>;
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
export declare function createNewRenderer(): GoRenderer;
export { NewRange };
export { BorderStyles, Borders, BorderType, ColorProfile, Colors, FontStyle, FontWeight, GetColorProfile, Height, HorizontalAlignment, JoinHorizontal, JoinVertical, Place, PlaceHorizontal, PlaceVertical, SetColorProfile, Size, VerticalAlignment, Width, } from './index';
//# sourceMappingURL=go-compat.d.ts.map