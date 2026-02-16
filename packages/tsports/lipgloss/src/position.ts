/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Position and placement functions for Lipgloss
 * Port of position.go from Go Lipgloss
 */

import { stringWidth } from './ansi-utils';
import { getLines } from './size';
import { newWhitespace, type WhitespaceOption } from './whitespace';
import type { Renderer } from './renderer';
import type { LipglossPosition } from './position-types';
import { LipglossPositions } from './position-types';

/**
 * Position value helper - clamps between 0.0 and 1.0
 */
function positionValue(p: LipglossPosition): number {
  return Math.min(1, Math.max(0, p));
}

/**
 * Place places a string or text block vertically in an unstyled box of a given
 * width or height.
 */
export function Place(
  width: number,
  height: number,
  hPos: LipglossPosition,
  vPos: LipglossPosition,
  str: string,
  ...opts: WhitespaceOption[]
): string {
  // Use default renderer for global functions
  return defaultRenderer.Place(width, height, hPos, vPos, str, ...opts);
}

/**
 * PlaceHorizontal places a string or text block horizontally in an unstyled
 * block of a given width. If the given width is shorter than the max width of
 * the string (measured by its longest line) this will be a noop.
 */
export function PlaceHorizontal(
  width: number,
  pos: LipglossPosition,
  str: string,
  ...opts: WhitespaceOption[]
): string {
  // Use default renderer for global functions
  return defaultRenderer.PlaceHorizontal(width, pos, str, ...opts);
}

/**
 * PlaceVertical places a string or text block vertically in an unstyled block
 * of a given height. If the given height is shorter than the height of the
 * string (measured by its newlines) then this will be a noop.
 */
export function PlaceVertical(
  height: number,
  pos: LipglossPosition,
  str: string,
  ...opts: WhitespaceOption[]
): string {
  // Use default renderer for global functions
  return defaultRenderer.PlaceVertical(height, pos, str, ...opts);
}

// Import default renderer - will be set by renderer module
let defaultRenderer: Renderer;

export function setDefaultRenderer(renderer: Renderer): void {
  defaultRenderer = renderer;
}

/**
 * Renderer methods for positioning
 */
declare module './renderer' {
  interface Renderer {
    Place(
      width: number,
      height: number,
      hPos: LipglossPosition,
      vPos: LipglossPosition,
      str: string,
      ...opts: WhitespaceOption[]
    ): string;
    PlaceHorizontal(
      width: number,
      pos: LipglossPosition,
      str: string,
      ...opts: WhitespaceOption[]
    ): string;
    PlaceVertical(
      height: number,
      pos: LipglossPosition,
      str: string,
      ...opts: WhitespaceOption[]
    ): string;
  }
}

/**
 * Add positioning methods to Renderer prototype
 */
export function addPositionMethods(): void {
  const RendererPrototype = require('./renderer').Renderer.prototype;

  RendererPrototype.Place = function(
    this: Renderer,
    width: number,
    height: number,
    hPos: LipglossPosition,
    vPos: LipglossPosition,
    str: string,
    ...opts: WhitespaceOption[]
  ): string {
    return this.PlaceVertical(height, vPos, this.PlaceHorizontal(width, hPos, str, ...opts), ...opts);
  };

  RendererPrototype.PlaceHorizontal = function(
    this: Renderer,
    width: number,
    pos: LipglossPosition,
    str: string,
    ...opts: WhitespaceOption[]
  ): string {
    const { lines, width: contentWidth } = getLines(str);
    const gap = width - contentWidth;

    if (gap <= 0) {
      return str;
    }

    const ws = newWhitespace(this, ...opts);
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      // Is this line shorter than the longest line?
      const short = Math.max(0, contentWidth - stringWidth(line));

      const posVal = positionValue(pos);

      if (posVal === LipglossPositions.Left) {
        // Left alignment
        result.push(line + ws.render(gap + short));
      } else if (posVal === LipglossPositions.Right) {
        // Right alignment
        result.push(ws.render(gap + short) + line);
      } else {
        // Center or custom position
        const totalGap = gap + short;
        const split = Math.round(totalGap * posVal);
        const left = totalGap - split;
        const right = totalGap - left;

        result.push(ws.render(left) + line + ws.render(right));
      }
    }

    return result.join('\n');
  };

  RendererPrototype.PlaceVertical = function(
    this: Renderer,
    height: number,
    pos: LipglossPosition,
    str: string,
    ...opts: WhitespaceOption[]
  ): string {
    const contentHeight = (str.match(/\n/g)?.length || 0) + 1;
    const gap = height - contentHeight;

    if (gap <= 0) {
      return str;
    }

    const ws = newWhitespace(this, ...opts);
    const { width } = getLines(str);
    const emptyLine = ws.render(width);

    const posVal = positionValue(pos);

    if (posVal === LipglossPositions.Top) {
      // Top alignment
      const padding = Array(gap).fill(emptyLine);
      return str + '\n' + padding.join('\n');
    } else if (posVal === LipglossPositions.Bottom) {
      // Bottom alignment
      const padding = Array(gap).fill(emptyLine).join('\n');
      return padding + '\n' + str;
    } else {
      // Center or custom position
      const split = Math.round(gap * posVal);
      const top = gap - split;
      const bottom = gap - top;

      const topPadding = Array(top).fill(emptyLine).join('\n');
      const bottomPadding = Array(bottom).fill(emptyLine).join('\n');

      return (top > 0 ? topPadding + '\n' : '') + str + (bottom > 0 ? '\n' + bottomPadding : '');
    }
  };
}