#!/usr/bin/env bun

/**
 * Test Case Generator for Lipgloss Compatibility Testing
 *
 * Automatically generates test cases from the Go reference implementation,
 * creating both Go and TypeScript versions with expected outputs.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { basename, dirname, extname, join } from 'path';
import type { DependencyGraph } from './dependency-analyzer';

interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: number;
  dependencies: string[];
  goCode: string;
  tsCode: string;
  expectedOutput?: string;
}

interface CaseMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: number;
  dependencies: string[];
  apiMethods: string[];
  generated: string;
  version: string;
}

export class CaseGenerator {
  private referencePath: string;
  private casesPath: string;
  private dependencyGraph?: DependencyGraph;

  constructor(referencePath: string, casesPath: string) {
    this.referencePath = referencePath;
    this.casesPath = casesPath;
  }

  /**
   * Load dependency graph for test ordering
   */
  loadDependencyGraph(graphPath: string): void {
    if (existsSync(graphPath)) {
      this.dependencyGraph = JSON.parse(readFileSync(graphPath, 'utf-8'));
    }
  }

  /**
   * Generate all test cases from the Go reference
   */
  async generateAllCases(): Promise<TestCase[]> {
    console.log('🏗️  Generating test cases from Go reference...');

    const cases: TestCase[] = [];

    // Generate basic API test cases
    cases.push(...(await this.generateBasicApiCases()));

    // Generate layout test cases
    cases.push(...(await this.generateLayoutCases()));

    // Generate color test cases
    cases.push(...(await this.generateColorCases()));

    // Generate border test cases
    cases.push(...(await this.generateBorderCases()));

    // Generate component test cases
    cases.push(...(await this.generateComponentCases()));

    // Generate example test cases
    cases.push(...(await this.generateExampleCases()));

    // Generate complex combination cases
    cases.push(...(await this.generateAdvancedCases()));

    console.log(`✅ Generated ${cases.length} test cases`);

    // Save all cases to disk
    await this.saveCasesToDisk(cases);

    return cases;
  }

  /**
   * Generate basic API test cases
   */
  private async generateBasicApiCases(): Promise<TestCase[]> {
    const cases: TestCase[] = [];

    // Basic rendering
    cases.push({
      id: '001',
      name: 'basic-render',
      category: 'basic',
      description: 'Basic style creation and rendering',
      complexity: 1,
      dependencies: [],
      goCode: this.generateGoCode(
        'basic-render',
        `
	style := lipgloss.NewStyle()
	result := style.Render("Hello, World!")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'basic-render',
        `
	const style = NewStyle();
	const result = style.render("Hello, World!");
	process.stdout.write(result);
`
      ),
    });

    // Style with color
    cases.push({
      id: '002',
      name: 'color-basic',
      category: 'basic',
      description: 'Basic foreground color application',
      complexity: 2,
      dependencies: ['001'],
      goCode: this.generateGoCode(
        'color-basic',
        `
	style := lipgloss.NewStyle().Foreground(lipgloss.Color("red"))
	result := style.Render("Red Text")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'color-basic',
        `
	const style = NewStyle().color(Colors.red);
	const result = style.render("Red Text");
	process.stdout.write(result);
`
      ),
    });

    // Background color
    cases.push({
      id: '003',
      name: 'background-basic',
      category: 'basic',
      description: 'Basic background color application',
      complexity: 2,
      dependencies: ['002'],
      goCode: this.generateGoCode(
        'background-basic',
        `
	style := lipgloss.NewStyle().Background(lipgloss.Color("blue"))
	result := style.Render("Blue Background")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'background-basic',
        `
	const style = NewStyle().backgroundColor(Colors.blue);
	const result = style.render("Blue Background");
	process.stdout.write(result);
`
      ),
    });

    return cases;
  }

  /**
   * Generate layout test cases
   */
  private async generateLayoutCases(): Promise<TestCase[]> {
    const cases: TestCase[] = [];

    // Width
    cases.push({
      id: '101',
      name: 'width-basic',
      category: 'layout',
      description: 'Basic width setting',
      complexity: 2,
      dependencies: ['001'],
      goCode: this.generateGoCode(
        'width-basic',
        `
	style := lipgloss.NewStyle().Width(20)
	result := style.Render("Content")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'width-basic',
        `
	const style = NewStyle().width(20);
	const result = style.render("Content");
	process.stdout.write(result);
`
      ),
    });

    // Height
    cases.push({
      id: '102',
      name: 'height-basic',
      category: 'layout',
      description: 'Basic height setting',
      complexity: 2,
      dependencies: ['101'],
      goCode: this.generateGoCode(
        'height-basic',
        `
	style := lipgloss.NewStyle().Height(5)
	result := style.Render("Content")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'height-basic',
        `
	const style = NewStyle().height(5);
	const result = style.render("Content");
	process.stdout.write(result);
`
      ),
    });

    // Padding
    cases.push({
      id: '103',
      name: 'padding-all',
      category: 'layout',
      description: 'All-sides padding',
      complexity: 3,
      dependencies: ['102'],
      goCode: this.generateGoCode(
        'padding-all',
        `
	style := lipgloss.NewStyle().Padding(2)
	result := style.Render("Padded Content")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'padding-all',
        `
	const style = NewStyle().padding(2);
	const result = style.render("Padded Content");
	process.stdout.write(result);
`
      ),
    });

    // Margin
    cases.push({
      id: '104',
      name: 'margin-all',
      category: 'layout',
      description: 'All-sides margin',
      complexity: 3,
      dependencies: ['103'],
      goCode: this.generateGoCode(
        'margin-all',
        `
	style := lipgloss.NewStyle().Margin(1)
	result := style.Render("Margin Content")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'margin-all',
        `
	const style = NewStyle().margin(1);
	const result = style.render("Margin Content");
	process.stdout.write(result);
`
      ),
    });

    // Alignment
    cases.push({
      id: '105',
      name: 'align-center',
      category: 'layout',
      description: 'Center alignment',
      complexity: 3,
      dependencies: ['104'],
      goCode: this.generateGoCode(
        'align-center',
        `
	style := lipgloss.NewStyle().Width(20).Align(lipgloss.Center)
	result := style.Render("Centered")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'align-center',
        `
	const style = NewStyle().width(20).alignCenter();
	const result = style.render("Centered");
	process.stdout.write(result);
`
      ),
    });

    return cases;
  }

  /**
   * Generate color test cases
   */
  private async generateColorCases(): Promise<TestCase[]> {
    const cases: TestCase[] = [];

    const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white', 'black'];
    const hexColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

    // Named colors
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      if (!color) continue; // Skip undefined colors
      cases.push({
        id: `200${i + 1}`,
        name: `color-${color}`,
        category: 'color',
        description: `${color} foreground color`,
        complexity: 2,
        dependencies: ['002'],
        goCode: this.generateGoCode(
          `color-${color}`,
          `
	style := lipgloss.NewStyle().Foreground(lipgloss.Color("${color}"))
	result := style.Render("${color.charAt(0).toUpperCase() + color.slice(1)} Text")
	fmt.Print(result)
`
        ),
        tsCode: this.generateTsCode(
          `color-${color}`,
          `
	const style = NewStyle().color(Colors.${color});
	const result = style.render("${color.charAt(0).toUpperCase() + color.slice(1)} Text");
	process.stdout.write(result);
`
        ),
      });
    }

    // Hex colors
    for (let i = 0; i < hexColors.length; i++) {
      const hex = hexColors[i];
      if (!hex) continue; // Skip undefined hex values
      const id = `21${i + 1}`.padStart(3, '0');
      cases.push({
        id,
        name: `color-hex-${hex.slice(1)}`,
        category: 'color',
        description: `${hex} hex color`,
        complexity: 2,
        dependencies: ['002'],
        goCode: this.generateGoCode(
          `color-hex-${hex.slice(1)}`,
          `
	style := lipgloss.NewStyle().Foreground(lipgloss.Color("${hex}"))
	result := style.Render("Hex Color")
	fmt.Print(result)
`
        ),
        tsCode: this.generateTsCode(
          `color-hex-${hex.slice(1)}`,
          `
	const style = NewStyle().color("${hex}");
	const result = style.render("Hex Color");
	process.stdout.write(result);
`
        ),
      });
    }

    return cases;
  }

  /**
   * Generate border test cases
   */
  private async generateBorderCases(): Promise<TestCase[]> {
    const cases: TestCase[] = [];

    const borderTypes = ['Normal', 'Rounded', 'Block', 'Thick', 'Double'];

    for (let i = 0; i < borderTypes.length; i++) {
      const borderType = borderTypes[i];
      if (!borderType) continue; // Skip undefined border types
      cases.push({
        id: `30${i + 1}`,
        name: `border-${borderType.toLowerCase()}`,
        category: 'border',
        description: `${borderType} border style`,
        complexity: 3,
        dependencies: ['101'],
        goCode: this.generateGoCode(
          `border-${borderType.toLowerCase()}`,
          `
	style := lipgloss.NewStyle().Border(lipgloss.${borderType}Border()).Width(20)
	result := style.Render("Bordered Content")
	fmt.Print(result)
`
        ),
        tsCode: this.generateTsCode(
          `border-${borderType.toLowerCase()}`,
          `
	const style = NewStyle().border(BorderStyles.${borderType}).width(20);
	const result = style.render("Bordered Content");
	process.stdout.write(result);
`
        ),
      });
    }

    return cases;
  }

  /**
   * Generate component test cases
   */
  private async generateComponentCases(): Promise<TestCase[]> {
    const cases: TestCase[] = [];

    // Table basic
    cases.push({
      id: '401',
      name: 'table-basic',
      category: 'component',
      description: 'Basic table creation',
      complexity: 5,
      dependencies: ['101', '201'],
      goCode: this.generateGoCode(
        'table-basic',
        `
	t := lipgloss.NewTable().
		Border(lipgloss.NormalBorder()).
		Headers("Name", "Age").
		Row("Alice", "30").
		Row("Bob", "25")
	result := t.Render()
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'table-basic',
        `
	const t = newTable()
		.border(BorderStyles.Normal)
		.headers("Name", "Age")
		.row("Alice", "30")
		.row("Bob", "25");
	const result = t.render();
	process.stdout.write(result);
`
      ),
    });

    // List basic
    cases.push({
      id: '402',
      name: 'list-basic',
      category: 'component',
      description: 'Basic list creation',
      complexity: 4,
      dependencies: ['101'],
      goCode: this.generateGoCode(
        'list-basic',
        `
	l := lipgloss.NewList().
		Item("First item").
		Item("Second item").
		Item("Third item")
	result := l.Render()
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'list-basic',
        `
	const l = newList()
		.item("First item")
		.item("Second item")
		.item("Third item");
	const result = l.render();
	process.stdout.write(result);
`
      ),
    });

    return cases;
  }

  /**
   * Generate example-based test cases
   */
  private async generateExampleCases(): Promise<TestCase[]> {
    const cases: TestCase[] = [];
    const examplesPath = join(this.referencePath, 'examples');

    if (!existsSync(examplesPath)) {
      return cases;
    }

    // Find all example main.go files
    const exampleFiles = this.findGoFiles(examplesPath);

    for (let i = 0; i < exampleFiles.length; i++) {
      const filePath = exampleFiles[i];
      if (!filePath) continue; // Skip undefined file paths
      const exampleName = this.extractExampleName(filePath);

      if (!exampleName) continue;

      const goCode = readFileSync(filePath, 'utf-8');
      const tsCode = await this.convertGoToTypeScript(goCode);

      cases.push({
        id: `50${i + 1}`.padStart(3, '0'),
        name: `example-${exampleName}`,
        category: 'example',
        description: `Example: ${exampleName}`,
        complexity: 7,
        dependencies: this.extractDependenciesFromCode(goCode),
        goCode: this.wrapGoExample(goCode),
        tsCode: this.wrapTsExample(tsCode),
      });
    }

    return cases;
  }

  /**
   * Generate advanced combination test cases
   */
  private async generateAdvancedCases(): Promise<TestCase[]> {
    const cases: TestCase[] = [];

    // Complex style combination
    cases.push({
      id: '601',
      name: 'complex-combination',
      category: 'advanced',
      description: 'Complex style with multiple properties',
      complexity: 8,
      dependencies: ['103', '104', '201', '301'],
      goCode: this.generateGoCode(
        'complex-combination',
        `
	style := lipgloss.NewStyle().
		Foreground(lipgloss.Color("white")).
		Background(lipgloss.Color("blue")).
		Border(lipgloss.RoundedBorder()).
		Padding(2).
		Margin(1).
		Width(30).
		Align(lipgloss.Center)
	result := style.Render("Complex Styled Content")
	fmt.Print(result)
`
      ),
      tsCode: this.generateTsCode(
        'complex-combination',
        `
	const style = NewStyle()
		.color(Colors.white)
		.backgroundColor(Colors.blue)
		.border(BorderStyles.Rounded)
		.padding(2)
		.margin(1)
		.width(30)
		.alignCenter();
	const result = style.render("Complex Styled Content");
	process.stdout.write(result);
`
      ),
    });

    return cases;
  }

  /**
   * Generate Go code wrapper
   */
  private generateGoCode(name: string, code: string): string {
    return `package main

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/muesli/termenv"
)

func main() {
	// Set color profile for consistent output
	lipgloss.SetColorProfile(termenv.TrueColor)
	
${code}
}`;
  }

  /**
   * Generate TypeScript code wrapper
   */
  private generateTsCode(name: string, code: string): string {
    // Calculate relative path to src from test case directory
    // test/cases/category/001-name/case.ts -> ../../../../src/index
    return `import { 
	NewStyle, 
	Colors, 
	BorderStyles, 
	HorizontalAlignment,
	VerticalAlignment,
	newTable,
	newList,
	SetColorProfile,
	ColorProfile
} from '../../../../src/index.js';

// Set color profile for consistent output
SetColorProfile(ColorProfile.TrueColor);

${code}`;
  }

  /**
   * Save all cases to disk
   */
  private async saveCasesToDisk(cases: TestCase[]): Promise<void> {
    console.log('💾 Saving test cases to disk...');

    // Group cases by category
    const casesByCategory = cases.reduce(
      (acc, testCase) => {
        if (!acc[testCase.category]) {
          acc[testCase.category] = [];
        }
        const categoryArray = acc[testCase.category];
        if (categoryArray) { // Add null check
          categoryArray.push(testCase);
        }
        return acc;
      },
      {} as Record<string, TestCase[]>
    );

    // Create directory structure and save cases
    for (const [category, categoryCases] of Object.entries(casesByCategory)) {
      const categoryPath = join(this.casesPath, category);
      if (!existsSync(categoryPath)) {
        mkdirSync(categoryPath, { recursive: true });
      }

      for (const testCase of categoryCases) {
        await this.saveTestCase(testCase, categoryPath);
      }
    }

    // Generate index file
    await this.generateCaseIndex(cases);
  }

  /**
   * Save individual test case
   */
  private async saveTestCase(testCase: TestCase, categoryPath: string): Promise<void> {
    const casePath = join(categoryPath, `${testCase.id}-${testCase.name}`);
    if (!existsSync(casePath)) {
      mkdirSync(casePath, { recursive: true });
    }

    // Save Go code
    writeFileSync(join(casePath, 'case.go'), testCase.goCode);

    // Save TypeScript code
    writeFileSync(join(casePath, 'case.ts'), testCase.tsCode);

    // Generate expected output if not exists
    if (!testCase.expectedOutput && existsSync(join(casePath, 'case.go'))) {
      try {
        const generatedOutput = await this.generateExpectedOutput(casePath);
        if (generatedOutput !== undefined) {
          testCase.expectedOutput = generatedOutput;
        }
        if (testCase.expectedOutput) {
          writeFileSync(join(casePath, 'expected.out'), testCase.expectedOutput);
        }
      } catch (error) {
        console.warn(`⚠️  Could not generate expected output for ${testCase.name}:`, error);
      }
    }

    // Save metadata
    const metadata: CaseMetadata = {
      id: testCase.id,
      name: testCase.name,
      category: testCase.category,
      description: testCase.description,
      complexity: testCase.complexity,
      dependencies: testCase.dependencies,
      apiMethods: this.extractApiMethods(testCase.goCode),
      generated: new Date().toISOString(),
      version: '1.0.0',
    };
    writeFileSync(join(casePath, 'metadata.json'), JSON.stringify(metadata, null, 2));
  }

  /**
   * Generate expected output by running Go code
   */
  private async generateExpectedOutput(casePath: string): Promise<string | undefined> {
    const goFile = join(casePath, 'case.go');
    if (!existsSync(goFile)) return undefined;

    try {
      // Build and run Go code
      const output = execSync(
        `cd "${casePath}" && go mod init test-case && go mod tidy && go run case.go`,
        {
          encoding: 'utf-8',
          timeout: 10000,
        }
      );
      return output;
    } catch (error) {
      throw new Error(`Failed to generate output: ${error}`);
    }
  }

  /**
   * Extract API methods used in code
   */
  private extractApiMethods(code: string): string[] {
    const methods: string[] = [];
    const patterns = [/lipgloss\.(\w+)/g, /\.(\w+)\(/g];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        if (match[1] && !methods.includes(match[1])) {
          methods.push(match[1]);
        }
      }
    }

    return methods.filter(
      (method) => !['fmt', 'Print', 'main', 'package', 'import'].includes(method)
    );
  }

  /**
   * Generate case index file
   */
  private async generateCaseIndex(cases: TestCase[]): Promise<void> {
    const indexPath = join(this.casesPath, 'index.json');

    const index = {
      generated: new Date().toISOString(),
      totalCases: cases.length,
      categories: Object.keys(cases.reduce((acc, c) => ({ ...acc, [c.category]: true }), {})),
      cases: cases.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        description: c.description,
        complexity: c.complexity,
        dependencies: c.dependencies,
      })),
    };

    writeFileSync(indexPath, JSON.stringify(index, null, 2));
  }

  // Helper methods
  private findGoFiles(dir: string): string[] {
    const files: string[] = [];
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.findGoFiles(fullPath));
      } else if (extname(item) === '.go' && !item.includes('_test')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private extractExampleName(filePath: string): string | null {
    const parts = filePath.split('/');
    const exampleDir = parts[parts.length - 2];
    return exampleDir !== 'examples' ? (exampleDir ?? null) : null;
  }

  private extractDependenciesFromCode(code: string): string[] {
    // Simple dependency extraction based on API usage
    const dependencies: string[] = [];

    if (code.includes('Width') || code.includes('Height')) {
      dependencies.push('101');
    }
    if (code.includes('Color') || code.includes('Foreground')) {
      dependencies.push('002');
    }
    if (code.includes('Background')) {
      dependencies.push('003');
    }
    if (code.includes('Border')) {
      dependencies.push('301');
    }

    return dependencies;
  }

  private async convertGoToTypeScript(goCode: string): Promise<string> {
    // Basic Go to TypeScript conversion
    // This is a simplified conversion - in practice, you might want more sophisticated parsing

    let tsCode = goCode;

    // Replace package and imports
    tsCode = tsCode.replace(/package main/, '');
    tsCode = tsCode.replace(/import \([^)]+\)/g, '');
    tsCode = tsCode.replace(/func main\(\) \{/, '');

    // Remove the last closing brace
    tsCode = tsCode.trim();
    if (tsCode.endsWith('}')) {
      tsCode = tsCode.slice(0, -1);
    }

    // Basic syntax conversions
    tsCode = tsCode.replace(/lipgloss\.NewStyle\(\)/g, 'NewStyle()');
    tsCode = tsCode.replace(/lipgloss\.Color\("([^"]+)"\)/g, 'Colors.$1');
    tsCode = tsCode.replace(/lipgloss\.(\w+)Border\(\)/g, 'BorderStyles.$1');
    tsCode = tsCode.replace(/\.Foreground\(/g, '.color(');
    tsCode = tsCode.replace(/\.Background\(/g, '.backgroundColor(');
    tsCode = tsCode.replace(/\.Align\(lipgloss\.Center\)/g, '.alignCenter()');
    tsCode = tsCode.replace(/\.Width\(/g, '.width(');
    tsCode = tsCode.replace(/\.Height\(/g, '.height(');
    tsCode = tsCode.replace(/\.Padding\(/g, '.padding(');
    tsCode = tsCode.replace(/\.Margin\(/g, '.margin(');
    tsCode = tsCode.replace(/\.Bold\(/g, '.bold(');
    tsCode = tsCode.replace(/\.Italic\(/g, '.italic(');
    tsCode = tsCode.replace(/\.Render\(/g, '.render(');
    tsCode = tsCode.replace(/lipgloss\.(\w+)/g, '$1');
    tsCode = tsCode.replace(/fmt\.Print\(/g, 'process.stdout.write(');
    tsCode = tsCode.replace(/:=/g, '=');
    tsCode = tsCode.replace(/\bstring\b/g, 'string');

    return tsCode.trim();
  }

  private wrapGoExample(code: string): string {
    if (code.includes('package main')) {
      return code;
    }
    return this.generateGoCode('example', code);
  }

  private wrapTsExample(code: string): string {
    if (code.includes('import')) {
      return code;
    }
    return this.generateTsCode('example', code);
  }
}

// CLI usage
if (require.main === module) {
  const referencePath = process.argv[2] || './test/automation/reference';
  const casesPath = process.argv[3] || './test/cases';

  const generator = new CaseGenerator(referencePath, casesPath);

  // Load dependency graph if available
  const graphPath = './test/automation/dependency-graph.json';
  if (existsSync(graphPath)) {
    generator.loadDependencyGraph(graphPath);
  }

  generator
    .generateAllCases()
    .then((cases) => {
      console.log(`✅ Successfully generated ${cases.length} test cases`);
    })
    .catch((error) => {
      console.error('❌ Case generation failed:', error);
      process.exit(1);
    });
}
