/**
 * HSLuv color space support
 * Source: https://github.com/hsluv/hsluv-go
 * Under MIT License
 * Modified so that Saturation and Luminance are in [0..1] instead of [0..100].
 */

import { XYZ_TO_RGB_MATRIX } from './colors/conversions';
import { clamp01 } from './utils';

// Reuse the matrix `m` from XYZ_TO_RGB_MATRIX
const m = [XYZ_TO_RGB_MATRIX.r, XYZ_TO_RGB_MATRIX.g, XYZ_TO_RGB_MATRIX.b];
const kappa = 903.2962962962963;
const epsilon = 0.008856451679035631;

const getBounds = (l: number): number[][] => {
  const ret: number[][] = [];
  const sub1 = (l + 16.0) ** 3.0 / 1560896.0;
  const sub2 = sub1 > epsilon ? sub1 : l / kappa;

  for (let i = 0; i < m.length; i++) {
    for (let k = 0; k < 2; k++) {
      const top1 = (284517.0 * m[i][0] - 94839.0 * m[i][2]) * sub2;
      const top2 =
        (838422.0 * m[i][2] + 769860.0 * m[i][1] + 731718.0 * m[i][0]) * l * sub2 -
        769860.0 * k * l;
      const bottom = (632260.0 * m[i][2] - 126452.0 * m[i][1]) * sub2 + 126452.0 * k;
      ret.push([top1 / bottom, top2 / bottom]);
    }
  }
  return ret;
};

const lengthOfRayUntilIntersect = (theta: number, x: number, y: number): number => {
  return y / (Math.sin(theta) - x * Math.cos(theta));
};

const maxChromaForLH = (l: number, h: number): number => {
  const hRad = (h / 360.0) * Math.PI * 2.0;
  let minLength = Number.MAX_VALUE;
  const bounds = getBounds(l);
  for (const line of bounds) {
    const length = lengthOfRayUntilIntersect(hRad, line[0], line[1]);
    if (length > 0.0 && length < minLength) {
      minLength = length;
    }
  }
  return minLength;
};

const intersectLineLine = (x1: number, y1: number, x2: number, y2: number): number => {
  return (y1 - y2) / (x2 - x1);
};

const distanceFromPole = (x: number, y: number): number => {
  return Math.sqrt(x ** 2.0 + y ** 2.0);
};

const maxSafeChromaForL = (l: number): number => {
  let minLength = Number.MAX_VALUE;
  const bounds = getBounds(l);
  for (const line of bounds) {
    const m1 = line[0];
    const b1 = line[1];
    const x = intersectLineLine(m1, b1, -1.0 / m1, 0.0);
    const dist = distanceFromPole(x, b1 + x * m1);
    if (dist < minLength) {
      minLength = dist;
    }
  }
  return minLength;
};

export const luvLChToHSLuv = (l: number, c: number, h: number): [number, number, number] => {
  // [-1..1] but the code expects it to be [-100..100]
  c *= 100.0;
  l *= 100.0;

  let s: number;
  if (l > 99.9999999 || l < 0.00000001) {
    s = 0.0;
  } else {
    const max = maxChromaForLH(l, h);
    s = (c / max) * 100.0;
  }
  return [h, clamp01(s / 100.0), clamp01(l / 100.0)];
};

export const hsLuvToLuvLCh = (h: number, s: number, l: number): [number, number, number] => {
  l *= 100.0;
  s *= 100.0;

  let c: number;
  if (l > 99.9999999 || l < 0.00000001) {
    c = 0.0;
  } else {
    const max = maxChromaForLH(l, h);
    c = (max / 100.0) * s;
  }

  return [clamp01(l / 100.0), c / 100.0, h];
};

export const luvLChToHPLuv = (l: number, c: number, h: number): [number, number, number] => {
  // [-1..1] but the code expects it to be [-100..100]
  c *= 100.0;
  l *= 100.0;

  let s: number;
  if (l > 99.9999999 || l < 0.00000001) {
    s = 0.0;
  } else {
    const max = maxSafeChromaForL(l);
    s = (c / max) * 100.0;
  }
  return [h, s / 100.0, l / 100.0];
};

export const hpLuvToLuvLCh = (h: number, s: number, l: number): [number, number, number] => {
  // [-1..1] but the code expects it to be [-100..100]
  l *= 100.0;
  s *= 100.0;

  let c: number;
  if (l > 99.9999999 || l < 0.00000001) {
    c = 0.0;
  } else {
    const max = maxSafeChromaForL(l);
    c = (max / 100.0) * s;
  }
  return [l / 100.0, c / 100.0, h];
};
