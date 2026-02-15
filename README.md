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

TSPort packages use standard semver versions that encode both the Go upstream version and a TypeScript-specific patch number:

**Format:** `{GoMajor}.{GoMinor}.{(GoPatch × 100) + tsPatch}`

This is fully reversible: `npmPatch / 100` = Go patch, `npmPatch % 100` = TS patch.

| Go version | TS patch | npm version |
|------------|----------|-------------|
| 1.2.0      | 0        | 1.2.0       |
| 1.2.0      | 3        | 1.2.3       |
| 1.2.3      | 0        | 1.2.300     |
| 1.2.3      | 5        | 1.2.305     |
| 0.4.7      | 1        | 0.4.701     |
| 2.0.14     | 0        | 2.0.1400    |

Standard semver ranges (`^`, `~`) work correctly with this scheme — no dist-tag tricks needed. Each package's `portInfo` in `package.json` still records the original Go source version for human reference.

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
