#!/usr/bin/env bun

/**
 * Background Tree Example
 *
 * Demonstrates tree with background colors and styling
 * Port of: test/archive/go-reference/examples/tree/background/main.go
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
    const enumeratorStyle = NewStyle().backgroundColor('0').padding(0, 1);

  const headerItemStyle = NewStyle()
    .backgroundColor('#ee6ff8')
    .color('#ecfe65')
    .bold(true)
    .padding(0, 1);

  const itemStyle = headerItemStyle.backgroundColor('0');

  const t = newTree()
    .root('# Table of Contents')
    .rootStyle(itemStyle)
    .itemStyle(itemStyle)
    .enumeratorStyle(enumeratorStyle)
    .child(newTree().root('## Chapter 1').child('Chapter 1.1').child('Chapter 1.2'))
    .child(newTree().root('## Chapter 2').child('Chapter 2.1').child('Chapter 2.2'));

  console.log(t.toString());
}

// Run the example
main();
