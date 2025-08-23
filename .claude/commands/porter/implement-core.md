# Implement Core TSPort Functionality

Use the porter agent to implement the core TypeScript functionality for an existing TSPort package.

**Arguments:**
- $PACKAGE_PATH - Path to the TSPort package (e.g., packages/tsports/uniseg)

**Steps:**

1. Use the porter agent to implement core functionality in the specified package
2. The agent will:
   - Analyze the Go source code structure and APIs
   - Map Go types to appropriate TypeScript equivalents
   - Implement core functionality in src/ modules
   - Ensure TypeScript strict mode compliance
   - Run `moon run build` to verify compilation
   - Create atomic commits for each implementation step
   - Follow the established porting patterns and conventions

**Usage Examples:**
```bash
/porter implement-core packages/tsports/bubbletea
/porter implement-core packages/tsports/termenv  
```

**Quality Assurance:**
- All code must compile with zero TypeScript errors
- Each implementation step is committed atomically
- Follows conventional commit format (feat:, fix:, refactor:)
- Maintains 100% API compatibility with Go original