/**
 * Border utilities tests
 * 
 * Unit tests for border functionality, converted from Go's borders_test.go
 */

import { describe, expect, test, beforeEach } from 'bun:test';
import { Profile as ColorProfile, Output } from '@tsports/termenv';
import { Style } from '../../src/style';
import { Renderer, newRenderer } from '../../src/renderer';
import { BorderStyles, NormalBorder, RoundedBorder, ThickBorder, DoubleBorder } from '../../src/borders';

describe('Border Size Calculations', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should calculate border sizes correctly', () => {
    const testCases = [
      {
        name: 'Default style',
        style: renderer.newStyle(),
        wantX: 0,
        wantY: 0,
      },
      {
        name: 'Border(NormalBorder())',
        style: renderer.newStyle().border(NormalBorder()),
        wantX: 2,
        wantY: 2,
      },
      {
        name: 'Border(NormalBorder(), true)',
        style: renderer.newStyle().border(NormalBorder(), true),
        wantX: 2,
        wantY: 2,
      },
      {
        name: 'Border(NormalBorder(), true, true, false, false)',
        style: renderer.newStyle().border(NormalBorder(), true, true, false, false),
        wantX: 2,
        wantY: 1, // Only top border
      },
      {
        name: 'Border(NormalBorder(), false, false, true, true)',
        style: renderer.newStyle().border(NormalBorder(), false, false, true, true),
        wantX: 2,
        wantY: 1, // Only bottom border
      },
      {
        name: 'Border(NormalBorder(), true, false, true, false)',
        style: renderer.newStyle().border(NormalBorder(), true, false, true, false),
        wantX: 1, // Only left border
        wantY: 2,
      },
      {
        name: 'Border(NormalBorder(), false, true, false, true)',
        style: renderer.newStyle().border(NormalBorder(), false, true, false, true),
        wantX: 1, // Only right border
        wantY: 2,
      },
    ];

    testCases.forEach(({ name, style, wantX, wantY }) => {
      const [gotX, gotY] = style.getBorderSizes();
      expect(gotX).toBe(wantX);
      expect(gotY).toBe(wantY);
    });
  });
});

describe('Border Styles', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should render different border styles correctly', () => {
    const content = 'test';
    
    // Normal border
    const normalStyle = renderer.newStyle().border(NormalBorder()).width(10);
    const normalResult = normalStyle.render(content);
    expect(normalResult).toContain('┌'); // Top-left corner
    expect(normalResult).toContain('┐'); // Top-right corner
    expect(normalResult).toContain('└'); // Bottom-left corner
    expect(normalResult).toContain('┘'); // Bottom-right corner
    expect(normalResult).toContain('│'); // Vertical line
    expect(normalResult).toContain('─'); // Horizontal line

    // Rounded border
    const roundedStyle = renderer.newStyle().border(RoundedBorder()).width(10);
    const roundedResult = roundedStyle.render(content);
    expect(roundedResult).toContain('╭'); // Top-left corner (rounded)
    expect(roundedResult).toContain('╮'); // Top-right corner (rounded)
    expect(roundedResult).toContain('╰'); // Bottom-left corner (rounded)
    expect(roundedResult).toContain('╯'); // Bottom-right corner (rounded)

    // Thick border
    const thickStyle = renderer.newStyle().border(ThickBorder()).width(10);
    const thickResult = thickStyle.render(content);
    expect(thickResult).toContain('┏'); // Thick corners and lines
    expect(thickResult).toContain('┓');
    expect(thickResult).toContain('┗');
    expect(thickResult).toContain('┛');

    // Double border
    const doubleStyle = renderer.newStyle().border(DoubleBorder()).width(10);
    const doubleResult = doubleStyle.render(content);
    expect(doubleResult).toContain('╔'); // Double border characters
    expect(doubleResult).toContain('╗');
    expect(doubleResult).toContain('╚');
    expect(doubleResult).toContain('╝');
  });

  test('should handle partial borders correctly', () => {
    const content = 'test';
    
    // Only top and bottom borders
    const hBorderStyle = renderer.newStyle()
      .border(NormalBorder(), true, false, true, false) // top, right, bottom, left
      .width(10);
    const hResult = hBorderStyle.render(content);
    expect(hResult).toContain('─'); // Horizontal lines
    expect(hResult).not.toContain('│'); // No vertical lines

    // Only left and right borders  
    const vBorderStyle = renderer.newStyle()
      .border(NormalBorder(), false, true, false, true) // top, right, bottom, left
      .width(10);
    const vResult = vBorderStyle.render(content);
    expect(vResult).toContain('│'); // Vertical lines
    expect(vResult).not.toContain('─'); // No horizontal lines
  });

  test('should handle border colors', () => {
    const content = 'test';
    const coloredBorderStyle = renderer.newStyle()
      .border(NormalBorder())
      .borderForeground('#FF0000') // Red border
      .width(10);
    
    const result = coloredBorderStyle.render(content);
    
    // Use golden file approach for more reliable testing
    const { requireEqualToGo } = require('../utils/golden');
    requireEqualToGo(__filename, result, 'border-colors');
  });
});

describe('Border Edge Cases', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should handle empty content with borders', () => {
    const style = renderer.newStyle().border(NormalBorder());
    const result = style.render('');
    expect(result).toContain('┌'); // Should still render border
    expect(result).toContain('┘');
  });

  test('should handle very small dimensions', () => {
    const style = renderer.newStyle()
      .border(NormalBorder())
      .width(1)
      .height(1);
    const result = style.render('X');
    expect(result).toBeTruthy(); // Should not crash
  });

  test('should handle multiline content with borders', () => {
    const content = 'line1\nline2\nline3';
    const style = renderer.newStyle().border(NormalBorder());
    const result = style.render(content);
    
    expect(result).toContain('line1');
    expect(result).toContain('line2'); 
    expect(result).toContain('line3');
    expect(result).toContain('┌');
    expect(result).toContain('┘');
    
    // Should have proper border structure for multi-line content
    const lines = result.split('\n');
    expect(lines.length).toBeGreaterThan(3); // Content + border lines
  });
});

describe('Border Constants and Utilities', () => {
  test('should provide correct border style objects', () => {
    expect(NormalBorder()).toHaveProperty('topLeft');
    expect(NormalBorder()).toHaveProperty('top');
    expect(NormalBorder()).toHaveProperty('topRight');
    expect(NormalBorder()).toHaveProperty('right');
    expect(NormalBorder()).toHaveProperty('bottomRight');
    expect(NormalBorder()).toHaveProperty('bottom');
    expect(NormalBorder()).toHaveProperty('bottomLeft');
    expect(NormalBorder()).toHaveProperty('left');

    expect(RoundedBorder().topLeft).toBe('╭');
    expect(ThickBorder().topLeft).toBe('┏');
    expect(DoubleBorder().topLeft).toBe('╔');
  });

  test('should handle BorderStyles constant access', () => {
    expect(BorderStyles).toBeDefined();
    expect(BorderStyles.Normal).toBeDefined();
    expect(BorderStyles.Rounded).toBeDefined();
    expect(BorderStyles.Thick).toBeDefined();
    expect(BorderStyles.Double).toBeDefined();
  });
});