/**
 * Color utilities tests
 * 
 * Unit tests for color handling functions, converted from Go's color_test.go
 */

import { describe, expect, test } from 'bun:test';
import { Profile as ColorProfile, Output } from '@tsports/termenv';
import { Style } from '../../src/style';
import { Renderer, newRenderer } from '../../src/renderer';
import { Color, ColorUtils } from '../../src/index';

// Helper function to format escape sequences for debugging (like Go's formatEscapes)
function formatEscapes(str: string): string {
  return str
    .replace(/\x1b/g, '\\x1b')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

describe('Color Profile Tests', () => {
  test('should render colors correctly based on color profile', async () => {
    const renderer = newRenderer(new Output(process.stdout));
    const input = 'hello';

    const testCases = [
      {
        name: 'ascii',
        profile: ColorProfile.Ascii,
        expected: 'hello',
      },
      {
        name: 'ansi',
        profile: ColorProfile.ANSI,
        expected: '\x1b[94mhello\x1b[0m',
      },
      {
        name: 'ansi256', 
        profile: ColorProfile.ANSI256,
        expected: '\x1b[38;5;62mhello\x1b[0m',
      },
      {
        name: 'truecolor',
        profile: ColorProfile.TrueColor,
        expected: '\x1b[38;2;89;86;224mhello\x1b[0m',
      },
    ];

    for (const tc of testCases) {
      renderer.setColorProfile(tc.profile);
      const style = renderer.newStyle().foreground(Color('#5A56E0'));
      const result = style.render(input);

      expect(result).toBe(tc.expected);
    }
  });
});

describe('ColorUtils.hexToRGB', () => {
  test('should convert hex colors to RGB values', () => {
    const testCases = [
      {
        input: '#FF0000',
        expected: 0xFF0000,
      },
      {
        input: '#00F',
        expected: 0x0000FF,
      },
      {
        input: '#6B50FF',
        expected: 0x6B50FF,
      },
      {
        input: 'invalid color',
        expected: 0x0,
      },
      {
        input: '#000000',
        expected: 0x000000,
      },
      {
        input: '#FFFFFF',
        expected: 0xFFFFFF,
      },
    ];

    testCases.forEach(({ input, expected }, index) => {
      const rgb = ColorUtils.hexToRGB(input);
      if (rgb) {
        const combined = (rgb.r << 16) + (rgb.g << 8) + rgb.b;
        expect(combined).toBe(expected);
      } else {
        // Invalid color should return 0
        expect(expected).toBe(0x0);
      }
    });
  });

  test('should handle short hex format', () => {
    const rgb = ColorUtils.hexToRGB('#F0A');
    expect(rgb).toEqual({ r: 255, g: 0, b: 170 });
  });

  test('should handle invalid input gracefully', () => {
    const invalidInputs = ['', '#', '#GG0000', 'red', '#12345', '#1234567'];
    
    invalidInputs.forEach((input) => {
      const rgb = ColorUtils.hexToRGB(input);
      expect(rgb).toBeNull();
    });
  });
});

describe('Color object', () => {
  test('should create valid color from hex string', () => {
    const red = Color('#FF0000');
    expect(red).toBeTruthy();
  });

  test('should create valid color from color name', () => {
    const red = Color('red');
    expect(red).toBeTruthy();
  });

  test('should create valid color from ANSI code', () => {
    const color = Color('1'); // ANSI red
    expect(color).toBeTruthy();
  });

  test('should handle empty color', () => {
    const noColor = Color('');
    expect(noColor).toBe('');
  });
});

describe('Color rendering with different profiles', () => {
  let renderer: Renderer;

  test('should adapt color output to terminal capabilities', () => {
    renderer = newRenderer(new Output(process.stdout));
    
    // Test that colors render differently based on profile
    const style = renderer.newStyle().foreground(Color('#FF5733'));
    
    // ASCII profile - should strip colors
    renderer.setColorProfile(ColorProfile.Ascii);
    const asciiResult = style.render('test');
    expect(asciiResult).toBe('test');
    
    // TrueColor profile - should use RGB
    renderer.setColorProfile(ColorProfile.TrueColor);
    const trueColorResult = style.render('test');
    expect(trueColorResult).toContain('38;2;'); // RGB ANSI sequence
  });
});