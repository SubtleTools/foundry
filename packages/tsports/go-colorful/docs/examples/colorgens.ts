/**
 * Random Color Generation Example
 * 
 * This example demonstrates different random color generation methods:
 * - WarmColor(): Generates warm colors using CIE-L*C*h° space (slower, more coherent)
 * - FastWarmColor(): Generates warm colors using HSV space (faster, less coherent)
 * - HappyColor(): Generates happy colors using CIE-L*C*h° space (slower, more coherent)
 * - FastHappyColor(): Generates happy colors using HSV space (faster, less coherent)
 * 
 * Run with: bun run docs/examples/colorgens.ts
 */

import * as GoStyle from '../../src/go-style';

function main() {
  const blocks = 10;

  console.log("Random Color Generation Demonstration");
  console.log("====================================");
  console.log();

  // Generate warm colors (top two rows in the original image)
  console.log("Warm Colors (CIE-L*C*h° space - slower, more coherent):");
  const warmColors: string[] = [];
  for (let i = 0; i < blocks; i++) {
    const color = GoStyle.WarmColor();
    warmColors.push(color.Hex());
  }
  console.log(`  ${warmColors.join(" ")}`);
  console.log();

  console.log("Fast Warm Colors (HSV space - faster, less coherent):");
  const fastWarmColors: string[] = [];
  for (let i = 0; i < blocks; i++) {
    const color = GoStyle.FastWarmColor();
    fastWarmColors.push(color.Hex());
  }
  console.log(`  ${fastWarmColors.join(" ")}`);
  console.log();

  // Generate happy colors (bottom two rows in the original image)
  console.log("Happy Colors (CIE-L*C*h° space - slower, more coherent):");
  const happyColors: string[] = [];
  for (let i = 0; i < blocks; i++) {
    const color = GoStyle.HappyColor();
    happyColors.push(color.Hex());
  }
  console.log(`  ${happyColors.join(" ")}`);
  console.log();

  console.log("Fast Happy Colors (HSV space - faster, less coherent):");
  const fastHappyColors: string[] = [];
  for (let i = 0; i < blocks; i++) {
    const color = GoStyle.FastHappyColor();
    fastHappyColors.push(color.Hex());
  }
  console.log(`  ${fastHappyColors.join(" ")}`);
  console.log();

  // Demonstrate using custom random source
  console.log("Using Custom Random Source:");
  console.log("===========================");
  
  const customRand = {
    Float64: () => 0.7, // Fixed value for reproducible results
    Intn: (n: number) => Math.floor(n * 0.3)
  };

  console.log("Deterministic warm colors with custom random:");
  const deterministicWarm: string[] = [];
  for (let i = 0; i < 5; i++) {
    const color = GoStyle.WarmColorWithRand(customRand);
    deterministicWarm.push(color.Hex());
  }
  console.log(`  ${deterministicWarm.join(" ")}`);
  console.log();

  // Show color properties
  console.log("Color Properties Analysis:");
  console.log("=========================");
  
  const warmColor = GoStyle.WarmColor();
  const happyColor = GoStyle.HappyColor();
  
  console.log(`Warm Color: ${warmColor.Hex()}`);
  const [warmH, warmS, warmL] = warmColor.Hsl();
  console.log(`  HSL: H=${warmH.toFixed(1)}°, S=${(warmS*100).toFixed(1)}%, L=${(warmL*100).toFixed(1)}%`);
  
  const [warmHcl_H, warmHcl_C, warmHcl_L] = warmColor.Hcl();
  console.log(`  HCL: H=${warmHcl_H.toFixed(1)}°, C=${(warmHcl_C*100).toFixed(1)}%, L=${(warmHcl_L*100).toFixed(1)}%`);
  console.log();
  
  console.log(`Happy Color: ${happyColor.Hex()}`);
  const [happyH, happyS, happyL] = happyColor.Hsl();
  console.log(`  HSL: H=${happyH.toFixed(1)}°, S=${(happyS*100).toFixed(1)}%, L=${(happyL*100).toFixed(1)}%`);
  
  const [happyHcl_H, happyHcl_C, happyHcl_L] = happyColor.Hcl();
  console.log(`  HCL: H=${happyHcl_H.toFixed(1)}°, C=${(happyHcl_C*100).toFixed(1)}%, L=${(happyHcl_L*100).toFixed(1)}%`);
}

// Run the example
main();