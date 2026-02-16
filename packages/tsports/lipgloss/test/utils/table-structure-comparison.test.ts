import { describe, expect, test } from 'bun:test';
import { compareTableOutputs, formatTableDifferences } from './table-comparison.js';

describe('Table Structure Comparison', () => {
  test('should detect line prefix (left border) differences', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    // TypeScript output has wrong left border character
    const tsOutput = `┌────────────┬────────────┐
║ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
      compareFullLines: true,
    });

    expect(result.match).toBe(false);

    const prefixDiffs = result.differences.filter(d => d.type === 'prefix');
    expect(prefixDiffs.length).toBeGreaterThan(0);
    expect(prefixDiffs[0].position).toBe('line prefix (left border)');
    expect(prefixDiffs[0].description).toContain('Line prefix differs');
  });

  test('should detect line suffix (right border) differences', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    // TypeScript output has wrong right border character
    const tsOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       ║
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
      compareFullLines: true,
    });

    expect(result.match).toBe(false);

    const suffixDiffs = result.differences.filter(d => d.type === 'suffix');
    expect(suffixDiffs.length).toBeGreaterThan(0);
    expect(suffixDiffs[0].position).toBe('line suffix (right border)');
    expect(suffixDiffs[0].description).toContain('Line suffix differs');
  });

  test('should detect separator differences between columns', () => {
    const goOutput = `┌────────────┬────────────┬───────────┐
│ NAME       │ TYPE       │ HP        │
├────────────┼────────────┼───────────┤
│ Pikachu    │ Electric   │ 35        │
└────────────┴────────────┴───────────┘`;

    // TypeScript output has wrong separator between columns 2 and 3
    const tsOutput = `┌────────────┬────────────┬───────────┐
│ NAME       │ TYPE       ║ HP        │
├────────────┼────────────┼───────────┤
│ Pikachu    │ Electric   │ 35        │
└────────────┴────────────┴───────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12, 11],
      hasHeaderSeparator: true,
      compareFullLines: true,
    });

    expect(result.match).toBe(false);

    const separatorDiffs = result.differences.filter(d => d.type === 'separator');
    expect(separatorDiffs.length).toBeGreaterThan(0);
    expect(separatorDiffs[0].description).toContain('Separator between columns 2 and 3');
    expect(separatorDiffs[0].position).toContain('separator between columns');
  });

  test('should detect ANSI code differences in borders', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    // TypeScript output has ANSI color code in left border
    const tsOutput = `┌────────────┬────────────┐
\x1b[31m│\x1b[0m NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
      compareFullLines: true,
    });

    expect(result.match).toBe(false);

    const prefixDiffs = result.differences.filter(d => d.type === 'prefix');
    expect(prefixDiffs.length).toBeGreaterThan(0);

    // The formatted output should show hex representation for ANSI codes
    const formatted = formatTableDifferences(result);
    expect(formatted).toContain('hex:');
    expect(formatted).toContain('1b'); // ESC character in hex
  });

  test('should allow disabling full line comparison', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    // TypeScript output has wrong left border but content matches
    const tsOutput = `┌────────────┬────────────┐
║ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
      compareFullLines: false, // Only compare cell content
    });

    // Should match because we're only comparing cell content, not borders
    expect(result.match).toBe(true);
    expect(result.differences.length).toBe(0);
  });

  test('should detect multiple structural issues in one line', () => {
    const goOutput = `┌────────────┬────────────┬───────────┐
│ NAME       │ TYPE       │ HP        │
├────────────┼────────────┼───────────┤
│ Pikachu    │ Electric   │ 35        │
└────────────┴────────────┴───────────┘`;

    // TypeScript output has wrong left border, separator, and right border
    const tsOutput = `┌────────────┬────────────┬───────────┐
║ NAME       ║ TYPE       ║ HP        ║
├────────────┼────────────┼───────────┤
│ Pikachu    │ Electric   │ 35        │
└────────────┴────────────┴───────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12, 11],
      hasHeaderSeparator: true,
      compareFullLines: true,
    });

    expect(result.match).toBe(false);

    // Should detect prefix, separators, and suffix differences
    const prefixDiffs = result.differences.filter(d => d.type === 'prefix');
    const separatorDiffs = result.differences.filter(d => d.type === 'separator');
    const suffixDiffs = result.differences.filter(d => d.type === 'suffix');

    expect(prefixDiffs.length).toBeGreaterThan(0);
    expect(separatorDiffs.length).toBeGreaterThan(0);
    expect(suffixDiffs.length).toBeGreaterThan(0);

    console.log('\nMultiple structural issues detected:');
    console.log(formatTableDifferences(result));
  });

  test('should detect differences in all data rows', () => {
    const goOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    │ Electric   │
│ Charmander │ Fire       │
│ Squirtle   │ Water      │
└────────────┴────────────┘`;

    // Each row has a different separator character
    const tsOutput = `┌────────────┬────────────┐
│ NAME       │ TYPE       │
├────────────┼────────────┤
│ Pikachu    ║ Electric   │
│ Charmander ┃ Fire       │
│ Squirtle   │ Water      │
└────────────┴────────────┘`;

    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: [12, 12],
      hasHeaderSeparator: true,
      compareFullLines: true,
    });

    expect(result.match).toBe(false);

    const separatorDiffs = result.differences.filter(d => d.type === 'separator');
    expect(separatorDiffs.length).toBe(2); // Rows 1 and 2 have wrong separators

    // Verify they're reporting the correct rows
    expect(separatorDiffs.some(d => d.description.includes('row 1'))).toBe(true);
    expect(separatorDiffs.some(d => d.description.includes('row 2'))).toBe(true);
  });
});
