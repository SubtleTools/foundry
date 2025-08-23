# Add Compatibility Tests

Use the porter agent to create comprehensive compatibility tests for a TSPort package.

**Arguments:**
- $PACKAGE_PATH - Path to the TSPort package (e.g., packages/tsports/go-colorful)

**Steps:**

1. Use the porter agent to create compatibility test infrastructure
2. The agent will:
   - Create test cases that verify Go compatibility
   - Set up automated comparison testing framework
   - Add test cases in test/corpus/ directory with Go and TypeScript implementations
   - Configure test utilities for output comparison
   - Ensure tests pass with `moon run test`
   - Commit test infrastructure and cases

**Usage Examples:**
```bash
/porter add-tests packages/tsports/go-colorful
/porter add-tests packages/tsports/uniseg
```

**Test Structure:**
The agent creates test cases like:
```
test/corpus/001-basic-functionality/
├── case.go          # Go test implementation  
├── case.ts          # TypeScript test implementation
└── metadata.json    # Test case metadata
```

**Quality Assurance:**
- Tests verify 100% output compatibility with Go
- Both unit tests and integration tests included
- All tests must pass before committing