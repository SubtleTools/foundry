/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Color types and implementations matching Go Lipgloss exactly
 */

import type { Output, Profile, Color as TermenvColor } from '@tsports/termenv';
import {
  NoColor as TermenvNoColor,
  Profile as TermenvProfile,
  color as termenvColor,
  noColor as termenvNoColor,
  ProfileUtils,
} from '@tsports/termenv';
import type { Renderer } from './renderer.js';

/**
 * TerminalColor interface - matches Go's interface exactly
 */
export interface TerminalColor {
  color(renderer: Renderer): TermenvColor;
  RGBA(): [number, number, number, number];
}

/**
 * NoColor represents the absence of color styling
 * Matches Go's NoColor{} struct exactly
 */
export class NoColor implements TerminalColor {
  color(renderer: Renderer): TermenvColor {
    return termenvNoColor();
  }

  RGBA(): [number, number, number, number] {
    // Match Go's NoColor RGBA implementation
    return [0, 0, 0, 0xffff];
  }
}

/**
 * Color represents a color by hex or ANSI value
 * Matches Go's Color string type exactly
 */
export class ColorClass implements TerminalColor {
  constructor(private value: string) {}

  color(renderer: Renderer): TermenvColor {
    // Match Go's implementation exactly: r.ColorProfile().Color(string(c))
    // Pass the value directly to termenv's profile without any conversion
    // If termenv doesn't recognize the color (e.g., named colors like "red"),
    // it will return null, and we treat that as no color (NoColor)
    const color = ProfileUtils.color(renderer.colorProfile(), this.value);
    return color || termenvNoColor();
  }

  RGBA(): [number, number, number, number] {
    // Match Go's color.Color interface: RGBA returns uint32 values in 0-65535 range
    // Go implementation: return termenv.ConvertToRGB(c.color(renderer)).RGBA()
    if (this.value.startsWith('#') && this.value.length === 7) {
      const hex = this.value.slice(1);
      const r8 = parseInt(hex.slice(0, 2), 16);
      const g8 = parseInt(hex.slice(2, 4), 16);
      const b8 = parseInt(hex.slice(4, 6), 16);
      // Convert from 0-255 to 0-65535 range by multiplying by 257 (65535/255)
      const r = r8 | (r8 << 8);
      const g = g8 | (g8 << 8);
      const b = b8 | (b8 << 8);
      return [r, g, b, 0xffff];
    }
    return [0, 0, 0, 0xffff];
  }

  toString(): string {
    return this.value;
  }
}

/**
 * ANSIColor represents an ANSI color value
 * Matches Go's ANSIColor uint type exactly
 */
export class ANSIColorClass implements TerminalColor {
  constructor(private value: number) {
    this.value = Math.max(0, Math.floor(value));
  }

  color(renderer: Renderer): TermenvColor {
    return new ColorClass(this.value.toString()).color(renderer);
  }

  RGBA(): [number, number, number, number] {
    return new ColorClass(this.value.toString()).RGBA();
  }

  toString(): string {
    return this.value.toString();
  }

  valueOf(): number {
    return this.value;
  }
}

/**
 * AdaptiveColor provides different colors for light and dark backgrounds
 * Matches Go's AdaptiveColor struct exactly
 */
export class AdaptiveColor implements TerminalColor {
  constructor(
    public readonly light: string,
    public readonly dark: string
  ) {}

  color(renderer: Renderer): TermenvColor {
    if (renderer.hasDarkBackground()) {
      return new ColorClass(this.dark).color(renderer);
    }
    return new ColorClass(this.light).color(renderer);
  }

  RGBA(): [number, number, number, number] {
    return new ColorClass(this.dark).RGBA();
  }
}

/**
 * CompleteColor specifies exact values for different color profiles
 * Matches Go's CompleteColor struct exactly
 */
export class CompleteColor implements TerminalColor {
  constructor(
    public readonly trueColor: string,
    public readonly ansi256: string,
    public readonly ansi: string
  ) {}

  color(renderer: Renderer): TermenvColor {
    const profile = renderer.colorProfile();

    switch (profile) {
      case TermenvProfile.TrueColor:
        return termenvColor(this.trueColor) || termenvNoColor();
      case TermenvProfile.ANSI256:
        return termenvColor(this.ansi256) || termenvNoColor();
      case TermenvProfile.ANSI:
        return termenvColor(this.ansi) || termenvNoColor();
      default:
        return termenvNoColor();
    }
  }

  RGBA(): [number, number, number, number] {
    return new ColorClass(this.trueColor).RGBA();
  }
}

/**
 * CompleteAdaptiveColor combines CompleteColor with AdaptiveColor
 * Matches Go's CompleteAdaptiveColor struct exactly
 */
export class CompleteAdaptiveColor implements TerminalColor {
  constructor(
    public readonly light: CompleteColor,
    public readonly dark: CompleteColor
  ) {}

  color(renderer: Renderer): TermenvColor {
    if (renderer.hasDarkBackground()) {
      return this.dark.color(renderer);
    }
    return this.light.color(renderer);
  }

  RGBA(): [number, number, number, number] {
    return this.dark.RGBA();
  }
}

// Global instances and convenience functions - matching Go API exactly
export const noColor = new NoColor();

// Export factory functions that match Go's constructors exactly
export function NewColor(value: string): ColorClass {
  return new ColorClass(value);
}

export function NewANSIColor(value: number): ANSIColorClass {
  return new ANSIColorClass(value);
}

export function NewAdaptiveColor(light: string, dark: string): AdaptiveColor {
  return new AdaptiveColor(light, dark);
}

export function NewCompleteColor(
  trueColor: string,
  ansi256: string,
  ansi: string
): CompleteColor {
  return new CompleteColor(trueColor, ansi256, ansi);
}

export function NewCompleteAdaptiveColor(
  light: CompleteColor,
  dark: CompleteColor
): CompleteAdaptiveColor {
  return new CompleteAdaptiveColor(light, dark);
}

// Go-compatible factory functions
export function Color(value: string): ColorClass | string {
  // Handle empty string case - return empty string directly
  if (value === '') {
    return '';
  }
  return new ColorClass(value);
}

export function ANSIColor(value: number): ANSIColorClass {
  return new ANSIColorClass(value);
}

// Note: Renderer will be imported by consumer code to avoid circular dependencies
