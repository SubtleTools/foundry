/**
 * Utility functions used throughout the colorful library
 */

// Square function
export const sq = (v: number): number => v * v;

// Cube function
export const cub = (v: number): number => v * v * v;

// Clamp a value to [0..1]
export const clamp01 = (v: number): number => Math.max(0.0, Math.min(v, 1.0));

// Utility used by Hxx color-spaces for interpolating between two angles in [0,360].
export const interpAngle = (a0: number, a1: number, t: number): number => {
  // Based on the answer here: http://stackoverflow.com/a/14498790/2366315
  // With potential proof that it works here: http://math.stackexchange.com/a/2144499
  const delta = ((((a1 - a0) % 360.0) + 540) % 360.0) - 180.0;
  return (a0 + t * delta + 360.0) % 360.0;
};

// Linearization function for sRGB
export const linearize = (v: number): number => {
  if (v <= 0.04045) {
    return v / 12.92;
  }
  return ((v + 0.055) / 1.055) ** 2.4;
};

// Delinearization function for sRGB
export const delinearize = (v: number): number => {
  if (v <= 0.0031308) {
    return 12.92 * v;
  }
  return 1.055 * v ** (1.0 / 2.4) - 0.055;
};

// A much faster and still quite precise linearization using a 6th-order Taylor approximation.
export const linearizeFast = (v: number): number => {
  const v1 = v - 0.5;
  const v2 = v1 * v1;
  const v3 = v2 * v1;
  const v4 = v2 * v2;
  return (
    -0.248750514614486 +
    0.925583310193438 * v +
    1.16740237321695 * v2 +
    0.280457026598666 * v3 -
    0.0757991963780179 * v4
  );
};

// Fast delinearization function
export const delinearizeFast = (v: number): number => {
  // This function (fractional root) is much harder to linearize, so we need to split.
  if (v > 0.2) {
    const v1 = v - 0.6;
    const v2 = v1 * v1;
    const v3 = v2 * v1;
    const v4 = v2 * v2;
    const v5 = v3 * v2;
    return (
      0.442430344268235 +
      0.592178981271708 * v -
      0.287864782562636 * v2 +
      0.253214392068985 * v3 -
      0.272557158129811 * v4 +
      0.325554383321718 * v5
    );
  } else if (v > 0.03) {
    const v1 = v - 0.115;
    const v2 = v1 * v1;
    const v3 = v2 * v1;
    const v4 = v2 * v2;
    const v5 = v3 * v2;
    return (
      0.194915592891669 +
      1.55227076330229 * v -
      3.93691860257828 * v2 +
      18.0679839248761 * v3 -
      101.468750302746 * v4 +
      632.341487393927 * v5
    );
  } else {
    const v1 = v - 0.015;
    const v2 = v1 * v1;
    const v3 = v2 * v1;
    const v4 = v2 * v2;
    const v5 = v3 * v2;
    return (
      0.0519565234928877 +
      5.09316778537561 * v -
      99.0338180489702 * v2 +
      3484.52322764895 * v3 -
      150028.083412663 * v4 +
      7168008.42971613 * v5
    );
  }
};
