#!/usr/bin/env bun

/**
 * Duck Duck Goose List Example
 *
 * Demonstrates custom enumerator with conditional logic
 * Port of: test/archive/go-reference/examples/list/duckduckgoose/main.go
 */

import { List, Renderer , SetColorProfile, ColorProfile} from '../../../src/index';
import type { Items } from '../../../src/list/types';

function duckDuckGooseEnumerator(items: Items, i: number): string {
  if (items.at(i).value() === 'Goose') {
    return 'Honk →';
  }
  return ' ';
}

function main() {
  const re = new Renderer();
  
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
  const enumStyle = re.newStyle().color('#00d787').marginRight(1);
  const itemStyle = re.newStyle().color('255');

  const l = new List()
    .items('Duck', 'Duck', 'Duck', 'Goose', 'Duck')
    .itemStyle(itemStyle)
    .enumeratorStyle(enumStyle)
    .enumerator(duckDuckGooseEnumerator);

  console.log(l.toString());
}

// Run the example
main();
