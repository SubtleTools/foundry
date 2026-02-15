#!/usr/bin/env bun
/**
 * Golden file setup script
 *
 * This script generates golden files from the Go reference implementation
 * for all test cases. Run this when:
 * 1. Setting up the project for the first time
 * 2. The Go reference version is updated
 * 3. New test cases are added
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { generateGoldenFromGoWithProfile } from './golden';

export interface SetupConfig {
  /**
   * Test corpus directory path (default: './test/corpus')
   */
  corpusDir?: string;

  /**
   * Color profiles to generate golden files for
   */
  profiles?: Array<{ env: Record<string, string>; name: string }>;

  /**
   * Function to check if a case should be skipped
   */
  shouldSkip?: (testCase: TestCase, error?: Error) => boolean;
}

export interface TestCase {
  name: string;
  path: string;
  goPath?: string;
}

/**
 * Default color profiles for golden file generation
 */
export const DEFAULT_COLOR_PROFILES = [
  { env: { FORCE_COLOR: '0', NO_COLOR: '1' }, name: 'Ascii' },
  { env: { FORCE_COLOR: '1' }, name: 'ANSI' },
  { env: { FORCE_COLOR: '2' }, name: 'ANSI256' },
  { env: { FORCE_COLOR: '3' }, name: 'TrueColor' },
];

/**
 * Find all test cases in the corpus directory
 */
export function findTestCases(dir: string): TestCase[] {
  const cases: TestCase[] = [];

  function scan(currentDir: string, _relativePath = '') {
    if (!existsSync(currentDir)) return;

    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Check if this directory contains a test case
        const caseFile = join(fullPath, 'case.ts');
        const metadataFile = join(fullPath, 'metadata.json');

        if (existsSync(caseFile) && existsSync(metadataFile)) {
          const testName = basename(fullPath);
          const goFile = join(fullPath, 'case.go');

          const testCase: TestCase = {
            name: testName,
            path: fullPath,
          };

          if (existsSync(goFile)) {
            testCase.goPath = fullPath;
          }

          cases.push(testCase);
        } else {
          // Continue scanning subdirectories
          scan(fullPath, join(_relativePath, item));
        }
      }
    }
  }

  scan(dir);
  return cases;
}

/**
 * Default skip checker for known issues
 */
export function defaultShouldSkip(
  testCase: TestCase,
  error?: Error
): boolean {
  if (!error) return false;

  const errorMessage = error.message;
  return (
    errorMessage.includes('address already in use') ||
    errorMessage.includes('SSH server') ||
    testCase.name.includes('ssh')
  );
}

/**
 * Generate golden files for all test cases
 */
export async function setupGoldenFiles(config: SetupConfig = {}): Promise<{
  generated: number;
  skipped: number;
  failed: number;
}> {
  const {
    corpusDir = './test/corpus',
    profiles = DEFAULT_COLOR_PROFILES,
    shouldSkip = defaultShouldSkip,
  } = config;

  console.log('Scanning for test cases...');

  if (!existsSync(corpusDir)) {
    console.error(`Test corpus directory not found: ${corpusDir}`);
    process.exit(1);
  }

  const testCases = findTestCases(corpusDir);
  console.log(`Found ${testCases.length} test cases`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      if (testCase.goPath && existsSync(join(testCase.goPath, 'case.go'))) {
        console.log(`Generating golden files for ${testCase.name}...`);

        for (const profile of profiles) {
          console.log(`  ${profile.name} profile...`);
          generateGoldenFromGoWithProfile(
            join(testCase.path, 'case.test.ts'), // Mock test file path
            testCase.goPath,
            testCase.name,
            profile.env
          );
        }

        generated++;
      } else {
        console.log(`Skipping ${testCase.name} - no Go reference found`);
        skipped++;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (shouldSkip(testCase, err)) {
        console.log(
          `Skipping ${testCase.name} - requires server setup (${
            err.message.split('\n')[0]
          })`
        );
        skipped++;
      } else {
        console.error(
          `Failed to generate golden file for ${testCase.name}:`,
          err.message
        );
        failed++;
      }
    }
  }

  console.log('\nGolden file setup complete!');
  console.log(
    `Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`
  );

  return { generated, skipped, failed };
}

// Run the setup if this script is executed directly
if (import.meta.main) {
  setupGoldenFiles().then(({ failed }) => {
    if (failed > 0) {
      console.log(
        '\nSome golden files failed to generate. Check the errors above.'
      );
      process.exit(1);
    }
  }).catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

export { generateGoldenFromGoWithProfile };
