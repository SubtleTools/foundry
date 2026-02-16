import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { bumpTsportVersion } from './bump-tsport';

describe('bumpTsportVersion', () => {
  let tempDir: string;
  let pkgPath: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'versioning-test-'));
    pkgPath = join(tempDir, 'package.json');
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  function writePkg(data: Record<string, unknown>) {
    writeFileSync(pkgPath, JSON.stringify(data, null, 2) + '\n');
  }

  function readPkg() {
    return JSON.parse(readFileSync(pkgPath, 'utf8'));
  }

  test('increments tsPatch from 0 to 1', () => {
    writePkg({ version: '1.2.300' });
    bumpTsportVersion(pkgPath);
    const pkg = readPkg();
    expect(pkg.version).toBe('1.2.301');
  });

  test('increments tsPatch from 5 to 6', () => {
    writePkg({ version: '1.2.305' });
    bumpTsportVersion(pkgPath);
    const pkg = readPkg();
    expect(pkg.version).toBe('1.2.306');
  });

  test('increments tsPatch when go patch is 0', () => {
    writePkg({ version: '1.0.3' });
    bumpTsportVersion(pkgPath);
    const pkg = readPkg();
    expect(pkg.version).toBe('1.0.4');
  });

  test('increments from version 0.0.0 to 0.0.1', () => {
    writePkg({ version: '0.0.0' });
    bumpTsportVersion(pkgPath);
    const pkg = readPkg();
    expect(pkg.version).toBe('0.0.1');
  });

  test('updates portInfo.tsportVersion', () => {
    writePkg({
      version: '1.2.305',
      portInfo: { sourceRepo: 'repo', tsportVersion: 5 },
    });
    bumpTsportVersion(pkgPath);
    const pkg = readPkg();
    expect(pkg.portInfo.tsportVersion).toBe(6);
  });

  test('updates portInfo.lastUpdated', () => {
    writePkg({ version: '1.0.0' });
    const before = new Date().toISOString();
    bumpTsportVersion(pkgPath);
    const after = new Date().toISOString();
    const pkg = readPkg();
    expect(pkg.portInfo.lastUpdated >= before).toBe(true);
    expect(pkg.portInfo.lastUpdated <= after).toBe(true);
  });

  test('preserves existing portInfo fields', () => {
    writePkg({
      version: '1.2.305',
      portInfo: {
        sourceRepo: 'github.com/foo/bar',
        sourceVersion: 'v1.2.3',
        tsportVersion: 5,
        lastUpdated: '2024-01-01T00:00:00.000Z',
      },
    });
    bumpTsportVersion(pkgPath);
    const pkg = readPkg();
    expect(pkg.portInfo.sourceRepo).toBe('github.com/foo/bar');
    expect(pkg.portInfo.sourceVersion).toBe('v1.2.3');
    expect(pkg.portInfo.tsportVersion).toBe(6);
  });

  test('preserves other package.json fields', () => {
    writePkg({ name: '@tsports/foo', version: '1.0.0', private: true });
    bumpTsportVersion(pkgPath);
    const pkg = readPkg();
    expect(pkg.name).toBe('@tsports/foo');
    expect(pkg.private).toBe(true);
  });

  test('writes JSON with 2-space indent and trailing newline', () => {
    writePkg({ version: '1.0.0' });
    bumpTsportVersion(pkgPath);
    const raw = readFileSync(pkgPath, 'utf8');
    expect(raw).toMatch(/^{\n {2}/);
    expect(raw.endsWith('\n')).toBe(true);
  });

  test('handles bump at tsPatch 98 (goes to 99)', () => {
    writePkg({ version: '1.0.98' });
    bumpTsportVersion(pkgPath);
    const pkg = readPkg();
    expect(pkg.version).toBe('1.0.99');
  });

  test('throws when tsPatch would exceed 99', () => {
    writePkg({ version: '1.0.99' });
    expect(() => bumpTsportVersion(pkgPath)).toThrow('tsPatch would exceed 99');
  });

  test('throws when tsPatch would exceed 99 with large go patch', () => {
    writePkg({ version: '1.0.1499' });
    expect(() => bumpTsportVersion(pkgPath)).toThrow('tsPatch would exceed 99');
  });
});
