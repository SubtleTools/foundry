/**
 * Alignment utilities tests
 * 
 * Unit tests for text alignment functions, converted from Go's align_test.go
 */

import { describe, expect, test } from 'bun:test';
import { alignTextVertical } from '../../src/align';

describe('alignTextVertical', () => {
  const tests: Array<{
    str: string;
    pos: number;
    height: number;
    want: string;
    description: string;
  }> = [
    // Basic single line tests
    { str: 'Foo', pos: 0.0, height: 2, want: 'Foo\n', description: 'single line, top alignment' },
    { str: 'Foo', pos: 0.5, height: 5, want: '\n\nFoo\n\n', description: 'single line, center alignment' },
    { str: 'Foo', pos: 1.0, height: 5, want: '\n\n\n\nFoo', description: 'single line, bottom alignment' },

    // Multi-line tests
    { str: 'Foo\nBar', pos: 1.0, height: 5, want: '\n\n\nFoo\nBar', description: 'two lines, bottom alignment' },
    { str: 'Foo\nBar', pos: 0.5, height: 5, want: '\nFoo\nBar\n\n', description: 'two lines, center alignment' },
    { str: 'Foo\nBar', pos: 0.0, height: 5, want: 'Foo\nBar\n\n\n', description: 'two lines, top alignment' },

    // Three lines
    { str: 'Foo\nBar\nBaz', pos: 1.0, height: 5, want: '\n\nFoo\nBar\nBaz', description: 'three lines, bottom alignment' },
    { str: 'Foo\nBar\nBaz', pos: 0.5, height: 5, want: '\nFoo\nBar\nBaz\n', description: 'three lines, center alignment' },

    // Height equals content
    { str: 'Foo\nBar\nBaz', pos: 1.0, height: 3, want: 'Foo\nBar\nBaz', description: 'exact height match, bottom' },
    { str: 'Foo\nBar\nBaz', pos: 0.5, height: 3, want: 'Foo\nBar\nBaz', description: 'exact height match, center' },
    { str: 'Foo\nBar\nBaz', pos: 0.0, height: 3, want: 'Foo\nBar\nBaz', description: 'exact height match, top' },

    // Content already fills height
    { str: 'Foo\n\n\n\nBar', pos: 1.0, height: 5, want: 'Foo\n\n\n\nBar', description: 'already full height, bottom' },
    { str: 'Foo\n\n\n\nBar', pos: 0.5, height: 5, want: 'Foo\n\n\n\nBar', description: 'already full height, center' },
    { str: 'Foo\n\n\n\nBar', pos: 0.0, height: 5, want: 'Foo\n\n\n\nBar', description: 'already full height, top' },

    // Larger height values
    { str: 'Foo\nBar\nBaz', pos: 0.5, height: 9, want: '\n\n\nFoo\nBar\nBaz\n\n\n', description: 'center alignment with height 9' },
    { str: 'Foo\nBar\nBaz', pos: 0.5, height: 10, want: '\n\n\nFoo\nBar\nBaz\n\n\n\n', description: 'center alignment with height 10' },
  ];

  test.each(tests)('$description', ({ str, pos, height, want }) => {
    const got = alignTextVertical(str, pos, height, undefined);
    expect(got).toBe(want);
  });

  test('should handle edge cases', () => {
    // Test with empty string
    expect(alignTextVertical('', 0.5, 3, undefined)).toBe('\n\n');
    
    // Test with height smaller than content
    expect(alignTextVertical('A\nB\nC\nD', 0.5, 2, undefined)).toBe('A\nB\nC\nD');
    
    // Test with height 0
    expect(alignTextVertical('test', 0.5, 0, undefined)).toBe('test');
    
    // Test with negative height
    expect(alignTextVertical('test', 0.5, -1, undefined)).toBe('test');
  });

  test('should work with position values', () => {
    // Test using position values (0.0 = top, 0.5 = center, 1.0 = bottom)
    expect(alignTextVertical('Test', 0.0, 3, undefined)).toBe('Test\n\n');
    expect(alignTextVertical('Test', 0.5, 3, undefined)).toBe('\nTest\n');
    expect(alignTextVertical('Test', 1.0, 3, undefined)).toBe('\n\nTest');
  });
});