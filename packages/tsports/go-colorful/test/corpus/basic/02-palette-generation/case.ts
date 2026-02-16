import * as GoStyle from '../../../../src/go-style';

// Test fast palette generation (deterministic)
const colors = GoStyle.FastWarmPalette(3);
console.log(`FastWarmPalette count: ${colors.length}`);
for (let i = 0; i < colors.length; i++) {
  const c = colors[i];
  console.log(
    `Color ${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()}`
  );
}

// Test fast happy palette
const happyColors = GoStyle.FastHappyPalette(2);
console.log(`FastHappyPalette count: ${happyColors.length}`);
for (let i = 0; i < happyColors.length; i++) {
  const c = happyColors[i];
  console.log(
    `Happy ${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()}`
  );
}

// Test color creation from different spaces
const hslColor = GoStyle.Hsl(120.0, 1.0, 0.5); // Green from HSL
console.log(
  `HSL Color: R=${hslColor.R.toFixed(6)} G=${hslColor.G.toFixed(6)} B=${hslColor.B.toFixed(6)} Hex=${hslColor.Hex()}`
);

const hsvColor = GoStyle.Hsv(240.0, 1.0, 1.0); // Blue from HSV
console.log(
  `HSV Color: R=${hsvColor.R.toFixed(6)} G=${hsvColor.G.toFixed(6)} B=${hsvColor.B.toFixed(6)} Hex=${hsvColor.Hex()}`
);
