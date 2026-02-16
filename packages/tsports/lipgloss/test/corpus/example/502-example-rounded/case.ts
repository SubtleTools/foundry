import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';
import { RoundedEnumerator, rootTree } from '../../../../src/tree/index.js';

// Set color profile for consistent output

const itemStyle = NewStyle().marginRight(1);
const enumeratorStyle = NewStyle().color(Colors[8] || '#808080').marginRight(1);

const t = rootTree('Groceries')
  .child(
    rootTree('Fruits').child('Blood Orange', 'Papaya', 'Dragonfruit', 'Yuzu'),
    rootTree('Items').child('Cat Food', 'Nutella', 'Powdered Sugar'),
    rootTree('Veggies').child('Leek', 'Artichoke')
  )
  .itemStyle(itemStyle)
  .enumeratorStyle(enumeratorStyle)
  .enumerator(RoundedEnumerator);

console.log(t.toString());
