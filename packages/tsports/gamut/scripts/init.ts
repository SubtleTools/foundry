#!/usr/bin/env bun

/**
 * Go-to-TypeScript Template Initialization Script
 *
 * This script initializes a new Go-to-TypeScript port using this template.
 * It takes a Go package repository URL and a TypeScript package name,
 * then sets up the project structure and configuration.
 */

import { $ } from 'bun';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface InitOptions {
  goRepo: string;
  packageName: string;
  description?: string;
  keywords?: string[];
  repositoryUrl?: string;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(`
Usage: bun run scripts/init.ts <go-repo-url> <typescript-package-name> [description]

Examples:
  bun run scripts/init.ts https://github.com/rivo/uniseg @tsports/uniseg
  bun run scripts/init.ts https://github.com/charmbracelet/lipgloss @tsports/lipgloss "Terminal styling library"

Arguments:
  go-repo-url              URL of the Go repository to port
  typescript-package-name  Name of the TypeScript package (e.g., @tsports/package-ts)
  description             Optional description of the package
`);
    process.exit(1);
  }

  const goRepo = args[0];
  const packageName = args[1];
  const description = args[2] || `TypeScript port of ${getGoPackageName(goRepo)} with 100% API compatibility`;

  // Extract information from Go repository
  const goPackageName = getGoPackageName(goRepo);
  const repositoryUrl = getRepositoryUrl(packageName);
  const keywords = generateKeywords(goPackageName);

  const options: InitOptions = {
    goRepo,
    packageName,
    description,
    keywords,
    repositoryUrl
  };

  console.log('🚀 Initializing Go-to-TypeScript template...');
  console.log(`   Go Package: ${goPackageName}`);
  console.log(`   TypeScript Package: ${packageName}`);
  console.log(`   Repository: ${repositoryUrl}`);
  console.log('');

  await initializeTemplate(options);
  await cloneGoReference(options);
  await updateGitIgnore();

  console.log('');
  console.log('✅ Template initialized successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Analyze the Go codebase in upstream/gamut/');
  console.log('2. Implement the TypeScript port in src/');
  console.log('3. Add tests that verify compatibility with Go implementation');
  console.log('4. Run `bun test` to verify everything works');
  console.log('5. Build with `bun run build`');
  console.log('');
  console.log('Happy porting! 🎉');
}

function getGoPackageName(repoUrl: string): string {
  // Extract package name from GitHub URL
  const match = repoUrl.match(/github\.com\/[^\/]+\/([^\/]+)/);
  return match ? match[1] : 'go-package';
}

function getRepositoryUrl(packageName: string): string {
  // Convert @tsports/package-ts to https://github.com/tsports/package-ts
  const cleanName = packageName.replace('@tsports/', '');
  return `https://github.com/tsports/${cleanName}`;
}

function generateKeywords(goPackageName: string): string[] {
  const keywords = [goPackageName, 'go-port', 'typescript'];

  // Add common keywords based on package name
  if (goPackageName.includes('text') || goPackageName.includes('string')) {
    keywords.push('text', 'string');
  }
  if (goPackageName.includes('ui') || goPackageName.includes('tui')) {
    keywords.push('terminal', 'ui', 'tui');
  }
  if (goPackageName.includes('style') || goPackageName.includes('color')) {
    keywords.push('styling', 'colors');
  }

  return keywords;
}

async function initializeTemplate(options: InitOptions) {
  const { goRepo, packageName, description, keywords, repositoryUrl } = options;
  const goPackageName = getGoPackageName(goRepo);

  // Template replacements
  const replacements: Record<string, string> = {
    '@tsports/gamut': packageName,
    'TypeScript port of gamut with 100% API compatibility': description!,
    'gamut': goPackageName,
    'https://github.com/muesli/gamut': goRepo,
    'https://github.com/TSports/termenv': repositoryUrl!,
    '"gamut", "go-port", "typescript"': keywords!.map(k => `"${k}"`).join(',\\n    ')
  };

  console.log('📝 Updating template files...');

  // Update all template files
  const filesToUpdate = [
    'package.json',
    'src/index.ts',
    'src/go-style.ts',
    'src/types.ts',
    'test/basic.test.ts'
  ];

  for (const file of filesToUpdate) {
    if (existsSync(file)) {
      let content = readFileSync(file, 'utf8');

      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(placeholder, 'g'), value);
      }

      writeFileSync(file, content);
      console.log(`   ✓ Updated ${file}`);
    }
  }
}

async function cloneGoReference(options: InitOptions) {
  console.log('📦 Initializing Go reference implementation...');

  const repoRoot = join(__dirname, '../../../..');
  try {
    // Upstream Go source is managed as a git submodule at the repo root
    await $`git -C ${repoRoot} submodule update --init upstream/gamut`;
    console.log('   ✓ Initialized Go reference at upstream/gamut/');
  } catch (error) {
    console.error('   ⚠️  Failed to initialize Go reference:', error);
    console.log('   You can manually initialize it from the repo root with:');
    console.log('   git submodule update --init upstream/gamut');
  }
}

async function updateGitIgnore() {
  const gitignoreContent = `# Dependencies
node_modules/
.bun/

# Build outputs
dist/
*.tsbuildinfo

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Test outputs
coverage/
.nyc_output/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`;

  writeFileSync('.gitignore', gitignoreContent);
  console.log('📄 Created .gitignore');
}

// Run the script
main().catch(error => {
  console.error('❌ Initialization failed:', error);
  process.exit(1);
});
