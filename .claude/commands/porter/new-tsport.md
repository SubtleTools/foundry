# Create New TSPort Package

Create a new TypeScript port from a Go package using the Moon template system.

**Arguments:** `$ARGUMENTS`
Parse from arguments or prompt for:
- `GO_REPO_URL` - The Go repository URL to port
- `PACKAGE_NAME` - The TypeScript package name (e.g., @tsports/package-name)
- `DESCRIPTION` - Package description

## Workflow

### Step 1: Collect Arguments
If any arguments are missing, ask the user for them before proceeding. Suggest `@tsports/[package-name]` format for package names.

### Step 2: Generate Package via Moon Template
```bash
moon generate tsport-package -- --goRepo="$GO_REPO_URL" --packageName="$PACKAGE_NAME" --description="$DESCRIPTION"
```

**CRITICAL: NEVER manually create package files - the Moon template is MANDATORY.**

### Step 3: Set Up Go Upstream Source
```bash
cd packages/tsports/<package-name>  # Use package name without @tsports/ prefix
git submodule update --init upstream/<package-name>
```

### Step 4: Create Port Status Tracker
Immediately create `port_status.md` in the package root with this structure:

```markdown
# Port Status: <package-name>

| Go File | TS File | Status | Notes |
|---------|---------|--------|-------|
| `main.go` | `src/index.ts` | Pending | Not started |
```

Update this tracker after EVERY implementation step.

### Step 5: Initial Commit
```bash
moon run build  # MUST pass with zero errors
git add .
git commit -m "feat(<package-name>): initialize tsport package structure"
```

## Generated Structure
```
packages/tsports/<package-name>/
├── src/
│   ├── index.ts              # TypeScript-native API
│   ├── go-style.ts           # Go-compatible API
│   └── types.ts              # Core types and interfaces
├── test/
│   ├── basic.test.ts         # Basic test template
│   └── automated-cases.test.ts # Compatibility testing
├── upstream/<pkg>/           # Go upstream source (git submodule)
├── moon.yml                  # Moon task configuration
├── package.json              # Package configuration
└── tsconfig.json             # TypeScript configuration
```

## Usage Examples
```bash
/porter:new-tsport https://github.com/charmbracelet/bubbletea @tsports/bubbletea "TUI framework based on Elm Architecture"
/porter:new-tsport https://github.com/muesli/termenv @tsports/termenv "Terminal environment detection"
```
