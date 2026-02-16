#!/usr/bin/env bun

/**
 * Roman Numerals List Example
 *
 * Demonstrates roman numeral enumerator
 * Port of: test/archive/go-reference/examples/list/roman/main.go
 */

import { newList, NewStyle, Roman, SetColorProfile, ColorProfile } from '../../../src/index';

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
  // If no explicit FORCE_COLOR, let auto-detection work
  
  const enumeratorStyle = NewStyle().color('99').marginRight(1);
  const itemStyle = NewStyle().color('255').marginRight(1);

  const l = newList(
    'Glossier',
    "Claire’s Boutique", 
    'Nyx',
    'Mac',
    'Milk'
  )
    .enumerator(Roman)
    .enumeratorStyle(enumeratorStyle)
    .itemStyle(itemStyle);

  console.log(l.toString());
}

// Run the example
main();
