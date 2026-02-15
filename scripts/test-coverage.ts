#!/usr/bin/env bun
/**
 * Runs tests with coverage across all workspace packages and generates
 * a unified coverage report.
 *
 * Usage: bun run scripts/test-coverage.ts
 */

import { $ } from 'bun';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = import.meta.dir.replace('/scripts', '');
const COVERAGE_DIR = join(ROOT, 'coverage');
const PACKAGES_DIR = join(ROOT, 'packages');
const LIBS_DIR = join(ROOT, 'libs');

interface PackageInfo {
  name: string;
  path: string;
  hasTests: boolean;
}

function findPackagesWithTests(baseDir: string): PackageInfo[] {
  const packages: PackageInfo[] = [];

  if (!existsSync(baseDir)) return packages;

  function scanDir(dir: string, depth: number = 0) {
    if (depth > 3) return; // Limit depth

    const items = readdirSync(dir);

    // Check if this directory has a package.json (is a package)
    if (items.includes('package.json') && !dir.includes('node_modules')) {
      const hasTestDir = items.includes('test') && statSync(join(dir, 'test')).isDirectory();
      const hasTestFiles = items.some(f => f.includes('.test.') || f.includes('.spec.'));

      if (hasTestDir || hasTestFiles) {
        const pkgJson = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8'));
        packages.push({
          name: pkgJson.name || relative(ROOT, dir),
          path: dir,
          hasTests: true,
        });
      }
      return; // Don't recurse into package subdirectories
    }

    // Recurse into subdirectories
    for (const item of items) {
      if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
      const itemPath = join(dir, item);
      if (statSync(itemPath).isDirectory()) {
        scanDir(itemPath, depth + 1);
      }
    }
  }

  scanDir(baseDir);
  return packages;
}

async function runTestsWithCoverage(pkg: PackageInfo): Promise<{ success: boolean; lcovPath?: string }> {
  const pkgCoverageDir = join(pkg.path, 'coverage');

  console.log(`\n📦 Testing ${pkg.name}...`);

  try {
    // Run tests with coverage
    const result = await $`bun test --coverage --coverage-reporter=lcov --coverage-dir=${pkgCoverageDir}`.cwd(pkg.path).quiet();

    const lcovPath = join(pkgCoverageDir, 'lcov.info');
    if (existsSync(lcovPath)) {
      return { success: true, lcovPath };
    }

    console.log(`   ⚠️  No coverage generated for ${pkg.name}`);
    return { success: true };
  } catch (error) {
    console.error(`   ❌ Tests failed for ${pkg.name}`);
    return { success: false };
  }
}

function mergeLcovFiles(lcovPaths: string[], outputPath: string) {
  let mergedContent = '';

  for (const lcovPath of lcovPaths) {
    if (existsSync(lcovPath)) {
      const content = readFileSync(lcovPath, 'utf-8');
      // Make paths relative to monorepo root
      const pkgDir = lcovPath.replace('/coverage/lcov.info', '');
      const relativePkgDir = relative(ROOT, pkgDir);

      // Update SF: paths to be relative to monorepo root
      const updatedContent = content.replace(
        /^SF:(.+)$/gm,
        (match, filePath) => {
          if (filePath.startsWith('/') || filePath.startsWith('..')) {
            // Already absolute or relative path
            const absPath = filePath.startsWith('/') ? filePath : join(pkgDir, filePath);
            return `SF:${relative(ROOT, absPath)}`;
          }
          return `SF:${join(relativePkgDir, filePath)}`;
        }
      );

      mergedContent += updatedContent + '\n';
    }
  }

  writeFileSync(outputPath, mergedContent);
}

async function main() {
  console.log('🔍 Finding packages with tests...\n');

  const packages = [
    ...findPackagesWithTests(PACKAGES_DIR),
    ...findPackagesWithTests(LIBS_DIR),
  ];

  if (packages.length === 0) {
    console.log('No packages with tests found.');
    process.exit(0);
  }

  console.log(`Found ${packages.length} packages with tests:`);
  packages.forEach(p => console.log(`  - ${p.name}`));

  // Ensure coverage directory exists
  if (!existsSync(COVERAGE_DIR)) {
    mkdirSync(COVERAGE_DIR, { recursive: true });
  }

  // Run tests with coverage for each package
  const lcovPaths: string[] = [];
  let allPassed = true;

  for (const pkg of packages) {
    const result = await runTestsWithCoverage(pkg);
    if (!result.success) {
      allPassed = false;
    }
    if (result.lcovPath) {
      lcovPaths.push(result.lcovPath);
    }
  }

  // Merge lcov files
  if (lcovPaths.length > 0) {
    console.log('\n📊 Merging coverage reports...');
    const mergedLcovPath = join(COVERAGE_DIR, 'lcov.info');
    mergeLcovFiles(lcovPaths, mergedLcovPath);
    console.log(`   ✅ Merged coverage written to: ${relative(ROOT, mergedLcovPath)}`);
  }

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('COVERAGE SUMMARY');
  console.log('='.repeat(70));

  // Parse and display lcov summary
  if (existsSync(join(COVERAGE_DIR, 'lcov.info'))) {
    const lcovContent = readFileSync(join(COVERAGE_DIR, 'lcov.info'), 'utf-8');
    const summary = parseLcovSummary(lcovContent);

    console.log(`\n${'Package'.padEnd(40)} | ${'Lines'.padStart(12)} | ${'Functions'.padStart(12)}`);
    console.log('-'.repeat(70));

    for (const [pkg, stats] of Object.entries(summary.byPackage)) {
      const linePct = stats.linesTotal > 0 ? ((stats.linesHit / stats.linesTotal) * 100).toFixed(1) + '%' : 'N/A';
      const funcPct = stats.funcsTotal > 0 ? ((stats.funcsHit / stats.funcsTotal) * 100).toFixed(1) + '%' : 'N/A';
      console.log(`${pkg.padEnd(40)} | ${linePct.padStart(12)} | ${funcPct.padStart(12)}`);
    }

    console.log('-'.repeat(70));
    const totalLinePct = summary.total.linesTotal > 0
      ? ((summary.total.linesHit / summary.total.linesTotal) * 100).toFixed(1) + '%'
      : 'N/A';
    const totalFuncPct = summary.total.funcsTotal > 0
      ? ((summary.total.funcsHit / summary.total.funcsTotal) * 100).toFixed(1) + '%'
      : 'N/A';
    console.log(`${'TOTAL'.padEnd(40)} | ${totalLinePct.padStart(12)} | ${totalFuncPct.padStart(12)}`);

    console.log(`\n📄 Full report: coverage/lcov.info`);
    console.log('   View in VS Code with Coverage Gutters extension or upload to Codecov.');
  }

  process.exit(allPassed ? 0 : 1);
}

interface CoverageStats {
  linesHit: number;
  linesTotal: number;
  funcsHit: number;
  funcsTotal: number;
}

function parseLcovSummary(lcovContent: string): { byPackage: Record<string, CoverageStats>; total: CoverageStats } {
  const byPackage: Record<string, CoverageStats> = {};
  const total: CoverageStats = { linesHit: 0, linesTotal: 0, funcsHit: 0, funcsTotal: 0 };

  let currentFile = '';
  let currentPkg = '';

  for (const line of lcovContent.split('\n')) {
    if (line.startsWith('SF:')) {
      currentFile = line.slice(3);
      // Extract package name from path (e.g., packages/tsports/gamut/src/...)
      const match = currentFile.match(/packages\/tsports\/([^/]+)/);
      currentPkg = match ? `@tsports/${match[1]}` : 'other';

      if (!byPackage[currentPkg]) {
        byPackage[currentPkg] = { linesHit: 0, linesTotal: 0, funcsHit: 0, funcsTotal: 0 };
      }
    } else if (line.startsWith('LH:')) {
      const hit = parseInt(line.slice(3), 10);
      byPackage[currentPkg].linesHit += hit;
      total.linesHit += hit;
    } else if (line.startsWith('LF:')) {
      const found = parseInt(line.slice(3), 10);
      byPackage[currentPkg].linesTotal += found;
      total.linesTotal += found;
    } else if (line.startsWith('FNH:')) {
      const hit = parseInt(line.slice(4), 10);
      byPackage[currentPkg].funcsHit += hit;
      total.funcsHit += hit;
    } else if (line.startsWith('FNF:')) {
      const found = parseInt(line.slice(4), 10);
      byPackage[currentPkg].funcsTotal += found;
      total.funcsTotal += found;
    }
  }

  return { byPackage, total };
}

main();
