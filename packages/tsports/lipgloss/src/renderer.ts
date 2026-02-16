/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Renderer implementation matching Go Lipgloss exactly
 */

import {
  defaultOutputInstance,
  newOutput,
  type Output,
  type OutputOption,
  type Profile,
  Profile as TermenvProfile,
} from '@tsports/termenv';

/**
 * Renderer is a lipgloss terminal renderer - matches Go's Renderer struct exactly
 */
export class Renderer {
  private _output: Output;
  private _colorProfile?: Profile;
  private _hasDarkBackground?: boolean;
  private _getColorProfileOnce = false;
  private _explicitColorProfile = false;
  private _getBackgroundColorOnce = false;
  private _explicitBackgroundColor = false;

  constructor(output?: Output) {
    this._output = output || defaultOutputInstance();
    // hasDarkBackground will be lazily initialized from output when first accessed
    this._getBackgroundColorOnce = false;
  }

  /**
   * Output returns the termenv output
   */
  output(): Output {
    return this._output;
  }

  /**
   * SetOutput sets the termenv output
   */
  setOutput(output: Output): void {
    this._output = output;
  }

  /**
   * ColorProfile returns the detected termenv color profile
   */
  colorProfile(): Profile {
    if (!this._explicitColorProfile && !this._getColorProfileOnce) {
      this._getColorProfileOnce = true;
      this._colorProfile = this.getColorProfileWithForceColor();
    }
    return this._colorProfile!;
  }

  /**
   * SetColorProfile sets the color profile on the renderer
   */
  setColorProfile(profile: Profile | import('./types').ColorProfile): void {
    // ColorProfile enum now matches termenv Profile exactly - direct assignment!
    this._colorProfile = profile as Profile;
    this._explicitColorProfile = true;
  }

  /**
   * HasDarkBackground returns whether the renderer will render to a dark background
   */
  hasDarkBackground(): boolean {
    // Match Go's behavior: query the output if not explicitly set
    if (!this._explicitBackgroundColor && !this._getBackgroundColorOnce) {
      this._getBackgroundColorOnce = true;
      this._hasDarkBackground = this._output.hasDarkBackground();
    }
    return this._hasDarkBackground ?? false;
  }

  /**
   * SetHasDarkBackground sets the background color detection value on the renderer
   */
  setHasDarkBackground(isDark: boolean): void {
    this._hasDarkBackground = isDark;
    this._explicitBackgroundColor = true;
  }

  /**
   * Render applies styling properties to text and returns the styled result
   */
  /**
   * Create a new style associated with this renderer
   */
  newStyle(): import('./style').Style {
    const { Style } = require('./style');
    return new Style({}, this);
  }

  render(text: string, properties: import('./types').StyleProperties): string {
    // This is just basic color/text styling - the full implementation should be in Style.render()
    // This mimics the Go approach where the Renderer is simpler and Style handles the complex logic

    if (!this.supportsColor()) {
      return text;
    }

    // Create a termenv style object using the output
    let te = this._output.string();

    // Apply basic styling similar to Go implementation
    if (properties.bold || properties.fontWeight === 'bold') {
      te = te.bold();
    }
    if (properties.italic || properties.fontStyle === 'italic') {
      te = te.italic();
    }
    if (properties.underline || properties.textDecoration?.underline) {
      te = te.underline();
    }
    if (properties.strikethrough || properties.textDecoration?.strikethrough) {
      te = te.crossOut();
    }
    if (properties.faint || properties.fontWeight === 'faint') {
      te = te.faint();
    }

    // Apply colors if present
    if (properties.color) {
      const colorStr = this.colorToString(properties.color);
      const color = this._output.color(colorStr);
      if (color) {
        te = te.foreground(color);
      }
    }

    if (properties.backgroundColor) {
      const bgColorStr = this.colorToString(properties.backgroundColor);
      const bgColor = this._output.color(bgColorStr);
      if (bgColor) {
        te = te.background(bgColor);
      }
    }

    // Use termenv's styling method like Go does
    return te.styled(text);
  }

  private colorToString(color: import('./types').ColorValue): string {
    if (!color) return '';
    if (typeof color === 'string') return color;
    if (typeof color === 'number') return color.toString();

    // Handle TerminalColor objects
    if (typeof color === 'object' && 'RGBA' in color) {
      const [r, g, b] = (color as import('./color').TerminalColor).RGBA();
      return `#${(r >> 8).toString(16).padStart(2, '0')}${(g >> 8).toString(16).padStart(2, '0')}${(b >> 8).toString(16).padStart(2, '0')}`;
    }

    // Handle RGB/RGBA objects
    if (
      typeof color === 'object' &&
      'r' in color &&
      'g' in color &&
      'b' in color
    ) {
      const { r, g, b } = color as any;
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    return '';
  }

  /**
   * supportsColor returns whether the renderer supports colors
   */
  supportsColor(): boolean {
    const profile = this.colorProfile();
    return profile !== TermenvProfile.Ascii;
  }

  /**
   * Handle FORCE_COLOR environment variable - matches Go lipgloss implementation exactly.
   * Go's lipgloss renderer.go lines 91-113:
   * 1. Check FORCE_COLOR first (takes precedence over TTY status)
   * 2. Parse as integer: 0=Ascii, 1=ANSI, 2=ANSI256, 3=TrueColor
   * 3. Non-numeric FORCE_COLOR enables ANSI
   * 4. Fall back to termenv's EnvColorProfile() if FORCE_COLOR not set
   */
  private getColorProfileWithForceColor(): Profile {
    // Check FORCE_COLOR first - it takes precedence (matches Go behavior)
    if (typeof process !== 'undefined' && process.env) {
      const forceColor = process.env.FORCE_COLOR;
      if (forceColor !== undefined && forceColor !== '') {
        const level = parseInt(forceColor, 10);
        if (!isNaN(level)) {
          switch (level) {
            case 0:
              return TermenvProfile.Ascii;
            case 1:
              return TermenvProfile.ANSI;
            case 2:
              return TermenvProfile.ANSI256;
            case 3:
              return TermenvProfile.TrueColor;
            default:
              return TermenvProfile.ANSI;
          }
        }
        // Non-numeric FORCE_COLOR value - enable basic colors
        return TermenvProfile.ANSI;
      }
    }

    // Fall back to termenv's environment-aware detection
    return this._output.envColorProfile();
  }
}

// Default renderer instance - matches Go's global renderer exactly
export const renderer = new Renderer();

/**
 * DefaultRenderer returns the default renderer
 */
export function defaultRenderer(): Renderer {
  return renderer;
}

/**
 * SetDefaultRenderer sets the default global renderer
 */
export function setDefaultRenderer(r: Renderer): void {
  // In Go this would reassign the global variable,
  // but in TS we need to copy the properties
  renderer.setOutput(r.output());
  if ((r as any)._explicitColorProfile) {
    renderer.setColorProfile(r.colorProfile());
  }
  if ((r as any)._explicitBackgroundColor) {
    renderer.setHasDarkBackground(r.hasDarkBackground());
  }
}

/**
 * NewRenderer creates a new Renderer
 */
export function newRenderer(output: Output): Renderer {
  return new Renderer(output);
}

/**
 * Convenience functions that use the default renderer - match Go API exactly
 */

export function colorProfile(): Profile {
  return renderer.colorProfile();
}

export function setColorProfile(profile: Profile): void {
  renderer.setColorProfile(profile);
}

export function hasDarkBackground(): boolean {
  return renderer.hasDarkBackground();
}

export function setHasDarkBackground(isDark: boolean): void {
  renderer.setHasDarkBackground(isDark);
}
