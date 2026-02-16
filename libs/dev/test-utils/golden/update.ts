#!/usr/bin/env bun

/**
 * Golden file update script
 *
 * This script regenerates golden files from the Go reference implementation.
 * Use this when the Go reference version is updated or when you want to
 * refresh all golden files.
 */

import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { findTestCases, type SetupConfig, setupGoldenFiles, type TestCase } from './setup';

export interface UpdateConfig extends SetupConfig {
  /**
   * Whether to clean existing golden files before regenerating
   */
  clean?: boolean;
}

/**
 * Remove all existing golden files in a directory tree
 */
export function cleanGoldenFiles(dir: string): number {
  let removed = 0;

  function scanAndRemove(currentDir: string) {
    if (!existsSync(currentDir)) return;

    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scanAndRemove(fullPath);
      } else if (item.endsWith('.golden')) {
        console.log(`Removing ${fullPath}`);
        unlinkSync(fullPath);
        removed++;
      }
    }
  }

  scanAndRemove(dir);
  return removed;
}

/**
 * Update all golden files
 */
export async function updateGoldenFiles(config: UpdateConfig = {}): Promise<{
  cleaned: number;
  generated: number;
  skipped: number;
  failed: number;
}> {
  const { clean = true, corpusDir = './test/corpus', ...setupConfig } = config;

  console.log('Updating golden files from Go reference...');

  let cleaned = 0;

  // Clean existing golden files if requested
  if (clean && existsSync(corpusDir)) {
    console.log('Cleaning existing golden files...');
    cleaned = cleanGoldenFiles(corpusDir);
    console.log(`Removed ${cleaned} golden files`);
  }

  // Generate new golden files
  const { generated, skipped, failed } = await setupGoldenFiles({
    corpusDir,
    ...setupConfig,
  });

  console.log('\nGolden files updated successfully!');

  return { cleaned, generated, skipped, failed };
}

/**
 * Update golden files for specific test cases only
 */
export async function updateSpecificGoldenFiles(
  testNames: string[],
  config: UpdateConfig = {}
): Promise<{
  updated: number;
  skipped: number;
  failed: number;
}> {
  const { corpusDir = './test/corpus', profiles, shouldSkip } = config;

  console.log(`Updating golden files for: ${testNames.join(', ')}`);

  const allCases = findTestCases(corpusDir);
  const targetCases = allCases.filter((c) => testNames.includes(c.name));

  if (targetCases.length === 0) {
    console.log('No matching test cases found');
    return { updated: 0, skipped: testNames.length, failed: 0 };
  }

  // Run setup with filtered cases - only pass defined options
  const setupConfig: SetupConfig = { corpusDir };
  if (profiles !== undefined) setupConfig.profiles = profiles;
  if (shouldSkip !== undefined) setupConfig.shouldSkip = shouldSkip;

  const result = await setupGoldenFiles(setupConfig);

  return {
    updated: result.generated,
    skipped: result.skipped,
    failed: result.failed,
  };
}

// Run the update if this script is executed directly
if (import.meta.main) {
  const args = process.argv.slice(2);
  const noClean = args.includes('--no-clean');
  const specificTests = args.filter((a) => !a.startsWith('--'));

  if (specificTests.length > 0) {
    updateSpecificGoldenFiles(specificTests, { clean: !noClean }).then(({ failed }) => {
      if (failed > 0) {
        process.exit(1);
      }
    });
  } else {
    updateGoldenFiles({ clean: !noClean })
      .then(({ failed }) => {
        if (failed > 0) {
          process.exit(1);
        }
      })
      .catch((error) => {
        console.error('Update failed:', error);
        process.exit(1);
      });
  }
}

export { findTestCases, type TestCase };
