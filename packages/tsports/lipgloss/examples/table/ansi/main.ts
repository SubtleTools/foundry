#!/usr/bin/env bun

/**
 * ANSI Table Example
 *
 * Demonstrates simple table with styled content
 * Port of: test/archive/go-reference/examples/table/ansi/main.go
 */

import { Renderer, Table , SetColorProfile, ColorProfile} from '../../../src/index';

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
  const s = (text: string) => re.newStyle().color('240').render(text);

  const t = new Table()
    .row('Bubble Tea', s('Milky'))
    .row('Milk Tea', s('Also milky'))
    .row('Actual milk', s('Milky as well'));

  console.log(t.render());
}

// Run the example
main();
