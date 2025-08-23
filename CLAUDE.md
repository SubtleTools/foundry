# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript port of the Charm ecosystem projects, currently containing Go-based terminal UI libraries including:

- **Bubble Tea** - A TUI framework based on The Elm Architecture
- **Bubbles** - Common UI components for Bubble Tea
- **Lipgloss** - Terminal styling library
- **Charm X** - Extended utilities and experimental features
- **Termenv** - Terminal environment detection

The repository structure follows a federated approach with each library in its own directory under vendor namespaces (charmbracelet/, muesli/, lovely/).

## Development Commands

### Go Projects (Current Implementation)
Each Go module has its own commands. Use `task` (Taskfile) where available:

**Testing:**
```bash
# Individual modules
cd charmbracelet/bubbletea && go test ./...
cd charmbracelet/bubbles && go test ./...

# With task runner
cd charmbracelet/bubbletea && task test
```

**Linting:**
```bash
# Individual modules
cd charmbracelet/bubbletea && golangci-lint run

# With task runner
cd charmbracelet/bubbletea && task lint
```

### TypeScript Port (Future)
When TypeScript implementations are added:
- Use `bun` for package management (never npm)
- Follow the existing directory structure pattern
- Maintain compatibility with Go API designs

## Architecture Notes

- **Multi-module structure**: Each library is independent with its own go.mod
- **Elm Architecture pattern**: Bubble Tea follows Init/Update/View pattern
- **Component-based**: Bubbles provides reusable UI components
- **Style separation**: Lipgloss handles all terminal styling concerns
- **Cross-platform**: Includes platform-specific implementations for Windows/Unix

## Key Directories

- `charmbracelet/bubbletea/` - Core TUI framework
- `charmbracelet/bubbles/` - UI component library
- `charmbracelet/lipgloss/` - Styling and layout
- `charmbracelet/x/` - Experimental and extended features
- `muesli/termenv/` - Terminal environment detection
- `lovely/` - Placeholder for future TS implementations

## Testing Approach

- Each module includes comprehensive unit tests
- Golden file testing used for consistent output validation
- Example programs serve as integration tests
- Platform-specific tests for Windows/Unix differences

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
