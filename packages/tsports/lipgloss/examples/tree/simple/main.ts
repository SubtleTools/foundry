#!/usr/bin/env bun

/**
 * Simple Tree Example
 *
 * Demonstrates basic tree structure with nested children
 * Port of: test/archive/go-reference/examples/tree/simple/main.go
 */

import { newTree, SetColorProfile, ColorProfile } from '../../../src/index';

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
    const t = newTree()
    .root('.')
    .child('macOS')
    .child(newTree().root('Linux').child('NixOS').child('Arch Linux (btw)').child('Void Linux'))
    .child(newTree().root('BSD').child('FreeBSD').child('OpenBSD'));

  console.log(t.toString());
}

// Run the example
main();
