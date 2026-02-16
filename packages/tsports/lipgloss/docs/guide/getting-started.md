# Getting Started

Welcome to Lipgloss TypeScript! This guide will help you create beautiful terminal UIs with the same elegant API you know from Go Lipgloss.

## Installation

Install via your preferred package manager:

::: code-group

```bash [bun]
bun add @tsports/lipgloss
```

```bash [npm]
npm install @tsports/lipgloss
```

```bash [yarn]
yarn add @tsports/lipgloss
```

:::

## Your First Style

Let's create a simple styled text block. Lipgloss TypeScript offers two APIs:

**TypeScript-Native API (Recommended):**

```typescript
import { Style } from '@tsports/lipgloss';

const style = new Style()
  .color('hotpink')
  .backgroundColor('black')
  .bold(true)
  .padding(1, 2)
  .borderStyle('rounded')
  .borderForeground('cyan');

console.log(style.render('Hello, World!'));
```

**Go-Compatible API (for Go developers):**

```typescript
import { NewStyle } from '@tsports/lipgloss';

const style = NewStyle()
  .Foreground('hotpink')
  .Background('black')
  .Bold(true)
  .Padding(1, 2)
  .BorderStyle('rounded')
  .BorderForeground('cyan');

console.log(style.Render('Hello, World!'));
```

**Output:**
```
╭─────────────────╮
│  Hello, World!  │
╰─────────────────╯
```

## Core Concepts

### Immutable Styles

Styles in Lipgloss are **immutable**. Every method returns a new style instance:

**TypeScript-Native API:**

```typescript
const baseStyle = new Style().color('blue');
const boldStyle = baseStyle.bold(true);  // baseStyle unchanged
const italicStyle = baseStyle.italic(true); // baseStyle unchanged

// Chain methods for complex styles
const fancyStyle = new Style()
  .color('purple')
  .backgroundColor('#1a1a1a')
  .bold(true)
  .italic(true)
  .padding(2)
  .borderStyle('thick')
  .borderForeground('gold');
```

**Go-Compatible API:**

```typescript
const baseStyle = NewStyle().Foreground('blue');
const boldStyle = baseStyle.Bold(true);  // baseStyle unchanged
const italicStyle = baseStyle.Italic(true); // baseStyle unchanged

// Chain methods for complex styles
const fancyStyle = NewStyle()
  .Foreground('purple')
  .Background('#1a1a1a')
  .Bold(true)
  .Italic(true)
  .Padding(2)
  .BorderStyle('thick')
  .BorderForeground('gold');
```

### Method Chaining

Build complex styles with fluent method chaining:

**TypeScript-Native API:**

```typescript
const titleStyle = new Style()
  .color('white')
  .backgroundColor('blue')
  .bold(true)
  .padding(1, 3)
  .margin(1)
  .borderStyle('rounded')
  .borderForeground('blue')
  .width(40)
  .align('center');

const title = titleStyle.render('My Application');
```

**Go-Compatible API:**

```typescript
const titleStyle = NewStyle()
  .Foreground('white')
  .Background('blue')
  .Bold(true)
  .Padding(1, 3)
  .Margin(1)
  .BorderStyle('rounded')
  .BorderForeground('blue')
  .Width(40)
  .Align('center');

const title = titleStyle.Render('My Application');
```

### Rendering

Use the `Render()` method to apply styles to text:

```typescript
const style = NewStyle().Foreground('green').Bold(true);

// Simple rendering
console.log(style.Render('Success!'));

// Multiple renders with same style
const messages = ['File saved', 'Build complete', 'Tests passed'];
messages.forEach(msg => console.log(style.Render(`✓ ${msg}`)));
```

## Basic Examples

### Colored Text

```typescript
import { NewStyle } from '@tsports/lipgloss';

// Named colors
const error = NewStyle().Foreground('red').Render('Error!');
const success = NewStyle().Foreground('green').Render('Success!');
const warning = NewStyle().Foreground('yellow').Render('Warning!');

// Hex colors
const brand = NewStyle().Foreground('#6366f1').Render('Brand Color');

// RGB colors
const custom = NewStyle().Foreground('rgb(255, 87, 51)').Render('Custom RGB');

console.log(error);
console.log(success);
console.log(warning);
console.log(brand);
console.log(custom);
```

### Text Styling

**TypeScript-Native API:**

```typescript
const styles = {
  bold: new Style().bold(true),
  italic: new Style().italic(true),
  underline: new Style().underline(true),
  strikethrough: new Style().strikethrough(true),
  faint: new Style().faint(true)
};

console.log(styles.bold.render('Bold text'));
console.log(styles.italic.render('Italic text'));
console.log(styles.underline.render('Underlined text'));
console.log(styles.strikethrough.render('Strikethrough text'));
console.log(styles.faint.render('Faint text'));
```

**Go-Compatible API:**

```typescript
import { NewStyle } from '@tsports/lipgloss';

const styles = {
  bold: NewStyle().Bold(true),
  italic: NewStyle().Italic(true),
  underline: NewStyle().Underline(true),
  strikethrough: NewStyle().Strikethrough(true),
  faint: NewStyle().Faint(true)
};

console.log(styles.bold.Render('Bold text'));
console.log(styles.italic.Render('Italic text'));
console.log(styles.underline.Render('Underlined text'));
console.log(styles.strikethrough.Render('Strikethrough text'));
console.log(styles.faint.Render('Faint text'));
```

### Borders and Padding

**TypeScript-Native API:**

```typescript
const boxStyle = new Style()
  .borderStyle('normal')
  .borderForeground('cyan')
  .padding(1, 2)
  .width(30);

const content = 'This is a bordered box with padding';
console.log(boxStyle.render(content));
```

**Go-Compatible API:**

```typescript
import { NewStyle } from '@tsports/lipgloss';

const boxStyle = NewStyle()
  .BorderStyle('normal')
  .BorderForeground('cyan')
  .Padding(1, 2)
  .Width(30);

const content = 'This is a bordered box with padding';
console.log(boxStyle.Render(content));
```

**Output:**
```
┌────────────────────────────┐
│  This is a bordered box    │
│  with padding              │
└────────────────────────────┘
```

### Layout and Alignment

```typescript
// Center-aligned title
const titleStyle = NewStyle()
  .Width(50)
  .Align('center')
  .Bold(true)
  .Foreground('purple');

// Left-aligned content
const contentStyle = NewStyle()
  .Width(50)
  .Padding(1)
  .BorderStyle('rounded');

const title = titleStyle.Render('My Dashboard');
const content = contentStyle.Render('Welcome to the application!');

console.log(title);
console.log(content);
```

## Layout Composition

Combine multiple styled elements with join functions:

```typescript
import { NewStyle, JoinVertical, JoinHorizontal, Position } from '@tsports/lipgloss';

// Create styles
const headerStyle = NewStyle()
  .Foreground('white')
  .Background('blue')
  .Bold(true)
  .Padding(1)
  .Width(60)
  .Align('center');

const sidebarStyle = NewStyle()
  .Foreground('yellow')
  .Background('darkgray')
  .Padding(1)
  .Width(20)
  .Height(10);

const contentStyle = NewStyle()
  .Padding(1)
  .BorderStyle('rounded')
  .Width(38)
  .Height(10);

// Render components
const header = headerStyle.Render('Application Header');
const sidebar = sidebarStyle.Render('Navigation\n• Home\n• Settings\n• About');
const content = contentStyle.Render('Main content area\n\nWelcome to the app!');

// Compose layout
const mainArea = JoinHorizontal(Position.Top, sidebar, content);
const fullLayout = JoinVertical(Position.Left, header, mainArea);

console.log(fullLayout);
```

## Go Lipgloss Compatibility

Lipgloss TypeScript maintains 100% API compatibility with Go Lipgloss:

### Go → TypeScript

```go
// Go
style := lipgloss.NewStyle().
    Foreground(lipgloss.Color("205")).
    Background(lipgloss.Color("235")).
    Bold(true).
    Padding(1, 2)

fmt.Println(style.Render("Hello"))
```

```typescript
// TypeScript - identical API!
const style = NewStyle()
  .Foreground('205')
  .Background('235')
  .Bold(true)
  .Padding(1, 2);

console.log(style.Render('Hello'));
```

### Migration Tips

1. **Import patterns**: Replace `lipgloss.NewStyle()` with `NewStyle()` import
2. **Method names**: All methods are identical (case-sensitive)
3. **Color handling**: String colors work the same way
4. **Join functions**: `lipgloss.JoinVertical` → `JoinVertical`

## Next Steps

Now that you understand the basics, explore more advanced features:

- **[Examples](/examples/)** - See real-world usage patterns and learn from complete examples
- **[API Reference](/API)** - Complete documentation of all methods and properties
- **[Migration Guide](/guide/migration)** - Detailed guide for migrating from Go Lipgloss
- **Colors & Themes** - Master color handling and adaptive themes (See API docs)
- **Layout & Spacing** - Learn padding, margins, and dimensions (See API docs)
- **Borders** - Create beautiful bordered elements (See API docs)
- **Components** - Use lists, tables, and trees (See API docs)

## Common Patterns

### Conditional Styling

```typescript
const isError = true;
const messageStyle = NewStyle()
  .Foreground(isError ? 'red' : 'green')
  .Bold(isError);

console.log(messageStyle.Render(isError ? 'Error occurred' : 'Success'));
```

### Style Templates

```typescript
// Base styles for consistent theming
const baseButton = NewStyle()
  .Padding(1, 3)
  .BorderStyle('rounded')
  .Bold(true);

const primaryButton = baseButton.copy()
  .Foreground('white')
  .Background('blue')
  .BorderForeground('blue');

const secondaryButton = baseButton.copy()
  .Foreground('blue')
  .Background('transparent')
  .BorderForeground('blue');

console.log(primaryButton.Render('Save'));
console.log(secondaryButton.Render('Cancel'));
```

### Responsive Design

```typescript
function createResponsiveStyle(terminalWidth: number) {
  const isMobile = terminalWidth < 80;

  return NewStyle()
    .Width(isMobile ? terminalWidth - 4 : 60)
    .Padding(isMobile ? 1 : 2)
    .BorderStyle(isMobile ? 'normal' : 'rounded');
}

const style = createResponsiveStyle(process.stdout.columns || 80);
```

Ready to dive deeper? More examples and guides will be available soon!
