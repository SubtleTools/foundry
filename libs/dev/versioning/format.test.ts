import { describe, expect, test } from 'bun:test';
import { formatNpmVersion, formatPortInfo } from './format';

describe('formatNpmVersion', () => {
  test('encodes go version with ts patch', () => {
    expect(formatNpmVersion('1.2.3', 5)).toBe('1.2.305');
  });

  test('encodes go version with zero ts patch', () => {
    expect(formatNpmVersion('1.2.3', 0)).toBe('1.2.300');
  });

  test('encodes go version with zero go patch and zero ts patch', () => {
    expect(formatNpmVersion('1.2.0', 0)).toBe('1.2.0');
  });

  test('encodes large go patch', () => {
    expect(formatNpmVersion('2.0.14', 0)).toBe('2.0.1400');
  });

  test('encodes large go patch with ts patch', () => {
    expect(formatNpmVersion('2.0.14', 7)).toBe('2.0.1407');
  });

  test('encodes max ts patch (99)', () => {
    expect(formatNpmVersion('1.0.0', 99)).toBe('1.0.99');
  });

  test('encodes 0.0.0 with zero ts patch', () => {
    expect(formatNpmVersion('0.0.0', 0)).toBe('0.0.0');
  });

  test('strips leading v from go version', () => {
    expect(formatNpmVersion('v1.2.3', 5)).toBe('1.2.305');
  });

  test('throws on tsPatch > 99', () => {
    expect(() => formatNpmVersion('1.2.3', 100)).toThrow('tsPatch must be 0–99');
  });

  test('throws on negative tsPatch', () => {
    expect(() => formatNpmVersion('1.2.3', -1)).toThrow('tsPatch must be 0–99');
  });

  test('throws on invalid go version format', () => {
    expect(() => formatNpmVersion('1.2', 0)).toThrow('Invalid Go version');
  });

  test('throws on empty go version', () => {
    expect(() => formatNpmVersion('', 0)).toThrow('Invalid Go version');
  });

  test('throws on go version with prerelease', () => {
    expect(() => formatNpmVersion('1.2.3-rc1', 0)).toThrow('Invalid Go version');
  });
});

describe('formatPortInfo', () => {
  test('builds PortInfo with correct fields', () => {
    const before = new Date().toISOString();
    const result = formatPortInfo('github.com/charmbracelet/lipgloss', '1.2.3', 5);
    const after = new Date().toISOString();

    expect(result.sourceRepo).toBe('github.com/charmbracelet/lipgloss');
    expect(result.sourceVersion).toBe('v1.2.3');
    expect(result.tsportVersion).toBe(5);
    expect(result.lastUpdated >= before).toBe(true);
    expect(result.lastUpdated <= after).toBe(true);
  });

  test('strips leading v and re-adds it to sourceVersion', () => {
    const result = formatPortInfo('repo', 'v2.0.14', 0);
    expect(result.sourceVersion).toBe('v2.0.14');
  });

  test('adds v prefix to sourceVersion when not present', () => {
    const result = formatPortInfo('repo', '2.0.14', 0);
    expect(result.sourceVersion).toBe('v2.0.14');
  });

  test('sets tsportVersion to provided tsPatch', () => {
    const result = formatPortInfo('repo', '1.0.0', 42);
    expect(result.tsportVersion).toBe(42);
  });

  test('lastUpdated is a valid ISO string', () => {
    const result = formatPortInfo('repo', '1.0.0', 0);
    expect(() => new Date(result.lastUpdated)).not.toThrow();
    expect(new Date(result.lastUpdated).toISOString()).toBe(result.lastUpdated);
  });
});
