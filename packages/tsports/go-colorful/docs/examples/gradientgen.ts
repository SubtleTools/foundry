/**
 * Gradient Generation Example
 * 
 * This example demonstrates how to create smooth color gradients using keypoints
 * and HCL blending. It creates a "spectral" colorbrewer gradient.
 * 
 * The gradient uses HCL color space for blending, which produces more perceptually
 * uniform transitions than RGB or HSV blending.
 * 
 * Run with: bun run docs/examples/gradientgen.ts
 */

import * as GoStyle from '../../src/go-style';

// Define a gradient table with keypoints
interface GradientKeypoint {
  color: GoStyle.Color;
  position: number; // Position in range [0, 1]
}

class GradientTable {
  private keypoints: GradientKeypoint[];

  constructor(keypoints: GradientKeypoint[]) {
    // Ensure keypoints are sorted by position
    this.keypoints = keypoints.sort((a, b) => a.position - b.position);
  }

  // Get interpolated color for a given position t in range [0, 1]
  getInterpolatedColorFor(t: number): GoStyle.Color {
    // Clamp t to [0, 1]
    t = Math.max(0, Math.min(1, t));

    // Find the two keypoints we're between
    for (let i = 0; i < this.keypoints.length - 1; i++) {
      const c1 = this.keypoints[i];
      const c2 = this.keypoints[i + 1];
      
      if (c1.position <= t && t <= c2.position) {
        // We are between c1 and c2. Blend them!
        const localT = (t - c1.position) / (c2.position - c1.position);
        return c1.color.BlendHcl(c2.color, localT).Clamped();
      }
    }

    // If we get here, we're at or past the last keypoint
    return this.keypoints[this.keypoints.length - 1].color;
  }

  // Generate a gradient with n steps
  generateGradient(steps: number): GoStyle.Color[] {
    const gradient: GoStyle.Color[] = [];
    
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      gradient.push(this.getInterpolatedColorFor(t));
    }
    
    return gradient;
  }
}

function main() {
  console.log("Gradient Generation Demonstration");
  console.log("================================");
  console.log();

  // The "spectral" colorbrewer gradient keypoints
  const keypoints: GradientKeypoint[] = [
    { color: GoStyle.Hex("#9e0142"), position: 0.0 },
    { color: GoStyle.Hex("#d53e4f"), position: 0.1 },
    { color: GoStyle.Hex("#f46d43"), position: 0.2 },
    { color: GoStyle.Hex("#fdae61"), position: 0.3 },
    { color: GoStyle.Hex("#fee090"), position: 0.4 },
    { color: GoStyle.Hex("#ffffbf"), position: 0.5 },
    { color: GoStyle.Hex("#e6f598"), position: 0.6 },
    { color: GoStyle.Hex("#abdda4"), position: 0.7 },
    { color: GoStyle.Hex("#66c2a5"), position: 0.8 },
    { color: GoStyle.Hex("#3288bd"), position: 0.9 },
    { color: GoStyle.Hex("#5e4fa2"), position: 1.0 }
  ];

  const gradient = new GradientTable(keypoints);

  // Display the original keypoints
  console.log("Gradient Keypoints:");
  keypoints.forEach((kp, i) => {
    console.log(`  ${(kp.position * 100).toString().padStart(3)}%: ${kp.color.Hex()}`);
  });
  console.log();

  // Generate and display a smooth gradient with more steps
  const steps = 20;
  console.log(`Generated Gradient (${steps} steps):`);
  const smoothGradient = gradient.generateGradient(steps);
  
  smoothGradient.forEach((color, i) => {
    const position = i / (steps - 1);
    console.log(`  ${(position * 100).toFixed(1).padStart(5)}%: ${color.Hex()}`);
  });
  console.log();

  // Demonstrate different blending approaches for comparison
  console.log("Comparison of Blending Methods:");
  console.log("==============================");
  
  const startColor = GoStyle.Hex("#9e0142");
  const endColor = GoStyle.Hex("#5e4fa2");
  
  console.log(`Blending from ${startColor.Hex()} to ${endColor.Hex()}:`);
  console.log();
  
  const blendSteps = 5;
  const blendMethods = [
    { name: "RGB", method: (t: number) => startColor.BlendRgb(endColor, t) },
    { name: "HSV", method: (t: number) => startColor.BlendHsv(endColor, t) },
    { name: "LAB", method: (t: number) => startColor.BlendLab(endColor, t) },
    { name: "HCL", method: (t: number) => startColor.BlendHcl(endColor, t) }
  ];
  
  for (const method of blendMethods) {
    console.log(`${method.name} Blending:`);
    const blendColors: string[] = [];
    
    for (let i = 0; i < blendSteps; i++) {
      const t = i / (blendSteps - 1);
      const blended = method.method(t);
      const color = blended.IsValid() ? blended : blended.Clamped();
      blendColors.push(color.Hex());
    }
    
    console.log(`  ${blendColors.join(" → ")}`);
  }
  console.log();

  // Analyze gradient properties
  console.log("Gradient Analysis:");
  console.log("==================");
  
  let totalDistance = 0;
  for (let i = 0; i < smoothGradient.length - 1; i++) {
    const distance = smoothGradient[i].DistanceCIEDE2000(smoothGradient[i + 1]);
    totalDistance += distance;
  }
  
  const avgDistance = totalDistance / (smoothGradient.length - 1);
  console.log(`Average perceptual distance between adjacent colors: ${avgDistance.toFixed(3)}`);
  console.log("(Lower values indicate smoother transitions)");
  console.log();

  // Color space analysis of a few gradient points
  console.log("Color Space Analysis (first 3 gradient colors):");
  smoothGradient.slice(0, 3).forEach((color, i) => {
    const [h, s, l] = color.Hsl();
    const [hcl_h, hcl_c, hcl_l] = color.Hcl();
    const [lab_l, lab_a, lab_b] = color.Lab();
    
    console.log(`Color ${i + 1}: ${color.Hex()}`);
    console.log(`  HSL: H=${h.toFixed(1)}°, S=${(s*100).toFixed(1)}%, L=${(l*100).toFixed(1)}%`);
    console.log(`  HCL: H=${hcl_h.toFixed(1)}°, C=${(hcl_c*100).toFixed(1)}%, L=${(hcl_l*100).toFixed(1)}%`);
    console.log(`  LAB: L=${(lab_l*100).toFixed(1)}, a=${lab_a.toFixed(2)}, b=${lab_b.toFixed(2)}`);
    console.log();
  });

  console.log("Note: HCL blending maintains perceptual uniformity better than RGB or HSV.");
  console.log("This makes it ideal for data visualization gradients where smooth");
  console.log("transitions are important for accurate perception.");
}

// Run the example
main();