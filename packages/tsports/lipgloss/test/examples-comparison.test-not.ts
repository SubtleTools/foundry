import { describe, expect, test } from 'bun:test';
import { join } from 'path';
import { runExample } from './utils/comparison';
import {
  requireEqualToGo,
  generateGoldenFromGoReference,
} from './utils/golden';
import { applyFilter, getTestFilter, logFilterInfo } from './utils/test-filter';

const FILTER = getTestFilter();

const projectRoot = join(__dirname, '..');

interface ExampleMapping {
  name: string;
  tsPath: string;
  goPath: string;
  category: string;
}

const examples: ExampleMapping[] = [
  // Table Examples
  {
    name: 'Pokemon Table',
    category: 'table',
    tsPath: 'examples/table/pokemon',
    goPath: 'test/automation/reference/examples/table/pokemon',
  },
  {
    name: 'Chess Table',
    category: 'table',
    tsPath: 'examples/table/chess',
    goPath: 'test/automation/reference/examples/table/chess',
  },
  {
    name: 'Languages Table',
    category: 'table',
    tsPath: 'examples/table/languages',
    goPath: 'test/automation/reference/examples/table/languages',
  },
  {
    name: 'Mindy Table',
    category: 'table',
    tsPath: 'examples/table/mindy',
    goPath: 'test/automation/reference/examples/table/mindy',
  },
  {
    name: 'ANSI Table',
    category: 'table',
    tsPath: 'examples/table/ansi',
    goPath: 'test/automation/reference/examples/table/ansi',
  },

  // Layout Examples
  {
    name: 'Layout Example',
    category: 'layout',
    tsPath: 'examples/layout',
    goPath: 'test/automation/reference/examples/layout',
  },

  // List Examples
  {
    name: 'Simple List',
    category: 'list',
    tsPath: 'examples/list/simple',
    goPath: 'test/automation/reference/examples/list/simple',
  },
  {
    name: 'Roman List',
    category: 'list',
    tsPath: 'examples/list/roman',
    goPath: 'test/automation/reference/examples/list/roman',
  },
  {
    name: 'Grocery List',
    category: 'list',
    tsPath: 'examples/list/grocery',
    goPath: 'test/automation/reference/examples/list/grocery',
  },
  {
    name: 'DuckDuckGoose List',
    category: 'list',
    tsPath: 'examples/list/duckduckgoose',
    goPath: 'test/automation/reference/examples/list/duckduckgoose',
  },
  {
    name: 'Glow List',
    category: 'list',
    tsPath: 'examples/list/glow',
    goPath: 'test/automation/reference/examples/list/glow',
  },
  {
    name: 'Sublist Example',
    category: 'list',
    tsPath: 'examples/list/sublist',
    goPath: 'test/automation/reference/examples/list/sublist',
  },

  // Tree Examples
  {
    name: 'Simple Tree',
    category: 'tree',
    tsPath: 'examples/tree/simple',
    goPath: 'test/automation/reference/examples/tree/simple',
  },
  {
    name: 'Background Tree',
    category: 'tree',
    tsPath: 'examples/tree/background',
    goPath: 'test/automation/reference/examples/tree/background',
  },
  {
    name: 'Files Tree',
    category: 'tree',
    tsPath: 'examples/tree/files',
    goPath: 'test/automation/reference/examples/tree/files',
  },
  {
    name: 'Makeup Tree',
    category: 'tree',
    tsPath: 'examples/tree/makeup',
    goPath: 'test/automation/reference/examples/tree/makeup',
  },
  {
    name: 'Rounded Tree',
    category: 'tree',
    tsPath: 'examples/tree/rounded',
    goPath: 'test/automation/reference/examples/tree/rounded',
  },
  {
    name: 'Styles Tree',
    category: 'tree',
    tsPath: 'examples/tree/styles',
    goPath: 'test/automation/reference/examples/tree/styles',
  },
  {
    name: 'Toggle Tree',
    category: 'tree',
    tsPath: 'examples/tree/toggle',
    goPath: 'test/automation/reference/examples/tree/toggle',
  },

  // SSH Example
  {
    name: 'SSH Example',
    category: 'ssh',
    tsPath: 'examples/ssh',
    goPath: 'test/automation/reference/examples/ssh',
  },
];

// Apply filter to examples
const filteredExamples = applyFilter(examples, FILTER);
logFilterInfo(FILTER, examples, filteredExamples, 'examples');

// Helper function to generate golden file from Go example
function generateGoldenFromExample(
  example: ExampleMapping,
  env: Record<string, string>,
  testName: string
) {
  try {
    const goOutput = runExample(projectRoot, example.goPath, true, env);
    const goCode = `package main

import (
	"fmt"
	"os"
)

func main() {
	// Set environment variables
	${Object.entries(env)
    .map(([key, value]) => `os.Setenv("${key}", "${value}")`)
    .join('\n\t')}
	
	// Generated from ${example.name} example output
	fmt.Print("${goOutput
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')}")
}`;

    generateGoldenFromGoReference(__filename, goCode, testName);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(
      `❌ Failed to generate golden file for ${example.name}:`,
      errorMessage
    );
    return false;
  }
}

describe('Examples Compatibility Tests', () => {
  describe('All Examples with FORCE_COLOR=0', () => {
    filteredExamples.forEach(example => {
      test(`${example.name} should match Go output exactly without colors`, async () => {
        const env = { FORCE_COLOR: '0' };
        const testName = `example_${example.category}_${example.name
          .replace(/\s+/g, '_')
          .toLowerCase()}_no_color`;

        const tsOutput = runExample(projectRoot, example.tsPath, false, env);

        try {
          requireEqualToGo(__filename, tsOutput, testName);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.includes('Golden file test failed')
          ) {
            console.log(`\n⚠️  Golden file test failed for ${example.name}`);
            console.log('Try running: bun run golden:setup');
            throw error;
          }

          // Try to generate golden file from Go example
          if (generateGoldenFromExample(example, env, testName)) {
            requireEqualToGo(__filename, tsOutput, testName);
          } else {
            throw error;
          }
        }
      }, 60000);
    });
  });

  describe('All Examples with NO_COLOR=1', () => {
    filteredExamples.forEach(example => {
      test(`${example.name} should match Go output exactly without colors`, async () => {
        const env = { NO_COLOR: '1' };
        const testName = `example_${example.category}_${example.name
          .replace(/\s+/g, '_')
          .toLowerCase()}_no_color_env`;

        const tsOutput = runExample(projectRoot, example.tsPath, false, env);

        try {
          requireEqualToGo(__filename, tsOutput, testName);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.includes('Golden file test failed')
          ) {
            console.log(
              `\n⚠️  Golden file test failed for ${example.name} with NO_COLOR`
            );
            console.log('Try running: bun run golden:setup');
            throw error;
          }

          // Try to generate golden file from Go example
          if (generateGoldenFromExample(example, env, testName)) {
            requireEqualToGo(__filename, tsOutput, testName);
          } else {
            throw error;
          }
        }
      }, 60000);
    });
  });

  describe('Examples by Category with FORCE_COLOR=3', () => {
    const categories = Array.from(new Set(examples.map(e => e.category)));

    categories.forEach(category => {
      describe(`${
        category.charAt(0).toUpperCase() + category.slice(1)
      } Examples`, () => {
        const categoryExamples = filteredExamples.filter(
          e => e.category === category
        );

        categoryExamples.forEach(example => {
          test(`${example.name} should match Go output exactly with colors`, async () => {
            const env = { FORCE_COLOR: '3' };
            const testName = `example_${example.category}_${example.name
              .replace(/\s+/g, '_')
              .toLowerCase()}_color`;

            const tsOutput = runExample(
              projectRoot,
              example.tsPath,
              false,
              env
            );

            try {
              requireEqualToGo(__filename, tsOutput, testName);
            } catch (error) {
              if (
                error instanceof Error &&
                error.message.includes('Golden file test failed')
              ) {
                console.log(
                  `\n⚠️  Golden file test failed for ${example.name} with color`
                );
                console.log('Try running: bun run golden:setup');
                throw error;
              }

              // Try to generate golden file from Go example
              if (generateGoldenFromExample(example, env, testName)) {
                requireEqualToGo(__filename, tsOutput, testName);
              } else {
                throw error;
              }
            }
          }, 60000);

          test(`${example.name} should produce consistent output between runs`, async () => {
            const env = { FORCE_COLOR: '3' };

            const output1 = runExample(projectRoot, example.tsPath, false, env);
            const output2 = runExample(projectRoot, example.tsPath, false, env);

            expect(output1).toBe(output2);
          });
        });
      });
    });
  });

  describe('Critical Examples - High Precision Tests', () => {
    // Focus on examples most likely to have visual formatting differences
    const criticalExamples = filteredExamples.filter(e =>
      ['Pokemon Table', 'Layout Example', 'Simple Tree'].includes(e.name)
    );

    criticalExamples.forEach(example => {
      test(`${example.name} should match Go output exactly (critical test)`, async () => {
        const env = { FORCE_COLOR: '3' };
        const testName = `critical_${example.category}_${example.name
          .replace(/\s+/g, '_')
          .toLowerCase()}`;

        const tsOutput = runExample(projectRoot, example.tsPath, false, env);

        try {
          requireEqualToGo(__filename, tsOutput, testName);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.includes('Golden file test failed')
          ) {
            console.log(
              `\n⚠️  Critical golden file test failed for ${example.name}`
            );
            console.log(
              'This is a high-precision test for complex visual output.'
            );
            console.log('Try running: bun run golden:setup');
            throw error;
          }

          // Try to generate golden file from Go example
          if (generateGoldenFromExample(example, env, testName)) {
            requireEqualToGo(__filename, tsOutput, testName);
          } else {
            throw error;
          }
        }
      }, 60000);
    });
  });
});
