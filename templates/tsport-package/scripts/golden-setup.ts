#!/usr/bin/env bun
/**
 * Golden file setup script
 *
 * Generates golden files from the Go reference implementation
 * for all test cases. Run this when:
 * 1. Setting up the project for the first time
 * 2. The Go reference version is updated
 * 3. New test cases are added
 */

import { setupGoldenFiles } from '@dev/test-utils/golden';

setupGoldenFiles({
  corpusDir: './test/corpus',
}).then(({ failed }) => {
  if (failed > 0) {
    console.log('\nSome golden files failed to generate. Check the errors above.');
    process.exit(1);
  }
}).catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
