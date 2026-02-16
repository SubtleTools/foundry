# Lipgloss TypeScript Test Automation System

## Overview

This directory contains the automated test system for ensuring 100% compatibility between the TypeScript port and the Go reference implementation of Lipgloss.

## Architecture

### 1. Git Submodule Integration

- `reference/` - Git submodule pointing to the official Go Lipgloss repository
- Automatically updated to track new releases
- Uses `patches/` directory for monkey-patching the reference when needed
- Common patches include: force color output, disable TTY detection, test-specific modifications

### 2. Test Case Structure

```
test/corpus/
├── go.mod                         # Single Go module for all test cases
├── go.sum                         # Go dependencies lockfile
├── basic/
│   ├── 001-basic-render/
│   │   ├── case.go
│   │   ├── case.ts
│   │   └── metadata.json
│   └── 002-color-basic/
├── layout/
├── border/
├── color/
├── advanced/
├── component/
└── example/
```

### 3. Dependency Analysis

- Automatic dependency graph generation from Go source
- Test execution order based on API complexity hierarchy
- Ensures foundational features are tested before complex combinations

### 4. Automated Execution

- Single command runs all compatibility tests
- Version-specific output comparison
- Detailed diff reporting for failures

## Usage

```bash
# Initialize and update reference
npm run test:init-reference

# Run all compatibility tests
npm run test:compatibility

# Run specific test suite
npm run test:compatibility -- --suite=basic

# Update expected outputs from Go reference
npm run test:update-expected
```

## Patch Management

### Applying Patches

The `patches/` directory contains modifications needed for testing compatibility:

- **FORCE_COLOR.patch** - Forces color output in non-TTY environments
- **applied-patches.json** - Tracks which patches have been applied

### Creating New Patches

```bash
# Make changes in the reference directory
cd reference/
# Edit files as needed

# Create patch from changes
cd ..
git diff --no-index reference/ > patches/my-new-patch.patch

# Apply patch systematically
cd reference/
patch -p1 < ../patches/my-new-patch.patch

# Track applied patches
echo '"my-new-patch.patch"' >> patches/applied-patches.json
```

### Updating Reference with Patches

When updating the reference submodule:

```bash
# Update submodule
cd reference/
git fetch origin
git checkout v1.2.0  # New version

# Reapply all patches
cd ..
for patch in $(cat patches/applied-patches.json | jq -r '.[]'); do
    cd reference/
    patch -p1 < ../patches/$patch
    cd ..
done
```

## Test Case Categories

1. **Basic API** - Core style operations, rendering fundamentals
2. **Layout** - Padding, margins, dimensions, alignment
3. **Borders** - All border types and combinations
4. **Colors** - Foreground, background, color profiles
5. **Components** - Tables, lists, trees
6. **Advanced** - Complex style combinations, edge cases
7. **Examples** - Full example programs from the Go repository
