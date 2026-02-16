#!/usr/bin/env bun

/**
 * Automated Dependency Tree Generator for Lipgloss
 *
 * Analyzes the Go reference implementation and generates a curated
 * dependency tree specifically optimized for test case execution ordering.
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ApiMethod {
  name: string;
  category: string;
  complexity: number;
  dependencies: string[];
  description: string;
  file?: string;
  isPublic: boolean;
}

interface DependencyTree {
  metadata: {
    version: string;
    generated: string;
    description: string;
    source: string;
    totalMethods: number;
  };
  categories: Record<
    string,
    {
      description: string;
      priority: number;
      methods: string[];
    }
  >;
  dependencies: Record<
    string,
    {
      category: string;
      complexity: number;
      dependencies: string[];
      description: string;
    }
  >;
  executionOrder: string[];
  testCaseMapping: Record<string, Record<string, string[]>>;
}

export class DependencyTreeGenerator {
  private referencePath: string;
  private apiMethods: Map<string, ApiMethod> = new Map();
  private methodCategories: Record<string, string[]> = {
    basic: [],
    color: [],
    layout: [],
    border: [],
    styling: [],
    component: [],
  };

  constructor(referencePath: string) {
    this.referencePath = referencePath;
  }

  /**
   * Generate complete dependency tree
   */
  async generate(): Promise<DependencyTree> {
    console.log('🔄 Generating automated dependency tree...');

    // Parse Go source files
    await this.parseGoSource();

    // Categorize methods
    this.categorizeApiMethods();

    // Analyze dependencies
    this.analyzeDependencies();

    // Generate execution order
    const executionOrder = this.generateExecutionOrder();

    // Generate test case mappings
    const testCaseMapping = this.generateTestCaseMappings();

    // Build final tree structure
    const tree: DependencyTree = {
      metadata: {
        version: '1.0.0',
        generated: new Date().toISOString(),
        description: 'Lipgloss API dependency tree for test execution ordering',
        source: 'Automated analysis of Go reference implementation',
        totalMethods: this.apiMethods.size,
      },
      categories: this.buildCategoryInfo(),
      dependencies: this.buildDependencyInfo(),
      executionOrder,
      testCaseMapping,
    };

    return tree;
  }

  /**
   * Parse Go source files to extract API methods
   */
  private async parseGoSource(): Promise<void> {
    console.log('📖 Parsing Go source files...');

    const goFiles = this.findGoFiles(this.referencePath);

    for (const filePath of goFiles) {
      await this.parseGoFile(filePath);
    }

    console.log(`📊 Found ${this.apiMethods.size} API methods`);
  }

  /**
   * Parse individual Go file
   */
  private async parseGoFile(filePath: string): Promise<void> {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(this.referencePath + '/', '');

    // Extract exported functions
    const functionPattern = /^func\s+([A-Z][a-zA-Z0-9]*)\s*\(/gm;
    let match;

    while ((match = functionPattern.exec(content)) !== null) {
      const methodName = match[1];
      if (!methodName) continue;
      
      if (this.isRelevantMethod(methodName)) {
        this.apiMethods.set(methodName, {
          name: methodName,
          category: this.inferCategory(methodName, relativePath),
          complexity: this.calculateComplexity(content, methodName),
          dependencies: [],
          description: this.generateDescription(methodName),
          file: relativePath,
          isPublic: true,
        });
      }
    }

    // Extract exported struct methods
    const structMethodPattern =
      /^func\s+\([^)]*\s+\*?([A-Z][a-zA-Z0-9]*)\)\s+([A-Z][a-zA-Z0-9]*)\s*\(/gm;
    while ((match = structMethodPattern.exec(content)) !== null) {
      const structName = match[1];
      const methodName = match[2];
      if (!structName || !methodName) continue;

      if (this.isRelevantMethod(methodName) && structName === 'Style') {
        this.apiMethods.set(methodName, {
          name: methodName,
          category: this.inferCategory(methodName, relativePath),
          complexity: this.calculateComplexity(content, methodName),
          dependencies: [],
          description: this.generateDescription(methodName),
          file: relativePath,
          isPublic: true,
        });
      }
    }
  }

  /**
   * Check if method is relevant for our API
   */
  private isRelevantMethod(methodName: string): boolean {
    // Exclude test helpers, internal methods, etc.
    const excluded = ['Test', 'Benchmark', 'Example', 'Helper', 'Main', 'Init', 'String', 'Error'];

    return !excluded.some((prefix) => methodName.startsWith(prefix)) && methodName.length > 1;
  }

  /**
   * Infer method category from name and file path
   */
  private inferCategory(methodName: string, filePath: string): string {
    // Basic API methods
    if (['NewStyle', 'Render', 'Copy', 'Inherit'].includes(methodName)) {
      return 'basic';
    }

    // Color methods
    if (
      [
        'Foreground',
        'Background',
        'ColorProfile',
        'SetColorProfile',
        'GetColorProfile',
        'HasDarkBackground',
        'SetHasDarkBackground',
      ].includes(methodName) ||
      filePath.includes('color')
    ) {
      return 'color';
    }

    // Layout methods
    if (
      ['Width', 'Height', 'MaxWidth', 'MaxHeight', 'Padding', 'Margin', 'Align'].some((keyword) =>
        methodName.includes(keyword)
      )
    ) {
      return 'layout';
    }

    // Border methods
    if (methodName.includes('Border') || filePath.includes('border')) {
      return 'border';
    }

    // Styling methods
    if (
      [
        'Bold',
        'Italic',
        'Underline',
        'Strikethrough',
        'Reverse',
        'Blink',
        'Faint',
        'Transform',
        'Inline',
      ].includes(methodName)
    ) {
      return 'styling';
    }

    // Component methods
    if (
      ['Join', 'Place', 'Table', 'List', 'Tree'].some((keyword) => methodName.includes(keyword)) ||
      ['table/', 'list/', 'tree/', 'join'].some((path) => filePath.includes(path))
    ) {
      return 'component';
    }

    return 'basic'; // Default fallback
  }

  /**
   * Calculate method complexity
   */
  private calculateComplexity(content: string, methodName: string): number {
    const methodStart =
      content.indexOf(`func`) + content.slice(content.indexOf(`func`)).indexOf(methodName);
    const methodBody = this.extractMethodBody(content, methodStart);

    let complexity = 1;

    // Count complexity indicators
    complexity += (methodBody.match(/if\s+/g) || []).length;
    complexity += (methodBody.match(/for\s+/g) || []).length * 2;
    complexity += (methodBody.match(/switch\s+/g) || []).length;
    complexity += (methodBody.match(/case\s+/g) || []).length * 0.5;
    complexity += (methodBody.match(/range\s+/g) || []).length;

    return Math.max(1, Math.round(complexity));
  }

  /**
   * Extract method body for analysis
   */
  private extractMethodBody(content: string, startIndex: number): string {
    let braceCount = 0;
    let inMethod = false;
    let body = '';

    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];

      if (char === '{') {
        braceCount++;
        inMethod = true;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0 && inMethod) {
          break;
        }
      }

      if (inMethod) {
        body += char;
      }
    }

    return body;
  }

  /**
   * Generate human-readable description
   */
  private generateDescription(methodName: string): string {
    const descriptions: Record<string, string> = {
      NewStyle: 'Creates a new style instance',
      Render: 'Renders content with applied styles',
      Copy: 'Creates a copy of the style',
      Inherit: 'Inherits properties from another style',
      Foreground: 'Sets foreground color',
      Background: 'Sets background color',
      Width: 'Sets content width',
      Height: 'Sets content height',
      Padding: 'Sets padding on all sides',
      Margin: 'Sets margin on all sides',
      Border: 'Sets border style',
      Bold: 'Sets bold text style',
      Italic: 'Sets italic text style',
      Underline: 'Sets underline text style',
      Align: 'Sets content alignment',
    };

    return descriptions[methodName] || `${methodName} method`;
  }

  /**
   * Categorize API methods
   */
  private categorizeApiMethods(): void {
    for (const [name, method] of Array.from(this.apiMethods.entries())) {
      if (method && this.methodCategories[method.category]) {
        const categoryArray = this.methodCategories[method.category];
        if (categoryArray) {
          categoryArray.push(name);
        }
      }
    }
  }

  /**
   * Analyze dependencies between methods
   */
  private analyzeDependencies(): void {
    console.log('🔍 Analyzing method dependencies...');

    // Define explicit dependencies based on API knowledge
    const explicitDependencies: Record<string, string[]> = {
      Render: ['NewStyle'],
      Copy: ['NewStyle'],
      Inherit: ['NewStyle', 'Copy'],
      Foreground: ['NewStyle'],
      Background: ['NewStyle'],
      Width: ['NewStyle'],
      Height: ['NewStyle'],
      MaxWidth: ['Width'],
      MaxHeight: ['Height'],
      Padding: ['Width', 'Height'],
      Margin: ['Width', 'Height'],
      Align: ['Width', 'Height'],
      AlignHorizontal: ['Width'],
      AlignVertical: ['Height'],
      Border: ['Width', 'Height'],
      BorderForeground: ['Border', 'Foreground'],
      BorderBackground: ['Border', 'Background'],
      Bold: ['NewStyle'],
      Italic: ['NewStyle'],
      Underline: ['NewStyle'],
      Strikethrough: ['NewStyle'],
      Reverse: ['Foreground', 'Background'],
      Transform: ['NewStyle', 'Render'],
      JoinHorizontal: ['Render', 'Width', 'Align'],
      JoinVertical: ['Render', 'Height', 'Align'],
      Place: ['Width', 'Height', 'Align'],
    };

    // Apply explicit dependencies
    for (const [methodName, deps] of Object.entries(explicitDependencies)) {
      const method = this.apiMethods.get(methodName);
      if (method) {
        method.dependencies = deps.filter((dep) => this.apiMethods.has(dep));
      }
    }

    // Add padding/margin specific dependencies
    const paddingMethods = ['PaddingTop', 'PaddingRight', 'PaddingBottom', 'PaddingLeft'];
    const marginMethods = ['MarginTop', 'MarginRight', 'MarginBottom', 'MarginLeft'];

    for (const method of paddingMethods) {
      if (this.apiMethods.has(method)) {
        this.apiMethods.get(method)!.dependencies = ['Padding'];
      }
    }

    for (const method of marginMethods) {
      if (this.apiMethods.has(method)) {
        this.apiMethods.get(method)!.dependencies = ['Margin'];
      }
    }
  }

  /**
   * Generate execution order based on dependencies
   */
  private generateExecutionOrder(): string[] {
    console.log('📋 Generating execution order...');

    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (methodName: string): void => {
      if (visited.has(methodName)) return;
      if (visiting.has(methodName)) return; // Circular dependency

      visiting.add(methodName);
      const method = this.apiMethods.get(methodName);

      if (method) {
        for (const dep of method.dependencies) {
          visit(dep);
        }
      }

      visiting.delete(methodName);
      visited.add(methodName);
      order.push(methodName);
    };

    // Visit methods by category priority and complexity
    const priorityOrder = ['basic', 'color', 'layout', 'border', 'styling', 'component'];

    for (const category of priorityOrder) {
      const categoryMethods = Array.from(this.apiMethods.values())
        .filter((m) => m.category === category)
        .sort((a, b) => a.complexity - b.complexity);

      for (const method of categoryMethods) {
        visit(method.name);
      }
    }

    return order;
  }

  /**
   * Generate test case mappings
   */
  private generateTestCaseMappings(): Record<string, Record<string, string[]>> {
    const mapping: Record<string, Record<string, string[]>> = {};

    // Basic test cases
    mapping.basic = {
      '001': ['NewStyle', 'Render'],
      '002': ['NewStyle', 'Foreground', 'Render'],
      '003': ['NewStyle', 'Background', 'Render'],
      '004': ['NewStyle', 'Copy'],
      '005': ['NewStyle', 'Inherit'],
    };

    // Color test cases
    mapping.color = {
      '101': ['SetColorProfile', 'GetColorProfile'],
      '102': ['HasDarkBackground', 'SetHasDarkBackground'],
      '103': ['Foreground'],
      '104': ['Background'],
      '105': ['Foreground', 'Background'],
    };

    // Layout test cases
    mapping.layout = {
      '201': ['Width'],
      '202': ['Height'],
      '203': ['Width', 'Height'],
      '204': ['Padding'],
      '205': ['Margin'],
      '206': ['Width', 'Padding'],
      '207': ['Height', 'Margin'],
      '208': ['Align'],
      '209': ['AlignHorizontal'],
      '210': ['AlignVertical'],
    };

    // Border test cases
    mapping.border = {
      '301': ['Border'],
      '302': ['BorderStyle'],
      '303': ['BorderTop', 'BorderRight', 'BorderBottom', 'BorderLeft'],
      '304': ['Border', 'BorderForeground'],
      '305': ['Border', 'BorderBackground'],
    };

    // Styling test cases
    mapping.styling = {
      '401': ['Bold'],
      '402': ['Italic'],
      '403': ['Underline'],
      '404': ['Strikethrough'],
      '405': ['Bold', 'Italic'],
      '406': ['Underline', 'Strikethrough'],
      '407': ['Reverse'],
      '408': ['Transform'],
    };

    // Component test cases
    mapping.component = {
      '501': ['JoinHorizontal'],
      '502': ['JoinVertical'],
      '503': ['PlaceHorizontal'],
      '504': ['PlaceVertical'],
      '505': ['Place'],
    };

    // Advanced combination cases
    mapping.advanced = {
      '601': [
        'NewStyle',
        'Foreground',
        'Background',
        'Border',
        'Padding',
        'Margin',
        'Width',
        'Align',
        'Render',
      ],
      '602': ['Bold', 'Italic', 'Underline', 'Foreground', 'Background'],
      '603': ['JoinHorizontal', 'JoinVertical', 'Place'],
    };

    return mapping;
  }

  /**
   * Build category information
   */
  private buildCategoryInfo(): Record<
    string,
    { description: string; priority: number; methods: string[] }
  > {
    return {
      basic: {
        description: 'Core API methods - style creation and basic rendering',
        priority: 1,
        methods: this.methodCategories.basic ?? [],
      },
      color: {
        description: 'Color management and application',
        priority: 2,
        methods: this.methodCategories.color ?? [],
      },
      layout: {
        description: 'Dimensions, padding, margins, and alignment',
        priority: 3,
        methods: this.methodCategories.layout ?? [],
      },
      border: {
        description: 'Border styles and configurations',
        priority: 4,
        methods: this.methodCategories.border ?? [],
      },
      styling: {
        description: 'Text styling and transformations',
        priority: 5,
        methods: this.methodCategories.styling ?? [],
      },
      component: {
        description: 'Complex components - tables, lists, trees',
        priority: 6,
        methods: this.methodCategories.component ?? [],
      },
    };
  }

  /**
   * Build dependency information
   */
  private buildDependencyInfo(): Record<
    string,
    { category: string; complexity: number; dependencies: string[]; description: string }
  > {
    const deps: Record<string, any> = {};

    for (const [name, method] of Array.from(this.apiMethods.entries())) {
      deps[name] = {
        category: method.category,
        complexity: method.complexity,
        dependencies: method.dependencies,
        description: method.description,
      };
    }

    return deps;
  }

  /**
   * Find all Go files in directory
   */
  private findGoFiles(dir: string): string[] {
    const files: string[] = [];

    try {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);

        try {
          const stat = require('fs').statSync(fullPath);

          if (stat.isDirectory() && !item.startsWith('.') && item !== 'testdata') {
            files.push(...this.findGoFiles(fullPath));
          } else if (item.endsWith('.go') && !item.endsWith('_test.go')) {
            files.push(fullPath);
          }
        } catch (error) {
          // Skip files we can't read
        }
      }
    } catch (error) {
      console.warn(`Could not read directory: ${dir}`);
    }

    return files;
  }

  /**
   * Save dependency tree to file
   */
  async saveTo(outputPath: string): Promise<void> {
    const tree = await this.generate();
    writeFileSync(outputPath, JSON.stringify(tree, null, 2));
    console.log(`💾 Dependency tree saved to ${outputPath}`);

    // Also save a summary
    const summaryPath = outputPath.replace('.json', '-summary.md');
    const summary = this.generateSummary(tree);
    writeFileSync(summaryPath, summary);
    console.log(`📊 Summary saved to ${summaryPath}`);
  }

  /**
   * Generate markdown summary
   */
  private generateSummary(tree: DependencyTree): string {
    let summary = '# Lipgloss Dependency Tree Summary\n\n';

    summary += `**Generated:** ${tree.metadata.generated}\n`;
    summary += `**Total Methods:** ${tree.metadata.totalMethods}\n\n`;

    summary += '## Categories\n\n';
    for (const [name, info] of Object.entries(tree.categories)) {
      summary += `### ${name.charAt(0).toUpperCase() + name.slice(1)} (Priority ${info.priority})\n`;
      summary += `${info.description}\n\n`;
      summary += `**Methods:** ${info.methods.join(', ')}\n\n`;
    }

    summary += '## Execution Order\n\n';
    summary += 'Methods should be tested in this order:\n\n';

    let counter = 1;
    for (const method of tree.executionOrder) {
      const methodInfo = tree.dependencies[method];
      summary += `${counter}. **${method}** (${methodInfo?.category}) - ${methodInfo?.description}\n`;
      counter++;
    }

    return summary;
  }
}

// CLI usage
if (require.main === module) {
  const referencePath = process.argv[2] || './test/go-reference';
  const outputPath = process.argv[3] || './test/dependency-tree.json';

  if (!existsSync(referencePath)) {
    console.error(`❌ Reference path not found: ${referencePath}`);
    process.exit(1);
  }

  const generator = new DependencyTreeGenerator(referencePath);
  generator
    .saveTo(outputPath)
    .then(() => {
      console.log('✅ Dependency tree generation complete!');
    })
    .catch((error) => {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    });
}
