import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';
import { rootTree, type Tree } from '../../../../src/tree/index.js';

// Set color profile for consistent output

// Recursively add branches to the tree - matching Go implementation
function addBranches(root: Tree, dirPath: string): void {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  // Sort items alphabetically to match Go's os.ReadDir behavior
  items.sort((a, b) => a.name.localeCompare(b.name));

  for (const item of items) {
    // Skip files/directories that start with a dot
    if (item.name.startsWith('.')) {
      continue;
    }

    if (item.isDirectory()) {
      const treeBranch = rootTree(item.name);
      root.child(treeBranch);

      // Recurse into subdirectory
      const branchPath = path.join(dirPath, item.name);
      addBranches(treeBranch, branchPath);
    } else {
      root.child(item.name);
    }
  }
}

const enumeratorStyle = NewStyle().color(Colors[240] || '#808080').paddingRight(1);
const itemStyle = NewStyle().color(Colors[99] || '#800080').bold(true).paddingRight(1);

const pwd = process.cwd();

const t = rootTree(pwd)
  .enumeratorStyle(enumeratorStyle)
  .rootStyle(itemStyle)
  .itemStyle(itemStyle);

addBranches(t, '.');

console.log(t.toString());
