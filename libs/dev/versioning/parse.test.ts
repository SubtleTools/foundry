import { describe, expect, test } from 'bun:test';
import { parseNpmVersion, parsePortInfo } from './parse';

describe('parseNpmVersion', () => {
  test('decodes simple version with no ts patch', () => {
    expect(parseNpmVersion('1.2.300')).toEqual({
      goMajor: 1,
      goMinor: 2,
      goPatch: 3,
      tsPatch: 0,
    });
  });

  test('decodes version with ts patch', () => {
    expect(parseNpmVersion('1.2.305')).toEqual({
      goMajor: 1,
      goMinor: 2,
      goPatch: 3,
      tsPatch: 5,
    });
  });

  test('decodes version with large go patch', () => {
    expect(parseNpmVersion('2.0.1400')).toEqual({
      goMajor: 2,
      goMinor: 0,
      goPatch: 14,
      tsPatch: 0,
    });
  });

  test('decodes version where npm patch < 100 (go patch 0)', () => {
    expect(parseNpmVersion('1.0.5')).toEqual({
      goMajor: 1,
      goMinor: 0,
      goPatch: 0,
      tsPatch: 5,
    });
  });

  test('decodes 0.0.0', () => {
    expect(parseNpmVersion('0.0.0')).toEqual({
      goMajor: 0,
      goMinor: 0,
      goPatch: 0,
      tsPatch: 0,
    });
  });

  test('decodes version with max ts patch (99)', () => {
    expect(parseNpmVersion('1.0.99')).toEqual({
      goMajor: 1,
      goMinor: 0,
      goPatch: 0,
      tsPatch: 99,
    });
  });

  test('decodes version with ts patch at boundary (100 = go patch 1, ts 0)', () => {
    expect(parseNpmVersion('1.0.100')).toEqual({
      goMajor: 1,
      goMinor: 0,
      goPatch: 1,
      tsPatch: 0,
    });
  });

  test('throws on empty string', () => {
    expect(() => parseNpmVersion('')).toThrow('Invalid npm version');
  });

  test('throws on version with leading v', () => {
    expect(() => parseNpmVersion('v1.2.3')).toThrow('Invalid npm version');
  });

  test('throws on two-part version', () => {
    expect(() => parseNpmVersion('1.2')).toThrow('Invalid npm version');
  });

  test('throws on four-part version', () => {
    expect(() => parseNpmVersion('1.2.3.4')).toThrow('Invalid npm version');
  });

  test('throws on version with prerelease suffix', () => {
    expect(() => parseNpmVersion('1.2.3-beta')).toThrow('Invalid npm version');
  });

  test('throws on non-numeric parts', () => {
    expect(() => parseNpmVersion('a.b.c')).toThrow('Invalid npm version');
  });
});

describe('parsePortInfo', () => {
  test('extracts version info from package-like object', () => {
    const result = parsePortInfo({ version: '1.2.305' });
    expect(result).toEqual({
      goMajor: 1,
      goMinor: 2,
      goPatch: 3,
      tsPatch: 5,
    });
  });

  test('ignores portInfo field (only reads version)', () => {
    const result = parsePortInfo({
      version: '1.2.305',
      portInfo: {
        sourceRepo: 'github.com/foo/bar',
        sourceVersion: 'v1.2.3',
        tsportVersion: 5,
        lastUpdated: '2024-01-01T00:00:00.000Z',
      },
    });
    expect(result).toEqual({
      goMajor: 1,
      goMinor: 2,
      goPatch: 3,
      tsPatch: 5,
    });
  });

  test('works without portInfo field', () => {
    const result = parsePortInfo({ version: '0.0.0' });
    expect(result).toEqual({
      goMajor: 0,
      goMinor: 0,
      goPatch: 0,
      tsPatch: 0,
    });
  });
});
