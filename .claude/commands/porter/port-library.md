# Port Go Library to TypeScript (Full Workflow)

Orchestrate the complete porting of a Go library to TypeScript using specialized subagents to preserve the main context window.

**Arguments:** `$ARGUMENTS`

Parse from arguments:
- `GO_REPO_URL` - The Go repository URL (e.g., `https://github.com/lucasb-eyer/go-colorful`)
- `PACKAGE_NAME` - The package name WITHOUT `@tsports/` prefix (e.g., `go-colorful`)
- `DESCRIPTION` (optional) - Package description

**Example:**
```bash
/porter:port-library https://github.com/lucasb-eyer/go-colorful go-colorful "Color manipulation library"
```

## Orchestration Strategy

This command coordinates multiple porter subagents to complete the full porting workflow while preserving the main agent's context window. Each phase runs as a separate subagent task.

**CRITICAL: Use subagents for heavy lifting, keep orchestration lightweight.**

## Workflow Phases

### Phase 0: Validate Arguments

If arguments are missing, prompt the user:
- **GO_REPO_URL**: Required - the GitHub URL of the Go library
- **PACKAGE_NAME**: Required - name for the TypeScript package (without @tsports/)
- **DESCRIPTION**: Optional - will be auto-generated if not provided

Set derived values:
```
FULL_PACKAGE_NAME = @tsports/${PACKAGE_NAME}
PACKAGE_PATH = packages/tsports/${PACKAGE_NAME}
```

### Phase 1: Initialize Package (Subagent)

**Launch porter subagent for package creation:**

```
Task: Initialize TSPort package for ${PACKAGE_NAME}

Execute the following steps:
1. Run: moon generate tsport-package -- --goRepo="${GO_REPO_URL}" --packageName="${FULL_PACKAGE_NAME}" --description="${DESCRIPTION}"
2. Change to package directory: cd ${PACKAGE_PATH}
3. Run setup: bun run setup
4. Create port_status.md with initial file inventory from test/reference/
5. Verify build passes: moon run build
6. Commit: git add . && git commit -m "feat(${PACKAGE_NAME}): initialize tsport package structure"

Report back:
- List of Go files to be ported
- Initial port_status.md contents
- Any setup issues encountered
```

**Wait for completion, then review output.**

### Phase 2: Analyze & Plan (Subagent)

**Launch porter subagent for analysis:**

```
Task: Analyze Go source code in ${PACKAGE_PATH}/test/reference/

Perform comprehensive analysis:
1. Identify all Go files and their purposes
2. Map package structure and dependencies
3. Identify exported types, functions, and interfaces
4. Flag special patterns requiring attention:
   - [ ] RNG usage (needs algorithm port)
   - [ ] 64-bit integer operations (needs BigInt)
   - [ ] CGO dependencies (may block port)
   - [ ] Build tags (needs platform handling)
   - [ ] Reflection usage (limited TS support)
   - [ ] Concurrency patterns (goroutines/channels)

5. Create implementation plan with recommended order
6. Update port_status.md with analysis notes

Report back:
- Total files/types/functions to port
- Special patterns detected
- Recommended implementation order
- Any blocking issues
```

**Review analysis and decide whether to proceed.**

### Phase 3: Implement Core (Subagent - may be multiple)

**Launch porter subagent(s) for implementation:**

For large libraries, split into logical modules and run subagents in parallel where dependencies allow.

```
Task: Implement TypeScript port for ${PACKAGE_PATH}

Following the analysis, implement the TypeScript equivalent:

1. For each Go file in implementation order:
   a. Read Go source and understand logic
   b. Apply type mappings (see implement-core.md)
   c. Handle special patterns appropriately
   d. Write TypeScript implementation
   e. Run: moon run build (MUST pass)
   f. Update port_status.md
   g. Commit: git commit -m "feat(${PACKAGE_NAME}): implement <component>"

2. Ensure dual API support:
   - src/index.ts: TypeScript-native API
   - src/go-style.ts: Go-compatible API wrapper

3. After all files implemented:
   - Final build verification: moon run build
   - Report implementation summary

Report back:
- Files implemented with status
- Any deviations from Go original (with justification)
- Final port_status.md
```

**Monitor progress. For large libraries, may need multiple subagents.**

### Phase 4: Add Tests (Subagent)

**Launch porter subagent for testing:**

```
Task: Create compatibility tests for ${PACKAGE_PATH}

1. Review Go tests in test/reference/
2. Port test cases to TypeScript:
   - Table-driven tests → test.each()
   - Benchmarks → bench()
   - Examples → JSDoc @example + tests

3. Create compatibility test cases in test/cases/:
   - case.go: Go implementation
   - case.ts: TypeScript implementation
   - Compare JSON outputs

4. Handle special test scenarios:
   - RNG: Use GODEBUG=randautoseed=0 for Go
   - Integers: Test boundary values
   - Strings: Verify UTF-8/UTF-16 handling

5. Run tests: moon run test (ALL must pass)
6. Commit: git commit -m "test(${PACKAGE_NAME}): add compatibility test suite"

Report back:
- Test coverage summary
- Any compatibility issues found
- Test pass/fail status
```

### Phase 5: Verify Compatibility (Subagent)

**Launch porter subagent for verification:**

```
Task: Verify Go-TypeScript compatibility for ${PACKAGE_PATH}

1. Run full test suites:
   - moon run build
   - moon run test
   - cd test/reference && go test ./...

2. API surface comparison:
   - Extract Go public API
   - Compare with TypeScript exports
   - Document any differences

3. Specialized checks:
   - Numeric precision tests
   - String encoding verification
   - Error condition parity

4. Generate compatibility_report.md with:
   - API compatibility matrix
   - Test results summary
   - Known deviations (with justification)

5. Commit: git commit -m "docs(${PACKAGE_NAME}): add compatibility verification report"

Report back:
- Overall compatibility score
- Any issues requiring attention
- Compatibility report summary
```

### Phase 6: Finalize (Subagent)

**Launch porter subagent for finalization:**

```
Task: Finalize ${PACKAGE_PATH} for publication

1. Documentation:
   - Update README.md with usage examples
   - Add migration guide for Go users
   - Update CHANGELOG.md

2. Package configuration:
   - Verify package.json exports
   - Check TSPort versioning
   - Validate CI/CD workflows

3. Final verification:
   - moon run build (zero errors)
   - moon run test (all pass)
   - Review port_status.md (all "Complete")

4. Final commit: git commit -m "feat(${PACKAGE_NAME}): finalize package for release"

Report back:
- Publication readiness checklist
- Any remaining issues
- Publishing instructions
```

## Orchestration Commands

**Main orchestrator loop:**

```
1. Parse and validate arguments
2. For each phase:
   a. Announce phase start
   b. Launch subagent with Task tool
   c. Wait for completion
   d. Review results
   e. Handle any issues (may require user input)
   f. Proceed to next phase or stop on critical failure
3. Summarize complete workflow results
4. Provide next steps for publishing
```

## Parallel Execution Opportunities

When dependencies allow, run subagents in parallel:
- Phase 3 (Implementation): Split by module if independent
- Phase 4 (Tests): Can run alongside late implementation work

## Error Handling

- **Setup failure**: Report and stop - user needs to fix environment
- **Build failure**: Subagent should fix or report specific errors
- **Test failure**: Report failures, may continue with warning
- **Critical incompatibility**: Stop and report to user for decision

## Progress Tracking

The orchestrator maintains lightweight state:
- Current phase
- Subagent status
- Cumulative issues
- Overall progress percentage

Each subagent updates `port_status.md` for detailed tracking.

## Example Full Run

```bash
# Start full port
/porter:port-library https://github.com/lucasb-eyer/go-colorful go-colorful

# Orchestrator output:
# Phase 1: Initializing package... [subagent running]
# ✓ Package initialized (12 Go files detected)
#
# Phase 2: Analyzing source... [subagent running]
# ✓ Analysis complete (no blocking issues, RNG detected)
#
# Phase 3: Implementing core... [subagent running]
# ✓ Implementation complete (12/12 files, 45 functions)
#
# Phase 4: Adding tests... [subagent running]
# ✓ Tests complete (156 tests, 100% pass)
#
# Phase 5: Verifying compatibility... [subagent running]
# ✓ Compatibility verified (100% API coverage)
#
# Phase 6: Finalizing... [subagent running]
# ✓ Package finalized
#
# 🎉 Port complete! Ready for publishing.
# Run: git tag @tsports/go-colorful@0.1.0 && git push --tags
```
