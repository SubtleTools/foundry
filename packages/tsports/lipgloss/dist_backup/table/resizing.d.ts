/**
 * Table Resizing and Layout Optimization System
 *
 * This module implements sophisticated algorithms for automatic table sizing and layout
 * optimization. It handles complex scenarios including column width calculation, row
 * height optimization, content wrapping, and responsive design for terminal environments.
 *
 * ## Core Algorithms
 *
 * - **Column Width Optimization**: Analyzes content to determine optimal column widths
 * - **Space Distribution**: Distributes available space fairly among columns
 * - **Content Wrapping**: Calculates row heights when text wrapping is enabled
 * - **Constraint Satisfaction**: Balances competing requirements (width, readability, space)
 * - **Performance Optimization**: Efficient algorithms for large datasets
 *
 * ## Key Features
 *
 * - **Intelligent Sizing**: Analyzes content patterns to optimize layout
 * - **Responsive Design**: Adapts to available terminal width automatically
 * - **Style-Aware**: Considers padding, margins, and borders in calculations
 * - **Content-Driven**: Uses actual content metrics for accurate sizing
 * - **Constraint Handling**: Respects fixed widths and minimum size requirements
 *
 * ## Sizing Strategies
 *
 * 1. **Expand Strategy**: When table fits comfortably, distribute extra space
 * 2. **Shrink Strategy**: When space is limited, intelligently reduce column widths
 * 3. **Hybrid Strategy**: Combines expansion and shrinkage based on content analysis
 *
 * @example Basic Resizing
 * ```typescript
 * import { Resizer } from './resizing';
 *
 * const resizer = new Resizer(
 *   80,              // Available width
 *   0,               // Auto height
 *   ['Name', 'Age'], // Headers
 *   tableData,       // Data source
 *   styleFunc,       // Style function
 *   true,            // Enable wrapping
 *   true             // Show column borders
 * );
 *
 * const result = resizer.calculateDimensions();
 * console.log(result.widths);  // Optimized column widths
 * console.log(result.heights); // Calculated row heights
 * ```
 *
 * @example Responsive Design
 * ```typescript
 * // Adapt to different screen sizes
 * const mobileResizer = new Resizer(40, 0, headers, data, styles, true, false);
 * const desktopResizer = new Resizer(120, 0, headers, data, styles, true, true);
 *
 * const mobileLayout = mobileResizer.calculateDimensions();
 * const desktopLayout = desktopResizer.calculateDimensions();
 *
 * // Mobile might use more rows due to wrapping
 * // Desktop might use more columns for better readability
 * ```
 *
 * @example Custom Constraints
 * ```typescript
 * // Table with fixed-width columns and flexible content
 * class ConstrainedResizer extends Resizer {
 *   calculateDimensions() {
 *     const result = super.calculateDimensions();
 *
 *     // Force first column to minimum width
 *     result.widths[0] = Math.max(result.widths[0], 10);
 *
 *     // Limit last column to maximum width
 *     result.widths[result.widths.length - 1] = Math.min(
 *       result.widths[result.widths.length - 1],
 *       30
 *     );
 *
 *     return result;
 *   }
 * }
 * ```
 */
import { type TableData } from './data';
import { type StyleFunc } from './table';
/**
 * Result of dimension calculations.
 */
export interface DimensionResult {
    widths: number[];
    heights: number[];
}
/**
 * The Resizer class implements intelligent table layout algorithms for optimal display.
 *
 * This class serves as the brain of the table layout system, analyzing content patterns,
 * calculating optimal dimensions, and balancing competing constraints to produce the
 * best possible table layout for any given scenario.
 *
 * ## Algorithm Overview
 *
 * The resizer operates in several phases:
 *
 * 1. **Content Analysis**: Examines all cell content to understand size requirements
 * 2. **Style Integration**: Incorporates padding, margins, and borders into calculations
 * 3. **Constraint Detection**: Identifies fixed widths and minimum size requirements
 * 4. **Space Calculation**: Determines available space after accounting for borders
 * 5. **Distribution Strategy**: Chooses between expansion or shrinkage algorithms
 * 6. **Final Optimization**: Fine-tunes results for optimal visual balance
 *
 * ## Key Algorithms
 *
 * ### Expansion Algorithm
 * Used when content naturally fits within available space:
 * - Distributes extra space to shortest columns first
 * - Maintains proportional relationships between columns
 * - Respects fixed-width constraints
 *
 * ### Shrinkage Algorithm
 * Used when content exceeds available space:
 * - **Phase 1**: Targets very large columns (≥50% of table width)
 * - **Phase 2**: Reduces columns that exceed their median width
 * - **Phase 3**: Reduces any remaining large columns as needed
 *
 * ### Wrapping Integration
 * When text wrapping is enabled:
 * - Calculates row heights based on wrapped content
 * - Optimizes column widths to minimize total table height
 * - Balances readability with space efficiency
 *
 * @example Basic Configuration
 * ```typescript
 * const resizer = new Resizer(
 *   100,                    // Table width
 *   0,                      // Auto height
 *   ['Name', 'Email'],      // Headers
 *   tableData,              // Data source
 *   defaultStyles,          // Style function
 *   true,                   // Enable wrapping
 *   true                    // Show column borders
 * );
 *
 * const dimensions = resizer.calculateDimensions();
 * ```
 *
 * @example Responsive Layout
 * ```typescript
 * // Create different layouts for different screen sizes
 * class ResponsiveTable {
 *   getLayout(width: number) {
 *     const resizer = new Resizer(
 *       width,
 *       0,
 *       this.headers,
 *       this.data,
 *       this.getStyleFunc(width),
 *       width < 60, // Enable wrapping on narrow screens
 *       width > 40  // Hide borders on very narrow screens
 *     );
 *
 *     return resizer.calculateDimensions();
 *   }
 *
 *   private getStyleFunc(width: number): StyleFunc {
 *     return (row, col) => {
 *       const baseStyle = this.baseStyles(row, col);
 *
 *       if (width < 60) {
 *         // Reduce padding on narrow screens
 *         return baseStyle.paddingLeft(0).paddingRight(0);
 *       }
 *
 *       return baseStyle;
 *     };
 *   }
 * }
 * ```
 *
 * @example Performance Optimization
 * ```typescript
 * // For large datasets, consider sampling for better performance
 * class OptimizedResizer extends Resizer {
 *   private static readonly SAMPLE_SIZE = 100;
 *
 *   constructor(
 *     tableWidth: number,
 *     tableHeight: number,
 *     headers: string[],
 *     data: TableData,
 *     styleFunc: StyleFunc,
 *     wrap: boolean,
 *     borderColumn: boolean
 *   ) {
 *     // Sample large datasets for performance
 *     const sampledData = data.rows() > OptimizedResizer.SAMPLE_SIZE
 *       ? this.sampleData(data)
 *       : data;
 *
 *     super(tableWidth, tableHeight, headers, sampledData, styleFunc, wrap, borderColumn);
 *   }
 *
 *   private sampleData(data: TableData): TableData {
 *     // Implementation of data sampling...
 *   }
 * }
 * ```
 *
 * @example Custom Sizing Logic
 * ```typescript
 * class PriorityResizer extends Resizer {
 *   constructor(
 *     private columnPriorities: number[], // Higher = more important
 *     ...args: ConstructorParameters<typeof Resizer>
 *   ) {
 *     super(...args);
 *   }
 *
 *   protected shrinkToMedian(colWidths: number[]): void {
 *     // Custom shrinking that preserves high-priority columns
 *     while (this.exceedsWidth(colWidths)) {
 *       let targetColumn = -1;
 *       let lowestPriority = Infinity;
 *
 *       for (let i = 0; i < colWidths.length; i++) {
 *         const priority = this.columnPriorities[i] || 1;
 *         if (priority < lowestPriority && colWidths[i] > 0) {
 *           lowestPriority = priority;
 *           targetColumn = i;
 *         }
 *       }
 *
 *       if (targetColumn >= 0) {
 *         colWidths[targetColumn]--;
 *       } else {
 *         break;
 *       }
 *     }
 *   }
 * }
 * ```
 */
export declare class Resizer {
    private tableWidth;
    private tableHeight;
    private headers;
    private allRows;
    private rowHeights;
    private columns;
    private wrap;
    private borderColumn;
    private yPaddings;
    private styleFunc;
    /**
     * Creates a new Resizer instance.
     * @param tableWidth - The desired table width (0 for auto-detect)
     * @param tableHeight - The desired table height (0 for auto-detect)
     * @param headers - Table headers
     * @param data - Table data
     * @param styleFunc - Function to get styles for cells
     * @param wrap - Whether content should wrap
     * @param borderColumn - Whether column borders are enabled
     */
    constructor(tableWidth: number, tableHeight: number, headers: string[], data: TableData, styleFunc?: StyleFunc, wrap?: boolean, borderColumn?: boolean);
    /**
     * Analyzes column content to determine min, max, and median widths.
     */
    private analyzeColumns;
    /**
     * Calculates padding requirements for each cell based on styles.
     */
    private calculatePaddings;
    /**
     * Returns default row heights.
     */
    private defaultRowHeights;
    /**
     * Calculates optimized column widths and row heights.
     */
    calculateDimensions(): DimensionResult;
    /**
     * Detects the optimal table width based on content.
     */
    private detectTableWidth;
    /**
     * Expands table width to fill available space.
     */
    private expandTableWidth;
    /**
     * Shrinks table width to fit within constraints.
     */
    private shrinkTableWidth;
    /**
     * Shrinks the biggest columns to fit within table width.
     * @param colWidths - Array of column widths to modify
     * @param veryBigOnly - If true, only shrink columns >= half table width
     */
    private shrinkBiggestColumns;
    /**
     * Shrinks columns based on their difference from median width.
     * @param colWidths - Array of column widths to modify
     */
    private shrinkToMedian;
    /**
     * Expands row heights based on content wrapping.
     * @param colWidths - The calculated column widths
     */
    private expandRowHeights;
    /**
     * Returns the maximum column widths without size constraints.
     */
    private maxColumnWidths;
    /**
     * Returns the maximum total width of all columns.
     */
    private maxTotal;
    /**
     * Returns the maximum character count across all columns.
     */
    private maxCharCount;
    /**
     * Returns the total horizontal padding for all columns.
     */
    private totalHorizontalPadding;
    /**
     * Returns the total horizontal border width.
     */
    private totalHorizontalBorder;
    /**
     * Returns the border width per cell.
     */
    private borderPerCell;
    /**
     * Returns extra border characters (typically for table edges).
     */
    private extraBorder;
    /**
     * Returns horizontal padding for a specific column.
     * @param j - Column index
     */
    private xPaddingForCol;
    /**
     * Returns vertical padding for a specific cell.
     * @param i - Row index
     * @param j - Column index
     */
    private xPaddingForCell;
    /**
     * Detects content height when wrapped to a specific width.
     * @param content - The content to measure
     * @param width - The available width
     */
    private detectContentHeight;
}
//# sourceMappingURL=resizing.d.ts.map