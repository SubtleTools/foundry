import { describe, expect, test } from 'bun:test';
import {
  compareTableOutputs,
  formatTableDifferences,
  parseTableWithWidths,
} from './table-comparison.js';

describe('Table Comparison Utility', () => {
  test('should detect cell differences with semantic reporting', () => {
    const goOutput = `┌────────────┬────────────┬───────────┐
│ NAME       │ TYPE       │ HP        │
├────────────┼────────────┼───────────┤
│ Pikachu    │ Electric   │ 35        │
│ Charmander │ Fire       │ 39        │
└────────────┴────────────┴───────────┘`;

    const tsOutput = `┌────────────┬────────────┬───────────┐
│ NAME       │ TYPE       │ HP        │
├────────────┼────────────┼───────────┤
│ Pikachu    │ Electric   │ 35        │
│ Charmander │ Water      │ 39        │
└────────────┴────────────┴───────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12, 11],
      hasHeaderSeparator: true,
    });

    expect(result.match).toBe(false);
    expect(result.differences.length).toBe(1);
    expect(result.differences[0].type).toBe('cell');
    expect(result.differences[0].row).toBe(1); // Second data row (0-indexed)
    expect(result.differences[0].col).toBe(1); // Second column (0-indexed)
    expect(result.differences[0].description).toContain('Row 2, Column 2');
    expect(result.differences[0].expected).toBe('Fire');
    expect(result.differences[0].actual).toBe('Water');
  });

  test('should detect header differences', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    const tsOutput = `┌────────────┬────────────┐
│ NAME       │ SPECIES    │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
    });

    expect(result.match).toBe(false);
    expect(result.differences.length).toBe(1);
    expect(result.differences[0].type).toBe('cell');
    expect(result.differences[0].row).toBe('header');
    expect(result.differences[0].col).toBe(1);
    expect(result.differences[0].expected).toBe('TYPE');
    expect(result.differences[0].actual).toBe('SPECIES');
  });

  test('should detect dimension mismatches', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
│ Charmander │ Fire       │
└────────────┴────────────┘`;

    const tsOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
    });

    expect(result.match).toBe(false);
    expect(result.differences.length).toBeGreaterThan(0);
    expect(result.differences[0].type).toBe('dimension');
    expect(result.differences[0].description).toContain('Row count mismatch');
  });

  test('should handle tables without header separator', () => {
    const goOutput = `┌────────────┬────────────┐
│ Pikachu    │ Electric   │
│ Charmander │ Fire       │
└────────────┴────────────┘`;

    const tsOutput = `┌────────────┬────────────┐
│ Pikachu    │ Electric   │
│ Charmander │ Fire       │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: false,
    });

    expect(result.match).toBe(true);
    expect(result.differences.length).toBe(0);
  });

  test('should format differences in human-readable format', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
│ Charmander │ Fire       │
└────────────┴────────────┘`;

    const tsOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Lightning  │
│ Charmander │ Water      │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
    });

    const formatted = formatTableDifferences(result);

    expect(formatted).toContain('Found 2 difference(s)');
    expect(formatted).toContain('Row 1, Column 2');
    expect(formatted).toContain('Row 2, Column 2');
    expect(formatted).toContain('Expected: "Electric"');
    expect(formatted).toContain('Actual:   "Lightning"');
    expect(formatted).toContain('Expected: "Fire"');
    expect(formatted).toContain('Actual:   "Water"');
  });

  test('should parse table with widths correctly', () => {
    const output = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
│ Charmander │ Fire       │
└────────────┴────────────┘`;

    const parsed = parseTableWithWidths(output, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
    });

    expect(parsed.headers).not.toBeNull();
    expect(parsed.headers?.length).toBe(2);
    expect(parsed.headers?.[0].content).toBe('NAME');
    expect(parsed.headers?.[1].content).toBe('TYPE');

    expect(parsed.rows.length).toBe(2);
    expect(parsed.rows[0][0].content).toBe('Pikachu');
    expect(parsed.rows[0][1].content).toBe('Electric');
    expect(parsed.rows[1][0].content).toBe('Charmander');
    expect(parsed.rows[1][1].content).toBe('Fire');
  });

  test('should handle ANSI color codes in table cells', () => {
    // Table with ANSI color codes
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ \x1b[32mPikachu\x1b[0m    │ \x1b[33mElectric\x1b[0m   │
└────────────┴────────────┘`;

    const tsOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ \x1b[32mPikachu\x1b[0m    │ \x1b[33mElectric\x1b[0m   │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
    });

    expect(result.match).toBe(true);
    expect(result.differences.length).toBe(0);

    // Verify that cells contain stripped content
    expect(result.tsTable.rows[0][0].content).toBe('Pikachu');
    expect(result.tsTable.rows[0][1].content).toBe('Electric');
  });

  test('should respect maxDifferences option', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ A          │ Type1      │
│ B          │ Type2      │
│ C          │ Type3      │
│ D          │ Type4      │
│ E          │ Type5      │
└────────────┴────────────┘`;

    const tsOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ X          │ TypeX      │
│ Y          │ TypeY      │
│ Z          │ TypeZ      │
│ W          │ TypeW      │
│ V          │ TypeV      │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
      maxDifferences: 3,
    });

    expect(result.match).toBe(false);
    expect(result.differences.length).toBeLessThanOrEqual(3);
  });
});
