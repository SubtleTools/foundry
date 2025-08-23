# Porter - Go-to-TypeScript Porting Assistant

Use the porter agent for Go-to-TypeScript porting tasks following the TSports methodology.

**Available Commands:**

- **`/porter new-tsport <go-repo-url> <package-name> <description>`** - Create new TSPort package
- **`/porter implement-core <package-path>`** - Implement core TypeScript functionality  
- **`/porter add-tests <package-path>`** - Add comprehensive compatibility tests
- **`/porter port-struct <go-code>`** - Convert Go struct to TypeScript class
- **`/porter check-compatibility <package-path>`** - Verify Go-TypeScript compatibility
- **`/porter finalize-package <package-path>`** - Complete package for publication

**Porter Agent Capabilities:**

The porter agent follows the established TSports methodology for creating 100% API-compatible TypeScript ports of Go libraries. It handles:

- **Package Creation**: Uses Moon template system for optimal structure
- **Type Conversion**: Maps Go types to appropriate TypeScript equivalents
- **API Compatibility**: Maintains identical public interface to Go original
- **Testing**: Creates comprehensive compatibility test suites
- **Quality Assurance**: Ensures TypeScript strict mode compliance
- **Documentation**: Generates TypeScript-specific docs and examples
- **Publishing**: Configures TSPort versioning and NPM publishing

**TSPort Package Structure:**
```
packages/tsports/package-name/
├── src/
│   ├── index.ts        # TypeScript-native API
│   ├── go-style.ts     # Go-compatible API wrapper
│   └── types.ts        # Core types and interfaces
├── test/
│   ├── reference/      # Go reference implementation
│   └── corpus/         # Compatibility test cases
└── package.json        # TSPort versioning configured
```

**Quality Standards:**
- 100% API compatibility with Go original
- Zero TypeScript compilation errors
- Comprehensive test coverage with Go output matching
- Atomic commits following conventional commit format
- Complete documentation with migration guides

**Usage Examples:**
```bash
# Create new port
/porter new-tsport https://github.com/charmbracelet/bubbletea @tsports/bubbletea "TUI framework"

# Implement functionality  
/porter implement-core packages/tsports/bubbletea

# Add tests
/porter add-tests packages/tsports/bubbletea

# Finalize for publishing
/porter finalize-package packages/tsports/bubbletea
```