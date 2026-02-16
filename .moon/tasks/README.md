# Moon Task Configuration

This directory contains shared task configurations for the TSPorts monorepo.

## Task Files

### Base Configurations

- **`node.yml`** - Base tasks for all Node.js/TypeScript projects
  Automatically applied to all projects with `language: "typescript"`
  - `format`: Code formatting check (Prettier)
  - `format-write`: Code formatting with auto-fix (Prettier)
  - `test`: Testing (Bun test - will be overridden by tag-tests.yml)
  - `typecheck`: Type checking (basic)

### Tag-Based Configurations

Apply these via the `tags` field in package `moon.yml`:

#### **`tag-library.yml`** - Tag: `library`
Standard TypeScript library tasks. All TSPort packages should use this tag.

**Provides:**
- `build`: TypeScript compilation via tsc
- `clean`: Clean build artifacts (dist, coverage, .nyc_output)
- `dev`: Watch mode development
- `format`: Code formatting with dprint
- `lint`: Linting with Biome (supports `--write` via `mergeArgs: append`)
- `typecheck`: Type checking without emit
- `prepack`: Pre-publish quality checks (clean → lint → format → typecheck → build → test)

#### **`tag-tests.yml`** - Tag: `tests`
Testing tasks for all packages.

**Provides:**
- `test`: Bun test with JUnit output
- `test-failed`: Run only failed tests

#### **`tag-docs.yml`** - Tag: `docs`
Documentation generation tasks for packages with API docs.

**Provides:**
- `build-docs`: Generate API docs with TypeDoc
- `docs`: Serve documentation locally with VitePress
- `docs-build`: Build documentation site for production
- `prepack`: Extends base prepack to include build-docs

#### **`tag-tsc.yml`** - Tag: `tsc`
Alternative TypeScript compilation tasks (not currently used by TSPort packages).

## TSPort Package Configuration

All TSPort packages follow this standard structure:

### Standard Package (e.g., termenv, uniseg, go-osc52)

```yaml
$schema: "https://moonrepo.dev/schemas/project.json"

language: "typescript"
type: "library"

tags: ["library", "tests", "docs"]
```

This inherits all standard tasks from `tag-library.yml`, `tag-tests.yml`, and `tag-docs.yml`.

### Package with Custom Build (e.g., go-colorful, lipgloss)

```yaml
$schema: "https://moonrepo.dev/schemas/project.json"

language: "typescript"
type: "library"

tags: ["library", "tests", "docs"]

tasks:
  # Override build with custom process
  build:
    command: "bun"
    args: ["run", "build"]  # or "build:rollup", etc.
    inputs:
      - "src/**/*"
      - "tsconfig.json"
    outputs:
      - "dist/**/*"
```

This uses all standard tasks but overrides `build` for custom bundling.

### Package without Docs (e.g., gamut)

```yaml
$schema: "https://moonrepo.dev/schemas/project.json"

language: "typescript"
type: "library"

tags: ["library", "tests"]
```

Omit the "docs" tag if the package doesn't generate documentation.

## Common Tasks

### Development
```bash
moon :dev          # Watch mode for all projects
moon :typecheck    # Check types without building
moon :build        # Build all projects
```

### Quality Checks
```bash
moon :lint                    # Lint all projects (read-only)
moon :lint -- --write         # Lint and auto-fix
moon :lint -- --write --unsafe  # Lint and apply unsafe fixes
moon :format                  # Format all projects
moon :test                    # Run all tests
```

### Publishing
```bash
moon :prepack      # Run all quality checks (clean → lint → format → typecheck → build → test → build-docs)
```

### Documentation
```bash
moon :build-docs   # Generate API documentation
moon :docs         # Serve documentation locally
moon :docs-build   # Build documentation for production
```

## Task Inheritance Order

Tasks are inherited in this order (later overrides earlier):

1. **Language-based config** (`node.yml`) - automatic for `language: "typescript"`
2. **Tag-based configs** (`tag-*.yml`) - via `tags: ["library", "tests", "docs"]`
3. **Project-specific config** (`packages/*/moon.yml`) - explicit task definitions

## Tool Version Management

All tools are version-managed via [proto](https://moonrepo.dev/proto):

```toml
# .prototools
moon = "1.39.4"
bun = "1.2.20"
node = "22.17.1"
```

This ensures consistent tool versions across all developers and CI environments.

## Configuration Rules

### ✅ DO

1. **Use the `library` tag** for all TSPort packages
2. **Use the `tests` tag** for all packages with tests
3. **Use the `docs` tag** for packages that generate API documentation
4. **Override tasks minimally** - only when you have a truly custom requirement
5. **Use `mergeArgs: append`** when you want to add arguments to existing tasks

### ❌ DON'T

1. **Don't duplicate tasks** that are already in shared configs
2. **Don't create custom tasks** for standard operations (lint, format, test, build)
3. **Don't hardcode tool versions** - use proto (.prototools)
4. **Don't add `--write` or `--fix` flags** to task definitions - let users pass them via CLI

## Troubleshooting

### Task not found
If moon says "Unknown task", check that your package has the appropriate tag:
- Missing `:lint`? Add `"library"` tag
- Missing `:test`? Add `"tests"` tag
- Missing `:build-docs`? Add `"docs"` tag

### Arguments appearing twice
Remove the argument from the task definition. The shared tasks use `mergeArgs: append` so you can pass arguments via CLI:
```bash
moon :lint -- --write    # ✅ Correct
# vs
args: ["check", "--write"]  # ❌ Don't do this in yml
```

### Different command being run
Verify the package has the correct tags. Run:
```bash
moon task <package>:lint --json
```
To see the actual command configuration.

## Current Package Status

All packages standardized ✅

| Package | Tags | Custom Tasks | Notes |
|---------|------|--------------|-------|
| gamut | library, tests | - | Standard |
| go-colorful | library, tests, docs | build | Custom bun build for minification |
| go-osc52 | library, tests, docs | - | Standard |
| lipgloss | library, tests | build | Custom rollup build |
| termenv | library, tests, docs | - | Standard |
| uniseg | library, tests, docs | - | Standard |

## Maintenance

When adding new shared tasks:
1. Add to appropriate tag file (`tag-*.yml`)
2. Test with at least one package: `moon <package>:<task>`
3. Update this README
4. Consider if existing packages need tag updates
