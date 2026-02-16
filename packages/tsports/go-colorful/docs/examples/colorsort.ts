/**
 * Color Sorting Example
 * 
 * This example demonstrates go-colorful's Sorted function, which orders colors
 * to minimize the average distance between adjacent colors.
 * 
 * The example shows three different sorting approaches:
 * 1. Unsorted random colors
 * 2. Sorted by CIE-L*C*h° components (lightness, hue, chroma)
 * 3. Sorted using the Sorted function (minimizes perceptual jumps)
 * 
 * Run with: bun run docs/examples/colorsort.ts
 */

import * as GoStyle from '../../src/go-style';

// Generate random colors
function randomColors(n: number, randInterface?: { Float64(): number }): GoStyle.Color[] {
  const rand = randInterface || { Float64: () => Math.random() };
  const colors: GoStyle.Color[] = [];
  
  for (let i = 0; i < n; i++) {
    colors.push(new GoStyle.Color(
      rand.Float64(),
      rand.Float64(),
      rand.Float64()
    ));
  }
  
  return colors;
}

// Calculate average distance between adjacent colors in a sequence
function calculateAverageDistance(colors: GoStyle.Color[]): number {
  if (colors.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < colors.length - 1; i++) {
    totalDistance += colors[i].DistanceCIEDE2000(colors[i + 1]);
  }
  
  // Include wrap-around distance (last to first)
  totalDistance += colors[colors.length - 1].DistanceCIEDE2000(colors[0]);
  
  return totalDistance / colors.length;
}

function main() {
  const n = 20; // Using smaller number for console output
  const SEED = 8675309;
  
  // Create a seeded random number generator for reproducible results
  let seed = SEED;
  const seededRand = {
    Float64: () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }
  };

  console.log("Color Sorting Demonstration");
  console.log("==========================");
  console.log();

  // Generate random colors
  const cs1 = randomColors(n, seededRand);
  
  // Create a copy for manual sorting
  const cs2 = cs1.map(c => new GoStyle.Color(c.R, c.G, c.B));
  
  // Sort by CIE-L*C*h° components (lightness, hue, chroma)
  cs2.sort((a, b) => {
    const [l1, c1, h1] = a.LuvLCh();
    const [l2, c2, h2] = b.LuvLCh();
    
    if (l1 !== l2) {
      return l1 - l2;
    }
    if (h1 !== h2) {
      return h1 - h2;
    }
    if (c1 !== c2) {
      return c1 - c2;
    }
    return 0;
  });
  
  // Use the Sorted function to minimize perceptual jumps
  const cs3 = GoStyle.Sorted(cs1);

  // Display results
  console.log("1. Unsorted (random) colors:");
  const unsortedHex = cs1.map(c => c.Hex());
  console.log(`   ${unsortedHex.join(" ")}`);
  
  const unsortedAvgDist = calculateAverageDistance(cs1);
  console.log(`   Average adjacent distance: ${unsortedAvgDist.toFixed(3)}`);
  console.log();

  console.log("2. Sorted by CIE-L*C*h° components (L→h→c):");
  const manualSortedHex = cs2.map(c => c.Hex());
  console.log(`   ${manualSortedHex.join(" ")}`);
  
  const manualSortedAvgDist = calculateAverageDistance(cs2);
  console.log(`   Average adjacent distance: ${manualSortedAvgDist.toFixed(3)}`);
  console.log();

  console.log("3. Sorted using go-colorful's Sorted function:");
  const smartSortedHex = cs3.map(c => c.Hex());
  console.log(`   ${smartSortedHex.join(" ")}`);
  
  const smartSortedAvgDist = calculateAverageDistance(cs3);
  console.log(`   Average adjacent distance: ${smartSortedAvgDist.toFixed(3)}`);
  console.log();

  // Analysis
  console.log("Analysis:");
  console.log("========");
  console.log(`The Sorted function reduces average distance by ${((unsortedAvgDist - smartSortedAvgDist) / unsortedAvgDist * 100).toFixed(1)}%`);
  console.log("compared to random ordering.");
  console.log();
  
  console.log("Color Properties Comparison:");
  console.log("First 3 colors in each sequence:");
  
  for (let i = 0; i < 3; i++) {
    console.log(`\nPosition ${i + 1}:`);
    
    const [l1, c1, h1] = cs1[i].LuvLCh();
    console.log(`  Random:  ${cs1[i].Hex()} (L=${l1.toFixed(1)}, C=${c1.toFixed(2)}, h=${h1.toFixed(1)}°)`);
    
    const [l2, c2, h2] = cs2[i].LuvLCh();
    console.log(`  LCh Sort: ${cs2[i].Hex()} (L=${l2.toFixed(1)}, C=${c2.toFixed(2)}, h=${h2.toFixed(1)}°)`);
    
    const [l3, c3, h3] = cs3[i].LuvLCh();
    console.log(`  Smart:   ${cs3[i].Hex()} (L=${l3.toFixed(1)}, C=${c3.toFixed(2)}, h=${h3.toFixed(1)}°)`);
  }
  
  console.log();
  console.log("Note: The Sorted function produces a sequence where colors flow");
  console.log("more smoothly, even though they may not be strictly ordered by");
  console.log("any single component. This minimizes perceptual 'jumps' between");
  console.log("adjacent colors in the sequence.");
}

// Run the example
main();