import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
  newTree as createTree,
} from '../../../../src/index.js';
import { rootTree } from '../../../../src/tree/index.js';

// Set color profile for consistent output

const purple = NewStyle().color(Colors[99] || '#800080').marginRight(1);
const pink = NewStyle().color(Colors[212] || '#FF87D7').marginRight(1);

const nyx = rootTree('Nyx').child('Lip Gloss').child('Foundation').enumeratorStyle(pink);

const t = createTree()
  .child('Glossier')
  .child("Claire’s Boutique")
  .child(nyx)
  .child('Mac')
  .child('Milk')
  .enumeratorStyle(purple);

console.log(t.toString());
