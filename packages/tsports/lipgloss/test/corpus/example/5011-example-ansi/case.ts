import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';

import * as table from '../../../../src/table/index.js';

// Set color profile for consistent output

const s = NewStyle().color(Colors[240] || '#808080').render;

const t = newTable();
t.row('Bubble Tea', s('Milky'));
t.row('Milk Tea', s('Also milky'));
t.row('Actual milk', s('Milky as well'));
console.log(t.render());
