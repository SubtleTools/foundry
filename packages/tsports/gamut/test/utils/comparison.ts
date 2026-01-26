/**
 * Re-export comparison utilities from shared library
 */

export {
  compareAnsiRgb,
  compareHexColors,
  compareOutputs,
  formatDifferences,
  normalizeAnsiRgbSequences,
  normalizeHexColorsInJson,
} from '@dev/test-utils/comparison';

export { runBothTestCases, runTestCase } from '@dev/test-utils/execution';

export type {
  ComparisonDifference,
  ComparisonOptions,
  ComparisonResult,
} from '@dev/test-utils/types';
