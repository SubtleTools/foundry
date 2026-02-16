/**
 * Table Component for Terminal Output
 *
 * This module provides a comprehensive table renderer for terminals with advanced
 * features including headers, borders, conditional styling, automatic sizing,
 * content wrapping, and sophisticated layout algorithms.
 *
 * ## Key Features
 *
 * - **Headers**: Optional column headers with styling support
 * - **Borders**: Configurable borders (top, bottom, left, right, column, row separators)
 * - **Auto-sizing**: Intelligent column width and row height calculation
 * - **Content Wrapping**: Automatic text wrapping within cells
 * - **Conditional Styling**: Cell-specific styling based on position or content
 * - **Data Sources**: Support for various data sources via TableData interface
 * - **Scrolling**: Offset support for displaying large tables in parts
 * - **Responsive**: Automatic resizing to fit available terminal width
 *
 * @example Basic Table
 * ```typescript
 * import { newTable } from './table';
 *
 * const table = newTable()
 *   .setHeaders('Name', 'Age', 'City')
 *   .rows(
 *     ['Alice', '25', 'New York'],
 *     ['Bob', '30', 'Los Angeles'],
 *     ['Charlie', '35', 'Chicago']
 *   );
 *
 * console.log(table.toString());
 * ```
 *
 * @example Styled Table
 * ```typescript
 * const styledTable = newTable()
 *   .setHeaders('Product', 'Price', 'Stock')
 *   .setBorder(Borders.Rounded)
 *   .setBorderStyle(new Style().foreground('blue'))
 *   .setStyleFunc((row, col) => {
 *     if (row === HeaderRow) {
 *       return new Style().bold(true).foreground('yellow');
 *     }
 *     return col === 1 ? new Style().foreground('green') : new Style();
 *   })
 *   .rows(
 *     ['Widget A', '$19.99', '50'],
 *     ['Widget B', '$29.99', '25']
 *   );
 * ```
 *
 * @example Large Table with Pagination
 * ```typescript
 * const largeTable = newTable()
 *   .setHeaders('ID', 'Name', 'Description')
 *   .setHeight(10) // Limit visible rows
 *   .setOffset(20) // Start from row 20
 *   .setWrap(true) // Enable text wrapping
 *   .rows(...manyRows);
 * ```
 */
import { Style } from '../style';
import { type BorderConfig, type BorderStyle } from '../types';
import { type TableData } from './data';
/**
 * HeaderRow constant denotes the header's row index used when rendering headers.
 * Use this value when looking to customize header styles in StyleFunc.
 */
export declare const HeaderRow = -1;
/**
 * StyleFunc is the style function that determines the style of a Cell.
 * It takes the row and column of the cell as input and determines the
 * Style to use for that cell position.
 *
 * @param row - The row index (HeaderRow for headers, 0+ for data rows)
 * @param col - The column index
 * @returns The Style to apply to the cell
 */
export type StyleFunc = (row: number, col: number) => Style;
/**
 * TableOptions interface for configuring table appearance and behavior.
 * Used by immutable table methods to create new table instances with modified options.
 */
export interface TableOptions {
    styleFunc?: StyleFunc;
    border?: BorderConfig;
    borderTop?: boolean;
    borderBottom?: boolean;
    borderLeft?: boolean;
    borderRight?: boolean;
    borderHeader?: boolean;
    borderColumn?: boolean;
    borderRow?: boolean;
    borderStyle?: Style;
    headers?: string[];
    data?: TableData;
    width?: number;
    height?: number;
    useManualHeight?: boolean;
    offset?: number;
    wrap?: boolean;
    widths?: number[];
    heights?: number[];
}
/**
 * DefaultStyles is a StyleFunc that returns a new Style with no attributes.
 * @param _row - The row index (unused)
 * @param _col - The column index (unused)
 * @returns A new default Style
 */
export declare function defaultStyles(_row: number, _col: number): Style;
/**
 * Table class for rendering styled tables in terminal environments.
 *
 * The Table class provides a comprehensive solution for displaying tabular data
 * with professional formatting. It handles complex layout calculations, supports
 * various styling options, and automatically optimizes content display based on
 * available space.
 *
 * ## Core Capabilities
 *
 * - **Flexible Data Sources**: Works with any TableData implementation
 * - **Intelligent Sizing**: Automatic column width and row height optimization
 * - **Rich Styling**: Per-cell styling with conditional logic support
 * - **Border Management**: Comprehensive border configuration options
 * - **Content Management**: Text wrapping, truncation, and overflow handling
 * - **Performance**: Efficient rendering even for large datasets
 *
 * ## Common Use Cases
 *
 * - **Data Reports**: Display query results, analytics, or metrics
 * - **Configuration Tables**: Show settings, parameters, or options
 * - **Status Dashboards**: Present system status, health checks, or monitoring data
 * - **File Listings**: Display directory contents, search results, or inventories
 * - **Comparison Tables**: Side-by-side feature comparisons or benchmarks
 *
 * @example Basic Usage
 * ```typescript
 * const table = new Table()
 *   .setHeaders('Name', 'Status', 'Last Updated')
 *   .row('Service A', 'Running', '2024-01-15')
 *   .row('Service B', 'Stopped', '2024-01-14')
 *   .row('Service C', 'Error', '2024-01-13');
 *
 * console.log(table.render());
 * ```
 *
 * @example Advanced Configuration
 * ```typescript
 * const table = new Table()
 *   .setHeaders('Product', 'Revenue', 'Growth')
 *   .setBorder(Borders.Double)
 *   .setBorderStyle(new Style().foreground('blue'))
 *   .setWidth(80)
 *   .setStyleFunc((row, col) => {
 *     if (row === HeaderRow) {
 *       return new Style().bold(true).background('darkblue').foreground('white');
 *     }
 *
 *     // Highlight growth column
 *     if (col === 2) {
 *       return new Style().foreground('green').bold(true);
 *     }
 *
 *     // Alternate row colors
 *     return row % 2 === 0
 *       ? new Style().background('lightgray')
 *       : new Style();
 *   })
 *   .rows(
 *     ['Widget Pro', '$125,000', '+15%'],
 *     ['Widget Basic', '$89,000', '+8%'],
 *     ['Widget Lite', '$45,000', '+22%']
 *   );
 * ```
 *
 * @example Large Dataset with Pagination
 * ```typescript
 * const bigTable = new Table()
 *   .setHeaders('ID', 'Name', 'Email', 'Department', 'Salary')
 *   .setHeight(20)        // Show max 20 rows
 *   .setOffset(100)       // Start from row 100
 *   .setWrap(true)        // Enable text wrapping
 *   .setData(largeDataset) // Custom data source
 *   .setBorderRow(true);  // Add row separators
 * ```
 *
 * @example Dynamic Styling
 * ```typescript
 * const statusTable = new Table()
 *   .setHeaders('Service', 'Status', 'Response Time')
 *   .setStyleFunc((row, col) => {
 *     if (row === HeaderRow) return headerStyle;
 *
 *     // Style based on status (column 1)
 *     const statusCell = table.getData().at(row, 1);
 *     switch (statusCell) {
 *       case 'Running':
 *         return col === 1 ? greenStyle : normalStyle;
 *       case 'Error':
 *         return col === 1 ? redStyle : normalStyle;
 *       case 'Warning':
 *         return col === 1 ? yellowStyle : normalStyle;
 *       default:
 *         return normalStyle;
 *     }
 *   });
 * ```
 */
export declare class Table {
    private _styleFunc;
    private _border;
    private borderTop;
    private borderBottom;
    private borderLeft;
    private borderRight;
    private _borderHeader;
    private _borderColumn;
    private _borderRow;
    private _borderStyle;
    private _headers;
    private data;
    private _width;
    private height;
    private useManualHeight;
    private _offset;
    private _wrap;
    private _widths;
    private heights;
    /**
     * Creates a new Table instance with default settings or from options.
     *
     * @param options - Optional configuration object for the table
     */
    constructor(options?: TableOptions);
    /**
     * Gets the current table options for creating new instances.
     * @returns The current table options
     */
    private get options();
    /**
     * Clears all table rows.
     * @returns This Table instance for chaining
     */
    clearRows(): Table;
    /**
     * Sets the style function for determining cell styles.
     * @param styleFunction - Function that returns a Style for each cell
     * @returns This Table instance for chaining
     */
    setStyleFunc(styleFunction: StyleFunc): Table;
    /**
     * Gets the style for a specific cell.
     * @param row - The row index
     * @param col - The column index
     * @returns The Style for the cell
     */
    private getStyle;
    /**
     * Sets the table data.
     * @param data - The TableData instance to use
     * @returns This Table instance for chaining
     */
    setData(data: TableData): Table;
    /**
     * Gets the current table data.
     * @returns The current TableData instance
     */
    getData(): TableData;
    /**
     * Appends multiple rows to the table data.
     * @param rows - Array of rows to append
     * @returns This Table instance for chaining
     */
    rows(...rows: string[][]): Table;
    /**
     * Appends a single row to the table data.
     * @param row - The row cells to append
     * @returns This Table instance for chaining
     */
    row(...row: string[]): Table;
    /**
     * Sets the table headers.
     * @param headers - The header strings
     * @returns This Table instance for chaining
     */
    setHeaders(...headers: string[]): Table;
    /**
     * Sets the table border configuration.
     * @param border - The border configuration to use
     * @returns This Table instance for chaining
     */
    setBorder(border: BorderConfig): Table;
    /**
     * Sets whether to show the top border.
     * @param value - Whether to show the top border
     * @returns This Table instance for chaining
     */
    setBorderTop(value: boolean): Table;
    /**
     * Sets whether to show the bottom border.
     * @param value - Whether to show the bottom border
     * @returns This Table instance for chaining
     */
    setBorderBottom(value: boolean): Table;
    /**
     * Sets whether to show the left border.
     * @param value - Whether to show the left border
     * @returns This Table instance for chaining
     */
    setBorderLeft(value: boolean): Table;
    /**
     * Sets whether to show the right border.
     * @param value - Whether to show the right border
     * @returns This Table instance for chaining
     */
    setBorderRight(value: boolean): Table;
    /**
     * Sets whether to show the header separator border.
     * @param value - Whether to show the header separator
     * @returns This Table instance for chaining
     */
    setBorderHeader(value: boolean): Table;
    /**
     * Sets whether to show column separator borders.
     * @param value - Whether to show column separators
     * @returns This Table instance for chaining
     */
    setBorderColumn(value: boolean): Table;
    /**
     * Sets whether to show row separator borders.
     * @param value - Whether to show row separators
     * @returns This Table instance for chaining
     */
    setBorderRow(value: boolean): Table;
    /**
     * Sets the style for table borders.
     * @param style - The Style to apply to borders
     * @returns This Table instance for chaining
     */
    setBorderStyle(style: Style): Table;
    /**
     * Sets the table width for automatic column sizing.
     * @param width - The desired table width
     * @returns This Table instance for chaining
     */
    setWidth(width: number): Table;
    /**
     * Sets the table height for content limiting.
     * @param height - The desired table height
     * @returns This Table instance for chaining
     */
    setHeight(height: number): Table;
    /**
     * Sets the rendering offset for scrolling.
     * @param offset - The number of rows to skip from the top
     * @returns This Table instance for chaining
     */
    setOffset(offset: number): Table;
    /**
     * Sets whether table content should wrap.
     * @param wrap - Whether to wrap content
     * @returns This Table instance for chaining
     */
    setWrap(wrap: boolean): Table;
    /**
     * Calculates the total height of the table.
     * @returns The computed table height
     */
    private computeHeight;
    /**
     * Performs sizing calculations for the table.
     */
    private resize;
    /**
     * Gets the actual border style characters from the border configuration.
     * @returns The border style object with character definitions
     */
    private getBorderStyle;
    /**
     * Constructs the top border of the table.
     * @returns The top border string
     */
    private constructTopBorder;
    /**
     * Constructs the bottom border of the table.
     * @returns The bottom border string
     */
    private constructBottomBorder;
    /**
     * Constructs the header row.
     * @returns The header row string
     */
    private constructHeaders;
    /**
     * Constructs a single data row.
     * @param index - The row index
     * @param isOverflow - Whether this is an overflow row (ellipsis)
     * @returns The row string
     */
    private constructRow;
    /**
     * Truncates cell content to fit within the available space.
     * @param cell - The cell content
     * @param rowIndex - The row index
     * @param colIndex - The column index
     * @returns The truncated cell content
     */
    private truncateCell;
    /**
     * Renders the table as a string.
     * @returns The rendered table
     */
    render(): string;
    /**
     * Returns a new Table instance with updated border header configuration.
     * Controls whether to show the separator line between headers and data rows.
     *
     * @param enabled - Whether to show the header separator border
     * @returns A new Table instance with the updated border header setting
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .setHeaders('Name', 'Age')
     *   .row('Alice', '25')
     *   .borderHeader(false); // Disable header separator
     * ```
     */
    borderHeader(enabled: boolean): Table;
    /**
     * Returns a new Table instance with updated border column configuration.
     * Controls whether to show vertical separators between columns.
     *
     * @param enabled - Whether to show column separator borders
     * @returns A new Table instance with the updated border column setting
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .setHeaders('Name', 'Age', 'City')
     *   .row('Alice', '25', 'New York')
     *   .borderColumn(false); // Remove vertical column separators
     * ```
     */
    borderColumn(enabled: boolean): Table;
    /**
     * Returns a new Table instance with updated border row configuration.
     * Controls whether to show horizontal separators between data rows.
     *
     * @param enabled - Whether to show row separator borders
     * @returns A new Table instance with the updated border row setting
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .setHeaders('Product', 'Price')
     *   .row('Widget A', '$19.99')
     *   .row('Widget B', '$29.99')
     *   .borderRow(true); // Add horizontal row separators
     * ```
     */
    borderRow(enabled: boolean): Table;
    /**
     * Returns a new Table instance with updated offset configuration.
     * Sets the number of rows to skip from the beginning when rendering,
     * useful for pagination or scrolling through large datasets.
     *
     * @param offset - The number of rows to skip from the top
     * @returns A new Table instance with the updated offset setting
     *
     * @example
     * ```typescript
     * const bigTable = newTable()
     *   .setHeaders('ID', 'Name')
     *   .rows(...manyRows)
     *   .offset(50); // Start displaying from row 50
     * ```
     */
    offset(offset: number): Table;
    /**
     * Returns a new Table instance with updated text wrapping configuration.
     * Controls whether cell content should wrap to multiple lines or be truncated
     * when it exceeds the available column width.
     *
     * @param enabled - Whether to enable text wrapping in table cells
     * @returns A new Table instance with the updated wrap setting
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .setHeaders('Description', 'Status')
     *   .row('A very long description that might need wrapping', 'Active')
     *   .wrap(true); // Enable text wrapping for long content
     * ```
     */
    wrap(enabled: boolean): Table;
    /**
     * Returns a new Table instance with updated border configuration.
     * Go-compatible method name that accepts either BorderConfig or BorderStyle.
     *
     * @param border - The border configuration to use
     * @returns A new Table instance with the updated border setting
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .border(Borders.Normal)  // BorderConfig
     *   .border(BorderStyles.Thick); // BorderStyle
     * ```
     */
    border(border: BorderConfig | BorderStyle): Table;
    /**
     * Returns a new Table instance with updated border style.
     * Go-compatible method name for setting border styling.
     *
     * @param style - The Style to apply to borders
     * @returns A new Table instance with the updated border style setting
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .border(Borders.Normal)
     *   .borderStyle(NewStyle().color('#238'));
     * ```
     */
    borderStyle(style: Style): Table;
    /**
     * Returns a new Table instance with updated headers.
     * Go-compatible method name for setting table headers.
     *
     * @param headers - The header strings
     * @returns A new Table instance with the updated headers
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .headers('#', 'Name', 'Type 1', 'Type 2');
     * ```
     */
    headers(...headers: string[]): Table;
    /**
     * Returns a new Table instance with updated width.
     * Go-compatible method name for setting table width.
     *
     * @param width - The desired table width
     * @returns A new Table instance with the updated width setting
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .headers('Name', 'Age')
     *   .width(80);
     * ```
     */
    width(width: number): Table;
    /**
     * Returns a new Table instance with updated style function.
     * Go-compatible method name for setting conditional styling.
     *
     * @param styleFunction - Function that returns a Style for each cell
     * @returns A new Table instance with the updated style function
     *
     * @example
     * ```typescript
     * const table = newTable()
     *   .headers('Name', 'Status')
     *   .styleFunc((row, col) => {
     *     if (row === HeaderRow) {
     *       return headerStyle;
     *     }
     *     return baseStyle;
     *   });
     * ```
     */
    styleFunc(styleFunction: StyleFunc): Table;
    /**
     * Returns the table as a string (alias for render).
     * @returns The rendered table
     */
    toString(): string;
}
/**
 * Creates a new Table instance with default configuration.
 *
 * This factory function provides the standard way to create Table instances
 * with sensible defaults that work well for most use cases. The returned
 * table can be immediately configured using the fluent API.
 *
 * Default configuration:
 * - Border: Rounded corners
 * - Borders enabled: Top, bottom, left, right, header separator, column separators
 * - Row separators: Disabled
 * - Text wrapping: Enabled
 * - Auto-sizing: Enabled
 * - Styling: Default (no special formatting)
 *
 * @returns A new Table instance ready for configuration
 *
 * @example Quick Start
 * ```typescript
 * const table = newTable()
 *   .setHeaders('Name', 'Age', 'City')
 *   .row('Alice', '25', 'New York')
 *   .row('Bob', '30', 'Los Angeles');
 *
 * console.log(table.toString());
 * ```
 *
 * @example Pre-configured Styling
 * ```typescript
 * const styledTable = newTable()
 *   .setHeaders('Product', 'Price', 'Stock')
 *   .setBorder(Borders.Double)
 *   .setBorderStyle(new Style().foreground('blue'))
 *   .setStyleFunc((row, col) => {
 *     return row === HeaderRow
 *       ? new Style().bold(true).foreground('white').background('blue')
 *       : new Style();
 *   })
 *   .rows(
 *     ['Laptop', '$999', '15'],
 *     ['Mouse', '$25', '50'],
 *     ['Keyboard', '$75', '30']
 *   );
 * ```
 *
 * @example Data Integration
 * ```typescript
 * const dataTable = newTable()
 *   .setHeaders(...columnNames)
 *   .setData(customDataSource) // TableData implementation
 *   .setWidth(process.stdout.columns || 80)
 *   .setWrap(true);
 * ```
 *
 * @see Table For detailed class documentation and all available methods
 * @see TableData For information about data source interfaces
 * @see StyleFunc For conditional styling examples
 */
export declare function newTable(): Table;
//# sourceMappingURL=table.d.ts.map