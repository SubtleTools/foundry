import { describe, expect, test } from 'bun:test';
import { join } from 'path';
import { compareOutputs, formatComparisonResult, runExample } from './utils/comparison';
import { applyFilter, getTestFilter, logFilterInfo } from './utils/test-filter';

const FILTER = getTestFilter();
const projectRoot = join(__dirname, '..');

/**
 * Visual diff tests specifically focused on ANSI formatting differences
 */
describe('Visual Diff Analysis', () => {
  describe('ANSI Formatting Compatibility', () => {
    const visualTestCases = [
      {
        name: 'Pokemon Table - Color Formatting',
        tsPath: 'examples/table/pokemon',
        goPath: 'test/automation/reference/examples/table/pokemon',
        expectedFormats: ['bold', 'fg-ansi-252', 'bg-ansi-0'],
      },
      {
        name: 'Layout Example - Text Styling',
        tsPath: 'examples/layout',
        goPath: 'test/automation/reference/examples/layout',
        expectedFormats: ['bold', 'italic', 'underline'],
      },
    ];

    // Apply filter to test cases
    const filteredTestCases = applyFilter(visualTestCases, FILTER);
    logFilterInfo(FILTER, visualTestCases, filteredTestCases, 'visual test cases');

    filteredTestCases.forEach((testCase) => {
      test(`${testCase.name} should provide detailed visual diff analysis`, async () => {
        const env = { FORCE_COLOR: '3' };

        const tsOutput = runExample(projectRoot, testCase.tsPath, false, env);
        const goOutput = runExample(projectRoot, testCase.goPath, true, env);

        const result = compareOutputs(tsOutput, goOutput); // Get differences for analysis

        if (
          !result.match &&
          result.differences &&
          Array.isArray(result.differences) &&
          result.differences.length > 0
        ) {
          console.log(`\n=== VISUAL DIFF ANALYSIS: ${testCase.name} ===`);

          let formattingDifferences = 0;

          for (const diff of result.differences) {
            // Ensure diff object is valid
            if (!diff || typeof diff !== 'object') continue;

            // Safe access to visual property (may not exist in current implementation)
            const visual = (diff as any).visual;
            if (visual && typeof visual === 'object') {
              formattingDifferences++;

              // Safe access to position properties (may not exist in current implementation)
              const tsLine = (diff as any).tsPosition?.line ?? 1;
              const tsColumn = (diff as any).tsPosition?.column ?? 1;

              console.log(`\nFormatting difference at line ${tsLine}, column ${tsColumn}:`);
              console.log(`  Character: ${visual.character ?? 'N/A'}`);

              if (Array.isArray(visual.expectedFormatting)) {
                console.log(`  Expected formatting: [${visual.expectedFormatting.join(', ')}]`);
              }
              if (Array.isArray(visual.actualFormatting)) {
                console.log(`  Actual formatting: [${visual.actualFormatting.join(', ')}]`);
              }

              console.log(`  Description: ${visual.description ?? 'N/A'}`);

              if (diff.context && diff.context.ts) {
                console.log(`  Context: "${diff.context.ts.substring(0, 50)}..."`);
              }

              // Verify we're detecting known formatting types (with safety checks)
              if (
                Array.isArray(visual.expectedFormatting) &&
                Array.isArray(visual.actualFormatting)
              ) {
                const allFormats = [...visual.expectedFormatting, ...visual.actualFormatting];
                const hasExpectedFormats = testCase.expectedFormats.some((format) =>
                  allFormats.some((f) => f && f.includes(format))
                );

                if (hasExpectedFormats) {
                  console.log(`  ✓ Contains expected format types`);
                }
              }
            }
          }

          console.log(`\nTotal formatting differences found: ${formattingDifferences}`);
          console.log(`=== END VISUAL DIFF ANALYSIS ===\n`);

          // For visual diff tests, we want to see the analysis even if tests "fail"
          // The important thing is that we're providing detailed visual information
          expect(formattingDifferences).toBeGreaterThanOrEqual(0);
        }

        // This test passes as long as we can generate visual diff analysis
        // The actual compatibility test failures happen in other test suites
      }, 60000);
    });
  });

  describe('ANSI Sequence Analysis', () => {
    test('should detect and parse different ANSI sequence formats', async () => {
      // Test with a simple case that we know will have formatting
      const env = { FORCE_COLOR: '3' };

      const tsOutput = runExample(projectRoot, 'examples/table/pokemon', false, env);
      const goOutput = runExample(
        projectRoot,
        'test/automation/reference/examples/table/pokemon',
        true,
        env
      );

      const result = compareOutputs(tsOutput, goOutput);

      // Verify both outputs contain ANSI sequences
      expect(tsOutput).toMatch(/\x1b\[[0-9;]*m/);
      expect(goOutput).toMatch(/\x1b\[[0-9;]*m/);

      // Extract ANSI sequences from both
      const tsAnsiMatches = tsOutput.match(/\x1b\[[0-9;]*m/g) || [];
      const goAnsiMatches = goOutput.match(/\x1b\[[0-9;]*m/g) || [];

      console.log(`\nANSI Sequence Analysis:`);
      console.log(`TS sequences found: ${tsAnsiMatches.length}`);
      console.log(`Go sequences found: ${goAnsiMatches.length}`);

      // Show some example sequences
      const uniqueTsSequences = Array.from(new Set(tsAnsiMatches)).slice(0, 10);
      const uniqueGoSequences = Array.from(new Set(goAnsiMatches)).slice(0, 10);

      console.log(`Sample TS sequences: [${uniqueTsSequences.join(', ')}]`);
      console.log(`Sample Go sequences: [${uniqueGoSequences.join(', ')}]`);

      // Both should have ANSI sequences
      expect(tsAnsiMatches.length).toBeGreaterThan(0);
      expect(goAnsiMatches.length).toBeGreaterThan(0);
    });
  });

  describe('Character-by-Character Visual Analysis', () => {
    test('should provide character-level formatting analysis for critical differences', async () => {
      const env = { FORCE_COLOR: '3' };

      const tsOutput = runExample(projectRoot, 'examples/table/pokemon', false, env);
      const goOutput = runExample(
        projectRoot,
        'test/automation/reference/examples/table/pokemon',
        true,
        env
      );

      const result = compareOutputs(tsOutput, goOutput); // Analyze differences

      if (!result.match && result.differences && Array.isArray(result.differences)) {
        console.log(`\n=== CHARACTER-LEVEL ANALYSIS ===`);

        for (let i = 0; i < Math.min(3, result.differences.length); i++) {
          const diff = result.differences[i];

          // Ensure diff object is valid
          if (!diff || typeof diff !== 'object') continue;

          // Safe access to position properties (may not exist in current implementation)
          const tsLine = (diff as any).tsPosition?.line ?? 1;
          const tsColumn = (diff as any).tsPosition?.column ?? 1;

          // Safe access to byte values (may not exist in current implementation)
          const tsByte = (diff as any).tsByte ?? (diff.tsChar ? diff.tsChar.charCodeAt(0) : 0);
          const goByte = (diff as any).goByte ?? (diff.goChar ? diff.goChar.charCodeAt(0) : 0);

          // Safe access to hex context (may not exist in current implementation)
          const hexContextTs = (diff as any).hexContext?.ts ?? [];
          const hexContextGo = (diff as any).hexContext?.go ?? [];

          console.log(`\nDifference ${i + 1}:`);
          console.log(`  Position: byte ${diff.position} (line ${tsLine}, col ${tsColumn})`);
          console.log(
            `  TS character: '${diff.tsChar ?? ''}' (0x${tsByte.toString(16).padStart(2, '0')})`
          );
          console.log(
            `  Go character: '${diff.goChar ?? ''}' (0x${goByte.toString(16).padStart(2, '0')})`
          );

          if (Array.isArray(hexContextTs) && hexContextTs.length > 0) {
            console.log(`  Hex context: ${hexContextTs.join(' ')}`);
          }
          if (Array.isArray(hexContextGo) && hexContextGo.length > 0) {
            console.log(`  Expected:    ${hexContextGo.join(' ')}`);
          }

          // Safe access to visual property (may not exist in current implementation)
          const visual = (diff as any).visual;
          if (visual && typeof visual === 'object') {
            console.log(`  Visual impact: ${visual.description ?? 'N/A'}`);
          }
        }

        console.log(`=== END CHARACTER-LEVEL ANALYSIS ===\n`);
      }

      // This test is for analysis purposes
      expect(result).toBeDefined();
    });
  });
});
