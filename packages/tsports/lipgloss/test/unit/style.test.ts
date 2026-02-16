/**
 * Style rendering tests
 * 
 * Unit tests for Style class and rendering, converted from Go's style_test.go
 */

import { describe, expect, test, beforeEach } from 'bun:test';
import { Output } from '@tsports/termenv';
import { Style } from '../../src/style';
import { Renderer, newRenderer } from '../../src/renderer';
import { Color } from '../../src/color';
import { ColorProfile } from '../../src/types';

// Helper function to format escape sequences for debugging
function formatEscapes(str: string): string {
  return str
    .replace(/\x1b/g, '\\x1b')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

describe('Style Underline Tests', () => {
  let renderer: Renderer;

  beforeEach(() => {
    const output = new Output(process.stdout);
    renderer = newRenderer(output);
    renderer.setColorProfile(ColorProfile.TrueColor);
    renderer.setHasDarkBackground(true);
  });

  test('should render underline correctly', () => {
    // Go applies underline twice: once before colors and once after
    // This results in [4;4m which is intentional Go behavior
    const testCases = [
      {
        style: renderer.newStyle().underline(true),
        expected: '\x1b[4;4ma\x1b[0m\x1b[4;4mb\x1b[0m\x1b[4m \x1b[0m\x1b[4;4mc\x1b[0m',
        description: 'basic underline',
      },
      {
        style: renderer.newStyle().underline(true).underlineSpaces(true),
        expected: '\x1b[4;4ma\x1b[0m\x1b[4;4mb\x1b[0m\x1b[4m \x1b[0m\x1b[4;4mc\x1b[0m',
        description: 'underline with spaces explicitly enabled',
      },
      {
        style: renderer.newStyle().underline(true).underlineSpaces(false),
        expected: '\x1b[4;4ma\x1b[0m\x1b[4;4mb\x1b[0m \x1b[4;4mc\x1b[0m',
        description: 'underline with spaces disabled',
      },
      {
        style: renderer.newStyle().underlineSpaces(true),
        expected: 'ab\x1b[4m \x1b[0mc',
        description: 'only underline spaces',
      },
    ];

    testCases.forEach(({ style, expected, description }) => {
      const result = style.render('ab c');
      expect(result).toBe(expected);
    });
  });
});

describe('Style Strikethrough Tests', () => {
  let renderer: Renderer;

  beforeEach(() => {
    const output = new Output(process.stdout);
    renderer = newRenderer(output);
    renderer.setColorProfile(ColorProfile.TrueColor);
    renderer.setHasDarkBackground(true);
  });

  test('should render strikethrough correctly', () => {
    const testCases = [
      {
        style: renderer.newStyle().strikethrough(true),
        expected: '\x1b[9ma\x1b[0m\x1b[9mb\x1b[0m\x1b[9m \x1b[0m\x1b[9mc\x1b[0m',
        description: 'basic strikethrough',
      },
      {
        style: renderer.newStyle().strikethrough(true).strikethroughSpaces(false),
        expected: '\x1b[9ma\x1b[0m\x1b[9mb\x1b[0m \x1b[9mc\x1b[0m',
        description: 'strikethrough without spaces',
      },
    ];

    testCases.forEach(({ style, expected, description }) => {
      const result = style.render('ab c');
      expect(result).toBe(expected);
    });
  });
});

describe('Style Basic Rendering', () => {
  let renderer: Renderer;

  beforeEach(() => {
    const output = new Output(process.stdout);
    renderer = newRenderer(output);
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should render basic text without styling', () => {
    const style = renderer.newStyle();
    const result = style.render('hello');
    expect(result).toBe('hello');
  });

  test('should render text with foreground color', () => {
    const style = renderer.newStyle().foreground(Color('#FF0000'));
    const result = style.render('hello');
    expect(result).toContain('\x1b[38;2;255;0;0m'); // RGB red
    expect(result).toContain('hello');
    expect(result).toContain('\x1b[0m'); // Reset
  });

  test('should render text with background color', () => {
    const style = renderer.newStyle().background(Color('#00FF00'));
    const result = style.render('hello');
    expect(result).toContain('\x1b[48;2;0;255;0m'); // RGB green background
    expect(result).toContain('hello');
    expect(result).toContain('\x1b[0m'); // Reset
  });

  test('should render bold text', () => {
    const style = renderer.newStyle().bold(true);
    const result = style.render('hello');
    expect(result).toContain('\x1b[1m'); // Bold
    expect(result).toContain('hello');
    expect(result).toContain('\x1b[0m'); // Reset
  });

  test('should render italic text', () => {
    const style = renderer.newStyle().italic(true);
    const result = style.render('hello');
    expect(result).toContain('\x1b[3m'); // Italic
    expect(result).toContain('hello');
    expect(result).toContain('\x1b[0m'); // Reset
  });
});

describe('Style Copying and Inheritance', () => {
  let renderer: Renderer;

  beforeEach(() => {
    const output = new Output(process.stdout);
    renderer = newRenderer(output);
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should copy style properties correctly', () => {
    const original = renderer.newStyle()
      .foreground(Color('#FF0000'))
      .bold(true)
      .padding(2);

    const copy = original.copy();
    
    expect(copy).not.toBe(original); // Different instances
    expect(copy.render('test')).toBe(original.render('test')); // Same output
  });

  test('should inherit from parent style', () => {
    const parent = renderer.newStyle()
      .foreground(Color('#FF0000'))
      .bold(true);
    
    const child = renderer.newStyle()
      .inherit(parent)
      .italic(true);
    
    const result = child.render('test');
    // Check for the presence of styling codes (may be combined in one sequence)
    expect(result).toMatch(/\x1b\[.*38;2;255;0;0.*m/); // Red foreground from parent
    expect(result).toMatch(/\x1b\[.*1.*m/); // Bold from parent  
    expect(result).toMatch(/\x1b\[.*3.*m/); // Italic from child
  });
});

describe('Style Dimensions and Padding', () => {
  let renderer: Renderer;

  beforeEach(() => {
    const output = new Output(process.stdout);
    renderer = newRenderer(output);
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should handle width correctly', () => {
    const style = renderer.newStyle().width(10);
    const result = style.render('test');
    
    // Should pad to width 10
    expect(result.replace(/\x1b\[[0-9;]*m/g, '')).toHaveLength(10);
  });

  test('should handle height correctly', () => {
    const style = renderer.newStyle().height(3);
    const result = style.render('test');
    const lines = result.split('\n');
    
    expect(lines).toHaveLength(3);
  });

  test('should handle padding', () => {
    const style = renderer.newStyle()
      .padding(1)
      .border('normal');
    
    const result = style.render('test');
    expect(result).toContain('test');
    // Should have padding around the content
    expect(result.split('\n').length).toBeGreaterThan(1);
  });
});

describe('Style Edge Cases', () => {
  let renderer: Renderer;

  beforeEach(() => {
    const output = new Output(process.stdout);
    renderer = newRenderer(output);
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should handle empty string', () => {
    const style = renderer.newStyle().foreground(Color('#FF0000'));
    const result = style.render('');
    expect(result).toBe('');
  });

  test('should handle newlines in content', () => {
    const style = renderer.newStyle().foreground(Color('#FF0000'));
    const result = style.render('line1\nline2');
    expect(result).toContain('line1');
    expect(result).toContain('line2');
    expect(result).toContain('\n');
  });

  test('should handle tab characters', () => {
    const style = renderer.newStyle();
    const result = style.render('before\tafter');
    // Tabs should be converted to spaces
    expect(result).toBe('before    after'); // 4 spaces default
  });

  test('should handle carriage returns', () => {
    const style = renderer.newStyle();
    const result = style.render('test\r\nline');
    expect(result).toBe('test\nline'); // CR should be stripped
  });
});

describe('Style Unset Operations', () => {
  let renderer: Renderer;

  beforeEach(() => {
    const output = new Output(process.stdout);
    renderer = newRenderer(output);
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should unset style properties', () => {
    const style = renderer.newStyle()
      .foreground(Color('#FF0000'))
      .bold(true)
      .unsetForeground()
      .unsetBold();
    
    const result = style.render('test');
    expect(result).toBe('test'); // No styling should remain
  });
});

describe('Style with Different Color Profiles', () => {
  test('should adapt to different color profiles', () => {
    const renderer = newRenderer(new Output(process.stdout));
    const style = renderer.newStyle().foreground(Color('#FF0000'));
    
    // ASCII profile - no colors
    renderer.setColorProfile(ColorProfile.Ascii);
    const asciiResult = style.render('test');
    expect(asciiResult).toBe('test');
    
    // ANSI profile - basic colors
    renderer.setColorProfile(ColorProfile.ANSI);
    const ansiResult = style.render('test');
    expect(ansiResult).toContain('\x1b['); // Some ANSI sequence
    
    // TrueColor profile - RGB colors
    renderer.setColorProfile(ColorProfile.TrueColor);
    const trueColorResult = style.render('test');
    expect(trueColorResult).toContain('\x1b[38;2;255;0;0m'); // RGB red
  });
});