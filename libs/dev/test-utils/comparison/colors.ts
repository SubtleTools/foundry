/**
 * Color comparison utilities with floating-point tolerance
 */

import { getToleranceConfig } from '../config';

/**
 * Compare hex colors with tolerance for floating-point precision differences.
 * Accepts up to ±tolerance difference per RGB channel.
 */
export function compareHexColors(hex1: string, hex2: string): boolean {
  if (hex1 === hex2) return true;
  if (!hex1.startsWith('#') || !hex2.startsWith('#')) return false;
  if (hex1.length !== 7 || hex2.length !== 7) return false;

  const tolerance = getToleranceConfig().hexColorTolerance;

  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);

  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);

  return (
    Math.abs(r1 - r2) <= tolerance &&
    Math.abs(g1 - g2) <= tolerance &&
    Math.abs(b1 - b2) <= tolerance
  );
}

/**
 * Normalize JSON by comparing hex colors with tolerance.
 * Replaces similar hex colors in TS output with exact Go values for comparison.
 */
export function normalizeHexColorsInJson(tsJson: string, goJson: string): string {
  const hexPattern = /#[0-9a-fA-F]{6}/g;
  const goHexes = goJson.match(hexPattern) || [];

  let normalized = tsJson;
  const tsHexes = tsJson.match(hexPattern) || [];

  // Replace TS hex colors with Go hex colors if they're within tolerance
  for (let i = 0; i < Math.min(tsHexes.length, goHexes.length); i++) {
    const tsHex = tsHexes[i];
    const goHex = goHexes[i];
    if (tsHex && goHex && compareHexColors(tsHex, goHex) && tsHex !== goHex) {
      normalized = normalized.replace(tsHex, goHex);
    }
  }

  return normalized;
}
