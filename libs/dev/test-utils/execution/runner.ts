/**
 * Test case execution utilities
 */

import { execSync } from 'node:child_process';

/**
 * Run a test case (Go or TypeScript) and return its output
 * NOTE: We do NOT trim the output to preserve exact formatting including
 * leading/trailing whitespace which is significant for styled output
 * (e.g., margins in lipgloss)
 */
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
 * Run both Go and TypeScript test cases and return outputs
 */
export function runBothTestCases(
  testPath: string,
  env: Record<string, string> = {}
): { goOutput: string; tsOutput: string } {
  const goOutput = runTestCase(testPath, true, env);
  const tsOutput = runTestCase(testPath, false, env);
  return { goOutput, tsOutput };
}
