import {
  BorderStyles,
  BorderType,
  Colors,
  Right,
  Center,
  JoinHorizontal,
  JoinVertical,
  NewStyle,
  newList,
  newTable,
} from '../../../../src/index.js';

// Set color profile for consistent output

const labelStyle = NewStyle().color(Colors[241] || '#626262');

const board: string[][] = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

const t = newTable()
  .border(BorderStyles[BorderType.Normal])
  .borderRow(true)
  .borderColumn(true)
  .rows(...board)
  .styleFunc((row: number, col: number) => {
    return NewStyle().padding(0, 1);
  });

const ranks = labelStyle.render([' A', 'B', 'C', 'D', 'E', 'F', 'G', 'H  '].join('   '));
const files = labelStyle.render([' 1', '2', '3', '4', '5', '6', '7', '8 '].join('\n\n '));

console.log(
  JoinVertical(
    Right,
    JoinHorizontal(Center, files, t.toString()),
    ranks
  ) + '\n'
);
