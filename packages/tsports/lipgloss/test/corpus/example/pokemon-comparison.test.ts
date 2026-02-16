import { describe, expect, test } from 'bun:test';
import { execSync } from 'child_process';
import { join } from 'path';
import { compareTableOutputs, formatTableDifferences } from '../../utils/comparison.js';

// Extend the global NodeJS.ProcessEnv to include color-related environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NO_COLOR?: string;
      FORCE_COLOR?: string;
    }
  }
}

describe('Pokemon Table Example Comparison', () => {
  // Pokemon table column widths:
  // Table has .width(80) with 6 columns and .padding(0, 1) on each cell
  // This gives us 12, 12, 11, 11, 12, 15 character columns (including padding)
  const POKEMON_COLUMN_WIDTHS = [12, 12, 11, 11, 12, 15];

  test('TypeScript Pokemon example should match Go Pokemon example exactly', async () => {
    const projectRoot = join(__dirname, '../../..');

    // Both should run with same environment - using FORCE_COLOR=3 to enable colors
    const testEnv = { ...process.env, FORCE_COLOR: '3' };
    delete testEnv.NO_COLOR; // Remove NO_COLOR to allow colors

    // Run TypeScript Pokemon example
    const tsOutput = execSync('bun run main.ts', {
      cwd: join(projectRoot, 'examples/table/pokemon'),
      encoding: 'utf8',
      env: testEnv,
    });

    // Run Go Pokemon example
    const goOutput = execSync('go run main.go', {
      cwd: join(projectRoot, 'test/automation/reference/examples/table/pokemon'),
      encoding: 'utf8',
      env: testEnv,
    });

    // Use semantic table comparison for better error messages
    const result = compareTableOutputs(tsOutput, goOutput, {
      columnWidths: POKEMON_COLUMN_WIDTHS,
      hasHeaderSeparator: true,
      hasRowSeparators: false,
    });

    if (!result.match) {
      console.log(formatTableDifferences(result));
    }

    expect(result.match).toBe(true);
  });

  test('TypeScript Pokemon example should produce expected table structure', async () => {
    const projectRoot = join(__dirname, '../../..');

    // Use NO_COLOR for cleaner structural validation
    const testEnv = { ...process.env, NO_COLOR: '1' };
    delete testEnv.FORCE_COLOR; // Ensure colors are disabled

    // Run TypeScript Pokemon example
    const tsOutput = execSync('bun run main.ts', {
      cwd: join(projectRoot, 'examples/table/pokemon'),
      encoding: 'utf8',
      env: testEnv,
    });

    // Verify key structural elements
    expect(tsOutput).toContain(
      '│ #          │ NAME       │ TYPE 1    │ TYPE 2    │ JAPANESE   │ OFFICIAL ROM. │'
    );
    expect(tsOutput).toContain(
      '│ 1          │ Bulbasaur  │ Grass     │ Poison    │ フシギダネ │ Fushigidane   │'
    );
    expect(tsOutput).toContain(
      '│ 25         │ Pikachu    │ Electric  │           │ ピカチュウ │ Pikachu       │'
    );

    // Verify table structure
    const lines = tsOutput.trim().split('\n');
    expect(lines.length).toBeGreaterThan(25); // Should have header + separator + 28 Pokemon rows + borders

    // Verify Japanese character alignment is correct
    const pikachuLine = lines.find((line) => line.includes('Pikachu'));
    expect(pikachuLine).toBeDefined();
    expect(pikachuLine).toMatch(/│ ピカチュウ │/); // Japanese characters should be properly aligned
  });
});
