/**
 * Color profile implementation for termenv.
 * Port of github.com/muesli/termenv profile.go to TypeScript.
 */

import { Color as ColorfulColor, Hex } from '@tsports/go-colorful';
import { Style } from './style.js';
import {
  ANSI256Color,
  ANSIColor,
  ansiHex,
  type Color,
  NoColor,
  Profile,
  RGBColor,
} from './types.js';

/**
 * Standard CSS/X11 named colors mapped to hex values
 * NOTE: Named colors are NOT supported in Go's termenv.Color() function.
 * This constant is kept for reference/future use but is currently unused.
 * The ProfileUtils.color() function only accepts hex strings or numeric ANSI codes.
 */
// biome-ignore lint/correctness/noUnusedVariables: kept for potential future use
// @ts-ignore - unused constant kept for reference
const namedColors: Record<string, string> = {
  // Standard colors
  'aliceblue': '#f0f8ff',
  'antiquewhite': '#faebd7',
  'aqua': '#00ffff',
  'aquamarine': '#7fffd4',
  'azure': '#f0ffff',
  'beige': '#f5f5dc',
  'bisque': '#ffe4c4',
  'black': '#000000',
  'blanchedalmond': '#ffebcd',
  'blue': '#0000ff',
  'blueviolet': '#8a2be2',
  'brown': '#a52a2a',
  'burlywood': '#deb887',
  'cadetblue': '#5f9ea0',
  'chartreuse': '#7fff00',
  'chocolate': '#d2691e',
  'coral': '#ff7f50',
  'cornflowerblue': '#6495ed',
  'cornsilk': '#fff8dc',
  'crimson': '#dc143c',
  'cyan': '#00ffff',
  'darkblue': '#00008b',
  'darkcyan': '#008b8b',
  'darkgoldenrod': '#b8860b',
  'darkgray': '#a9a9a9',
  'darkgrey': '#a9a9a9',
  'darkgreen': '#006400',
  'darkkhaki': '#bdb76b',
  'darkmagenta': '#8b008b',
  'darkolivegreen': '#556b2f',
  'darkorange': '#ff8c00',
  'darkorchid': '#9932cc',
  'darkred': '#8b0000',
  'darksalmon': '#e9967a',
  'darkseagreen': '#8fbc8f',
  'darkslateblue': '#483d8b',
  'darkslategray': '#2f4f4f',
  'darkslategrey': '#2f4f4f',
  'darkturquoise': '#00ced1',
  'darkviolet': '#9400d3',
  'deeppink': '#ff1493',
  'deepskyblue': '#00bfff',
  'dimgray': '#696969',
  'dimgrey': '#696969',
  'dodgerblue': '#1e90ff',
  'firebrick': '#b22222',
  'floralwhite': '#fffaf0',
  'forestgreen': '#228b22',
  'fuchsia': '#ff00ff',
  'gainsboro': '#dcdcdc',
  'ghostwhite': '#f8f8ff',
  'gold': '#ffd700',
  'goldenrod': '#daa520',
  'gray': '#808080',
  'grey': '#808080',
  'green': '#008000',
  'greenyellow': '#adff2f',
  'honeydew': '#f0fff0',
  'hotpink': '#ff69b4',
  'indianred': '#cd5c5c',
  'indigo': '#4b0082',
  'ivory': '#fffff0',
  'khaki': '#f0e68c',
  'lavender': '#e6e6fa',
  'lavenderblush': '#fff0f5',
  'lawngreen': '#7cfc00',
  'lemonchiffon': '#fffacd',
  'lightblue': '#add8e6',
  'lightcoral': '#f08080',
  'lightcyan': '#e0ffff',
  'lightgoldenrodyellow': '#fafad2',
  'lightgray': '#d3d3d3',
  'lightgrey': '#d3d3d3',
  'lightgreen': '#90ee90',
  'lightpink': '#ffb6c1',
  'lightsalmon': '#ffa07a',
  'lightseagreen': '#20b2aa',
  'lightskyblue': '#87cefa',
  'lightslategray': '#778899',
  'lightslategrey': '#778899',
  'lightsteelblue': '#b0c4de',
  'lightyellow': '#ffffe0',
  'lime': '#00ff00',
  'limegreen': '#32cd32',
  'linen': '#faf0e6',
  'magenta': '#ff00ff',
  'maroon': '#800000',
  'mediumaquamarine': '#66cdaa',
  'mediumblue': '#0000cd',
  'mediumorchid': '#ba55d3',
  'mediumpurple': '#9370db',
  'mediumseagreen': '#3cb371',
  'mediumslateblue': '#7b68ee',
  'mediumspringgreen': '#00fa9a',
  'mediumturquoise': '#48d1cc',
  'mediumvioletred': '#c71585',
  'midnightblue': '#191970',
  'mintcream': '#f5fffa',
  'mistyrose': '#ffe4e1',
  'moccasin': '#ffe4b5',
  'navajowhite': '#ffdead',
  'navy': '#000080',
  'oldlace': '#fdf5e6',
  'olive': '#808000',
  'olivedrab': '#6b8e23',
  'orange': '#ffa500',
  'orangered': '#ff4500',
  'orchid': '#da70d6',
  'palegoldenrod': '#eee8aa',
  'palegreen': '#98fb98',
  'paleturquoise': '#afeeee',
  'palevioletred': '#db7093',
  'papayawhip': '#ffefd5',
  'peachpuff': '#ffdab9',
  'peru': '#cd853f',
  'pink': '#ffc0cb',
  'plum': '#dda0dd',
  'powderblue': '#b0e0e6',
  'purple': '#800080',
  'red': '#ff0000',
  'rosybrown': '#bc8f8f',
  'royalblue': '#4169e1',
  'saddlebrown': '#8b4513',
  'salmon': '#fa8072',
  'sandybrown': '#f4a460',
  'seagreen': '#2e8b57',
  'seashell': '#fff5ee',
  'sienna': '#a0522d',
  'silver': '#c0c0c0',
  'skyblue': '#87ceeb',
  'slateblue': '#6a5acd',
  'slategray': '#708090',
  'slategrey': '#708090',
  'snow': '#fffafa',
  'springgreen': '#00ff7f',
  'steelblue': '#4682b4',
  'tan': '#d2b48c',
  'teal': '#008080',
  'thistle': '#d8bfd8',
  'tomato': '#ff6347',
  'turquoise': '#40e0d0',
  'violet': '#ee82ee',
  'wheat': '#f5deb3',
  'white': '#ffffff',
  'whitesmoke': '#f5f5f5',
  'yellow': '#ffff00',
  'yellowgreen': '#9acd32',
};

/**
 * Profile utility functions - matches Go profile.go interface
 */
export const ProfileUtils = {
  /**
   * Get the profile name as a string
   */
  getName(profile: Profile): string {
    switch (profile) {
      case Profile.Ascii:
        return 'Ascii';
      case Profile.ANSI:
        return 'ANSI';
      case Profile.ANSI256:
        return 'ANSI256';
      case Profile.TrueColor:
        return 'TrueColor';
      default:
        return 'Unknown';
    }
  },

  /**
   * Create a new Style with the given profile and strings
   */
  string(profile: Profile, ...strings: string[]): Style {
    return new Style(profile, strings.join(' '));
  },

  /**
   * Convert transforms a given Color to a Color supported within the Profile
   */
  convert(profile: Profile, color: Color): Color {
    if (profile === Profile.Ascii) {
      return new NoColor();
    }

    if (color instanceof ANSIColor) {
      // Keep ANSI colors as-is in all profiles (including TrueColor)
      // This matches Go's termenv behavior
      return color;
    }

    if (color instanceof ANSI256Color) {
      if (profile === Profile.ANSI) {
        return ansi256ToANSIColor(color);
      }
      // In TrueColor mode, keep ANSI256 colors as-is (don't convert to RGB)
      // This matches Go's termenv behavior
      return color;
    }

    if (color instanceof RGBColor) {
      const colorful = Hex(color.hex);
      if (!colorful) {
        return new NoColor();
      }

      if (profile !== Profile.TrueColor) {
        const ansi256Color = hexToANSI256Color(colorful);
        if (profile === Profile.ANSI) {
          return ansi256ToANSIColor(ansi256Color);
        }
        return ansi256Color;
      }
      return color;
    }

    return color;
  },

  /**
   * Create a Color from a string. Valid inputs are:
   * - Hex colors: "#ff0000" or "#f00"
   * - ANSI color codes: "0" to "255"
   *
   * Note: Named colors like "red", "blue" are NOT supported (matches Go behavior)
   */
  color(profile: Profile, s: string): Color | null {
    if (s.length === 0) {
      return null;
    }

    let color: Color;

    if (s.startsWith('#')) {
      color = new RGBColor(s);
    } else {
      // Try to parse as numeric ANSI color code
      const num = parseInt(s, 10);
      if (Number.isNaN(num)) {
        // Not a valid color format - return null (matches Go behavior)
        return null;
      }

      if (num < 16) {
        color = new ANSIColor(num);
      } else {
        color = new ANSI256Color(num);
      }
    }

    return ProfileUtils.convert(profile, color);
  },

  /**
   * Create a Color from a standard Color interface (mimics Go color.Color)
   */
  fromColor(profile: Profile, c: { r: number; g: number; b: number }): Color {
    const colorful = new ColorfulColor(c.r, c.g, c.b);
    const hex = colorful.hex();
    const color = new RGBColor(hex);
    return ProfileUtils.convert(profile, color);
  },
};

/**
 * Convert ANSI256 color to nearest ANSI color using HSLuv distance
 */
function ansi256ToANSIColor(c: ANSI256Color): ANSIColor {
  let result = 0;
  let minDistance = Number.MAX_VALUE;

  const sourceHex = ansiHex[c.value];
  if (!sourceHex) {
    return new ANSIColor(0);
  }

  const sourceColorful = Hex(sourceHex);
  if (!sourceColorful) {
    return new ANSIColor(0);
  }

  // Find closest ANSI color (0-15) using HSLuv distance
  for (let i = 0; i <= 15; i++) {
    const targetHex = ansiHex[i];
    if (!targetHex) continue;

    const targetColorful = Hex(targetHex);
    if (!targetColorful) continue;

    const distance = sourceColorful.distanceHSLuv(targetColorful);
    if (distance < minDistance) {
      minDistance = distance;
      result = i;
    }
  }

  return new ANSIColor(result);
}

/**
 * Convert ANSI256 color code to hex color string
 * Currently unused but kept for potential future use
 */
// @ts-ignore - unused function kept for reference
// biome-ignore lint/correctness/noUnusedVariables: kept for potential future use
function ansi256ToHex(value: number): string {
  return ansiHex[value] || '#000000';
}

/**
 * Convert hex color to nearest ANSI256 color - matches Go implementation exactly
 */
function hexToANSI256Color(c: ColorfulColor): ANSI256Color {
  const v2ci = (v: number): number => {
    const val = v * 255;
    if (val < 48) return 0;
    if (val < 115) return 1;
    return Math.floor((val - 35) / 40);
  };

  // Calculate the nearest 0-based color index at 16..231
  const r = v2ci(c.r); // 0..5 each
  const g = v2ci(c.g);
  const b = v2ci(c.b);
  const colorIndex = 36 * r + 6 * g + b; /* 0..215 */

  // Calculate the represented colors back from the index
  const i2cv = [0, 0x5f, 0x87, 0xaf, 0xd7, 0xff];
  const cr = (i2cv[r] || 0) / 255; // r/g/b, 0..1 each
  const cg = (i2cv[g] || 0) / 255;
  const cb = (i2cv[b] || 0) / 255;

  // Calculate the nearest 0-based gray index at 232..255
  let grayIndex: number;
  const average = (r + g + b) / 3;
  if (average > (238 / 255) * 5) {
    grayIndex = 23;
  } else {
    grayIndex = Math.floor((average * 255 - 3) / 10); // 0..23
  }
  const grayValue = (8 + 10 * grayIndex) / 255; // same value for r/g/b, 0..1

  // Return the one which is nearer to the original input rgb value
  const colorColorful = new ColorfulColor(cr, cg, cb);
  const grayColorful = new ColorfulColor(grayValue, grayValue, grayValue);

  if (!colorColorful || !grayColorful) {
    return new ANSI256Color(16); // fallback
  }

  const colorDistance = c.distanceHSLuv(colorColorful);
  const grayDistance = c.distanceHSLuv(grayColorful);

  if (colorDistance <= grayDistance) {
    return new ANSI256Color(16 + colorIndex);
  }
  return new ANSI256Color(232 + grayIndex);
}
