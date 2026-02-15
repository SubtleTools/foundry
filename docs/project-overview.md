# Project Overview

TSPorts is a collection of **100% API-compatible TypeScript ports** of popular Go libraries from the [Charm](https://charm.sh/) terminal UI ecosystem. Each package mirrors its Go source so that developers familiar with the Go API can use the same patterns in TypeScript/Node.js.

## Monorepo Layout

```
tsports/
├── packages/tsports/       # Published @tsports/* packages
│   ├── gamut/              # Color palettes and blending
│   ├── go-colorful/        # Color manipulation (Lab, Luv, HCL, etc.)
│   ├── go-osc52/           # OSC52 terminal clipboard
│   ├── lipgloss/           # Terminal styling and layout
│   ├── termenv/            # Terminal environment detection
│   └── uniseg/             # Unicode text segmentation
├── libs/dev/               # Shared internal libraries (not published)
│   ├── test-utils/         # Shared test comparison, golden files, runners
│   └── versioning/         # Version encoding/decoding + CLI bump scripts
├── templates/
│   └── tsport-package/     # Moon template for scaffolding new ports
├── .moon/                  # Moon workspace configuration
└── docs/                   # Contributor documentation (you are here)
```

## Package Inventory

| Package | Go Source | Go Version | npm Version | Status |
|---------|-----------|------------|-------------|--------|
| `@tsports/go-colorful` | [lucasb-eyer/go-colorful](https://github.com/lucasb-eyer/go-colorful) | v1.2.0 | 1.2.0 | Foundational |
| `@tsports/uniseg` | [rivo/uniseg](https://github.com/rivo/uniseg) | v0.4.7 | 0.4.701 | Foundational |
| `@tsports/go-osc52` | [aymanbagabas/go-osc52](https://github.com/aymanbagabas/go-osc52) | v2.0.14 | 2.0.1400 | Standalone |
| `@tsports/gamut` | [muesli/gamut](https://github.com/muesli/gamut) | v1.0.0 | 1.0.0 | Depends on go-colorful |
| `@tsports/termenv` | [muesli/termenv](https://github.com/muesli/termenv) | v0.16.0 | 0.16.0 | Depends on go-colorful, uniseg |
| `@tsports/lipgloss` | [charmbracelet/lipgloss](https://github.com/charmbracelet/lipgloss) | v1.1.0 | 1.1.0 | Depends on go-colorful, termenv, uniseg |

## Dependency Graph

```
go-colorful ─┬─► gamut
             ├─► termenv ──► lipgloss
uniseg ──────┤              ▲
             └──────────────┘
go-osc52 (standalone)
```

## Tooling

| Tool | Purpose |
|------|---------|
| [Bun](https://bun.sh/) | Package manager, runtime, and test runner. **Never use npm.** |
| [Moon](https://moonrepo.dev/) | Monorepo task runner and project orchestrator |
| [Biome](https://biomejs.dev/) | Linting |
| [dprint](https://dprint.dev/) | Formatting |
| TypeScript 5.9+ | Type checking and compilation |

### Moon Workspace

Moon discovers projects via these globs (`.moon/workspace.yml`):

```yaml
projects:
  - 'apps/*'
  - 'libs/*'
  - 'packages/tsports/*'
```

Pre-commit hooks run `moon run :lint :format --affected --status=staged` automatically.

### Common Commands

```bash
bun install                       # Install all dependencies
moon run :test                    # Run all tests across packages
moon run :build                   # Build all packages
moon run :lint                    # Lint all packages
moon run :typecheck               # Type-check all packages
moon generate tsport-package      # Scaffold a new port from template
```

## Key Conventions

### Dual API Pattern

Every package exports two API styles:

1. **TypeScript-style** (`src/index.ts`) — camelCase functions, idiomatic TS
2. **Go-style** (`src/go-style.ts`) — PascalCase functions matching Go names

Both are exposed via `package.json` exports:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./go-style": "./src/go-style.ts",
    "./types": "./src/types.ts"
  }
}
```

### `portInfo` in package.json

Every package tracks its Go source with a `portInfo` field:

```json
{
  "portInfo": {
    "sourceRepo": "https://github.com/muesli/gamut",
    "sourceVersion": "v1.0.0",
    "tsportVersion": 0,
    "lastUpdated": "2024-08-24T12:00:00Z"
  }
}
```

This is used by the versioning system to encode npm versions. See [versioning.md](./versioning.md) for details.

### Package Imports

Packages use `package.json` imports for clean internal paths:

```json
{
  "imports": {
    "#src/*": "./src/*",
    "#test/*": "./test/*"
  }
}
```

## Further Reading

- [Versioning](./versioning.md) — how Go versions map to npm versions
- [Shared Libraries](./shared-libraries.md) — `@dev/test-utils` and `@dev/versioning`
- [Creating a New Port](./creating-a-new-port.md) — step-by-step guide
