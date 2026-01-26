/**
 * Generator example - demonstrates PastelGenerator usage
 * Port of examples/generator/main.go
 */

import { MakeColor } from '@tsports/go-colorful';
import { generate, PastelGenerator } from '../src/index.js';
import { writeFileSync } from 'node:fs';

const HTML_HEADER = `
<html>
<body>
	<table width="100%" height="100%">
		<tr>
`;

const CELL = `
			<td bgcolor="%s" />
`;

const HTML_FOOTER = `
		</tr>
	</table>
</body>
</html>
`;

export async function main(): Promise<void> {
  const buffer: string[] = [];
  buffer.push(HTML_HEADER);

  const [colors, err] = await generate(8, new PastelGenerator());
  if (err !== null) {
    throw err;
  }

  for (const c of colors) {
    const [col, ok] = MakeColor(c);
    if (!ok) {
      throw new Error(`invalid RGB color: ${JSON.stringify(c)}`);
    }

    console.log('Color as Hex:', col.hex());
    buffer.push(CELL.replace('%s', col.hex()));
  }

  buffer.push(HTML_FOOTER);
  writeFileSync('palette.html', buffer.join(''));
}

if (import.meta.main) {
  main().catch(console.error);
}
