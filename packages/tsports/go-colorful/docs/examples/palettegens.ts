/**
 * Palette Generation Example
 * 
 * This example demonstrates different palette generation methods:
 * - WarmPalette(): Generates warm palette using CIE spaces (slower, more perceptually uniform)
 * - FastWarmPalette(): Generates warm palette using HSV (faster, less perceptually uniform)
 * - HappyPalette(): Generates happy palette using CIE spaces
 * - FastHappyPalette(): Generates happy palette using HSV
 * - SoftPalette(): Generates soft palette with configurable constraints
 * - SoftPaletteEx(): Generates palette with custom color constraint function
 * 
 * Run with: bun run docs/examples/palettegens.ts
 */

import * as GoStyle from '../../src/go-style';

function isBrowny(l: number, a: number, b: number): boolean {
  const [h, c, L] = GoStyle.LabToHcl(l, a, b);
  return 10.0 < h && h < 50.0 && 0.1 < c && c < 0.5 && L < 0.5;
}

function main() {
  const colors = 10;

  console.log("Palette Generation Demonstration");
  console.log("===============================");
  console.log();

  try {
    // Generate warm palette (slower, more perceptually uniform)
    console.log("Warm Palette (CIE spaces - slower, more perceptually uniform):");
    const [warm, warmError] = GoStyle.WarmPalette(colors);
    if (warmError) {
      console.log(`Error generating warm palette: ${warmError.message}`);
    } else {
      const warmHex = warm.map(c => c.Hex());
      console.log(`  ${warmHex.join(" ")}`);
    }
    console.log();

    // Generate fast warm palette (faster, less perceptually uniform)
    console.log("Fast Warm Palette (HSV space - faster, less perceptually uniform):");
    const fwarm = GoStyle.FastWarmPalette(colors);
    const fwarmHex = fwarm.map(c => c.Hex());
    console.log(`  ${fwarmHex.join(" ")}`);
    console.log();

    // Generate happy palette
    console.log("Happy Palette (CIE spaces):");
    const [happy, happyError] = GoStyle.HappyPalette(colors);
    if (happyError) {
      console.log(`Error generating happy palette: ${happyError.message}`);
    } else {
      const happyHex = happy.map(c => c.Hex());
      console.log(`  ${happyHex.join(" ")}`);
    }
    console.log();

    // Generate fast happy palette
    console.log("Fast Happy Palette (HSV space):");
    const fhappy = GoStyle.FastHappyPalette(colors);
    const fhappyHex = fhappy.map(c => c.Hex());
    console.log(`  ${fhappyHex.join(" ")}`);
    console.log();

    // Generate soft palette
    console.log("Soft Palette (configurable constraints):");
    const [soft, softError] = GoStyle.SoftPalette(colors);
    if (softError) {
      console.log(`Error generating soft palette: ${softError.message}`);
    } else {
      const softHex = soft.map(c => c.Hex());
      console.log(`  ${softHex.join(" ")}`);
    }
    console.log();

    // Generate brownies palette with custom constraint
    console.log("Custom Brownish Palette (using SoftPaletteEx with custom constraint):");
    const browniesSettings = {
      CheckColor: isBrowny,
      Iterations: 50,
      ManySamples: true // Since the constraint is restrictive
    };

    const [brownies, browniesError] = GoStyle.SoftPaletteEx(colors, browniesSettings);
    if (browniesError) {
      console.log(`Error generating brownies: ${browniesError.message}`);
    } else {
      const browniesHex = brownies.map(c => c.Hex());
      console.log(`  ${browniesHex.join(" ")}`);
    }
    console.log();

    // Demonstrate palette analysis
    console.log("Palette Analysis:");
    console.log("================");
    
    if (!warmError && warm.length > 0) {
      console.log("Warm Palette Color Properties:");
      warm.slice(0, 3).forEach((color, i) => {
        const [h, s, l] = color.Hsl();
        const [hcl_h, hcl_c, hcl_l] = color.Hcl();
        console.log(`  Color ${i + 1}: ${color.Hex()}`);
        console.log(`    HSL: H=${h.toFixed(1)}°, S=${(s*100).toFixed(1)}%, L=${(l*100).toFixed(1)}%`);
        console.log(`    HCL: H=${hcl_h.toFixed(1)}°, C=${(hcl_c*100).toFixed(1)}%, L=${(hcl_l*100).toFixed(1)}%`);
      });
      console.log();

      // Calculate average distances between colors in the palette
      let totalDistance = 0;
      let comparisons = 0;
      
      for (let i = 0; i < warm.length; i++) {
        for (let j = i + 1; j < warm.length; j++) {
          totalDistance += warm[i].DistanceCIEDE2000(warm[j]);
          comparisons++;
        }
      }
      
      const avgDistance = totalDistance / comparisons;
      console.log(`Average perceptual distance between warm palette colors: ${avgDistance.toFixed(3)}`);
      console.log("(Higher values indicate more distinguishable colors)");
    }

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Run the example
main();