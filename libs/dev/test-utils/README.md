# @dev/test-utils

Shared test utilities library for all TSPorts packages.

## Overview

This library provides common testing utilities used across all ported packages in the TSPorts monorepo. It eliminates code duplication and ensures consistent testing approaches across packages.

## Usage

Import utilities using the `@dev/test-utils` path mapping:

```typescript
import { compareOutputs } from '@dev/test-utils/comparison';
import { setToleranceConfig } from '@dev/test-utils/config';
import { requireEqual } from '@dev/test-utils/golden';
import { getTestFilter } from '@dev/test-utils/filtering';
```

## Features

### Configuration
- **Global tolerance settings** for floating-point and color comparisons
- Environment-based configuration support

### Comparison Utilities
- **Base comparison** - Core output comparison with difference reporting
- **Hex color tolerance** - Compare hex colors with ±1 per channel tolerance
- **ANSI RGB tolerance** - Compare ANSI escape sequences with tolerance
- **Table comparison** - Semantic table structure comparison

### Golden File Testing
- **Golden file management** - Compare outputs against reference golden files
- **Go reference generation** - Generate golden files from Go implementations
- **Automatic escaping** - Handle ANSI codes and control characters

### Test Filtering
- **CLI and environment filters** - Filter tests by name, category, or ID
- **Apply filters** - Utility functions for filtering test collections

### Test Execution
- **Test case runner** - Execute Go and TypeScript test cases
- **Environment management** - Configure test environments

## Installation

No installation needed - this library is imported directly as TypeScript source files via path mapping in tsconfig.json.

## Configuration

### TypeScript Path Mapping

Add to your package's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@dev/test-utils": ["../../../libs/dev/test-utils/index.ts"],
      "@dev/test-utils/*": ["../../../libs/dev/test-utils/*"]
    }
  }
}
```

### Tolerance Configuration

Configure tolerances at the start of your test file:

```typescript
import { setToleranceConfig } from '@dev/test-utils/config';

beforeAll(() => {
  setToleranceConfig({
    hexColorTolerance: 1,      // ±1 per RGB channel
    ansiRgbTolerance: 1,       // ±1 per RGB channel in ANSI codes
    floatRelativeTolerance: 0.05,  // 5% relative error
  });
});
```

## Module Structure

- `config.ts` - Global tolerance configuration
- `types.ts` - Shared TypeScript interfaces
- `comparison/` - Comparison utilities
  - `base.ts` - Core comparison logic
  - `colors.ts` - Hex color comparison
  - `ansi.ts` - ANSI escape sequence comparison
  - `table.ts` - Table structure comparison
- `filtering/` - Test filtering utilities
- `golden/` - Golden file testing
- `execution/` - Test case execution
- `setup/` - Test environment configuration

## Development

This is a pure TypeScript library with no build step. All files are imported directly as `.ts` files.

## License

MIT
