import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  rootTree,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output

const enumeratorStyle = NewStyle().Background(Colors[0] || '#000000').Padding(0, 1);

const headerItemStyle = NewStyle()
  .Background('#ee6ff8')
  .Foreground('#ecfe65')
  .Bold(true)
  .Padding(0, 1);

const itemStyle = headerItemStyle.backgroundColor(Colors[0] || '#000000');

const t = rootTree('# Table of Contents')
  .rootStyle(itemStyle)
  .itemStyle(itemStyle)
  .enumeratorStyle(enumeratorStyle)
  .child(rootTree('## Chapter 1').child('Chapter 1.1').child('Chapter 1.2'))
  .child(rootTree('## Chapter 2').child('Chapter 2.1').child('Chapter 2.2'));

console.log(t.toString());
