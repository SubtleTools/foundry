/**
 * Golden file utilities re-exports
 */

// Core golden file testing utilities
export {
  requireEqual,
  requireEqualToGo,
  requireEqualWithProfile,
  generateGoldenFromGo,
  generateGoldenFromGoWithProfile,
  generateGoldenFromGoCode,
  generateGoldenFromGoReference,
  generateGoldenFromGoReferenceWithProfile,
  getColorProfileSuffix,
  escapeSeqs,
  unescapeSeqs,
  normalizeLineBreaks,
} from './golden';

export type { GoldenOptions, GoldenGeneratorConfig } from './golden';

// Golden file setup utilities
export {
  setupGoldenFiles,
  findTestCases,
  defaultShouldSkip,
  DEFAULT_COLOR_PROFILES,
} from './setup';

export type { SetupConfig, TestCase } from './setup';

// Golden file update utilities
export {
  updateGoldenFiles,
  updateSpecificGoldenFiles,
  cleanGoldenFiles,
} from './update';

export type { UpdateConfig } from './update';
