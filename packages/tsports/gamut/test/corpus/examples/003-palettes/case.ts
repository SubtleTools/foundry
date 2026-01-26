import type { Color } from '@tsports/go-colorful';
import { Hex, MakeColor } from '@tsports/go-colorful';
import {
  analogous,
  blends,
  generate,
  HappyGenerator,
  hueOffset,
  monochromatic,
  PastelGenerator,
  quadratic,
  SimilarHueGenerator,
  shades,
  splitComplementary,
  tetradic,
  tints,
  tones,
  triadic,
  WarmGenerator,
} from '#src/index.js';

interface PaletteResult {
  name: string;
  colors: string[];
}

function colorSliceToHex(colors: Color[]): string[] {
  return colors.map((c) => {
    const [col] = MakeColor(c);
    return col.hex();
  });
}

async function main() {
  const c = Hex('#2F1B82');
  const cells = 8;

  const results: PaletteResult[] = [];

  // generators
  let [cc] = await generate(cells, new SimilarHueGenerator(c));
  results.push({ name: 'similarhue', colors: colorSliceToHex(cc) });

  [cc] = await generate(cells, new PastelGenerator());
  results.push({ name: 'pastel', colors: colorSliceToHex(cc) });

  [cc] = await generate(cells, new HappyGenerator());
  results.push({ name: 'happy', colors: colorSliceToHex(cc) });

  [cc] = await generate(cells, new WarmGenerator());
  results.push({ name: 'warm', colors: colorSliceToHex(cc) });

  // angular
  results.push({ name: 'triadic', colors: colorSliceToHex(triadic(c)) });
  results.push({ name: 'quadratic', colors: colorSliceToHex(quadratic(c)) });
  results.push({ name: 'tetradic', colors: colorSliceToHex(tetradic(c, hueOffset(c, 60))) });
  results.push({ name: 'analogous', colors: colorSliceToHex(analogous(c)) });
  results.push({ name: 'splitcomplementary', colors: colorSliceToHex(splitComplementary(c)) });

  // color wheel
  results.push({ name: 'monochromatic', colors: colorSliceToHex(monochromatic(c, cells)) });
  results.push({ name: 'shades', colors: colorSliceToHex(shades(c, cells)) });
  results.push({ name: 'tints', colors: colorSliceToHex(tints(c, cells)) });
  results.push({ name: 'tones', colors: colorSliceToHex(tones(c, cells)) });

  // blends
  results.push({ name: 'blends', colors: colorSliceToHex(blends(c, hueOffset(c, 90), cells)) });

  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

main().catch(console.error);
