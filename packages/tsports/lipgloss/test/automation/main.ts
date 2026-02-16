#!/usr/bin/env bun

/**
 * Main Automation Script for Lipgloss Compatibility Testing
 *
 * Orchestrates the complete test automation pipeline from reference management
 * to test case generation and execution.
 */

import { existsSync } from 'fs';
import { join } from 'path';
import { CaseGenerator } from './case-generator';
import { DependencyTreeGenerator } from './generate-dependency-tree';
import { ReferenceManager } from './reference-manager';
import { TestRunner } from './test-runner';

interface AutomationOptions {
  command: string;
  updateReference?: boolean;
  generateCases?: boolean;
  runTests?: boolean;
  categories?: string[];
  verbose?: boolean;
  failFast?: boolean;
}

export class LipglossAutomation {
  private projectRoot: string;
  private referencePath: string;
  private casesPath: string;
  private resultsPath: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.referencePath = join(projectRoot, 'test/automation/reference');
    this.casesPath = join(projectRoot, 'test/cases');
    this.resultsPath = join(projectRoot, 'test/results');
  }

  /**
   * Run the complete automation pipeline
   */
  async run(options: AutomationOptions): Promise<void> {
    console.log('🚀 Starting Lipgloss Test Automation Pipeline');
    console.log('===============================================');

    try {
      switch (options.command) {
        case 'init':
          await this.initialize();
          break;
        case 'update':
          await this.updateEverything();
          break;
        case 'generate':
          await this.generateTestCases();
          break;
        case 'test':
          await this.runCompatibilityTests(options);
          break;
        case 'full':
          await this.runFullPipeline(options);
          break;
        case 'check':
          await this.checkForUpdates();
          break;
        default:
          this.showHelp();
      }
    } catch (error) {
      console.error('❌ Pipeline failed:', error);
      process.exit(1);
    }
  }

  /**
   * Initialize the automation system
   */
  private async initialize(): Promise<void> {
    console.log('🔧 Initializing automation system...');

    // Initialize reference manager
    const refManager = new ReferenceManager(this.projectRoot);
    await refManager.initializeReference();

    // Generate initial dependency tree
    await this.generateDependencyTree();

    // Generate initial test cases
    await this.generateTestCases();

    console.log('✅ Automation system initialized successfully!');
    console.log('\nNext steps:');
    console.log('  bun run test:compatibility          # Run all compatibility tests');
    console.log('  bun run test:update                  # Update reference and regenerate');
    console.log('  bun run test:check                   # Check for updates');
  }

  /**
   * Update everything - reference, dependency tree, and test cases
   */
  private async updateEverything(): Promise<void> {
    console.log('🔄 Updating all components...');

    // Update reference
    const refManager = new ReferenceManager(this.projectRoot);
    const versionInfo = await refManager.updateReference();
    console.log(`📦 Updated to version: ${versionInfo.version}`);

    // Regenerate dependency tree
    await this.generateDependencyTree();

    // Regenerate test cases
    await this.generateTestCases();

    console.log('✅ All components updated successfully!');
  }

  /**
   * Generate dependency tree from Go reference
   */
  private async generateDependencyTree(): Promise<void> {
    console.log('🌳 Generating dependency tree...');

    if (!existsSync(this.referencePath)) {
      throw new Error('Reference not initialized. Run "init" command first.');
    }

    const generator = new DependencyTreeGenerator(this.referencePath);
    const dependencyTreePath = join(this.projectRoot, 'test/dependency-tree.json');
    await generator.saveTo(dependencyTreePath);

    console.log('✅ Dependency tree generated successfully!');
  }

  /**
   * Generate test cases
   */
  private async generateTestCases(): Promise<void> {
    console.log('🏗️  Generating test cases...');

    if (!existsSync(this.referencePath)) {
      throw new Error('Reference not initialized. Run "init" command first.');
    }

    const generator = new CaseGenerator(this.referencePath, this.casesPath);

    // Load dependency graph
    const graphPath = join(this.projectRoot, 'test/automation/dependency-graph.json');
    if (existsSync(graphPath)) {
      generator.loadDependencyGraph(graphPath);
    }

    const cases = await generator.generateAllCases();
    console.log(`✅ Generated ${cases.length} test cases successfully!`);
  }

  /**
   * Run compatibility tests
   */
  private async runCompatibilityTests(options: AutomationOptions): Promise<void> {
    console.log('🧪 Running compatibility tests...');

    if (!existsSync(this.casesPath)) {
      throw new Error('Test cases not generated. Run "generate" command first.');
    }

    const runner = new TestRunner(this.casesPath, this.resultsPath);

    // Load dependency graph
    const graphPath = join(this.projectRoot, 'test/dependency-tree.json');
    if (existsSync(graphPath)) {
      runner.loadDependencyGraph(graphPath);
    }

    const runOptions: {
      categories?: string[];
      verbose?: boolean;
      failFast?: boolean;
      generateOutputs: boolean;
      timeout: number;
    } = {
      generateOutputs: true,
      timeout: 30000,
    };
    
    if (options.categories) runOptions.categories = options.categories;
    if (options.verbose) runOptions.verbose = options.verbose;
    if (options.failFast) runOptions.failFast = options.failFast;

    const testRun = await runner.runTests(runOptions);

    if (testRun.passed === testRun.totalCases) {
      console.log('🎉 All tests passed! 100% compatibility achieved!');
    } else {
      console.log(`⚠️  ${testRun.failed} tests failed. Check the report for details.`);
      process.exit(1);
    }
  }

  /**
   * Run the complete pipeline
   */
  private async runFullPipeline(options: AutomationOptions): Promise<void> {
    console.log('🔄 Running full automation pipeline...');

    // Check for updates
    await this.checkForUpdates();

    // Update if needed
    if (options.updateReference) {
      await this.updateEverything();
    }

    // Generate cases if needed
    if (options.generateCases || !existsSync(this.casesPath)) {
      await this.generateTestCases();
    }

    // Run tests
    if (options.runTests) {
      await this.runCompatibilityTests(options);
    }

    console.log('✅ Full pipeline completed successfully!');
  }

  /**
   * Check for updates
   */
  private async checkForUpdates(): Promise<void> {
    console.log('🔍 Checking for updates...');

    if (!existsSync(this.referencePath)) {
      console.log('⚠️  Reference not initialized. Run "init" command first.');
      return;
    }

    const refManager = new ReferenceManager(this.projectRoot);
    const hasUpdates = await refManager.checkForUpdates();

    if (hasUpdates) {
      console.log('🔔 Updates available for Go reference!');
      console.log('   Run "bun run test:update" to update');
    } else {
      console.log('✅ Reference is up to date');
    }
  }

  /**
   * Show help information
   */
  private showHelp(): void {
    console.log(`
Lipgloss Test Automation System

Usage: bun run test:automation <command> [options]

Commands:
  init      Initialize the automation system
  update    Update reference and regenerate all test components
  generate  Generate test cases from Go reference
  test      Run compatibility tests
  full      Run complete pipeline
  check     Check for reference updates

Options:
  --categories <list>    Run tests for specific categories (comma-separated)
  --verbose             Enable verbose output
  --fail-fast           Stop on first test failure
  --update-reference    Update reference before running
  --generate-cases      Generate test cases before running
  --run-tests           Run tests as part of pipeline

Examples:
  bun run test:automation init
  bun run test:automation test --categories=basic,color --verbose
  bun run test:automation full --update-reference --run-tests
  bun run test:automation check

For more information, see: test/automation/README.md
`);
  }

  /**
   * Get system status
   */
  async getStatus(): Promise<{
    referenceInitialized: boolean;
    dependencyTreeExists: boolean;
    testCasesGenerated: boolean;
    lastUpdate?: string;
  }> {
    return {
      referenceInitialized: existsSync(this.referencePath),
      dependencyTreeExists: existsSync(join(this.projectRoot, 'test/dependency-tree.json')),
      testCasesGenerated: existsSync(this.casesPath),
      // lastUpdate omitted since it's optional and we don't have the data yet
    };
  }
}

// CLI usage
if (import.meta.main) {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  const options: AutomationOptions = {
    command,
    updateReference: args.includes('--update-reference'),
    generateCases: args.includes('--generate-cases'),
    runTests: args.includes('--run-tests'),
    verbose: args.includes('--verbose'),
    failFast: args.includes('--fail-fast'),
  };

  // Parse categories
  const categoriesIndex = args.indexOf('--categories');
  if (categoriesIndex >= 0) {
    const categoriesArg = args[categoriesIndex + 1];
    if (categoriesArg) {
      options.categories = categoriesArg.split(',');
    }
  }

  const automation = new LipglossAutomation();
  automation.run(options).catch((error) => {
    console.error('❌ Automation failed:', error);
    process.exit(1);
  });
}
