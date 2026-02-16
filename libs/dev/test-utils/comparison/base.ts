/**
 * Core comparison utilities for test outputs
 */

import type { ComparisonOptions, ComparisonResult } from '../types';
import { compareAnsiRgb } from './ansi';
import { normalizeHexColorsInJson } from './colors';

/**
 * Compare two outputs with optional tolerance for colors and ANSI codes
 */
export function compareOutputs(
  tsOutput: string,
  goOutput: string,
  options: ComparisonOptions = {}
): ComparisonResult {
  const { tolerateHexColors = true, tolerateAnsiRgb = true, maxDifferences = 5 } = options;

  // Fast path: exact match
  if (tsOutput === goOutput) {
    return { match: true, tsOutput, goOutput };
  }

  let normalizedTs = tsOutput;

  // Try normalizing hex colors for JSON outputs
  if (tolerateHexColors) {
    try {
      JSON.parse(tsOutput);
      JSON.parse(goOutput);
      normalizedTs = normalizeHexColorsInJson(tsOutput, goOutput);

      if (normalizedTs === goOutput) {
        return { match: true, tsOutput, goOutput };
      }
    } catch {
      // Not JSON, proceed with other normalizations
    }
  }

  // Try ANSI RGB fuzzy comparison
  if (tolerateAnsiRgb && compareAnsiRgb(normalizedTs, goOutput)) {
    return { match: true, tsOutput, goOutput };
  }

  // Character-by-character comparison with difference reporting
  const differences = [];
  const maxLength = Math.max(normalizedTs.length, goOutput.length);

  for (let i = 0; i < maxLength; i++) {
    const tsChar = normalizedTs[i] || '';
    const goChar = goOutput[i] || '';

    if (tsChar !== goChar) {
      const start = Math.max(0, i - 20);
      const end = Math.min(maxLength, i + 20);

      differences.push({
        position: i,
        tsChar,
        goChar,
        context: {
          ts: normalizedTs.substring(start, end),
          go: goOutput.substring(start, end),
        },
      });

      if (differences.length >= maxDifferences) break;
    }
  }

  return { match: false, tsOutput, goOutput, differences };
}

/**
 * Format comparison differences for display
 */
export function formatDifferences(result: ComparisonResult): string {
  if (result.match) {
    return 'Outputs match';
  }

  const lines: string[] = [];
  lines.push('\nFound differences:');

  for (const diff of result.differences || []) {
    lines.push(`\nPosition ${diff.position}:`);
    lines.push(`  TS char: ${JSON.stringify(diff.tsChar)}`);
    lines.push(`  Go char: ${JSON.stringify(diff.goChar)}`);
    lines.push(`  TS context: ${JSON.stringify(diff.context.ts)}`);
    lines.push(`  Go context: ${JSON.stringify(diff.context.go)}`);
  }

  return lines.join('\n');
}
