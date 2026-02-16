import * as GoStyle from '../../../../src/go-style';

console.log('=== Deterministic Color Operations Test ===');

// Test 1: Direct HSV creation with known values
const c1 = GoStyle.Hsv(0, 0.75, 0.55); // Same as FastWarmPalette logic but deterministic
console.log(
  `HSV(0, 0.75, 0.55): R=${c1.R.toFixed(6)} G=${c1.G.toFixed(6)} B=${c1.B.toFixed(6)} Hex=${c1.Hex()}`
);

const c2 = GoStyle.Hsv(120, 0.65, 0.45);
console.log(
  `HSV(120, 0.65, 0.45): R=${c2.R.toFixed(6)} G=${c2.G.toFixed(6)} B=${c2.B.toFixed(6)} Hex=${c2.Hex()}`
);

const c3 = GoStyle.Hsv(240, 0.7, 0.5);
console.log(
  `HSV(240, 0.70, 0.50): R=${c3.R.toFixed(6)} G=${c3.G.toFixed(6)} B=${c3.B.toFixed(6)} Hex=${c3.Hex()}`
);

// Test 2: Color space conversions
const rgb = new GoStyle.Color(0.8, 0.4, 0.2);
const [h, s, v] = rgb.Hsv();
console.log(`RGB(0.8,0.4,0.2) -> HSV: ${h.toFixed(6)} ${s.toFixed(6)} ${v.toFixed(6)}`);

const [l, a, b] = rgb.Lab();
console.log(`RGB(0.8,0.4,0.2) -> Lab: ${l.toFixed(6)} ${a.toFixed(6)} ${b.toFixed(6)}`);

// Test 3: Manual FastWarmPalette-style generation with known values
console.log('\n=== Manual Warm Palette Generation (Deterministic) ===');
const count = 3;
for (let i = 0; i < count; i++) {
  const hue = i * (360.0 / count);
  const sat = 0.65; // Fixed saturation instead of random
  const val = 0.45; // Fixed value instead of random
  const c = GoStyle.Hsv(hue, sat, val);
  console.log(
    `Color ${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()} (H=${hue.toFixed(1)} S=${sat.toFixed(2)} V=${val.toFixed(2)})`
  );
}
