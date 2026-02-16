# 🎨 Lipgloss TypeScript

[![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript port of [Lipgloss](https://github.com/charmbracelet/lipgloss), the terminal styling library for creating beautiful CLI applications.

## ✨ Features

- 🎨 **Rich styling** - Colors, borders, alignment, and more
- 🔄 **Immutable API** - Safe, predictable styling operations
- 📱 **Responsive layouts** - Adaptive terminal UIs
- 🧩 **Composable** - Mix and match styles effortlessly
- 🚀 **High performance** - Optimized for terminal rendering
- 💎 **TypeScript native** - Full type safety and IntelliSense

## 📦 Installation

```bash
# Using Bun (recommended)
bun add subtletools/lipgloss

# Using npm
npm install subtletools/lipgloss

# Using yarn
yarn add subtletools/lipgloss
```

## 🚀 Quick Start

```typescript
import { Style } from 'subtletools/lipgloss';

// Create a styled component
const title = new Style()
  .bold()
  .foreground('#FF6B6B')
  .background('#1A1A1A')
  .padding(1, 2)
  .border('rounded')
  .borderForeground('#4ECDC4');

console.log(title.render('Hello, Lipgloss TypeScript!'));
```

## 📚 Documentation

### Core Concepts

- **Styling System** - Colors, typography, and visual effects (Documentation coming soon)
- **Layout System** - Positioning, alignment, and spacing (Documentation coming soon)
- **Border System** - Border styles and decorations (Documentation coming soon)
- **Color Management** - Color handling and terminal support (Documentation coming soon)

### Examples

- [Basic Usage](./examples/basic.ts) - Getting started
- [Color Management](./examples/color-management.ts) - Working with colors
- [Text Styling](./examples/text-styling-demo.ts) - Typography options
- [Layout & Padding](./examples/layout-padding-demo.ts) - Spacing and positioning
- [Advanced Layouts](./examples/types-showcase.ts) - Complex UI layouts

## 🔧 Development

### Setup

```bash
# Clone and setup
git clone https://github.com/charmbracelet/charm-ts.git
cd charm-ts/lovely/lipgloss
bun install

# Quick setup
./scripts/dev.sh setup
```

### Commands

```bash
# Development
bun run dev                 # Watch mode with auto-rebuild
bun run dev:examples        # Run example scripts
./scripts/dev.sh watch      # Full development mode

# Testing
bun run test               # Run tests
bun run test:watch         # Watch mode tests
bun run test:coverage      # Coverage report

# Quality
bun run validate          # Full validation (lint, format, type-check, test)
bun run lint:fix          # Auto-fix linting issues
bun run format            # Format code

# Building
bun run build             # Build library
bun run clean             # Clean build artifacts
```

## 🎯 API Reference

### Style Class

The main `Style` class provides a fluent API for styling terminal output:

```typescript
const style = new Style()
  // Colors
  .foreground('#FF6B6B')
  .background('#1A1A1A')
  
  // Typography
  .bold()
  .italic()
  .underline()
  
  // Layout
  .width(40)
  .height(10)
  .padding(1, 2)
  .margin(1)
  .align('center')
  
  // Borders
  .border('rounded')
  .borderForeground('#4ECDC4')
  
  // Render
  .render('Your text here');
```

### Color System

```typescript
import { Colors } from 'subtletools/lipgloss';

// Predefined colors
style.foreground(Colors.Red);
style.background(Colors.BrightBlue);

// Custom colors
style.foreground('#FF6B6B');      // Hex
style.foreground('rgb(255,107,107)'); // RGB
style.foreground(196);            // ANSI color code
```

### Layout System

```typescript
// Dimensions
style.width(40).height(10);

// Padding and margins (CSS-style)
style.padding(1);          // All sides
style.padding(1, 2);       // Vertical, horizontal
style.padding(1, 2, 3, 4); // Top, right, bottom, left

// Alignment
style.align('left');    // left, center, right
style.alignVertical('middle'); // top, middle, bottom
```

## 🤝 Contributing

We welcome contributions! Please see our Contributing Guide for details.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original [Lipgloss](https://github.com/charmbracelet/lipgloss) by Charm
- [Bubble Tea](https://github.com/charmbracelet/bubbletea) ecosystem
- The amazing Go and TypeScript communities

---

<div align="center">
  <sub>Built with ❤️ by the Charm community</sub>
</div>