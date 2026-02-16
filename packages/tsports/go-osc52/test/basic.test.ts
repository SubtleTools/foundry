import { describe, expect, test } from 'bun:test';
import {
  Clear,
  DefaultMode,
  New,
  PrimaryClipboard,
  Query,
  ScreenMode,
  SystemClipboard,
  TmuxMode,
} from '../src/go-style.js';
import { Sequence } from '../src/index.js';

// Test cases matching the Go test file exactly
describe('Copy operations (matching Go TestCopy)', () => {
  const testCases = [
    {
      name: 'hello world',
      str: 'hello world',
      clipboard: SystemClipboard,
      mode: DefaultMode,
      limit: 0,
      expected: '\x1b]52;c;aGVsbG8gd29ybGQ=\x07',
    },
    {
      name: 'empty string',
      str: '',
      clipboard: SystemClipboard,
      mode: DefaultMode,
      limit: 0,
      expected: '\x1b]52;c;\x07',
    },
    {
      name: 'hello world primary',
      str: 'hello world',
      clipboard: PrimaryClipboard,
      mode: DefaultMode,
      limit: 0,
      expected: '\x1b]52;p;aGVsbG8gd29ybGQ=\x07',
    },
    {
      name: 'hello world tmux mode',
      str: 'hello world',
      clipboard: SystemClipboard,
      mode: TmuxMode,
      limit: 0,
      expected: '\x1bPtmux;\x1b\x1b]52;c;aGVsbG8gd29ybGQ=\x07\x1b\\',
    },
    {
      name: 'hello world screen mode',
      str: 'hello world',
      clipboard: SystemClipboard,
      mode: ScreenMode,
      limit: 0,
      expected: '\x1bP\x1b]52;c;aGVsbG8gd29ybGQ=\x07\x1b\\',
    },
    {
      name: 'hello world screen mode longer than 76 bytes string',
      str: 'hello world hello world hello world hello world hello world hello world hello world hello world',
      clipboard: SystemClipboard,
      mode: ScreenMode,
      limit: 0,
      expected:
        '\x1bP\x1b]52;c;aGVsbG8gd29ybGQgaGVsbG8gd29ybGQgaGVsbG8gd29ybGQgaGVsbG8gd29ybGQgaGVsbG8gd29y\x1b\\\x1bPbGQgaGVsbG8gd29ybGQgaGVsbG8gd29ybGQgaGVsbG8gd29ybGQ=\x07\x1b\\',
    },
    {
      name: 'hello world with limit 11',
      str: 'hello world',
      clipboard: SystemClipboard,
      mode: DefaultMode,
      limit: 11,
      expected: '\x1b]52;c;aGVsbG8gd29ybGQ=\x07',
    },
    {
      name: 'hello world with limit 10',
      str: 'hello world',
      clipboard: SystemClipboard,
      mode: DefaultMode,
      limit: 10,
      expected: '',
    },
  ];

  testCases.forEach((testCase) => {
    test(testCase.name, () => {
      let s = New(testCase.str);
      s = s.Clipboard(testCase.clipboard);
      s = s.Mode(testCase.mode);
      s = s.Limit(testCase.limit);
      expect(s.String()).toBe(testCase.expected);
    });
  });
});

describe('Query operations (matching Go TestQuery)', () => {
  const testCases = [
    {
      name: 'query system clipboard',
      mode: DefaultMode,
      clipboard: SystemClipboard,
      expected: '\x1b]52;c;?\x07',
    },
    {
      name: 'query primary clipboard',
      mode: DefaultMode,
      clipboard: PrimaryClipboard,
      expected: '\x1b]52;p;?\x07',
    },
    {
      name: 'query system clipboard tmux mode',
      mode: TmuxMode,
      clipboard: SystemClipboard,
      expected: '\x1bPtmux;\x1b\x1b]52;c;?\x07\x1b\\',
    },
    {
      name: 'query system clipboard screen mode',
      mode: ScreenMode,
      clipboard: SystemClipboard,
      expected: '\x1bP\x1b]52;c;?\x07\x1b\\',
    },
    {
      name: 'query primary clipboard tmux mode',
      mode: TmuxMode,
      clipboard: PrimaryClipboard,
      expected: '\x1bPtmux;\x1b\x1b]52;p;?\x07\x1b\\',
    },
    {
      name: 'query primary clipboard screen mode',
      mode: ScreenMode,
      clipboard: PrimaryClipboard,
      expected: '\x1bP\x1b]52;p;?\x07\x1b\\',
    },
  ];

  testCases.forEach((testCase) => {
    test(testCase.name, () => {
      const s = Query().Clipboard(testCase.clipboard).Mode(testCase.mode);
      expect(s.String()).toBe(testCase.expected);
    });
  });
});

describe('Clear operations (matching Go TestClear)', () => {
  const testCases = [
    {
      name: 'clear system clipboard',
      mode: DefaultMode,
      clipboard: SystemClipboard,
      expected: '\x1b]52;c;!\x07',
    },
    {
      name: 'clear system clipboard tmux mode',
      mode: TmuxMode,
      clipboard: SystemClipboard,
      expected: '\x1bPtmux;\x1b\x1b]52;c;!\x07\x1b\\',
    },
    {
      name: 'clear system clipboard screen mode',
      mode: ScreenMode,
      clipboard: SystemClipboard,
      expected: '\x1bP\x1b]52;c;!\x07\x1b\\',
    },
  ];

  testCases.forEach((testCase) => {
    test(testCase.name, () => {
      const s = Clear().Clipboard(testCase.clipboard).Mode(testCase.mode);
      expect(s.String()).toBe(testCase.expected);
    });
  });
});

describe('WriteTo operations (matching Go TestWriteTo)', () => {
  const testCases = [
    {
      name: 'hello world',
      str: 'hello world',
      clipboard: SystemClipboard,
      mode: DefaultMode,
      limit: 0,
      expected: '\x1b]52;c;aGVsbG8gd29ybGQ=\x07',
    },
    {
      name: 'empty string',
      str: '',
      clipboard: SystemClipboard,
      mode: DefaultMode,
      limit: 0,
      expected: '\x1b]52;c;\x07',
    },
  ];

  testCases.forEach((testCase) => {
    test(testCase.name, async () => {
      let s = New(testCase.str);
      s = s.Clipboard(testCase.clipboard);
      s = s.Mode(testCase.mode);
      s = s.Limit(testCase.limit);

      // Mock writer that captures written data
      let writtenData = '';
      const mockWriter = {
        write: (data: string | Buffer) => {
          writtenData += data.toString();
          return true;
        },
      };

      const result = await s.WriteTo(mockWriter);
      expect(result.err).toBeUndefined();
      expect(result.n).toBeGreaterThan(0);
      expect(writtenData).toBe(testCase.expected);
    });
  });
});

describe('TypeScript-native API functionality', () => {
  test('basic sequence creation and string conversion', () => {
    const seq = new Sequence('hello world');
    expect(seq.toString()).toBe('\x1b]52;c;aGVsbG8gd29ybGQ=\x07');
  });

  test('fluent API chaining', () => {
    const seq = new Sequence('test').tmux().primary().withLimit(100);

    expect(seq.toString()).toBe('\x1bPtmux;\x1b\x1b]52;p;dGVzdA==\x07\x1b\\');
  });

  test('query operation', () => {
    const seq = new Sequence().query().primary();
    expect(seq.toString()).toBe('\x1b]52;p;?\x07');
  });

  test('clear operation', () => {
    const seq = new Sequence().clear().tmux();
    expect(seq.toString()).toBe('\x1bPtmux;\x1b\x1b]52;c;!\x07\x1b\\');
  });
});

describe('Edge cases and error conditions', () => {
  test('negative limit gets normalized to 0', () => {
    const seq = New('test').Limit(-5);
    expect(seq.String()).toBe('\x1b]52;c;dGVzdA==\x07');
  });

  test('string exceeding limit returns empty', () => {
    const seq = New('hello world').Limit(5);
    expect(seq.String()).toBe('');
  });

  test('multiple string arguments get joined with spaces', () => {
    const seq = New('hello', 'world', 'test');
    expect(seq.String()).toBe('\x1b]52;c;aGVsbG8gd29ybGQgdGVzdA==\x07');
  });

  test('SetString method works correctly', () => {
    const seq = New('initial').SetString('new', 'value');
    expect(seq.String()).toBe('\x1b]52;c;bmV3IHZhbHVl\x07');
  });
});
