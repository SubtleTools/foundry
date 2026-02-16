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

interface Document {
  name: string;
  time: string;
}

const faint = NewStyle().faint(true);

function documentToString(d: Document): string {
  return d.name + '\n' + faint.render(d.time);
}

const docs: Document[] = [
  { name: 'README.md', time: '2 minutes ago' },
  { name: 'Example.md', time: '1 hour ago' },
  { name: 'secrets.md', time: '1 week ago' },
];

const selected = 1;

const baseStyle = NewStyle().marginBottom(1).marginLeft(1);

const dimColor = Colors[250] || '#C0C0C0';
const highlightColor = '#EE6FF8';

function itemEnumerator(items: any, i: number): string {
  if (i === selected) {
    return '│\n│';
  }
  return ' ';
}

function itemStyleFunc(items: any, i: number): any {
  const st = baseStyle;
  if (selected === i) {
    return st.color(highlightColor);
  }
  return st.color(dimColor);
}

function enumeratorStyleFunc(items: any, i: number): any {
  if (selected === i) {
    return NewStyle().color(highlightColor);
  }
  return NewStyle().color(dimColor);
}

const l = newList()
  .enumerator(itemEnumerator)
  .itemStyleFunc(itemStyleFunc)
  .enumeratorStyleFunc(enumeratorStyleFunc);

for (const d of docs) {
  l.item(documentToString(d));
}

console.log();
console.log(l.toString());
