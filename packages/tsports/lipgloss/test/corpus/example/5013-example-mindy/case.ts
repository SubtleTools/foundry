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

const rowLength = 12;
const labelStyle = NewStyle().width(3).align(HorizontalAlignment.Right);
const swatchStyle = NewStyle().width(6);

const data: string[][] = [];
for (let i = 0; i < 13; i += 8) {
  data.push(makeRow(i, i + 5));
}
data.push(makeEmptyRow());
for (let i = 6; i < 15; i += 8) {
  data.push(makeRow(i, i + 1));
}
data.push(makeEmptyRow());
for (let i = 16; i < 231; i += 6) {
  data.push(makeRow(i, i + 5));
}
data.push(makeEmptyRow());
for (let i = 232; i < 256; i += 6) {
  data.push(makeRow(i, i + 5));
}

const t = newTable()
  .border(BorderStyles.hidden)
  .rows(...data)
  .styleFunc((row: number, col: number) => {
    const color = data[row]?.[col - (col % 2)] ?? '';
    if (col % 2 === 0) {
      return labelStyle.color(color || 'white');
    } else {
      return swatchStyle.backgroundColor(color || 'black');
    }
  });

console.log(t.toString());

function makeRow(start: number, end: number): string[] {
  const row: string[] = [];
  for (let i = start; i <= end; i++) {
    row.push(i.toString());
    row.push('');
  }
  for (let i = row.length; i < rowLength; i++) {
    row.push('');
  }
  return row;
}

function makeEmptyRow(): string[] {
  return makeRow(0, -1);
}
