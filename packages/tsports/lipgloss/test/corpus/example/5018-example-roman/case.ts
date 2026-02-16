import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';
import { Roman } from '../../../../src/list/index.js';

// Set color profile for consistent output

const enumeratorStyle = NewStyle().color(Colors[99] || '#800080').marginRight(1);
const itemStyle = NewStyle().color(Colors[255] || '#FFFFFF').marginRight(1);

const l = newList('Glossier', 'Claire’s Boutique', 'Nyx', 'Mac', 'Milk')
  .enumerator(Roman)
  .enumeratorStyle(enumeratorStyle)
  .itemStyle(itemStyle);

console.log(l.toString());
