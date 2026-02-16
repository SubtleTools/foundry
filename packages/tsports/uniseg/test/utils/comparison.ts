/**
 * Re-export comparison utilities from shared library
 */

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
