# Port Go Struct to TypeScript

Use the porter agent to convert a specific Go struct and its methods to TypeScript.

**Arguments:**
- $GO_CODE - The Go struct code to port (can be pasted or file path)

**Steps:**

1. Use the porter agent to analyze and convert the Go struct
2. The agent will:
   - Analyze the Go struct definition and its methods
   - Map Go types to TypeScript equivalents
   - Convert receiver methods to class methods
   - Handle embedded fields via inheritance or composition
   - Preserve type safety and null-safety patterns
   - Generate TypeScript class with proper typing
   - Provide usage examples and migration notes

**Usage Examples:**
```bash
/porter port-struct "type Color struct { R, G, B float64 }"
/porter port-struct path/to/struct.go
```

**Conversion Patterns:**
- Go structs → TypeScript classes or interfaces
- Receiver methods → Class methods
- Embedded fields → Inheritance or composition
- Go interfaces → TypeScript interfaces
- Pointer receivers → Appropriate TypeScript patterns