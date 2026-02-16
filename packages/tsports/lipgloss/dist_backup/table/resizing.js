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
import { getTextWidth, wrapText } from '../layout';
import { dataToMatrix } from './data';
import { defaultStyles } from './table';
import { maxOf, median, minOf, sum } from './utils';
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
export class Resizer {
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
    constructor(tableWidth, tableHeight, headers, data, styleFunc = defaultStyles, wrap = true, borderColumn = true) {
        this.columns = [];
        this.tableWidth = tableWidth;
        this.tableHeight = tableHeight;
        this.headers = headers;
        this.wrap = wrap;
        this.borderColumn = borderColumn;
        this.styleFunc = styleFunc;
        const rows = dataToMatrix(data);
        // Combine headers and data rows
        if (headers.length > 0) {
            this.allRows = [headers, ...rows];
        }
        else {
            this.allRows = rows;
        }
        this.yPaddings = this.allRows.map((row) => new Array(row.length).fill(0));
        this.rowHeights = this.defaultRowHeights();
        this.analyzeColumns();
        this.calculatePaddings();
    }
    /**
     * Analyzes column content to determine min, max, and median widths.
     */
    analyzeColumns() {
        for (const row of this.allRows) {
            for (let i = 0; i < row.length; i++) {
                const cell = row[i] ?? '';
                const cellWidth = getTextWidth(cell);
                // Initialize column if it doesn't exist
                if (this.columns.length <= i) {
                    this.columns.push({
                        index: i,
                        min: cellWidth,
                        max: cellWidth,
                        median: cellWidth,
                        rows: [],
                        xPadding: 0,
                        fixedWidth: 0,
                    });
                }
                const column = this.columns[i];
                if (column) {
                    column.rows.push(row);
                    column.min = minOf(column.min, cellWidth);
                    column.max = maxOf(column.max, cellWidth);
                }
            }
        }
        // Calculate median widths
        for (const column of this.columns) {
            const widths = column.rows.map((row) => {
                const cellContent = row[column.index];
                return cellContent ? getTextWidth(cellContent) : 0;
            });
            column.median = median(widths);
        }
    }
    /**
     * Calculates padding requirements for each cell based on styles.
     */
    calculatePaddings() {
        const hasHeaders = this.headers.length > 0;
        for (let i = 0; i < this.allRows.length; i++) {
            const row = this.allRows[i];
            if (!row)
                continue;
            this.yPaddings[i] = new Array(row.length).fill(0);
            for (let j = 0; j < row.length; j++) {
                const column = this.columns[j];
                if (!column)
                    continue;
                // Calculate row index for style function
                let rowIndex = i;
                if (hasHeaders) {
                    rowIndex--;
                }
                const style = this.styleFunc(rowIndex, j);
                const margins = style.getMargins();
                const padding = style.getPadding();
                const totalHorizontalPadding = margins.left + margins.right + (padding?.left || 0) + (padding?.right || 0);
                column.xPadding = maxOf(column.xPadding, totalHorizontalPadding);
                const width = style.getWidth();
                const numericWidth = typeof width === 'number' ? width : 0;
                column.fixedWidth = maxOf(column.fixedWidth, numericWidth);
                const height = style.getHeight();
                const numericHeight = typeof height === 'number' ? height : 1;
                this.rowHeights[i] = maxOf(this.rowHeights[i] || 1, numericHeight);
                const totalVerticalPadding = margins.top + margins.bottom + (padding?.top || 0) + (padding?.bottom || 0);
                const rowPaddings = this.yPaddings[i];
                if (rowPaddings) {
                    rowPaddings[j] = totalVerticalPadding;
                }
            }
        }
    }
    /**
     * Returns default row heights.
     */
    defaultRowHeights() {
        return this.allRows.map(() => 1);
    }
    /**
     * Calculates optimized column widths and row heights.
     */
    calculateDimensions() {
        // Auto-detect table width if not specified
        if (this.tableWidth <= 0) {
            this.tableWidth = this.detectTableWidth();
        }
        if (this.maxTotal() <= this.tableWidth) {
            return this.expandTableWidth();
        }
        else {
            return this.shrinkTableWidth();
        }
    }
    /**
     * Detects the optimal table width based on content.
     */
    detectTableWidth() {
        return this.maxCharCount() + this.totalHorizontalPadding() + this.totalHorizontalBorder();
    }
    /**
     * Expands table width to fill available space.
     */
    expandTableWidth() {
        const colWidths = this.maxColumnWidths();
        // Distribute extra width evenly, prioritizing shorter columns
        while (true) {
            const totalWidth = sum(colWidths) + this.totalHorizontalBorder();
            if (totalWidth >= this.tableWidth) {
                break;
            }
            // Find the shortest non-fixed column
            let shortestIndex = 0;
            let shortestWidth = Number.MAX_SAFE_INTEGER;
            for (let j = 0; j < colWidths.length; j++) {
                const column = this.columns[j];
                const width = colWidths[j];
                if (!column || !width)
                    continue;
                if (column.fixedWidth > 0) {
                    continue; // Skip fixed-width columns
                }
                if (width < shortestWidth) {
                    shortestWidth = width;
                    shortestIndex = j;
                }
            }
            const currentWidth = colWidths[shortestIndex];
            if (currentWidth !== undefined) {
                colWidths[shortestIndex] = currentWidth + 1;
            }
        }
        const rowHeights = this.expandRowHeights(colWidths);
        return { widths: colWidths, heights: rowHeights };
    }
    /**
     * Shrinks table width to fit within constraints.
     */
    shrinkTableWidth() {
        const colWidths = this.maxColumnWidths();
        // Strategy 1: Shrink very large columns first
        this.shrinkBiggestColumns(colWidths, true);
        // Strategy 2: Shrink columns that differ most from median
        this.shrinkToMedian(colWidths);
        // Strategy 3: Shrink any remaining large columns
        this.shrinkBiggestColumns(colWidths, false);
        const rowHeights = this.expandRowHeights(colWidths);
        return { widths: colWidths, heights: rowHeights };
    }
    /**
     * Shrinks the biggest columns to fit within table width.
     * @param colWidths - Array of column widths to modify
     * @param veryBigOnly - If true, only shrink columns >= half table width
     */
    shrinkBiggestColumns(colWidths, veryBigOnly) {
        while (true) {
            const totalWidth = sum(colWidths) + this.totalHorizontalBorder();
            if (totalWidth <= this.tableWidth) {
                break;
            }
            let bigColumnIndex = -1;
            let bigColumnWidth = -1;
            for (let j = 0; j < colWidths.length; j++) {
                const column = this.columns[j];
                const width = colWidths[j];
                if (!column || width === undefined)
                    continue;
                if (column.fixedWidth > 0) {
                    continue; // Skip fixed-width columns
                }
                if (veryBigOnly) {
                    if (width >= this.tableWidth / 2 && width > bigColumnWidth) {
                        bigColumnWidth = width;
                        bigColumnIndex = j;
                    }
                }
                else {
                    if (width > bigColumnWidth) {
                        bigColumnWidth = width;
                        bigColumnIndex = j;
                    }
                }
            }
            const currentWidth = colWidths[bigColumnIndex];
            if (bigColumnIndex < 0 || currentWidth === undefined || currentWidth === 0) {
                break;
            }
            colWidths[bigColumnIndex] = currentWidth - 1;
        }
    }
    /**
     * Shrinks columns based on their difference from median width.
     * @param colWidths - Array of column widths to modify
     */
    shrinkToMedian(colWidths) {
        while (true) {
            const totalWidth = sum(colWidths) + this.totalHorizontalBorder();
            if (totalWidth <= this.tableWidth) {
                break;
            }
            let biggestDiffToMedian = -1;
            let biggestDiffIndex = -1;
            for (let j = 0; j < colWidths.length; j++) {
                const column = this.columns[j];
                if (!column || column.fixedWidth > 0) {
                    continue; // Skip fixed-width columns
                }
                const colWidth = colWidths[j];
                if (colWidth === undefined)
                    continue;
                const diffToMedian = colWidth - column.median;
                if (diffToMedian > 0 && diffToMedian > biggestDiffToMedian) {
                    biggestDiffToMedian = diffToMedian;
                    biggestDiffIndex = j;
                }
            }
            if (biggestDiffIndex < 0) {
                break;
            }
            const currentWidth = colWidths[biggestDiffIndex];
            if (currentWidth === undefined || currentWidth === 0) {
                break;
            }
            colWidths[biggestDiffIndex] = currentWidth - 1;
        }
    }
    /**
     * Expands row heights based on content wrapping.
     * @param colWidths - The calculated column widths
     */
    expandRowHeights(colWidths) {
        const rowHeights = [...this.defaultRowHeights()];
        if (!this.wrap) {
            return rowHeights;
        }
        const hasHeaders = this.headers.length > 0;
        for (let i = 0; i < this.allRows.length; i++) {
            const row = this.allRows[i];
            if (!row)
                continue;
            for (let j = 0; j < row.length; j++) {
                const cell = row[j] || '';
                // Headers always have height of 1, even with wrapping
                if (hasHeaders && i === 0) {
                    continue;
                }
                const colWidth = colWidths[j] || 0;
                const availableWidth = colWidth - this.xPaddingForCol(j);
                const cellHeight = this.detectContentHeight(cell, availableWidth) + this.xPaddingForCell(i, j);
                const currentRowHeight = rowHeights[i] || 1;
                if (cellHeight > currentRowHeight) {
                    rowHeights[i] = cellHeight;
                }
            }
        }
        return rowHeights;
    }
    /**
     * Returns the maximum column widths without size constraints.
     */
    maxColumnWidths() {
        return this.columns.map((col) => {
            if (col.fixedWidth > 0) {
                return col.fixedWidth;
            }
            return col.max + this.xPaddingForCol(col.index);
        });
    }
    /**
     * Returns the maximum total width of all columns.
     */
    maxTotal() {
        let total = 0;
        for (let j = 0; j < this.columns.length; j++) {
            const column = this.columns[j];
            if (!column)
                continue;
            if (column.fixedWidth > 0) {
                total += column.fixedWidth;
            }
            else {
                total += column.max + this.xPaddingForCol(j);
            }
        }
        return total;
    }
    /**
     * Returns the maximum character count across all columns.
     */
    maxCharCount() {
        let count = 0;
        for (const col of this.columns) {
            if (col.fixedWidth > 0) {
                count += col.fixedWidth - this.xPaddingForCol(col.index);
            }
            else {
                count += col.max;
            }
        }
        return count;
    }
    /**
     * Returns the total horizontal padding for all columns.
     */
    totalHorizontalPadding() {
        return sum(this.columns.map((col) => col.xPadding));
    }
    /**
     * Returns the total horizontal border width.
     */
    totalHorizontalBorder() {
        return this.columns.length * this.borderPerCell() + this.extraBorder();
    }
    /**
     * Returns the border width per cell.
     */
    borderPerCell() {
        return this.borderColumn ? 1 : 0;
    }
    /**
     * Returns extra border characters (typically for table edges).
     */
    extraBorder() {
        return this.borderColumn ? 1 : 0;
    }
    /**
     * Returns horizontal padding for a specific column.
     * @param j - Column index
     */
    xPaddingForCol(j) {
        if (j >= this.columns.length) {
            return 0;
        }
        const column = this.columns[j];
        return column ? column.xPadding : 0;
    }
    /**
     * Returns vertical padding for a specific cell.
     * @param i - Row index
     * @param j - Column index
     */
    xPaddingForCell(i, j) {
        const rowPaddings = this.yPaddings[i];
        if (!rowPaddings || j >= rowPaddings.length) {
            return 0;
        }
        const padding = rowPaddings[j];
        return padding !== undefined ? padding : 0;
    }
    /**
     * Detects content height when wrapped to a specific width.
     * @param content - The content to measure
     * @param width - The available width
     */
    detectContentHeight(content, width) {
        if (width === 0) {
            return 1;
        }
        // Handle different line endings
        const normalizedContent = content.replace(/\r\n/g, '\n');
        const lines = normalizedContent.split('\n');
        let totalHeight = 0;
        for (const line of lines) {
            const wrappedLines = wrapText(line, width);
            totalHeight += wrappedLines.length;
        }
        return Math.max(1, totalHeight);
    }
}
//# sourceMappingURL=resizing.js.map