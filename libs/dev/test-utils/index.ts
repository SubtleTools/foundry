/**
 * @dev/test-utils - Shared test utilities for TSPorts packages
 *
 * This library provides common testing utilities for all ported packages.
 * Import using the @dev/test-utils path mapping configured in tsconfig.json.
 */

// Configuration
export {
  setToleranceConfig,
  getToleranceConfig,
  resetToleranceConfig,
  defaultTolerance,
  DEFAULT_TOLERANCE,
} from './config';

// Types
export type {
  ComparisonResult,
  ComparisonDifference,
  ComparisonOptions,
  ToleranceConfig,
} from './types';

// Comparison utilities
export {
  compareOutputs,
  formatDifferences,
  compareHexColors,
  normalizeHexColorsInJson,
  compareAnsiRgb,
  normalizeAnsiRgbSequences,
} from './comparison';

// Filtering utilities
export { getTestFilter, applyFilter, logFilterInfo } from './filtering';

// Execution utilities
export { runTestCase, runBothTestCases } from './execution';

// Golden file utilities
export {
  requireEqual,
  requireEqualToGo,
  generateGoldenFromGo,
  generateGoldenFromGoCode,
} from './golden';
export type { GoldenOptions } from './golden';
