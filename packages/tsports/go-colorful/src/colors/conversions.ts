/**
 * Color space conversion functions and helpers.
 * Pure mathematical transformations.
 */

import { D65 } from '../constants';
import {
  cub,
  sq,
} from '../utils';

// Constants for angle conversions
export const RAD_TO_DEG = 57.29577951308232; // 180/Math.PI
export const DEG_TO_RAD = 0.017453292519943295; // Math.PI/180

// XYZ to Linear RGB transformation matrix
// Values must match Go implementation exactly for bit-perfect compatibility
export const XYZ_TO_RGB_MATRIX = {
  r: [3.2409699419045214, -1.5373831775700935, -0.49861076029300328] as const,
  g: [-0.96924363628087983, 1.8759675015077207, 0.041555057407175613] as const,
  b: [0.055630079696993609, -0.20397695888897657, 1.0569715142428786] as const,
} as const;

// RGB to XYZ transformation matrix
// Values must match Go implementation exactly for bit-perfect compatibility
export const RGB_TO_XYZ_MATRIX = {
  x: [0.41239079926595948, 0.35758433938387796, 0.18048078840183429] as const,
  y: [0.21263900587151036, 0.71516867876775593, 0.072192315360733715] as const,
  z: [0.019330818715591851, 0.11919477979462599, 0.95053215224966058] as const,
} as const;

// Helper Functions

export const xyzToLinearRgb = (x: number, y: number, z: number): [number, number, number] => {
  const r = XYZ_TO_RGB_MATRIX.r[0] * x + XYZ_TO_RGB_MATRIX.r[1] * y + XYZ_TO_RGB_MATRIX.r[2] * z;
  const g = XYZ_TO_RGB_MATRIX.g[0] * x + XYZ_TO_RGB_MATRIX.g[1] * y + XYZ_TO_RGB_MATRIX.g[2] * z;
  const b = XYZ_TO_RGB_MATRIX.b[0] * x + XYZ_TO_RGB_MATRIX.b[1] * y + XYZ_TO_RGB_MATRIX.b[2] * z;
  return [r, g, b];
};

export const linearRgbToXyz = (r: number, g: number, b: number): [number, number, number] => {
  const x = RGB_TO_XYZ_MATRIX.x[0] * r + RGB_TO_XYZ_MATRIX.x[1] * g + RGB_TO_XYZ_MATRIX.x[2] * b;
  const y = RGB_TO_XYZ_MATRIX.y[0] * r + RGB_TO_XYZ_MATRIX.y[1] * g + RGB_TO_XYZ_MATRIX.y[2] * b;
  const z = RGB_TO_XYZ_MATRIX.z[0] * r + RGB_TO_XYZ_MATRIX.z[1] * g + RGB_TO_XYZ_MATRIX.z[2] * b;
  return [x, y, z];
};

// Lab Helper Functions
const labF = (t: number): number => {
  if (t > ((((6.0 / 29.0) * 6.0) / 29.0) * 6.0) / 29.0) {
    return Math.cbrt(t);
  }
  return ((((t / 3.0) * 29.0) / 6.0) * 29.0) / 6.0 + 4.0 / 29.0;
};

const labFInv = (t: number): number => {
  if (t > 6.0 / 29.0) {
    return t * t * t;
  }
  return ((((3.0 * 6.0) / 29.0) * 6.0) / 29.0) * (t - 4.0 / 29.0);
};

export const xyzToLabWithRef = (
  x: number,
  y: number,
  z: number,
  wref: [number, number, number]
): [number, number, number] => {
  const fy = labF(y / wref[1]);
  const l = 1.16 * fy - 0.16;
  const a = 5.0 * (labF(x / wref[0]) - fy);
  const b = 2.0 * (fy - labF(z / wref[2]));
  return [l, a, b];
};

export const xyzToLab = (x: number, y: number, z: number): [number, number, number] => {
  return xyzToLabWithRef(x, y, z, D65);
};

export const labToXyzWithRef = (
  l: number,
  a: number,
  b: number,
  wref: [number, number, number]
): [number, number, number] => {
  const l2 = (l + 0.16) / 1.16;
  const x = wref[0] * labFInv(l2 + a / 5.0);
  const y = wref[1] * labFInv(l2);
  const z = wref[2] * labFInv(l2 - b / 2.0);
  return [x, y, z];
};

export const labToXyz = (l: number, a: number, b: number): [number, number, number] => {
  return labToXyzWithRef(l, a, b, D65);
};

// Luv Helper Functions
const xyzToUv = (x: number, y: number, z: number): [number, number] => {
  const denom = x + 15.0 * y + 3.0 * z;
  if (denom === 0.0) {
    return [0.0, 0.0];
  }
  return [(4.0 * x) / denom, (9.0 * y) / denom];
};

export const xyzToLuvWithRef = (
  x: number,
  y: number,
  z: number,
  wref: [number, number, number]
): [number, number, number] => {
  let l: number;
  if (y / wref[1] <= ((((6.0 / 29.0) * 6.0) / 29.0) * 6.0) / 29.0) {
    l = ((y / wref[1]) * (((((29.0 / 3.0) * 29.0) / 3.0) * 29.0) / 3.0)) / 100.0;
  } else {
    l = 1.16 * Math.cbrt(y / wref[1]) - 0.16;
  }
  const [ubis, vbis] = xyzToUv(x, y, z);
  const [un, vn] = xyzToUv(wref[0], wref[1], wref[2]);
  const u = 13.0 * l * (ubis - un);
  const v = 13.0 * l * (vbis - vn);
  return [l, u, v];
};

export const xyzToLuv = (x: number, y: number, z: number): [number, number, number] => {
  return xyzToLuvWithRef(x, y, z, D65);
};

export const luvToXyzWithRef = (
  l: number,
  u: number,
  v: number,
  wref: [number, number, number]
): [number, number, number] => {
  let y: number;
  if (l <= 0.08) {
    y = (((((wref[1] * l * 100.0 * 3.0) / 29.0) * 3.0) / 29.0) * 3.0) / 29.0;
  } else {
    y = wref[1] * cub((l + 0.16) / 1.16);
  }
  const [un, vn] = xyzToUv(wref[0], wref[1], wref[2]);
  let x = 0,
    z = 0;
  if (l !== 0.0) {
    const ubis = u / (13.0 * l) + un;
    const vbis = v / (13.0 * l) + vn;
    x = (y * 9.0 * ubis) / (4.0 * vbis);
    z = (y * (12.0 - 3.0 * ubis - 20.0 * vbis)) / (4.0 * vbis);
  }
  return [x, y, z];
};

export const luvToXyz = (l: number, u: number, v: number): [number, number, number] => {
  return luvToXyzWithRef(l, u, v, D65);
};

// xyY Helper Functions
export const xyzToXyyWithRef = (
  X: number,
  Y: number,
  Z: number,
  wref: [number, number, number]
): [number, number, number] => {
  const Yout = Y;
  const N = X + Y + Z;
  let x: number, y: number;
  if (Math.abs(N) < 1e-14) {
    // When we have black, use the reference white's chromacity
    x = wref[0] / (wref[0] + wref[1] + wref[2]);
    y = wref[1] / (wref[0] + wref[1] + wref[2]);
  } else {
    x = X / N;
    y = Y / N;
  }
  return [x, y, Yout];
};

export const xyzToXyy = (X: number, Y: number, Z: number): [number, number, number] => {
  return xyzToXyyWithRef(X, Y, Z, D65);
};

export const xyyToXyz = (x: number, y: number, Y: number): [number, number, number] => {
  const Yout = Y;
  let X: number, Z: number;
  if (-1e-14 < y && y < 1e-14) {
    X = 0.0;
    Z = 0.0;
  } else {
    X = (Y / y) * x;
    Z = (Y / y) * (1.0 - x - y);
  }
  return [X, Yout, Z];
};

// HCL Helper Functions
export const labToHcl = (L: number, a: number, b: number): [number, number, number] => {
  let h: number;
  if (Math.abs(b - a) > 1e-4 && Math.abs(a) > 1e-4) {
    h = (RAD_TO_DEG * Math.atan2(b, a) + 360.0) % 360.0;
  } else {
    h = 0.0;
  }
  const c = Math.sqrt(sq(a) + sq(b));
  return [h, c, L];
};

export const hclToLab = (h: number, c: number, l: number): [number, number, number] => {
  const H = DEG_TO_RAD * h;
  const a = c * Math.cos(H);
  const b = c * Math.sin(H);
  return [l, a, b];
};

// LuvLCh Helper Functions
export const luvToLuvLCh = (L: number, u: number, v: number): [number, number, number] => {
  let h: number;
  if (Math.abs(v - u) > 1e-4 && Math.abs(u) > 1e-4) {
    h = (RAD_TO_DEG * Math.atan2(v, u) + 360.0) % 360.0;
  } else {
    h = 0.0;
  }
  const c = Math.sqrt(sq(u) + sq(v));
  return [L, c, h];
};

export const luvLChToLuv = (l: number, c: number, h: number): [number, number, number] => {
  const H = DEG_TO_RAD * h;
  const u = c * Math.cos(H);
  const v = c * Math.sin(H);
  return [l, u, v];
};

// OkLab Functions
// Precision-matched to Go implementation for bit-perfect compatibility
export const xyzToOkLab = (x: number, y: number, z: number): [number, number, number] => {
  const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z);
  const l = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  return [l, a, b];
};

export const okLabToXyz = (l: number, a: number, b: number): [number, number, number] => {
  const l_ = 0.9999999984505196 * l + 0.39633779217376774 * a + 0.2158037580607588 * b;
  const m_ = 1.0000000088817607 * l - 0.10556134232365633 * a - 0.0638541747717059 * b;
  const s_ = 1.0000000546724108 * l - 0.08948418209496574 * a - 1.2914855378640917 * b;

  const ll = l_ ** 3;
  const m = m_ ** 3;
  const s_cubed = s_ ** 3; // s is commonly used variable

  const x = 1.2268798733741557 * ll - 0.5578149965554813 * m + 0.28139105017721594 * s_cubed;
  const y = -0.04057576262431372 * ll + 1.1122868293970594 * m - 0.07171106666151696 * s_cubed;
  const z = -0.07637294974672142 * ll - 0.4214933239627916 * m + 1.5869240244272422 * s_cubed;

  return [x, y, z];
};

export const okLabToOkLch = (l: number, a: number, b: number): [number, number, number] => {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a);
  if (h < 0) {
    h += 2 * Math.PI;
  }
  return [l, c, (h * 180) / Math.PI];
};

export const okLchToOkLab = (l: number, c: number, h: number): [number, number, number] => {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  return [l, a, b];
};

// HSLuv and HPLuv conversions moved to ../hsluv.ts to avoid circular dependencies
// Import them from there directly when needed

// HSV conversions
export const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
  const min = Math.min(Math.min(r, g), b);
  const v = Math.max(Math.max(r, g), b);
  const C = v - min;

  let s = 0.0;
  if (v !== 0.0) {
    s = C / v;
  }

  let h = 0.0;
  if (min !== v) {
    if (v === r) {
      h = ((g - b) / C) % 6.0;
    } else if (v === g) {
      h = (b - r) / C + 2.0;
    } else if (v === b) {
      h = (r - g) / C + 4.0;
    }
    h *= 60.0;
    if (h < 0.0) {
      h += 360.0;
    }
  }
  return [h, s, v];
};

export const hsvToRgb = (H: number, S: number, V: number): [number, number, number] => {
  const Hp = H / 60.0;
  const C = V * S;
  const X = C * (1.0 - Math.abs((Hp % 2.0) - 1.0));

  const m = V - C;
  let r = 0.0,
    g = 0.0,
    b = 0.0;

  if (0.0 <= Hp && Hp < 1.0) {
    r = C;
    g = X;
  } else if (1.0 <= Hp && Hp < 2.0) {
    r = X;
    g = C;
  } else if (2.0 <= Hp && Hp < 3.0) {
    g = C;
    b = X;
  } else if (3.0 <= Hp && Hp < 4.0) {
    g = X;
    b = C;
  } else if (4.0 <= Hp && Hp < 5.0) {
    r = X;
    b = C;
  } else if (5.0 <= Hp && Hp < 6.0) {
    r = C;
    b = X;
  }

  return [m + r, m + g, m + b];
};

// HSL conversions
export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  const min = Math.min(Math.min(r, g), b);
  const max = Math.max(Math.max(r, g), b);

  const l = (max + min) / 2;

  let s = 0;
  let h = 0;

  if (min !== max) {
    if (l < 0.5) {
      s = (max - min) / (max + min);
    } else {
      s = (max - min) / (2.0 - max - min);
    }

    if (max === r) {
      h = (g - b) / (max - min);
    } else if (max === g) {
      h = 2.0 + (b - r) / (max - min);
    } else {
      h = 4.0 + (r - g) / (max - min);
    }

    h *= 60;

    if (h < 0) {
      h += 360;
    }
  }

  return [h, s, l];
};

export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  if (s === 0) {
    return [l, l, l];
  }

  let t1: number;
  if (l < 0.5) {
    t1 = l * (1.0 + s);
  } else {
    t1 = l + s - l * s;
  }

  const t2 = 2 * l - t1;
  const hNorm = h / 360;
  let tr = hNorm + 1.0 / 3.0;
  let tg = hNorm;
  let tb = hNorm - 1.0 / 3.0;

  if (tr < 0) tr++;
  if (tr > 1) tr--;
  if (tg < 0) tg++;
  if (tg > 1) tg--;
  if (tb < 0) tb++;
  if (tb > 1) tb--;

  const getComponent = (t: number): number => {
    if (6 * t < 1) {
      return t2 + (t1 - t2) * 6 * t;
    } else if (2 * t < 1) {
      return t1;
    } else if (3 * t < 2) {
      return t2 + (t1 - t2) * (2.0 / 3.0 - t) * 6;
    } else {
      return t2;
    }
  };

  return [getComponent(tr), getComponent(tg), getComponent(tb)];
};

// Capitalized alias for Go-style compatibility
export const LabToHcl = labToHcl;
