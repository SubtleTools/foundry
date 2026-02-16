import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';
import { RoundedEnumerator, rootTree, newTree } from '../../../../src/tree/index.js';

// Set color profile for consistent output

const enumeratorStyle = NewStyle().color(Colors[63] || '#5F5FFF').marginRight(1);
const rootStyle = NewStyle().color(Colors[35] || '#00AF5F');
const itemStyle = NewStyle().color(Colors[212] || '#FF87D7');

// Match Go exactly: tree.New().Child() creates a tree without root
const subTree = newTree()
  .child('Gloss Bomb Universal Lip Luminizer')
  .child('Hot Cheeks Velour Blushlighter');

const t = rootTree('⁜ Makeup')
  .child('Glossier')
  .child('Fenty Beauty')
  .child(subTree)  // Pass tree object, not toString()
  .child('Nyx')
  .child('Mac')
  .child('Milk')
  .enumerator(RoundedEnumerator)
  .enumeratorStyle(enumeratorStyle)
  .rootStyle(rootStyle)
  .itemStyle(itemStyle);

console.log(t.toString());
