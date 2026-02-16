#!/usr/bin/env bun

import { getTextWidth } from './src/layout.js';
import { createNewStyle as GoNewStyle } from './src/go-compat.js';
import { SetColorProfile, ColorProfile, SetHasDarkBackground } from './src/index.js';

SetColorProfile(ColorProfile.TrueColor);
SetHasDarkBackground(true);

// Test what physicalWidth value produces exactly 195 output width
const content = ' '.repeat(96); // Document content is about 96 wide
const docStyle = GoNewStyle().Padding(1, 2, 1, 2);

console.log('Testing different physicalWidth values to get 195 final width:');

for (let physicalWidth = 150; physicalWidth <= 250; physicalWidth += 5) {
  const styledDocStyle = docStyle.MaxWidth(physicalWidth);
  const result = styledDocStyle.Render(content);
  const firstLine = result.split('\n')[0];
  const finalWidth = getTextWidth(firstLine);
  
  console.log(`physicalWidth=${physicalWidth} -> finalWidth=${finalWidth}`);
  
  if (finalWidth === 195) {
    console.log(`*** FOUND IT! physicalWidth=${physicalWidth} produces finalWidth=195 ***`);
  }
}

// Also test the hypothesis that the issue might be padding calculation
console.log('\nTesting if the issue is in padding calculation:');
console.log('Content width:', getTextWidth(content));

const justPadding = docStyle.Render(content);
const justPaddingWidth = getTextWidth(justPadding.split('\n')[0]);
console.log('With padding only:', justPaddingWidth);

// What if we need content to be exactly 191 to get 195 output?
const content191 = ' '.repeat(191);
const result191 = docStyle.Render(content191);
const width191 = getTextWidth(result191.split('\n')[0]);
console.log('191-char content with padding:', width191);