// Test specific functions that might be causing timeout

import { expect, test } from 'bun:test';
import * as GoStyle from './packages/tsports/go-colorful/src/go-style';

console.log('Starting specific test...');

test('Go-style basic palette generation isolated', () => {
  console.log('Testing FastWarmPalette...');
  const warmPalette = GoStyle.FastWarmPalette(3);
  console.log('FastWarmPalette completed:', warmPalette.length);
  expect(warmPalette).toHaveLength(3);
  
  console.log('Testing FastHappyPalette...');
  const happyPalette = GoStyle.FastHappyPalette(2);
  console.log('FastHappyPalette completed:', happyPalette.length);
  expect(happyPalette).toHaveLength(2);
});

test('Go-style WarmPalette and HappyPalette isolated', () => {
  console.log('Testing WarmPalette (slow version)...');
  const [warmPalette, warmError] = GoStyle.WarmPalette(2);
  console.log('WarmPalette completed:', warmPalette.length, 'error:', warmError);
  expect(warmError).toBeNull();
  expect(warmPalette).toHaveLength(2);
  
  console.log('Testing HappyPalette (slow version)...');
  const [happyPalette, happyError] = GoStyle.HappyPalette(2);
  console.log('HappyPalette completed:', happyPalette.length, 'error:', happyError);
  expect(happyError).toBeNull();
  expect(happyPalette).toHaveLength(2);
});

console.log('All specific tests defined');