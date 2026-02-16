/**
 * The core Color class representing an sRGB color.
 * Includes factory functions for creating colors from various color spaces.
 */

import { D65, Delta, HSLuvD65 } from '../constants';
import {
  clamp01,
  delinearize,
  delinearizeFast,
  interpAngle,
  linearize,
  linearizeFast,
  sq,
} from '../utils';
import * as Conversions from './conversions';
import {
  luvLChToHSLuv,
  hsLuvToLuvLCh,
  luvLChToHPLuv,
  hpLuvToLuvLCh,
} from '../hsluv';

// A color is stored internally using sRGB (standard RGB) values in the range 0-1
export class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number
  ) {}

  // Go-style property names (capitalized)
  get R(): number {
    return this.r;
  }

  get G(): number {
    return this.g;
  }

  get B(): number {
    return this.b;
  }

  // Implement compatibility with standard color interfaces
  rgba(): [number, number, number, number] {
    // Go implementation: R*65535 + 0.5
    const r = Math.floor(this.r * 65535.0 + 0.5);
    const g = Math.floor(this.g * 65535.0 + 0.5);
    const b = Math.floor(this.b * 65535.0 + 0.5);
    return [r, g, b, 0xffff];
  }

  // Go-style method name
  RGBA(): [number, number, number, number] {
    return this.rgba();
  }

  // Get RGB values as 8-bit integers
  rgb255(): [number, number, number] {
    const r = Math.floor(this.r * 255.0 + 0.5);
    const g = Math.floor(this.g * 255.0 + 0.5);
    const b = Math.floor(this.b * 255.0 + 0.5);
    return [r, g, b];
  }

  // Used to simplify HSLuv testing
  values(): [number, number, number] {
    return [this.r, this.g, this.b];
  }

  // Checks whether the color exists in RGB space, i.e. all values are in [0..1]
  isValid(): boolean {
    return (
      0.0 <= this.r &&
      this.r <= 1.0 &&
      0.0 <= this.g &&
      this.g <= 1.0 &&
      0.0 <= this.b &&
      this.b <= 1.0
    );
  }

  // Go-style method name
  IsValid(): boolean {
    return this.isValid();
  }

  // Returns clamped color with each value in [0..1]
  clamped(): Color {
    return new Color(clamp01(this.r), clamp01(this.g), clamp01(this.b));
  }

  /// Distance Functions ///

  distanceRgb(c2: Color): number {
    return Math.sqrt(sq(this.r - c2.r) + sq(this.g - c2.g) + sq(this.b - c2.b));
  }

  distanceLinearRgb(c2: Color): number {
    const [r1, g1, b1] = this.linearRgb();
    const [r2, g2, b2] = c2.linearRgb();
    return Math.sqrt(sq(r1 - r2) + sq(g1 - g2) + sq(b1 - b2));
  }

  distanceRiemersma(c2: Color): number {
    const rAvg = (this.r + c2.r) / 2.0;
    const dR = this.r - c2.r;
    const dG = this.g - c2.g;
    const dB = this.b - c2.b;
    return Math.sqrt((2 + rAvg) * dR * dR + 4 * dG * dG + (2 + (1 - rAvg)) * dB * dB);
  }

  almostEqualRgb(c2: Color): boolean {
    return (
      Math.abs(this.r - c2.r) + Math.abs(this.g - c2.g) + Math.abs(this.b - c2.b) < 3.0 * Delta
    );
  }

  /// Color Space Conversions ///

  hsv(): [number, number, number] {
    return Conversions.rgbToHsv(this.r, this.g, this.b);
  }

  hsl(): [number, number, number] {
    return Conversions.rgbToHsl(this.r, this.g, this.b);
  }

  hex(): string {
    const r = Math.floor(this.r * 255.0 + 0.5);
    const g = Math.floor(this.g * 255.0 + 0.5);
    const b = Math.floor(this.b * 255.0 + 0.5);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  linearRgb(): [number, number, number] {
    return [linearize(this.r), linearize(this.g), linearize(this.b)];
  }

  fastLinearRgb(): [number, number, number] {
    return [linearizeFast(this.r), linearizeFast(this.g), linearizeFast(this.b)];
  }

  xyz(): [number, number, number] {
    const [r, g, b] = this.linearRgb();
    return Conversions.linearRgbToXyz(r, g, b);
  }

  xyy(): [number, number, number] {
    return Conversions.xyzToXyy(...this.xyz());
  }

  xyyWhiteRef(wref: [number, number, number]): [number, number, number] {
    const [X, Y, Z] = this.xyz();
    return Conversions.xyzToXyyWithRef(X, Y, Z, wref);
  }

  lab(): [number, number, number] {
    return Conversions.xyzToLab(...this.xyz());
  }

  labWhiteRef(wref: [number, number, number]): [number, number, number] {
    const [x, y, z] = this.xyz();
    return Conversions.xyzToLabWithRef(x, y, z, wref);
  }

  luv(): [number, number, number] {
    return Conversions.xyzToLuv(...this.xyz());
  }

  luvWhiteRef(wref: [number, number, number]): [number, number, number] {
    const [x, y, z] = this.xyz();
    return Conversions.xyzToLuvWithRef(x, y, z, wref);
  }

  hcl(): [number, number, number] {
    return this.hclWhiteRef(D65);
  }

  hclWhiteRef(wref: [number, number, number]): [number, number, number] {
    const [L, a, b] = this.labWhiteRef(wref);
    return Conversions.labToHcl(L, a, b);
  }

  luvLCh(): [number, number, number] {
    return this.luvLChWhiteRef(D65);
  }

  luvLChWhiteRef(wref: [number, number, number]): [number, number, number] {
    return Conversions.luvToLuvLCh(...this.luvWhiteRef(wref));
  }

  okLab(): [number, number, number] {
    return Conversions.xyzToOkLab(...this.xyz());
  }

  okLch(): [number, number, number] {
    return Conversions.okLabToOkLch(...this.okLab());
  }

  hsLuv(): [number, number, number] {
    return luvLChToHSLuv(...this.luvLChWhiteRef(HSLuvD65));
  }

  hpLuv(): [number, number, number] {
    return luvLChToHPLuv(...this.luvLChWhiteRef(HSLuvD65));
  }

  /// Distance Functions Perceptual ///

  distanceLab(c2: Color): number {
    const [l1, a1, b1] = this.lab();
    const [l2, a2, b2] = c2.lab();
    return Math.sqrt(sq(l1 - l2) + sq(a1 - a2) + sq(b1 - b2));
  }

  distanceCIE76(c2: Color): number {
    return this.distanceLab(c2);
  }

  distanceLuv(c2: Color): number {
    const [l1, u1, v1] = this.luv();
    const [l2, u2, v2] = c2.luv();
    return Math.sqrt(sq(l1 - l2) + sq(u1 - u2) + sq(v1 - v2));
  }

  distanceHSLuv(c2: Color): number {
    const [h1, s1, l1] = this.hsLuv();
    const [h2, s2, l2] = c2.hsLuv();
    return Math.sqrt(sq((h1 - h2) / 100.0) + sq(s1 - s2) + sq(l1 - l2));
  }

  distanceHPLuv(c2: Color): number {
    const [h1, s1, l1] = this.hpLuv();
    const [h2, s2, l2] = c2.hpLuv();
    return Math.sqrt(sq((h1 - h2) / 100.0) + sq(s1 - s2) + sq(l1 - l2));
  }

  distanceCIE94(cr: Color): number {
    let [l1, a1, b1] = this.lab();
    let [l2, a2, b2] = cr.lab();

    l1 *= 100.0; a1 *= 100.0; b1 *= 100.0;
    l2 *= 100.0; a2 *= 100.0; b2 *= 100.0;

    const kl = 1.0;
    const kc = 1.0;
    const kh = 1.0;
    const k1 = 0.045;
    const k2 = 0.015;

    const deltaL = l1 - l2;
    const c1 = Math.sqrt(sq(a1) + sq(b1));
    const c2 = Math.sqrt(sq(a2) + sq(b2));
    const deltaCab = c1 - c2;

    const deltaHab2 = sq(a1 - a2) + sq(b1 - b2) - sq(deltaCab);
    const sl = 1.0;
    const sc = 1.0 + k1 * c1;
    const sh = 1.0 + k2 * c1;

    const vL2 = sq(deltaL / (kl * sl));
    const vC2 = sq(deltaCab / (kc * sc));
    const vH2 = deltaHab2 / sq(kh * sh);

    return Math.sqrt(vL2 + vC2 + vH2) * 0.01;
  }

  distanceCIEDE2000(cr: Color): number {
    return this.distanceCIEDE2000klch(cr, 1.0, 1.0, 1.0);
  }

  distanceCIEDE2000klch(cr: Color, kl: number, kc: number, kh: number): number {
    let [l1, a1, b1] = this.lab();
    let [l2, a2, b2] = cr.lab();

    l1 *= 100.0; a1 *= 100.0; b1 *= 100.0;
    l2 *= 100.0; a2 *= 100.0; b2 *= 100.0;

    const cab1 = Math.sqrt(sq(a1) + sq(b1));
    const cab2 = Math.sqrt(sq(a2) + sq(b2));
    const cabmean = (cab1 + cab2) / 2;

    const g = 0.5 * (1 - Math.sqrt(cabmean ** 7 / (cabmean ** 7 + 25 ** 7)));
    const ap1 = (1 + g) * a1;
    const ap2 = (1 + g) * a2;
    const cp1 = Math.sqrt(sq(ap1) + sq(b1));
    const cp2 = Math.sqrt(sq(ap2) + sq(b2));

    let hp1 = 0.0;
    if (b1 !== ap1 || ap1 !== 0) {
      hp1 = Math.atan2(b1, ap1);
      if (hp1 < 0) hp1 += Math.PI * 2;
      hp1 *= 180 / Math.PI;
    }

    let hp2 = 0.0;
    if (b2 !== ap2 || ap2 !== 0) {
      hp2 = Math.atan2(b2, ap2);
      if (hp2 < 0) hp2 += Math.PI * 2;
      hp2 *= 180 / Math.PI;
    }

    const deltaLp = l2 - l1;
    const deltaCp = cp2 - cp1;
    let dhp = 0.0;
    const cpProduct = cp1 * cp2;
    if (cpProduct !== 0) {
      dhp = hp2 - hp1;
      if (dhp > 180) dhp -= 360;
      else if (dhp < -180) dhp += 360;
    }
    const deltaHp = 2 * Math.sqrt(cpProduct) * Math.sin(((dhp / 2) * Math.PI) / 180);

    const lpmean = (l1 + l2) / 2;
    const cpmean = (cp1 + cp2) / 2;
    let hpmean = hp1 + hp2;
    if (cpProduct !== 0) {
      hpmean /= 2;
      if (Math.abs(hp1 - hp2) > 180) {
        if (hp1 + hp2 < 360) hpmean += 180;
        else hpmean -= 180;
      }
    }

    const t = 1 - 0.17 * Math.cos(((hpmean - 30) * Math.PI) / 180) + 0.24 * Math.cos((2 * hpmean * Math.PI) / 180) + 0.32 * Math.cos(((3 * hpmean + 6) * Math.PI) / 180) - 0.2 * Math.cos(((4 * hpmean - 63) * Math.PI) / 180);
    const deltaTheta = 30 * Math.exp(-sq((hpmean - 275) / 25));
    const rc = 2 * Math.sqrt(cpmean ** 7 / (cpmean ** 7 + 25 ** 7));
    const sl = 1 + (0.015 * sq(lpmean - 50)) / Math.sqrt(20 + sq(lpmean - 50));
    const sc = 1 + 0.045 * cpmean;
    const sh = 1 + 0.015 * cpmean * t;
    const rt = -Math.sin((2 * deltaTheta * Math.PI) / 180) * rc;

    return Math.sqrt(sq(deltaLp / (kl * sl)) + sq(deltaCp / (kc * sc)) + sq(deltaHp / (kh * sh)) + rt * (deltaCp / (kc * sc)) * (deltaHp / (kh * sh))) * 0.01;
  }

  /// Blending Functions ///

  blendRgb(c2: Color, t: number): Color {
    return new Color(
      this.r + t * (c2.r - this.r),
      this.g + t * (c2.g - this.g),
      this.b + t * (c2.b - this.b)
    );
  }

  blendLinearRgb(c2: Color, t: number): Color {
    const [r1, g1, b1] = this.linearRgb();
    const [r2, g2, b2] = c2.linearRgb();
    return linearRgb(r1 + t * (r2 - r1), g1 + t * (g2 - g1), b1 + t * (b2 - b1));
  }

  blendHsv(c2: Color, t: number): Color {
    let [h1, s1, v1] = this.hsv();
    let [h2, s2, v2] = c2.hsv();

    if (s1 === 0 && s2 !== 0) h1 = h2;
    else if (s2 === 0 && s1 !== 0) h2 = h1;

    return hsv(interpAngle(h1, h2, t), s1 + t * (s2 - s1), v1 + t * (v2 - v1));
  }

  blendLab(c2: Color, t: number): Color {
    const [l1, a1, b1] = this.lab();
    const [l2, a2, b2] = c2.lab();
    return lab(l1 + t * (l2 - l1), a1 + t * (a2 - a1), b1 + t * (b2 - b1));
  }

  blendLuv(c2: Color, t: number): Color {
    const [l1, u1, v1] = this.luv();
    const [l2, u2, v2] = c2.luv();
    return luv(l1 + t * (l2 - l1), u1 + t * (u2 - u1), v1 + t * (v2 - v1));
  }

  blendHcl(other: Color, t: number): Color {
    let [h1, c1, l1] = this.hcl();
    let [h2, c2, l2] = other.hcl();

    if (c1 <= 0.00015 && c2 >= 0.00015) h1 = h2;
    else if (c2 <= 0.00015 && c1 >= 0.00015) h2 = h1;

    return hcl(interpAngle(h1, h2, t), c1 + t * (c2 - c1), l1 + t * (l2 - l1)).clamped();
  }

  blendLuvLCh(c2: Color, t: number): Color {
    const [l1, c1, h1] = this.luvLCh();
    const [l2, c2_val, h2] = c2.luvLCh();
    return luvLCh(l1 + t * (l2 - l1), c1 + t * (c2_val - c1), interpAngle(h1, h2, t));
  }

  blendOkLab(c2: Color, t: number): Color {
    const [l1, a1, b1] = this.okLab();
    const [l2, a2, b2] = c2.okLab();
    return okLab(l1 + t * (l2 - l1), a1 + t * (a2 - a1), b1 + t * (b2 - b1));
  }

  blendOkLch(other: Color, t: number): Color {
    let [l1, c1, h1] = this.okLch();
    let [l2, c2, h2] = other.okLch();

    if (c1 <= 0.00015 && c2 >= 0.00015) h1 = h2;
    else if (c2 <= 0.00015 && c1 >= 0.00015) h2 = h1;

    return okLch(l1 + t * (l2 - l1), c1 + t * (c2 - c1), interpAngle(h1, h2, t)).clamped();
  }
}

// Factory Functions

export const makeColor = (
  col:
    | { r: number; g: number; b: number; a?: number }
    | { RGBA(): [number, number, number, number] }
    | [number, number, number, number]
): [Color, boolean] => {
  let r: number, g: number, b: number, a: number;

  if (Array.isArray(col)) {
    [r, g, b, a] = col;
  } else if (typeof col === 'object' && 'RGBA' in col && typeof col.RGBA === 'function') {
    // Handle Go-style color with RGBA() method (returns 16-bit values)
    const [r16, g16, b16, a16] = (col as { RGBA(): [number, number, number, number] }).RGBA();
    // Convert from 16-bit to 0-1 range
    r = r16 / 65535.0;
    g = g16 / 65535.0;
    b = b16 / 65535.0;
    a = a16 / 65535.0;
  } else {
    // Handle object with r, g, b properties (0-1 range)
    const rgbObj = col as { r: number; g: number; b: number; a?: number };
    r = rgbObj.r;
    g = rgbObj.g;
    b = rgbObj.b;
    a = rgbObj.a ?? 1.0;
  }

  if (a === 0) {
    return [new Color(0, 0, 0), false];
  }

  return [new Color(r, g, b), true];
};

export const hex = (scol: string): Color => {
  let factor: number;
  let r: number, g: number, b: number;

  if (scol.length === 4) {
    factor = 1.0 / 15.0;
    const hexVal = scol.slice(1);
    r = parseInt(hexVal[0], 16);
    g = parseInt(hexVal[1], 16);
    b = parseInt(hexVal[2], 16);
  } else if (scol.length === 6) {
    const hexVal = scol.slice(1);
    r = parseInt(hexVal.slice(0, 2), 16);
    g = parseInt(hexVal.slice(2, 4), 16);
    b = parseInt(hexVal.slice(4, 5), 16);
    factor = 1.0 / 255.0;
  } else if (scol.length === 7) {
    factor = 1.0 / 255.0;
    const hexVal = scol.slice(1);
    r = parseInt(hexVal.slice(0, 2), 16);
    g = parseInt(hexVal.slice(2, 4), 16);
    b = parseInt(hexVal.slice(4, 6), 16);
  } else if (scol.length >= 8) {
    factor = 1.0 / 255.0;
    const hexVal = scol.slice(1, 7);
    r = parseInt(hexVal.slice(0, 2), 16);
    g = parseInt(hexVal.slice(2, 4), 16);
    b = parseInt(hexVal.slice(4, 6), 16);
  } else {
    throw new Error(`color: ${scol} is not a hex-color`);
  }

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    throw new Error(`color: ${scol} is not a hex-color`);
  }

  return new Color(r * factor, g * factor, b * factor);
};

export const hsv = (h: number, s: number, v: number): Color => {
  const [r, g, b] = Conversions.hsvToRgb(h, s, v);
  return new Color(r, g, b);
};

export const hsl = (h: number, s: number, l: number): Color => {
  const [r, g, b] = Conversions.hslToRgb(h, s, l);
  return new Color(r, g, b);
};

export const linearRgb = (r: number, g: number, b: number): Color => {
  return new Color(delinearize(r), delinearize(g), delinearize(b));
};

export const fastLinearRgb = (r: number, g: number, b: number): Color => {
  return new Color(delinearizeFast(r), delinearizeFast(g), delinearizeFast(b));
};

export const xyz = (x: number, y: number, z: number): Color => {
  const [r, g, b] = Conversions.xyzToLinearRgb(x, y, z);
  return linearRgb(r, g, b);
};

export const xyy = (x: number, y: number, Y: number): Color => {
  return xyz(...Conversions.xyyToXyz(x, y, Y));
};

export const lab = (l: number, a: number, b: number): Color => {
  return xyz(...Conversions.labToXyz(l, a, b));
};

export const labWhiteRef = (l: number, a: number, b: number, wref: [number, number, number]): Color => {
  return xyz(...Conversions.labToXyzWithRef(l, a, b, wref));
};

export const luv = (l: number, u: number, v: number): Color => {
  return xyz(...Conversions.luvToXyz(l, u, v));
};

export const luvWhiteRef = (l: number, u: number, v: number, wref: [number, number, number]): Color => {
  return xyz(...Conversions.luvToXyzWithRef(l, u, v, wref));
};

export const hcl = (h: number, c: number, l: number): Color => {
  return hclWhiteRef(h, c, l, D65);
};

export const hclWhiteRef = (h: number, c: number, l: number, wref: [number, number, number]): Color => {
  const [L, a, b] = Conversions.hclToLab(h, c, l);
  return labWhiteRef(L, a, b, wref);
};

export const luvLCh = (l: number, c: number, h: number): Color => {
  return luvLChWhiteRef(l, c, h, D65);
};

export const luvLChWhiteRef = (l: number, c: number, h: number, wref: [number, number, number]): Color => {
  const [L, u, v] = Conversions.luvLChToLuv(l, c, h);
  return luvWhiteRef(L, u, v, wref);
};

export const okLab = (l: number, a: number, b: number): Color => {
  return xyz(...Conversions.okLabToXyz(l, a, b));
};

export const okLch = (l: number, c: number, h: number): Color => {
  return xyz(...Conversions.okLabToXyz(...Conversions.okLchToOkLab(l, c, h)));
};

export const hsLuv = (h: number, s: number, l: number): Color => {
  const [luvL, u, v] = Conversions.luvLChToLuv(...hsLuvToLuvLCh(h, s, l));
  const [r, g, b] = Conversions.xyzToLinearRgb(...Conversions.luvToXyzWithRef(luvL, u, v, HSLuvD65));
  return linearRgb(r, g, b).clamped();
};

export const hpLuv = (h: number, s: number, l: number): Color => {
  const [luvL, u, v] = Conversions.luvLChToLuv(...hpLuvToLuvLCh(h, s, l));
  const [r, g, b] = Conversions.xyzToLinearRgb(...Conversions.luvToXyzWithRef(luvL, u, v, HSLuvD65));
  return linearRgb(r, g, b).clamped();
};

// Capitalized aliases for Go-style compatibility
// First-letter capitalized versions (e.g., Hex, Hsv, Lab)
export const Hex = hex;
export const Hsv = hsv;
export const Hsl = hsl;
export const LinearRgb = linearRgb;
export const FastLinearRgb = fastLinearRgb;
export const Xyz = xyz;
export const Xyy = xyy;
export const Lab = lab;
export const LabWhiteRef = labWhiteRef;
export const Luv = luv;
export const LuvWhiteRef = luvWhiteRef;
export const Hcl = hcl;
export const HclWhiteRef = hclWhiteRef;
export const LuvLCh = luvLCh;
export const LuvLChWhiteRef = luvLChWhiteRef;
export const OkLab = okLab;
export const OkLch = okLch;
export const HsLuv = hsLuv;
export const HpLuv = hpLuv;

// All-caps versions for go-colorful compatibility
export const Hex2 = hex;
export const HSV = hsv;
export const HSL = hsl;
export const XYZ = xyz;
export const HCL = hcl;
export const HSLuv = hsLuv;
export const HPLuv = hpLuv;

// Utility function aliases
export const MakeColor = makeColor;

