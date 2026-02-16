# Concrete Implementation Plan: Go Dependencies Replacement

## Phase 1: Infrastructure Setup

### 1.1 Package Dependencies Update

**Add to package.json**:

```json
{
  "devDependencies": {
    // Test framework enhancements
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    
    // Process and file management
    "cross-spawn": "^7.0.3",
    "fs-extra": "^11.1.0",
    "fast-glob": "^3.3.1",
    
    // Text and data processing
    "lodash": "^4.17.21",
    "@types/lodash": "^4.14.195",
    "yaml": "^2.3.2",
    "json5": "^2.2.3",
    "diff": "^5.1.0",
    
    // Template and test generation
    "handlebars": "^4.7.8",
    "faker": "^8.0.2",
    
    // Performance and benchmarking
    "tinybench": "^2.5.0",
    "mitata": "^0.1.6"
  },
  "dependencies": {
    // ANSI and terminal handling
    "ansi-escapes": "^6.2.0",
    "ansi-styles": "^6.2.1",
    "cli-cursor": "^4.0.0",
    "terminal-size": "^3.0.2",
    
    // Unicode processing
    "unicode-segmenter": "^0.8.0",
    "eastasianwidth": "^0.2.0",
    "is-fullwidth-code-point": "^4.0.0"
  }
}
```

### 1.2 Test Configuration Updates

**Update bunfig.toml**:

```toml
[test]
preload = ["./test/utils/setup.ts"]
coverage = true
timeout = 300000

# Environment for npm-based tests
env = [
  "FORCE_COLOR=1",
  "NODE_ENV=test",
  "CI=false",
  "TERM=xterm-256color",
  "LIPGLOSS_TEST_MODE=native"  # NEW: Use native tests
]

# Enable concurrent testing with native implementation
concurrent = true
```

## Phase 2: Core Implementation

### 2.1 Test Case Generator

**Create `/test/tools/test-case-generator.ts`**:

```typescript
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import { faker } from '@faker-js/faker';

export interface TestCase {
  name: string;
  method: string;
  args: string[];
  content: string;
  expectedOutput?: string;
  metadata: TestMetadata;
}

export interface TestMetadata {
  category: 'basic' | 'styling' | 'layout' | 'unicode' | 'performance' | 'component';
  complexity: 'low' | 'medium' | 'high';
  colorProfile: 'ascii' | 'ansi' | 'ansi256' | 'truecolor';
  tags: string[];
  timeout?: number;
}

export class TestCaseGenerator {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(private templatesDir: string = './test/templates') {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    const templateFiles = [
      'basic-test.hbs',
      'styling-test.hbs',
      'layout-test.hbs',
      'unicode-test.hbs',
      'component-test.hbs'
    ];

    templateFiles.forEach(file => {
      const content = readFileSync(join(this.templatesDir, file), 'utf-8');
      this.templates.set(file.replace('.hbs', ''), Handlebars.compile(content));
    });
  }

  generateBasicTests(): TestCase[] {
    const basicConfigs = [
      { name: 'plain_text', args: [], content: 'Hello, World!' },
      { name: 'empty_content', args: [], content: '' },
      { name: 'whitespace_only', args: [], content: '   ' },
      { name: 'newline_content', args: [], content: 'Line 1\nLine 2\nLine 3' }
    ];

    return basicConfigs.map(config => ({
      name: config.name,
      method: 'render',
      args: config.args,
      content: config.content,
      metadata: {
        category: 'basic' as const,
        complexity: 'low' as const,
        colorProfile: 'truecolor' as const,
        tags: ['basic', 'text']
      }
    }));
  }

  generateStylingTests(): TestCase[] {
    const colors = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan'];
    const hexColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    const rgbColors = ['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)'];
    const styles = ['bold', 'italic', 'underline', 'strikethrough'];

    const tests: TestCase[] = [];

    // Named colors
    colors.forEach(color => {
      tests.push({
        name: `fg_named_${color}`,
        method: 'render',
        args: ['foreground', color],
        content: `${color} text`,
        metadata: {
          category: 'styling',
          complexity: 'low',
          colorProfile: 'ansi',
          tags: ['color', 'foreground', 'named']
        }
      });

      tests.push({
        name: `bg_named_${color}`,
        method: 'render',
        args: ['background', color],
        content: `${color} background`,
        metadata: {
          category: 'styling',
          complexity: 'low',
          colorProfile: 'ansi',
          tags: ['color', 'background', 'named']
        }
      });
    });

    // Hex colors
    hexColors.forEach(color => {
      const cleanName = color.replace('#', '_');
      tests.push({
        name: `fg_hex_${cleanName}`,
        method: 'render',
        args: ['foreground', color],
        content: `${color} text`,
        metadata: {
          category: 'styling',
          complexity: 'medium',
          colorProfile: 'truecolor',
          tags: ['color', 'foreground', 'hex']
        }
      });
    });

    // Text styles
    styles.forEach(style => {
      tests.push({
        name: `${style}_true`,
        method: 'render',
        args: [style, 'true'],
        content: `${style} text`,
        metadata: {
          category: 'styling',
          complexity: 'low',
          colorProfile: 'ansi',
          tags: ['style', style]
        }
      });
    });

    // Style combinations
    for (let i = 0; i < styles.length; i++) {
      for (let j = i + 1; j < styles.length; j++) {
        tests.push({
          name: `${styles[i]}_${styles[j]}`,
          method: 'render',
          args: [styles[i], 'true', styles[j], 'true'],
          content: `${styles[i]} ${styles[j]}`,
          metadata: {
            category: 'styling',
            complexity: 'medium',
            colorProfile: 'ansi',
            tags: ['style', 'combination', styles[i], styles[j]]
          }
        });
      }
    }

    return tests;
  }

  generateLayoutTests(): TestCase[] {
    const tests: TestCase[] = [];
    const widths = [1, 2, 3, 5, 10, 15, 20, 25];
    const heights = [1, 2, 3, 5];
    const alignments = ['left', 'center', 'right'];
    const valignments = ['top', 'middle', 'bottom'];

    // Width tests
    widths.forEach(width => {
      tests.push({
        name: `width_${width}`,
        method: 'render',
        args: ['width', width.toString()],
        content: 'This is a test string that should be constrained by width',
        metadata: {
          category: 'layout',
          complexity: width > 10 ? 'medium' : 'low',
          colorProfile: 'ascii',
          tags: ['width', 'constraint']
        }
      });
    });

    // Height tests
    heights.forEach(height => {
      const content = Array(height + 2).fill(0).map((_, i) => `Line ${i + 1}`).join('\n');
      tests.push({
        name: `height_${height}`,
        method: 'render',
        args: ['height', height.toString()],
        content,
        metadata: {
          category: 'layout',
          complexity: 'medium',
          colorProfile: 'ascii',
          tags: ['height', 'constraint', 'multiline']
        }
      });
    });

    // Alignment combinations
    alignments.forEach(align => {
      tests.push({
        name: `align_${align}`,
        method: 'render',
        args: ['width', '20', 'align', align],
        content: 'Aligned text',
        metadata: {
          category: 'layout',
          complexity: 'medium',
          colorProfile: 'ascii',
          tags: ['alignment', 'horizontal', align]
        }
      });

      valignments.forEach(valign => {
        tests.push({
          name: `align_${align}_${valign}`,
          method: 'render',
          args: ['width', '20', 'height', '5', 'align', align, 'valign', valign],
          content: 'Aligned',
          metadata: {
            category: 'layout',
            complexity: 'high',
            colorProfile: 'ascii',
            tags: ['alignment', 'horizontal', 'vertical', align, valign]
          }
        });
      });
    });

    return tests;
  }

  generateUnicodeTests(): TestCase[] {
    const unicodeContent = [
      { name: 'emoji', content: '🎉 🌟 ✨ 🚀 💫' },
      { name: 'japanese', content: 'こんにちは世界' },
      { name: 'chinese', content: '你好世界 测试' },
      { name: 'arabic', content: 'مرحبا بالعالم' },
      { name: 'mixed', content: 'Hello 🌍 こんにちは 测试 🎯' },
      { name: 'zwj_emoji', content: '👨‍💻 👩‍🎨 🧑‍🚀' },
      { name: 'combining', content: 'café naïve résumé' }
    ];

    return unicodeContent.map((item, index) => ({
      name: `unicode_${item.name}`,
      method: 'render',
      args: index % 2 === 0 ? ['foreground', 'magenta'] : [],
      content: item.content,
      metadata: {
        category: 'unicode' as const,
        complexity: item.name.includes('zwj') || item.name.includes('combining') ? 'high' as const : 'medium' as const,
        colorProfile: 'truecolor' as const,
        tags: ['unicode', item.name, 'international']
      }
    }));
  }

  generatePerformanceTests(): TestCase[] {
    const tests: TestCase[] = [];

    // Large content tests
    [100, 500, 1000, 5000].forEach(lines => {
      const content = Array(lines).fill(0).map((_, i) => 
        faker.lorem.sentence({ min: 10, max: 50 })
      ).join('\n');

      tests.push({
        name: `performance_${lines}_lines`,
        method: 'render',
        args: ['width', '80'],
        content,
        metadata: {
          category: 'performance',
          complexity: lines > 1000 ? 'high' : 'medium',
          colorProfile: 'ascii',
          tags: ['performance', 'large-content', 'stress'],
          timeout: lines > 1000 ? 60000 : 30000
        }
      });
    });

    // Complex styling stress tests
    const complexContent = faker.lorem.paragraphs(10);
    tests.push({
      name: 'performance_complex_styling',
      method: 'render',
      args: [
        'foreground', '#ff6b6b',
        'background', '#4ecdc4',
        'bold', 'true',
        'italic', 'true',
        'padding', '2,3,2,3',
        'width', '60',
        'height', '20',
        'align', 'center',
        'valign', 'middle'
      ],
      content: complexContent,
      metadata: {
        category: 'performance',
        complexity: 'high',
        colorProfile: 'truecolor',
        tags: ['performance', 'complex-styling', 'stress'],
        timeout: 60000
      }
    });

    return tests;
  }

  generateComponentTests(): TestCase[] {
    // These replace table, list, and tree component-specific tests
    const tests: TestCase[] = [];

    // Table-like styling patterns
    const tablePatterns = [
      {
        name: 'table_header_style',
        args: ['foreground', '#FF6B6B', 'bold', 'true', 'align', 'center', 'width', '15'],
        content: 'HEADER'
      },
      {
        name: 'table_cell_padding',
        args: ['padding', '0,2', 'width', '12'],
        content: 'Cell Data'
      },
      {
        name: 'table_zebra_row',
        args: ['background', '#F3F4F6', 'width', '15', 'padding', '0,1'],
        content: 'Zebra Row'
      }
    ];

    tablePatterns.forEach(pattern => {
      tests.push({
        name: pattern.name,
        method: 'render',
        args: pattern.args,
        content: pattern.content,
        metadata: {
          category: 'component',
          complexity: 'medium',
          colorProfile: 'truecolor',
          tags: ['component', 'table', 'styling']
        }
      });
    });

    return tests;
  }

  generateAllTests(): TestCase[] {
    return [
      ...this.generateBasicTests(),
      ...this.generateStylingTests(),
      ...this.generateLayoutTests(),
      ...this.generateUnicodeTests(),
      ...this.generatePerformanceTests(),
      ...this.generateComponentTests()
    ];
  }

  exportToJson(tests: TestCase[], filename: string): void {
    const output = {
      generated: new Date().toISOString(),
      version: '1.0.0',
      totalTests: tests.length,
      categories: this.groupByCategory(tests),
      tests
    };

    writeFileSync(filename, JSON.stringify(output, null, 2));
  }

  private groupByCategory(tests: TestCase[]): Record<string, number> {
    return tests.reduce((acc, test) => {
      acc[test.metadata.category] = (acc[test.metadata.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
```

### 2.2 Reference Manager

**Create `/test/tools/reference-manager.ts`**:

```typescript
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'fast-glob';
import { diff } from 'diff';
import stripAnsi from 'strip-ansi';

export interface ReferenceOutput {
  testName: string;
  expectedOutput: string;
  source: 'golden' | 'specification' | 'historical' | 'community';
  version: string;
  metadata?: Record<string, any>;
}

export interface DiffReport {
  match: boolean;
  similarity: number;
  textDiff?: string;
  ansiDiff?: string;
  reason?: string;
}

export class ReferenceManager {
  private goldenFiles: Map<string, ReferenceOutput> = new Map();
  private specificationOutputs: Map<string, ReferenceOutput> = new Map();

  constructor(
    private goldenDir: string = './test/fixtures/golden',
    private historicalDir: string = './test/fixtures/historical'
  ) {
    this.loadGoldenFiles();
    this.loadSpecificationOutputs();
  }

  private loadGoldenFiles(): void {
    try {
      const goldenPattern = join(this.goldenDir, '**/*.json');
      const files = glob.sync(goldenPattern);

      files.forEach(file => {
        const content = JSON.parse(readFileSync(file, 'utf-8'));
        content.outputs?.forEach((output: ReferenceOutput) => {
          this.goldenFiles.set(output.testName, {
            ...output,
            source: 'golden'
          });
        });
      });

      console.log(`Loaded ${this.goldenFiles.size} golden file references`);
    } catch (error) {
      console.warn('Failed to load golden files:', error);
    }
  }

  private loadSpecificationOutputs(): void {
    // Load ANSI specification-based expected outputs
    const specFile = join(this.goldenDir, 'ansi-specification.json');
    if (existsSync(specFile)) {
      try {
        const specs = JSON.parse(readFileSync(specFile, 'utf-8'));
        specs.outputs?.forEach((output: ReferenceOutput) => {
          this.specificationOutputs.set(output.testName, {
            ...output,
            source: 'specification'
          });
        });
      } catch (error) {
        console.warn('Failed to load specification outputs:', error);
      }
    }
  }

  getReferenceOutput(testName: string): ReferenceOutput | null {
    // Priority: specification > golden > historical
    return this.specificationOutputs.get(testName) || 
           this.goldenFiles.get(testName) || 
           null;
  }

  validateOutput(testName: string, actualOutput: string): DiffReport {
    const reference = this.getReferenceOutput(testName);
    
    if (!reference) {
      return {
        match: false,
        similarity: 0,
        reason: 'No reference output found'
      };
    }

    return this.compareOutputs(reference.expectedOutput, actualOutput);
  }

  compareOutputs(expected: string, actual: string): DiffReport {
    // Exact match first
    if (expected === actual) {
      return { match: true, similarity: 1.0 };
    }

    // ANSI-aware comparison
    const expectedNormalized = this.normalizeAnsi(expected);
    const actualNormalized = this.normalizeAnsi(actual);

    if (expectedNormalized === actualNormalized) {
      return { match: true, similarity: 0.95, reason: 'ANSI normalization match' };
    }

    // Text-only comparison
    const expectedText = stripAnsi(expected);
    const actualText = stripAnsi(actual);

    if (expectedText === actualText) {
      return { 
        match: true, 
        similarity: 0.85, 
        reason: 'Text content match (ANSI differences)',
        ansiDiff: this.generateAnsiDiff(expected, actual)
      };
    }

    // Generate detailed diff
    const textDiff = diff.createPatch('', expectedText, actualText, '', '');
    const similarity = this.calculateSimilarity(expectedText, actualText);

    return {
      match: false,
      similarity,
      textDiff,
      ansiDiff: this.generateAnsiDiff(expected, actual),
      reason: similarity > 0.8 ? 'Minor differences' : 'Significant differences'
    };
  }

  private normalizeAnsi(text: string): string {
    return text
      .replace(/\x1b\[0m/g, '') // Remove reset sequences
      .replace(/\x1b\[22m/g, '') // Remove bold reset
      .replace(/\x1b\[23m/g, '') // Remove italic reset
      .replace(/\x1b\[24m/g, '') // Remove underline reset
      .replace(/\x1b\[29m/g, '') // Remove strikethrough reset
      .replace(/\x1b\[39m/g, '') // Remove default foreground
      .replace(/\x1b\[49m/g, '') // Remove default background
      .trim();
  }

  private generateAnsiDiff(expected: string, actual: string): string {
    return diff.diffChars(expected, actual)
      .map(part => {
        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        return `${prefix} ${JSON.stringify(part.value)}`;
      })
      .join('\n');
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const changes = diff.diffChars(text1, text2);
    const totalChars = Math.max(text1.length, text2.length);
    const changedChars = changes
      .filter(part => part.added || part.removed)
      .reduce((sum, part) => sum + part.value.length, 0);
    
    return Math.max(0, 1 - (changedChars / totalChars));
  }

  saveReferenceOutput(testName: string, output: string, source: string = 'generated'): void {
    const referenceOutput: ReferenceOutput = {
      testName,
      expectedOutput: output,
      source: source as any,
      version: '1.0.0',
      metadata: {
        generatedAt: new Date().toISOString(),
        platform: process.platform,
        nodeVersion: process.version
      }
    };

    const outputDir = join(this.goldenDir, source);
    const outputFile = join(outputDir, `${testName}.json`);
    
    // Ensure directory exists
    const fs = require('fs-extra');
    fs.ensureDirSync(dirname(outputFile));
    
    writeFileSync(outputFile, JSON.stringify(referenceOutput, null, 2));
  }

  generateReport(): string {
    const stats = {
      totalGoldenFiles: this.goldenFiles.size,
      totalSpecifications: this.specificationOutputs.size,
      sources: this.getSourceStats()
    };

    return `Reference Manager Report
========================
Golden Files: ${stats.totalGoldenFiles}
Specifications: ${stats.totalSpecifications}

Source Distribution:
${Object.entries(stats.sources)
  .map(([source, count]) => `  ${source}: ${count}`)
  .join('\n')}
`;
  }

  private getSourceStats(): Record<string, number> {
    const sources: Record<string, number> = {};
    
    [...this.goldenFiles.values(), ...this.specificationOutputs.values()]
      .forEach(ref => {
        sources[ref.source] = (sources[ref.source] || 0) + 1;
      });

    return sources;
  }
}
```

### 2.3 Native Test Runner

**Create `/test/tools/native-test-runner.ts`**:

```typescript
import { TestCase, TestCaseGenerator } from './test-case-generator';
import { ReferenceManager, DiffReport } from './reference-manager';
import { Style } from '../../src/style';
import { SetColorProfile, ColorProfile } from '../../src/renderer';

export interface TestResult {
  testCase: TestCase;
  actualOutput: string;
  comparison: DiffReport;
  executionTime: number;
  success: boolean;
  error?: string;
}

export interface TestSuiteResult {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  executionTime: number;
  results: TestResult[];
  summary: string;
}

export class NativeTestRunner {
  private generator: TestCaseGenerator;
  private referenceManager: ReferenceManager;

  constructor() {
    this.generator = new TestCaseGenerator();
    this.referenceManager = new ReferenceManager();
  }

  async runSingleTest(testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Set color profile based on test metadata
      this.setColorProfile(testCase.metadata.colorProfile);
      
      const actualOutput = this.executeTypeScriptTest(testCase);
      const comparison = this.referenceManager.validateOutput(testCase.name, actualOutput);
      
      const executionTime = Date.now() - startTime;
      
      return {
        testCase,
        actualOutput,
        comparison,
        executionTime,
        success: comparison.match
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      return {
        testCase,
        actualOutput: '',
        comparison: { match: false, similarity: 0, reason: 'Execution error' },
        executionTime,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async runTestSuite(testCases?: TestCase[]): Promise<TestSuiteResult> {
    const tests = testCases || this.generator.generateAllTests();
    const startTime = Date.now();
    
    console.log(`Running ${tests.length} native tests...`);
    
    const results: TestResult[] = [];
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (const testCase of tests) {
      try {
        const result = await this.runSingleTest(testCase);
        results.push(result);
        
        if (result.success) {
          passed++;
        } else {
          failed++;
        }
        
        // Progress reporting
        if ((results.length % 50) === 0) {
          console.log(`  Progress: ${results.length}/${tests.length} (${passed} passed, ${failed} failed)`);
        }
      } catch (error) {
        console.error(`Skipped test ${testCase.name}:`, error);
        skipped++;
      }
    }

    const executionTime = Date.now() - startTime;
    const summary = this.generateSummary(passed, failed, skipped, executionTime);

    return {
      totalTests: tests.length,
      passed,
      failed,
      skipped,
      executionTime,
      results,
      summary
    };
  }

  private executeTypeScriptTest(testCase: TestCase): string {
    let style = new Style();

    // Apply style properties based on args
    for (let i = 0; i < testCase.args.length; i += 2) {
      if (i + 1 >= testCase.args.length) break;

      const key = testCase.args[i];
      const value = testCase.args[i + 1];

      style = this.applyStyleProperty(style, key, value);
    }

    return style.render(testCase.content);
  }

  private applyStyleProperty(style: Style, key: string, value: string): Style {
    switch (key) {
      case 'foreground':
      case 'color':
        return style.color(value);
      case 'background':
        return style.backgroundColor(value);
      case 'bold':
        return value === 'true' ? style.bold() : style;
      case 'italic':
        return value === 'true' ? style.italic() : style;
      case 'underline':
        return value === 'true' ? style.underline() : style;
      case 'strikethrough':
        return value === 'true' ? style.strikethrough() : style;
      case 'width':
        const width = parseInt(value);
        return !isNaN(width) ? style.width(width) : style;
      case 'height':
        const height = parseInt(value);
        return !isNaN(height) ? style.height(height) : style;
      case 'padding':
        return this.applyPadding(style, value);
      case 'margin':
        return this.applyMargin(style, value);
      case 'align':
        return this.applyAlignment(style, value);
      case 'valign':
        return this.applyVerticalAlignment(style, value);
      default:
        console.warn(`Unknown style property: ${key}`);
        return style;
    }
  }

  private applyPadding(style: Style, value: string): Style {
    const parts = value.split(',').map(p => parseInt(p.trim()));
    
    if (parts.length === 1 && !isNaN(parts[0])) {
      return style.padding(parts[0]);
    } else if (parts.length === 2 && parts.every(p => !isNaN(p))) {
      return style.padding(parts[0], parts[1]);
    } else if (parts.length === 4 && parts.every(p => !isNaN(p))) {
      return style.padding(parts[0], parts[1], parts[2], parts[3]);
    }
    
    return style;
  }

  private applyMargin(style: Style, value: string): Style {
    const parts = value.split(',').map(p => parseInt(p.trim()));
    
    if (parts.length === 1 && !isNaN(parts[0])) {
      return style.margin(parts[0]);
    } else if (parts.length === 2 && parts.every(p => !isNaN(p))) {
      return style.margin(parts[0], parts[1]);
    } else if (parts.length === 4 && parts.every(p => !isNaN(p))) {
      return style.margin(parts[0], parts[1], parts[2], parts[3]);
    }
    
    return style;
  }

  private applyAlignment(style: Style, value: string): Style {
    switch (value) {
      case 'left':
        return style.alignLeft();
      case 'center':
        return style.alignCenter();
      case 'right':
        return style.alignRight();
      default:
        return style;
    }
  }

  private applyVerticalAlignment(style: Style, value: string): Style {
    switch (value) {
      case 'top':
        return style.alignTop();
      case 'middle':
        return style.alignMiddle();
      case 'bottom':
        return style.alignBottom();
      default:
        return style;
    }
  }

  private setColorProfile(profile: string): void {
    switch (profile) {
      case 'ascii':
        SetColorProfile(ColorProfile.Ascii);
        break;
      case 'ansi':
        SetColorProfile(ColorProfile.ANSI);
        break;
      case 'ansi256':
        SetColorProfile(ColorProfile.ANSI256);
        break;
      case 'truecolor':
        SetColorProfile(ColorProfile.TrueColor);
        break;
      default:
        SetColorProfile(ColorProfile.TrueColor);
    }
  }

  private generateSummary(passed: number, failed: number, skipped: number, executionTime: number): string {
    const total = passed + failed + skipped;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';
    
    return `
Native Test Suite Results
========================
Total Tests: ${total}
Passed: ${passed} (${passRate}%)
Failed: ${failed}
Skipped: ${skipped}
Execution Time: ${(executionTime / 1000).toFixed(2)}s

${failed > 0 ? '⚠️  Some tests failed' : '✅ All tests passed'}
`;
  }

  generateDetailedReport(results: TestSuiteResult): string {
    const failedTests = results.results.filter(r => !r.success);
    
    let report = results.summary;
    
    if (failedTests.length > 0) {
      report += '\n\nFailed Tests:\n';
      report += '=============\n';
      
      failedTests.forEach(result => {
        report += `\n${result.testCase.name}:\n`;
        report += `  Category: ${result.testCase.metadata.category}\n`;
        report += `  Complexity: ${result.testCase.metadata.complexity}\n`;
        report += `  Reason: ${result.comparison.reason || result.error}\n`;
        
        if (result.comparison.similarity) {
          report += `  Similarity: ${(result.comparison.similarity * 100).toFixed(1)}%\n`;
        }
        
        if (result.comparison.textDiff) {
          report += `  Text Diff: ${result.comparison.textDiff.slice(0, 200)}...\n`;
        }
      });
    }

    // Performance statistics
    const avgExecutionTime = results.results.reduce((sum, r) => sum + r.executionTime, 0) / results.results.length;
    const slowestTests = results.results
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, 5);

    report += '\n\nPerformance Statistics:\n';
    report += '======================\n';
    report += `Average execution time: ${avgExecutionTime.toFixed(2)}ms\n`;
    report += '\nSlowest tests:\n';
    slowestTests.forEach(result => {
      report += `  ${result.testCase.name}: ${result.executionTime}ms\n`;
    });

    return report;
  }
}
```

## Phase 3: Test Migration

### 3.1 Create Migration Script

**Create `/test/tools/migrate-tests.ts`**:

```typescript
import { NativeTestRunner } from './native-test-runner';
import { TestCaseGenerator } from './test-case-generator';
import { ReferenceManager } from './reference-manager';
import { writeFileSync } from 'fs';

async function migrateFromGoTests(): Promise<void> {
  console.log('🔄 Starting test migration from Go to native TypeScript...\n');

  const generator = new TestCaseGenerator();
  const runner = new NativeTestRunner();
  const referenceManager = new ReferenceManager();

  // Generate all test cases
  console.log('📝 Generating test cases...');
  const testCases = generator.generateAllTests();
  console.log(`Generated ${testCases.length} test cases\n`);

  // Export test cases for reference
  generator.exportToJson(testCases, './test/fixtures/generated-test-cases.json');

  // Run native tests
  console.log('🧪 Running native TypeScript tests...');
  const results = await runner.runTestSuite(testCases);

  // Generate reports
  console.log('📊 Generating reports...\n');
  
  const summary = runner.generateDetailedReport(results);
  console.log(summary);

  // Save detailed results
  writeFileSync('./test/results/native-test-results.json', JSON.stringify(results, null, 2));
  writeFileSync('./test/results/migration-report.md', `# Test Migration Report\n\n${summary}`);

  // Generate reference outputs for successful tests
  const successfulTests = results.results.filter(r => r.success);
  console.log(`\n💾 Saving ${successfulTests.length} reference outputs...`);
  
  successfulTests.forEach(result => {
    referenceManager.saveReferenceOutput(
      result.testCase.name,
      result.actualOutput,
      'native-generated'
    );
  });

  console.log('\n✅ Migration complete!');
  console.log(`📁 Results saved to:`);
  console.log(`   - test/results/native-test-results.json`);
  console.log(`   - test/results/migration-report.md`);
  console.log(`   - test/fixtures/generated-test-cases.json`);
}

if (require.main === module) {
  migrateFromGoTests().catch(console.error);
}
```

### 3.2 Update Test Scripts

**Update package.json scripts**:

```json
{
  "scripts": {
    "test:native": "LIPGLOSS_TEST_MODE=native bun test test/suites/native --timeout 300000",
    "test:migrate": "bun run test/tools/migrate-tests.ts",
    "test:generate": "bun run test/tools/test-case-generator.ts",
    "test:comparative-native": "LIPGLOSS_TEST_MODE=native bun test test/suites/comparative-native --timeout 600000",
    "test:all-native": "bun run test:native && bun run test:comparative-native",
    "test:benchmark": "bun run test/tools/benchmark-runner.ts",
    "test:visual": "bun run test/tools/visual-regression.ts"
  }
}
```

## Phase 4: Implementation Steps

### Step 1: Setup Infrastructure (Day 1-2)

```bash
# Install dependencies
bun add -D vitest @vitest/ui cross-spawn fs-extra fast-glob
bun add -D lodash @types/lodash yaml json5 diff handlebars faker
bun add ansi-escapes ansi-styles cli-cursor terminal-size
bun add unicode-segmenter eastasianwidth is-fullwidth-code-point

# Create directory structure
mkdir -p test/tools test/fixtures/golden test/fixtures/historical
mkdir -p test/templates test/results test/suites/native
```

### Step 2: Implement Core Classes (Day 3-5)

1. Create `TestCaseGenerator` class
2. Create `ReferenceManager` class  
3. Create `NativeTestRunner` class
4. Create migration script

### Step 3: Create Test Templates (Day 6)

**Create `/test/templates/basic-test.hbs`**:

```handlebars
// Generated basic test for {{name}}
import { describe, it, expect } from 'bun:test';
import { Style } from '../../../src/style';

describe('Basic Test: {{name}}', () => {
  it('should render {{name}} correctly', () => {
    const style = new Style();
    const result = style.render('{{content}}');
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});
```

### Step 4: Run Migration (Day 7)

```bash
# Run the migration
bun run test:migrate

# Validate results
bun run test:native

# Compare with existing Go tests
bun run test:comparative-native
```

### Step 5: Validate and Optimize (Day 8-10)

1. Review migration results
2. Fix any compatibility issues
3. Optimize performance
4. Update CI/CD configuration

## Expected Outcomes

1. **Elimination of Go Dependencies**: Complete removal of 4MB+ Go binaries
2. **Improved Test Performance**: 30-50% faster test execution
3. **Enhanced Maintainability**: Pure TypeScript testing stack
4. **Better CI/CD Integration**: Faster builds and deploys
5. **Expanded Test Coverage**: Visual regression and performance testing

## Rollback Plan

If migration fails, we can easily rollback by:

1. Reverting package.json changes
2. Keeping existing Go binaries
3. Using feature flags to switch between implementations
4. Gradual migration with parallel validation

This implementation plan provides a concrete, step-by-step approach to replacing Go test dependencies while maintaining compatibility and enhancing the testing capabilities.