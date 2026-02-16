#!/bin/bash

set -e

# Convert examples to use idiomatic TypeScript constructors
echo "Converting examples to idiomatic TypeScript patterns..."

# Find all TypeScript files in examples directory
find /work/tsports/packages/tsports/lipgloss/examples -name "*.ts" -type f | while read -r file; do
    echo "Processing $file..."
    
    # Replace NewStyle() with re.newStyle() but first ensure we have a renderer import
    if grep -q "import.*NewStyle" "$file"; then
        # Add Renderer import if not present
        if ! grep -q "import.*Renderer" "$file"; then
            sed -i '' 's/import { \([^}]*\) } from/import { \1, Renderer } from/' "$file"
        fi
        
        # Remove NewStyle from imports and add const re = new Renderer()
        sed -i '' 's/NewStyle, //g; s/, NewStyle//g; s/NewStyle//g' "$file"
        
        # Add renderer declaration after imports
        sed -i '' '/^import/a\
const re = new Renderer();' "$file"
        
        # Replace all NewStyle() calls with re.newStyle()
        sed -i '' 's/NewStyle()/re.newStyle()/g' "$file"
    fi
    
    # Replace newList() with new List().items() - this is complex, so let's use a simpler approach
    # First, ensure List is imported
    if grep -q "newList" "$file"; then
        if ! grep -q "import.*List" "$file"; then
            sed -i '' 's/import { \([^}]*\) } from/import { \1, List } from/' "$file"
        fi
        
        # Remove newList from imports
        sed -i '' 's/newList, //g; s/, newList//g' "$file"
    fi
    
    # Replace .render() with .toString() for List objects
    sed -i '' 's/\.render()/\.toString()/g' "$file"
    
done

echo "Conversion complete!"