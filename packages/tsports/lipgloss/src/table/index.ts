/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Table Component System
 *
 * A comprehensive table rendering system for terminal output with advanced features
 * including intelligent layout algorithms, conditional styling, data filtering,
 * responsive design, and high-performance rendering capabilities.
 *
 * ## System Architecture
 *
 * The table system is built on a modular architecture with clear separation of concerns:
 *
 * - **Presentation Layer**: Table class handles rendering and display logic
 * - **Data Layer**: TableData interface with StringData and TableFilter implementations
 * - **Layout Engine**: Resizer class with sophisticated sizing algorithms
 * - **Utility Layer**: Mathematical and array manipulation functions
 * - **Styling System**: Integration with the Style component for rich formatting
 *
 * ## Key Features
 *
 * ### Core Functionality
 * - **Headers and Data**: Optional column headers with full data row support
 * - **Borders**: Configurable borders (top, bottom, left, right, column, row separators)
 * - **Styling**: Per-cell conditional styling with full Style system integration
 * - **Auto-sizing**: Intelligent column width and row height calculation
 * - **Text Wrapping**: Automatic content wrapping with height optimization
 * - **Scrolling**: Offset support for large dataset pagination
 *
 * ### Advanced Features
 * - **Data Sources**: Flexible data source system with filtering capabilities
 * - **Responsive Design**: Automatic adaptation to available terminal width
 * - **Performance**: Optimized algorithms for large datasets
 * - **Extensibility**: Pluggable architecture for custom behaviors
 *
 * ## Quick Start
 *
 * ```typescript
 * import { newTable, newStringData } from '@lipgloss/table';
 *
 * // Simple table with headers
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
 * ## Advanced Examples
 *
 * ### Styled Table with Borders
 * ```typescript
 * import { newTable, Borders, HeaderRow, Style } from '@lipgloss/table';
 *
 * const styledTable = newTable()
 *   .setHeaders('Product', 'Price', 'Stock')
 *   .setBorder(Borders.Double)
 *   .setBorderStyle(new Style().foreground('blue'))
 *   .setStyleFunc((row, col) => {
 *     if (row === HeaderRow) {
 *       return new Style().bold(true).foreground('yellow').background('blue');
 *     }
 *
 *     // Highlight price column
 *     if (col === 1) {
 *       return new Style().foreground('green').bold(true);
 *     }
 *
 *     // Alternate row colors
 *     return row % 2 === 0
 *       ? new Style().background('lightgray')
 *       : new Style();
 *   })
 *   .rows(
 *     ['Laptop Pro', '$1,299', '15'],
 *     ['Wireless Mouse', '$29', '150'],
 *     ['Mechanical Keyboard', '$89', '75']
 *   );
 * ```
 *
 * ### Data Source Integration
 * ```typescript
 * import { newTable, newStringData, newTableFilter } from '@lipgloss/table';
 *
 * // Create data source
 * const employeeData = newStringData([
 *   ['Alice Johnson', '25', 'Engineering', '$85,000'],
 *   ['Bob Smith', '30', 'Marketing', '$65,000'],
 *   ['Charlie Brown', '35', 'Engineering', '$95,000'],
 *   ['Diana Wilson', '28', 'Sales', '$55,000']
 * ]);
 *
 * // Filter to show only Engineering department
 * const engineeringFilter = newTableFilter(employeeData, (row) => {
 *   return employeeData.at(row, 2) === 'Engineering';
 * });
 *
 * const table = newTable()
 *   .setHeaders('Name', 'Age', 'Department', 'Salary')
 *   .setData(engineeringFilter)
 *   .setWidth(80);
 * ```
 *
 * ### Responsive Design
 * ```typescript
 * import { newTable } from '@lipgloss/table';
 *
 * class ResponsiveTable {
 *   private data: string[][];
 *   private headers: string[];
 *
 *   getTable(terminalWidth: number) {
 *     const table = newTable()
 *       .setHeaders(...this.headers)
 *       .rows(...this.data)
 *       .setWidth(terminalWidth);
 *
 *     // Adjust features based on available width
 *     if (terminalWidth < 60) {
 *       // Narrow terminal: minimal borders, enable wrapping
 *       table
 *         .setBorderColumn(false)
 *         .setBorderRow(false)
 *         .setWrap(true);
 *     } else if (terminalWidth < 100) {
 *       // Medium terminal: some borders, selective wrapping
 *       table
 *         .setBorderColumn(true)
 *         .setBorderRow(false)
 *         .setWrap(true);
 *     } else {
 *       // Wide terminal: full features
 *       table
 *         .setBorderColumn(true)
 *         .setBorderRow(true)
 *         .setWrap(false);
 *     }
 *
 *     return table;
 *   }
 * }
 * ```
 *
 * ### Large Dataset Handling
 * ```typescript
 * import { newTable, newStringData } from '@lipgloss/table';
 *
 * // Handle large datasets with pagination
 * class PaginatedTable {
 *   constructor(
 *     private data: string[][],
 *     private pageSize: number = 25
 *   ) {}
 *
 *   getPage(pageNumber: number) {
 *     const startIndex = pageNumber * this.pageSize;
 *     const endIndex = Math.min(startIndex + this.pageSize, this.data.length);
 *
 *     return newTable()
 *       .setHeaders('ID', 'Name', 'Email', 'Department')
 *       .setData(newStringData(this.data))
 *       .setOffset(startIndex)
 *       .setHeight(this.pageSize + 2); // +2 for headers and borders
 *   }
 *
 *   getTotalPages(): number {
 *     return Math.ceil(this.data.length / this.pageSize);
 *   }
 * }
 * ```
 *
 * ## Data Sources
 *
 * The table system supports multiple data source patterns:
 *
 * ### Simple Arrays
 * ```typescript
 * const table = newTable().rows(
 *   ['Row 1 Col 1', 'Row 1 Col 2'],
 *   ['Row 2 Col 1', 'Row 2 Col 2']
 * );
 * ```
 *
 * ### StringData for Complex Scenarios
 * ```typescript
 * const data = newStringData()
 *   .item('Header 1', 'Header 2', 'Header 3')
 *   .item('Data 1', 'Data 2', 'Data 3');
 *
 * const table = newTable().setData(data);
 * ```
 *
 * ### Custom Data Sources
 * ```typescript
 * class DatabaseTableData implements TableData {
 *   constructor(private query: QueryResult) {}
 *
 *   at(row: number, column: number): string {
 *     return this.query.rows[row]?.[column]?.toString() || '';
 *   }
 *
 *   rows(): number { return this.query.rows.length; }
 *   columns(): number { return this.query.columns.length; }
 * }
 * ```
 *
 * ### Filtered Views
 * ```typescript
 * // Non-destructive filtering
 * const filtered = newTableFilter(originalData, (row) => {
 *   return originalData.at(row, 0).includes('search term');
 * });
 * ```
 *
 * ## Performance Considerations
 *
 * - **Large Datasets**: Use pagination or filtering for datasets > 1000 rows
 * - **Wide Tables**: Consider responsive design for tables > 120 characters
 * - **Text Wrapping**: Can impact performance; use judiciously
 * - **Style Functions**: Keep conditional styling logic simple and fast
 * - **Data Sources**: Implement efficient `at()` methods for custom data sources
 *
 * ## Type Definitions
 *
 * All components provide full TypeScript support:
 *
 * - **TableData**: Interface for all data sources
 * - **StyleFunc**: Function for conditional cell styling
 * - **DimensionResult**: Result of layout calculations
 * - **Utility Types**: Math and array manipulation function types
 */

// Export types separately
export type { TableData } from './data';

// Data management
export {
  dataToMatrix,
  newStringData,
  newTableFilter,
  StringData,
  TableFilter,
} from './data';
export type { DimensionResult } from './resizing';
// Resizing and layout
export { Resizer } from './resizing';
export type { StyleFunc, TableOptions } from './table';
// Core table classes and interfaces
export { defaultStyles, HeaderRow, newTable, Table } from './table';
// Utilities
export {
  btoi,
  clamp,
  distributeProportionally,
  ensureMinimum,
  fillArray,
  mapArray,
  max,
  maxOf,
  median,
  min,
  minOf,
  safeArrayAccess,
  sum,
} from './utils';
