# Check Go-TypeScript Compatibility  

Use the porter agent to verify compatibility between Go and TypeScript implementations.

**Arguments:**
- $PACKAGE_PATH - Path to the TSPort package to check

**Steps:**

1. Use the porter agent to perform comprehensive compatibility checking
2. The agent will:
   - Run compatibility tests comparing Go and TypeScript outputs
   - Verify API surface matches between implementations
   - Check type safety and error handling patterns
   - Run performance comparisons if applicable
   - Generate compatibility report with any discrepancies
   - Suggest fixes for any compatibility issues found

**Usage Examples:**
```bash
/porter check-compatibility packages/tsports/go-colorful
/porter check-compatibility packages/tsports/uniseg
```

**Compatibility Checks:**
- **API Surface**: All public methods and properties match
- **Output Compatibility**: Identical results for same inputs
- **Error Handling**: Same error conditions and messages
- **Type Safety**: TypeScript types match Go semantics
- **Performance**: Comparable or better performance characteristics

**Quality Standards:**
- 100% API compatibility required
- All compatibility tests must pass
- Any deviations must be documented and justified