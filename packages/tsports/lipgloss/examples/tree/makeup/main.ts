#!/usr/bin/env bun

/**
 * Makeup Tree Example
 *
 * Demonstrates tree with rounded enumerator and beauty products
 * Port of: test/archive/go-reference/examples/tree/makeup/main.go
 */

import { NewStyle, newTree, RoundedEnumerator, SetColorProfile, ColorProfile } from '../../../src/index';

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
    const enumeratorStyle = NewStyle().color('63').marginRight(1);
  const rootStyle = NewStyle().color('35');
  const itemStyle = NewStyle().color('212');

  const t = newTree()
    .root('⁜ Makeup')
    .child(
      'Glossier',
      'Fenty Beauty',
      newTree().child('Gloss Bomb Universal Lip Luminizer', 'Hot Cheeks Velour Blushlighter'),
      'Nyx',
      'Mac',
      'Milk'
    )
    .enumerator(RoundedEnumerator)
    .enumeratorStyle(enumeratorStyle)
    .rootStyle(rootStyle)
    .itemStyle(itemStyle);

  console.log(t.toString());
}

// Run the example
main();
