#!/usr/bin/env bun
/**
 * Golden file update script for lipgloss
 *
 * Regenerates golden files from the Go reference implementation.
 * Use this when the Go reference version is updated or when you want to
 * refresh all golden files.
 */

import { updateGoldenFiles, updateSpecificGoldenFiles } from '@dev/test-utils/golden';

const args = process.argv.slice(2);
const noClean = args.includes('--no-clean');
const specificTests = args.filter(a => !a.startsWith('--'));

if (specificTests.length > 0) {
  updateSpecificGoldenFiles(specificTests, {
    corpusDir: './test/corpus',
    clean: !noClean,
  }).then(({ failed }) => {
    if (failed > 0) {
      process.exit(1);
    }
  });
} else {
  updateGoldenFiles({
    corpusDir: './test/corpus',
    clean: !noClean,
  }).then(({ failed }) => {
    if (failed > 0) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('Update failed:', error);
    process.exit(1);
  });
}
