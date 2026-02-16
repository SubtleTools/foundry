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

const l = newList('A', 'B', 'C', newList('D', 'E', 'F').enumerator(Roman), 'G');
console.log(l.toString());
