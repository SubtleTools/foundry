/**
 * Palettes example - comprehensive showcase of all palette generation methods
 * Port of examples/palettes/main.go
 */

import { writeFileSync } from 'node:fs';
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
} from '../src/index.js';

const c = Hex('#2F1B82');
const cells = 8;

const HTML_HEADER = `
<html>
<body bgcolor="white" style="margin: 0; padding: 0;">
	<table width="100%" height="48">
		<tr>
`;

const CELL = `<td bgcolor="%s" />`;

const HTML_FOOTER = `
		</tr>
	</table>
</body>
</html>
`;

function palette(name: string, colors: Color[]): void {
  const buffer: string[] = [];
  buffer.push(HTML_HEADER);

  for (const color of colors) {
    const [col] = MakeColor(color);
    buffer.push(CELL.replace('%s', col.hex()));
  }

  buffer.push(HTML_FOOTER);
  writeFileSync(`palette_${name}.html`, buffer.join(''));
}

export async function main(): Promise<void> {
  // generators
  let [cc] = await generate(cells, new SimilarHueGenerator(c));
  palette('similarhue', cc);

  [cc] = await generate(cells, new PastelGenerator());
  palette('pastel', cc);

  [cc] = await generate(cells, new HappyGenerator());
  palette('happy', cc);

  [cc] = await generate(cells, new WarmGenerator());
  palette('warm', cc);

  // angular
  palette('triadic', triadic(c));
  palette('quadratic', quadratic(c));
  palette('tetradic', tetradic(c, hueOffset(c, 60)));
  palette('analogous', analogous(c));
  palette('splitcomplementary', splitComplementary(c));

  // color wheel
  palette('monochromatic', monochromatic(c, cells));
  palette('shades', shades(c, cells));
  palette('tints', tints(c, cells));
  palette('tones', tones(c, cells));

  // blends
  palette('blends', blends(c, hueOffset(c, 90), cells));
}

if (import.meta.main) {
  main().catch(console.error);
}
