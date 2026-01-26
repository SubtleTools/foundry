/**
 * @tsports/gamut - Theme implementation
 *
 * Ported from themes.go
 */

import { MakeColor } from '@tsports/go-colorful';
import { Monokai } from '../palette/index.js';
import type { Color, Colors } from '../types.js';
import { Role } from './roles.js';

/**
 * A Theme is a collection of colors mapped to a role (or function)
 */
export class Theme {
  public name: string;
  private colorsMap: Map<Role, Color>;

  constructor(name: string) {
    this.name = name;
    this.colorsMap = new Map();
  }

  /**
   * SetRole sets the theme's color for a specific role
   */
  setRole(r: Role, c: Color): void {
    this.colorsMap.set(r, c);
  }

  /**
   * Role returns the theme's color for a specific role
   */
  role(r: Role): Color | undefined {
    return this.colorsMap.get(r);
  }

  /**
   * Colors returns all (unique) colors used in this theme
   */
  colors(): Colors {
    const cm = new Map<string, Color>();
    for (const c of this.colorsMap.values()) {
      const [cc] = MakeColor(c.color);
      const hex = cc.hex();
      if (!cm.has(hex)) {
        cm.set(hex, c);
      }
    }

    return Array.from(cm.values());
  }
}

/**
 * MonokaiTheme is a popular theme used for syntax highlighting
 */
export const MonokaiTheme = new Theme('monokai');

// Initialize MonokaiTheme
const extraWhite = Monokai.filter('Extra White')[0];
const caviar = Monokai.filter('Caviar')[0];
const caviarDark = Monokai.filter('Caviar Dark')[0];
const cocoon = Monokai.filter('Cocoon')[0];
const armadillo = Monokai.filter('Armadillo')[0];
const elPaso = Monokai.filter('El Paso')[0];

if (extraWhite) MonokaiTheme.setRole(Role.Foreground, extraWhite);
if (caviar) {
  MonokaiTheme.setRole(Role.Background, caviar);
  MonokaiTheme.setRole(Role.Base, caviar);
}
if (caviarDark) MonokaiTheme.setRole(Role.AlternateBase, caviarDark);
if (cocoon) MonokaiTheme.setRole(Role.Text, cocoon);
if (armadillo) MonokaiTheme.setRole(Role.Selection, armadillo);
if (elPaso) MonokaiTheme.setRole(Role.Highlight, elPaso);
