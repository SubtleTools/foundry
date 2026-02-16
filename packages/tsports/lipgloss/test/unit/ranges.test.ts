/**
 * Range styling tests
 * 
 * Unit tests for Range functionality, converted from Go's ranges_test.go
 */

import { describe, expect, test, beforeEach } from 'bun:test';
import { Profile as ColorProfile, Output } from '@tsports/termenv';
import { Renderer, newRenderer } from '../../src/renderer';
import { StyleRanges, Range, NewRange } from '../../src/ranges';
import { Color } from '../../src/color';

describe('StyleRanges', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.ANSI);
  });

  const getTestCases = () => [
    {
      name: 'empty ranges',
      input: 'hello world',
      ranges: [],
      expected: 'hello world',
    },
    {
      name: 'single range in middle',
      input: 'hello world',
      ranges: [
        NewRange(6, 11, renderer.newStyle().bold(true)),
      ],
      expected: 'hello \x1b[1mworld\x1b[0m',
    },
    {
      name: 'multiple ranges',
      input: 'hello world',
      ranges: [
        NewRange(0, 5, renderer.newStyle().bold(true)),
        NewRange(6, 11, renderer.newStyle().italic(true)),
      ],
      expected: '\x1b[1mhello\x1b[0m \x1b[3mworld\x1b[0m',
    },
    {
      name: 'overlapping with existing ANSI',
      input: 'hello \x1b[32mworld\x1b[0m',
      ranges: [
        NewRange(0, 5, renderer.newStyle().bold(true)),
      ],
      expected: '\x1b[1mhello\x1b[0m \x1b[32mworld\x1b[0m',
    },
    {
      name: 'style at start',
      input: 'hello world',
      ranges: [
        NewRange(0, 5, renderer.newStyle().bold(true)),
      ],
      expected: '\x1b[1mhello\x1b[0m world',
    },
    {
      name: 'style at end',
      input: 'hello world',
      ranges: [
        NewRange(6, 11, renderer.newStyle().bold(true)),
      ],
      expected: 'hello \x1b[1mworld\x1b[0m',
    },
    {
      name: 'multiple styles with gap',
      input: 'hello beautiful world',
      ranges: [
        NewRange(0, 5, renderer.newStyle().bold(true)),
        NewRange(16, 23, renderer.newStyle().italic(true)),
      ],
      expected: '\x1b[1mhello\x1b[0m beautiful \x1b[3mworld\x1b[0m',
    },
    {
      name: 'adjacent ranges',
      input: 'hello world',
      ranges: [
        NewRange(0, 5, renderer.newStyle().bold(true)),
        NewRange(6, 11, renderer.newStyle().italic(true)),
      ],
      expected: '\x1b[1mhello\x1b[0m \x1b[3mworld\x1b[0m',
    },
    {
      name: 'wide-width characters',
      input: 'Hello 你好 世界',
      ranges: [
        NewRange(0, 5, renderer.newStyle().bold(true)),    // "Hello"
        NewRange(6, 8, renderer.newStyle().italic(true)),  // "你好"
        NewRange(9, 11, renderer.newStyle().bold(true)),   // "世界"
      ],
      expected: '\x1b[1mHello\x1b[0m \x1b[3m你好\x1b[0m \x1b[1m世界\x1b[0m',
    },
    {
      name: 'ansi and emoji',
      input: '\x1b[90m\ue615\x1b[39m \x1b[3mDownloads',
      ranges: [
        NewRange(2, 5, renderer.newStyle().foreground(Color('2'))),
      ],
      expected: '\x1b[90m\ue615\x1b[39m \x1b[3m\x1b[32mDow\x1b[0m\x1b[90m\x1b[39m\x1b[3mnloads',
    },
  ];

  test('StyleRanges functionality', () => {
    const testCases = getTestCases();
    
    for (const { name, input, ranges, expected } of testCases) {
      // Ensure renderer is using ANSI profile
      renderer.setColorProfile(ColorProfile.ANSI);
      
      const result = StyleRanges(input, ...ranges);
      expect(result).toBe(expected);
    }
  });

  test('should handle empty input', () => {
    const result = StyleRanges('');
    expect(result).toBe('');
  });

  test('should handle ranges that exceed input length', () => {
    const input = 'short';
    const ranges = [
      NewRange(0, 100, renderer.newStyle().bold(true)), // Range longer than input
    ];
    
    const result = StyleRanges(input, ...ranges);
    expect(result).toContain('short');
    expect(result).toContain('\x1b[1m'); // Should still apply styling
  });

  test('should handle zero-length ranges', () => {
    const input = 'hello world';
    const ranges = [
      NewRange(5, 5, renderer.newStyle().bold(true)), // Zero-length range
    ];
    
    const result = StyleRanges(input, ...ranges);
    expect(result).toBe('hello world'); // Should not crash or modify
  });

  test('should handle negative ranges gracefully', () => {
    const input = 'hello world';
    const ranges = [
      NewRange(-1, 5, renderer.newStyle().bold(true)), // Negative start
    ];
    
    const result = StyleRanges(input, ...ranges);
    expect(result).toBeTruthy(); // Should not crash
  });

  test('should handle ranges with different color profiles', () => {
    const input = 'hello';
    const range = NewRange(0, 5, renderer.newStyle().foreground(Color('#FF0000')));
    
    // Test with TrueColor profile
    renderer.setColorProfile(ColorProfile.TrueColor);
    const trueColorResult = StyleRanges(input, range);
    expect(trueColorResult).toContain('\x1b[38;2;'); // RGB format
    
    // Test with ANSI256 profile
    renderer.setColorProfile(ColorProfile.ANSI256);
    const ansi256Result = StyleRanges(input, range);
    expect(ansi256Result).toContain('\x1b[38;5;'); // 256-color format
    
    // Test with ASCII profile (should strip colors)
    renderer.setColorProfile(ColorProfile.Ascii);
    const asciiResult = StyleRanges(input, range);
    expect(asciiResult).toBe('hello'); // No ANSI codes
  });
});

describe('Range Creation', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should create Range with NewRange', () => {
    const style = renderer.newStyle().bold(true);
    const range = NewRange(0, 10, style);
    
    expect(range).toHaveProperty('start');
    expect(range).toHaveProperty('end');
    expect(range).toHaveProperty('style');
    expect(range.start).toBe(0);
    expect(range.end).toBe(10);
    expect(range.style).toBe(style);
  });

  test('should handle Range with complex styles', () => {
    const style = renderer.newStyle()
      .bold(true)
      .italic(true)
      .underline(true)
      .foreground(Color('#FF0000'))
      .background(Color('#0000FF'));
    
    const range = NewRange(5, 15, style);
    expect(range.style).toBe(style);
  });
});

describe('Range Edge Cases', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.ANSI);
  });

  test('should reject overlapping ranges', () => {
    const input = 'hello world';
    const ranges = [
      NewRange(0, 8, renderer.newStyle().bold(true)),      // "hello wo"
      NewRange(4, 11, renderer.newStyle().italic(true)),   // "o world" (overlaps)
    ];
    
    // Overlapping ranges should throw an error, matching Go behavior
    expect(() => StyleRanges(input, ...ranges)).toThrow('Ranges overlap');
  });

  test('should handle many ranges', () => {
    const input = 'abcdefghijklmnop';
    const ranges = [];
    
    // Create a range for each character
    for (let i = 0; i < input.length; i++) {
      ranges.push(NewRange(i, i + 1, renderer.newStyle().bold(true)));
    }
    
    const result = StyleRanges(input, ...ranges);
    expect(result).toBeTruthy(); // Should not crash with many ranges
    expect(result).toContain('\x1b[1m'); // Should contain bold formatting
  });

  test('should handle ranges with unicode characters', () => {
    const input = '🌟⭐✨💫🌙';
    const ranges = [
      NewRange(0, 2, renderer.newStyle().bold(true)), // First emoji
    ];
    
    const result = StyleRanges(input, ...ranges);
    expect(result).toBeTruthy(); // Should handle unicode
    expect(result).toContain('🌟'); // Should preserve unicode
  });

  test('should preserve existing ANSI sequences', () => {
    const input = 'hello \x1b[32mgreen\x1b[0m world';
    const ranges = [
      NewRange(0, 5, renderer.newStyle().bold(true)), // Style "hello"
    ];
    
    const result = StyleRanges(input, ...ranges);
    expect(result).toContain('\x1b[1m'); // New bold formatting
    expect(result).toContain('\x1b[32m'); // Existing green color should be preserved
    expect(result).toContain('green');
  });
});