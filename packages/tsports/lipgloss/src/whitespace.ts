/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Whitespace renderer for Lipgloss
 * Port of whitespace.go from Go Lipgloss
 */

import { stringWidth } from './ansi-utils';
import type { Renderer } from './renderer';
import { Style } from '@tsports/termenv';

/**
 * Whitespace renderer
 */
export class Whitespace {
  private renderer: Renderer;
  private style: Style;
  private chars: string;

  constructor(renderer: Renderer, opts: WhitespaceOption[] = []) {
    this.renderer = renderer;
    this.style = renderer.output().string();
    this.chars = '';

    for (const opt of opts) {
      opt(this);
    }
  }

  /**
   * Render whitespaces with specified width
   */
  render(width: number): string {
    if (this.chars === '') {
      this.chars = ' ';
    }

    const runes = Array.from(this.chars);
    let j = 0;
    let result = '';

    // Cycle through runes and print them into the whitespace
    for (let i = 0; i < width; ) {
      const r = runes[j] || ' ';
      const charWidth = stringWidth(r);

      // Don't add character if it would exceed the target width
      if (i + charWidth > width) {
        break;
      }

      result += r;
      i += charWidth;
      j++;
      if (j >= runes.length) {
        j = 0;
      }
    }

    // Fill any extra gaps with spaces. This might be necessary if any runes
    // are more than one cell wide, which could leave a one-rune gap.
    const short = width - stringWidth(result);
    if (short > 0) {
      result += ' '.repeat(short);
    }

    return this.style.styled(result);
  }

  setChars(chars: string): void {
    this.chars = chars;
  }

  setStyle(style: Style): void {
    this.style = style;
  }
}

/**
 * WhitespaceOption configures whitespace rendering
 */
export type WhitespaceOption = (w: Whitespace) => void;

/**
 * WithWhitespaceRenderer sets a custom renderer for whitespace
 */
export function WithWhitespaceRenderer(r: Renderer): WhitespaceOption {
  return (w: Whitespace) => {
    (w as any).renderer = r;
  };
}

/**
 * WithWhitespaceChars sets the characters to use for whitespace
 */
export function WithWhitespaceChars(chars: string): WhitespaceOption {
  return (w: Whitespace) => {
    w.setChars(chars);
  };
}

/**
 * WithWhitespaceForeground sets the foreground color for whitespace
 */
export function WithWhitespaceForeground(
  color: import('./types').ColorValue
): WhitespaceOption {
  return (w: Whitespace) => {
    let colorObj: import('@tsports/termenv').Color | null = null;
    
    if (typeof color === 'string') {
        colorObj = (w as any).renderer.output().color(color);
    } else if (typeof color === 'object' && color !== null) {
        // Handle TerminalColor objects (Color, AdaptiveColor)
        if ('color' in color && typeof (color as any).color === 'function') {
             colorObj = (color as any).color((w as any).renderer);
        }
    }

    if (colorObj) {
      w.setStyle((w as any).style.foreground(colorObj));
    }
  };
}

/**
 * WithWhitespaceBackground sets the background color for whitespace
 */
export function WithWhitespaceBackground(
  color: import('./types').ColorValue
): WhitespaceOption {
  return (w: Whitespace) => {
    let colorObj: import('@tsports/termenv').Color | null = null;
    
    if (typeof color === 'string') {
        colorObj = (w as any).renderer.output().color(color);
    } else if (typeof color === 'object' && color !== null) {
        // Handle TerminalColor objects (Color, AdaptiveColor)
        if ('color' in color && typeof (color as any).color === 'function') {
             colorObj = (color as any).color((w as any).renderer);
        }
    }

    if (colorObj) {
      w.setStyle((w as any).style.background(colorObj));
    }
  };
}

/**
 * Create a new whitespace renderer
 */
export function newWhitespace(
  r: Renderer,
  ...opts: WhitespaceOption[]
): Whitespace {
  return new Whitespace(r, opts);
}
