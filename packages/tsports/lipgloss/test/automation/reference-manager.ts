#!/usr/bin/env bun

/**
 * Reference Manager for Lipgloss Go Repository
 *
 * Manages the Git submodule integration with the official Go Lipgloss repository,
 * handles version tracking, and applies necessary patches for test compatibility.
 */

import { exec, execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface VersionInfo {
  version: string;
  commit: string;
  date: string;
  compatible: boolean;
}

interface PatchInfo {
  name: string;
  description: string;
  files: string[];
  applied: boolean;
}

export class ReferenceManager {
  private projectRoot: string;
  private referencePath: string;
  private versionsPath: string;
  private patchesPath: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.referencePath = join(projectRoot, 'test/automation/reference');
    this.versionsPath = join(projectRoot, 'test/automation/versions.json');
    this.patchesPath = join(projectRoot, 'test/automation/patches');
  }

  /**
   * Initialize the Git submodule for the Go reference
   */
  async initializeReference(): Promise<void> {
    console.log('🚀 Initializing Go Lipgloss reference...');

    // Ensure automation directory exists
    const automationDir = dirname(this.referencePath);
    if (!existsSync(automationDir)) {
      mkdirSync(automationDir, { recursive: true });
    }

    // Check if submodule already exists
    if (existsSync(this.referencePath)) {
      console.log('📁 Reference directory already exists');
      await this.updateReference();
      return;
    }

    try {
      // Clone directly instead of using submodule for simplicity
      console.log('📥 Cloning Go Lipgloss repository...');
      execSync(`git clone https://github.com/charmbracelet/lipgloss.git ${this.referencePath}`, {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });

      console.log('✅ Reference initialized successfully');

      // Apply necessary patches
      await this.applyPatches();

      // Record current version
      await this.recordCurrentVersion();
    } catch (error) {
      console.error('❌ Failed to initialize reference:', error);
      throw error;
    }
  }

  /**
   * Update the reference to the latest version
   */
  async updateReference(): Promise<VersionInfo> {
    console.log('🔄 Updating Go Lipgloss reference...');

    try {
      // Fetch latest changes
      execSync('git fetch origin', {
        cwd: this.referencePath,
        stdio: 'inherit',
      });

      // Get latest version tag
      const latestTag = execSync('git describe --tags --abbrev=0', {
        cwd: this.referencePath,
        encoding: 'utf-8',
      }).trim();

      console.log(`🏷️  Latest version: ${latestTag}`);

      // Check if we're already on the latest version
      const currentCommit = execSync('git rev-parse HEAD', {
        cwd: this.referencePath,
        encoding: 'utf-8',
      }).trim();

      const latestCommit = execSync(`git rev-parse ${latestTag}`, {
        cwd: this.referencePath,
        encoding: 'utf-8',
      }).trim();

      if (currentCommit === latestCommit) {
        console.log('✅ Already on latest version');
        return await this.getCurrentVersionInfo();
      }

      // Checkout latest version
      execSync(`git checkout ${latestTag}`, {
        cwd: this.referencePath,
        stdio: 'inherit',
      });

      // Re-apply patches
      await this.applyPatches();

      // Record version info
      const versionInfo = await this.recordCurrentVersion();

      console.log(`✅ Updated to version ${versionInfo.version}`);
      return versionInfo;
    } catch (error) {
      console.error('❌ Failed to update reference:', error);
      throw error;
    }
  }

  /**
   * Apply necessary patches for test compatibility
   */
  async applyPatches(): Promise<void> {
    console.log('🔧 Applying compatibility patches...');

    const patches: PatchInfo[] = [
      {
        name: 'force-color-output',
        description: 'Force color output in non-TTY environments',
        files: ['color.go', 'renderer.go'],
        applied: false,
      },
      {
        name: 'disable-terminal-detection',
        description: 'Disable dynamic terminal detection for consistent testing',
        files: ['lipgloss.go'],
        applied: false,
      },
    ];

    for (const patch of patches) {
      try {
        await this.applyPatch(patch);
        patch.applied = true;
        console.log(`✅ Applied patch: ${patch.name}`);
      } catch (error) {
        console.warn(`⚠️  Failed to apply patch ${patch.name}:`, error);
      }
    }

    // Save patch status
    const patchStatusPath = join(this.patchesPath, 'applied-patches.json');
    if (!existsSync(this.patchesPath)) {
      mkdirSync(this.patchesPath, { recursive: true });
    }
    writeFileSync(patchStatusPath, JSON.stringify(patches, null, 2));
  }

  /**
   * Apply a specific patch
   */
  private async applyPatch(patch: PatchInfo): Promise<void> {
    switch (patch.name) {
      case 'force-color-output':
        await this.applyForceColorOutputPatch();
        break;
      case 'disable-terminal-detection':
        await this.applyDisableTerminalDetectionPatch();
        break;
      default:
        throw new Error(`Unknown patch: ${patch.name}`);
    }
  }

  /**
   * Patch to force color output in non-TTY environments
   */
  private async applyForceColorOutputPatch(): Promise<void> {
    const colorGoPath = join(this.referencePath, 'color.go');
    if (!existsSync(colorGoPath)) return;

    let content = readFileSync(colorGoPath, 'utf-8');

    // Add a init function to force TrueColor profile
    const initPatch = `
func init() {
	// Force TrueColor profile for testing
	colorProfile = TrueColor
	hasDarkBackground = false
}
`;

    if (!content.includes('Force TrueColor profile for testing')) {
      content = content.replace(/^package lipgloss/, `package lipgloss${initPatch}`);
      writeFileSync(colorGoPath, content);
    }
  }

  /**
   * Patch to disable dynamic terminal detection
   */
  private async applyDisableTerminalDetectionPatch(): Promise<void> {
    const lipglossGoPath = join(this.referencePath, 'lipgloss.go');
    if (!existsSync(lipglossGoPath)) return;

    let content = readFileSync(lipglossGoPath, 'utf-8');

    // Replace any dynamic terminal detection with static values
    const patches = [
      {
        search: /colorProfile\s*=.*termenv\.ColorProfile\(\)/g,
        replace: 'colorProfile = TrueColor',
      },
      {
        search: /hasDarkBackground\s*=.*termenv\.HasDarkBackground\(\)/g,
        replace: 'hasDarkBackground = false',
      },
    ];

    let modified = false;
    for (const { search, replace } of patches) {
      if (search.test(content)) {
        content = content.replace(search, replace);
        modified = true;
      }
    }

    if (modified) {
      writeFileSync(lipglossGoPath, content);
    }
  }

  /**
   * Get current version information
   */
  async getCurrentVersionInfo(): Promise<VersionInfo> {
    try {
      const version = execSync(
        'git describe --tags --exact-match 2>/dev/null || git describe --tags',
        {
          cwd: this.referencePath,
          encoding: 'utf-8',
        }
      ).trim();

      const commit = execSync('git rev-parse HEAD', {
        cwd: this.referencePath,
        encoding: 'utf-8',
      }).trim();

      const date = execSync('git show -s --format=%ci HEAD', {
        cwd: this.referencePath,
        encoding: 'utf-8',
      }).trim();

      return {
        version,
        commit,
        date,
        compatible: true, // Assume compatible after patching
      };
    } catch (error) {
      throw new Error(`Failed to get version info: ${error}`);
    }
  }

  /**
   * Record current version information
   */
  private async recordCurrentVersion(): Promise<VersionInfo> {
    const versionInfo = await this.getCurrentVersionInfo();

    // Load existing versions
    let versions: VersionInfo[] = [];
    if (existsSync(this.versionsPath)) {
      versions = JSON.parse(readFileSync(this.versionsPath, 'utf-8'));
    }

    // Add current version if not already recorded
    const existingIndex = versions.findIndex((v) => v.commit === versionInfo.commit);
    if (existingIndex >= 0) {
      versions[existingIndex] = versionInfo;
    } else {
      versions.push(versionInfo);
    }

    // Sort by date (newest first)
    versions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Save versions
    writeFileSync(this.versionsPath, JSON.stringify(versions, null, 2));

    return versionInfo;
  }

  /**
   * List all tracked versions
   */
  getTrackedVersions(): VersionInfo[] {
    if (!existsSync(this.versionsPath)) {
      return [];
    }
    return JSON.parse(readFileSync(this.versionsPath, 'utf-8'));
  }

  /**
   * Switch to a specific version
   */
  async switchToVersion(version: string): Promise<void> {
    console.log(`🔄 Switching to version ${version}...`);

    try {
      execSync(`git checkout ${version}`, {
        cwd: this.referencePath,
        stdio: 'inherit',
      });

      // Re-apply patches
      await this.applyPatches();

      console.log(`✅ Switched to version ${version}`);
    } catch (error) {
      console.error(`❌ Failed to switch to version ${version}:`, error);
      throw error;
    }
  }

  /**
   * Check if reference needs updating
   */
  async checkForUpdates(): Promise<boolean> {
    try {
      // Fetch latest
      execSync('git fetch origin', {
        cwd: this.referencePath,
        stdio: 'pipe',
      });

      // Check if HEAD is behind origin
      const status = execSync('git status -uno', {
        cwd: this.referencePath,
        encoding: 'utf-8',
      });

      return status.includes('Your branch is behind');
    } catch (error) {
      console.warn('Warning: Could not check for updates:', error);
      return false;
    }
  }

  /**
   * Generate version compatibility report
   */
  generateCompatibilityReport(): string {
    const versions = this.getTrackedVersions();

    let report = '# Lipgloss Version Compatibility Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    if (versions.length === 0) {
      report += 'No versions tracked yet.\n';
      return report;
    }

    report += `## Tracked Versions (${versions.length})\n\n`;
    report += '| Version | Date | Commit | Compatible |\n';
    report += '|---------|------|--------|-----------|\n';

    for (const version of versions) {
      const compatible = version.compatible ? '✅' : '❌';
      const shortCommit = version.commit.substring(0, 8);
      const date = new Date(version.date).toLocaleDateString();

      report += `| ${version.version} | ${date} | ${shortCommit} | ${compatible} |\n`;
    }

    report += '\n## Current Status\n\n';
    const current = versions[0];
    if (current) {
      report += `- **Current Version**: ${current.version}\n`;
      report += `- **Commit**: ${current.commit}\n`;
      report += `- **Date**: ${current.date}\n`;
      report += `- **Compatible**: ${current.compatible ? 'Yes' : 'No'}\n`;
    }

    return report;
  }
}

// CLI usage
if (require.main === module) {
  const command = process.argv[2];
  const manager = new ReferenceManager();

  switch (command) {
    case 'init':
      manager.initializeReference();
      break;
    case 'update':
      manager.updateReference();
      break;
    case 'check':
      manager.checkForUpdates().then((hasUpdates) => {
        if (hasUpdates) {
          console.log('🔔 Updates available');
          process.exit(1);
        } else {
          console.log('✅ Up to date');
          process.exit(0);
        }
      });
      break;
    case 'versions': {
      const versions = manager.getTrackedVersions();
      console.log(JSON.stringify(versions, null, 2));
      break;
    }
    case 'report': {
      const report = manager.generateCompatibilityReport();
      console.log(report);
      break;
    }
    case 'switch': {
      const version = process.argv[3];
      if (!version) {
        console.error('Usage: reference-manager.ts switch <version>');
        process.exit(1);
      }
      manager.switchToVersion(version);
      break;
    }
    default:
      console.log('Usage: reference-manager.ts <init|update|check|versions|report|switch>');
      process.exit(1);
  }
}
