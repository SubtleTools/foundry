/**
 * Re-export golden file utilities from shared library
 */

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
} from '@dev/test-utils/golden';

export type {
  GoldenOptions,
  GoldenGeneratorConfig,
  SetupConfig,
  TestCase,
  UpdateConfig,
} from '@dev/test-utils/golden';
