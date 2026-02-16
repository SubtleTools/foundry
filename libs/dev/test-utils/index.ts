/**
 * @dev/test-utils - Shared test utilities for TSPorts packages
 *
 * This library provides common testing utilities for all ported packages.
 * Import using the @dev/test-utils path mapping configured in tsconfig.json.
 */

// Comparison utilities
export {
  compareAnsiRgb,
  compareHexColors,
  compareOutputs,
  formatDifferences,
  normalizeAnsiRgbSequences,
  normalizeHexColorsInJson,
} from './comparison';
// Configuration
export {
  DEFAULT_TOLERANCE,
  defaultTolerance,
  getToleranceConfig,
  resetToleranceConfig,
  setToleranceConfig,
} from './config';
// Execution utilities
export { runBothTestCases, runTestCase } from './execution';
// Filtering utilities
export { applyFilter, getTestFilter, logFilterInfo } from './filtering';
export type {
  GoldenGeneratorConfig,
  GoldenOptions,
  SetupConfig,
  TestCase,
  UpdateConfig,
} from './golden';
// Golden file utilities
export {
  cleanGoldenFiles,
  DEFAULT_COLOR_PROFILES,
  defaultShouldSkip,
  escapeSeqs,
  findTestCases,
  // Generation
  generateGoldenFromGo,
  generateGoldenFromGoCode,
  generateGoldenFromGoReference,
  generateGoldenFromGoReferenceWithProfile,
  generateGoldenFromGoWithProfile,
  // Utility functions
  getColorProfileSuffix,
  normalizeLineBreaks,
  // Core testing
  requireEqual,
  requireEqualToGo,
  requireEqualWithProfile,
  // Setup utilities
  setupGoldenFiles,
  unescapeSeqs,
  // Update utilities
  updateGoldenFiles,
  updateSpecificGoldenFiles,
} from './golden';
// Path utilities
export { repoRoot, upstreamDir } from './paths';
// Types
export type {
  ComparisonDifference,
  ComparisonOptions,
  ComparisonResult,
  ToleranceConfig,
} from './types';
