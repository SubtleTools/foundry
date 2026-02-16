# Layout Demo

This is a comprehensive layout demonstration that showcases advanced Lipgloss TypeScript styling and layout features. It's a direct port of the Go Lipgloss layout example.

## Features Demonstrated

### 🏷️ Tab Navigation

- Active and inactive tab styling
- Custom border configurations
- Horizontal layout with proper spacing

### 🎨 Color Gradients & Styling

- Custom color blending functions
- Complex title sections with background colors
- Adaptive color schemes

### 💬 Interactive Dialog Boxes

- Rounded border dialogs
- Button styling (active/inactive states)
- Centered positioning with custom whitespace

### 📋 Multi-Column Layouts

- Side-by-side lists with different styling
- Column width management
- Border and spacing control

### 🌈 Color Grid Display

- Dynamic color generation
- Grid-based layout
- Background color blocks

### 📜 Content Sections

- Historical text with different alignments
- Multi-column text layout
- Responsive text wrapping

### 📊 Status Bars

- Complex horizontal layouts
- Width calculations and distribution
- Mixed content types (text, icons, spacing)

## Key TypeScript/Lipgloss Concepts

1. **Style Composition**: Building complex styles from base components
2. **Layout Functions**: Using `JoinHorizontal`, `JoinVertical`, and `Place`
3. **Immutable Styling**: Each style method returns a new instance
4. **Color Management**: Custom color blending and hex color handling
5. **Border Customization**: Custom border styles and configurations
6. **Responsive Design**: Adapting to terminal width
7. **Text Alignment**: Precise control over text positioning

## Running the Demo

```bash
bun run examples/layout/main.ts
```

## Port Notes

This TypeScript version simplifies some aspects of the original Go example:

- Uses simplified color blending instead of the `gamut` library
- Converts adaptive colors to static dark theme colors for consistency
- Maintains the same visual structure and complexity
- Demonstrates equivalent TypeScript idioms for Go patterns

The demo showcases how Lipgloss TypeScript can create the same sophisticated terminal layouts as the original Go library while maintaining type safety and modern JavaScript/TypeScript development patterns.
