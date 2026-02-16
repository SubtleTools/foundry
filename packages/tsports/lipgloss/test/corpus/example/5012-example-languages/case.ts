import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewRenderer,
  NewStyle,
  newList,
  newTable,
  Right,
  VerticalAlignment,
} from '../../../../src/index.js';

import * as table from '../../../../src/table/index.js';

// Set color profile for consistent output

const purple = Colors[99] ?? 'purple';
const gray = Colors[245] ?? 'gray';
const lightGray = Colors[241] ?? 'lightgray';

const re = NewRenderer();

// HeaderStyle is the lipgloss style used for the table headers.
const HeaderStyle = NewStyle().color(purple).bold(true).align(HorizontalAlignment.Center);
// CellStyle is the base lipgloss style used for the table rows.
const CellStyle = NewStyle().padding(0, 1).width(14);
// OddRowStyle is the lipgloss style used for odd-numbered table rows.
const OddRowStyle = CellStyle.color(gray);
// EvenRowStyle is the lipgloss style used for even-numbered table rows.
const EvenRowStyle = CellStyle.color(lightGray);
// BorderStyle is the lipgloss style used for the table border.
const BorderStyle = NewStyle().color(purple);

const rows = [
  ['Chinese', '您好', '你好'],
  ['Japanese', 'こんにちは', 'やあ'],
  ['Arabic', 'أهلين', 'أهلا'],
  ['Russian', 'Здравствуйте', 'Привет'],
  ['Spanish', 'Hola', '¿Qué tal?'],
];

const t = newTable()
  .border(BorderStyles.thick)
  .borderStyle(BorderStyle)
  .styleFunc((row: number, col: number) => {
    let style;

    if (row === table.HeaderRow) {
      return HeaderStyle;
    } else if (row % 2 === 0) {
      style = EvenRowStyle;
    } else {
      style = OddRowStyle;
    }

    // Make the second column a little wider.
    if (col === 1) {
      style = style.width(22);
    }

    // Arabic is a right-to-left language, so right align the text.
    if (row < rows.length && rows[row] && rows[row][0] === 'Arabic' && col !== 0) {
      style = style.align(HorizontalAlignment.Right);
    }

    return style;
  })
  .headers('LANGUAGE', 'FORMAL', 'INFORMAL')
  .rows(...rows);

t.row('English', 'You look absolutely fabulous.', "How's it going?");

console.log(t.toString());
