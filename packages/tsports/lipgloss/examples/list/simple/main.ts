#!/usr/bin/env bun

/**
 * Simple List Example
 *
 * Demonstrates basic list functionality with nested sublists
 * Port of: test/archive/go-reference/examples/list/simple/main.go
 */

import { newList, Roman , SetColorProfile, ColorProfile} from '../../../src/index';

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
    const l = newList(
    'A',
    'B', 
    'C',
    newList('D', 'E', 'F').enumerator(Roman),
    'G'
  );

  console.log(l.toString());
}

// Run the example
main();
