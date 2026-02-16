import { Hex, MakeColor } from '@tsports/go-colorful';
import { splitComplementary } from './src/index.js';

const c = Hex('#2F1B82');
const colors = splitComplementary(c);

console.log('Split Complementary colors:');
for (const color of colors) {
  const [col] = MakeColor(color);
  const [h, s, v] = col.hsv();
  console.log(`${col.hex()} - HSV(${h.toFixed(6)}, ${s.toFixed(6)}, ${v.toFixed(6)})`);
}
