/**
 * Join utilities tests
 * 
 * Unit tests for text joining functions, converted from Go's join_test.go
 */

import { describe, expect, test } from 'bun:test';
import { JoinHorizontal, JoinVertical } from '../../src/join';

describe('JoinVertical', () => {
  const testCases = [
    {
      name: 'pos0 (Left alignment)',
      position: 0.0, // Left
      strings: ['A', 'BBBB'],
      expected: 'A   \nBBBB',
    },
    {
      name: 'pos1 (Right alignment)',
      position: 1.0, // Right
      strings: ['A', 'BBBB'],
      expected: '   A\nBBBB',
    },
    {
      name: 'pos0.25 (Quarter alignment)',
      position: 0.25,
      strings: ['A', 'BBBB'],
      expected: ' A  \nBBBB',
    },
    {
      name: 'center alignment',
      position: 0.5,
      strings: ['AB', 'CCCCCC'],
      expected: '  AB  \nCCCCCC',
    },
    {
      name: 'multiple strings',
      position: 0.0, // Left
      strings: ['A', 'BB', 'CCC'],
      expected: 'A  \nBB \nCCC',
    },
  ];

  test.each(testCases)('$name', ({ position, strings, expected }) => {
    const result = JoinVertical(position, ...strings);
    expect(result).toBe(expected);
  });

  test('should handle empty strings', () => {
    const result = JoinVertical(0.5, '', 'test', '');
    expect(result).toContain('test');
  });

  test('should work with alignment constants', () => {
    // Test using position values (0.0 = left, 1.0 = right)
    const leftResult = JoinVertical(0.0, 'A', 'BBBB');
    expect(leftResult).toBe('A   \nBBBB');
    
    const rightResult = JoinVertical(1.0, 'A', 'BBBB');
    expect(rightResult).toBe('   A\nBBBB');
  });
});

describe('JoinHorizontal', () => {
  const testCases = [
    {
      name: 'pos0 (Top alignment)',
      position: 0.0, // Top
      strings: ['A', 'B\nB\nB\nB'],
      expected: 'AB\n B\n B\n B',
    },
    {
      name: 'pos1 (Bottom alignment)', 
      position: 1.0, // Bottom
      strings: ['A', 'B\nB\nB\nB'],
      expected: ' B\n B\n B\nAB',
    },
    {
      name: 'pos0.25 (Quarter alignment)',
      position: 0.25,
      strings: ['A', 'B\nB\nB\nB'],
      expected: ' B\nAB\n B\n B',
    },
    {
      name: 'center alignment',
      position: 0.5,
      strings: ['AB', 'C\nC\nC\nC'],
      expected: '  C\n  C\nABC\n  C',
    },
    {
      name: 'multiple strings horizontal',
      position: 0.0, // Top
      strings: ['A', 'B', 'C\nC'],
      expected: 'ABC\n  C',
    },
  ];

  test.each(testCases)('$name', ({ position, strings, expected }) => {
    const result = JoinHorizontal(position, ...strings);
    expect(result).toBe(expected);
  });

  test('should handle single line content', () => {
    const result = JoinHorizontal(0.5, 'Hello', 'World');
    expect(result).toBe('HelloWorld');
  });

  test('should handle empty strings horizontally', () => {
    const result = JoinHorizontal(0.5, '', 'test', '');
    expect(result).toBe('test');
  });

  test('should work with alignment constants', () => {
    // Test using position values (0.0 = top, 1.0 = bottom)
    const topResult = JoinHorizontal(0.0, 'A', 'B\nB');
    expect(topResult).toBe('AB\n B');
    
    const bottomResult = JoinHorizontal(1.0, 'A', 'B\nB');
    expect(bottomResult).toBe(' B\nAB');
  });
});

describe('Join Edge Cases', () => {
  test('should handle very long content', () => {
    const longString = 'A'.repeat(100);
    const shortString = 'B';
    
    const result = JoinVertical(0.0, shortString, longString);
    expect(result).toContain(longString);
    expect(result).toContain('B' + ' '.repeat(99)); // B padded to match length
  });

  test('should handle many newlines', () => {
    const multilineA = 'A\n\n\nA';
    const multilineB = 'B\nB';
    
    const result = JoinHorizontal(0.0, multilineA, multilineB);
    expect(result.split('\n')).toHaveLength(4); // Should match longest content
  });

  test('should handle unicode characters', () => {
    const unicode1 = '🌟';
    const unicode2 = '🎉🎊';
    
    const result = JoinVertical(0.0, unicode1, unicode2);
    expect(result).toContain('🌟');
    expect(result).toContain('🎉🎊');
  });

  test('should handle tab characters', () => {
    const withTab = 'A\tB';
    const normal = 'CD';
    
    const result = JoinVertical(0.0, withTab, normal);
    expect(result).toBeTruthy(); // Should not crash
  });
});

describe('Join Performance Edge Cases', () => {
  test('should handle no strings', () => {
    const result = JoinVertical(0.5);
    expect(result).toBe('');
  });

  test('should handle single string', () => {
    const result = JoinVertical(0.5, 'single');
    expect(result).toBe('single');
  });

  test('should handle position boundaries', () => {
    // Test extreme position values
    const result1 = JoinVertical(-0.5, 'A', 'BB'); // Negative should clamp to 0
    const result2 = JoinVertical(1.5, 'A', 'BB');  // >1 should clamp to 1
    
    expect(result1).toBe(JoinVertical(0.0, 'A', 'BB'));
    expect(result2).toBe(JoinVertical(1.0, 'A', 'BB'));
  });
});