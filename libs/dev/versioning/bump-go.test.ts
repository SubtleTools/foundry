import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { bumpGoVersion } from './bump-go';

describe('bumpGoVersion', () => {
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

  test('sets npm version from go version with tsPatch reset to 0', () => {
    writePkg({ version: '1.2.305', portInfo: { sourceRepo: 'repo' } });
    bumpGoVersion(pkgPath, '1.3.0');
    const pkg = readPkg();
    expect(pkg.version).toBe('1.3.0');
  });

  test('sets goSourceVersion with v prefix', () => {
    writePkg({ version: '0.0.0' });
    bumpGoVersion(pkgPath, '2.1.4');
    const pkg = readPkg();
    expect(pkg.goSourceVersion).toBe('v2.1.4');
  });

  test('strips leading v from input go version', () => {
    writePkg({ version: '0.0.0' });
    bumpGoVersion(pkgPath, 'v1.5.0');
    const pkg = readPkg();
    expect(pkg.version).toBe('1.5.0');
    expect(pkg.goSourceVersion).toBe('v1.5.0');
  });

  test('resets tsPatch to 0 in portInfo', () => {
    writePkg({
      version: '1.2.305',
      portInfo: { sourceRepo: 'repo', tsportVersion: 5 },
    });
    bumpGoVersion(pkgPath, '1.3.0');
    const pkg = readPkg();
    expect(pkg.portInfo.tsportVersion).toBe(0);
  });

  test('updates portInfo sourceVersion', () => {
    writePkg({
      version: '1.2.305',
      portInfo: { sourceRepo: 'repo' },
    });
    bumpGoVersion(pkgPath, '1.3.0');
    const pkg = readPkg();
    expect(pkg.portInfo.sourceVersion).toBe('v1.3.0');
  });

  test('preserves sourceRepo from existing portInfo', () => {
    writePkg({
      version: '0.0.0',
      portInfo: { sourceRepo: 'github.com/foo/bar' },
    });
    bumpGoVersion(pkgPath, '1.0.0');
    const pkg = readPkg();
    expect(pkg.portInfo.sourceRepo).toBe('github.com/foo/bar');
  });

  test('defaults sourceRepo to empty string when no portInfo exists', () => {
    writePkg({ version: '0.0.0' });
    bumpGoVersion(pkgPath, '1.0.0');
    const pkg = readPkg();
    expect(pkg.portInfo.sourceRepo).toBe('');
  });

  test('updates lastUpdated in portInfo', () => {
    writePkg({ version: '0.0.0' });
    const before = new Date().toISOString();
    bumpGoVersion(pkgPath, '1.0.0');
    const after = new Date().toISOString();
    const pkg = readPkg();
    expect(pkg.portInfo.lastUpdated >= before).toBe(true);
    expect(pkg.portInfo.lastUpdated <= after).toBe(true);
  });

  test('preserves other package.json fields', () => {
    writePkg({ name: '@tsports/foo', version: '0.0.0', private: true });
    bumpGoVersion(pkgPath, '1.0.0');
    const pkg = readPkg();
    expect(pkg.name).toBe('@tsports/foo');
    expect(pkg.private).toBe(true);
  });

  test('writes JSON with 2-space indent and trailing newline', () => {
    writePkg({ version: '0.0.0' });
    bumpGoVersion(pkgPath, '1.0.0');
    const raw = readFileSync(pkgPath, 'utf8');
    expect(raw).toMatch(/^{\n {2}/);
    expect(raw.endsWith('\n')).toBe(true);
  });

  test('handles large go patch number', () => {
    writePkg({ version: '0.0.0' });
    bumpGoVersion(pkgPath, '1.0.14');
    const pkg = readPkg();
    expect(pkg.version).toBe('1.0.1400');
  });

  test('throws on invalid go version format', () => {
    writePkg({ version: '0.0.0' });
    expect(() => bumpGoVersion(pkgPath, '1.2')).toThrow('Go version must be in format X.Y.Z');
  });

  test('throws on non-numeric go version', () => {
    writePkg({ version: '0.0.0' });
    expect(() => bumpGoVersion(pkgPath, 'abc')).toThrow('Go version must be in format X.Y.Z');
  });

  test('throws on empty go version', () => {
    writePkg({ version: '0.0.0' });
    expect(() => bumpGoVersion(pkgPath, '')).toThrow('Go version must be in format X.Y.Z');
  });
});
