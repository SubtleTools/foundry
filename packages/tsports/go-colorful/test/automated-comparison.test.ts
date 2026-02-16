import { describe, expect, test } from 'bun:test';
import { exec } from 'child_process';
import * as path from 'path';
import { promisify } from 'util';
import { compareOutputs } from './utils/comparison';

const execAsync = promisify(exec);

describe('Go-TypeScript Output Comparison', () => {
  const corpusDir = path.join(__dirname, 'corpus', 'basic');

  test('01-simple-color-operations: deterministic operations should be identical', async () => {
    const testDir = path.join(corpusDir, '01-simple-color-operations');

    // Run Go implementation
    const { stdout: goOutput } = await execAsync('go run case.go', {
      cwd: testDir,
      timeout: 10000,
    });

    // Run TypeScript implementation
    const { stdout: tsOutput } = await execAsync('bun case.ts', {
      cwd: testDir,
      timeout: 10000,
    });

    const result = compareOutputs(tsOutput.trim(), goOutput.trim());

    if (!result.match) {
      console.log('Go Output:', result.goOutput);
      console.log('TS Output:', result.tsOutput);
      console.log('Differences:', result.differences);
    }

    expect(result.match).toBe(true);
  });

  test('04-deterministic-operations: all deterministic functions should be identical', async () => {
    const testDir = path.join(corpusDir, '04-deterministic-operations');

    // Run Go implementation
    const { stdout: goOutput } = await execAsync('go run case.go', {
      cwd: testDir,
      timeout: 10000,
    });

    // Run TypeScript implementation
    const { stdout: tsOutput } = await execAsync('bun case.ts', {
      cwd: testDir,
      timeout: 10000,
    });

    const result = compareOutputs(tsOutput.trim(), goOutput.trim());

    if (!result.match) {
      console.log('Go Output:', result.goOutput);
      console.log('TS Output:', result.tsOutput);
      console.log('Differences:', result.differences);
    }

    expect(result.match).toBe(true);
  });

  test('02-palette-generation: random palettes should differ (expected)', async () => {
    const testDir = path.join(corpusDir, '02-palette-generation');

    // Run Go implementation
    const { stdout: goOutput } = await execAsync('go run case.go', {
      cwd: testDir,
      timeout: 10000,
    });

    // Run TypeScript implementation
    const { stdout: tsOutput } = await execAsync('bun case.ts', {
      cwd: testDir,
      timeout: 10000,
    });

    const result = compareOutputs(tsOutput.trim(), goOutput.trim());

    // This test verifies that random output IS different (as expected)
    // Only the HSL/HSV parts should be identical
    expect(result.tsOutput).toContain('HSL Color: R=0.000000 G=1.000000 B=0.000000 Hex=#00ff00');
    expect(result.goOutput).toContain('HSL Color: R=0.000000 G=1.000000 B=0.000000 Hex=#00ff00');
    expect(result.tsOutput).toContain('HSV Color: R=0.000000 G=0.000000 B=1.000000 Hex=#0000ff');
    expect(result.goOutput).toContain('HSV Color: R=0.000000 G=0.000000 B=1.000000 Hex=#0000ff');

    // But palette generation should differ
    expect(result.match).toBe(false);
  });

  test('05-seeded-compatibility-test: seeded palettes should be deterministic within TypeScript', async () => {
    const testDir = path.join(corpusDir, '05-seeded-compatibility-test');

    // Run TypeScript implementation multiple times
    const { stdout: tsOutput1 } = await execAsync('bun case.ts', {
      cwd: testDir,
      timeout: 10000,
    });

    const { stdout: tsOutput2 } = await execAsync('bun case.ts', {
      cwd: testDir,
      timeout: 10000,
    });

    // TypeScript seeded output should be identical to itself
    expect(tsOutput1.trim()).toBe(tsOutput2.trim());
  });
});
