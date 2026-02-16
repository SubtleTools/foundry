#!/usr/bin/env bun

/**
 * Mindy Color Table Example
 *
 * Demonstrates color swatch table with ANSI color codes
 * Port of: test/archive/go-reference/examples/table/mindy/main.go
 */

import { BorderType, HorizontalAlignment, Renderer, Table , SetColorProfile, ColorProfile} from '../../../src/index';

const rowLength = 12;

function makeRow(start: number, end: number): string[] {
  const row: string[] = [];
  for (let i = start; i <= end; i++) {
    row.push(i.toString());
    row.push('');
  }
  for (let i = row.length; i < rowLength; i++) {
    row.push('');
  }
  return row;
}

function makeEmptyRow(): string[] {
  return makeRow(0, -1);
}

function main() {
  const re = new Renderer();
  
  // Set color profile on renderer based on environment variables (like Go reference does)
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    re.setColorProfile(ColorProfile.Ascii);
  } else if (process.env.FORCE_COLOR === '3') {
    re.setColorProfile(ColorProfile.TrueColor);
  } else if (process.env.FORCE_COLOR === '2') {
    re.setColorProfile(ColorProfile.ANSI256);
  } else if (process.env.FORCE_COLOR === '1') {
    re.setColorProfile(ColorProfile.ANSI);
  } else {
    // Default to TrueColor for better output
    re.setColorProfile(ColorProfile.TrueColor);
  }
  const labelStyle = re.newStyle().width(3).align(HorizontalAlignment.Right);
  const swatchStyle = re.newStyle().width(6);

  const data: string[][] = [];
  for (let i = 0; i < 13; i += 8) {
    data.push(makeRow(i, i + 5));
  }
  data.push(makeEmptyRow());
  for (let i = 6; i < 15; i += 8) {
    data.push(makeRow(i, i + 1));
  }
  data.push(makeEmptyRow());
  for (let i = 16; i < 231; i += 6) {
    data.push(makeRow(i, i + 5));
  }
  data.push(makeEmptyRow());
  for (let i = 232; i < 256; i += 6) {
    data.push(makeRow(i, i + 5));
  }

  const t = new Table()
    .setBorder(BorderType.Hidden)
    .rows(...data)
    .setStyleFunc((row: number, col: number) => {
      const color = data[row][col - (col % 2)];
      switch (true) {
        case col % 2 === 0:
          return labelStyle.color(color);
        default:
          return swatchStyle.backgroundColor(color);
      }
    });

  console.log(t.render());
}

// Run the example
main();
