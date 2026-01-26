import type { Palette } from '../palette.js';
import { Crayola } from './crayola.js';
import { CSS } from './css.js';
import { Monokai } from './monokai.js';
import { RAL } from './ral.js';
import { Resene } from './resene.js';
import { Wikipedia } from './wikipedia.js';

export { Monokai, Wikipedia, Crayola, Resene, RAL, CSS };

/**
 * allPalettes returns a mix of all palettes defined in gamut
 */
export function allPalettes(): Palette {
  return Wikipedia.mixedWith(Monokai)
    .mixedWith(Crayola)
    .mixedWith(Resene)
    .mixedWith(RAL)
    .mixedWith(CSS);
}
