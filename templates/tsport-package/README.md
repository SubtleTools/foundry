# TSports Package Template

A comprehensive Moon template for creating high-quality TypeScript ports of Go packages with 100% API compatibility, automatic documentation generation, and GitHub Pages deployment.

## 🚀 Quick Start

### 1. Configure the template repository

Add this template repository to your `.moon/workspace.yml`:

```yaml
generator:
  templates:
    - 'git://github.com/tsports/tsports#main'
```

### 2. Generate a new package

Use Moon to generate a new TSports package:

```bash
# Generate with prompts (interactive)
moon generate tsport

# Generate with all arguments (non-interactive)
moon generate tsport -- \
  --goRepo="https://github.com/rivo/uniseg" \
  --packageName="@tsports/uniseg" \
  --description="Unicode text segmentation for TypeScript"
```

### 3. Set up the Go reference and start developing

```bash
# Navigate to generated package
cd packages/uniseg

# Set up Go reference repository  
bun run setup

# Start developing
bun run dev
```

## 📁 Generated Package Structure

```
packages/your-package/
├── src/
│   ├── index.ts          # TypeScript-native API (camelCase)
│   ├── go-style.ts       # Go-compatible API (PascalCase)  
│   └── types.ts          # TypeScript type definitions
├── test/
│   ├── basic.test.ts     # Basic functionality tests
│   ├── reference/        # Go reference (created by setup script)
│   └── utils/            # Test utilities
├── docs-theme/           # Custom TypeDoc theme
├── examples/             # Usage examples  
├── scripts/
│   └── setup-reference.ts # Go reference setup script
├── .github/workflows/    # CI/CD and docs deployment
├── moon.yml              # Moon task configuration
├── typedoc.json          # Documentation generation config
└── README.md             # Generated from README-example.md template
```

## 🎯 Features

### 🚀 **Moon Integration**
- **Template variables** with interactive prompts
- **Monorepo support** with packages/ directory structure  
- **Moon task system** for build, test, and documentation
- **Path aliases** with `#src/*` and `#test/*` imports

### 📚 **Automatic Documentation**
- **TypeDoc integration** with TSports custom theme
- **GitHub Pages deployment** on every push to main
- **TSDoc comments** with examples and API references
- **Multiple export formats** (HTML, Markdown) 

### 📦 **Modern Package Setup**
- **Dual API support** (TypeScript-native + Go-compatible)
- **Clean imports** with package.json imports/exports
- **Type-safe** with comprehensive TypeScript configuration
- **Bun-powered** build system and package management

### 🧪 **Testing & Quality**
- **Compatibility testing** against Go reference implementation
- **Cross-platform CI/CD** (Ubuntu, macOS, Windows)
- **Import pattern testing** for all module resolution styles
- **Moon task orchestration** for complex workflows

## 🔧 Development Commands

After generating a package, use these Moon tasks:

```bash
# Setup Go reference repository
bun run setup                    # or: moon run setup

# Development
bun run dev                      # or: moon run dev (watch mode)
bun run build                    # or: moon run build  
bun test                         # or: moon run test

# Documentation  
bun run docs                     # or: moon run docs (build + serve)
bun run docs:build              # or: moon run docs:build
bun run docs:serve              # or: moon run docs:serve

# Testing patterns
bun run test:filter              # or: moon run test:filter
bun run test:compatibility       # or: moon run test:compatibility

# Package.json imports work seamlessly
import { func } from '#src/index.js';     # Clean internal imports
import { helper } from '#test/utils.js';   # Clean test imports
```

## ⚙️ Template Variables

The template supports these variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `goRepo` | ✅ | Go repository URL to port | `https://github.com/rivo/uniseg` |
| `packageName` | ✅ | TypeScript package name | `@tsports/uniseg` |
| `description` | ❌ | Package description | `Unicode text segmentation` |
| `keywords` | ❌ | Additional keywords | `unicode,text,grapheme` |

**Auto-generated variables:**
- `goPackageName` - Extracted from repository URL
- `repositoryUrl` - Generated from package name  
- `generatedKeywords` - Smart keywords based on Go package name

## 📋 Generated Package Workflow

### Phase 1: Generation
- [ ] Configure template repository in `.moon/workspace.yml`
- [ ] Generate package with `moon generate tsport`
- [ ] Run `bun run setup` to clone Go reference

### Phase 2: Implementation  
- [ ] Analyze Go codebase in `test/reference/`
- [ ] Implement TypeScript port in `src/index.ts`
- [ ] Create Go-compatible API in `src/go-style.ts`
- [ ] Add proper types in `src/types.ts` with TSDoc

### Phase 3: Documentation & Testing
- [ ] Add TSDoc comments with examples
- [ ] Generate docs with `bun run docs:build`
- [ ] Create compatibility tests in `test/`
- [ ] Verify all import patterns work

### Phase 4: Publishing
- [ ] Enable GitHub Pages in repository settings
- [ ] Push to main to trigger docs deployment
- [ ] Verify automated documentation builds
- [ ] Publish to NPM when ready

## 📦 Import & Export Patterns

The generated package supports multiple import styles:

### External Usage (for package consumers)
```typescript
// Main TypeScript-native API
import { initializeLibrary, type LibraryOptions } from '@tsports/your-package';

// Go-compatible API  
import { InitializeLibrary } from '@tsports/your-package/go-style';

// Types only
import type { OperationMode } from '@tsports/your-package/types';

// Dynamic imports
const { initializeLibrary } = await import('@tsports/your-package');
```

### Internal Development (within the package)
```typescript
// Clean internal imports (no relative paths!)
import { helper } from '#src/utils.js';
import { LibraryError } from '#src/types.js';
import { testUtil } from '#test/helpers.js';

// Legacy aliases still work
import { util } from '@/utils.js';
import { testHelper } from '~/test/helper.js';
```

## 🧪 Testing Strategy

The template includes comprehensive testing:

```typescript
// Tests all import patterns
import { initializeLibrary } from '../src/index.js';      // Relative
import { srcInit } from '#src/index.js';                  // Package import
import { InitializeLibrary } from '@tsports/package/go-style';  // External

test('import patterns work', () => {
  expect(typeof initializeLibrary).toBe('function');
  expect(typeof srcInit).toBe('function');  
  expect(typeof InitializeLibrary).toBe('function');
});
```

## 🎨 Generated Package Features

### 🔄 Dual API Pattern
```typescript
// TypeScript-native (camelCase, async/await)
import { graphemeCount } from '@tsports/uniseg';
const count = await graphemeCount(text);

// Go-compatible (PascalCase, sync)  
import { GraphemeCount } from '@tsports/uniseg/go-style';
const count = GraphemeCount(text);
```

### 📝 Documentation Integration
```typescript
/**
 * Count grapheme clusters in text
 * 
 * @param text - Input text to analyze
 * @returns Number of grapheme clusters
 * 
 * @example
 * ```typescript
 * const count = await graphemeCount('👨‍👩‍👧‍👦');
 * console.log(count); // 1
 * ```
 * 
 * @since 1.0.0
 */
export async function graphemeCount(text: string): Promise<number>;
```

### 🏗️ Clean Architecture
- **Source organization** with logical module separation
- **Type definitions** with comprehensive TSDoc
- **Test structure** with compatibility verification
- **Build system** with Moon task orchestration

## 🛠️ Template Customization

To extend or modify this template:

1. **Fork the repository** with the template
2. **Modify template files** in the `tsport/` directory  
3. **Update template.yml** with new variables if needed
4. **Test with Moon generate** to verify changes work
5. **Update this README** with your modifications

### Adding New Variables
```yaml
# In template.yml
variables:
  newVariable:
    type: "string"
    required: false
    prompt: "Enter new variable value"
    order: 5
```

Then use `{{ "{{" }} newVariable {{ "}}" }}` in any template file.

## 📚 Resources

- **[Moon Documentation](https://moonrepo.dev/docs)** - Complete Moon guide
- **[TypeDoc Guide](https://typedoc.org)** - Documentation generation
- **[TSDoc Standard](https://tsdoc.org)** - Documentation comment format
- **[Bun Documentation](https://bun.sh/docs)** - Runtime and package manager

## 🤝 Contributing

Contributions to improve the template are welcome!

1. **Issues** - Report bugs or suggest enhancements
2. **Pull Requests** - Submit improvements to the template
3. **Examples** - Share packages created with the template
4. **Documentation** - Help improve this guide

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏆 Packages Using This Template

- [`@tsports/uniseg`](https://github.com/tsports/uniseg) - Unicode text segmentation  
- [`@tsports/lipgloss`](https://github.com/tsports/lipgloss) - Terminal styling
- *Add your package here via PR!*

---

<div align="center">
  <strong>TSports Template - Bringing Go packages to TypeScript with Moon 🚀</strong>
</div>
