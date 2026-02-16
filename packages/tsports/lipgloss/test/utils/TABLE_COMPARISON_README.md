# Table Comparison Utility

A semantic-level ASCII table comparison utility for test assertions that provides actionable error messages.

## Problem

Character-by-character comparisons of ASCII tables produce unhelpful error messages:
```
Difference at position 234: 'L' != 'E'
Context: ...│ Pikachu    │ Lightning │     ...vs... │ Pikachu    │ Electric  │
```

This utility provides semantic reporting:
```
Row 3, Column 3 differs
Expected: "Electric"
Actual:   "Lightning"
```

## Features

- **Semantic cell comparison**: Reports differences by row and column
- **Complete structural verification**: Checks line prefixes (left borders), line suffixes (right borders), and column separators
- **ANSI code handling**: Strips ANSI codes from cell content, but verifies them in structural elements
- **Hex display**: Shows hex representation for control characters and ANSI codes in borders
- **Dimension checking**: Validates row and column counts
- **Configurable**: Can compare cell content only or full line structure

## Usage

### Basic Cell Comparison

```typescript
import { compareTableOutputs } from '../utils/table-comparison';

const result = compareTableOutputs(tsOutput, goOutput, {
  columnWidths: [12, 12, 11], // Width of each column (excluding borders)
  hasHeaderSeparator: true,
});

if (!result.match) {
  console.log(formatTableDifferences(result));
}

expect(result.match).toBe(true);
```

### Full Structural Comparison

```typescript
const result = compareTableOutputs(tsOutput, goOutput, {
  columnWidths: [12, 12, 11],
  hasHeaderSeparator: true,
  compareFullLines: true, // Default: true - checks borders and separators
});
```

### Content-Only Comparison

```typescript
const result = compareTableOutputs(tsOutput, goOutput, {
  columnWidths: [12, 12, 11],
  hasHeaderSeparator: true,
  compareFullLines: false, // Only check cell content, ignore borders
});
```

## Configuration Options

### Required Options

- **`columnWidths: number[]`** - Width of each column in characters (excluding borders)

### Border Configuration

- **`borderWidth?: number`** - Width of border characters (default: `1`)
- **`hasLeftBorder?: boolean`** - Table has left border (default: `true`)
- **`hasRightBorder?: boolean`** - Table has right border (default: `true`)
- **`hasColumnSeparators?: boolean`** - Table has separators between columns (default: `true`)

### Separator Configuration

- **`hasHeaderSeparator?: boolean`** - Table has separator line after header (default: `true`)
- **`hasRowSeparators?: boolean`** - Table has separator lines between data rows (default: `false`)

### Comparison Options

- **`compareFullLines?: boolean`** - Compare entire lines including borders/separators (default: `true`)
- **`ignoreColors?: boolean`** - Compare structure only, ignore ANSI codes (default: `false`)
- **`maxDifferences?: number`** - Stop after N differences (default: `10`)

## Finding Column Widths

Column widths must be determined from the table configuration. For Lipgloss tables:

```typescript
const table = new Table()
  .width(80)
  .headers('Name', 'Type', 'HP')
  .rows(['Pikachu', 'Electric', '35']);
```

You can:

1. **Measure the output**: Run the table once and count characters between separators
2. **Use table configuration**: If you know `.width()` and number of columns, calculate
3. **Add temporary logging**: Log the `_widths` property (if accessible)

Example for Pokemon table (`.width(80)`, 6 columns, `.padding(0, 1)`):
```typescript
const POKEMON_COLUMN_WIDTHS = [12, 12, 11, 11, 12, 15];
```

## Difference Types

### Cell Differences

```
Row 3, Column 2 differs
Expected: "Electric"
Actual:   "Lightning"
```

### Structural Differences

**Line Prefix (Left Border):**
```
Line prefix differs in row 1
Position: line prefix (left border)
Expected: │ [hex: e29482]
Actual:   ║ [hex: e29591]
```

**Line Suffix (Right Border):**
```
Line suffix differs in header
Position: line suffix (right border)
Expected: │ [hex: e29482]
Actual:   ║ [hex: e29591]
```

**Column Separators:**
```
Separator between columns 2 and 3 differs in row 1
Position: separator between columns 2 and 3
Expected: │ [hex: e29482]
Actual:   ║ [hex: e29591]
```

### Dimension Differences

```
Row count mismatch
Expected: 5 rows
Actual:   4 rows
```

## Data Structures

### TableCell

```typescript
interface TableCell {
  raw: string;           // With ANSI codes
  content: string;       // ANSI stripped, trimmed
  displayWidth: number;  // Visual width
  rowIndex: number;      // -1 for header
  colIndex: number;
}
```

### TableLine

```typescript
interface TableLine {
  linePrefix: string;    // Content before first cell (e.g., left border)
  cells: TableCell[];    // The actual cell contents
  separators: string[];  // Separators between cells
  lineSuffix: string;    // Content after last cell (e.g., right border)
  rawLine: string;       // Complete original line
  rowIndex: number;      // -1 for header
}
```

### TableComparisonResult

```typescript
interface TableComparisonResult {
  match: boolean;
  differences: TableDifference[];
  tsTable: ParsedTable;
  goTable: ParsedTable;
}
```

## Examples

### Example 1: Cell Content Difference

```typescript
const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

const tsOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Lightning  │
└────────────┴────────────┘`;

const result = compareTableOutputs(tsOutput, goOutput, {
  columnWidths: [12, 12],
  hasHeaderSeparator: true,
});

// Output:
// Row 1, Column 2 differs
// Expected: "Electric"
// Actual:   "Lightning"
```

### Example 2: Border Character Difference

```typescript
const goOutput = `│ NAME       │ TYPE       │`;
const tsOutput = `║ NAME       │ TYPE       │`;

const result = compareTableOutputs(tsOutput, goOutput, {
  columnWidths: [12, 12],
  hasHeaderSeparator: false,
  compareFullLines: true,
});

// Output:
// Line prefix differs in row 0
// Position: line prefix (left border)
// Expected: │ [hex: e29482]
// Actual:   ║ [hex: e29591]
```

### Example 3: ANSI Code in Cell

```typescript
const goOutput = `│ Pikachu    │ Electric   │`;
const tsOutput = `│ \x1b[32mPikachu\x1b[0m    │ Electric   │`;

const result = compareTableOutputs(tsOutput, goOutput, {
  columnWidths: [12, 12],
  hasHeaderSeparator: false,
});

// Result: match = true
// ANSI codes are stripped from cell content for comparison
```

### Example 4: ANSI Code in Border

```typescript
const goOutput = `│ Pikachu    │ Electric   │`;
const tsOutput = `\x1b[31m│\x1b[0m Pikachu    │ Electric   │`;

const result = compareTableOutputs(tsOutput, goOutput, {
  columnWidths: [12, 12],
  hasHeaderSeparator: false,
  compareFullLines: true, // Checks borders including ANSI codes
});

// Output:
// Line prefix differs in row 0
// Expected: │ [hex: e29482]
// Actual:   \x1b[31m│\x1b[0m [hex: 1b5b33316de294821b5b306d]
```

## Integration

### Re-exported from comparison.ts

```typescript
import { compareTableOutputs, formatTableDifferences } from '../utils/comparison';
```

### Direct import

```typescript
import {
  compareTableOutputs,
  formatTableDifferences,
  parseTableWithWidths
} from '../utils/table-comparison';
```

## Implementation Notes

### Why Column Widths Are Required

The table's column widths are private (`_widths` in Table class), and auto-detection is unreliable:
- `BorderType.Hidden` uses spaces for all characters - can't detect separators
- Custom `BorderStyle` allows arbitrary characters
- Tests already know the table configuration

### Position Calculation

Column positions are calculated from widths and border settings:

```typescript
// Example: [12, 12, 11] columns with borders and separators
// Positions: [1, 13], [14, 26], [27, 38]
//            │←12chars→│←12chars→│←11chars→│
```

### Line Classification

Lines are classified as:
- `top_border` - First line
- `bottom_border` - Last line
- `header_separator` - Separator after header (if `hasHeaderSeparator`)
- `row_separator` - Separator between rows (if `hasRowSeparators`)
- `content` - Header or data row

### ANSI Code Handling

- **Cell content**: ANSI codes are stripped before comparison
- **Structural elements**: ANSI codes are preserved and compared
- **Display**: Hex representation shown for control characters

## See Also

- `test/utils/table-comparison.test.ts` - Cell content comparison tests
- `test/utils/table-structure-comparison.test.ts` - Structural comparison tests
- `test/corpus/example/pokemon-comparison.test.ts` - Real-world usage example
