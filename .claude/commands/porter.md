# Porter - Go-to-TypeScript Porting Assistant

Use the porter agent for Go-to-TypeScript porting tasks following the TSports methodology.

## Quick Start

**Port an entire library (recommended):**
```bash
/porter:port-library <go-repo-url> <package-name> [description]

# Example:
/porter:port-library https://github.com/lucasb-eyer/go-colorful go-colorful "Color manipulation library"
```

This orchestrator command runs the full workflow using subagents to preserve your context window.

## Individual Commands

For manual control or resuming work:

| Command | Purpose |
|---------|---------|
| `/porter:new-tsport` | Create new TSPort package from Moon template |
| `/porter:implement-core` | Implement core TypeScript functionality |
| `/porter:add-tests` | Add comprehensive compatibility tests |
| `/porter:check-compatibility` | Verify Go-TypeScript compatibility |
| `/porter:finalize-package` | Complete package for publication |
| `/porter:port-struct` | Convert single Go struct to TypeScript |

**Usage:**
```bash
/porter:new-tsport <go-repo-url> <@tsports/name> <description>
/porter:implement-core <package-path>
/porter:add-tests <package-path>
/porter:check-compatibility <package-path>
/porter:finalize-package <package-path>
/porter:port-struct "<go-code>" or <file-path>
```

## Porter Agent Capabilities

The porter agent follows the established TSports methodology for creating 100% API-compatible TypeScript ports of Go libraries. It handles:

**Go Analysis:**
- Package structure and dependencies
- Type mapping (primitives, composites, generics)
- Special patterns (RNG, 64-bit integers, build tags, CGO)
- Concurrency primitives (goroutines, channels, select)
- Error handling patterns
- Interface satisfaction (implicit → explicit)

**TypeScript Implementation:**
- Moon template system for optimal structure
- Dual API support (native + Go-compatible)
- Strict mode compliance
- Proper null/undefined handling

**Quality Assurance:**
- Atomic commits (conventional format)
- TypeScript compilation verification
- Comprehensive compatibility tests
- API surface comparison

## TSPort Package Structure

```
packages/tsports/<package-name>/
├── src/
│   ├── index.ts        # TypeScript-native API
│   ├── go-style.ts     # Go-compatible API wrapper
│   └── types.ts        # Core types and interfaces
├── test/
│   ├── reference/      # Go reference implementation
│   ├── cases/          # Compatibility test cases
│   └── *.test.ts       # TypeScript tests
├── port_status.md      # Porting progress tracker
├── compatibility_report.md  # Verification results
└── package.json        # TSPort versioning configured
```

## Quality Standards

- 100% API compatibility with Go original
- Zero TypeScript compilation errors
- Comprehensive test coverage with Go output matching
- Atomic commits following conventional commit format
- Complete documentation with migration guides

## Workflow Overview

```
┌─────────────────┐
│ 1. Initialize   │  /porter:new-tsport
│    Package      │  Moon template + Go reference
└────────┬────────┘
         │
┌────────▼────────┐
│ 2. Analyze &    │  Identify patterns, plan order
│    Plan         │  Update port_status.md
└────────┬────────┘
         │
┌────────▼────────┐
│ 3. Implement    │  /porter:implement-core
│    Core Logic   │  Type mapping, structural conversion
└────────┬────────┘
         │
┌────────▼────────┐
│ 4. Add Tests    │  /porter:add-tests
│                 │  Compatibility verification
└────────┬────────┘
         │
┌────────▼────────┐
│ 5. Verify       │  /porter:check-compatibility
│    Compatibility│  API surface, numeric precision
└────────┬────────┘
         │
┌────────▼────────┐
│ 6. Finalize     │  /porter:finalize-package
│    & Publish    │  Documentation, CI/CD
└─────────────────┘
```

## Special Go Patterns

The porter handles these Go-specific challenges:

| Go Pattern | TypeScript Solution |
|------------|---------------------|
| `math/rand` (seeded) | Port exact RNG algorithm |
| `int64` bitwise ops | Use `BigInt` |
| `//go:build` tags | Runtime detection or bundler config |
| `init()` functions | Explicit initialization |
| Goroutines/channels | Promises, async/await, custom Channel |
| `defer` | try/finally or `using` declaration |
| Nil slices/maps | Null checks with safe defaults |
| Implicit interfaces | Explicit `implements` |

## Example Session

```bash
# Full automated port
/porter:port-library https://github.com/muesli/termenv termenv

# Or step-by-step
/porter:new-tsport https://github.com/muesli/termenv @tsports/termenv "Terminal environment detection"
/porter:implement-core packages/tsports/termenv
/porter:add-tests packages/tsports/termenv
/porter:check-compatibility packages/tsports/termenv
/porter:finalize-package packages/tsports/termenv

# Convert individual struct
/porter:port-struct "type Profile struct { Colors ColorProfile; Writer io.Writer }"
```
