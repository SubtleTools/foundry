#!/usr/bin/env bun

/**
 * Layout Demo - Advanced Lipgloss TypeScript Layout Features
 *
 * This example demonstrates various Lip Gloss style and layout features.
 * It's a direct port of the Go layout example showcasing:
 * - Tab navigation UI
 * - Complex title sections with color gradients
 * - Interactive dialogs
 * - Multi-column layouts
 * - Color grids
 * - Status bars
 * - Historical content sections
 *
 * Port of: tests/lipgloss/examples/layout/main.go
 */

import type { Style } from '../../src/style';
import {
  BorderType,
  Bottom,
  Center,
  ColorProfile,
  GetColorProfile,
  HorizontalAlignment,
  JoinHorizontal,
  JoinVertical,
  Left,
  NewStyle,
  Place,
  Right,
  SetColorProfile,
  SetHasDarkBackground,
  Top,
  VerticalAlignment,
  Width,
  WithWhitespaceChars,
  WithWhitespaceForeground,
} from '../../src/index';

// Import from gamut
import { hex, toHex, blends, type ColorfulColor as Color } from '@tsports/gamut';

// Constants
const WIDTH = 104;
const COLUMN_WIDTH = 30;

// Color definitions (using dark theme colors for consistency)
const normal = '#EEEEEE';
const subtle = '#383838';
const highlight = '#7D56F3';
const special = '#73F59F';

// Create color blends (using Lab space like Go's gamut.Blends)
const colorBlends = blends(hex('#F25D94'), hex('#EDFF82'), 50).map(c => toHex(c));

// Base styles
const base = NewStyle().color(normal);

const divider = NewStyle().padding(0, 1).color(subtle).render('•');

const url = (text: string) => NewStyle().color(special).render(text);

// Tab styles - using Go-compatible API
const activeTabBorder = {
  top: '─',
  bottom: ' ',
  left: '│',
  right: '│',
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '┘',
  bottomRight: '└',
};

const tabBorder = {
  top: '─',
  bottom: '─',
  left: '│',
  right: '│',
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '┴',
  bottomRight: '┴',
};

const tab = NewStyle().border(tabBorder, true, true, true, true).borderColor(highlight).padding(0, 1);

const activeTab = NewStyle()
  .border(activeTabBorder, true, true, true, true)
  .borderColor(highlight)
  .padding(0, 1);

const tabGap = tab.copy().borderTop(false).borderLeft(false).borderRight(false);
// Keep the inherited padding from tab (0, 1) like Go version

// Title styles
const titleStyle = NewStyle()
  .marginLeft(1)
  .marginRight(5)
  .padding(0, 1)
  .italic(true)
  .foreground('#FFF7DB');

const descStyle = NewStyle().marginTop(1).foreground(normal);

const infoStyle = NewStyle()
  .borderStyle(BorderType.Normal)
  .borderTop(true)
  .foreground(normal)
  .borderForeground(subtle);

// Dialog styles
const dialogBoxStyle = NewStyle()
  .border(BorderType.Rounded, true)
  .borderForeground('#874BFD')
  .padding(1, 0);

const buttonStyle = NewStyle()
  .foreground('#FFF7DB')
  .background('#888B7E')
  .padding(0, 3)
  .marginTop(1);

const activeButtonStyle = buttonStyle
  .foreground('#FFF7DB')
  .background('#F25D94')
  .marginRight(2)
  .underline(true);

// List styles
const list = NewStyle()
  .border(BorderType.Normal, false, true, false, false)
  .borderForeground(subtle)
  .marginRight(2)
  .height(8)
  .width(COLUMN_WIDTH + 1);

const listHeader = (text: string) =>
  base
    .borderStyle(BorderType.Normal)
    .borderBottom(true)
    .borderForeground(subtle)
    .marginRight(2)
    .render(text);

const listItem = (text: string) => base.paddingLeft(2).render(text);

const checkMark = NewStyle().foreground(special).paddingRight(1).render('✓');

const listDone = (text: string) => {
  return checkMark + NewStyle().strikethrough(true).foreground('#696969').render(text);
};

// History styles
const historyStyle = NewStyle()
  .align(HorizontalAlignment.Left)
  .foreground('#FAFAFA')
  .background(highlight)
  .margin(1, 3, 0, 0)
  .padding(1, 2)
  .height(19)
  .width(COLUMN_WIDTH);

// Status bar styles
const statusNugget = NewStyle().foreground('#FFFDF5').padding(0, 1);

const statusBarStyle = NewStyle().foreground('#C1C6B2').background('#353533');

const statusStyle = NewStyle()
  .inherit(statusBarStyle)
  .foreground('#FFFDF5')
  .background('#FF5F87')
  .padding(0, 1)
  .marginRight(1);

const encodingStyle = statusNugget.background('#A550DF').align(HorizontalAlignment.Right);

const statusText = NewStyle().inherit(statusBarStyle);

const fishCakeStyle = statusNugget.background('#6124DF');

// Page style
const docStyle = NewStyle().padding(1, 2, 1, 2);

// Helper functions (formerly Color class here)

function colorGrid(xSteps: number, ySteps: number): string[][] {
  // Use exact same color space blending as Go's (Lab via gamut usually, or consistency with rainbow)
  const x0y0 = hex('#F25D94'); // Top-left: pink
  const x1y0 = hex('#EDFF82'); // Top-right: yellow-green
  const x0y1 = hex('#643AFF'); // Bottom-left: purple
  const x1y1 = hex('#14F9D5'); // Bottom-right: cyan

  // Create left and right edge blends
  const x0: Color[] = [];
  for (let i = 0; i < ySteps; i++) {
    const t = ySteps > 1 ? i / ySteps : 0;
    x0[i] = x0y0.blendLuv(x0y1, t);
  }

  const x1: Color[] = [];
  for (let i = 0; i < ySteps; i++) {
    const t = ySteps > 1 ? i / ySteps : 0;
    x1[i] = x1y0.blendLuv(x1y1, t);
  }

  // Create grid by blending between left and right edges
  const grid: string[][] = [];
  for (let x = 0; x < ySteps; x++) {
    const row: string[] = [];
    const y0 = x0[x];
    for (let y = 0; y < xSteps; y++) {
      const t = xSteps > 1 ? y / xSteps : 0;
      const color = y0.blendLuv(x1[x], t);
      row.push(toHex(color));
    }
    grid.push(row);
  }

  return grid;
}

function max(a: number, b: number): number {
  return a > b ? a : b;
}

function rainbow(baseStyle: Style, text: string, colors: string[]): string {
  // Match Go exactly: apply color per character like the Go version does
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const colorIndex = i % colors.length;
    const char = text[i];
    const color = colors[colorIndex];
    result += baseStyle.foreground(color).render(char);
  }
  return result;
}

function main() {
  // Respect NO_COLOR and FORCE_COLOR environment variables first
  // Only force TrueColor if no explicit color control is set
  if (!process.env.NO_COLOR && process.env.FORCE_COLOR !== '0') {
    // ALWAYS force TrueColor output to match Go behavior exactly
    // The Go version creates a custom renderer that outputs colors regardless of TTY status
    SetColorProfile(ColorProfile.TrueColor);
    SetHasDarkBackground(true);

    // Force color output like the Go version
    process.env.FORCE_COLOR = '3';
  } else {
    // Respect the environment's color preference
    // NO_COLOR=1 or FORCE_COLOR=0 means no colors
    SetColorProfile(ColorProfile.Ascii);
  }

  // Get terminal width (simplified - in real app would use process.stdout.columns)
  // Set to exactly match the expected final output width
  const physicalWidth = 195;
  let doc = '';

  // Initial spacing is handled by docStyle.padding

  // Tabs
  {
    const row = JoinHorizontal(
      Top,
      activeTab.render('Lip Gloss'),
      tab.render('Blush'),
      tab.render('Eye Shadow'),
      tab.render('Mascara'),
      tab.render('Foundation')
    );

    const gap = tabGap.render(' '.repeat(max(0, WIDTH - Width(row) - 2)));
    const finalRow = JoinHorizontal(Bottom, row, gap);
    doc += finalRow + '\n\n';
  }

  // Title
  {
    const colors = colorGrid(1, 5);
    let title = '';

    for (let i = 0; i < colors.length; i++) {
      const offset = 2;
      const color = colors[i][0];
      const styledTitle = titleStyle
        .marginLeft(i * offset)
        .background(color)
        .render('Lip Gloss');
      title += styledTitle;
      if (i < colors.length - 1) {
        title += '\n';
      }
    }

    const desc = JoinVertical(
        Left,
        descStyle.render('Style Definitions for Nice Terminal Layouts'),
        infoStyle.render('From Charm' + divider + url('https://github.com/charmbracelet/lipgloss'))
      );
  
      const row = JoinHorizontal(Top, title, desc);
      doc += row + '\n\n';
    }
  
    // Dialog
    {
      const okButton = activeButtonStyle.render('Yes');
      const cancelButton = buttonStyle.render('Maybe');
  
      // Create question with proper width and alignment like Go version
      const plainText = 'Are you sure you want to eat marmalade?';
      // Use the same color blends as Go version
      const rainbowText = rainbow(NewStyle(), plainText, colorBlends);
  
      const question = NewStyle().width(50).align(HorizontalAlignment.Center).render(rainbowText);
  
      const buttons = JoinHorizontal(Top, okButton, cancelButton);
      const ui = JoinVertical(Center, question, buttons);
  
      const dialog = Place(
        WIDTH,
        9,
        Center,
        Center,
        dialogBoxStyle.render(ui),
        (() => {
          const opts: any = {};
          WithWhitespaceChars('猫咪')(opts);
          WithWhitespaceForeground(subtle)(opts);
          return opts;
        })()
      );
  
      doc += dialog + '\n\n';
    }
  
    // Color grid
    const colorGridResult = (() => {
      const colors = colorGrid(14, 8);
      let result = '';
  
      for (const row of colors) {
        for (const color of row) {
          const colorBlock = NewStyle().background(color).render('  ');
          result += colorBlock;
        }
        result += '\n';
      }
  
      return result;
    })();
  
    // Lists
    const lists = JoinHorizontal(
      Top,
      list.render(
        JoinVertical(
          Left,
          listHeader('Citrus Fruits to Try'),
          listDone('Grapefruit'),
          listDone('Yuzu'),
          listItem('Citron'),
          listItem('Kumquat'),
          listItem('Pomelo')
        )
      ),
      list
        .width(COLUMN_WIDTH)
        .render(
          JoinVertical(
            Left,
            listHeader('Actual Lip Gloss Vendors'),
            listItem('Glossier'),
            listItem('Claire\u2018s Boutique'),
            listDone('Nyx'),
            listItem('Mac'),
            listDone('Milk')
          )
        )
    );
  
    doc += JoinHorizontal(Top, lists, colorGridResult);
  
    // Marmalade history
    {
      const historyA =
        'The Romans learned from the Greeks that quinces slowly cooked with honey would \u201cset\u201d when cool. The Apicius gives a recipe for preserving whole quinces, stems and leaves attached, in a bath of honey diluted with defrutum: Roman marmalade. Preserves of quince and lemon appear (along with rose, apple, plum and pear) in the Book of ceremonies of the Byzantine Emperor Constantine VII Porphyrogennetos.';
      const historyB =
        'Medieval quince preserves, which went by the French name cotignac, produced in a clear version and a fruit pulp version, began to lose their medieval seasoning of spices in the 16th century. In the 17th century, La Varenne provided recipes for both thick and clear cotignac.';
      const historyC =
        'In 1524, Henry VIII, King of England, received a \u201cbox of marmalade\u201d from Mr. Hull of Exeter. This was probably marmelada, a solid quince paste from Portugal, still made and sold in southern Europe today. It became a favourite treat of Anne Boleyn and her ladies in waiting.';
  
      const historySection = JoinHorizontal(
        Top,
        historyStyle.align(HorizontalAlignment.Right).render(historyA),
        historyStyle.align(HorizontalAlignment.Center).render(historyB),
        historyStyle.marginRight(0).render(historyC)
      );
  
      doc += historySection + '\n\n';
    }
  
    // Status bar
    {
      const statusKey = statusStyle.render('STATUS');
      const encoding = encodingStyle.render('UTF-8');
      const fishCake = fishCakeStyle.render('🍥 Fish Cake');
      const statusVal = statusText
        .width(WIDTH - Width(statusKey) - Width(encoding) - Width(fishCake))
        .render('Ravishing');
  
      const bar = JoinHorizontal(Top, statusKey, statusVal, encoding, fishCake);
  
      doc += statusBarStyle.width(WIDTH).render(bar);
    }
  
    // Apply MaxWidth to the document content before docStyle (like Go does)
    let processedDoc = doc;
    if (physicalWidth > 0) {
      // Create a temporary style just for MaxWidth constraint
      const constraintStyle = NewStyle().width(physicalWidth - 4); // Subtract padding: 2 left + 2 right
      processedDoc = constraintStyle.render(doc);
    }
  
    // Then apply docStyle (padding) to the constrained content
    const finalResult = docStyle.render(processedDoc);
  
    // Print the result
    console.log(finalResult);
  }
  
  // Run the demo
  main();
