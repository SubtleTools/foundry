# TSPort Claude Skills

This directory contains Claude Skills that automatically load when working with TSPort packages.

## Available Skills

### 1. `tsport-methodology.md` (always-on)
**Core porting methodology and conventions**
- Dual API pattern (TypeScript-native vs Go-compatible)
- Type mapping reference (primitives, composites, special cases)
- Quality workflow (build, commit, test)
- Go reference location and usage
- Common Go → TypeScript pattern translations

**Automatically loads:** On every TSPort-related task

### 2. `tsport-debugging.md`
**Debugging and fixing issues in ports**
- Test failure diagnosis and fixes
- Type error resolution
- Behavior difference investigation
- Adding missing examples and golden file tests
- Adopting dependencies from other TSPorts
- Floating-point precision fixes
- Unicode/string handling issues

**Triggers on:** "fix", "test fail", "error", "doesn't work", "not matching", "compatibility"

### 3. `tsport-testing.md`
**Testing strategies and compatibility verification**
- Test structure and categories
- Creating test case pairs (Go + TypeScript)
- Special test scenarios (RNG, floats, integers, strings)
- Table-driven test porting
- Golden file testing
- Running and debugging tests
- CI/CD integration

**Triggers on:** "test", "compatibility", "golden file", "test case", "verify"

### 4. `tsport-setup.md`
**Package initialization using Moon templates**
- Moon template generation workflow
- Setting up Go reference
- Creating port status tracker
- Generated package structure
- Common setup issues
- Post-setup checklist

**Triggers on:** "new package", "initialize", "setup", "moon generate", "create port"

## How Skills Work

Skills automatically provide context to Claude when:
1. **Always-on skills** (like `tsport-methodology`) load on every TSPort task
2. **Trigger-based skills** load when your request matches trigger keywords
3. Multiple skills can load simultaneously

## Benefits

- **Automatic context loading**: No need to ask Claude to "read the agent" or commands
- **Focused knowledge**: Each skill provides specific domain expertise
- **Consistent behavior**: Same patterns applied across all TSPort work
- **Reduced token usage**: Only relevant knowledge loads per task

## Usage Examples

When you say:
- "Fix the test failures in gamut" → Loads `methodology` + `debugging` + `testing`
- "Create a new port for go-colorful" → Loads `methodology` + `setup`
- "Adopt uniseg in lipgloss" → Loads `methodology` + `debugging`
- "Add golden file tests" → Loads `methodology` + `testing` + `debugging`

## Skill vs Command vs Agent

- **Skills** (this directory): Automatic knowledge loading based on task
- **Commands** (`.claude/commands/porter/`): Explicit workflows you invoke with `/porter:command-name`
- **Agent** (`.claude/agents/porter.md`): Full agent with all context (larger, used via Task tool)

Use skills for normal work - they're more efficient than loading the full agent every time.

## Maintenance

When updating TSPort methodology:
1. Update relevant skill(s) here
2. Skills auto-apply to all future tasks
3. No need to update agent or commands unless workflow changes
