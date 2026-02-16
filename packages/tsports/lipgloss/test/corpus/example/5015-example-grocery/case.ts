import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output

const purchased: string[] = [
  'Bananas',
  'Barley',
  'Cashews',
  'Coconut Milk',
  'Dill',
  'Eggs',
  'Fish Cake',
  'Leeks',
  'Papaya',
];

function groceryEnumerator(items: any, i: number): string {
  for (const p of purchased) {
    if (items.at(i).value() === p) {
      return '✓';
    }
  }
  return '•';
}

const dimEnumStyle = NewStyle().color(Colors[240] || '#808080').marginRight(1);

const highlightedEnumStyle = NewStyle().color(Colors[10] || '#00FF00').marginRight(1);

function enumStyleFunc(items: any, i: number) {
  for (const p of purchased) {
    if (items.at(i).value() === p) {
      return highlightedEnumStyle;
    }
  }
  return dimEnumStyle;
}

function itemStyleFunc(items: any, i: number) {
  const itemStyle = NewStyle().color(Colors[255] || '#FFFFFF');
  for (const p of purchased) {
    if (items.at(i).value() === p) {
      return itemStyle.strikethrough(true);
    }
  }
  return itemStyle;
}

const l = newList(
  'Artichoke',
  'Baking Flour',
  'Bananas',
  'Barley',
  'Bean Sprouts',
  'Cashew Apple',
  'Cashews',
  'Coconut Milk',
  'Curry Paste',
  'Currywurst',
  'Dill',
  'Dragonfruit',
  'Dried Shrimp',
  'Eggs',
  'Fish Cake',
  'Furikake',
  'Jicama',
  'Kohlrabi',
  'Leeks',
  'Lentils',
  'Licorice Root'
)
  .enumerator(groceryEnumerator)
  .enumeratorStyleFunc(enumStyleFunc)
  .itemStyleFunc(itemStyleFunc);

console.log(l.toString());
