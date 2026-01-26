import { Hex, MakeColor } from '@tsports/go-colorful';
import {
  analogous,
  hueOffset,
  monochromatic,
  quadratic,
  shades,
  splitComplementary,
  tetradic,
  tints,
  tones,
  triadic,
} from '#src/index.js';

interface PaletteResult {
  name: string;
  colors: string[];
}

function main() {
  const c = Hex('#2F1B82');

  const results: PaletteResult[] = [
    { name: 'Monochromatic', colors: [] },
    { name: 'Shades', colors: [] },
    { name: 'Tints', colors: [] },
    { name: 'Tones', colors: [] },
    { name: 'Analogous', colors: [] },
    { name: 'Split Complementary', colors: [] },
    { name: 'Triadic', colors: [] },
    { name: 'Quadratic', colors: [] },
    { name: 'Tetradic', colors: [] },
  ];

  // Monochromatic
  for (const color of monochromatic(c, 8)) {
    const [col] = MakeColor(color);
    results[0].colors.push(col.hex());
  }

  // Shades
  for (const color of shades(c, 8)) {
    const [col] = MakeColor(color);
    results[1].colors.push(col.hex());
  }

  // Tints
  for (const color of tints(c, 8)) {
    const [col] = MakeColor(color);
    results[2].colors.push(col.hex());
  }

  // Tones
  for (const color of tones(c, 8)) {
    const [col] = MakeColor(color);
    results[3].colors.push(col.hex());
  }

  // Analogous
  for (const color of analogous(c)) {
    const [col] = MakeColor(color);
    results[4].colors.push(col.hex());
  }

  // Split Complementary
  for (const color of splitComplementary(c)) {
    const [col] = MakeColor(color);
    results[5].colors.push(col.hex());
  }

  // Triadic
  for (const color of triadic(c)) {
    const [col] = MakeColor(color);
    results[6].colors.push(col.hex());
  }

  // Quadratic
  for (const color of quadratic(c)) {
    const [col] = MakeColor(color);
    results[7].colors.push(col.hex());
  }

  // Tetradic
  for (const color of tetradic(c, hueOffset(c, 60))) {
    const [col] = MakeColor(color);
    results[8].colors.push(col.hex());
  }

  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

main();
