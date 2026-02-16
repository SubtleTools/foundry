import * as GoStyle from '../../../../src/go-style';

console.log('=== Go Seeded FastWarmPalette Test ===');

// Test with seed = 1
const colors1 = GoStyle.FastWarmPaletteSeeded(3, 1);
for (let i = 0; i < colors1.length; i++) {
  const c = colors1[i];
  console.log(
    `Seed1-Color${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()}`
  );
}

console.log('\n=== Go Seeded FastHappyPalette Test ===');

// Test with seed = 1 for happy palette
const happyColors = GoStyle.FastHappyPaletteSeeded(2, 1);
for (let i = 0; i < happyColors.length; i++) {
  const c = happyColors[i];
  console.log(
    `Seed1-Happy${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()}`
  );
}

console.log('\n=== Go Seeded Test with Different Seed ===');

// Test with seed = 42 for comparison
const colors42 = GoStyle.FastWarmPaletteSeeded(2, 42);
for (let i = 0; i < colors42.length; i++) {
  const c = colors42[i];
  console.log(
    `Seed42-Color${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()}`
  );
}
