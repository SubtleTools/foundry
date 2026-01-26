---
name: tsport-setup
description: Setting up new TSPort packages using Moon templates. Use when initializing a new port or setting up the project structure.
trigger:
  - "new package"
  - "initialize"
  - "setup"
  - "moon generate"
  - "create port"
---

# TSPort Package Setup

Setting up a new TSPort package MUST use the Moon template system - never create packages manually.

## CRITICAL: Moon Template is MANDATORY

**NEVER manually create package files.** Always use Moon template generation.

## Setup Workflow

### Step 1: Collect Required Information

Before starting, you need:
- **Go Repository URL**: Full GitHub URL (e.g., `https://github.com/lucasb-eyer/go-colorful`)
- **Package Name**: WITHOUT `@tsports/` prefix (e.g., `go-colorful`)
- **Description**: Short description (can be auto-generated)

**Ask the user if any are missing.**

### Step 2: Generate Package via Moon

```bash
# Run Moon template generator with ALL arguments (avoid interactive prompts)
moon generate tsport-package -- \
  --goRepo="<GO_REPO_URL>" \
  --packageName="@tsports/<PACKAGE_NAME>" \
  --description="<DESCRIPTION>"
```

**Example:**
```bash
moon generate tsport-package -- \
  --goRepo="https://github.com/lucasb-eyer/go-colorful" \
  --packageName="@tsports/go-colorful" \
  --description="Color manipulation library"
```

### Step 3: Set Up Go Reference

```bash
# Navigate to package (use name WITHOUT @tsports/ prefix)
cd packages/tsports/<PACKAGE_NAME>

# Run setup script (clones Go source to test/reference/)
bun run setup
```

### Step 4: Create Port Status Tracker

Immediately create `port_status.md` in the package root:

```markdown
# Port Status: <package-name>

## Status: 🚧 In Progress

| Go File | TS File | Status | Notes |
|---------|---------|--------|-------|
| `main.go` | `src/index.ts` | ⏳ Pending | Not started |
| `types.go` | `src/types.ts` | ⏳ Pending | Not started |

## Next Steps
- [ ] Implement core types
- [ ] Implement main functions
- [ ] Add tests
- [ ] Verify compatibility
```

**Update this after EVERY step.**

### Step 5: Initial Commit

```bash
# Verify build passes
moon run build  # MUST have zero errors

# Commit initial structure
git add .
git commit -m "feat(<package-name>): initialize tsport package structure"
```

## Generated Package Structure

Moon template creates:
```
packages/tsports/<package-name>/
├── src/
│   ├── index.ts              # TypeScript-native API (camelCase)
│   ├── go-style.ts           # Go-compatible API (PascalCase)
│   └── types.ts              # Core types and interfaces
├── test/
│   ├── reference/            # Go reference (created by setup script)
│   ├── basic.test.ts         # Basic test template
│   └── automated-cases.test.ts # Compatibility test framework
├── scripts/
│   └── setup-reference.ts    # Go reference setup script
├── moon.yml                  # Moon task configuration
├── template.yml              # Template metadata
├── package.json              # Auto-configured with package details
├── tsconfig.json             # Optimal Bun configuration
├── README.md                 # Template documentation
├── CHANGELOG.md              # Version history template
└── LICENSE                   # MIT license
```

## What Moon Template Provides

✅ **Automatic:**
- Package structure in `packages/tsports/` directory
- All template files with variables replaced
- Moon task configuration (build, test, etc.)
- TypeScript configuration optimized for Bun
- Test infrastructure with basic and automated tests
- Documentation templates (README, CHANGELOG)
- CI/CD workflows in `.github/workflows/`

✅ **Setup Script Handles:**
- Cloning Go reference repository
- Placing reference in `test/reference/` (ALWAYS this location)
- Initial dependency installation

## Using Moon Tasks

After generation, use Moon for all operations:

```bash
# Build TypeScript
moon run build

# Run tests
moon run test

# Clean build artifacts
moon run clean

# Setup Go reference (if not done automatically)
moon run setup
```

## Package Configuration

### package.json Exports

Template configures dual API exports:
```json
{
  "name": "@tsports/<package-name>",
  "version": "0.1.0",
  "exports": {
    ".": "./src/index.ts",           // TypeScript-native (camelCase)
    "./go-style": "./src/go-style.ts" // Go-compatible (PascalCase)
  }
}
```

### tsconfig.json

Template uses Bun-optimized configuration:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Common Setup Issues

### Issue: Moon not installed
```bash
# Install Moon globally
npm install -g @moonrepo/cli
```

### Issue: Bun not installed
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

### Issue: Setup script fails to clone Go repo
```bash
# Manually clone if needed
cd test
git clone <GO_REPO_URL> reference
cd ..
```

### Issue: Template variables not replaced
**Solution:** Ensure all arguments provided to `moon generate`:
```bash
# BAD: missing arguments triggers interactive prompts
moon generate tsport-package

# GOOD: all arguments provided
moon generate tsport-package -- --goRepo="..." --packageName="..." --description="..."
```

## Directory Naming

- Package directory: Use name WITHOUT `@tsports/` prefix
  - Package name: `@tsports/go-colorful`
  - Directory: `packages/tsports/go-colorful`

- Go reference ALWAYS at: `test/reference/`

## Initial File Contents

### src/index.ts (Template)
```typescript
// TypeScript-native API exports (camelCase)
export * from './types';

// TODO: Add your camelCase exports here
```

### src/go-style.ts (Template)
```typescript
// Go-compatible API exports (PascalCase)
import * as core from './index';

// TODO: Add PascalCase wrappers here
// Example:
// export const SomeFunction = core.someFunction;
```

### src/types.ts (Template)
```typescript
// Core type definitions
// TODO: Add your type definitions here
```

## Post-Setup Checklist

After running template generation:
- [ ] Package directory created in `packages/tsports/<name>/`
- [ ] `bun run setup` executed successfully
- [ ] Go reference cloned to `test/reference/`
- [ ] `moon run build` passes (even with empty implementation)
- [ ] `port_status.md` created with file inventory
- [ ] Initial commit made
- [ ] Ready to start implementation

## Next Steps After Setup

1. **Analyze Go source** in `test/reference/`
2. **Identify types and functions** to port
3. **Update port_status.md** with complete file list
4. **Begin implementation** following porter methodology
5. **Commit frequently** with passing builds

## Template Customization

Moon template is located at:
```
templates/tsport-package/
```

If you need to update the template, modify files there and they'll apply to all future generations.

## Multi-Package Ports

For libraries with multiple sub-packages:
1. Generate main package first
2. Analyze dependencies in Go reference
3. Generate additional packages as needed
4. Link via `package.json` dependencies:
   ```json
   {
     "dependencies": {
       "@tsports/dependency-package": "workspace:*"
     }
   }
   ```

## Workspace Integration

TSports uses Bun workspaces - all `@tsports/*` packages auto-link:
```json
// Root package.json
{
  "workspaces": ["packages/tsports/*"]
}
```

This means you can import other TSPorts immediately:
```typescript
import { Color } from '@tsports/go-colorful';
```
