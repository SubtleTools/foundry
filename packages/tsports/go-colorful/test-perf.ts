// Quick performance test of our TypeScript implementation
import { FastWarmPalette } from './src/palettes';

console.log('Testing FastWarmPalette(3)...');
const start = Date.now();
const palette = FastWarmPalette(3);
const end = Date.now();

console.log(`Generated ${palette.length} colors in ${end - start}ms`);
console.log('Colors:', palette.map(c => c.hex()));