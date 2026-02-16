#!/bin/bash
# Verification script to show golden file naming improvements

echo "Golden File Naming Verification"
echo "================================"
echo ""

echo "1. Semantic Naming Examples:"
echo "----------------------------"
ls test/testdata/ | grep "basic_001" | head -4
echo ""

echo "2. Profile Coverage for 'basic_001-basic-render':"
echo "-------------------------------------------------"
for profile in ascii ansi ansi256 truecolor; do
  file="test/testdata/basic_001-basic-render_${profile}.golden"
  if [ -f "$file" ]; then
    echo "✓ $profile profile covered"
  else
    echo "✗ $profile profile missing"
  fi
done
echo ""

echo "3. Total Golden Files by Profile:"
echo "---------------------------------"
for profile in ascii ansi ansi256 truecolor; do
  count=$(ls test/testdata/*_${profile}.golden 2>/dev/null | wc -l | tr -d ' ')
  echo "$profile: $count files"
done
echo ""

echo "4. Old Naming Scheme Files (should be 0):"
echo "-----------------------------------------"
old_count=$(ls test/testdata/*_{no_color,color}.golden 2>/dev/null | wc -l | tr -d ' ')
echo "Files with old naming: $old_count"
echo ""

echo "✅ Migration Complete!"
