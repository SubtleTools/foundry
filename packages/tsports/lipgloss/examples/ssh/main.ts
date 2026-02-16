#!/usr/bin/env bun

/**
 * SSH-Style Renderer Example
 *
 * Demonstrates custom renderer usage and terminal capability detection
 * Simplified port of: test/archive/go-reference/examples/ssh/main.go
 *
 * Note: This is a simplified version that demonstrates the lipgloss concepts
 * without the SSH server complexity. The original Go example creates an SSH
 * server using the Wish library, which doesn't have a direct TypeScript equivalent.
 */

import {
  Center,
  ColorProfile,
  GetColorProfile,
  HasDarkBackground,
  Height,
  NewRenderer,
  NewStyle,
  Place,
  SetColorProfile,
  SetHasDarkBackground,
  WithWhitespaceChars,
  WithWhitespaceForeground,
} from '../../src/index';

// Available styles.
interface Styles {
  bold: any;
  faint: any;
  italic: any;
  underline: any;
  strikethrough: any;
  red: any;
  green: any;
  yellow: any;
  blue: any;
  magenta: any;
  cyan: any;
  gray: any;
}

// Create new styles against a given renderer.
function makeStyles(): Styles {
  return {
    bold: NewStyle().render('bold').replace('bold', NewStyle().bold(true).render('bold')),
    faint: NewStyle().render('faint').replace('faint', NewStyle().faint(true).render('faint')),
    italic: NewStyle().render('italic').replace('italic', NewStyle().italic(true).render('italic')),
    underline: NewStyle()
      .render('underline')
      .replace('underline', NewStyle().underline(true).render('underline')),
    strikethrough: NewStyle()
      .render('strikethrough')
      .replace('strikethrough', NewStyle().strikethrough(true).render('strikethrough')),
    red: NewStyle().color('#E88388').render('red'),
    green: NewStyle().color('#A8CC8C').render('green'),
    yellow: NewStyle().color('#DBAB79').render('yellow'),
    blue: NewStyle().color('#71BEF2').render('blue'),
    magenta: NewStyle().color('#D290E4').render('magenta'),
    cyan: NewStyle().color('#66C2CD').render('cyan'),
    gray: NewStyle().color('#B9BFCA').render('gray'),
  };
}

function main() {
  // Simulate client terminal capabilities
  SetColorProfile(ColorProfile.TrueColor);
  SetHasDarkBackground(true);

  // Get terminal width (simplified)
  const width = process.stdout.columns || 80;

  // Initialize new styles
  const styles = makeStyles();

  let str = '';

  str +=
    '\n\n' +
    [styles.bold, styles.faint, styles.italic, styles.underline, styles.strikethrough].join(' ');

  str +=
    '\n' +
    [
      styles.red,
      styles.green,
      styles.yellow,
      styles.blue,
      styles.magenta,
      styles.cyan,
      styles.gray,
    ].join(' ');

  str +=
    '\n' +
    [
      styles.red,
      styles.green,
      styles.yellow,
      styles.blue,
      styles.magenta,
      styles.cyan,
      styles.gray,
    ].join(' ') +
    '\n\n';

  str +=
    NewStyle().bold(true).render('Has dark background? ') +
    HasDarkBackground() +
    ' (Profile: ' +
    ColorProfile[GetColorProfile()] +
    ')\n\n';

  const block = Place(
    width,
    Height(str),
    Center,
    Center,
    str,
    (() => {
      const opts: any = {};
      WithWhitespaceChars('/')(opts);
      WithWhitespaceForeground('#236')(opts); // Dark theme color
      return opts;
    })()
  );

  // Render to terminal
  console.log(block);
}

// Run the example
main();
