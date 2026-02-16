#!/bin/bash

echo "=== Color Compatibility Test Results ==="
echo ""

# Test 1: Go test
echo "1. Running Go test:"
echo "==================="
cd test/archive/go-reference
NO_COLOR=1 go run test-color.go
GO_RESULT="$?"
cd ../../../

echo ""
echo "Go output (exit code: $GO_RESULT):"
echo ""

# Test 2: TypeScript test with NO_COLOR
echo "2. Running TypeScript test with NO_COLOR=1:"
echo "==========================================="
NO_COLOR=1 bun run test-color.ts
TS_NO_COLOR_RESULT="$?"

echo ""
echo "TypeScript with NO_COLOR=1 output (exit code: $TS_NO_COLOR_RESULT):"
echo ""

# Test 3: TypeScript test without NO_COLOR
echo "3. Running TypeScript test without NO_COLOR:"
echo "==========================================="
bun run test-color.ts
TS_NORMAL_RESULT="$?"

echo ""
echo "TypeScript without NO_COLOR output (exit code: $TS_NORMAL_RESULT):"
echo ""

echo "=== Test Summary ==="
echo "Go test exit code: $GO_RESULT"
echo "TypeScript with NO_COLOR=1 exit code: $TS_NO_COLOR_RESULT"
echo "TypeScript normal exit code: $TS_NORMAL_RESULT"

if [ "$GO_RESULT" -eq 0 ] && [ "$TS_NO_COLOR_RESULT" -eq 0 ]; then
    echo "SUCCESS: Both Go and TypeScript with NO_COLOR=1 completed successfully"
else
    echo "FAILED: One or both tests failed"
fi