/**
 * HTML generator utility for creating color palette visualizations
 * Port of examples/htmlgen/htmlgen.go
 */

import type { Color } from '@tsports/go-colorful';
import { MakeColor } from '@tsports/go-colorful';
import { contrast } from '../src/index.js';

const HTML_HEADER = `
<html>
<body>
`;

const TABLE_CAPTION = `
<h2>%s</h2>
`;

const TABLE_HEADER = `
<table width="100%" height="64">
<tr>
`;

const CELL = `<td bgcolor="%s" align="center"><font face="Courier" color="%s">%s</font></td>`;

const TABLE_FOOTER = `
</tr>
</table>
`;

const HTML_FOOTER = `
</body>
</html>
`;

/**
 * Writes the HTML header to the buffer
 */
export function header(buffer: string[]): void {
  buffer.push(HTML_HEADER);
}

/**
 * Writes the HTML footer to the buffer
 */
export function footer(buffer: string[]): void {
  buffer.push(HTML_FOOTER);
}

/**
 * Writes a colored HTML table cell to the buffer
 */
export function cell(buffer: string[], c: Color): void {
  const [col] = MakeColor(c);
  const [comp] = MakeColor(contrast(c));

  const hexCol = col.hex();
  const hexComp = comp.hex();

  buffer.push(CELL.replace('%s', hexCol).replace('%s', hexComp).replace('%s', hexCol));
}

/**
 * Writes a palette of colors as an HTML table to the buffer
 */
export function table(buffer: string[], name: string, colors: Color[]): void {
  if (name !== '') {
    buffer.push(TABLE_CAPTION.replace('%s', name));
  }
  buffer.push(TABLE_HEADER);
  for (const c of colors) {
    cell(buffer, c);
  }
  buffer.push(TABLE_FOOTER);
}
