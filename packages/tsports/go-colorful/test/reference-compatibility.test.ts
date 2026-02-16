/**
 * Reference compatibility tests using exact Go test values
 * These tests verify our TypeScript implementation matches the Go reference exactly
 */

import { expect, test } from 'bun:test';
import * as colorful from '../src';

// Delta for approximate equality testing (same as Go)
const delta = 1.0 / 256.0;

function almostEq(v1: number, v2: number, eps: number = delta): boolean {
  if (Math.abs(v1) > delta) {
    return Math.abs((v1 - v2) / v1) < eps;
  }
  return true;
}

// Exact test values from Go reference implementation
const referenceValues = [
  {
    c: [1.0, 1.0, 1.0],
    hsl: [0.0, 0.0, 1.0],
    hsv: [0.0, 0.0, 1.0],
    hex: '#ffffff',
    xyz: [0.95047, 1.0, 1.08883],
    xyy: [0.312727, 0.329023, 1.0],
    lab: [1.0, 0.0, 0.0],
    lab50: [1.0, -0.023881, -0.193622],
    luv: [1.0, 0.0, 0.0],
    luv50: [1.0, -0.14716, -0.25658],
    hcl: [0.0, 0.0, 1.0],
    hcl50: [262.9688, 0.195089, 1.0],
    rgba: [65535, 65535, 65535, 65535],
    rgb255: [255, 255, 255],
  },
  {
    c: [0.5, 1.0, 1.0],
    hsl: [180.0, 1.0, 0.75],
    hsv: [180.0, 0.5, 1.0],
    hex: '#80ffff',
    xyz: [0.626296, 0.832848, 1.073634],
    xyy: [0.247276, 0.328828, 0.832848],
    lab: [0.93139, -0.353319, -0.108946],
    lab50: [0.93139, -0.3741, -0.301663],
    luv: [0.93139, -0.53909, -0.1163],
    luv50: [0.93139, -0.67615, -0.35528],
    hcl: [197.1371, 0.369735, 0.93139],
    hcl50: [218.8817, 0.480574, 0.93139],
    rgba: [32768, 65535, 65535, 65535],
    rgb255: [128, 255, 255],
  },
  {
    c: [1.0, 0.0, 0.0],
    hsl: [0.0, 1.0, 0.5],
    hsv: [0.0, 1.0, 1.0],
    hex: '#ff0000',
    xyz: [0.412456, 0.212673, 0.019334],
    xyy: [0.64, 0.33, 0.212673],
    lab: [0.532408, 0.800925, 0.672032],
    lab50: [0.532408, 0.782845, 0.621518],
    luv: [0.53241, 1.75015, 0.37756],
    luv50: [0.53241, 1.6718, 0.24096],
    hcl: [39.999, 1.045518, 0.532408],
    hcl50: [38.4469, 0.999566, 0.532408],
    rgba: [65535, 0, 0, 65535],
    rgb255: [255, 0, 0],
  },
  {
    c: [0.0, 1.0, 0.0],
    hsl: [120.0, 1.0, 0.5],
    hsv: [120.0, 1.0, 1.0],
    hex: '#00ff00',
    xyz: [0.357576, 0.715152, 0.119192],
    xyy: [0.3, 0.6, 0.715152],
    lab: [0.877347, -0.861827, 0.831793],
    lab50: [0.877347, -0.879067, 0.73917],
    luv: [0.87735, -0.83078, 1.07398],
    luv50: [0.87735, -0.95989, 0.84887],
    hcl: [136.016, 1.197759, 0.877347],
    hcl50: [139.9409, 1.148534, 0.877347],
    rgba: [0, 65535, 0, 65535],
    rgb255: [0, 255, 0],
  },
  {
    c: [0.0, 0.0, 1.0],
    hsl: [240.0, 1.0, 0.5],
    hsv: [240.0, 1.0, 1.0],
    hex: '#0000ff',
    xyz: [0.180437, 0.072175, 0.950304],
    xyy: [0.15, 0.06, 0.072175],
    lab: [0.32297, 0.791875, -1.078602],
    lab50: [0.32297, 0.77815, -1.263638],
    luv: [0.32297, -0.09405, -1.30342],
    luv50: [0.32297, -0.14158, -1.38629],
    hcl: [306.2849, 1.338076, 0.32297],
    hcl50: [301.6248, 1.484014, 0.32297],
    rgba: [0, 0, 65535, 65535],
    rgb255: [0, 0, 255],
  },
  {
    c: [0.0, 0.0, 0.0],
    hsl: [0.0, 0.0, 0.0],
    hsv: [0.0, 0.0, 0.0],
    hex: '#000000',
    xyz: [0.0, 0.0, 0.0],
    xyy: [0.312727, 0.329023, 0.0],
    lab: [0.0, 0.0, 0.0],
    lab50: [0.0, 0.0, 0.0],
    luv: [0.0, 0.0, 0.0],
    luv50: [0.0, 0.0, 0.0],
    hcl: [0.0, 0.0, 0.0],
    hcl50: [0.0, 0.0, 0.0],
    rgba: [0, 0, 0, 65535],
    rgb255: [0, 0, 0],
  },
];

// Short hex test values from Go reference
const shortHexValues = [
  { c: [1.0, 1.0, 1.0], hex: '#fff' },
  { c: [0.6, 1.0, 1.0], hex: '#9ff' },
  { c: [1.0, 0.6, 1.0], hex: '#f9f' },
  { c: [1.0, 1.0, 0.6], hex: '#ff9' },
  { c: [0.6, 0.6, 1.0], hex: '#99f' },
  { c: [1.0, 0.6, 0.6], hex: '#f99' },
  { c: [0.6, 1.0, 0.6], hex: '#9f9' },
  { c: [0.6, 0.6, 0.6], hex: '#999' },
  { c: [0.0, 1.0, 1.0], hex: '#0ff' },
  { c: [1.0, 0.0, 1.0], hex: '#f0f' },
  { c: [1.0, 1.0, 0.0], hex: '#ff0' },
  { c: [0.0, 0.0, 1.0], hex: '#00f' },
  { c: [0.0, 1.0, 0.0], hex: '#0f0' },
  { c: [1.0, 0.0, 0.0], hex: '#f00' },
  { c: [0.0, 0.0, 0.0], hex: '#000' },
];

test('RGBA conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [r, g, b, a] = c.rgba();

    expect(r).toBe(val.rgba[0]);
    expect(g).toBe(val.rgba[1]);
    expect(b).toBe(val.rgba[2]);
    expect(a).toBe(val.rgba[3]);
  }
});

test('RGB255 conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [r, g, b] = c.rgb255();

    expect(r).toBe(val.rgb255[0]);
    expect(g).toBe(val.rgb255[1]);
    expect(b).toBe(val.rgb255[2]);
  }
});

test('HSV creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.hsv(val.hsv[0], val.hsv[1], val.hsv[2]);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('HSV conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [h, s, v] = c.hsv();

    expect(almostEq(h, val.hsv[0])).toBe(true);
    expect(almostEq(s, val.hsv[1])).toBe(true);
    expect(almostEq(v, val.hsv[2])).toBe(true);
  }
});

test('HSL creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.hsl(val.hsl[0], val.hsl[1], val.hsl[2]);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('HSL conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [h, s, l] = c.hsl();

    expect(almostEq(h, val.hsl[0])).toBe(true);
    expect(almostEq(s, val.hsl[1])).toBe(true);
    expect(almostEq(l, val.hsl[2])).toBe(true);
  }
});

test('Hex creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.hex(val.hex);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('HEX creation (uppercase) matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.hex(val.hex.toUpperCase());
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('Short hex creation matches Go reference', () => {
  for (let i = 0; i < shortHexValues.length; i++) {
    const val = shortHexValues[i];
    const c = colorful.hex(val.hex);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('Short HEX creation (uppercase) matches Go reference', () => {
  for (let i = 0; i < shortHexValues.length; i++) {
    const val = shortHexValues[i];
    const c = colorful.hex(val.hex.toUpperCase());
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('Hex conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const hex = c.hex();

    expect(hex).toBe(val.hex);
  }
});

test('XYZ creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.xyz(val.xyz[0], val.xyz[1], val.xyz[2]);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('XYZ conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [x, y, z] = c.xyz();

    expect(almostEq(x, val.xyz[0])).toBe(true);
    expect(almostEq(y, val.xyz[1])).toBe(true);
    expect(almostEq(z, val.xyz[2])).toBe(true);
  }
});

test('xyY creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.xyy(val.xyy[0], val.xyy[1], val.xyy[2]);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('xyY conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [x, y, Y] = c.xyy();

    expect(almostEq(x, val.xyy[0])).toBe(true);
    expect(almostEq(y, val.xyy[1])).toBe(true);
    expect(almostEq(Y, val.xyy[2])).toBe(true);
  }
});

test('Lab creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.lab(val.lab[0], val.lab[1], val.lab[2]);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('Lab conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [l, a, b] = c.lab();

    expect(almostEq(l, val.lab[0])).toBe(true);
    expect(almostEq(a, val.lab[1])).toBe(true);
    expect(almostEq(b, val.lab[2])).toBe(true);
  }
});

test('Lab D50 white reference creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.labWhiteRef(val.lab50[0], val.lab50[1], val.lab50[2], colorful.D50);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('Lab D50 white reference conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [l, a, b] = c.labWhiteRef(colorful.D50);

    expect(almostEq(l, val.lab50[0])).toBe(true);
    expect(almostEq(a, val.lab50[1])).toBe(true);
    expect(almostEq(b, val.lab50[2])).toBe(true);
  }
});

test('Luv creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.luv(val.luv[0], val.luv[1], val.luv[2]);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('Luv conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [l, u, v] = c.luv();

    expect(almostEq(l, val.luv[0])).toBe(true);
    expect(almostEq(u, val.luv[1])).toBe(true);
    expect(almostEq(v, val.luv[2])).toBe(true);
  }
});

test('Luv D50 white reference creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.luvWhiteRef(val.luv50[0], val.luv50[1], val.luv50[2], colorful.D50);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('Luv D50 white reference conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [l, u, v] = c.luvWhiteRef(colorful.D50);

    expect(almostEq(l, val.luv50[0])).toBe(true);
    expect(almostEq(u, val.luv50[1])).toBe(true);
    expect(almostEq(v, val.luv50[2])).toBe(true);
  }
});

test('HCL creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.hcl(val.hcl[0], val.hcl[1], val.hcl[2]);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('HCL conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [h, c_val, l] = c.hcl();

    expect(almostEq(h, val.hcl[0])).toBe(true);
    expect(almostEq(c_val, val.hcl[1])).toBe(true);
    expect(almostEq(l, val.hcl[2])).toBe(true);
  }
});

test('HCL D50 white reference creation matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = colorful.hclWhiteRef(val.hcl50[0], val.hcl50[1], val.hcl50[2], colorful.D50);
    const expected = new colorful.Color(val.c[0], val.c[1], val.c[2]);

    expect(almostEq(c.r, expected.r)).toBe(true);
    expect(almostEq(c.g, expected.g)).toBe(true);
    expect(almostEq(c.b, expected.b)).toBe(true);
  }
});

test('HCL D50 white reference conversion matches Go reference', () => {
  for (let i = 0; i < referenceValues.length; i++) {
    const val = referenceValues[i];
    const c = new colorful.Color(val.c[0], val.c[1], val.c[2]);
    const [h, c_val, l] = c.hclWhiteRef(colorful.D50);

    expect(almostEq(h, val.hcl50[0])).toBe(true);
    expect(almostEq(c_val, val.hcl50[1])).toBe(true);
    expect(almostEq(l, val.hcl50[2])).toBe(true);
  }
});

// Test blending edge cases from Go Issue #11
test('Blending edge cases (Go Issue #11)', () => {
  const c1 = colorful.hex('#1a1a46');
  const c2 = colorful.hex('#666666');

  // Test all blend modes with t=0 and t=1
  const blendMethods = [
    'blendHsv',
    'blendLuv',
    'blendRgb',
    'blendLinearRgb',
    'blendLab',
    'blendHcl',
    'blendLuvLCh',
    'blendOkLab',
    'blendOkLch',
  ] as const;

  for (const method of blendMethods) {
    // t=0 should return first color
    const blend0 = (c1 as Color & Record<typeof method, (c: Color, t: number) => Color>)
      [method](c2, 0)
      .hex();
    expect(blend0).toBe('#1a1a46');

    // t=1 should return second color
    const blend1 = (c1 as Color & Record<typeof method, (c: Color, t: number) => Color>)
      [method](c2, 1)
      .hex();
    expect(blend1).toBe('#666666');
  }
});

// Test clamping
test('Color clamping matches Go reference', () => {
  const c_orig = new colorful.Color(1.1, -0.1, 0.5);
  const c_want = new colorful.Color(1.0, 0.0, 0.5);
  const clamped = c_orig.clamped();

  expect(clamped.r).toBe(c_want.r);
  expect(clamped.g).toBe(c_want.g);
  expect(clamped.b).toBe(c_want.b);
});

// Test distance calculations with reference values
const distanceTestCases = [
  {
    c1: [1.0, 0.0, 0.0], // Lab values
    c2: [0.93139, -0.353319, -0.108946],
    d76: 0.37604638,
    d94: 0.37604638,
    d00: 0.23528129,
  },
  {
    c1: [0.720892, 0.651673, -0.422133],
    c2: [0.977637, -0.165795, 0.602017],
    d76: 1.33531088,
    d94: 0.65466377,
    d00: 0.75175896,
  },
  {
    c1: [0.590453, 0.332846, -0.637099],
    c2: [0.681085, 0.483884, 0.228328],
    d76: 0.88317072,
    d94: 0.42541075,
    d00: 0.37688153,
  },
];

test('Lab distance (CIE76) matches Go reference', () => {
  for (let i = 0; i < distanceTestCases.length; i++) {
    const testCase = distanceTestCases[i];
    const c1 = colorful.lab(testCase.c1[0], testCase.c1[1], testCase.c1[2]);
    const c2 = colorful.lab(testCase.c2[0], testCase.c2[1], testCase.c2[2]);

    const d = c1.distanceCIE76(c2);
    expect(almostEq(d, testCase.d76)).toBe(true);
  }
});

test('CIE94 distance matches Go reference', () => {
  for (let i = 0; i < distanceTestCases.length; i++) {
    const testCase = distanceTestCases[i];
    const c1 = colorful.lab(testCase.c1[0], testCase.c1[1], testCase.c1[2]);
    const c2 = colorful.lab(testCase.c2[0], testCase.c2[1], testCase.c2[2]);

    const d = c1.distanceCIE94(c2);
    expect(almostEq(d, testCase.d94)).toBe(true);
  }
});

test('CIEDE2000 distance matches Go reference', () => {
  for (let i = 0; i < distanceTestCases.length; i++) {
    const testCase = distanceTestCases[i];
    const c1 = colorful.lab(testCase.c1[0], testCase.c1[1], testCase.c1[2]);
    const c2 = colorful.lab(testCase.c2[0], testCase.c2[1], testCase.c2[2]);

    const d = c1.distanceCIEDE2000(c2);
    expect(almostEq(d, testCase.d00)).toBe(true);
  }
});
