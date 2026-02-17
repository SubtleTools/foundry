# TODO

## Pending Commits

These changes are staged but not yet committed:

- [ ] Fix go-osc52 version: 2.0.1400 → 2.0.100 (portInfo was wrong, no v2.0.14 exists)
- [ ] Pin inter-tsport deps with `workspace:^X.Y.Z` to match upstream go.mod versions
  - gamut: `@tsports/go-colorful` → `workspace:^1.2.0`
  - lipgloss: `@tsports/go-colorful` → `workspace:^1.2.0`, `@tsports/termenv` → `workspace:^0.16.0`, `@tsports/uniseg` → `workspace:^0.4.700`
  - termenv: `@tsports/go-colorful` → `workspace:^1.2.0`, `@tsports/uniseg` → `workspace:^0.4.700`
- [ ] Add `scripts/check-dep-versions.ts` — validates tsport dep versions match upstream go.mod
- [ ] Add dep validation step to release workflow (blocks publish on mismatch)
- [ ] Add `check:deps` script to root package.json

## API Gap Detection

### Problem

The TS termenv port is missing `Copy()` and `CopyPrimary()` — functions that use `@tsports/go-osc52`. The go-osc52 TS port exists and is complete, but termenv never imports it. Instead, the clipboard functionality was simply omitted. Our tests didn't catch this.

There may be other gaps across all ports.

### Tasks

- [ ] Create `scripts/check-api-gaps.ts` — compares Go and TS public APIs for a given package
  - Parse Go source files for exported functions, methods, types, and constants (uppercase names)
  - Parse TS source files for exported functions, classes, types, and constants
  - Map Go names to expected TS equivalents (PascalCase → camelCase, receiver methods → class methods)
  - Report: missing exports, missing methods on types/classes, extra exports not in Go
  - Output structured JSON + human-readable summary
- [ ] Test the script on termenv — it should report at minimum:
  - `Copy()` and `CopyPrimary()` on Output (from copy.go)
  - `Hyperlink()` on Output and package-level (from hyperlink.go)
  - `Notify()` on Output and package-level (from notification.go)
  - `TemplateFuncs()` on Output and package-level (from templatehelper.go)
  - Verify no false positives for platform-specific internals (termenv_windows.go, etc.)
- [ ] Run the script on all ports and generate API Gap reports
  - gamut, go-colorful, go-osc52, lipgloss, termenv, uniseg
  - Save reports to `packages/tsports/<pkg>/API_GAPS.md`
- [ ] Fix gaps before publishing any package
  - termenv: add `copy.ts` importing from `@tsports/go-osc52`, add `@tsports/go-osc52` as dependency
  - termenv: add `hyperlink.ts`, `notification.ts`, `templatehelper.ts` if missing
  - Other packages: TBD based on gap reports
  - Add tests for all newly implemented functions
  - Run `check-api-gaps.ts` again to confirm zero gaps

## Future: Exact Dependency Version Testing

The `workspace:^` approach pins published version ranges correctly, but during development we still test against the latest workspace version of each dep (e.g., testing lipgloss against go-colorful@1.3.0 when upstream lipgloss was built against go-colorful@1.2.0). This could mask behavioral differences.

Long-term options:
- Worktree-based isolation per package, checking out exact dep versions matching go.mod
- Submodule-per-package so branches can pin exact dep versions
- Version-locked test mode that installs published npm versions instead of workspace links
