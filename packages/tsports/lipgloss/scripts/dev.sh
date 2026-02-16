#!/bin/bash

# Development helper script for lipgloss
# Usage: ./scripts/dev.sh [command]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

case "${1:-help}" in
  "setup")
    echo "🔧 Setting up development environment..."
    bun install
    echo "✅ Dependencies installed"
    
    echo "🧹 Cleaning previous builds..."
    bun run clean
    
    echo "🏗️  Building project..."
    bun run build
    
    echo "🧪 Running tests..."
    bun run test
    
    echo "✅ Development environment ready!"
    ;;
    
  "check")
    echo "🔍 Running full validation..."
    bun run validate
    echo "✅ All checks passed!"
    ;;
    
  "fix")
    echo "🔧 Auto-fixing code issues..."
    bun run lint:fix
    bun run format
    echo "✅ Code formatted and linted!"
    ;;
    
  "examples")
    echo "🚀 Running all examples..."
    bun run examples
    ;;
    
  "watch")
    echo "👀 Starting development with watch mode..."
    echo "  - Build watching in background"
    echo "  - Type checking in background" 
    echo "  - Tests watching in background"
    echo ""
    echo "Press Ctrl+C to stop all watchers"
    
    # Start build watcher in background
    bun run build:watch &
    BUILD_PID=$!
    
    # Start type checking watcher in background
    bun run type-check:watch &
    TYPE_PID=$!
    
    # Start test watcher in foreground
    trap "kill $BUILD_PID $TYPE_PID 2>/dev/null || true" EXIT
    bun run test:watch
    ;;
    
  "help"|*)
    echo "🎨 Lipgloss TypeScript Development Helper"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Set up development environment from scratch"
    echo "  check     - Run full validation (format, lint, type-check, test)"
    echo "  fix       - Auto-fix formatting and linting issues"
    echo "  examples  - Run all example scripts"
    echo "  watch     - Start development with build, type, and test watchers"
    echo "  help      - Show this help message"
    echo ""
    echo "Quick commands:"
    echo "  bun run build        - Build the library"
    echo "  bun run test         - Run tests"
    echo "  bun run dev:examples - Run basic example"
    echo "  bun run validate     - Run all checks"
    ;;
esac