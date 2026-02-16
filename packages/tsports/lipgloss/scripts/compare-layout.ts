#!/usr/bin/env bun

/**
 * Layout Comparison Script
 *
 * A standalone script to compare the Go and TypeScript layout examples.
 * This can be run independently of the test suite for quick verification.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

async function execCommand(command: string, args: string[], cwd?: string): Promise<ExecResult> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        FORCE_COLOR: '1',
        NO_COLOR: '',
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor',
        COLUMNS: '120',
        LINES: '30',
      },
      cwd,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode: exitCode || 0 });
    });
  });
}

function normalizeOutput(output: string): string {
  return output
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n+$/, '');
}

function visualizeAnsiSequences(text: string): string {
  return text
    .replace(/\x1b\[([0-9;]*)m/g, '\\x1b[$1m')
    .replace(/\x1b\[([0-9;]*[a-zA-Z])/g, '\\x1b[$1')
    .replace(/\n/g, '\\n\n');
}

function findDifferences(str1: string, str2: string): { line: number; go: string; ts: string }[] {
  const lines1 = str1.split('\n');
  const lines2 = str2.split('\n');
  const maxLines = Math.max(lines1.length, lines2.length);
  const differences: { line: number; go: string; ts: string }[] = [];

  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';

    if (line1 !== line2) {
      differences.push({
        line: i + 1,
        go: line1,
        ts: line2,
      });
    }
  }

  return differences;
}

async function main() {
  console.log('🔍 Comparing Go and TypeScript layout examples...\n');

  const projectRoot = path.resolve(__dirname, '..');
  const goExamplePath = path.join(projectRoot, 'tests', 'lipgloss', 'examples');
  const tsExamplePath = path.join(projectRoot, 'examples', 'layout', 'main.ts');

  // Check if files exist
  if (!fs.existsSync(path.join(goExamplePath, 'layout', 'main.go'))) {
    console.error('❌ Go example not found at:', path.join(goExamplePath, 'layout', 'main.go'));
    process.exit(1);
  }

  if (!fs.existsSync(tsExamplePath)) {
    console.error('❌ TypeScript example not found at:', tsExamplePath);
    process.exit(1);
  }

  console.log('📁 Running examples from:');
  console.log(`   Go: ${goExamplePath}/layout/main.go`);
  console.log(`   TS: ${tsExamplePath}\n`);

  // Run Go example
  console.log('🏃 Executing Go example...');
  const goResult = await execCommand('go', ['run', 'layout/main.go'], goExamplePath);

  if (goResult.exitCode !== 0) {
    console.error('❌ Go example failed:');
    console.error(goResult.stderr);
    process.exit(1);
  }

  console.log(`✅ Go example completed (${goResult.stdout.length} chars)\n`);

  // Run TypeScript example
  console.log('🏃 Executing TypeScript example...');
  const tsResult = await execCommand('bun', ['run', tsExamplePath], projectRoot);

  if (tsResult.exitCode !== 0) {
    console.error('❌ TypeScript example failed:');
    console.error(tsResult.stderr);
    process.exit(1);
  }

  console.log(`✅ TypeScript example completed (${tsResult.stdout.length} chars)\n`);

  // Normalize and compare
  const goOutput = normalizeOutput(goResult.stdout);
  const tsOutput = normalizeOutput(tsResult.stdout);

  console.log('📊 Comparison results:');
  console.log(`   Go output: ${goOutput.length} characters`);
  console.log(`   TS output: ${tsOutput.length} characters`);

  if (goOutput === tsOutput) {
    console.log('🎉 SUCCESS: Outputs are identical!\n');
    console.log('✅ The TypeScript port produces exactly the same output as the Go original.');
    process.exit(0);
  } else {
    console.log('❌ FAILURE: Outputs differ\n');

    const differences = findDifferences(goOutput, tsOutput);
    console.log(`📝 Found ${differences.length} different lines:\n`);

    // Show first 10 differences
    const maxShow = Math.min(differences.length, 10);
    for (let i = 0; i < maxShow; i++) {
      const diff = differences[i];
      console.log(`Line ${diff.line}:`);
      console.log(`  Go: "${visualizeAnsiSequences(diff.go)}"`);
      console.log(`  TS: "${visualizeAnsiSequences(diff.ts)}"`);
      console.log('');
    }

    if (differences.length > maxShow) {
      console.log(`... and ${differences.length - maxShow} more differences\n`);
    }

    // Save outputs for inspection
    const outputDir = '/tmp';
    const goFile = path.join(outputDir, 'go-layout-output.txt');
    const tsFile = path.join(outputDir, 'ts-layout-output.txt');

    try {
      fs.writeFileSync(goFile, goOutput);
      fs.writeFileSync(tsFile, tsOutput);
      console.log('💾 Full outputs saved to:');
      console.log(`   ${goFile}`);
      console.log(`   ${tsFile}`);
      console.log(
        '\n💡 Use `diff -u /tmp/go-layout-output.txt /tmp/ts-layout-output.txt` to see detailed differences'
      );
    } catch (error) {
      console.error('⚠️  Could not save output files:', error);
    }

    process.exit(1);
  }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('💥 Unexpected error:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled promise rejection:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('💥 Script failed:', error.message);
  process.exit(1);
});
