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

// Path utilities
export { repoRoot, upstreamDir } from './paths';

// Filtering utilities
export { getTestFilter, applyFilter, logFilterInfo } from './filtering';

// Execution utilities
export { runTestCase, runBothTestCases } from './execution';

// Golden file utilities
export {
  // Core testing
  requireEqual,
  requireEqualToGo,
  requireEqualWithProfile,
  // Generation
  generateGoldenFromGo,
  generateGoldenFromGoWithProfile,
  generateGoldenFromGoCode,
  generateGoldenFromGoReference,
  generateGoldenFromGoReferenceWithProfile,
  // Utility functions
  getColorProfileSuffix,
  escapeSeqs,
  unescapeSeqs,
  normalizeLineBreaks,
  // Setup utilities
  setupGoldenFiles,
  findTestCases,
  defaultShouldSkip,
  DEFAULT_COLOR_PROFILES,
  // Update utilities
  updateGoldenFiles,
  updateSpecificGoldenFiles,
  cleanGoldenFiles,
} from './golden';

export type {
  GoldenOptions,
  GoldenGeneratorConfig,
  SetupConfig,
  TestCase,
  UpdateConfig,
} from './golden';
