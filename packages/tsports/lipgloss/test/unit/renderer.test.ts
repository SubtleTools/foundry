/**
 * Renderer tests
 * 
 * Unit tests for Renderer functionality, converted from Go's renderer_test.go
 */

import { describe, expect, test, beforeEach } from 'bun:test';
import { Profile as ColorProfile, Output } from '@tsports/termenv';
import { Renderer, newRenderer } from '../../src/renderer';
import { Color } from '../../src/color';

describe('Renderer Creation and Configuration', () => {
  test('should create new renderer', () => {
    const renderer = newRenderer(new Output(process.stdout));
    expect(renderer).toBeDefined();
  });

  test('should set and get color profile', () => {
    const renderer = newRenderer(new Output(process.stdout));
    
    renderer.setColorProfile(ColorProfile.TrueColor);
    expect(renderer.colorProfile()).toBe(ColorProfile.TrueColor);
    
    renderer.setColorProfile(ColorProfile.ANSI256);
    expect(renderer.colorProfile()).toBe(ColorProfile.ANSI256);
    
    renderer.setColorProfile(ColorProfile.ANSI);
    expect(renderer.colorProfile()).toBe(ColorProfile.ANSI);
    
    renderer.setColorProfile(ColorProfile.Ascii);
    expect(renderer.colorProfile()).toBe(ColorProfile.Ascii);
  });

  test('should set and get dark background flag', () => {
    const renderer = newRenderer(new Output(process.stdout));

    // hasDarkBackground() queries the terminal by default (lazy init)
    // We can't assert a specific default since it depends on the terminal
    // But we CAN test that setHasDarkBackground overrides the detected value

    renderer.setHasDarkBackground(true);
    expect(renderer.hasDarkBackground()).toBe(true);

    renderer.setHasDarkBackground(false);
    expect(renderer.hasDarkBackground()).toBe(false);
  });
});

describe('Renderer Style Creation', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should create new style', () => {
    const style = renderer.newStyle();
    expect(style).toBeDefined();
    expect(style.renderer()).toBe(renderer);
  });

  test('should create styles with correct renderer reference', () => {
    const style1 = renderer.newStyle();
    const style2 = renderer.newStyle();
    
    expect(style1.renderer()).toBe(renderer);
    expect(style2.renderer()).toBe(renderer);
    expect(style1).not.toBe(style2); // Different instances
  });

  test('should inherit renderer settings', () => {
    renderer.setColorProfile(ColorProfile.ANSI256);
    renderer.setHasDarkBackground(true);
    
    const style = renderer.newStyle().foreground(Color('#FF0000'));
    const result = style.render('test');
    
    // Should use ANSI256 profile, not TrueColor
    expect(result).toContain('\x1b[38;5;'); // ANSI256 format
    expect(result).not.toContain('\x1b[38;2;'); // Not RGB format
  });
});

describe('Renderer Output Handling', () => {
  test('should handle different output streams', () => {
    const mockStream = {
      write: () => {},
      fd: 1
    };
    
    const renderer = newRenderer(mockStream as any);
    expect(renderer).toBeDefined();
    
    // Should work with the mock stream
    const style = renderer.newStyle();
    expect(style).toBeDefined();
  });
});

describe('Renderer Color Profile Impact', () => {
  test('should render differently based on color profile', () => {
    const renderer = newRenderer(new Output(process.stdout));
    const redColor = Color('#FF0000');
    
    // Test each profile
    const profiles = [
      { profile: ColorProfile.Ascii, expectsColor: false },
      { profile: ColorProfile.ANSI, expectsColor: true },
      { profile: ColorProfile.ANSI256, expectsColor: true },
      { profile: ColorProfile.TrueColor, expectsColor: true },
    ];
    
    profiles.forEach(({ profile, expectsColor }) => {
      renderer.setColorProfile(profile);
      const style = renderer.newStyle().foreground(redColor);
      const result = style.render('test');
      
      if (expectsColor) {
        expect(result).toContain('\x1b['); // Some ANSI sequence
      } else {
        expect(result).toBe('test'); // No ANSI sequences for Ascii
      }
    });
  });

  test('should handle profile-specific color rendering', () => {
    const renderer = newRenderer(new Output(process.stdout));
    const color = Color('#8A2BE2'); // Blue violet
    
    // TrueColor - should use RGB
    renderer.setColorProfile(ColorProfile.TrueColor);
    const trueColorStyle = renderer.newStyle().foreground(color);
    const trueColorResult = trueColorStyle.render('test');
    expect(trueColorResult).toContain('\x1b[38;2;'); // RGB format
    
    // ANSI256 - should use color index
    renderer.setColorProfile(ColorProfile.ANSI256);
    const ansi256Style = renderer.newStyle().foreground(color);
    const ansi256Result = ansi256Style.render('test');
    expect(ansi256Result).toContain('\x1b[38;5;'); // 256-color format
    
    // ANSI - should use basic color
    renderer.setColorProfile(ColorProfile.ANSI);
    const ansiStyle = renderer.newStyle().foreground(color);
    const ansiResult = ansiStyle.render('test');
    expect(ansiResult).toContain('\x1b['); // Some basic ANSI
    
    // ASCII - should strip colors
    renderer.setColorProfile(ColorProfile.Ascii);
    const asciiStyle = renderer.newStyle().foreground(color);
    const asciiResult = asciiStyle.render('test');
    expect(asciiResult).toBe('test'); // No color codes
  });
});

describe('Renderer Dark Background Impact', () => {
  test('should adapt colors for dark background', () => {
    const renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.TrueColor);
    
    const lightColor = Color('#FFFFFF');
    
    // Light background (default)
    renderer.setHasDarkBackground(false);
    const lightBgStyle = renderer.newStyle().foreground(lightColor);
    const lightBgResult = lightBgStyle.render('test');
    
    // Dark background
    renderer.setHasDarkBackground(true);
    const darkBgStyle = renderer.newStyle().foreground(lightColor);
    const darkBgResult = darkBgStyle.render('test');
    
    // Both should work, though they might render differently
    expect(lightBgResult).toBeTruthy();
    expect(darkBgResult).toBeTruthy();
  });
});

describe('Renderer Edge Cases', () => {
  test('should handle null/undefined output gracefully', () => {
    expect(() => {
      const renderer = newRenderer(null as any);
      const style = renderer.newStyle();
      style.render('test');
    }).not.toThrow();
  });

  test('should handle rapid profile changes', () => {
    const renderer = newRenderer(new Output(process.stdout));
    const style = renderer.newStyle().foreground(Color('#FF0000'));
    
    // Rapidly change profiles
    const profiles = [
      ColorProfile.TrueColor,
      ColorProfile.ANSI256,
      ColorProfile.ANSI,
      ColorProfile.Ascii,
      ColorProfile.TrueColor,
    ];
    
    profiles.forEach((profile) => {
      renderer.setColorProfile(profile);
      const result = style.render('test');
      expect(result).toBeTruthy();
    });
  });

  test('should maintain renderer consistency across styles', () => {
    const renderer1 = newRenderer(new Output(process.stdout));
    const renderer2 = newRenderer(new Output(process.stdout));
    
    renderer1.setColorProfile(ColorProfile.TrueColor);
    renderer2.setColorProfile(ColorProfile.Ascii);
    
    const style1 = renderer1.newStyle().foreground(Color('#FF0000'));
    const style2 = renderer2.newStyle().foreground(Color('#FF0000'));
    
    const result1 = style1.render('test');
    const result2 = style2.render('test');
    
    // Should render differently due to different renderers
    expect(result1).not.toBe(result2);
    expect(result1).toContain('\x1b['); // Should have colors
    expect(result2).toBe('test'); // Should not have colors
  });
});