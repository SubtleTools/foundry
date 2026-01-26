import { execSync } from 'node:child_process';

export interface ComparisonResult {
  match: boolean;
  tsOutput: string;
  goOutput: string;
  differences?: Array<{
    position: number;
    tsChar: string;
    goChar: string;
    context: { ts: string; go: string };
  }>;
}

export function runTestCase(
  testPath: string,
  isGo: boolean,
  env: Record<string, string> = {}
): string {
  const filename = isGo ? 'case.go' : 'case.ts';
  const command = isGo ? `go run ${filename}` : `bun run ${filename}`;

  try {
    return execSync(command, {
      cwd: testPath,
      encoding: 'utf8',
      env: { ...process.env, ...env },
    }).trim();
  } catch (error) {
    throw new Error(`Failed to run ${isGo ? 'Go' : 'TypeScript'} test case: ${error}`);
  }
}

/**
 * Compare hex colors with tolerance for floating-point precision differences.
 * Accepts up to 1/255 difference per RGB channel (±1 in hex).
 */
function compareHexColors(hex1: string, hex2: string): boolean {
  if (hex1 === hex2) return true;
  if (!hex1.startsWith('#') || !hex2.startsWith('#')) return false;
  if (hex1.length !== 7 || hex2.length !== 7) return false;

  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);

  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);

  // Allow ±1 difference per channel for floating-point tolerance
  return Math.abs(r1 - r2) <= 1 && Math.abs(g1 - g2) <= 1 && Math.abs(b1 - b2) <= 1;
}

/**
 * Normalize JSON by comparing hex colors with tolerance.
 * Replaces similar hex colors in TS output with exact Go values for comparison.
 */
function normalizeColorsForComparison(tsJson: string, goJson: string): string {
  const hexPattern = /#[0-9a-fA-F]{6}/g;
  const goHexes = goJson.match(hexPattern) || [];

  let normalized = tsJson;
  const tsHexes = tsJson.match(hexPattern) || [];

  // Replace TS hex colors with Go hex colors if they're within tolerance
  for (let i = 0; i < Math.min(tsHexes.length, goHexes.length); i++) {
    const tsHex = tsHexes[i];
    const goHex = goHexes[i];
    if (tsHex && goHex && compareHexColors(tsHex, goHex) && tsHex !== goHex) {
      normalized = normalized.replace(tsHex, goHex);
    }
  }

  return normalized;
}

export function compareOutputs(tsOutput: string, goOutput: string): ComparisonResult {
  if (tsOutput === goOutput) {
    return { match: true, tsOutput, goOutput };
  }

  // Try normalizing hex colors for JSON outputs
  let normalizedTs = tsOutput;
  try {
    // Check if both outputs are JSON
    JSON.parse(tsOutput);
    JSON.parse(goOutput);
    normalizedTs = normalizeColorsForComparison(tsOutput, goOutput);

    if (normalizedTs === goOutput) {
      return { match: true, tsOutput, goOutput };
    }
  } catch {
    // Not JSON, proceed with character-by-character comparison
  }

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

      if (differences.length >= 5) break; // Limit differences for readability
    }
  }

  return { match: false, tsOutput, goOutput, differences };
}
