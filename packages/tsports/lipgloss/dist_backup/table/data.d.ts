/**
 * Table Data Management System
 *
 * This module provides the data layer infrastructure for tables, including interfaces for
 * accessing table data and concrete implementations for various data sources. The system
 * is designed to be flexible and extensible, supporting everything from simple string
 * arrays to complex data filtering and transformation operations.
 *
 * ## Key Components
 *
 * - **TableData Interface**: Abstract interface for all data sources
 * - **StringData**: Simple string-based table data implementation
 * - **TableFilter**: Proxy for filtering table data without modification
 * - **Utility Functions**: Helper functions for data manipulation and conversion
 *
 * ## Design Philosophy
 *
 * The data system follows a layered approach:
 * 1. **Interface Layer**: TableData provides a consistent API
 * 2. **Implementation Layer**: Concrete classes like StringData handle storage
 * 3. **Transformation Layer**: Classes like TableFilter provide data views
 * 4. **Utility Layer**: Functions for common operations and conversions
 *
 * @example Basic Data Usage
 * ```typescript
 * import { newStringData, newTableFilter } from './data';
 *
 * // Create data source
 * const data = newStringData([
 *   ['Name', 'Age', 'City'],
 *   ['Alice', '25', 'New York'],
 *   ['Bob', '30', 'Los Angeles']
 * ]);
 *
 * // Create filtered view
 * const filtered = newTableFilter(data, (row) => {
 *   const age = parseInt(data.at(row, 1));
 *   return age >= 27; // Only show people 27 or older
 * });
 * ```
 *
 * @example Custom Data Implementation
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
 */
/**
 * TableData interface that defines the contract for all table data sources.
 *
 * This interface provides a consistent API for accessing tabular data regardless
 * of the underlying storage mechanism. Implementations can range from simple
 * in-memory arrays to complex database-backed data sources with real-time updates.
 *
 * The interface is designed to be:
 * - **Simple**: Minimal method set for basic operations
 * - **Efficient**: Allows for lazy loading and streaming implementations
 * - **Flexible**: No assumptions about data storage or format
 * - **Type-safe**: Strong typing for reliable table operations
 *
 * @example Custom Implementation
 * ```typescript
 * class CSVTableData implements TableData {
 *   private data: string[][];
 *
 *   constructor(csvContent: string) {
 *     this.data = csvContent.split('\n')
 *       .map(line => line.split(',').map(cell => cell.trim()));
 *   }
 *
 *   at(row: number, column: number): string {
 *     return this.data[row]?.[column] || '';
 *   }
 *
 *   rows(): number { return this.data.length; }
 *   columns(): number { return Math.max(...this.data.map(row => row.length)); }
 * }
 * ```
 *
 * @example Async Data Source
 * ```typescript
 * class AsyncTableData implements TableData {
 *   private cache = new Map<string, string>();
 *
 *   at(row: number, column: number): string {
 *     const key = `${row},${column}`;
 *     if (!this.cache.has(key)) {
 *       // In real implementation, this would trigger async loading
 *       this.cache.set(key, this.fetchCell(row, column));
 *     }
 *     return this.cache.get(key) || '';
 *   }
 *
 *   private fetchCell(row: number, column: number): string {
 *     // Simulate data fetching
 *     return `Cell(${row},${column})`;
 *   }
 *
 *   rows(): number { return this.totalRows; }
 *   columns(): number { return this.totalColumns; }
 * }
 * ```
 */
export interface TableData {
    /**
     * Returns the contents of the cell at the given index.
     * @param row - The row index
     * @param column - The column index
     * @returns The cell content as a string
     */
    at(row: number, column: number): string;
    /**
     * Returns the number of rows in the table.
     * @returns The number of rows
     */
    rows(): number;
    /**
     * Returns the number of columns in the table.
     * @returns The number of columns
     */
    columns(): number;
}
/**
 * StringData provides a concrete string-based implementation of the TableData interface.
 *
 * This class is the primary data container for most table use cases, offering efficient
 * storage and manipulation of tabular string data. It automatically handles column
 * normalization, supports dynamic row addition, and provides a fluent API for
 * convenient data management.
 *
 * ## Key Features
 *
 * - **Dynamic Sizing**: Automatically adjusts to accommodate varying row lengths
 * - **Type Safety**: Ensures all data is stored and retrieved as strings
 * - **Immutability Options**: Creates defensive copies to prevent external modification
 * - **Fluent API**: Chainable methods for convenient data building
 * - **Efficient Access**: O(1) random access to any cell
 * - **Memory Efficient**: Uses native JavaScript arrays for optimal performance
 *
 * ## Common Use Cases
 *
 * - **Static Data**: Predefined table content loaded at initialization
 * - **Dynamic Content**: Tables built progressively with streaming data
 * - **Data Transformation**: Converting from other formats (CSV, JSON, etc.)
 * - **Test Data**: Programmatically generated content for testing
 * - **Configuration Tables**: Settings, parameters, or status information
 *
 * @example Basic Usage
 * ```typescript
 * const data = new StringData([
 *   ['Product', 'Price', 'Stock'],
 *   ['Laptop', '$999', '15'],
 *   ['Mouse', '$25', '50']
 * ]);
 *
 * console.log(data.at(1, 0)); // 'Laptop'
 * console.log(data.rows());   // 3
 * console.log(data.columns()); // 3
 * ```
 *
 * @example Progressive Building
 * ```typescript
 * const data = new StringData()
 *   .item('Name', 'Age', 'City')      // Header row
 *   .item('Alice', '25', 'New York')  // Data rows
 *   .item('Bob', '30', 'Los Angeles')
 *   .item('Charlie', '35', 'Chicago');
 *
 * // Use with table
 * const table = newTable()
 *   .setData(data)
 *   .setHeaders('Name', 'Age', 'City');
 * ```
 *
 * @example Data Conversion
 * ```typescript
 * // From JSON array
 * const jsonData = [
 *   { name: 'Alice', age: 25, city: 'New York' },
 *   { name: 'Bob', age: 30, city: 'Los Angeles' }
 * ];
 *
 * const tableData = new StringData();
 * jsonData.forEach(item => {
 *   tableData.append([item.name, item.age.toString(), item.city]);
 * });
 *
 * // From CSV-like string
 * const csvLines = csvContent.split('\n');
 * const fromCSV = new StringData(
 *   csvLines.map(line => line.split(',').map(cell => cell.trim()))
 * );
 * ```
 *
 * @example Handling Variable Row Lengths
 * ```typescript
 * const irregularData = new StringData([
 *   ['A', 'B'],           // 2 columns
 *   ['C', 'D', 'E'],      // 3 columns
 *   ['F']                 // 1 column
 * ]);
 *
 * console.log(irregularData.columns()); // 3 (max columns)
 * console.log(irregularData.at(2, 1));  // '' (empty for missing cells)
 * ```
 */
export declare class StringData implements TableData {
    private _rows;
    private _columns;
    /**
     * Creates a new StringData instance with optional initial rows.
     * @param rows - Optional initial rows to populate the table
     */
    constructor(rows?: string[][]);
    /**
     * Appends a row to the table data.
     * @param row - The row to append
     */
    append(row: string[]): void;
    /**
     * Adds an item (row) to the table data.
     * This is an alias for append() for fluent API support.
     * @param cells - The cells to add as a row
     * @returns This StringData instance for chaining
     */
    item(...cells: string[]): StringData;
    /**
     * Returns the contents of the cell at the given index.
     * @param row - The row index
     * @param column - The column index
     * @returns The cell content, or empty string if out of bounds
     */
    at(row: number, column: number): string;
    /**
     * Returns the number of rows in the table.
     * @returns The number of rows
     */
    rows(): number;
    /**
     * Returns the number of columns in the table.
     * @returns The number of columns
     */
    columns(): number;
    /**
     * Clears all data from the table.
     */
    clear(): void;
    /**
     * Returns all data as a 2D array.
     * @returns A copy of the internal data structure
     */
    toMatrix(): string[][];
}
/**
 * TableFilter provides a non-destructive filtering layer for table data.
 *
 * This class acts as a proxy that applies filtering logic to an underlying
 * TableData source without modifying the original data. It's perfect for
 * creating filtered views, implementing search functionality, or showing
 * subsets of data based on dynamic criteria.
 *
 * ## Key Features
 *
 * - **Non-Destructive**: Original data remains unchanged
 * - **Dynamic Filtering**: Filter criteria can be updated in real-time
 * - **Lazy Evaluation**: Filtering is applied on-demand during access
 * - **Transparent Interface**: Implements TableData for seamless integration
 * - **Efficient**: Only processes data when accessed, not when filter is set
 * - **Composable**: Can be chained with other filters or data transformations
 *
 * ## Common Use Cases
 *
 * - **Search Results**: Filter rows based on text search criteria
 * - **Data Ranges**: Show only rows within specific value ranges
 * - **Category Filtering**: Display items matching specific categories
 * - **Conditional Display**: Hide/show rows based on complex business logic
 * - **A/B Testing**: Show different data subsets to different users
 * - **Permission-Based Views**: Filter data based on user access rights
 *
 * @example Basic Filtering
 * ```typescript
 * const allData = newStringData([
 *   ['Name', 'Age', 'Department'],
 *   ['Alice', '25', 'Engineering'],
 *   ['Bob', '30', 'Marketing'],
 *   ['Charlie', '35', 'Engineering'],
 *   ['Diana', '28', 'Sales']
 * ]);
 *
 * // Filter to show only Engineering department
 * const engineeringFilter = newTableFilter(allData, (row) => {
 *   return allData.at(row, 2) === 'Engineering';
 * });
 *
 * console.log(engineeringFilter.rows()); // 2 (Alice and Charlie)
 * ```
 *
 * @example Age Range Filtering
 * ```typescript
 * const ageFilter = newTableFilter(allData, (row) => {
 *   const age = parseInt(allData.at(row, 1));
 *   return age >= 25 && age <= 30;
 * });
 *
 * // Use with table
 * const table = newTable()
 *   .setHeaders('Name', 'Age', 'Department')
 *   .setData(ageFilter);
 * ```
 *
 * @example Dynamic Search Filter
 * ```typescript
 * class SearchFilter extends TableFilter {
 *   private searchTerm = '';
 *
 *   setSearchTerm(term: string) {
 *     this.searchTerm = term.toLowerCase();
 *     this.filter((row) => {
 *       // Search across all columns
 *       for (let col = 0; col < this.data.columns(); col++) {
 *         if (this.data.at(row, col).toLowerCase().includes(this.searchTerm)) {
 *           return true;
 *         }
 *       }
 *       return false;
 *     });
 *   }
 * }
 *
 * const searchFilter = new SearchFilter(allData);
 * searchFilter.setSearchTerm('eng'); // Shows Engineering rows
 * ```
 *
 * @example Composite Filtering
 * ```typescript
 * // Chain multiple filters
 * const departmentFilter = newTableFilter(originalData, (row) =>
 *   originalData.at(row, 2) === 'Engineering'
 * );
 *
 * const seniorFilter = newTableFilter(departmentFilter, (row) => {
 *   const age = parseInt(departmentFilter.at(row, 1));
 *   return age >= 30;
 * });
 *
 * // Result: Senior engineers only
 * ```
 *
 * @example Permission-Based Filtering
 * ```typescript
 * class PermissionFilter extends TableFilter {
 *   constructor(data: TableData, private userRole: string) {
 *     super(data);
 *     this.updateFilter();
 *   }
 *
 *   private updateFilter() {
 *     this.filter((row) => {
 *       const sensitivity = this.data.at(row, 3); // Sensitivity column
 *
 *       switch (this.userRole) {
 *         case 'admin': return true; // See everything
 *         case 'manager': return sensitivity !== 'confidential';
 *         case 'user': return sensitivity === 'public';
 *         default: return false;
 *       }
 *     });
 *   }
 * }
 * ```
 */
export declare class TableFilter implements TableData {
    private data;
    private filterFunc;
    /**
     * Creates a new TableFilter instance.
     * @param data - The source table data
     * @param filterFunc - Function to determine which rows should be included
     */
    constructor(data: TableData, filterFunc?: (row: number) => boolean);
    /**
     * Sets a new filter function.
     * @param filterFunc - Function to determine which rows should be included
     * @returns This TableFilter instance for chaining
     */
    filter(filterFunc: (row: number) => boolean): TableFilter;
    /**
     * Returns the contents of the cell at the given filtered index.
     * @param row - The row index in the filtered data
     * @param column - The column index
     * @returns The cell content
     */
    at(row: number, column: number): string;
    /**
     * Returns the number of rows after filtering.
     * @returns The number of filtered rows
     */
    rows(): number;
    /**
     * Returns the number of columns in the table.
     * @returns The number of columns
     */
    columns(): number;
}
/**
 * Utility function to create a new StringData instance.
 * @param rows - Optional initial rows
 * @returns A new StringData instance
 */
export declare function newStringData(rows?: string[][]): StringData;
/**
 * Utility function to create a new TableFilter instance.
 * @param data - The source table data
 * @param filterFunc - Optional filter function
 * @returns A new TableFilter instance
 */
export declare function newTableFilter(data: TableData, filterFunc?: (row: number) => boolean): TableFilter;
/**
 * Converts table data to a 2D array matrix.
 * @param data - The table data to convert
 * @returns A 2D array representation of the table
 */
export declare function dataToMatrix(data: TableData): string[][];
//# sourceMappingURL=data.d.ts.map