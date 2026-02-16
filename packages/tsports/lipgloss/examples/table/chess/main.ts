#!/usr/bin/env bun

/**
 * Chess Board Table Example
 *
 * Demonstrates table with chess board layout and unicode pieces
 * Port of: test/archive/go-reference/examples/table/chess/main.go
 */

import {
  Borders,
  Center,
  JoinHorizontal,
  JoinVertical,
  Renderer,
  Right,
  Table,
  SetColorProfile,
  ColorProfile,
} from '@tsports/lipgloss';

function main() {
  const re = new Renderer();
  
  // Set color profile on renderer based on environment variables (like Go reference does)
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    re.setColorProfile(ColorProfile.Ascii);
  } else if (process.env.FORCE_COLOR === '3') {
    re.setColorProfile(ColorProfile.TrueColor);
  } else if (process.env.FORCE_COLOR === '2') {
    re.setColorProfile(ColorProfile.ANSI256);
  } else if (process.env.FORCE_COLOR === '1') {
    re.setColorProfile(ColorProfile.ANSI);
  } else {
    // Default to TrueColor for better output
    re.setColorProfile(ColorProfile.TrueColor);
  }
  const labelStyle = re.newStyle().color('241');

  const board = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
  ];

  const t = new Table()
    .border(Borders.Normal)
    .borderRow(true)
    .borderColumn(true)
    .rows(...board)
    .styleFunc((row: number, col: number) => {
      return re.newStyle().padding(0, 1);
    });

  const ranks = labelStyle.render([' A', 'B', 'C', 'D', 'E', 'F', 'G', 'H  '].join('   '));
  const files = labelStyle.render([' 1', '2', '3', '4', '5', '6', '7', '8 '].join('\n\n '));

  console.log(JoinVertical(Right, JoinHorizontal(Center, files, t.render()), ranks) + '\n');
}

// Run the example
main();
