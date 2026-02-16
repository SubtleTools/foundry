#!/usr/bin/env bun

/**
 * Grocery List Example
 *
 * Demonstrates custom enumerators and styling functions with checked items
 * Port of: test/archive/go-reference/examples/list/grocery/main.go
 */

import { List, Renderer, type StyleFunc , SetColorProfile, ColorProfile} from '../../../src/index';
import type { Items } from '../../../src/list/types';

const purchased = [
  'Bananas',
  'Barley',
  'Cashews',
  'Coconut Milk',
  'Dill',
  'Eggs',
  'Fish Cake',
  'Leeks',
  'Papaya',
];

function groceryEnumerator(items: Items, i: number): string {
  for (const p of purchased) {
    if (items.at(i).value() === p) {
      return '✓';
    }
  }
  return '•';
}

const re = new Renderer();
const dimEnumStyle = re.newStyle().color('240').marginRight(1);

const highlightedEnumStyle = re.newStyle().color('10').marginRight(1);

function enumStyleFunc(items: Items, i: number): StyleFunc {
  for (const p of purchased) {
    if (items.at(i).value() === p) {
      return highlightedEnumStyle;
    }
  }
  return dimEnumStyle;
}

function itemStyleFunc(items: Items, i: number): StyleFunc {
  const itemStyle = re.newStyle().color('255');
  for (const p of purchased) {
    if (items.at(i).value() === p) {
      return itemStyle.strikethrough(true);
    }
  }
  return itemStyle;
}

function main() {
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
    const l = new List()
    .items(
      'Artichoke',
      'Baking Flour',
      'Bananas',
      'Barley',
      'Bean Sprouts',
      'Cashew Apple',
      'Cashews',
      'Coconut Milk',
      'Curry Paste',
      'Currywurst',
      'Dill',
      'Dragonfruit',
      'Dried Shrimp',
      'Eggs',
      'Fish Cake',
      'Furikake',
      'Jicama',
      'Kohlrabi',
      'Leeks',
      'Lentils',
      'Licorice Root'
    )
    .enumerator(groceryEnumerator)
    .enumeratorStyleFunc(enumStyleFunc)
    .itemStyleFunc(itemStyleFunc);

  console.log(l.toString());
}

// Run the example
main();
