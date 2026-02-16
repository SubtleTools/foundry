#!/bin/bash

set -e

cd /work/tsports/packages/tsports/lipgloss/test/automation/reference

echo "Generating golden files with correct naming pattern..."

# Use simple approach with arrays
paths=(
  "examples/table/pokemon"
  "examples/table/chess" 
  "examples/table/languages"
  "examples/table/mindy"
  "examples/table/ansi"
  "examples/layout"
  "examples/list/simple"
  "examples/list/roman"
  "examples/list/grocery"
  "examples/list/duckduckgoose"
  "examples/list/glow"
  "examples/list/sublist"
  "examples/tree/simple"
  "examples/tree/background"
  "examples/tree/files"
  "examples/tree/makeup"
  "examples/tree/rounded"
  "examples/tree/styles"
  "examples/tree/toggle"
  "examples/ssh"
)

categories=(
  "table"
  "table" 
  "table"
  "table"
  "table"
  "layout"
  "list"
  "list"
  "list"
  "list"
  "list"
  "list"
  "tree"
  "tree"
  "tree"
  "tree"
  "tree"
  "tree"
  "tree"
  "ssh"
)

names=(
  "Pokemon_Table"
  "Chess_Table" 
  "Languages_Table"
  "Mindy_Table"
  "ANSI_Table"
  "Layout_Example"
  "Simple_List"
  "Roman_List"
  "Grocery_List"
  "DuckDuckGoose_List"
  "Glow_List"
  "Sublist_Example"
  "Simple_Tree"
  "Background_Tree"
  "Files_Tree"
  "Makeup_Tree"
  "Rounded_Tree"
  "Styles_Tree"
  "Toggle_Tree"
  "SSH_Example"
)

for i in "${!paths[@]}"; do
  dir="${paths[$i]}"
  category="${categories[$i]}"
  name="${names[$i]}"
  
  # Convert name to the test format: replace spaces with underscores and lowercase
  test_name=$(echo "$name" | sed 's/ /_/g' | tr '[:upper:]' '[:lower:]')
  
  # Generate test names in the format the test expects
  golden_base="example_${category}_${test_name}"
  
  echo "Processing $dir -> $golden_base"
  
  if [[ -d "$dir" ]]; then
    cd "$dir"
    
    # Generate NO_COLOR version (FORCE_COLOR=0)
    FORCE_COLOR=0 go run main.go > "/work/tsports/packages/tsports/lipgloss/test/testdata/${golden_base}_no_color.golden" 2>/dev/null || echo "Failed: $dir (no_color)"
    
    # Generate NO_COLOR version (NO_COLOR=1) 
    NO_COLOR=1 go run main.go > "/work/tsports/packages/tsports/lipgloss/test/testdata/${golden_base}_no_color_env.golden" 2>/dev/null || echo "Failed: $dir (no_color_env)"
    
    # Generate FORCE_COLOR version
    FORCE_COLOR=3 go run main.go > "/work/tsports/packages/tsports/lipgloss/test/testdata/${golden_base}_color.golden" 2>/dev/null || echo "Failed: $dir (color)"
    
    cd - > /dev/null
  else
    echo "Directory $dir does not exist"
  fi
done

echo "Golden file generation complete!"