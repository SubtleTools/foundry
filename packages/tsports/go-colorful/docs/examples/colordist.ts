/**
 * Color Distance Comparison Example
 * 
 * This example demonstrates how different color distance metrics work.
 * The two colors shown on the top look much more different than the two shown on
 * the bottom. Still, in RGB space, their distance is the same.
 * 
 * Run with: bun run docs/examples/colordist.ts
 */

import * as GoStyle from '../../src/go-style';

function main() {
  const c1a = new GoStyle.Color(150.0 / 255.0, 10.0 / 255.0, 150.0 / 255.0);
  const c1b = new GoStyle.Color(53.0 / 255.0, 10.0 / 255.0, 150.0 / 255.0);
  const c2a = new GoStyle.Color(10.0 / 255.0, 150.0 / 255.0, 50.0 / 255.0);
  const c2b = new GoStyle.Color(99.9 / 255.0, 150.0 / 255.0, 10.0 / 255.0);

  console.log(`DistanceRgb:       c1: ${c1a.DistanceRgb(c1b)}\tand c2: ${c2a.DistanceRgb(c2b)}`);
  console.log(`DistanceLab:       c1: ${c1a.DistanceLab(c1b)}\tand c2: ${c2a.DistanceLab(c2b)}`);
  console.log(`DistanceLuv:       c1: ${c1a.DistanceLuv(c1b)}\tand c2: ${c2a.DistanceLuv(c2b)}`);
  console.log(`DistanceCIE76:     c1: ${c1a.DistanceCIE76(c1b)}\tand c2: ${c2a.DistanceCIE76(c2b)}`);
  console.log(`DistanceCIE94:     c1: ${c1a.DistanceCIE94(c1b)}\tand c2: ${c2a.DistanceCIE94(c2b)}`);
  console.log(`DistanceCIEDE2000: c1: ${c1a.DistanceCIEDE2000(c1b)}\tand c2: ${c2a.DistanceCIEDE2000(c2b)}`);
}

// Run the example
main();