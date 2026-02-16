#!/usr/bin/env bun

/**
 * Dependency Analyzer for Lipgloss Go API
 *
 * Analyzes the Go source code to determine API dependencies and generate
 * a test execution order that ensures foundational features are tested first.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface APIMethod {
  name: string;
  file: string;
  dependencies: string[];
  complexity: number;
  category: 'basic' | 'layout' | 'color' | 'border' | 'component' | 'advanced';
}

export interface DependencyGraph {
  methods: APIMethod[];
  executionOrder: string[];
  categories: Record<string, string[]>;
}

export class DependencyAnalyzer {
  private referencePath: string;
  private goFiles: string[] = [];
  private apiMethods: Map<string, APIMethod> = new Map();

  constructor(referencePath: string) {
    this.referencePath = referencePath;
  }

  /**
   * Analyze the Go codebase and generate dependency graph
   */
  async analyze(): Promise<DependencyGraph> {
    console.log('🔍 Analyzing Go Lipgloss codebase...');

    // Find all Go source files
    this.discoverGoFiles();

    // Parse each file for API methods
    for (const file of this.goFiles) {
      await this.parseGoFile(file);
    }

    // Analyze dependencies between methods
    this.analyzeDependencies();

    // Generate execution order
    const executionOrder = this.generateExecutionOrder();

    // Categorize methods
    const categories = this.categorizeMethodsByComplexity();

    const graph: DependencyGraph = {
      methods: Array.from(this.apiMethods.values()),
      executionOrder,
      categories,
    };

    // Save dependency graph
    this.saveDependencyGraph(graph);

    return graph;
  }

  private discoverGoFiles(): void {
    const command = `find "${this.referencePath}" -name "*.go" -not -path "*/testdata/*" -not -name "*_test.go"`;
    const output = execSync(command, { encoding: 'utf-8' });
    this.goFiles = output
      .trim()
      .split('\n')
      .filter((f) => f.length > 0);
    console.log(`📁 Found ${this.goFiles.length} Go source files`);
  }

  private async parseGoFile(filePath: string): Promise<void> {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(this.referencePath + '/', '');

    // Parse public methods (exported functions)
    const methodPattern = /^func\s+(?:\([^)]*\)\s+)?([A-Z][a-zA-Z0-9]*)/gm;
    let match;

    while ((match = methodPattern.exec(content)) !== null) {
      const methodName = match[1];
      if (!methodName) continue;
      
      const method: APIMethod = {
        name: methodName,
        file: relativePath,
        dependencies: [],
        complexity: this.calculateComplexity(content, methodName),
        category: this.categorizeMethod(methodName, relativePath),
      };

      this.apiMethods.set(methodName, method);
    }

    // Parse struct methods
    const structMethodPattern =
      /^func\s+\([^)]*\s+\*?([A-Z][a-zA-Z0-9]*)\)\s+([A-Z][a-zA-Z0-9]*)/gm;
    while ((match = structMethodPattern.exec(content)) !== null) {
      const structName = match[1];
      const methodName = match[2];
      if (!structName || !methodName) continue;
      
      const fullName = `${structName}.${methodName}`;

      const method: APIMethod = {
        name: fullName,
        file: relativePath,
        dependencies: [],
        complexity: this.calculateComplexity(content, methodName),
        category: this.categorizeMethod(methodName, relativePath),
      };

      this.apiMethods.set(fullName, method);
    }
  }

  private calculateComplexity(content: string, methodName: string): number {
    // Extract method body
    const methodStart =
      content.indexOf(`func`) + content.slice(content.indexOf(`func`)).indexOf(methodName);
    const methodContent = this.extractMethodBody(content, methodStart);

    let complexity = 1; // Base complexity

    // Count complexity indicators
    complexity += (methodContent.match(/if\s+/g) || []).length;
    complexity += (methodContent.match(/for\s+/g) || []).length;
    complexity += (methodContent.match(/switch\s+/g) || []).length;
    complexity += (methodContent.match(/case\s+/g) || []).length * 0.5;
    complexity += (methodContent.match(/range\s+/g) || []).length;

    // Function calls indicate dependencies
    complexity += (methodContent.match(/\w+\([^)]*\)/g) || []).length * 0.2;

    return Math.round(complexity);
  }

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

  private categorizeMethod(methodName: string, filePath: string): APIMethod['category'] {
    // Basic API methods
    if (['Render', 'String', 'NewStyle'].includes(methodName)) {
      return 'basic';
    }

    // Layout methods
    if (
      ['Width', 'Height', 'Padding', 'Margin', 'Align'].some((keyword) =>
        methodName.includes(keyword)
      )
    ) {
      return 'layout';
    }

    // Color methods
    if (
      ['Color', 'Background', 'Foreground'].some((keyword) => methodName.includes(keyword)) ||
      filePath.includes('color')
    ) {
      return 'color';
    }

    // Border methods
    if (
      ['Border', 'Edge'].some((keyword) => methodName.includes(keyword)) ||
      filePath.includes('border')
    ) {
      return 'border';
    }

    // Component methods
    if (
      ['Table', 'List', 'Tree', 'Join'].some((keyword) => methodName.includes(keyword)) ||
      ['table/', 'list/', 'tree/', 'join'].some((path) => filePath.includes(path))
    ) {
      return 'component';
    }

    return 'advanced';
  }

  private analyzeDependencies(): void {
    for (const [name, method] of Array.from(this.apiMethods.entries())) {
      const filePath = join(this.referencePath, method.file);
      const content = readFileSync(filePath, 'utf-8');

      // Find method dependencies by looking for calls to other API methods
      for (const otherName of Array.from(this.apiMethods.keys())) {
        if (otherName && otherName !== name && content.includes(otherName)) {
          method.dependencies.push(otherName);
        }
      }
    }
  }

  private generateExecutionOrder(): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (methodName: string): void => {
      if (visited.has(methodName)) return;
      if (visiting.has(methodName)) return; // Circular dependency

      visiting.add(methodName);
      const method = this.apiMethods.get(methodName);

      if (method) {
        // Visit dependencies first
        for (const dep of method.dependencies) {
          visit(dep);
        }
      }

      visiting.delete(methodName);
      visited.add(methodName);
      order.push(methodName);
    };

    // Start with basic methods, then proceed by complexity
    const methodsByComplexity = Array.from(this.apiMethods.entries()).sort(
      ([, a], [, b]) => a.complexity - b.complexity
    );

    for (const [name] of methodsByComplexity) {
      visit(name);
    }

    return order;
  }

  private categorizeMethodsByComplexity(): Record<string, string[]> {
    const categories: Record<string, string[]> = {
      basic: [],
      layout: [],
      color: [],
      border: [],
      component: [],
      advanced: [],
    };

    for (const [name, method] of Array.from(this.apiMethods.entries())) {
      if (method && categories[method.category]) {
        const categoryArray = categories[method.category];
        if (categoryArray) {
          categoryArray.push(name);
        }
      }
    }

    // Sort each category by complexity
    for (const category in categories) {
      if (categories[category]) {
        categories[category].sort((a, b) => {
          const methodA = this.apiMethods.get(a);
          const methodB = this.apiMethods.get(b);
          if (!methodA || !methodB) return 0;
          return methodA.complexity - methodB.complexity;
        });
      }
    }

    return categories;
  }

  private saveDependencyGraph(graph: DependencyGraph): void {
    const outputPath = join(process.cwd(), 'test/automation/dependency-graph.json');
    writeFileSync(outputPath, JSON.stringify(graph, null, 2));
    console.log(`💾 Saved dependency graph to ${outputPath}`);

    // Also save a human-readable summary
    const summaryPath = join(process.cwd(), 'test/automation/dependency-analysis.md');
    const summary = this.generateSummaryReport(graph);
    writeFileSync(summaryPath, summary);
    console.log(`📊 Saved analysis summary to ${summaryPath}`);
  }

  private generateSummaryReport(graph: DependencyGraph): string {
    let report = '# Lipgloss API Dependency Analysis\n\n';

    report += `## Summary\n\n`;
    report += `- **Total API methods**: ${graph.methods.length}\n`;
    report += `- **Execution order determined**: ${graph.executionOrder.length} methods\n\n`;

    report += `## Methods by Category\n\n`;
    for (const [category, methods] of Object.entries(graph.categories)) {
      report += `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${methods.length} methods)\n\n`;
      for (const method of methods.slice(0, 10)) {
        // Show first 10
        const methodObj = this.apiMethods.get(method)!;
        report += `- \`${method}\` (complexity: ${methodObj.complexity})\n`;
      }
      if (methods.length > 10) {
        report += `- ... and ${methods.length - 10} more\n`;
      }
      report += '\n';
    }

    report += `## Recommended Test Execution Order\n\n`;
    report += `Tests should be executed in this order to ensure dependencies are satisfied:\n\n`;

    const categories = ['basic', 'color', 'layout', 'border', 'component', 'advanced'];
    for (const category of categories) {
      const categoryMethods = graph.categories?.[category] ?? [];
      if (categoryMethods.length > 0) {
        report += `1. **${category.charAt(0).toUpperCase() + category.slice(1)}** (${categoryMethods.length} methods)\n`;
      }
    }

    return report;
  }
}

// CLI usage
if (require.main === module) {
  const referencePath = process.argv[2] || './test/go-reference';

  if (!existsSync(referencePath)) {
    console.error(`❌ Reference path not found: ${referencePath}`);
    process.exit(1);
  }

  const analyzer = new DependencyAnalyzer(referencePath);
  analyzer
    .analyze()
    .then((graph) => {
      console.log('✅ Dependency analysis complete!');
      console.log(`📊 Found ${graph.methods.length} API methods`);
      console.log(`🎯 Generated execution order for ${graph.executionOrder.length} methods`);
    })
    .catch((error) => {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    });
}
