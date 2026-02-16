#!/usr/bin/env bun

/**
 * Complex Sublist Example
 *
 * Demonstrates deeply nested lists with various styles and enumerators
 * Port of: test/archive/go-reference/examples/list/sublist/main.go
 */

import {
  ColorUtils,
  Dash,
  HorizontalAlignment,
  JoinHorizontal,
  JoinVertical,
  Left,
  List,
  newList,
  newTree,
  NewStyle,
  Renderer,
  Right,
  Roman,
  type StyleFunc,
  Table,
  VerticalAlignment,
  Items,
  SetColorProfile,
  ColorProfile,
} from '../../../src/index';
import * as colorful from '@tsports/go-colorful/go-style';

function main() {
  // Set color profile based on environment variables (like Go reference does)
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    SetColorProfile(ColorProfile.Ascii);
  } else if (process.env.FORCE_COLOR === '3') {
    SetColorProfile(ColorProfile.TrueColor);
  } else if (process.env.FORCE_COLOR === '2') {
    SetColorProfile(ColorProfile.ANSI256);
  } else if (process.env.FORCE_COLOR === '1') {
    SetColorProfile(ColorProfile.ANSI);
  }
  
  const purple = NewStyle().color('99').marginRight(1);

  const pink = NewStyle().color('212').marginRight(1);

  const base = NewStyle().marginBottom(1).marginLeft(1);

  const faint = NewStyle().faint(true);

  const dim = '250';
  const highlight = '#EE6FF8';

  const special = '#73F59F'; // Using dark theme color

  const checklistEnumStyle = (items: Items, index: number): StyleFunc => {
    switch (index) {
      case 1:
      case 2:
      case 4:
        return NewStyle().color(special).paddingRight(1);
      default:
        return NewStyle().paddingRight(1);
    }
  };

  const checklistEnum = (items: Items, index: number): string => {
    switch (index) {
      case 1:
      case 2:
      case 4:
        return '✓';
      default:
        return '•';
    }
  };

  const checklistStyle = (items: Items, index: number): StyleFunc => {
    switch (index) {
      case 1:
      case 2:
      case 4:
        return NewStyle().strikethrough(true).color('#696969'); // Using dark theme color
      default:
        return NewStyle();
    }
  };

  const colors = colorGrid(1, 5);

  const titleStyle = NewStyle().italic(true).color('#FFF7DB');

  const lipglossStyleFunc = (items: Items, index: number): StyleFunc => {
    if (index === items.length() - 1) {
      return titleStyle
        .padding(1, 2)
        .margin(0, 0, 1, 0)
        .maxWidth(20)
        .backgroundColor(colors[index][0]);
    }
    return titleStyle
      .padding(0, 5 - index, 0, index + 2)
      .maxWidth(20)
      .backgroundColor(colors[index][0]);
  };

  const history =
    'Medieval quince preserves, which went by the French name cotignac, produced in a clear version and a fruit pulp version, began to lose their medieval seasoning of spices in the 16th century. In the 17th century, La Varenne provided recipes for both thick and clear cotignac.';

  const l = newList()
    .enumeratorStyle(purple)
    .item('Lip Gloss')
    .item('Blush')
    .item('Eye Shadow')
    .item('Mascara')
    .item('Foundation')
    .item(
      newList()
        .enumeratorStyle(pink)
        .item('Citrus Fruits to Try')
        .item(
          newList()
            .itemStyleFunc(checklistStyle)
            .enumeratorStyleFunc(checklistEnumStyle)
            .enumerator(checklistEnum)
            .item('Grapefruit')
            .item('Yuzu')
            .item('Citron')
            .item('Kumquat')
            .item('Pomelo')
        )
        .item('Actual Lip Gloss Vendors')
        .item(
          newList()
            .itemStyleFunc(checklistStyle)
            .enumeratorStyleFunc(checklistEnumStyle)
            .enumerator(checklistEnum)
            .item('Glossier')
            .item('Claire‘s Boutique')
            .item('Nyx')
            .item('Mac')
            .item('Milk')
            .item(
              newList()
                .enumeratorStyle(purple)
                .enumerator(Dash)
                .itemStyleFunc(lipglossStyleFunc)
                .item('Lip Gloss')
                .item('Lip Gloss')
                .item('Lip Gloss')
                .item('Lip Gloss')
                .item(
                  newList()
                    .enumeratorStyle(NewStyle().color(colors[4][0]).marginRight(1))
                    .item('\nStyle Definitions for Nice Terminal Layouts\n─────')
                    .item('From Charm')
                    .item('https://github.com/charmbracelet/lipgloss')
                    .item(
                      newList()
                        .enumeratorStyle(NewStyle().color(colors[3][0]).marginRight(1))
                        .item('Emperors: Julio-Claudian dynasty')
                        .item(
                          NewStyle()
                            .padding(1)
                            .render(
                              newList('Augustus', 'Tiberius', 'Caligula', 'Claudius', 'Nero')
                                .enumerator(Roman)
                                .render()
                            )
                        )
                        .item(
                          NewStyle()
                            .bold(true)
                            .color('#FAFAFA')
                            .backgroundColor('#7D56F4')
                            .align(HorizontalAlignment.Center)
                            .valign(VerticalAlignment.Center)
                            .padding(1, 3)
                            .margin(0, 1, 1, 1)
                            .width(40)
                            .render(history)
                        )
                        .item(
                          new Table()
                            .width(30)
                            .borderStyle(purple.marginRight(0))
                            .styleFunc((row: number, col: number): StyleFunc => {
                              let style = NewStyle();

                              if (col === 0) {
                                style = style.align(HorizontalAlignment.Center);
                              } else {
                                style = style.align(HorizontalAlignment.Right).paddingRight(2);
                              }
                              if (row === 0) {
                                return style
                                  .bold(true)
                                  .align(HorizontalAlignment.Center)
                                  .paddingRight(0);
                              }
                              return style.faint(true);
                            })
                            .headers('ITEM', 'QUANTITY')
                            .row('Apple', '6')
                            .row('Banana', '10')
                            .row('Orange', '2')
                            .row('Strawberry', '12')
                            .render()
                        )
                        .item('Documents')
                        .item(
                          newList()
                            .enumerator((_: Items, i: number): string => {
                              if (i === 1) {
                                return '│\n│';
                              }
                              return ' ';
                            })
                            .itemStyleFunc((_: Items, i: number): StyleFunc => {
                              if (i === 1) {
                                return base.color(highlight);
                              }
                              return base.color(dim);
                            })
                            .enumeratorStyleFunc((_: Items, i: number): StyleFunc => {
                              if (i === 1) {
                                return NewStyle().color(highlight);
                              }
                              return NewStyle().color(dim);
                            })
                            .item('Foo Document\n' + faint.render('1 day ago'))
                            .item('Bar Document\n' + faint.render('2 days ago'))
                            .item('Baz Document\n' + faint.render('10 minutes ago'))
                            .item('Qux Document\n' + faint.render('1 month ago'))
                        )
                        .item('EOF')
                    )
                    .item('go get github.com/charmbracelet/lipgloss/list\n')
                )
                .item('See ya later')
            )
        )
        .item('List')
    )
    .item('xoxo, Charm_™');

  console.log(l.render());
}

function colorGrid(xSteps: number, ySteps: number): string[][] {
  // Create 2D gradient like Go version using LUV color space blending
  // This matches the Go implementation which uses BlendLuv for perceptually uniform gradients
  const x0y0 = colorful.Hex('#F25D94'); // Top-left: pink
  const x1y0 = colorful.Hex('#EDFF82'); // Top-right: yellow-green
  const x0y1 = colorful.Hex('#643AFF'); // Bottom-left: purple
  const x1y1 = colorful.Hex('#14F9D5'); // Bottom-right: cyan

  const grid: string[][] = [];

  // Build left edge colors
  const x0: colorful.Color[] = [];
  for (let i = 0; i < ySteps; i++) {
    x0.push(x0y0.BlendLuv(x0y1, i / ySteps));
  }

  // Build right edge colors
  const x1: colorful.Color[] = [];
  for (let i = 0; i < ySteps; i++) {
    x1.push(x1y0.BlendLuv(x1y1, i / ySteps));
  }

  // Blend between left and right edges
  for (let y = 0; y < ySteps; y++) {
    const row: string[] = [];
    const y0 = x0[y]!;
    for (let x = 0; x < xSteps; x++) {
      row.push(y0.BlendLuv(x1[y]!, x / xSteps).Hex());
    }
    grid.push(row);
  }

  return grid;
}

// Run the example
main();
