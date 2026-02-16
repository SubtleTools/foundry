/**
 * ANSI escape sequence comparison utilities with RGB tolerance
 */

import { getToleranceConfig } from '../config';

/**
 * Compare ANSI RGB color sequences with tolerance
 * Normalizes RGB values that are within tolerance to be identical
 */
export function compareAnsiRgb(str1: string, str2: string): boolean {
  const tolerance = getToleranceConfig().ansiRgbTolerance;
  // Match RGB color sequences: \x1b[38;2;R;G;Bm
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape sequences needed
  const rgbRegex = /\u001b\[38;2;(\d+);(\d+);(\d+)m/g;

  let normalized1 = str1;
  let normalized2 = str2;

  let match1: RegExpExecArray | null;
  let match2: RegExpExecArray | null;

  const matches1: RegExpExecArray[] = [];
  const matches2: RegExpExecArray[] = [];

  match1 = rgbRegex.exec(str1);
  while (match1 !== null) {
    matches1.push(match1);
    match1 = rgbRegex.exec(str1);
  }
  rgbRegex.lastIndex = 0;
  match2 = rgbRegex.exec(str2);
  while (match2 !== null) {
    matches2.push(match2);
    match2 = rgbRegex.exec(str2);
  }

  if (matches1.length !== matches2.length) return false;

  for (let i = 0; i < matches1.length; i++) {
    const m1 = matches1[i];
    const m2 = matches2[i];
    if (!m1 || !m2) continue;

    const r1 = parseInt(m1[1] || '0', 10);
    const g1 = parseInt(m1[2] || '0', 10);
    const b1 = parseInt(m1[3] || '0', 10);

    const r2 = parseInt(m2[1] || '0', 10);
    const g2 = parseInt(m2[2] || '0', 10);
    const b2 = parseInt(m2[3] || '0', 10);

    // Check if RGB values are within tolerance
    if (
      Math.abs(r1 - r2) <= tolerance &&
      Math.abs(g1 - g2) <= tolerance &&
      Math.abs(b1 - b2) <= tolerance
    ) {
      // Replace both sequences with a normalized version
      const placeholder = `\x1b[38;2;${r1};${g1};${b1}m`;
      normalized1 = normalized1.replace(m1[0], placeholder);
      normalized2 = normalized2.replace(m2[0], placeholder);
    }
  }

  return normalized1 === normalized2;
}

/**
 * Normalize ANSI RGB sequences in a string to use consistent values
 * for sequences within tolerance
 */
export function normalizeAnsiRgbSequences(str1: string, str2: string): [string, string] {
  const tolerance = getToleranceConfig().ansiRgbTolerance;
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape sequences needed
  const rgbRegex = /\u001b\[38;2;(\d+);(\d+);(\d+)m/g;

  let normalized1 = str1;
  let normalized2 = str2;

  const matches1: RegExpExecArray[] = [];
  const matches2: RegExpExecArray[] = [];

  let match: RegExpExecArray | null;
  match = rgbRegex.exec(str1);
  while (match !== null) {
    matches1.push(match);
    match = rgbRegex.exec(str1);
  }
  rgbRegex.lastIndex = 0;
  match = rgbRegex.exec(str2);
  while (match !== null) {
    matches2.push(match);
    match = rgbRegex.exec(str2);
  }

  for (let i = 0; i < Math.min(matches1.length, matches2.length); i++) {
    const m1 = matches1[i];
    const m2 = matches2[i];
    if (!m1 || !m2) continue;

    const r1 = parseInt(m1[1] || '0', 10);
    const g1 = parseInt(m1[2] || '0', 10);
    const b1 = parseInt(m1[3] || '0', 10);

    const r2 = parseInt(m2[1] || '0', 10);
    const g2 = parseInt(m2[2] || '0', 10);
    const b2 = parseInt(m2[3] || '0', 10);

    if (
      Math.abs(r1 - r2) <= tolerance &&
      Math.abs(g1 - g2) <= tolerance &&
      Math.abs(b1 - b2) <= tolerance
    ) {
      const placeholder = `\x1b[38;2;${r2};${g2};${b2}m`;
      normalized1 = normalized1.replace(m1[0], placeholder);
      normalized2 = normalized2.replace(m2[0], placeholder);
    }
  }

  return [normalized1, normalized2];
}
