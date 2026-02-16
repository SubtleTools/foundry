#!/usr/bin/env bun

/**
 * Rounded Tree Example
 *
 * Demonstrates tree with rounded enumerator and grocery categories
 * Port of: test/archive/go-reference/examples/tree/rounded/main.go
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
    const itemStyle = NewStyle().marginRight(1);
  const enumeratorStyle = NewStyle().color('8').marginRight(1);

  const t = newTree()
    .root('Groceries')
    .child(
      newTree().root('Fruits').child('Blood Orange', 'Papaya', 'Dragonfruit', 'Yuzu'),
      newTree().root('Items').child('Cat Food', 'Nutella', 'Powdered Sugar'),
      newTree().root('Veggies').child('Leek', 'Artichoke')
    )
    .itemStyle(itemStyle)
    .enumeratorStyle(enumeratorStyle)
    .enumerator(RoundedEnumerator);

  console.log(t.toString());
}

// Run the example
main();
