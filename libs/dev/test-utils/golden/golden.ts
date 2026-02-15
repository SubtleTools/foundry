/**
 * Golden file testing utility for TypeScript ports of Go libraries
 *
 * This utility compares TypeScript output against golden files generated
 * by the Go reference implementation. Golden files should only be updated
 * when the Go reference version changes.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';

export interface GoldenOptions {
  /**
   * Whether to update golden files (equivalent to -update flag in Go)
   */
  update?: boolean;

  /**
   * Custom golden file extension (default: '.golden')
   */
  extension?: string;

  /**
   * Custom golden files directory (relative to test file)
   */
  goldenDir?: string;
}

export interface GoldenGeneratorConfig {
  /**
   * Path to the Go reference module (for go.mod replace directive)
   */
  goModulePath?: string;

  /**
   * Go module name to use in replace directive
   */
  goModuleName?: string;

  /**
   * Base directory for temporary Go files
   */
  tempBaseDir?: string;
}

/**
 * Minimal diff implementation for unified diff patches
 */
function getDiffModule() {
  return {
    diffLines: (oldStr: string, newStr: string) => {
      if (oldStr === newStr) return [];
      const oldLines = oldStr.split('\n');
      const newLines = newStr.split('\n');
      const result: any[] = [];

      const maxLines = Math.max(oldLines.length, newLines.length);
      for (let i = 0; i < maxLines; i++) {
        const oldLine = oldLines[i];
        const newLine = newLines[i];

        if (oldLine === undefined) {
          result.push({ added: true, removed: false, value: newLine + '\n' });
        } else if (newLine === undefined) {
          result.push({ added: false, removed: true, value: oldLine + '\n' });
        } else if (oldLine !== newLine) {
          result.push({ added: false, removed: true, value: oldLine + '\n' });
          result.push({ added: true, removed: false, value: newLine + '\n' });
        } else {
          result.push({ added: false, removed: false, value: oldLine + '\n' });
        }
      }

      return result;
    },

    createTwoFilesPatch: (
      oldFileName: string,
      newFileName: string,
      oldStr: string,
      newStr: string,
      oldHeader?: string,
      newHeader?: string,
      options?: { context?: number }
    ) => {
      if (oldStr === newStr) return '';

      const context = options?.context || 3;
      const oldLines = oldStr.split('\n');
      const newLines = newStr.split('\n');

      let diff = `--- ${oldHeader || oldFileName}\n`;
      diff += `+++ ${newHeader || newFileName}\n`;

      const maxLines = Math.max(oldLines.length, newLines.length);
      let oldLineNum = 1;
      let newLineNum = 1;
      let hunkStart = -1;
      let hunkLines: string[] = [];

      for (let i = 0; i < maxLines; i++) {
        const oldLine = oldLines[i];
        const newLine = newLines[i];

        if (oldLine === undefined) {
          if (hunkStart === -1) hunkStart = Math.max(1, oldLineNum - context);
          hunkLines.push(`+${newLine || ''}`);
          newLineNum++;
        } else if (newLine === undefined) {
          if (hunkStart === -1) hunkStart = Math.max(1, oldLineNum - context);
          hunkLines.push(`-${oldLine || ''}`);
          oldLineNum++;
        } else if (oldLine !== newLine) {
          if (hunkStart === -1) hunkStart = Math.max(1, oldLineNum - context);
          hunkLines.push(`-${oldLine || ''}`);
          hunkLines.push(`+${newLine || ''}`);
          oldLineNum++;
          newLineNum++;
        } else {
          if (hunkStart !== -1) {
            hunkLines.push(` ${oldLine || ''}`);
          }
          oldLineNum++;
          newLineNum++;
        }
      }

      if (hunkLines.length > 0) {
        const hunkOldCount = oldLines.length;
        const hunkNewCount = newLines.length;
        diff += `@@ -${hunkStart},${hunkOldCount} +${hunkStart},${hunkNewCount} @@\n`;
        diff += hunkLines.join('\n') + '\n';
      }

      return diff;
    },
  };
}

/**
 * Get the test name from the current test context
 */
function getTestName(): string {
  const globalExpect = (globalThis as any).expect;
  if (typeof globalExpect !== 'undefined' && globalExpect.getState) {
    const state = globalExpect.getState();
    return (state.currentTestName as string) || 'UnknownTest';
  }

  const stack = new Error().stack;
  if (stack) {
    const match = stack.match(/at (?:Object\.)?(\w+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return 'UnknownTest';
}

/**
 * Escape control sequences for comparison
 */
export function escapeSeqs(s: string): string {
  return (
    s
      .replace(/\x1b/g, '\\x1b')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
  );
}

/**
 * Unescape control sequences from golden file
 */
export function unescapeSeqs(s: string): string {
  return s
    .replace(/\\x1b/g, '\x1b')
    .replace(/\\r/g, '\r')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');
}

/**
 * Normalize line breaks to Unix format
 */
export function normalizeLineBreaks(s: string): string {
  return s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Get the golden file path for a test
 */
function getGoldenFilePath(
  testFilePath: string,
  testName: string,
  options: GoldenOptions = {}
): string {
  const { extension = '.golden', goldenDir = 'testdata' } = options;
  const testDir = dirname(testFilePath);
  const goldenDirPath = join(testDir, goldenDir);
  return join(goldenDirPath, `${testName}${extension}`);
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get color profile suffix from environment variables
 * Maps environment variables to semantic profile names for golden files
 */
export function getColorProfileSuffix(env: Record<string, string> = {}): string {
  // Check for NO_COLOR (Ascii profile)
  if (env.NO_COLOR === '1' || env.FORCE_COLOR === '0') {
    return 'ascii';
  }

  // Check for FORCE_COLOR levels
  const forceColor = env.FORCE_COLOR;
  if (forceColor === '3') {
    return 'truecolor'; // 24-bit RGB
  }
  if (forceColor === '2') {
    return 'ansi256'; // 256 colors
  }
  if (forceColor === '1') {
    return 'ansi'; // 16 colors
  }

  // Default to TrueColor for testing consistency
  return 'truecolor';
}

/**
 * Get the golden file path with color profile suffix
 */
function getGoldenFilePathWithProfile(
  testFilePath: string,
  testName: string,
  env: Record<string, string> = {},
  options: GoldenOptions = {}
): string {
  const { extension = '.golden', goldenDir = 'testdata' } = options;
  const profileSuffix = getColorProfileSuffix(env);
  const testDir = dirname(testFilePath);
  const goldenDirPath = join(testDir, goldenDir);
  return join(goldenDirPath, `${testName}_${profileSuffix}${extension}`);
}

/**
 * Compare actual output against golden file
 */
export function requireEqual(
  testFilePath: string,
  actual: string | Uint8Array,
  testName?: string,
  options: GoldenOptions = {}
): void {
  const actualStr =
    typeof actual === 'string' ? actual : Buffer.from(actual).toString('utf8');
  const normalizedActual = normalizeLineBreaks(actualStr);
  const finalTestName = testName || getTestName();

  const goldenPath = getGoldenFilePath(testFilePath, finalTestName, options);
  const goldenDir = dirname(goldenPath);

  ensureDir(goldenDir);

  if (!existsSync(goldenPath) || options.update) {
    const escapedOutput = escapeSeqs(normalizedActual);
    writeFileSync(goldenPath, escapedOutput, 'utf8');

    if (!existsSync(goldenPath)) {
      console.log(`Created golden file: ${goldenPath}`);
    } else {
      console.log(`Updated golden file: ${goldenPath}`);
    }
    return;
  }

  const fixedGoldenPath = `${goldenPath}.fixed`;
  const useFixed = existsSync(fixedGoldenPath);
  const pathRead = useFixed ? fixedGoldenPath : goldenPath;

  const expectedEscaped = readFileSync(pathRead, 'utf8');
  const expected = unescapeSeqs(expectedEscaped);

  const normalizedExpected = normalizeLineBreaks(expected);

  if (normalizedActual === normalizedExpected) {
    return;
  }

  const { createTwoFilesPatch } = getDiffModule();
  const diff = createTwoFilesPatch(
    `${finalTestName}.golden`,
    `${finalTestName}.actual`,
    normalizedExpected,
    normalizedActual,
    undefined,
    undefined,
    { context: 3 }
  );

  throw new Error(`Golden file test failed for ${finalTestName}:\n\n${diff}`);
}

/**
 * Compare actual output against golden file with semantic color profile naming
 * This uses the environment variables to determine the appropriate golden file.
 */
export function requireEqualWithProfile(
  testFilePath: string,
  actual: string | Uint8Array,
  testName: string,
  env: Record<string, string> = {},
  options: GoldenOptions = {}
): void {
  const actualStr =
    typeof actual === 'string' ? actual : Buffer.from(actual).toString('utf8');
  const normalizedActual = normalizeLineBreaks(actualStr);

  const goldenPath = getGoldenFilePathWithProfile(testFilePath, testName, env, options);
  const goldenDir = dirname(goldenPath);

  ensureDir(goldenDir);

  if (!existsSync(goldenPath) || options.update) {
    const escapedOutput = escapeSeqs(normalizedActual);
    writeFileSync(goldenPath, escapedOutput, 'utf8');

    if (!existsSync(goldenPath)) {
      console.log(`Created golden file: ${goldenPath}`);
    } else {
      console.log(`Updated golden file: ${goldenPath}`);
    }
    return;
  }

  const fixedGoldenPath = `${goldenPath}.fixed`;
  const useFixed = existsSync(fixedGoldenPath);
  const pathRead = useFixed ? fixedGoldenPath : goldenPath;

  const expectedEscaped = readFileSync(pathRead, 'utf8');
  const expected = unescapeSeqs(expectedEscaped);

  const normalizedExpected = normalizeLineBreaks(expected);

  if (normalizedActual === normalizedExpected) {
    return;
  }

  const { createTwoFilesPatch } = getDiffModule();
  const profileSuffix = getColorProfileSuffix(env);
  const diff = createTwoFilesPatch(
    `${testName}_${profileSuffix}.golden`,
    `${testName}_${profileSuffix}.actual`,
    normalizedExpected,
    normalizedActual,
    undefined,
    undefined,
    { context: 3 }
  );

  throw new Error(`Golden file test failed for ${testName} (${profileSuffix}):\n\n${diff}`);
}

/**
 * Generate golden file from Go reference implementation
 */
export function generateGoldenFromGo(
  testFilePath: string,
  goTestCasePath: string,
  testName?: string,
  options: GoldenOptions = {}
): void {
  const finalTestName = testName || getTestName();

  try {
    const goOutput = execSync('go run case.go', {
      cwd: goTestCasePath,
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: process.env.FORCE_COLOR || '1' },
    }).trim();

    const goldenPath = getGoldenFilePath(testFilePath, finalTestName, options);
    const goldenDir = dirname(goldenPath);

    ensureDir(goldenDir);

    const normalizedOutput = normalizeLineBreaks(goOutput);
    const escapedOutput = escapeSeqs(normalizedOutput);

    writeFileSync(goldenPath, escapedOutput, 'utf8');
    console.log(`Generated golden file from Go reference: ${goldenPath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to generate golden file from Go reference: ${errorMessage}`
    );
  }
}

/**
 * Generate golden file from Go code snippet
 */
export function generateGoldenFromGoCode(
  testFilePath: string,
  goCode: string,
  testName?: string,
  options: GoldenOptions = {},
  config: GoldenGeneratorConfig = {}
): void {
  const finalTestName = testName || getTestName();
  const {
    goModulePath = '../',
    goModuleName = 'github.com/example/module',
    tempBaseDir = './.tmp',
  } = config;

  const tempDirName = `temp_golden_${Date.now()}`;
  const tempDir = join(tempBaseDir, tempDirName);
  const tempFileName = 'main.go';
  const tempFilePath = join(tempDir, tempFileName);

  try {
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(tempFilePath, goCode);

    const goModContent = `module temptest

go 1.21

replace ${goModuleName} => ${goModulePath}

require ${goModuleName} v0.0.0-00010101000000-000000000000
`;
    writeFileSync(join(tempDir, 'go.mod'), goModContent);

    execSync('go mod tidy', {
      cwd: tempDir,
      env: { ...process.env },
    });

    const goOutput = execSync(`go run ${tempFileName}`, {
      cwd: tempDir,
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: process.env.FORCE_COLOR || '1' },
    }).trim();

    const goldenPath = getGoldenFilePath(testFilePath, finalTestName, options);
    const goldenDir = dirname(goldenPath);

    ensureDir(goldenDir);

    const normalizedOutput = normalizeLineBreaks(goOutput);
    const escapedOutput = escapeSeqs(normalizedOutput);

    writeFileSync(goldenPath, escapedOutput, 'utf8');
    console.log(`Generated golden file from Go reference: ${goldenPath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to generate golden file from Go reference: ${errorMessage}`
    );
  } finally {
    if (existsSync(tempDir)) {
      const { rmSync } = require('fs');
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

/**
 * Convenience function for testing TypeScript against Go golden files
 */
export function requireEqualToGo(
  testFilePath: string,
  tsOutput: string | Uint8Array,
  testName?: string,
  options: GoldenOptions = {}
): void {
  requireEqual(testFilePath, tsOutput, testName, options);
}

/**
 * Generate golden file from Go reference implementation with color profile
 */
export function generateGoldenFromGoWithProfile(
  testFilePath: string,
  goTestCasePath: string,
  testName: string,
  env: Record<string, string> = {},
  options: GoldenOptions = {}
): void {
  try {
    const goOutput = execSync('go run case.go', {
      cwd: goTestCasePath,
      encoding: 'utf8',
      env: { ...process.env, ...env },
    }).trim();

    const goldenPath = getGoldenFilePathWithProfile(testFilePath, testName, env, options);
    const goldenDir = dirname(goldenPath);

    ensureDir(goldenDir);

    const normalizedOutput = normalizeLineBreaks(goOutput);
    const escapedOutput = escapeSeqs(normalizedOutput);

    writeFileSync(goldenPath, escapedOutput, 'utf8');
    const profileSuffix = getColorProfileSuffix(env);
    console.log(`Generated golden file from Go reference (${profileSuffix}): ${goldenPath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to generate golden file from Go reference: ${errorMessage}`
    );
  }
}

/**
 * Generate golden file from Go code snippet with color profile
 */
export function generateGoldenFromGoReferenceWithProfile(
  testFilePath: string,
  goCode: string,
  testName: string,
  env: Record<string, string> = {},
  options: GoldenOptions = {},
  config: GoldenGeneratorConfig = {}
): void {
  const {
    goModulePath = '../',
    goModuleName = 'github.com/example/module',
    tempBaseDir = './.tmp',
  } = config;

  const tempDirName = `temp_golden_${Date.now()}`;
  const tempDir = join(tempBaseDir, tempDirName);
  const tempFileName = 'main.go';
  const tempFilePath = join(tempDir, tempFileName);

  try {
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(tempFilePath, goCode);

    const goModContent = `module temptest

go 1.21

replace ${goModuleName} => ${goModulePath}

require ${goModuleName} v0.0.0-00010101000000-000000000000
`;
    writeFileSync(join(tempDir, 'go.mod'), goModContent);

    execSync('go mod tidy', {
      cwd: tempDir,
      env: { ...process.env },
    });

    const goOutput = execSync(`go run ${tempFileName}`, {
      cwd: tempDir,
      encoding: 'utf8',
      env: { ...process.env, ...env },
    }).trim();

    const goldenPath = getGoldenFilePathWithProfile(testFilePath, testName, env, options);
    const goldenDir = dirname(goldenPath);

    ensureDir(goldenDir);

    const normalizedOutput = normalizeLineBreaks(goOutput);
    const escapedOutput = escapeSeqs(normalizedOutput);

    writeFileSync(goldenPath, escapedOutput, 'utf8');
    const profileSuffix = getColorProfileSuffix(env);
    console.log(`Generated golden file from Go reference (${profileSuffix}): ${goldenPath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to generate golden file from Go reference: ${errorMessage}`
    );
  } finally {
    if (existsSync(tempDir)) {
      const { rmSync } = require('fs');
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

/**
 * Alias for generateGoldenFromGoCode for backward compatibility
 * @deprecated Use generateGoldenFromGoCode instead
 */
export const generateGoldenFromGoReference = generateGoldenFromGoCode;

export default {
  requireEqual,
  requireEqualToGo,
  requireEqualWithProfile,
  generateGoldenFromGo,
  generateGoldenFromGoWithProfile,
  generateGoldenFromGoCode,
  generateGoldenFromGoReference,
  generateGoldenFromGoReferenceWithProfile,
  getColorProfileSuffix,
  escapeSeqs,
  unescapeSeqs,
  normalizeLineBreaks,
};
