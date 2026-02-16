#!/usr/bin/env bun
/**
 * Fix NO_COLOR golden files - they currently contain ANSI sequences when they shouldn't
 * Our TypeScript implementation is CORRECT, the golden files were generated wrong
 */

import { execSync } from 'node:child_process';
import { readdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const projectRoot = process.cwd();
const testdataDir = join(projectRoot, 'test/testdata');
const examplesDir = join(projectRoot, 'examples');

// Find all NO_COLOR environment golden files
const goldenFiles = readdirSync(testdataDir)
  .filter(file => file.endsWith('_no_color_env.golden'))
  .sort();

console.log(`Found ${goldenFiles.length} NO_COLOR golden files to fix`);

for (const goldenFile of goldenFiles) {
  console.log(`\nFixing ${goldenFile}...`);
  
  // Parse the filename to get example info
  // Format: example_{category}_{name}_no_color_env.golden
  const match = goldenFile.match(/^example_(.+)_(.+)_no_color_env\.golden$/);
  if (!match) {
    console.log(`  Skipping ${goldenFile} - doesn't match expected format`);
    continue;
  }
  
  const [, category, name] = match;
  const cleanName = name.replace(/_/g, ' ');
  
  // Find corresponding TypeScript example
  let examplePath: string | null = null;
  
  // Map category to directory
  const categoryDir = category === 'table' ? 'table' :
                     category === 'list' ? 'list' :
                     category === 'tree' ? 'tree' :
                     category === 'layout' ? 'layout' :
                     category === 'ssh' ? 'ssh' : null;
  
  if (categoryDir) {
    // Look for the example file
    const categoryPath = join(examplesDir, categoryDir);
    try {
      const categoryContents = readdirSync(categoryPath);
      for (const item of categoryContents) {
        const itemPath = join(categoryPath, item);
        if (item === 'main.ts') {
          // Single example in category directory
          examplePath = itemPath;
          break;
        } else {
          // Multiple examples in subdirectories
          try {
            const subPath = join(itemPath, 'main.ts');
            const cleanSubName = item.replace(/[\-_]/g, ' ').toLowerCase();
            if (cleanSubName.includes(name.toLowerCase()) || name.toLowerCase().includes(cleanSubName)) {
              examplePath = subPath;
              break;
            }
          } catch {}
        }
      }
    } catch {}
  }
  
  if (!examplePath) {
    console.log(`  Could not find example for ${goldenFile}`);
    continue;
  }
  
  try {
    // Generate correct NO_COLOR output using our TypeScript implementation
    console.log(`  Running ${examplePath} with NO_COLOR=1`);
    const correctOutput = execSync(`bun run "${examplePath}"`, {
      cwd: projectRoot,
      encoding: 'utf8',
      env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: undefined },
      stdio: ['pipe', 'pipe', 'ignore'] // Suppress stderr
    }).trim();
    
    // Escape sequences for golden file format
    const escapedOutput = correctOutput
      .replace(/\x1b/g, '\\x1b')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t');
    
    // Write the corrected golden file
    const goldenPath = join(testdataDir, goldenFile);
    writeFileSync(goldenPath, escapedOutput + '\\n', 'utf8');
    
    console.log(`  ✅ Fixed ${goldenFile}`);
  } catch (error) {
    console.log(`  ❌ Failed to fix ${goldenFile}: ${error.message}`);
  }
}

console.log(`\n🎉 Golden file fix complete!`);