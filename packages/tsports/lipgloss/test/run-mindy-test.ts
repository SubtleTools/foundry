#!/usr/bin/env bun

import {  spawn } from 'child_process';
import { readFileSync } from 'fs';

// Run the mindy example
const child = spawn('bun', ['./examples/table/mindy/main.ts'], {
  env: { ...process.env, FORCE_COLOR: '3' },
  cwd: process.cwd()
});

let output = '';
child.stdout?.on('data', (data) => {
  output += data.toString();
});

child.stderr?.on('data', (data) => {
  console.error('Error:', data.toString());
});

child.on('close', (code) => {
  // Read the golden file
  const golden = readFileSync('test/testdata/example_5013-example-mindy_color.golden', 'utf-8');
  
  // Convert actual output to have escape codes as \x1b
  const actualEncoded = output.replace(/\x1b/g, '\\x1b');
  
  // Compare line by line
  const actualLines = actualEncoded.split('\n');
  const goldenLines = golden.split('\n');
  
  let diffCount = 0;
  for (let i = 0; i < Math.max(actualLines.length, goldenLines.length); i++) {
    if (actualLines[i] !== goldenLines[i]) {
      console.log(`Line ${i + 1} differs:`);
      console.log(`- Expected: ${goldenLines[i]?.substring(0, 100)}`);
      console.log(`+ Actual:   ${actualLines[i]?.substring(0, 100)}`);
      diffCount++;
      if (diffCount >= 5) {
        console.log('... (more differences)');
        break;
      }
    }
  }
  
  if (diffCount === 0) {
    console.log('✓ Output matches golden file!');
  }
});
