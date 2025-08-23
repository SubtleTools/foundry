# TSports - Go-to-TypeScript Ports

A collection of TypeScript ports of popular Go libraries from the Charm ecosystem, providing 100% API-compatible TypeScript implementations.

## Project Structure

This monorepo follows the `packages/org/package-name` convention:

### Packages

- **`packages/tsports/go-colorful/`** - Color manipulation and palettes ([Go original](https://github.com/lucasb-eyer/go-colorful))
- **`packages/tsports/go-osc52/`** - Terminal clipboard integration ([Go original](https://github.com/aymanbagabas/go-osc52)) 
- **`packages/tsports/uniseg/`** - Unicode text segmentation ([Go original](https://github.com/rivo/uniseg))

### Templates

- **`templates/tsport-package/`** - Template for new TSport packages with Moon integration

## TSPort Versioning Strategy

TSPort packages use a special versioning strategy that tracks both the original Go version and TypeScript-specific patches:

- **Format**: `{go-version}-tsport[.{patch}]`
- **Examples**: `1.2.3-tsport`, `1.2.3-tsport.1`
- **Purpose**: Maintains compatibility tracking while allowing TypeScript-specific updates

## Development

### Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Moon](https://moonrepo.dev/) - Task runner and workspace management

### Common Tasks

```bash
# Install dependencies
bun install

# Run all tests across packages
moon run :test

# Build all packages
moon run :build

# Run linting
moon run :lint

# Type check all packages
moon run :typecheck
```

### Package-Specific Tasks

```bash
# Work on a specific package
moon run go-colorful:test
moon run uniseg:build
moon run go-osc52:dev
```

## Creating New TSPorts

Use the porter agent and templates to create new TypeScript ports:

```bash
# Generate new package from template
moon generate tsport-package
```

Each TSPort package includes:
- 100% API compatibility with Go original
- Comprehensive test suite with Go output comparison
- TypeScript strict mode compliance
- Automated CI/CD with GitHub Actions
- TSPort-aware versioning and publishing
