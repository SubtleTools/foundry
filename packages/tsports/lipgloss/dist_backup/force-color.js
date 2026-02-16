/**
 * Force Color Utility
 *
 * This module provides utilities to force color output even when stdout is not a TTY
 * (e.g., when piping to files or redirecting output). This is useful for ensuring
 * color escape codes are always emitted when needed.
 */
import { ColorProfile } from './types';
/**
 * Global state for forced color configuration
 */
const forceColorState = {
    enabled: false,
    level: undefined,
    overrideNoColor: false,
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
export function enableForceColor(options = {}) {
    forceColorState.enabled = true;
    forceColorState.level = options.level ?? undefined;
    forceColorState.overrideNoColor = options.overrideNoColor || false;
    // Set environment variable for consistency
    if (typeof process !== 'undefined') {
        const level = options.level !== undefined ? options.level.toString() : '1';
        process.env.FORCE_COLOR = level;
        // Optionally remove NO_COLOR if overriding
        if (options.overrideNoColor && process.env.NO_COLOR) {
            delete process.env.NO_COLOR;
        }
    }
    // Reset color detection to pick up the change
    // Note: Color detection reset would happen here in a complete implementation
    // This functionality is not yet implemented in this TypeScript port
}
/**
 * Disable forced color output
 *
 * This restores normal color detection behavior based on TTY and environment variables.
 */
export function disableForceColor() {
    forceColorState.enabled = false;
    forceColorState.level = undefined;
    forceColorState.overrideNoColor = false;
    // Remove environment variable
    if (typeof process !== 'undefined' && process.env.FORCE_COLOR) {
        delete process.env.FORCE_COLOR;
    }
    // Reset color detection
    // Note: Color detection reset would happen here in a complete implementation
    // This functionality is not yet implemented in this TypeScript port
}
/**
 * Check if force color is currently enabled
 */
export function isForceColorEnabled() {
    return forceColorState.enabled;
}
/**
 * Get current force color configuration
 */
export function getForceColorConfig() {
    return { ...forceColorState };
}
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
export function setForceColorEnv(value) {
    if (typeof process === 'undefined') {
        console.warn('setForceColorEnv: process is not available (not in Node.js environment)');
        return;
    }
    if (value === undefined) {
        delete process.env.FORCE_COLOR;
    }
    else {
        process.env.FORCE_COLOR = value.toString();
    }
    // Reset color detection to pick up the change
    // Note: Color detection reset would happen here in a complete implementation
    // This functionality is not yet implemented in this TypeScript port
}
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
export function overrideNoColor(override) {
    if (typeof process === 'undefined') {
        console.warn('overrideNoColor: process is not available (not in Node.js environment)');
        return;
    }
    if (override) {
        // Store original value if it exists
        if (process.env.NO_COLOR && !process.env._LIPGLOSS_NO_COLOR_BACKUP) {
            process.env._LIPGLOSS_NO_COLOR_BACKUP = process.env.NO_COLOR;
        }
        delete process.env.NO_COLOR;
    }
    else {
        // Restore original value if it was backed up
        if (process.env._LIPGLOSS_NO_COLOR_BACKUP) {
            process.env.NO_COLOR = process.env._LIPGLOSS_NO_COLOR_BACKUP;
            delete process.env._LIPGLOSS_NO_COLOR_BACKUP;
        }
    }
    // Reset color detection to pick up the change
    // Note: Color detection reset would happen here in a complete implementation
    // This functionality is not yet implemented in this TypeScript port
}
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
export function withForceColor(fn, options = {}) {
    // Save current state
    const originalState = { ...forceColorState };
    const originalForceColor = typeof process !== 'undefined' ? process.env.FORCE_COLOR : undefined;
    const originalNoColor = typeof process !== 'undefined' ? process.env.NO_COLOR : undefined;
    try {
        // Enable force color
        enableForceColor(options);
        // Run the function
        return fn();
    }
    finally {
        // Restore original state
        forceColorState.enabled = originalState.enabled;
        forceColorState.level = originalState.level ?? undefined;
        forceColorState.overrideNoColor = originalState.overrideNoColor;
        // Restore environment variables
        if (typeof process !== 'undefined') {
            if (originalForceColor === undefined) {
                delete process.env.FORCE_COLOR;
            }
            else {
                process.env.FORCE_COLOR = originalForceColor;
            }
            if (originalNoColor === undefined) {
                delete process.env.NO_COLOR;
            }
            else {
                process.env.NO_COLOR = originalNoColor;
            }
        }
        // Reset color detection
        // Note: Color detection reset would happen here in a complete implementation
        // This functionality is not yet implemented in this TypeScript port
    }
}
/**
 * Convert color profile to force color level
 */
export function colorProfileToLevel(profile) {
    switch (profile) {
        case ColorProfile.Ascii:
            return 0;
        case ColorProfile.ANSI:
            return 1;
        case ColorProfile.ANSI256:
            return 2;
        case ColorProfile.TrueColor:
            return 3;
        default:
            return 1;
    }
}
/**
 * Convert force color level to color profile
 */
export function levelToColorProfile(level) {
    switch (level) {
        case 0:
            return ColorProfile.Ascii;
        case 1:
            return ColorProfile.ANSI;
        case 2:
            return ColorProfile.ANSI256;
        case 3:
            return ColorProfile.TrueColor;
        default:
            return ColorProfile.ANSI;
    }
}
//# sourceMappingURL=force-color.js.map