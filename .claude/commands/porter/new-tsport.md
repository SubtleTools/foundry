# Create New TSPort Package

Create a new TypeScript port from a Go package using the Moon template system.

**Arguments:**
- $GO_REPO_URL - The Go repository URL to port
- $PACKAGE_NAME - The TypeScript package name (e.g., @tsports/package-name) 
- $DESCRIPTION - Package description

**Steps:**

1. Use the porter agent to create a new TSPort package following the established methodology
2. The agent will:
   - Collect all required arguments (Go repo URL, package name, description)
   - Generate the package using Moon template system
   - Set up the proper package structure under packages/tsports/
   - Configure all template variables and files
   - Clone the Go reference repository for testing
   - Provide guidance for next implementation steps

**Usage Examples:**
```bash
/porter new-tsport https://github.com/charmbracelet/bubbletea @tsports/bubbletea "TUI framework based on Elm Architecture"
/porter new-tsport https://github.com/muesli/termenv @tsports/termenv "Terminal environment detection"
```

**Note:** If arguments are not provided, the porter agent will interactively collect them before proceeding.