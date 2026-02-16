#!/usr/bin/env bun

/**
 * Styles Tree Example
 *
 * Demonstrates tree with different enumerator styles
 * Port of: test/archive/go-reference/examples/tree/styles/main.go
 */

import { NewStyle, newTree, SetColorProfile, ColorProfile } from '../../../src/index';

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
    const purple = NewStyle().color('99').marginRight(1);
  const pink = NewStyle().color('212').marginRight(1);

  const t = newTree()
    .child(
      'Glossier',
      "Claire's Boutique",
      newTree().root('Nyx').child('Lip Gloss', 'Foundation').enumeratorStyle(pink),
      'Mac',
      'Milk'
    )
    .enumeratorStyle(purple);

  console.log(t.toString());
}

// Run the example
main();
