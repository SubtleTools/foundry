/**
 * Color Blending Example
 * 
 * This example demonstrates how different color spaces produce different blending results.
 * It shows blending between two colors using HSV, LUV, RGB, LAB, and HCL color spaces.
 * 
 * Note: This TypeScript version demonstrates the blending calculations without image generation.
 * For image generation, you would need to use a canvas library or similar.
 * 
 * Run with: bun run docs/examples/colorblend.ts
 */

import * as GoStyle from '../../src/go-style';

function main() {
  const blocks = 10;
  
  const c1 = GoStyle.Hex("#fdffcc");
  const c2 = GoStyle.Hex("#242a42");

  // Use these colors to get invalid RGB in the gradient.
  // const c1 = GoStyle.Hex("#EEEF61");
  // const c2 = GoStyle.Hex("#1E3140");

  console.log("Color Blending Demonstration");
  console.log("============================");
  console.log(`Blending from ${c1.Hex()} to ${c2.Hex()}`);
  console.log();

  // Generate blend steps for each color space
  const blendSpaces = [
    { name: "HSV", method: (t: number) => c1.BlendHsv(c2, t) },
    { name: "LUV", method: (t: number) => c1.BlendLuv(c2, t) },
    { name: "RGB", method: (t: number) => c1.BlendRgb(c2, t) },
    { name: "LAB", method: (t: number) => c1.BlendLab(c2, t) },
    { name: "HCL", method: (t: number) => c1.BlendHcl(c2, t) }
  ];

  for (const space of blendSpaces) {
    console.log(`${space.name} Blending:`);
    const colors: string[] = [];
    
    for (let i = 0; i < blocks; i++) {
      const t = i / (blocks - 1);
      const blended = space.method(t);
      
      if (blended.IsValid()) {
        colors.push(blended.Hex());
      } else {
        // For invalid colors, clamp them
        const clamped = blended.Clamped();
        colors.push(`${blended.Hex()}*`); // * indicates it was invalid
      }
    }
    
    console.log(`  ${colors.join(" -> ")}`);
    console.log();
  }

  // Demonstrate the issue with invalid colors
  console.log("Example of invalid RGB colors during blending:");
  console.log("==============================================");
  
  const problematicC1 = GoStyle.Hex("#EEEF61");
  const problematicC2 = GoStyle.Hex("#1E3140");
  
  console.log(`Blending from ${problematicC1.Hex()} to ${problematicC2.Hex()}`);
  
  for (let i = 0; i < blocks; i++) {
    const t = i / (blocks - 1);
    const blended = problematicC1.BlendHcl(problematicC2, t);
    const isValid = blended.IsValid();
    
    console.log(`  Step ${i}: ${blended.Hex()} ${isValid ? "✓" : "✗ (invalid)"}`);
    
    if (!isValid) {
      const clamped = blended.Clamped();
      console.log(`    Clamped: ${clamped.Hex()} ✓`);
    }
  }
}

// Run the example
main();