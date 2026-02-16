import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';
import { newTree, rootTree } from '../../../../src/tree/index.js';

// Set color profile for consistent output

const t = rootTree('.')
  .child('macOS')
  .child(rootTree('Linux').child('NixOS').child('Arch Linux (btw)').child('Void Linux'))
  .child(rootTree('BSD').child('FreeBSD').child('OpenBSD'));

console.log(t.toString());
