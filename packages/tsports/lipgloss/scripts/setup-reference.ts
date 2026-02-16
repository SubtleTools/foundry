#!/usr/bin/env bun

/**
 * Post-template setup script for Go reference cloning and Git setup
 * This runs after Moon template generation to set up the Go reference
 */

import { $ } from 'bun';
import { existsSync, writeFileSync } from 'fs';

async function main() {
  const goRepo =
    process.env.GO_REPO || process.argv[2] || 'https://github.com/charmbracelet/lipgloss';

  console.log('🚀 Setting up TSports lipgloss package...');
  console.log(`   Go Repository: ${goRepo}`);
  console.log('');

  await cloneGoReference(goRepo);
  await updateGitIgnore();

  console.log('');
  console.log('✅ Setup completed successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Analyze the Go codebase in test/automation/reference/');
  console.log('2. The TypeScript port is already implemented in src/');
  console.log('3. Run compatibility tests with `bun run test:compatibility`');
  console.log('4. Run `moon run test` to verify everything works');
  console.log('5. Build with `moon run build`');
  console.log('');
  console.log('Happy porting! 🎉');
}

async function cloneGoReference(goRepo: string) {
  console.log('📦 Cloning Go reference implementation...');

  try {
    // Check if reference already exists (lipgloss already has test/automation/reference)
    if (existsSync('test/automation/reference')) {
      console.log('   Reference already exists at test/automation/reference/, updating...');
      await $`cd test/automation/reference && git pull`;
      console.log('   ✓ Updated Go reference');
    } else {
      // Create directory structure and clone
      await $`mkdir -p test/automation`;
      await $`cd test/automation && git clone ${goRepo} reference`;
      console.log('   ✓ Cloned Go reference to test/automation/reference/');
    }
  } catch (error) {
    console.error('   ⚠️  Failed to clone/update Go reference:', error);
    console.log('   You can manually clone it later with:');
    console.log(`   git clone ${goRepo} test/automation/reference`);
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
test/results/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Go reference (large)
test/automation/reference/.git/
test/reference/.git/

# Temp files
*.tmp
*.temp
*_temp.*
*_output.*
`;

  if (!existsSync('.gitignore')) {
    writeFileSync('.gitignore', gitignoreContent);
    console.log('📄 Created .gitignore');
  } else {
    console.log('📄 .gitignore already exists, skipping...');
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
