#!/usr/bin/env bun

/**
 * Glow List Example
 *
 * Demonstrates document list with selection highlighting
 * Port of: test/archive/go-reference/examples/list/glow/main.go
 */

import { type ListStyleFunc, List, Renderer , SetColorProfile, ColorProfile} from '../../../src/index';
import type { Items } from '../../../src/list/types';

interface Document {
  name: string;
  time: string;
}

const re = new Renderer();
const faint = re.newStyle().faint(true);

function documentToString(d: Document): string {
  return d.name + '\n' + faint.render(d.time);
}

const docs: Document[] = [
  { name: 'README.md', time: '2 minutes ago' },
  { name: 'Example.md', time: '1 hour ago' },
  { name: 'secrets.md', time: '1 week ago' },
];

const selected = 1;

function main() {
  // Set color profile based on environment variables (like Go reference does)
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    SetColorProfile(ColorProfile.Ascii);
    re.setColorProfile(ColorProfile.Ascii);
  } else if (process.env.FORCE_COLOR === '3') {
    SetColorProfile(ColorProfile.TrueColor);
    re.setColorProfile(ColorProfile.TrueColor);
  } else if (process.env.FORCE_COLOR === '2') {
    SetColorProfile(ColorProfile.ANSI256);
    re.setColorProfile(ColorProfile.ANSI256);
  } else if (process.env.FORCE_COLOR === '1') {
    SetColorProfile(ColorProfile.ANSI);
    re.setColorProfile(ColorProfile.ANSI);
  }
    const baseStyle = re.newStyle().marginBottom(1).marginLeft(1);
  const dimColor = '250';
  const highlightColor = '#EE6FF8';

  const l = new List()
    .enumerator((_: Items, i: number) => {
      if (i === selected) {
        return '│\n│';
      }
      return ' ';
    })
    .itemStyleFunc((_: Items, i: number): ListStyleFunc => {
      const st = baseStyle;
      if (selected === i) {
        return st.color(highlightColor);
      }
      return st.color(dimColor);
    })
    .enumeratorStyleFunc((_: Items, i: number): ListStyleFunc => {
      if (selected === i) {
        return re.newStyle().color(highlightColor);
      }
      return re.newStyle().color(dimColor);
    });

  for (const d of docs) {
    l.item(documentToString(d));
  }

  process.stdout.write('\n');
  console.log(l.toString());
}

// Run the example
main();
