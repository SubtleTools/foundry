#!/usr/bin/env bun

/**
 * Files Tree Example
 *
 * Demonstrates tree with filesystem exploration
 * Port of: test/archive/go-reference/examples/tree/files/main.go
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { NewStyle, newTree, SetColorProfile, ColorProfile } from '../../../src/index';

function addBranches(root: any, path: string): void {
  try {
    const items = readdirSync(path);

    for (const item of items) {
      const itemPath = join(path, item);
      const stats = statSync(itemPath);

      if (stats.isDirectory()) {
        // It's a directory.

        // Skip directories that start with a dot.
        if (item.startsWith('.')) {
          continue;
        }

        const treeBranch = newTree().root(item);
        root.child(treeBranch);

        // Recurse.
        try {
          addBranches(treeBranch, itemPath);
        } catch (err) {}
      } else {
        // It's a file.

        // Skip files that start with a dot.
        if (item.startsWith('.')) {
          continue;
        }

        root.child(item);
      }
    }
  } catch (err) {
    // Skip directories we can't read
    return;
  }
}

function main() {
  // Set color profile based on environment variables (like Go reference does)
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    SetColorProfile(ColorProfile.Ascii);
  } else if (process.env.FORCE_COLOR === '3') {
    SetColorProfile(ColorProfile.TrueColor);
  } else if (process.env.FORCE_COLOR === '2') {
    SetColorProfile(ColorProfile.ANSI256);
  } else if (process.env.FORCE_COLOR === '1') {
    SetColorProfile(ColorProfile.ANSI);
  }
  const enumeratorStyle = NewStyle().color('240').paddingRight(1);
  const itemStyle = NewStyle().color('99').bold(true).paddingRight(1);

  const pwd = process.cwd();

  const t = newTree()
    .root(pwd)
    .enumeratorStyle(enumeratorStyle)
    .rootStyle(itemStyle)
    .itemStyle(itemStyle);

  try {
    addBranches(t, '.');
  } catch (err) {
    console.error('Error building tree:', err);
    process.exit(1);
  }

  console.log(t.toString());
}

// Run the example
main();
