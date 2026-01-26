#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

interface PackageInfo {
  name: string;
  path: string;
  packageName: string;
  description: string;
  features: string[];
  repoUrl: string;
  docsUrl: string;
  npmUrl: string;
}

const packages: PackageInfo[] = [
  {
    name: 'lipgloss',
    path: '/work/tsports/packages/tsports/lipgloss',
    packageName: '@tsports/lipgloss',
    description: 'A TypeScript port of the lipgloss library with 100% API compatibility.',
    features: [
      '🎨 Advanced terminal styling and layout engine',
      '📏 Precise text alignment and positioning',
      '🎭 Rich border and padding systems',
      '🌈 Complete color and styling support',
      '📊 Table and list components',
      '🔧 Both TypeScript and Go-style APIs',
      '📘 Full TypeScript type definitions',
      '✅ Comprehensive test coverage with visual regression testing'
    ],
    repoUrl: 'https://github.com/tsports/lipgloss',
    docsUrl: 'https://tsports.github.io/lipgloss/',
    npmUrl: 'https://www.npmjs.com/package/@tsports/lipgloss'
  },
  {
    name: 'termenv',
    path: '/work/tsports/packages/tsports/termenv',
    packageName: '@tsports/termenv',
    description: 'A TypeScript port of the termenv library with 100% API compatibility.',
    features: [
      '🖥️ Terminal environment detection and capabilities',
      '🎨 Color profile detection (TrueColor, ANSI256, ANSI)',
      '📏 Terminal dimensions and feature detection',
      '🔧 Cross-platform terminal compatibility',
      '⚙️ Environment variable parsing and handling',
      '🔧 Both TypeScript and Go-style APIs',
      '📘 Full TypeScript type definitions',
      '✅ Comprehensive test coverage across platforms'
    ],
    repoUrl: 'https://github.com/tsports/termenv',
    docsUrl: 'https://tsports.github.io/termenv/',
    npmUrl: 'https://www.npmjs.com/package/@tsports/termenv'
  },
  {
    name: 'uniseg',
    path: '/work/tsports/packages/tsports/uniseg',
    packageName: '@tsports/uniseg',
    description: 'A TypeScript port of the uniseg library with 100% API compatibility.',
    features: [
      '📝 Unicode text segmentation (grapheme clusters, words, sentences)',
      '📏 Accurate string width calculations for terminal display',
      '🔤 Unicode property queries and character classification',
      '🌍 Full Unicode 15.0 support with emoji handling',
      '⚡ High-performance string processing algorithms',
      '🔧 Both TypeScript and Go-style APIs',
      '📘 Full TypeScript type definitions',
      '✅ Comprehensive test coverage with Unicode test suites'
    ],
    repoUrl: 'https://github.com/tsports/uniseg',
    docsUrl: 'https://tsports.github.io/uniseg/',
    npmUrl: 'https://www.npmjs.com/package/@tsports/uniseg'
  }
];

async function createWorkflows(pkg: PackageInfo) {
  const workflowsDir = join(pkg.path, '.github', 'workflows');
  await mkdir(workflowsDir, { recursive: true });

  // Read package.json to get build script details
  let packageJson: any = {};
  try {
    const packageJsonPath = join(pkg.path, 'package.json');
    if (existsSync(packageJsonPath)) {
      const content = await readFile(packageJsonPath, 'utf-8');
      packageJson = JSON.parse(content);
    }
  } catch (error) {
    console.error(`Failed to read package.json for ${pkg.name}:`, error);
  }

  // Determine build script
  const buildScript = packageJson.scripts?.build || 'bun run build';
  const testScript = packageJson.scripts?.test || 'bun test';
  const lintScript = packageJson.scripts?.lint || 'bun run lint';
  const formatCheckScript = packageJson.scripts?.['format:check'] || 'dprint check';
  const docsScript = packageJson.scripts?.['docs:build'] || 'bun run docs:build';

  // Create CI workflow
  const ciWorkflow = `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION_PRIMARY: 20

jobs:
  # Fast feedback job - runs on single platform for quick validation
  quick-check:
    name: Quick Check
    runs-on: ubuntu-latest
    outputs:
      should-skip: \${{ steps.skip-check.outputs.should_skip }}
    steps:
      - name: Check for duplicate runs
        id: skip-check
        uses: fkirc/skip-duplicate-actions@v5
        with:
          concurrent_skipping: "same_content"
          skip_after_successful_duplicate: "true"

      - name: Checkout code
        if: steps.skip-check.outputs.should_skip != 'true'
        uses: actions/checkout@v4

      - name: Setup Bun
        if: steps.skip-check.outputs.should_skip != 'true'
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        if: steps.skip-check.outputs.should_skip != 'true'
        run: bun install

      - name: Check formatting
        if: steps.skip-check.outputs.should_skip != 'true'
        run: ${formatCheckScript}

      - name: Lint code
        if: steps.skip-check.outputs.should_skip != 'true'
        run: ${lintScript}

      - name: Type check and build
        if: steps.skip-check.outputs.should_skip != 'true'
        run: ${buildScript}

      - name: Quick test
        if: steps.skip-check.outputs.should_skip != 'true'
        run: ${testScript}

  # Comprehensive test matrix - runs after quick check passes
  test-matrix:
    name: Test (\${{ matrix.os }}, Node \${{ matrix.node-version }})
    runs-on: \${{ matrix.os }}
    needs: quick-check
    if: needs.quick-check.outputs.should-skip != 'true'
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18, 20, 22]
        exclude:
          # Skip duplicate of quick-check
          - os: ubuntu-latest
            node-version: 20

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}

      - name: Install dependencies
        run: bun install

      - name: Build project
        run: ${buildScript}

      - name: Run tests
        run: ${testScript}

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-\${{ matrix.os }}-node\${{ matrix.node-version }}
          path: |
            test-results.xml
            coverage/
          retention-days: 7

  # Coverage and build artifacts
  build-and-coverage:
    name: Build & Coverage
    runs-on: ubuntu-latest
    needs: quick-check
    if: needs.quick-check.outputs.should-skip != 'true'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION_PRIMARY }}

      - name: Install dependencies
        run: bun install

      - name: Build project
        run: ${buildScript}

      - name: Run tests with coverage
        run: ${testScript.includes('--coverage') ? testScript : testScript + ' --coverage'}

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: \${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: false

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 30

  # Documentation build
  docs:
    name: Documentation
    runs-on: ubuntu-latest
    needs: quick-check
    if: needs.quick-check.outputs.should-skip != 'true'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build documentation
        run: ${docsScript}

      - name: Upload docs artifacts
        uses: actions/upload-artifact@v4
        with:
          name: docs
          path: docs/
          retention-days: 30

  # Final status check
  ci-success:
    name: CI Success
    runs-on: ubuntu-latest
    needs: [quick-check, test-matrix, build-and-coverage, docs]
    if: always()
    steps:
      - name: Check all jobs status
        run: |
          if [ "\${{ needs.quick-check.result }}" = "success" ] && \\
             [ "\${{ needs.test-matrix.result }}" = "success" ] && \\
             [ "\${{ needs.build-and-coverage.result }}" = "success" ] && \\
             [ "\${{ needs.docs.result }}" = "success" ]; then
            echo "✅ All CI jobs passed!"
          else
            echo "❌ Some CI jobs failed"
            exit 1
          fi`;

  // Create release workflow
  const featuresText = pkg.features.map(f => `          - ${f}`).join('\n');
  
  const releaseWorkflow = `name: Release

on:
  push:
    tags: ["v*"]
  workflow_dispatch:
    inputs:
      dry_run:
        description: "Dry run (test without publishing)"
        required: false
        default: "false"
        type: boolean

env:
  NODE_VERSION: 20

jobs:
  release:
    name: Release & Publish
    runs-on: ubuntu-latest
    environment: release
    permissions:
      contents: write
    outputs:
      version: \${{ steps.version.outputs.version }}
      go_version: \${{ steps.version.outputs.go_version }}
      is_prerelease: \${{ steps.version.outputs.is_prerelease }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          registry-url: "https://registry.npmjs.org"

      - name: Install dependencies
        run: bun install

      - name: Extract version information
        id: version
        run: |
          if [ "\${{ github.event_name }}" = "workflow_dispatch" ]; then
            # For manual dispatch, use package.json version
            TAG=$(node -p "require('./package.json').version")
          else
            # For tag push, extract from tag
            TAG=\${GITHUB_REF#refs/tags/v}
          fi
          
          echo "version=$TAG" >> $GITHUB_OUTPUT

          # Get Go source version
          GO_VERSION=$(node -p "require('./package.json').goSourceVersion || 'unknown'")
          echo "go_version=$GO_VERSION" >> $GITHUB_OUTPUT

          # Check if it's a prerelease (contains -alpha, -beta, -rc, -tsport, etc.)
          if [[ "$TAG" == *"-"* ]]; then
            echo "is_prerelease=true" >> $GITHUB_OUTPUT
          else
            echo "is_prerelease=false" >> $GITHUB_OUTPUT
          fi

      - name: Verify package version matches tag
        if: github.event_name == 'push'
        run: |
          PACKAGE_VERSION=$(node -p "require('./package.json').version")
          TAG_VERSION="\${{ steps.version.outputs.version }}"
          if [ "$PACKAGE_VERSION" != "$TAG_VERSION" ]; then
            echo "❌ Package version ($PACKAGE_VERSION) does not match tag ($TAG_VERSION)"
            exit 1
          fi
          echo "✅ Version validation passed"

      - name: Run validation tests
        run: |
          ${lintScript}
          ${buildScript}
          ${testScript}

      - name: Dry run check
        if: inputs.dry_run == 'true'
        run: |
          echo "🏃 DRY RUN MODE - Not publishing to NPM or creating release"
          npm pack --dry-run
          echo "✅ Package would be published successfully"
          echo "✅ Would create GitHub release v\${{ steps.version.outputs.version }}"

      - name: Publish to NPM
        if: inputs.dry_run != 'true'
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_AUTH_SECRET }}
        run: |
          echo "📦 Publishing ${pkg.packageName}@\${{ steps.version.outputs.version }}"
          npm publish --access public

      - name: Create release tarball
        if: inputs.dry_run != 'true'
        run: |
          tar -czf ${pkg.name}-\${{ steps.version.outputs.version }}.tar.gz \\
            dist/ package.json README.md LICENSE CHANGELOG.md

      - name: Generate release notes
        if: inputs.dry_run != 'true'
        id: release-notes
        run: |
          cat > release_notes.md << EOF
          ## ${pkg.packageName} v\${{ steps.version.outputs.version }}

          ${pkg.description}

          ### 📦 Installation
          \\\`\\\`\\\`bash
          npm install ${pkg.packageName}@\${{ steps.version.outputs.version }}
          # or
          bun add ${pkg.packageName}@\${{ steps.version.outputs.version }}
          \\\`\\\`\\\`

          ### 📋 Version Information
          - **TSPort Version**: \${{ steps.version.outputs.version }}
          - **Go Source Version**: \${{ steps.version.outputs.go_version }}
          - **Package**: [${pkg.packageName}](${pkg.npmUrl})

          ### ✨ Features
${featuresText}

          ### 🔗 Compatibility
          - ✅ 100% API compatibility with Go source version
          - ✅ All tests passing across platforms
          - ✅ TypeScript strict mode compliant
          - ✅ Node.js 18+ support
          - ✅ ESM module format with tree-shaking

          ### 📚 Documentation
          - [API Documentation](${pkg.docsUrl})
          - [GitHub Repository](${pkg.repoUrl})
          - [NPM Package](${pkg.npmUrl})

          ---

          Published successfully to NPM! 🎉
          
          See the [commit history](${pkg.repoUrl}/commits/v\${{ steps.version.outputs.version }}) for detailed changes.
          EOF

      - name: Create GitHub Release
        if: inputs.dry_run != 'true'
        uses: softprops/action-gh-release@v2
        with:
          name: "Release v\${{ steps.version.outputs.version }}"
          body_path: release_notes.md
          files: ${pkg.name}-\${{ steps.version.outputs.version }}.tar.gz
          prerelease: \${{ steps.version.outputs.is_prerelease }}
          generate_release_notes: true
          tag_name: \${{ github.event_name == 'workflow_dispatch' && format('v{0}', steps.version.outputs.version) || github.ref_name }}
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

  // Write workflows
  await writeFile(join(workflowsDir, 'ci.yml'), ciWorkflow);
  await writeFile(join(workflowsDir, 'release.yml'), releaseWorkflow);

  console.log(`✅ Created workflows for ${pkg.name}`);
}

// Main execution
async function main() {
  console.log('🚀 Replicating optimized dual workflow setup...\n');

  for (const pkg of packages) {
    try {
      await createWorkflows(pkg);
    } catch (error) {
      console.error(`❌ Failed to create workflows for ${pkg.name}:`, error);
    }
  }

  console.log('\n✅ Workflow replication complete!');
}

main().catch(console.error);