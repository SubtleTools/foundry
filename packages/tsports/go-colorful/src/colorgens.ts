/**
 * Various ways to generate single random colors
 */

import { type Color, hcl, hsv } from './colors';
import { getDefaultGlobalRand, type RandInterface } from './rand';

// Creates a random dark, "warm" color through a restricted HSV space.
export const FastWarmColorWithRand = (rand: RandInterface): Color => {
  return hsv(rand.float64() * 360.0, 0.5 + rand.float64() * 0.3, 0.3 + rand.float64() * 0.3);
};

export const FastWarmColor = (): Color => {
  return FastWarmColorWithRand(getDefaultGlobalRand());
};

// Creates a random dark, "warm" color through restricted HCL space.
// This is slower than FastWarmColor but will likely give you colors which have
// the same "warmness" if you run it many times.
export const WarmColorWithRand = (rand: RandInterface): Color => {
  let c: Color;
  do {
    c = randomWarmWithRand(rand);
  } while (!c.isValid());
  return c;
};

export const WarmColor = (): Color => {
  return WarmColorWithRand(getDefaultGlobalRand());
};

const randomWarmWithRand = (rand: RandInterface): Color => {
  return hcl(rand.float64() * 360.0, 0.1 + rand.float64() * 0.3, 0.2 + rand.float64() * 0.3);
};

// Creates a random bright, "pimpy" color through a restricted HSV space.
export const FastHappyColorWithRand = (rand: RandInterface): Color => {
  return hsv(rand.float64() * 360.0, 0.7 + rand.float64() * 0.3, 0.6 + rand.float64() * 0.3);
};

export const FastHappyColor = (): Color => {
  return FastHappyColorWithRand(getDefaultGlobalRand());
};

// Creates a random bright, "pimpy" color through restricted HCL space.
// This is slower than FastHappyColor but will likely give you colors which
// have the same "brightness" if you run it many times.
export const HappyColorWithRand = (rand: RandInterface): Color => {
  let c: Color;
  do {
    c = randomPimpWithRand(rand);
  } while (!c.isValid());
  return c;
};

export const HappyColor = (): Color => {
  return HappyColorWithRand(getDefaultGlobalRand());
};

const randomPimpWithRand = (rand: RandInterface): Color => {
  return hcl(rand.float64() * 360.0, 0.5 + rand.float64() * 0.3, 0.5 + rand.float64() * 0.3);
};
