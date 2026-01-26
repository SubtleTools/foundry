/**
 * @tsports/gamut - Palette implementation
 *
 * Ported from gamut.go
 */

import { type Color, MakeColor } from '@tsports/go-colorful';
import type { Colors } from './types.js';
import { wagnerFischer } from './utils.js';

/**
 * Palette is a collection of colors.
 */
export class Palette {
  // Map of color hex string to list of Colors with that color value
  // Corresponds to Go's map[color.Color]Colors
  private _colors: Map<string, Colors>;

  // Map of normalized color name to Color
  // Corresponds to Go's map[string]color.Color
  private _names: Map<string, Color>;

  constructor() {
    this._colors = new Map();
    this._names = new Map();
  }

  /**
   * MixedWith mixes two palettes.
   */
  mixedWith(p: Palette): Palette {
    const np = new Palette();
    np.addColors(this.getColors());
    np.addColors(p.getColors());
    return np;
  }

  /**
   * AddColors adds colors to the palette.
   */
  addColors(cc: Colors): void {
    for (const c of cc) {
      const col = c.color;
      // Use hex as key for color equality
      // Note: Go uses struct equality. Hex is approx equivalent for 8-bit colors.
      const key = this.toKey(col);

      let found = false;
      const existing = this._colors.get(key) || [];

      for (const v of existing) {
        if (v.name === c.name) {
          found = true;
          break;
        }
      }

      if (!found) {
        const newEntry = [...existing, c];
        this._colors.set(key, newEntry);
      }

      this._names.set(c.name.toUpperCase(), c.color);
    }
  }

  /**
   * Colors returns the Palette's colors.
   */
  getColors(): Colors {
    const r: Colors = [];
    for (const c of this._colors.values()) {
      r.push(...c);
    }
    return r;
  }

  /**
   * Clamped expects a slice of colors and returns a slice of the nearest matching
   * colors from the palette.
   */
  clamped(cc: Color[]): Colors {
    const r: Colors = [];
    for (const c of cc) {
      const [nm] = this.name(c);
      if (nm && nm.length > 0) {
        const first = nm[0];
        if (first) r.push(first);
      }
    }
    return r;
  }

  /**
   * Color returns the color with a specific name.
   * Returns [Color, true] if found, [black, false] if not (matching Go style somewhat,
   * though Go returns interface implicitly nil? No, returns value).
   * We will return [Color | undefined, boolean].
   */
  color(name: string): [Color | undefined, boolean] {
    const c = this._names.get(name.toUpperCase());
    return [c, !!c];
  }

  /**
   * Name returns the name of the closest matching color.
   */
  name(color: Color): [Colors, number] {
    let d = -1;
    let m: Colors = [];

    const [c] = MakeColor(color);

    for (const v of this._colors.values()) {
      if (v.length === 0) continue;

      const firstColor = v[0];
      if (!firstColor) continue;

      const [col] = MakeColor(firstColor.color);

      const nd = col.distanceLab(c);
      if (nd < d || d === -1) {
        d = nd;
        m = [...v];
      }
    }

    return [m, d];
  }

  /**
   * Filter returns colors matching name.
   */
  filter(name: string): Colors {
    const s = name.toLowerCase();
    const c: Colors = [];

    for (const v of this._colors.values()) {
      for (const vv of v) {
        if (vv.name.toLowerCase().includes(s)) {
          c.push(vv);
        }
      }
    }

    c.sort((i, j) => {
      const di = wagnerFischer(i.name.toLowerCase(), s, 1, 1, 2);
      const dj = wagnerFischer(j.name.toLowerCase(), s, 1, 1, 2);
      return di - dj;
    });

    return c;
  }

  private toKey(c: Color): string {
    // Go-colorful's Hex() returns 2-digit hex per channel
    const [cc] = MakeColor(c);
    return cc.hex();
  }
}
