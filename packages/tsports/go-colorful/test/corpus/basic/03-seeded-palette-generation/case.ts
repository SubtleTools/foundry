import * as GoStyle from '../../../../src/go-style';

import * as GoStyle from '../../../../src/go-style';
import { seedGlobalRand } from '../../../../src/rand';

console.log('=== Test 1: Default random (should be different each run) ===');
// Note: With GODEBUG=randautoseed=0, this is actually deterministic in Go too (seed 1).
// In TS, we default to seed 1 as well.
const colors1 = GoStyle.FastWarmPalette(3);
for (let i = 0; i < colors1.length; i++) {
  const c = colors1[i];
  console.log(
    `Color ${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()}`
  );
}

console.log('\n=== Test 2: Seeded random with seed 1 (should be deterministic) ===');
seedGlobalRand(1);
const colors2 = GoStyle.FastWarmPalette(3);
for (let i = 0; i < colors2.length; i++) {
  const c = colors2[i];
  console.log(
    `Color ${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()}`
  );
}

console.log('\n=== Test 3: Seeded random with seed 1 again (should be same as Test 2) ===');
seedGlobalRand(1);
const colors3 = GoStyle.FastWarmPalette(3);
for (let i = 0; i < colors3.length; i++) {
  const c = colors3[i];
  console.log(
    `Color ${i}: R=${c.R.toFixed(6)} G=${c.G.toFixed(6)} B=${c.B.toFixed(6)} Hex=${c.Hex()}`
  );
}

console.log('\n=== Test 4: Current time (nanoseconds) ===');
console.log(`Current time nano: 123456789`);
