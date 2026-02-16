/**
 * Force Color Utility
 *
 * This module provides utilities to force color output even when stdout is not a TTY
 * (e.g., when piping to files or redirecting output). This is useful for ensuring
 * color escape codes are always emitted when needed.
 */
import { ColorProfile } from './types';
/**
 * Force color configuration options
 */
export interface ForceColorOptions {
    /** Force color level (0=none, 1=basic, 2=256colors, 3=truecolor) */
    level?: 0 | 1 | 2 | 3;
    /** Whether to override NO_COLOR environment variable */
    overrideNoColor?: boolean;
}
/**
 * Global state for forced color configuration
 */
declare const forceColorState: {
    enabled: boolean;
    level?: 0 | 1 | 2 | 3 | undefined;
    overrideNoColor: boolean;
};
/**
 * Enable forced color output with optional configuration
 *
 * This function bypasses TTY detection and environment variables to force
 * color output. Useful when you want colors even when piping to files.
 *
 * @param options - Force color configuration options
 *
 * @example
 * ```typescript
 * import { enableForceColor } from '@tsports/lipgloss/force-color';
 *
 * // Enable with auto-detection of best color level
 * enableForceColor();
 *
 * // Force specific color level
 * enableForceColor({ level: 3 }); // Force true color
 *
 * // Override NO_COLOR environment variable
 * enableForceColor({ overrideNoColor: true });
 * ```
 */
export declare function enableForceColor(options?: ForceColorOptions): void;
/**
 * Disable forced color output
 *
 * This restores normal color detection behavior based on TTY and environment variables.
 */
export declare function disableForceColor(): void;
/**
 * Check if force color is currently enabled
 */
export declare function isForceColorEnabled(): boolean;
/**
 * Get current force color configuration
 */
export declare function getForceColorConfig(): Readonly<typeof forceColorState>;
/**
 * Set FORCE_COLOR environment variable directly
 *
 * This is a lower-level function that directly manipulates the FORCE_COLOR
 * environment variable. Use enableForceColor() for most cases.
 *
 * @param value - FORCE_COLOR value (0, 1, 2, 3, or undefined to unset)
 *
 * @example
 * ```typescript
 * import { setForceColorEnv } from '@tsports/lipgloss/force-color';
 *
 * // Force true color
 * setForceColorEnv(3);
 *
 * // Disable colors
 * setForceColorEnv(0);
 *
 * // Remove FORCE_COLOR (restore normal detection)
 * setForceColorEnv(undefined);
 * ```
 */
export declare function setForceColorEnv(value: 0 | 1 | 2 | 3 | undefined): void;
/**
 * Override NO_COLOR environment variable
 *
 * This temporarily removes or restores the NO_COLOR environment variable.
 * Useful for forcing colors even when NO_COLOR is set.
 *
 * @param override - Whether to override (remove) NO_COLOR
 *
 * @example
 * ```typescript
 * import { overrideNoColor } from '@tsports/lipgloss/force-color';
 *
 * // Temporarily ignore NO_COLOR
 * overrideNoColor(true);
 *
 * // Restore NO_COLOR behavior
 * overrideNoColor(false);
 * ```
 */
export declare function overrideNoColor(override: boolean): void;
/**
 * Utility function to run code with forced colors
 *
 * This function temporarily enables forced colors, runs the provided function,
 * and then restores the original color settings.
 *
 * @param fn - Function to run with forced colors
 * @param options - Force color configuration options
 * @returns The result of the function
 *
 * @example
 * ```typescript
 * import { withForceColor } from '@tsports/lipgloss/force-color';
 * import { Style } from '@tsports/lipgloss';
 *
 * const result = withForceColor(() => {
 *   const style = new Style().color('red').bold(true);
 *   return style.render('This will have colors even when piped!');
 * }, { level: 3, overrideNoColor: true });
 *
 * console.log(result); // Will have ANSI escape codes
 * ```
 */
export declare function withForceColor<T>(fn: () => T, options?: ForceColorOptions): T;
/**
 * Convert color profile to force color level
 */
export declare function colorProfileToLevel(profile: ColorProfile): 0 | 1 | 2 | 3;
/**
 * Convert force color level to color profile
 */
export declare function levelToColorProfile(level: 0 | 1 | 2 | 3): ColorProfile;
export {};
//# sourceMappingURL=force-color.d.ts.map