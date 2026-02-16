/**
 * Table Utility Functions
 *
 * This module provides a comprehensive collection of utility functions specifically
 * designed for table operations. These functions handle mathematical calculations,
 * array manipulations, and other common operations needed throughout the table
 * rendering system.
 *
 * ## Function Categories
 *
 * - **Type Conversion**: Convert between different data types
 * - **Array Operations**: Mathematical operations on arrays
 * - **Statistical Functions**: Median, min, max calculations
 * - **Array Utilities**: Safe access, filling, mapping operations
 * - **Distribution Functions**: Proportional distribution algorithms
 *
 * The utilities are designed to be:
 * - **Safe**: Handle edge cases and invalid inputs gracefully
 * - **Efficient**: Optimized for performance in table rendering contexts
 * - **Reusable**: Generic implementations suitable for various use cases
 * - **Type-Safe**: Full TypeScript support with proper type definitions
 *
 * @example Mathematical Operations
 * ```typescript
 * import { sum, median, min, max } from './utils';
 *
 * const values = [10, 5, 8, 15, 3];
 * console.log(sum(values));    // 41
 * console.log(median(values)); // 8
 * console.log(min(values));    // 3
 * console.log(max(values));    // 15
 * ```
 *
 * @example Array Utilities
 * ```typescript
 * import { fillArray, mapArray, safeArrayAccess } from './utils';
 *
 * const filled = fillArray(5, 'default');     // ['default', 'default', ...]
 * const mapped = mapArray(3, i => i * 2);     // [0, 2, 4]
 * const safe = safeArrayAccess([1,2,3], 5, 0); // 0 (safe fallback)
 * ```
 *
 * @example Distribution
 * ```typescript
 * import { distributeProportionally } from './utils';
 *
 * const weights = [1, 2, 3];
 * const distributed = distributeProportionally(100, weights);
 * // Result: [17, 33, 50] (proportional to weights)
 * ```
 */
/**
 * Converts a boolean to an integer: 1 if true, 0 if false.
 * @param b - The boolean value to convert
 * @returns 1 if true, 0 if false
 */
export declare function btoi(b: boolean): number;
/**
 * Returns the sum of all integers in an array.
 * @param numbers - Array of numbers to sum
 * @returns The sum of all numbers
 */
export declare function sum(numbers: number[]): number;
/**
 * Returns the median of an array of integers.
 * @param numbers - Array of numbers to find the median of
 * @returns The median value
 */
export declare function median(numbers: number[]): number;
/**
 * Returns the minimum value from an array of numbers.
 * @param numbers - Array of numbers
 * @returns The minimum value, or 0 if array is empty
 */
export declare function min(numbers: number[]): number;
/**
 * Returns the maximum value from an array of numbers.
 * @param numbers - Array of numbers
 * @returns The maximum value, or 0 if array is empty
 */
export declare function max(numbers: number[]): number;
/**
 * Returns the maximum value between two numbers.
 * @param a - First number
 * @param b - Second number
 * @returns The larger of the two numbers
 */
export declare function maxOf(a: number, b: number): number;
/**
 * Returns the minimum value between two numbers.
 * @param a - First number
 * @param b - Second number
 * @returns The smaller of the two numbers
 */
export declare function minOf(a: number, b: number): number;
/**
 * Clamps a value between a minimum and maximum.
 * @param value - The value to clamp
 * @param minimum - The minimum allowed value
 * @param maximum - The maximum allowed value
 * @returns The clamped value
 */
export declare function clamp(value: number, minimum: number, maximum: number): number;
/**
 * Returns an array of specified length filled with a default value.
 * @param length - The length of the array to create
 * @param defaultValue - The default value to fill the array with
 * @returns A new array filled with the default value
 */
export declare function fillArray<T>(length: number, defaultValue: T): T[];
/**
 * Returns an array of specified length filled with values from a function.
 * @param length - The length of the array to create
 * @param fillFunction - Function that returns a value for each index
 * @returns A new array filled with values from the function
 */
export declare function mapArray<T>(length: number, fillFunction: (index: number) => T): T[];
/**
 * Safely accesses an array element, returning a default value if out of bounds.
 * @param array - The array to access
 * @param index - The index to access
 * @param defaultValue - The default value to return if out of bounds
 * @returns The element at the index, or the default value
 */
export declare function safeArrayAccess<T>(array: T[], index: number, defaultValue: T): T;
/**
 * Ensures a value is at least a minimum value.
 * @param value - The value to check
 * @param minimum - The minimum allowed value
 * @returns The value if it's >= minimum, otherwise the minimum
 */
export declare function ensureMinimum(value: number, minimum: number): number;
/**
 * Distributes a total amount across multiple items proportionally based on weights.
 *
 * This function implements a fair distribution algorithm that allocates a total
 * amount among multiple recipients based on their relative weights. It ensures
 * that the sum of distributed amounts equals the total input while handling
 * rounding issues through a sophisticated remainder distribution system.
 *
 * ## Algorithm Details
 *
 * 1. **Initial Distribution**: Each item gets floor(weight/totalWeight * total)
 * 2. **Remainder Calculation**: Calculate any remaining amount due to rounding
 * 3. **Fractional Analysis**: Determine which items have the largest fractional parts
 * 4. **Remainder Distribution**: Distribute remainder to items with largest fractions
 *
 * This approach ensures fairness and maintains mathematical precision.
 *
 * @param total - The total amount to distribute (must be non-negative)
 * @param weights - Array of weights for each recipient (must be non-negative)
 * @returns Array of distributed amounts that sum exactly to the total
 *
 * @example Basic Distribution
 * ```typescript
 * const total = 100;
 * const weights = [1, 2, 3]; // Recipients with weights 1:2:3
 * const result = distributeProportionally(total, weights);
 * console.log(result); // [17, 33, 50] (approximately 1/6, 2/6, 3/6 of 100)
 * console.log(sum(result)); // 100 (exactly)
 * ```
 *
 * @example Column Width Distribution
 * ```typescript
 * // Distribute table width among columns based on content
 * const tableWidth = 80;
 * const contentWidths = [10, 25, 15]; // Natural content widths
 * const columnWidths = distributeProportionally(tableWidth, contentWidths);
 * // Result: [16, 40, 24] (proportional allocation)
 * ```
 *
 * @example Equal Distribution
 * ```typescript
 * const equal = distributeProportionally(100, [1, 1, 1, 1]);
 * console.log(equal); // [25, 25, 25, 25]
 * ```
 *
 * @example Handling Edge Cases
 * ```typescript
 * // Zero weights result in zero allocation
 * const zeroWeights = distributeProportionally(100, [0, 0, 0]);
 * console.log(zeroWeights); // [0, 0, 0]
 *
 * // Empty array returns empty result
 * const empty = distributeProportionally(100, []);
 * console.log(empty); // []
 *
 * // Single item gets everything
 * const single = distributeProportionally(100, [5]);
 * console.log(single); // [100]
 * ```
 *
 * @example Real-World Usage in Tables
 * ```typescript
 * // Auto-sizing table columns
 * class TableResizer {
 *   distributeWidth(availableWidth: number, preferredWidths: number[]): number[] {
 *     return distributeProportionally(availableWidth, preferredWidths);
 *   }
 *
 *   // Usage in table rendering
 *   const preferredWidths = columns.map(col => col.getPreferredWidth());
 *   const actualWidths = this.distributeWidth(tableWidth, preferredWidths);
 * }
 * ```
 */
export declare function distributeProportionally(total: number, weights: number[]): number[];
//# sourceMappingURL=utils.d.ts.map