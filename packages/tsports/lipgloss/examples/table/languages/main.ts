#!/usr/bin/env bun

/**
 * Languages Table Example
 *
 * Demonstrates table with custom styling, alignment, and thick borders
 * Port of: test/archive/go-reference/examples/table/languages/main.go
 */

import { Borders, HeaderRow, HorizontalAlignment, Renderer, Table , SetColorProfile, ColorProfile} from '../../../src/index';

const purple = '99';
const gray = '245';
const lightGray = '241';

function main() {
  const re = new Renderer();
  
  // Set color profile on renderer based on environment variables (like Go reference does)
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    re.setColorProfile(ColorProfile.Ascii);
  } else if (process.env.FORCE_COLOR === '3') {
    re.setColorProfile(ColorProfile.TrueColor);
  } else if (process.env.FORCE_COLOR === '2') {
    re.setColorProfile(ColorProfile.ANSI256);
  } else if (process.env.FORCE_COLOR === '1') {
    re.setColorProfile(ColorProfile.ANSI);
  } else {
    // Default to TrueColor for better output
    re.setColorProfile(ColorProfile.TrueColor);
  }
  
  // HeaderStyle is the lipgloss style used for the table headers.
  const HeaderStyle = re.newStyle().color(purple).bold(true).align(HorizontalAlignment.Center);
  // CellStyle is the base lipgloss style used for the table rows.
  const CellStyle = re.newStyle().padding(0, 1).width(14);
  // OddRowStyle is the lipgloss style used for odd-numbered table rows.
  const OddRowStyle = CellStyle.color(gray);
  // EvenRowStyle is the lipgloss style used for even-numbered table rows.
  const EvenRowStyle = CellStyle.color(lightGray);
  // BorderStyle is the lipgloss style used for the table border.
  const BorderStyle = re.newStyle().color(purple);

  const rows = [
    ['Chinese', '您好', '你好'],
    ['Japanese', 'こんにちは', 'やあ'],
    ['Arabic', 'أهلين', 'أهلا'],
    ['Russian', 'Здравствуйте', 'Привет'],
    ['Spanish', 'Hola', '¿Qué tal?'],
  ];

  const t = new Table()
    .setBorder(Borders.Thick)
    .setBorderStyle(BorderStyle)
    .setStyleFunc((row: number, col: number) => {
      let style;

      switch (true) {
        case row === HeaderRow:
          return HeaderStyle;
        case row % 2 === 0:
          style = EvenRowStyle;
          break;
        default:
          style = OddRowStyle;
      }

      // Make the second column a little wider.
      if (col === 1) {
        style = style.width(22);
      }

      // Arabic is a right-to-left language, so right align the text.
      if (row < rows.length && rows[row][0] === 'Arabic' && col !== 0) {
        style = style.align(HorizontalAlignment.Right);
      }

      return style;
    })
    .setHeaders('LANGUAGE', 'FORMAL', 'INFORMAL')
    .rows(...rows);

  t.row('English', 'You look absolutely fabulous.', "How's it going?");

  console.log(t.render());
}

// Run the example
main();
