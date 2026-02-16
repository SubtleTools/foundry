/**
 * ANSI utility functions
 */
/**
 * Calculate display width of string (alias for getTextWidth)
 * This is used by Go reference ports to maintain API compatibility
 */
export declare function stringWidth(str: string): number;
/**
 * Strip ANSI escape sequences from a string
 * Based on the ANSI stripping logic from @tsports/termenv
 */
export declare function stripAnsi(str: string): string;
//# sourceMappingURL=ansi-utils.d.ts.map