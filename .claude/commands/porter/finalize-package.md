# Finalize TSPort Package

Complete and finalize a TSPort package for publication, ensuring all quality gates are met.

**Arguments:** `$ARGUMENTS`
- `PACKAGE_PATH` - Path to the TSPort package to finalize (e.g., `packages/tsports/go-colorful`)

## Pre-Finalization Checklist

Before proceeding, verify these requirements are met:

| Requirement | Command to Verify |
|-------------|------------------|
| Core functionality implemented | Review `port_status.md` - all files should be "Complete" |
| TypeScript compiles | `moon run build` - zero errors |
| Tests pass | `moon run test` - all green |
| Go compatibility verified | `/porter:check-compatibility $PACKAGE_PATH` |

## Workflow

### Step 1: Final Build Verification
```bash
cd $PACKAGE_PATH
moon run build   # MUST pass with zero errors
moon run test    # All tests MUST pass
```

### Step 2: Documentation Review

**Required Documentation Files:**
- `README.md` - Package overview, installation, usage examples
- `CHANGELOG.md` - Version history and changes
- `port_status.md` - Complete port tracking (all files "Complete")
- `compatibility_report.md` - Verification results

**README.md Must Include:**
1. Package description and purpose
2. Installation instructions (using Bun)
3. Quick start / basic usage examples
4. API overview with code examples
5. TypeScript-specific notes (vs Go original)
6. Migration guide for Go users
7. Link to Go original repository

### Step 3: Update Dual API Exports

Verify both API styles are properly exported:

**`src/index.ts`** - TypeScript-native API (camelCase):
```typescript
// Idiomatic TypeScript API - ALL camelCase
export { Color } from './color';
export { hex, rgb, lighter, darker } from './functions';
export { Palette } from './palette';
```

**`src/go-style.ts`** - Go-compatible API (PascalCase):
```typescript
// Go-style API for easier migration - ALL PascalCase
// Thin wrapper over TypeScript-native implementation
import { hex, rgb, lighter, darker } from './functions';

export const Hex = hex;
export const RGB = rgb;
export const Lighter = lighter;
export const Darker = darker;
export { Color, Palette } from './index';
```

### Step 4: Package.json Verification

Ensure `package.json` includes:
```json
{
  "name": "@tsports/<package-name>",
  "version": "0.1.0",
  "exports": {
    ".": "./src/index.ts",
    "./go-style": "./src/go-style.ts"
  },
  "types": "./src/index.ts",
  "files": ["src", "README.md", "LICENSE"],
  "keywords": ["tsports", "go-port", "<relevant-keywords>"],
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/tsports",
    "directory": "packages/tsports/<package-name>"
  }
}
```

### Step 5: Final Port Status Update

Update `port_status.md` to final state:

```markdown
# Port Status: <package-name>

## Status: ✅ COMPLETE

| Go File | TS File | Status | Notes |
|---------|---------|--------|-------|
| `color.go` | `src/color.ts` | ✅ Complete | Fully ported |
| `utils.go` | `src/utils.ts` | ✅ Complete | Fully ported |

## Compatibility
- All tests passing
- 100% API coverage
- See `compatibility_report.md` for details
```

### Step 6: CI/CD Verification

Verify GitHub workflows are configured:
- `.github/workflows/ci.yml` - Build and test on PR
- `.github/workflows/release.yml` - NPM publishing on release

### Step 7: Final Commit
```bash
moon run build  # Final verification
moon run test   # Final test run
git add .
git commit -m "feat(<package>): finalize package for release"
```

### Step 8: Provide Publishing Instructions

Output next steps for the user:
1. Create a Git tag: `git tag @tsports/<package>@0.1.0`
2. Push tag to trigger release: `git push origin @tsports/<package>@0.1.0`
3. Verify NPM publish via GitHub Actions

## Finalization Checklist Summary

- [ ] All Go files ported (check `port_status.md`)
- [ ] `moon run build` passes with zero errors
- [ ] `moon run test` passes all tests
- [ ] Compatibility report shows 100% API coverage
- [ ] README.md has complete documentation
- [ ] CHANGELOG.md has initial version entry
- [ ] Dual API exports configured (index.ts, go-style.ts)
- [ ] package.json properly configured
- [ ] CI/CD workflows verified
- [ ] Final commit created

## Usage Examples
```bash
/porter:finalize-package packages/tsports/go-colorful
/porter:finalize-package packages/tsports/bubbletea
```
