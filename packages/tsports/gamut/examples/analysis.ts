/**
 * Analysis example - demonstrates various palette generation methods
 * Port of examples/analysis/main.go
 */

import { Hex } from '@tsports/go-colorful';
import {
  monochromatic,
  shades,
  tints,
  tones,
  analogous,
  splitComplementary,
  triadic,
  quadratic,
  tetradic,
  hueOffset,
} from '../src/index.js';
import { header, footer, table } from './htmlgen.js';
import { writeFileSync } from 'node:fs';

export function main(): void {
  const buffer: string[] = [];
  header(buffer);

  const c = Hex('#2F1B82');

  table(buffer, 'Monochromatic', monochromatic(c, 8));
  table(buffer, 'Shades', shades(c, 8));
  table(buffer, 'Tints', tints(c, 8));
  table(buffer, 'Tones', tones(c, 8));
  table(buffer, 'Analogous', analogous(c));
  table(buffer, 'Split Complementary', splitComplementary(c));
  table(buffer, 'Triadic', triadic(c));
  table(buffer, 'Quadratic', quadratic(c));
  table(buffer, 'Tetradic', tetradic(c, hueOffset(c, 60)));

  footer(buffer);
  writeFileSync('palette.html', buffer.join(''));
}

if (import.meta.main) {
  main();
}
