import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';

import * as list from '../../../../src/list/index.js';

// Set color profile for consistent output

const duckDuckGooseEnumerator = (items: any, i: number): string => {
  const item = items.at(i);
  if (item && item.value() === 'Goose') {
    return 'Honk →';
  }
  return ' ';
};

const enumStyle = NewStyle().color('#00d787').marginRight(1);
const itemStyle = NewStyle().color(Colors[255] || '#FFFFFF');

const l = newList('Duck', 'Duck', 'Duck', 'Goose', 'Duck')
  .itemStyle(itemStyle)
  .enumeratorStyle(enumStyle)
  .enumerator(duckDuckGooseEnumerator);
console.log(l.render());
