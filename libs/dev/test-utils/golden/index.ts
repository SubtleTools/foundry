/**
 * Golden file utilities re-exports
 */

export type { GoldenGeneratorConfig, GoldenOptions } from './golden';
// Core golden file testing utilities
export {
  escapeSeqs,
  generateGoldenFromGo,
  generateGoldenFromGoCode,
  generateGoldenFromGoReference,
  generateGoldenFromGoReferenceWithProfile,
  generateGoldenFromGoWithProfile,
  getColorProfileSuffix,
  normalizeLineBreaks,
  requireEqual,
  requireEqualToGo,
  requireEqualWithProfile,
  unescapeSeqs,
} from './golden';
export type { SetupConfig, TestCase } from './setup';
// Golden file setup utilities
export {
  DEFAULT_COLOR_PROFILES,
  defaultShouldSkip,
  findTestCases,
  setupGoldenFiles,
} from './setup';
export type { UpdateConfig } from './update';
// Golden file update utilities
export {
  cleanGoldenFiles,
  updateGoldenFiles,
  updateSpecificGoldenFiles,
} from './update';
