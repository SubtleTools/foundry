# Port New Upstream Version

Port newer upstream Go versions for a project using isolated git worktrees and parallel porter subagents.

**Usage:** `/porter:port-new-version <PROJECT>`

**Example:** `/porter:port-new-version go-colorful`

## Workflow

### Step 1: Check for new versions

Run the version check script:

```bash
bun run scripts/check-version-for-project.ts $ARGUMENTS
```

Parse the JSON output. If `hasUpdates` is false, inform the user that the project is already up to date and stop.

### Step 2: Ask user which versions to port

If there are multiple newer versions, use `AskUserQuestion` with multi-select to let the user choose:
- Each version as an option (newest first)
- Include "All versions" as the first option
- If only one version, skip the question — just confirm and proceed

### Step 3: Create worktrees (sequential)

For each selected version (oldest first), run:

```bash
bun run scripts/setup-worktree.ts $PROJECT $VERSION
```

Collect the JSON results. Display a summary table of created worktrees:

| Version | Branch | Worktree Path |
|---------|--------|---------------|

### Step 4: Launch porter subagents (parallel, in background)

For each worktree, launch a `porter` subagent via the `Task` tool with `run_in_background: true`.

Use this prompt template for each subagent:

```
You are a Go-to-TypeScript porter working in an isolated git worktree.

Project: {PROJECT} | Version: v{VERSION}
Worktree: {WORKTREE_PATH}
Package: {WORKTREE_PATH}/packages/tsports/{PROJECT}/
Branch: {PROJECT}/v{VERSION}

TASK:
1. Read PORT_REPORT.md at the package path
2. For each changed Go file in the report:
   a. Read Go source in upstream/{PROJECT}/
   b. Read corresponding TS file in src/
   c. Port changes (camelCase for TS API, update go-style.ts for new exports)
   d. Run: cd {WORKTREE_PATH} && moon run {PROJECT}:build (must pass)
   e. Commit: git -C {WORKTREE_PATH} add -A && git commit -m "feat({PROJECT}): port <component> from v{VERSION}"
3. After all files:
   a. Update src/index.ts and src/go-style.ts exports
   b. Run tests: cd {PACKAGE_PATH} && bun test
   c. Fix failures if any
   d. Update CHANGELOG.md
   e. Final commit: git -C {WORKTREE_PATH} commit -am "feat({PROJECT}): complete port of upstream v{VERSION}"
4. Report: files changed, functions added, test results, issues

RULES:
- All git ops use: git -C {WORKTREE_PATH}
- Commit only when build passes
- Conventional commits: feat({PROJECT}), fix({PROJECT}), test({PROJECT})
- If unclear, add TODO comment and continue
```

### Step 5: Report and cleanup instructions

After launching all subagents, show:

1. **Status** — List each background agent task ID and which version it's porting
2. **How to check** — Tell the user they can check progress with `Read` on the output files
3. **Merge instructions** (merge older versions first):
   ```bash
   git merge {PROJECT}/v{OLDER_VERSION}
   git merge {PROJECT}/v{NEWER_VERSION}
   ```
4. **Cleanup instructions**:
   ```bash
   git worktree remove .worktrees/{PROJECT}-v{VERSION}
   git branch -d {PROJECT}/v{VERSION}
   ```
