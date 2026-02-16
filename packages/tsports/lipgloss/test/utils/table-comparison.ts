/**
 * Table comparison utility for semantic-level ASCII table comparisons
 *
 * This utility parses ASCII tables using known column widths and provides
 * semantic difference reporting (e.g., "Row 5, Column 4 differs") instead
 * of character-by-character comparisons.
 */

import { getTextWidth } from '../../src/layout.js';
import { stripAnsi } from '../../src/ansi-utils.js';

export interface TableCell {
  raw: string;           // With ANSI codes
  content: string;       // ANSI stripped, trimmed
  displayWidth: number;  // Visual width
  rowIndex: number;      // -1 for header
  colIndex: number;
}

export interface TableLine {
  linePrefix: string;    // Content before first cell (e.g., left border)
  cells: TableCell[];    // The actual cell contents
  separators: string[];  // Separators between cells (length = cells.length - 1)
  lineSuffix: string;    // Content after last cell (e.g., right border)
  rawLine: string;       // Complete original line
  rowIndex: number;      // -1 for header, -2+ for border lines
}

export interface ParsedTable {
  headers: TableCell[] | null;
  rows: TableCell[][];
  columnWidths: number[];
  rawLines: string[];
  contentLines: TableLine[]; // Parsed lines with structure (header + data rows)
}

export interface TableDifference {
  type: 'cell' | 'structure' | 'dimension' | 'prefix' | 'suffix' | 'separator';
  row: number | 'header';
  col?: number;
  description: string;
  expected: string;
  actual: string;
  position?: string; // Additional position info like 'line prefix', 'line suffix', 'separator between columns X and Y'
}

export interface TableComparisonResult {
  match: boolean;
  differences: TableDifference[];
  tsTable: ParsedTable;
  goTable: ParsedTable;
}

export interface TableComparisonOptions {
  columnWidths: number[];        // REQUIRED - widths of each column (excluding borders)
  borderWidth?: number;          // Width of border character (default: 1)
  hasLeftBorder?: boolean;       // Default: true
  hasRightBorder?: boolean;      // Default: true
  hasColumnSeparators?: boolean; // Default: true
  hasHeaderSeparator?: boolean;  // Default: true
  hasRowSeparators?: boolean;    // Default: false
  ignoreColors?: boolean;        // Ignore ANSI codes in all comparisons (default: false)
  compareFullLines?: boolean;    // Compare entire lines including borders/separators (default: true)
  maxDifferences?: number;       // Default: 10
}

type LineType = 'top_border' | 'bottom_border' | 'header_separator' | 'row_separator' | 'content';

/**
 * Calculate the start and end positions for each column based on column widths and border settings
 */
function calculateColumnPositions(options: TableComparisonOptions): Array<[number, number]> {
  const { columnWidths, borderWidth = 1, hasLeftBorder = true, hasColumnSeparators = true } = options;
  const positions: Array<[number, number]> = [];

  let currentPos = hasLeftBorder ? borderWidth : 0;

  for (let i = 0; i < columnWidths.length; i++) {
    const start = currentPos;
    const end = start + columnWidths[i];
    positions.push([start, end]);

    currentPos = end;
    if (hasColumnSeparators && i < columnWidths.length - 1) {
      currentPos += borderWidth; // separator
    }
  }

  return positions;
}

/**
 * Classify a line type based on its index and content
 */
function classifyLine(line: string, lineIndex: number, totalLines: number, options: TableComparisonOptions): LineType {
  const { hasHeaderSeparator = true, hasRowSeparators = false } = options;

  // Strip ANSI to analyze structure
  const plainLine = stripAnsi(line);

  // First line is typically top border
  if (lineIndex === 0) {
    return 'top_border';
  }

  // Last line is typically bottom border
  if (lineIndex === totalLines - 1) {
    return 'bottom_border';
  }

  // Check if line is primarily made of border/separator characters
  // Common separator chars: ─ ━ ═ - = │ ┃ ║ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ + |
  const borderChars = /[─━═\-=│┃║┌┐└┘├┤┬┴┼+|]/g;
  const borderCharCount = (plainLine.match(borderChars) || []).length;
  const totalChars = plainLine.replace(/\s/g, '').length;

  // If >80% of non-space characters are border chars, it's a separator line
  if (totalChars > 0 && borderCharCount / totalChars > 0.8) {
    // If it's the second line and we expect a header separator, classify as such
    if (hasHeaderSeparator && lineIndex === 2) {
      return 'header_separator';
    }
    // Otherwise, could be a row separator
    if (hasRowSeparators) {
      return 'row_separator';
    }
  }

  return 'content';
}

/**
 * Extract cell content from a line at specified column positions
 * This function handles ANSI codes by working on the plain text version
 * to find the correct slice positions
 */
function extractCellContent(line: string, colStart: number, colEnd: number, rowIndex: number, colIndex: number): TableCell {
  // Strip ANSI from the line first to find the correct content positions
  const plainLine = stripAnsi(line);

  // Extract content from the plain version
  const plainContent = plainLine.slice(colStart, colEnd);
  const content = plainContent.trim();

  // Calculate display width
  const displayWidth = getTextWidth(content);

  // For raw, we need to extract from the original line with ANSI codes
  // We'll find the corresponding portion by tracking ANSI sequences
  let rawContent = '';
  let plainPos = 0;
  let rawPos = 0;

  while (rawPos < line.length && plainPos < colEnd) {
    // Check for ANSI escape sequence
    if (line[rawPos] === '\x1b' && line[rawPos + 1] === '[') {
      // Found ANSI sequence, copy it to raw if we're in range
      if (plainPos >= colStart) {
        let ansiEnd = rawPos + 2;
        while (ansiEnd < line.length && !/[a-zA-Z]/.test(line[ansiEnd])) {
          ansiEnd++;
        }
        if (ansiEnd < line.length) ansiEnd++; // Include the final letter
        rawContent += line.slice(rawPos, ansiEnd);
        rawPos = ansiEnd;
      } else {
        // Skip ANSI sequence before our range
        rawPos += 2;
        while (rawPos < line.length && !/[a-zA-Z]/.test(line[rawPos])) {
          rawPos++;
        }
        if (rawPos < line.length) rawPos++; // Skip the final letter
      }
    } else {
      // Regular character
      if (plainPos >= colStart && plainPos < colEnd) {
        rawContent += line[rawPos];
      }
      plainPos++;
      rawPos++;
    }
  }

  return {
    raw: rawContent,
    content,
    displayWidth,
    rowIndex,
    colIndex,
  };
}

/**
 * Parse a complete content line including prefix, cells, separators, and suffix
 */
function parseCompleteLine(
  line: string,
  columnPositions: Array<[number, number]>,
  rowIndex: number,
  options: TableComparisonOptions
): TableLine {
  const { borderWidth = 1, hasLeftBorder = true, hasRightBorder = true, hasColumnSeparators = true } = options;

  // Extract line prefix (left border)
  const linePrefix = hasLeftBorder ? line.slice(0, borderWidth) : '';

  // Extract cells and separators
  const cells: TableCell[] = [];
  const separators: string[] = [];

  for (let colIndex = 0; colIndex < columnPositions.length; colIndex++) {
    const [start, end] = columnPositions[colIndex];

    // Extract cell
    const cell = extractCellContent(line, start, end, rowIndex, colIndex);
    cells.push(cell);

    // Extract separator after this cell (if not the last cell)
    if (hasColumnSeparators && colIndex < columnPositions.length - 1) {
      const sepStart = end;
      const sepEnd = sepStart + borderWidth;
      separators.push(line.slice(sepStart, sepEnd));
    }
  }

  // Extract line suffix (right border)
  let lineSuffix = '';
  if (hasRightBorder) {
    const lastColEnd = columnPositions[columnPositions.length - 1][1];
    const suffixStart = hasColumnSeparators ? lastColEnd : lastColEnd;
    lineSuffix = line.slice(suffixStart, suffixStart + borderWidth);
  }

  return {
    linePrefix,
    cells,
    separators,
    lineSuffix,
    rawLine: line,
    rowIndex,
  };
}

/**
 * Parse a table output using known column widths
 */
export function parseTableWithWidths(output: string, options: TableComparisonOptions): ParsedTable {
  const { columnWidths, hasHeaderSeparator = true } = options;

  const rawLines = output.split('\n').filter(line => line.length > 0);
  const columnPositions = calculateColumnPositions(options);

  let headers: TableCell[] | null = null;
  const rows: TableCell[][] = [];
  const contentLines: TableLine[] = [];

  let headerRowIndex = -1;
  let currentDataRowIndex = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const lineType = classifyLine(line, i, rawLines.length, options);

    if (lineType === 'content') {
      // Determine if this is a header row or data row
      const isHeaderRow = hasHeaderSeparator && headerRowIndex === -1;
      const rowIdx = isHeaderRow ? -1 : currentDataRowIndex;

      // Parse the complete line including borders and separators
      const parsedLine = parseCompleteLine(line, columnPositions, rowIdx, options);
      contentLines.push(parsedLine);

      if (isHeaderRow) {
        // This is the header row
        headers = parsedLine.cells;
        headerRowIndex = i;
      } else {
        // This is a data row
        rows.push(parsedLine.cells);
        currentDataRowIndex++;
      }
    }
  }

  return {
    headers,
    rows,
    columnWidths,
    rawLines,
    contentLines,
  };
}

/**
 * Compare two parsed tables and generate semantic differences
 */
export function compareTableOutputs(
  tsOutput: string,
  goOutput: string,
  options: TableComparisonOptions
): TableComparisonResult {
  const tsTable = parseTableWithWidths(tsOutput, options);
  const goTable = parseTableWithWidths(goOutput, options);

  const differences: TableDifference[] = [];
  const maxDifferences = options.maxDifferences || 10;

  // Compare dimensions
  if (tsTable.rows.length !== goTable.rows.length) {
    differences.push({
      type: 'dimension',
      row: -1,
      description: 'Row count mismatch',
      expected: `${goTable.rows.length} rows`,
      actual: `${tsTable.rows.length} rows`,
    });
  }

  if (tsTable.columnWidths.length !== goTable.columnWidths.length) {
    differences.push({
      type: 'dimension',
      row: -1,
      description: 'Column count mismatch',
      expected: `${goTable.columnWidths.length} columns`,
      actual: `${tsTable.columnWidths.length} columns`,
    });
  }

  // Compare headers
  if (tsTable.headers && goTable.headers) {
    for (let col = 0; col < Math.min(tsTable.headers.length, goTable.headers.length); col++) {
      const tsCell = tsTable.headers[col];
      const goCell = goTable.headers[col];

      if (tsCell.content !== goCell.content) {
        differences.push({
          type: 'cell',
          row: 'header',
          col,
          description: `Header column ${col + 1} differs`,
          expected: goCell.content,
          actual: tsCell.content,
        });

        if (differences.length >= maxDifferences) {
          return { match: false, differences, tsTable, goTable };
        }
      }
    }
  }

  // When not comparing full lines, only compare cell content (stripped) - this is the main semantic comparison
  const ignoreColors = options.ignoreColors || false;

  // Always do semantic comparison of cell content
  const minRows = Math.min(tsTable.rows.length, goTable.rows.length);
  for (let row = 0; row < minRows; row++) {
    const tsRow = tsTable.rows[row];
    const goRow = goTable.rows[row];

    const minCols = Math.min(tsRow.length, goRow.length);
    for (let col = 0; col < minCols; col++) {
      const tsCell = tsRow[col];
      const goCell = goRow[col];

      // Compare cell content (semantic comparison)
      if (tsCell.content !== goCell.content) {
        differences.push({
          type: 'cell',
          row,
          col,
          description: `Row ${row + 1}, Column ${col + 1} differs`,
          expected: goCell.content,
          actual: tsCell.content,
        });

        if (differences.length >= maxDifferences) {
          return { match: false, differences, tsTable, goTable };
        }
      }
    }
  }

  // Compare complete line structure if requested (for detailed structural validation)
  const compareFullLines = options.compareFullLines === true; // Only if explicitly requested

  if (compareFullLines) {
    const minContentLines = Math.min(tsTable.contentLines.length, goTable.contentLines.length);

    for (let i = 0; i < minContentLines; i++) {
      const tsLine = tsTable.contentLines[i];
      const goLine = goTable.contentLines[i];
      const row = tsLine.rowIndex;
      const rowLabel = row === -1 ? 'header' : `row ${row + 1}`;

      // Compare line prefix (left border)
      if (tsLine.linePrefix !== goLine.linePrefix) {
        differences.push({
          type: 'prefix',
          row,
          description: `Line prefix differs in ${rowLabel}`,
          expected: goLine.linePrefix,
          actual: tsLine.linePrefix,
          position: 'line prefix (left border)',
        });

        if (differences.length >= maxDifferences) {
          return { match: false, differences, tsTable, goTable };
        }
      }

      // Compare cell raw content (including ANSI codes) unless ignoreColors is set
      const minCells = Math.min(tsLine.cells.length, goLine.cells.length);
      for (let col = 0; col < minCells; col++) {
        const tsCell = tsLine.cells[col];
        const goCell = goLine.cells[col];

        // Compare raw cell content (including ANSI codes) unless ignoreColors is true
        const tsCellData = ignoreColors ? tsCell.content : tsCell.raw;
        const goCellData = ignoreColors ? goCell.content : goCell.raw;

        if (tsCellData !== goCellData) {
          differences.push({
            type: 'cell',
            row,
            col,
            description: `Cell content differs in ${rowLabel}, column ${col + 1}`,
            expected: goCellData,
            actual: tsCellData,
            position: `cell in ${rowLabel}, column ${col + 1}`,
          });

          if (differences.length >= maxDifferences) {
            return { match: false, differences, tsTable, goTable };
          }
        }
      }

      // Compare separators between cells
      const minSeps = Math.min(tsLine.separators.length, goLine.separators.length);
      for (let s = 0; s < minSeps; s++) {
        if (tsLine.separators[s] !== goLine.separators[s]) {
          differences.push({
            type: 'separator',
            row,
            col: s,
            description: `Separator between columns ${s + 1} and ${s + 2} differs in ${rowLabel}`,
            expected: goLine.separators[s],
            actual: tsLine.separators[s],
            position: `separator between columns ${s + 1} and ${s + 2}`,
          });

          if (differences.length >= maxDifferences) {
            return { match: false, differences, tsTable, goTable };
          }
        }
      }

      // Compare line suffix (right border)
      if (tsLine.lineSuffix !== goLine.lineSuffix) {
        differences.push({
          type: 'suffix',
          row,
          description: `Line suffix differs in ${rowLabel}`,
          expected: goLine.lineSuffix,
          actual: tsLine.lineSuffix,
          position: 'line suffix (right border)',
        });

        if (differences.length >= maxDifferences) {
          return { match: false, differences, tsTable, goTable };
        }
      }
    }
  }

  const match = differences.length === 0;
  return { match, differences, tsTable, goTable };
}

/**
 * Format table differences into a human-readable report
 */
export function formatTableDifferences(result: TableComparisonResult): string {
  if (result.match) {
    return 'Tables match exactly';
  }

  const lines: string[] = [];
  lines.push(`Found ${result.differences.length} difference(s)`);

  for (let i = 0; i < result.differences.length; i++) {
    const diff = result.differences[i];
    lines.push('');

    // Add position information for structural differences
    if (diff.row === 'header') {
      lines.push(`Header, Column ${(diff.col || 0) + 1}:`);
    } else if (diff.row >= 0 && diff.type === 'cell') {
      lines.push(`Row ${diff.row + 1}, Column ${(diff.col || 0) + 1}:`);
    } else if (diff.position) {
      lines.push(`${diff.description}`);
      lines.push(`Position: ${diff.position}`);
    } else {
      lines.push(`${diff.description}`);
    }

    // Format expected/actual values based on type and content
    const hasAnsiCodes = (str: string) => /\x1b\[/.test(str);
    const needsHex = diff.type === 'prefix' || diff.type === 'suffix' || diff.type === 'separator' ||
                     (diff.type === 'cell' && (hasAnsiCodes(diff.expected) || hasAnsiCodes(diff.actual)));

    if (needsHex) {
      // Show hex for control characters and ANSI codes
      const showHex = (str: string) => {
        const hex = Buffer.from(str).toString('hex');
        const visible = str.replace(/[\x00-\x1F\x7F-\x9F]/g, (ch) => `\\x${ch.charCodeAt(0).toString(16).padStart(2, '0')}`);
        const preview = hex.length > 40 ? `${hex.slice(0, 40)}...` : hex;
        return `${visible} [hex: ${preview}]`;
      };
      lines.push(`Expected: ${showHex(diff.expected)}`);
      lines.push(`Actual:   ${showHex(diff.actual)}`);
    } else {
      lines.push(`Expected: "${diff.expected}"`);
      lines.push(`Actual:   "${diff.actual}"`);
    }
  }

  // Add table dimensions for context
  lines.push('');
  lines.push('Table dimensions:');
  lines.push(`  Go (expected):     ${result.goTable.rows.length} rows × ${result.goTable.columnWidths.length} columns`);
  lines.push(`  TypeScript (actual): ${result.tsTable.rows.length} rows × ${result.tsTable.columnWidths.length} columns`);

  return lines.join('\n');
}
