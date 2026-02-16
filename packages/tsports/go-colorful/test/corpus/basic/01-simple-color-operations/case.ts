import * as GoStyle from '../../../../src/go-style';

// Test basic color operations
const c1 = new GoStyle.Color(1.0, 0.0, 0.0);
console.log(`Color: R=${c1.R.toFixed(6)} G=${c1.G.toFixed(6)} B=${c1.B.toFixed(6)}`);

// RGBA conversion
const [r, g, b, a] = c1.RGBA();
console.log(`RGBA: ${r} ${g} ${b} ${a}`);

// RGB255 conversion
const [r255, g255, b255] = c1.RGB255();
console.log(`RGB255: ${r255} ${g255} ${b255}`);

// Hex conversion
console.log(`Hex: ${c1.Hex()}`);

// HSV conversion
const [h, s, v] = c1.Hsv();
console.log(`HSV: ${h.toFixed(6)} ${s.toFixed(6)} ${v.toFixed(6)}`);

// HSL conversion
const [h2, s2, l2] = c1.Hsl();
console.log(`HSL: ${h2.toFixed(6)} ${s2.toFixed(6)} ${l2.toFixed(6)}`);

// Lab conversion
const [l, a_val, b_val] = c1.Lab();
console.log(`Lab: ${l.toFixed(6)} ${a_val.toFixed(6)} ${b_val.toFixed(6)}`);

// Test hex parsing
const c2 = GoStyle.Hex('#FF0080');
console.log(`Parsed hex: R=${c2.R.toFixed(6)} G=${c2.G.toFixed(6)} B=${c2.B.toFixed(6)}`);

// Test color distance
const c3 = new GoStyle.Color(0.0, 1.0, 0.0);
const dist = c1.DistanceLab(c3);
console.log(`Distance: ${dist.toFixed(6)}`);

// Test color blending
const blended = c1.BlendLab(c3, 0.5);
console.log(
  `Blended: R=${blended.R.toFixed(6)} G=${blended.G.toFixed(6)} B=${blended.B.toFixed(6)}`
);
