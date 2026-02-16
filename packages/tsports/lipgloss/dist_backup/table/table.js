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
import { BorderStyles, Borders } from '../borders';
import { JoinHorizontal, Top } from '../join';
import { getTextWidth } from '../layout';
import { Style } from '../style';
import { BorderType } from '../types';
import { Size } from '../utils';
import { newStringData, StringData } from './data';
import { Resizer } from './resizing';
import { btoi, sum } from './utils';
/**
 * HeaderRow constant denotes the header's row index used when rendering headers.
 * Use this value when looking to customize header styles in StyleFunc.
 */
export const HeaderRow = -1;
/**
 * DefaultStyles is a StyleFunc that returns a new Style with no attributes.
 * @param _row - The row index (unused)
 * @param _col - The column index (unused)
 * @returns A new default Style
 */
export function defaultStyles(_row, _col) {
    return new Style();
}
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
export class Table {
    /**
     * Creates a new Table instance with default settings or from options.
     *
     * @param options - Optional configuration object for the table
     */
    constructor(options) {
        this._styleFunc = defaultStyles;
        this._border = Borders.Rounded;
        // Border configuration
        this.borderTop = true;
        this.borderBottom = true;
        this.borderLeft = true;
        this.borderRight = true;
        this._borderHeader = true;
        this._borderColumn = true;
        this._borderRow = false;
        this._borderStyle = new Style();
        this._headers = [];
        this.data = newStringData();
        // Sizing configuration
        this._width = 0;
        this.height = 0;
        this.useManualHeight = false;
        this._offset = 0;
        this._wrap = true;
        // Computed dimensions
        this._widths = [];
        this.heights = [];
        if (options) {
            this._styleFunc = options.styleFunc ?? defaultStyles;
            this._border = options.border ?? Borders.Rounded;
            this.borderTop = options.borderTop ?? true;
            this.borderBottom = options.borderBottom ?? true;
            this.borderLeft = options.borderLeft ?? true;
            this.borderRight = options.borderRight ?? true;
            this._borderHeader = options.borderHeader ?? true;
            this._borderColumn = options.borderColumn ?? true;
            this._borderRow = options.borderRow ?? false;
            this._borderStyle = options.borderStyle ?? new Style();
            this._headers = options.headers ? [...options.headers] : [];
            this.data = options.data ?? newStringData();
            this._width = options.width ?? 0;
            this.height = options.height ?? 0;
            this.useManualHeight = options.useManualHeight ?? false;
            this._offset = options.offset ?? 0;
            this._wrap = options.wrap ?? true;
            this._widths = options.widths ? [...options.widths] : [];
            this.heights = options.heights ? [...options.heights] : [];
        }
        // Default configuration matches Go implementation
    }
    /**
     * Gets the current table options for creating new instances.
     * @returns The current table options
     */
    get options() {
        return {
            styleFunc: this._styleFunc,
            border: this._border,
            borderTop: this.borderTop,
            borderBottom: this.borderBottom,
            borderLeft: this.borderLeft,
            borderRight: this.borderRight,
            borderHeader: this._borderHeader,
            borderColumn: this._borderColumn,
            borderRow: this._borderRow,
            borderStyle: this._borderStyle,
            headers: [...this._headers],
            data: this.data,
            width: this._width,
            height: this.height,
            useManualHeight: this.useManualHeight,
            offset: this._offset,
            wrap: this._wrap,
            widths: [...this._widths],
            heights: [...this.heights],
        };
    }
    /**
     * Clears all table rows.
     * @returns This Table instance for chaining
     */
    clearRows() {
        this.data = newStringData();
        return this;
    }
    /**
     * Sets the style function for determining cell styles.
     * @param styleFunction - Function that returns a Style for each cell
     * @returns This Table instance for chaining
     */
    setStyleFunc(styleFunction) {
        this._styleFunc = styleFunction;
        return this;
    }
    /**
     * Gets the style for a specific cell.
     * @param row - The row index
     * @param col - The column index
     * @returns The Style for the cell
     */
    getStyle(row, col) {
        return this._styleFunc(row, col);
    }
    /**
     * Sets the table data.
     * @param data - The TableData instance to use
     * @returns This Table instance for chaining
     */
    setData(data) {
        this.data = data;
        return this;
    }
    /**
     * Gets the current table data.
     * @returns The current TableData instance
     */
    getData() {
        return this.data;
    }
    /**
     * Appends multiple rows to the table data.
     * @param rows - Array of rows to append
     * @returns This Table instance for chaining
     */
    rows(...rows) {
        if (this.data instanceof StringData) {
            for (const row of rows) {
                this.data.append(row);
            }
        }
        return this;
    }
    /**
     * Appends a single row to the table data.
     * @param row - The row cells to append
     * @returns This Table instance for chaining
     */
    row(...row) {
        if (this.data instanceof StringData) {
            this.data.append(row);
        }
        return this;
    }
    /**
     * Sets the table headers.
     * @param headers - The header strings
     * @returns This Table instance for chaining
     */
    setHeaders(...headers) {
        this._headers = [...headers];
        return this;
    }
    /**
     * Sets the table border configuration.
     * @param border - The border configuration to use
     * @returns This Table instance for chaining
     */
    setBorder(border) {
        this._border = border;
        return this;
    }
    /**
     * Sets whether to show the top border.
     * @param value - Whether to show the top border
     * @returns This Table instance for chaining
     */
    setBorderTop(value) {
        this.borderTop = value;
        return this;
    }
    /**
     * Sets whether to show the bottom border.
     * @param value - Whether to show the bottom border
     * @returns This Table instance for chaining
     */
    setBorderBottom(value) {
        this.borderBottom = value;
        return this;
    }
    /**
     * Sets whether to show the left border.
     * @param value - Whether to show the left border
     * @returns This Table instance for chaining
     */
    setBorderLeft(value) {
        this.borderLeft = value;
        return this;
    }
    /**
     * Sets whether to show the right border.
     * @param value - Whether to show the right border
     * @returns This Table instance for chaining
     */
    setBorderRight(value) {
        this.borderRight = value;
        return this;
    }
    /**
     * Sets whether to show the header separator border.
     * @param value - Whether to show the header separator
     * @returns This Table instance for chaining
     */
    setBorderHeader(value) {
        this._borderHeader = value;
        return this;
    }
    /**
     * Sets whether to show column separator borders.
     * @param value - Whether to show column separators
     * @returns This Table instance for chaining
     */
    setBorderColumn(value) {
        this._borderColumn = value;
        return this;
    }
    /**
     * Sets whether to show row separator borders.
     * @param value - Whether to show row separators
     * @returns This Table instance for chaining
     */
    setBorderRow(value) {
        this._borderRow = value;
        return this;
    }
    /**
     * Sets the style for table borders.
     * @param style - The Style to apply to borders
     * @returns This Table instance for chaining
     */
    setBorderStyle(style) {
        this._borderStyle = style;
        return this;
    }
    /**
     * Sets the table width for automatic column sizing.
     * @param width - The desired table width
     * @returns This Table instance for chaining
     */
    setWidth(width) {
        this._width = width;
        return this;
    }
    /**
     * Sets the table height for content limiting.
     * @param height - The desired table height
     * @returns This Table instance for chaining
     */
    setHeight(height) {
        this.height = height;
        this.useManualHeight = true;
        return this;
    }
    /**
     * Sets the rendering offset for scrolling.
     * @param offset - The number of rows to skip from the top
     * @returns This Table instance for chaining
     */
    setOffset(offset) {
        this._offset = offset;
        return this;
    }
    /**
     * Sets whether table content should wrap.
     * @param wrap - Whether to wrap content
     * @returns This Table instance for chaining
     */
    setWrap(wrap) {
        this._wrap = wrap;
        return this;
    }
    /**
     * Calculates the total height of the table.
     * @returns The computed table height
     */
    computeHeight() {
        const hasHeaders = this._headers.length > 0;
        return (sum(this.heights) -
            1 +
            btoi(hasHeaders) +
            btoi(this.borderTop) +
            btoi(this.borderBottom) +
            btoi(this._borderHeader) +
            this.data.rows() * btoi(this._borderRow));
    }
    /**
     * Performs sizing calculations for the table.
     */
    resize() {
        const hasHeaders = this._headers.length > 0;
        const resizer = new Resizer(this._width, this.height, this._headers, this.data, this._styleFunc, this._wrap, this._borderColumn);
        const result = resizer.calculateDimensions();
        this._widths = result.widths;
        this.heights = result.heights;
    }
    /**
     * Gets the actual border style characters from the border configuration.
     * @returns The border style object with character definitions
     */
    getBorderStyle() {
        const style = this._border.style || BorderType.None;
        // If it's already a BorderStyle object, return it directly
        if (typeof style === 'object') {
            return style;
        }
        // Otherwise, look it up in BorderStyles
        return BorderStyles[style];
    }
    /**
     * Constructs the top border of the table.
     * @returns The top border string
     */
    constructTopBorder() {
        const borderChars = this.getBorderStyle();
        let result = '';
        if (this.borderLeft) {
            result += this._borderStyle.render(borderChars.topLeft || '');
        }
        for (let i = 0; i < this._widths.length; i++) {
            result += this._borderStyle.render((borderChars.top || '').repeat(this._widths[i] || 0));
            if (i < this._widths.length - 1 && this._borderColumn) {
                result += this._borderStyle.render(borderChars.middleTop || '');
            }
        }
        if (this.borderRight) {
            result += this._borderStyle.render(borderChars.topRight || '');
        }
        return result;
    }
    /**
     * Constructs the bottom border of the table.
     * @returns The bottom border string
     */
    constructBottomBorder() {
        const borderChars = this.getBorderStyle();
        let result = '';
        if (this.borderLeft) {
            result += this._borderStyle.render(borderChars.bottomLeft || '');
        }
        for (let i = 0; i < this._widths.length; i++) {
            result += this._borderStyle.render((borderChars.bottom || '').repeat(this._widths[i] || 0));
            if (i < this._widths.length - 1 && this._borderColumn) {
                result += this._borderStyle.render(borderChars.middleBottom || '');
            }
        }
        if (this.borderRight) {
            result += this._borderStyle.render(borderChars.bottomRight || '');
        }
        return result;
    }
    /**
     * Constructs the header row.
     * @returns The header row string
     */
    constructHeaders() {
        const borderChars = this.getBorderStyle();
        const height = this.heights[HeaderRow + 1];
        let result = '';
        if (this.borderLeft) {
            result += this._borderStyle.render(borderChars.left || '');
        }
        for (let i = 0; i < this._headers.length; i++) {
            const cellStyle = this.getStyle(HeaderRow, i);
            let header = this._headers[i] || '';
            if (!this._wrap) {
                header = this.truncateCell(header, HeaderRow, i);
            }
            const cellWidth = this._widths[i] || 0;
            const safeHeight = height || 1;
            const cellContent = cellStyle
                .height(safeHeight - cellStyle.getVerticalMargins())
                .maxHeight(safeHeight)
                .width(cellWidth - cellStyle.getHorizontalMargins())
                .maxWidth(cellWidth)
                .render(header);
            result += cellContent;
            if (i < this._headers.length - 1 && this._borderColumn) {
                result += this._borderStyle.render(borderChars.left || '');
            }
        }
        if (this._borderHeader) {
            if (this.borderRight) {
                result += this._borderStyle.render(borderChars.right || '');
            }
            result += '\n';
            if (this.borderLeft) {
                result += this._borderStyle.render(borderChars.middleLeft || '');
            }
            for (let i = 0; i < this._headers.length; i++) {
                result += this._borderStyle.render((borderChars.top || '').repeat(this._widths[i] || 0));
                if (i < this._headers.length - 1 && this._borderColumn) {
                    result += this._borderStyle.render(borderChars.middle || '');
                }
            }
            if (this.borderRight) {
                result += this._borderStyle.render(borderChars.middleRight || '');
            }
        }
        if (this.borderRight && !this._borderHeader) {
            result += this._borderStyle.render(borderChars.right || '');
        }
        return result;
    }
    /**
     * Constructs a single data row.
     * @param index - The row index
     * @param isOverflow - Whether this is an overflow row (ellipsis)
     * @returns The row string
     */
    constructRow(index, isOverflow = false) {
        const borderChars = this.getBorderStyle();
        let result = '';
        const hasHeaders = this._headers.length > 0;
        const height = isOverflow ? 1 : this.heights[index + btoi(hasHeaders)];
        const cells = [];
        const styledVerticalBorder = this._borderStyle.render(borderChars.left || '') + '\n';
        let left = styledVerticalBorder.repeat(height || 1);
        // For hidden border tables, Go adds an extra space to match exact spacing
        if (this.borderLeft) {
            if (this._border.style === BorderType.Hidden) {
                // Add extra space for hidden borders to match Go behavior exactly
                left = ' ' + left;
            }
            cells.push(left);
        }
        for (let c = 0; c < this.data.columns(); c++) {
            let cell = isOverflow ? '…' : this.data.at(index, c);
            const cellStyle = this.getStyle(index, c);
            if (!this._wrap) {
                cell = this.truncateCell(cell, index, c);
            }
            const cellWidth = this._widths[c] || 0;
            const safeHeight = height || 1;
            // Special handling for empty cells with background colors to match Go behavior
            // Go renders empty cells with background colors as two separate styled elements
            if (cell === '' && cellStyle.getProperties().backgroundColor !== undefined) {
                const margins = cellStyle.getHorizontalMargins();
                const padding = cellStyle.getHorizontalPadding();
                const availableWidth = cellWidth - margins - padding;
                // Create the Go-style double background pattern: \x1b[40m\x1b[0m\x1b[40m      \x1b[0m
                // This is done by applying background color twice: once to empty content, once to spaces
                const bgColor = cellStyle.getProperties().backgroundColor;
                // First part: empty background color sequence \x1b[40m\x1b[0m
                // IMPORTANT: Only generate ANSI codes if the renderer supports colors
                let emptyBgSequence = '';
                // Check if colors are supported before generating ANSI codes
                if (cellStyle.getRenderer().supportsColor()) {
                    const fgColor = cellStyle.getProperties().color;
                    // Check if we have both foreground and background colors (like Go's pattern)
                    if (fgColor && typeof fgColor === 'string' && typeof bgColor === 'string') {
                        // Parse hex colors for RGB values
                        const fgMatch = fgColor.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
                        const bgMatch = bgColor.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
                        if (fgMatch && bgMatch) {
                            const fgRgb = {
                                r: parseInt(fgMatch[1] || '0', 16),
                                g: parseInt(fgMatch[2] || '0', 16),
                                b: parseInt(fgMatch[3] || '0', 16),
                            };
                            const bgRgb = {
                                r: parseInt(bgMatch[1] || '0', 16),
                                g: parseInt(bgMatch[2] || '0', 16),
                                b: parseInt(bgMatch[3] || '0', 16),
                            };
                            // Generate empty sequence with both foreground and background colors
                            emptyBgSequence = `\x1b[38;2;${fgRgb.r};${fgRgb.g};${fgRgb.b};48;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m\x1b[0m`;
                        }
                    }
                    else if (typeof bgColor === 'number' && bgColor >= 0 && bgColor <= 15) {
                        // Basic ANSI background colors (40-47 for 0-7, 100-107 for 8-15)
                        const ansiCode = bgColor <= 7 ? bgColor + 40 : bgColor - 8 + 100;
                        emptyBgSequence = `\x1b[${ansiCode}m\x1b[0m`;
                    }
                    else if (typeof bgColor === 'string' && /^\d+$/.test(bgColor)) {
                        // String numbers like "0", "1", etc. - treat as basic ANSI
                        const num = parseInt(bgColor, 10);
                        if (num >= 0 && num <= 15) {
                            const ansiCode = num <= 7 ? num + 40 : num - 8 + 100;
                            emptyBgSequence = `\x1b[${ansiCode}m\x1b[0m`;
                        }
                    }
                }
                // Second part: render padding spaces with background only (no foreground color)
                const paddingSpaces = ' '.repeat(Math.max(0, availableWidth));
                const backgroundOnlyStyle = cellStyle
                    .color('') // Remove foreground color, keep only background
                    .height(safeHeight - cellStyle.getVerticalMargins())
                    .maxHeight(safeHeight)
                    .width(0); // Don't add extra width, we're providing exact spaces
                const paddingStyledContent = backgroundOnlyStyle.render(paddingSpaces);
                const cellContent = emptyBgSequence + paddingStyledContent;
                cells.push(cellContent);
            }
            else {
                // Check if cell has both foreground and background colors - need to handle padding separately
                const hasTextColor = cellStyle.getProperties().color !== undefined;
                const hasBgColor = cellStyle.getProperties().backgroundColor !== undefined;
                if (cell !== '' && hasTextColor && hasBgColor && cellStyle.getRenderer().supportsColor()) {
                    // Special handling for cells with both text and background colors
                    // Apply both colors to text content, but only background color to padding spaces
                    const padding = cellStyle.getHorizontalPadding();
                    const margins = cellStyle.getHorizontalMargins();
                    const availableWidth = cellWidth - margins;
                    const contentWidth = availableWidth - padding; // Width for actual text content
                    const actualTextWidth = getTextWidth(cell);
                    // Get the cell's padding configuration to handle leading and trailing padding
                    const paddingConfig = cellStyle.getPadding() || { left: 0, right: 0, top: 0, bottom: 0 };
                    const leftPadding = paddingConfig.left || 0;
                    const rightPadding = paddingConfig.right || 0;
                    // Manually create ANSI sequences to match Go's exact behavior
                    // Go generates: [48;2;r;g;b m[0m[38;2;r;g;b;48;2;r;g;b mcontent[0m[48;2;r;g;b m padding spaces[0m
                    const renderer = cellStyle.getRenderer();
                    let textContent = cell; // Start with raw text
                    let bgOnlyPrefix = '';
                    let bgOnlySuffix = '';
                    // Extract RGB values for manual ANSI generation (matching what we see in Go output)
                    let fgRgb = null;
                    let bgRgb = null;
                    if (renderer.supportsColor()) {
                        const fgColor = cellStyle.getProperties().color;
                        const bgColor = cellStyle.getProperties().backgroundColor;
                        // Convert colors to RGB for ANSI generation
                        if (fgColor && typeof fgColor === 'string') {
                            // Parse hex color like '#01BE85'
                            const match = fgColor.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
                            if (match) {
                                fgRgb = {
                                    r: parseInt(match[1] || '0', 16),
                                    g: parseInt(match[2] || '0', 16),
                                    b: parseInt(match[3] || '0', 16),
                                };
                            }
                        }
                        if (bgColor && typeof bgColor === 'string') {
                            // Parse hex color like '#00432F'
                            const match = bgColor.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
                            if (match) {
                                bgRgb = {
                                    r: parseInt(match[1] || '0', 16),
                                    g: parseInt(match[2] || '0', 16),
                                    b: parseInt(match[3] || '0', 16),
                                };
                            }
                        }
                        // Generate ANSI sequences manually to match Go's exact pattern
                        if (fgRgb && bgRgb) {
                            // Strip any trailing spaces from cell content - they should be handled as padding
                            const trimmedCell = cell.trimEnd();
                            // Text content: both foreground and background colors (only the actual text content)
                            const textAnsi = `\x1b[38;2;${fgRgb.r};${fgRgb.g};${fgRgb.b};48;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m${trimmedCell}\x1b[0m`;
                            textContent = textAnsi;
                            // Background-only ANSI for padding spaces
                            bgOnlyPrefix = `\x1b[48;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m \x1b[0m`;
                            bgOnlySuffix = `\x1b[48;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m`;
                        }
                    }
                    // Create leading and trailing padding using manual ANSI sequences
                    const leftPaddingContent = leftPadding > 0 ? bgOnlyPrefix : '';
                    // Calculate trailing padding width (use trimmed text length for cells with both colors)
                    const actualWidth = hasTextColor && hasBgColor ? getTextWidth(cell.trimEnd()) : actualTextWidth;
                    const rightPaddingWidth = Math.max(0, contentWidth - actualWidth + rightPadding);
                    // Go uses specific pattern: individual space + combined remaining spaces
                    // Match Go's exact ANSI sequence pattern for cell padding
                    let rightPaddingContent = '';
                    if (rightPaddingWidth > 0 && fgRgb && bgRgb) {
                        // Go pattern: first space individually, then remaining spaces combined
                        if (rightPaddingWidth === 1) {
                            // Single space - use individual sequence
                            rightPaddingContent = `\x1b[48;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m \x1b[0m`;
                        }
                        else {
                            // Multiple spaces - use Go's pattern: individual + combined
                            const individualSpace = `\x1b[48;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m \x1b[0m`;
                            const remainingSpaces = ' '.repeat(rightPaddingWidth - 1);
                            const combinedSpaces = `\x1b[48;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m${remainingSpaces}\x1b[0m`;
                            rightPaddingContent = individualSpace + combinedSpaces;
                        }
                    }
                    // Combine: left padding + text content + right padding
                    const cellContent = leftPaddingContent + textContent + rightPaddingContent;
                    cells.push(cellContent);
                }
                else {
                    // Normal cell rendering for cells without both colors
                    const cellContent = cellStyle
                        .height(safeHeight - cellStyle.getVerticalMargins())
                        .maxHeight(safeHeight)
                        .width(cellWidth - cellStyle.getHorizontalMargins())
                        .maxWidth(cellWidth)
                        .render(cell);
                    // Note: Go has consistent ANSI reset patterns handled by border rendering
                    cells.push(cellContent);
                }
            }
            if (c < this.data.columns() - 1) {
                if (this._borderColumn && this._border.style !== BorderType.Hidden) {
                    cells.push(left);
                }
                else if (this._border.style === BorderType.Hidden) {
                    // Add spacing between cells for hidden border tables to match Go behavior
                    cells.push(' ');
                }
            }
        }
        if (this.borderRight) {
            const styledRightBorder = this._borderStyle.render(borderChars.right || '') + '\n';
            let right = styledRightBorder.repeat(height || 1);
            // For hidden border tables, Go adds an extra space to match exact spacing
            if (this._border.style === BorderType.Hidden) {
                // Add extra space for hidden borders to match Go behavior exactly
                right = ' ' + right;
            }
            cells.push(right);
        }
        // Join cells horizontally and trim newlines
        const trimmedCells = cells.map((cell) => cell.replace(/\n$/, ''));
        result += JoinHorizontal(Top, ...trimmedCells) + '\n';
        // Add row separator if needed
        if (this._borderRow && index < this.data.rows() - 1 && !isOverflow) {
            result += this._borderStyle.render(borderChars.middleLeft || '');
            for (let i = 0; i < this._widths.length; i++) {
                result += this._borderStyle.render((borderChars.top || '').repeat(this._widths[i] || 0));
                if (i < this._widths.length - 1 && this._borderColumn) {
                    result += this._borderStyle.render(borderChars.middle || '');
                }
            }
            result += this._borderStyle.render(borderChars.middleRight || '') + '\n';
        }
        return result;
    }
    /**
     * Truncates cell content to fit within the available space.
     * @param cell - The cell content
     * @param rowIndex - The row index
     * @param colIndex - The column index
     * @returns The truncated cell content
     */
    truncateCell(cell, rowIndex, colIndex) {
        const hasHeaders = this._headers.length > 0;
        const height = this.heights[rowIndex + btoi(hasHeaders)];
        const cellWidth = this._widths[colIndex] || 0;
        const cellStyle = this.getStyle(rowIndex, colIndex);
        const maxLength = cellWidth * (height || 1) -
            cellStyle.getHorizontalPadding() -
            cellStyle.getHorizontalMargins();
        if (getTextWidth(cell) <= maxLength) {
            return cell;
        }
        // Simple truncation with ellipsis
        let truncated = '';
        let currentWidth = 0;
        for (const char of cell) {
            const charWidth = getTextWidth(char);
            if (currentWidth + charWidth + 1 > maxLength) {
                // +1 for ellipsis
                truncated += '…';
                break;
            }
            truncated += char;
            currentWidth += charWidth;
        }
        return truncated;
    }
    /**
     * Renders the table as a string.
     * @returns The rendered table
     */
    render() {
        const hasHeaders = this._headers.length > 0;
        const hasRows = this.data.rows() > 0;
        if (!hasHeaders && !hasRows) {
            return '';
        }
        // Extend headers to match the longest row
        if (hasHeaders) {
            while (this._headers.length < this.data.columns()) {
                this._headers.push('');
            }
        }
        // Calculate dimensions
        this.resize();
        let result = '';
        // Top border
        if (this.borderTop) {
            result += this.constructTopBorder() + '\n';
        }
        // Headers
        if (hasHeaders) {
            result += this.constructHeaders() + '\n';
        }
        // Bottom border (computed early for height calculations)
        let bottom = '';
        if (this.borderBottom) {
            bottom = this.constructBottomBorder();
        }
        // Data rows
        if (this.data.rows() > 0) {
            if (this.useManualHeight) {
                // Calculate available lines for manual height mode
                const topHeight = Size(result).height - 1;
                const availableLines = this.height - (topHeight + Size(bottom).height);
                const linesToRender = Math.max(1, Math.min(availableLines, this.data.rows()));
                // Check if we need overflow handling
                const needsOverflow = linesToRender < this.data.rows() - this._offset;
                let rowIdx = this._offset;
                if (!needsOverflow) {
                    rowIdx = this.data.rows() - linesToRender;
                }
                for (let remaining = linesToRender; remaining > 0 && rowIdx < this.data.rows(); remaining--) {
                    const isOverflow = needsOverflow && remaining === 1;
                    result += this.constructRow(rowIdx, isOverflow);
                    rowIdx++;
                }
            }
            else {
                // Render all rows from offset
                for (let r = this._offset; r < this.data.rows(); r++) {
                    result += this.constructRow(r);
                }
            }
        }
        result += bottom;
        // Apply final sizing constraints
        return new Style().maxHeight(this.computeHeight()).maxWidth(this._width).render(result);
    }
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
    borderHeader(enabled) {
        return new Table({
            ...this.options,
            borderHeader: enabled,
        });
    }
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
    borderColumn(enabled) {
        return new Table({
            ...this.options,
            borderColumn: enabled,
        });
    }
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
    borderRow(enabled) {
        return new Table({
            ...this.options,
            borderRow: enabled,
        });
    }
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
    offset(offset) {
        return new Table({
            ...this.options,
            offset: offset,
        });
    }
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
    wrap(enabled) {
        return new Table({
            ...this.options,
            wrap: enabled,
        });
    }
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
    border(border) {
        // If it's a BorderStyle object (has string properties like 'top'), convert it to BorderConfig
        if (typeof border === 'object' && 'top' in border && typeof border.top === 'string') {
            return new Table({
                ...this.options,
                border: { style: border },
            });
        }
        // Otherwise treat it as BorderConfig
        return new Table({
            ...this.options,
            border: border,
        });
    }
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
    borderStyle(style) {
        return new Table({
            ...this.options,
            borderStyle: style,
        });
    }
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
    headers(...headers) {
        return new Table({
            ...this.options,
            headers: [...headers],
        });
    }
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
    width(width) {
        return new Table({
            ...this.options,
            width: width,
        });
    }
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
    styleFunc(styleFunction) {
        return new Table({
            ...this.options,
            styleFunc: styleFunction,
        });
    }
    /**
     * Returns the table as a string (alias for render).
     * @returns The rendered table
     */
    toString() {
        return this.render();
    }
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
export function newTable() {
    return new Table();
}
//# sourceMappingURL=table.js.map