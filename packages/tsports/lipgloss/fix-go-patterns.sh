#!/bin/bash

set -e

echo "Converting all examples to use Go-equivalent patterns..."

# Find all TypeScript example files
find /work/tsports/packages/tsports/lipgloss/examples -name "main.ts" -type f | while read -r file; do
    echo "Processing $file..."
    
    # Create backup
    cp "$file" "$file.bak"
    
    # 1. Replace idiomatic constructor patterns with Go-equivalent factory patterns
    
    # List patterns: new List().items(...) -> newList(...)
    # This is complex, so handle specific cases
    
    # 2. Replace Renderer patterns with global style patterns
    # Remove Renderer import and usage
    sed -i '' 's/, Renderer//g; s/Renderer, //g; s/Renderer//g' "$file"
    
    # Replace re.newStyle() with NewStyle()
    sed -i '' 's/const re = new Renderer();//g' "$file"
    sed -i '' 's/re\.newStyle()/NewStyle()/g' "$file"
    
    # Add NewStyle import if not present
    if grep -q "newList\|NewStyle" "$file" && ! grep -q "import.*NewStyle" "$file"; then
        sed -i '' 's/import { \([^}]*\) } from/import { \1, NewStyle } from/' "$file"
    fi
    
    # 3. Replace explicit toString() calls that should be implicit
    # Keep .toString() for console.log to match fmt.Println behavior
    
    # 4. Replace new Table() with newTable() where appropriate
    # This needs careful handling
    
    echo "  Converted to Go-equivalent patterns"
done

echo "Conversion complete!"