#!/bin/bash

# Update Go reference and apply FORCE_COLOR patch
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REFERENCE_DIR="$SCRIPT_DIR/reference"
PATCH_FILE="$SCRIPT_DIR/patches/FORCE_COLOR.patch"

echo "🔄 Updating Go Lipgloss reference..."

# Check if reference directory exists
if [ ! -d "$REFERENCE_DIR" ]; then
    echo "❌ Reference directory not found at $REFERENCE_DIR"
    echo "Run: bun run test/automation/reference-manager.ts init"
    exit 1
fi

# Check if patch file exists
if [ ! -f "$PATCH_FILE" ]; then
    echo "❌ Patch file not found at $PATCH_FILE"
    exit 1
fi

cd "$REFERENCE_DIR"

# Stash any local changes to avoid conflicts
echo "📦 Stashing local changes..."
git stash push -m "Auto-stash before update" || true

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch origin

# Get latest tag
LATEST_TAG=$(git describe --tags --abbrev=0 origin/main)
echo "🏷️  Latest version: $LATEST_TAG"

# Checkout latest version
echo "🔄 Checking out $LATEST_TAG..."
git checkout "$LATEST_TAG"

# Apply the FORCE_COLOR patch
echo "🔧 Applying FORCE_COLOR patch..."
if git apply --check "$PATCH_FILE" 2>/dev/null; then
    git apply "$PATCH_FILE"
    echo "✅ FORCE_COLOR patch applied successfully"
else
    echo "⚠️  Patch cannot be applied cleanly, attempting 3-way merge..."
    git apply --3way "$PATCH_FILE" || {
        echo "❌ Failed to apply patch. Manual intervention required."
        echo "You may need to update the patch file for the new version."
        exit 1
    }
fi

echo "✅ Reference updated to $LATEST_TAG with FORCE_COLOR patch applied"