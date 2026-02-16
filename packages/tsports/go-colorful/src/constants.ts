/**
 * Constants used throughout the colorful library
 */

// This is the tolerance used when comparing colors using AlmostEqualRgb.
export const Delta = 1.0 / 255.0;

// This is the default reference white point (D65).
export const D65: [number, number, number] = [0.95047, 1.0, 1.08883];

// And another reference white point (D50).
export const D50: [number, number, number] = [0.96422, 1.0, 0.82521];

// HSLuv uses a rounded version of the D65. This has no impact on the final RGB
// values, but to keep high levels of accuracy for internal operations and when
// comparing to the test values, this modified white reference is used internally.
export const HSLuvD65: [number, number, number] = [0.95045592705167, 1.0, 1.089057750759878];
