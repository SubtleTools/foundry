import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { runTestCase } from './utils/comparison';
import {
  requireEqualWithProfile,
  generateGoldenFromGoReferenceWithProfile,
} from './utils/golden';
import { applyFilter, getTestFilter, logFilterInfo } from './utils/test-filter';

const FILTER = getTestFilter();
const projectRoot = join(__dirname, '..');
const testCasesRoot = join(projectRoot, 'test/corpus');

interface TestCase {
  id: string;
  name: string;
  category: string;
  path: string;
  metadata?: Record<string, unknown>;
}

function discoverTestCases(): TestCase[] {
  const cases: TestCase[] = [];

  const categories = readdirSync(testCasesRoot)
    .filter(item => statSync(join(testCasesRoot, item)).isDirectory())
    .filter(item => !['node_modules', '.git'].includes(item));

  for (const category of categories) {
    const categoryPath = join(testCasesRoot, category);
    const testDirs = readdirSync(categoryPath).filter(item =>
      statSync(join(categoryPath, item)).isDirectory()
    );

    for (const testDir of testDirs) {
      const testPath = join(categoryPath, testDir);
      const goFile = join(testPath, 'case.go');
      const tsFile = join(testPath, 'case.ts');

      try {
        statSync(goFile);
        statSync(tsFile);

        let metadata = {};
        try {
          const metadataFile = join(testPath, 'metadata.json');
          metadata = JSON.parse(readFileSync(metadataFile, 'utf8'));
        } catch {
          // metadata is optional
        }

        cases.push({
          id: testDir,
          name: testDir.replace(/^\d+-/, '').replace(/-/g, ' '),
          category,
          path: testPath,
          metadata,
        });
      } catch {
        // Skip invalid test cases
      }
    }
  }

  return cases.sort((a, b) => a.id.localeCompare(b.id));
}

const allTestCases = discoverTestCases();
const testCases = applyFilter(allTestCases, FILTER);
logFilterInfo(FILTER, allTestCases, testCases, 'test cases');

describe('Automated Compatibility Tests', () => {
  if (testCases.length === 0) {
    test('No test cases found - run example test', () => {
      // This is a placeholder test when no corpus exists yet
      expect(true).toBe(true);
    });
  } else {
    testCases.forEach(testCase => {
      describe(`${testCase.category}/${testCase.id}`, () => {
        test('should match Go output exactly (Ascii - NO_COLOR)', async () => {
          const env = { FORCE_COLOR: '0', NO_COLOR: '1' };
          const tsOutput = runTestCase(testCase.path, false, env);

          try {
            // Use the test case path instead of __filename to look in the corpus directory
            requireEqualWithProfile(
              join(testCase.path, 'case.test.ts'),
              tsOutput,
              testCase.id,
              env
            );
          } catch (error) {
            // If golden file doesn't exist, try to generate it from Go test case
            if (
              error instanceof Error &&
              error.message.includes('Golden file test failed')
            ) {
              console.log(
                `\n⚠️  Golden file test failed for ${testCase.category}/${testCase.id} (Ascii)`
              );
              console.log('Try running: bun run golden:setup');
              throw error;
            }

            // Try to generate golden file from Go case if it exists
            try {
              const goOutput = runTestCase(testCase.path, true, env);
              const goCode = `package main

import (
	"fmt"
	"os"
)

func main() {
	// Generated from test case output (Ascii profile)
	fmt.Print("${goOutput.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}")
}`;

              generateGoldenFromGoReferenceWithProfile(
                join(testCase.path, 'case.test.ts'),
                goCode,
                testCase.id,
                env
              );

              // Now test again
              requireEqualWithProfile(
                join(testCase.path, 'case.test.ts'),
                tsOutput,
                testCase.id,
                env
              );
            } catch (genError) {
              const genErrorMessage =
                genError instanceof Error ? genError.message : String(genError);
              console.log(
                `\n❌ Failed to generate or test golden file for ${testCase.category}/${testCase.id} (Ascii):`,
                genErrorMessage
              );
              throw error;
            }
          }
        }, 30000);

        test('should match Go output exactly (TrueColor - FORCE_COLOR=3)', async () => {
          const env = { FORCE_COLOR: '3' };
          const tsOutput = runTestCase(testCase.path, false, env);

          try {
            // Use the test case path instead of __filename to look in the corpus directory
            requireEqualWithProfile(
              join(testCase.path, 'case.test.ts'),
              tsOutput,
              testCase.id,
              env
            );
          } catch (error) {
            // If golden file doesn't exist, try to generate it from Go test case
            if (
              error instanceof Error &&
              error.message.includes('Golden file test failed')
            ) {
              console.log(
                `\n⚠️  Golden file test failed for ${testCase.category}/${testCase.id} (TrueColor)`
              );
              console.log('Try running: bun run golden:setup');
              throw error;
            }

            // Try to generate golden file from Go case if it exists
            try {
              const goOutput = runTestCase(testCase.path, true, env);
              const goCode = `package main

import (
	"fmt"
	"os"
)

func main() {
	// Force color output (TrueColor profile)
	os.Setenv("FORCE_COLOR", "3")

	// Generated from test case output with TrueColor
	fmt.Print("${goOutput
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')}")
}`;

              generateGoldenFromGoReferenceWithProfile(
                join(testCase.path, 'case.test.ts'),
                goCode,
                testCase.id,
                env
              );

              // Now test again
              requireEqualWithProfile(
                join(testCase.path, 'case.test.ts'),
                tsOutput,
                testCase.id,
                env
              );
            } catch (genError) {
              const genErrorMessage =
                genError instanceof Error ? genError.message : String(genError);
              console.log(
                `\n❌ Failed to generate or test golden file for ${testCase.category}/${testCase.id} (TrueColor):`,
                genErrorMessage
              );
              throw error;
            }
          }
        }, 30000);
      });
    });
  }
});
