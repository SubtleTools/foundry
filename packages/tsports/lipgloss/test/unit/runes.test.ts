/**
 * Rune styling tests
 * 
 * Unit tests for StyleRunes functionality, converted from Go's runes_test.go
 */

import { describe, expect, test, beforeEach } from 'bun:test';
import { Profile as ColorProfile, Output } from '@tsports/termenv';
import { Renderer, newRenderer } from '../../src/renderer';
import { StyleRunes } from '../../src/utils';

describe('StyleRunes', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.ANSI);
  });

  const testCases = [
    {
      name: 'hello 0',
      input: 'hello',
      indices: [0],
      expected: '\x1b[7mh\x1b[0mello',
    },
    {
      name: '你好 1',
      input: '你好',
      indices: [1],
      expected: '你\x1b[7m好\x1b[0m',
    },
    {
      name: 'hello 你好 6,7',
      input: 'hello 你好',
      indices: [6, 7],
      expected: 'hello \x1b[7m你好\x1b[0m',
    },
    {
      name: 'hello 1,3',
      input: 'hello',
      indices: [1, 3],
      expected: 'h\x1b[7me\x1b[0ml\x1b[7ml\x1b[0mo',
    },
    {
      name: '你好 0,1',
      input: '你好',
      indices: [0, 1],
      expected: '\x1b[7m你好\x1b[0m',
    },
  ];

  test.each(testCases)('$name', ({ input, indices, expected }) => {
    const matchedStyle = renderer.newStyle().reverse(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes(input, indices, matchedStyle, unmatchedStyle);
    expect(result).toBe(expected);
  });

  test('should handle empty input', () => {
    const matchedStyle = renderer.newStyle().reverse(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('', [], matchedStyle, unmatchedStyle);
    expect(result).toBe('');
  });

  test('should handle empty indices', () => {
    const matchedStyle = renderer.newStyle().reverse(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('hello', [], matchedStyle, unmatchedStyle);
    expect(result).toBe('hello'); // Should render with unmatchedStyle only
  });

  test('should handle out-of-bounds indices', () => {
    const matchedStyle = renderer.newStyle().reverse(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('hello', [100], matchedStyle, unmatchedStyle);
    expect(result).toBe('hello'); // Should gracefully ignore out-of-bounds
  });

  test('should handle negative indices', () => {
    const matchedStyle = renderer.newStyle().reverse(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('hello', [-1], matchedStyle, unmatchedStyle);
    expect(result).toBe('hello'); // Should gracefully ignore negative indices
  });

  test('should handle different styles', () => {
    const input = 'test';
    
    // Test with bold matched style
    const boldMatched = renderer.newStyle().bold(true);
    const normalUnmatched = renderer.newStyle();
    
    const boldResult = StyleRunes(input, [0], boldMatched, normalUnmatched);
    expect(boldResult).toBe('\x1b[1mt\x1b[0mest');
    
    // Test with colored matched style
    const coloredMatched = renderer.newStyle().foreground('#FF0000');
    const coloredResult = StyleRunes(input, [1], coloredMatched, normalUnmatched);
    expect(coloredResult).toContain('t'); // First char unchanged
    expect(coloredResult).toContain('\x1b[91m'); // ANSI red for second char
    expect(coloredResult).toContain('st'); // Remaining chars (after styled 'e')
  });

  test('should handle adjacent indices', () => {
    const matchedStyle = renderer.newStyle().bold(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('hello', [0, 1, 2], matchedStyle, unmatchedStyle);
    expect(result).toBe('\x1b[1mhel\x1b[0mlo');
  });

  test('should handle non-adjacent indices', () => {
    const matchedStyle = renderer.newStyle().bold(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('hello', [0, 2, 4], matchedStyle, unmatchedStyle);
    expect(result).toBe('\x1b[1mh\x1b[0me\x1b[1ml\x1b[0ml\x1b[1mo\x1b[0m');
  });

  test('should handle all indices matched', () => {
    const matchedStyle = renderer.newStyle().bold(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('abc', [0, 1, 2], matchedStyle, unmatchedStyle);
    expect(result).toBe('\x1b[1mabc\x1b[0m');
  });

  test('should handle unicode characters with different styles', () => {
    const matchedStyle = renderer.newStyle().underline(true);
    const unmatchedStyle = renderer.newStyle();

    const result = StyleRunes('🌟⭐', [0], matchedStyle, unmatchedStyle);
    expect(result).toContain('🌟'); // Should preserve unicode
    expect(result).toContain('⭐');
    // Go applies underline twice (before and after colors), so [4;4m
    expect(result).toContain('\x1b[4;4m'); // Underline formatting
  });

  test('should handle mixed ASCII and unicode', () => {
    const matchedStyle = renderer.newStyle().italic(true);
    const unmatchedStyle = renderer.newStyle();
    
    const input = 'a你b好c';
    const result = StyleRunes(input, [1, 3], matchedStyle, unmatchedStyle); // Style unicode chars
    
    expect(result).toContain('a'); // ASCII unchanged
    expect(result).toContain('你'); // Unicode styled
    expect(result).toContain('好'); // Unicode styled  
    expect(result).toContain('b'); // ASCII unchanged
    expect(result).toContain('c'); // ASCII unchanged
    expect(result).toContain('\x1b[3m'); // Italic formatting
  });
});

describe('StyleRunes Edge Cases', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.TrueColor);
  });

  test('should handle duplicate indices', () => {
    const matchedStyle = renderer.newStyle().bold(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('hello', [1, 1, 1], matchedStyle, unmatchedStyle);
    expect(result).toBe('h\x1b[1me\x1b[0mllo'); // Should not duplicate styling
  });

  test('should handle unsorted indices', () => {
    const matchedStyle = renderer.newStyle().bold(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('hello', [3, 1, 2], matchedStyle, unmatchedStyle);
    expect(result).toBe('h\x1b[1mell\x1b[0mo'); // Should handle correctly regardless of order
  });

  test('should work with different color profiles', () => {
    const input = 'test';
    const matchedStyle = renderer.newStyle().foreground('#FF0000');
    const unmatchedStyle = renderer.newStyle();
    
    // TrueColor profile
    renderer.setColorProfile(ColorProfile.TrueColor);
    const trueColorResult = StyleRunes(input, [0], matchedStyle, unmatchedStyle);
    expect(trueColorResult).toContain('\x1b[38;2;'); // RGB format
    
    // ANSI256 profile
    renderer.setColorProfile(ColorProfile.ANSI256);
    const ansi256Result = StyleRunes(input, [0], matchedStyle, unmatchedStyle);
    expect(ansi256Result).toContain('\x1b[38;5;'); // 256-color format
    
    // ASCII profile (should strip colors)
    renderer.setColorProfile(ColorProfile.Ascii);
    const asciiResult = StyleRunes(input, [0], matchedStyle, unmatchedStyle);
    expect(asciiResult).toBe('test'); // No ANSI codes
  });

  test('should handle complex styling combinations', () => {
    const matchedStyle = renderer.newStyle()
      .bold(true)
      .italic(true)
      .underline(true)
      .strikethrough(true);
    const unmatchedStyle = renderer.newStyle();

    const result = StyleRunes('hello', [2], matchedStyle, unmatchedStyle);
    expect(result).toContain('he');
    expect(result).toContain('lo');
    // Go applies underline twice (before and after colors), so [1;3;4;4;9m
    expect(result).toContain('\x1b[1;3;4;4;9m'); // Combined bold+italic+underline(x2)+strikethrough
  });

  test('should handle very long strings', () => {
    const longString = 'a'.repeat(1000);
    const matchedStyle = renderer.newStyle().bold(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes(longString, [0, 999], matchedStyle, unmatchedStyle);
    expect(result).toBeTruthy(); // Should not crash
    expect(result.length).toBeGreaterThan(longString.length); // Should contain ANSI codes
  });
});

describe('StyleRunes Utility Functions', () => {
  test('formatEscapes utility', () => {
    const formatEscapes = (str: string): string => {
      return str.replaceAll('\x1b', '\\x1b');
    };
    
    const input = '\x1b[1mhello\x1b[0m';
    const expected = '\\x1b[1mhello\\x1b[0m';
    
    expect(formatEscapes(input)).toBe(expected);
  });
  
  test('should help debug ANSI sequences', () => {
    const formatEscapes = (str: string): string => {
      return str.replaceAll('\x1b', '\\x1b');
    };
    
    const renderer = newRenderer(new Output(process.stdout));
    renderer.setColorProfile(ColorProfile.ANSI);
    
    const matchedStyle = renderer.newStyle().reverse(true);
    const unmatchedStyle = renderer.newStyle();
    
    const result = StyleRunes('hello', [0], matchedStyle, unmatchedStyle);
    const formatted = formatEscapes(result);
    
    expect(formatted).toContain('\\x1b[7m'); // Reverse formatting
    expect(formatted).toContain('\\x1b[0m'); // Reset formatting
  });
});