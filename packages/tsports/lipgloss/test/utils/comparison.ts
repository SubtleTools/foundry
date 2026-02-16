/**
 * Re-export comparison utilities from shared library
 * Plus lipgloss-specific utilities
 */

import { execSync } from 'node:child_process';
import { join } from 'node:path';

// Re-export base comparison utilities from shared library
export {
  compareOutputs,
  formatDifferences,
  compareHexColors,
  normalizeHexColorsInJson,
  compareAnsiRgb,
  normalizeAnsiRgbSequences,
} from '@dev/test-utils/comparison';

export { runTestCase, runBothTestCases } from '@dev/test-utils/execution';

export type {
  ComparisonResult,
  ComparisonDifference,
  ComparisonOptions,
} from '@dev/test-utils/types';

// Re-export golden file utilities from shared library
export {
  requireEqual,
  requireEqualToGo,
  generateGoldenFromGo,
  generateGoldenFromGoCode,
} from '@dev/test-utils/golden';

export type { GoldenOptions } from '@dev/test-utils/golden';

// Re-export table comparison utilities
export {
  compareTableOutputs,
  formatTableDifferences,
  parseTableWithWidths,
  type TableCell,
  type TableComparisonOptions,
  type TableComparisonResult,
  type TableDifference,
  type ParsedTable,
} from './table-comparison.js';

// Lipgloss-specific utilities

/**
 * Run an example (lipgloss-specific)
 */
export function runExample(
  projectRoot: string,
  examplePath: string,
  isGo: boolean = false,
  env: Record<string, string> = {}
): string {
  const fullPath = join(projectRoot, examplePath);
  const command = isGo ? 'go run .' : 'bun run main.ts';

  try {
    return execSync(command, {
      cwd: fullPath,
      encoding: 'utf8',
      env: { ...process.env, ...env },
    });
  } catch (error) {
    throw new Error(`Failed to run example at ${fullPath}: ${error}`);
  }
}

/**
 * Run a test case and validate against golden files
 * This combines the old comparison approach with golden file testing
 */
export function runAndValidateTestCase(
  testFilePath: string,
  testCasePath: string,
  testName: string,
  env: Record<string, string> = {}
): void {
  // Import at runtime to avoid circular dependencies
  const { runTestCase } = require('@dev/test-utils/execution');
  const { requireEqualToGo } = require('@dev/test-utils/golden');

  // Run the TypeScript version
  const tsOutput = runTestCase(testCasePath, false, env);

  // Compare against golden file (which should be generated from Go reference)
  requireEqualToGo(testFilePath, tsOutput, testName);
}

/**
 * Generate golden file from Go reference and validate TypeScript against it
 * Use this when setting up new test cases
 */
export function setupAndValidateTestCase(
  testFilePath: string,
  testCasePath: string,
  goTestCasePath: string,
  testName: string,
  env: Record<string, string> = {}
): void {
  // Import at runtime to avoid circular dependencies
  const { generateGoldenFromGo } = require('@dev/test-utils/golden');

  // Generate golden file from Go reference
  generateGoldenFromGo(testFilePath, goTestCasePath, testName);

  // Run and validate TypeScript version
  runAndValidateTestCase(testFilePath, testCasePath, testName, env);
}
