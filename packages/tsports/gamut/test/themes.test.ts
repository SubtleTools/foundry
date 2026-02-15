import { describe, expect, it } from 'bun:test';
import { Monokai } from '../src/palette/monokai.js';
import { Role } from '../src/theme/roles.js';
import { MonokaiTheme } from '../src/theme/themes.js';

describe('Themes', () => {
  it('should list all colors in theme', () => {
    const cc = MonokaiTheme.colors();
    // In themes.go, exp is 6.
    // MonokaiTheme roles:
    // Foreground: Extra White
    // Background: Caviar
    // Base: Caviar (duplicate color)
    // AlternateBase: Caviar Dark
    // Text: Cocoon
    // Selection: Armadillo
    // Highlight: El Paso
    // Total unique colors: 6.
    expect(cc.length).toBe(6);
  });

  it('should retrieve color by role', () => {
    const c = MonokaiTheme.role(Role.Foreground);
    const exp = Monokai.filter('Extra White')[0];
    if (exp) {
      expect(c?.name).toBe(exp.name);
    }
  });
});
