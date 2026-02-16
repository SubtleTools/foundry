#!/bin/bash

set -e

cd /work/tsports/packages/tsports/lipgloss/test/automation/reference

echo "Regenerating golden files from Go reference implementation..."

# Define arrays for examples and test IDs
examples=(
    "examples/tree/background"
    "examples/tree/rounded" 
    "examples/tree/simple"
    "examples/tree/toggle"
    "examples/tree/styles"
    "examples/tree/makeup"
    "examples/tree/files"
    "examples/layout"
    "examples/ssh"
    "examples/table/pokemon"
    "examples/table/ansi"
    "examples/table/languages"
    "examples/table/mindy"
    "examples/table/chess"
    "examples/list/grocery"
    "examples/list/simple"
    "examples/list/duckduckgoose"
    "examples/list/roman"
    "examples/list/glow"
    "examples/list/sublist"
)

test_ids=(
    "501-example-background"
    "502-example-rounded"
    "503-example-simple"
    "504-example-toggle"
    "505-example-styles"
    "506-example-makeup"
    "507-example-files"
    "508-example-layout"
    "509-example-ssh"
    "5010-example-pokemon"
    "5011-example-ansi"
    "5012-example-languages"
    "5013-example-mindy"
    "5014-example-chess"
    "5015-example-grocery"
    "5016-example-simple"
    "5017-example-duckduckgoose"
    "5018-example-roman"
    "5019-example-glow"
    "5020-example-sublist"
)

for i in "${!examples[@]}"; do
    example="${examples[$i]}"
    test_id="${test_ids[$i]}"
    echo "Processing $example (test ID: $test_id)..."
    
    cd "$example"
    
    # Create golden file names based on pattern
    golden_base="/work/tsports/packages/tsports/lipgloss/test/testdata/example_${test_id}_"
    
    # Generate NO_COLOR version
    echo "  Generating NO_COLOR golden file..."
    NO_COLOR=1 go run main.go > "${golden_base}no_color.golden"
    
    # Generate FORCE_COLOR version  
    echo "  Generating FORCE_COLOR golden file..."
    FORCE_COLOR=1 go run main.go > "${golden_base}color.golden"
    
    cd - > /dev/null
done

echo "All golden files regenerated!"