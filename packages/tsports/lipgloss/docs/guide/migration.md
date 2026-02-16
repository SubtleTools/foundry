# Migrating from Go Lipgloss

This guide helps you migrate from Go Lipgloss to TypeScript while maintaining 100% compatibility.

## Quick Reference

### Package Imports

::: code-group

```go [Go]
import "github.com/charmbracelet/lipgloss"
```

```typescript [TypeScript]
import { NewStyle, JoinVertical, Position } from '@tsports/lipgloss';
```

:::

### Basic Style Creation

::: code-group

```go [Go]
style := lipgloss.NewStyle().
    Foreground(lipgloss.Color("205")).
    Background(lipgloss.Color("235")).
    Bold(true).
    Padding(1, 2)

fmt.Println(style.Render("Hello"))
```

```typescript [TypeScript]
const style = NewStyle()
  .Foreground('205')
  .Background('235')
  .Bold(true)
  .Padding(1, 2);

console.log(style.Render('Hello'));
```

:::

## Method Mapping

All Go methods have direct TypeScript equivalents:

| Go Method | TypeScript Method | Notes |
|-----------|-------------------|-------|
| `lipgloss.NewStyle()` | `NewStyle()` | Identical |
| `style.Render(text)` | `style.Render(text)` | Identical |
| `lipgloss.Width(text)` | `Width(text)` | Identical |
| `lipgloss.Height(text)` | `Height(text)` | Identical |
| `lipgloss.JoinVertical(pos, strs...)` | `JoinVertical(pos, ...strs)` | Uses spread operator |
| `lipgloss.JoinHorizontal(pos, strs...)` | `JoinHorizontal(pos, ...strs)` | Uses spread operator |
| `lipgloss.Place(w, h, hPos, vPos, str)` | `Place(w, h, hPos, vPos, str)` | Identical |

## API Compatibility Examples

### Colors

::: code-group

```go [Go]
// Named colors
style.Foreground(lipgloss.Color("red"))

// ANSI colors
style.Foreground(lipgloss.Color("205"))

// Hex colors
style.Foreground(lipgloss.Color("#FF5733"))

// Adaptive colors
style.Foreground(lipgloss.AdaptiveColor{
    Light: "black",
    Dark:  "white",
})
```

```typescript [TypeScript]
// Named colors
style.Foreground('red')

// ANSI colors
style.Foreground('205')

// Hex colors
style.Foreground('#FF5733')

// Adaptive colors
style.Foreground({ light: 'black', dark: 'white' })
```

:::

### Text Styling

::: code-group

```go [Go]
style := lipgloss.NewStyle().
    Bold(true).
    Italic(true).
    Underline(true).
    Strikethrough(true).
    Faint(true).
    Blink(true)
```

```typescript [TypeScript]
const style = NewStyle()
  .Bold(true)
  .Italic(true)
  .Underline(true)
  .Strikethrough(true)
  .Faint(true)
  .Blink(true);
```

:::

### Layout & Spacing

::: code-group

```go [Go]
style := lipgloss.NewStyle().
    Padding(1, 2, 3, 4).
    Margin(1, 2).
    Width(50).
    Height(10).
    Align(lipgloss.Center)
```

```typescript [TypeScript]
const style = NewStyle()
  .Padding(1, 2, 3, 4)
  .Margin(1, 2)
  .Width(50)
  .Height(10)
  .Align('center');
```

:::

### Borders

::: code-group

```go [Go]
style := lipgloss.NewStyle().
    Border(lipgloss.RoundedBorder()).
    BorderForeground(lipgloss.Color("cyan")).
    BorderTop(true).
    BorderRight(false)
```

```typescript [TypeScript]
const style = NewStyle()
  .BorderStyle('rounded')
  .BorderForeground('cyan')
  .BorderTop(true)
  .BorderRight(false);
```

:::

### Join Functions

::: code-group

```go [Go]
layout := lipgloss.JoinVertical(
    lipgloss.Left,
    header,
    content,
    footer,
)

row := lipgloss.JoinHorizontal(
    lipgloss.Top,
    sidebar,
    main,
    rightPanel,
)
```

```typescript [TypeScript]
const layout = JoinVertical(
  Position.Left,
  header,
  content,
  footer
);

const row = JoinHorizontal(
  Position.Top,
  sidebar,
  main,
  rightPanel
);
```

:::

## Key Differences

### 1. Language Syntax

The main differences are TypeScript/JavaScript syntax conventions:

**Variable Declaration:**
```go
// Go
var style lipgloss.Style
style = lipgloss.NewStyle()
```

```typescript
// TypeScript
const style = NewStyle();
```

**Method Chaining:**
```go
// Go - methods end with dots on same line
style := lipgloss.NewStyle().
    Foreground(lipgloss.Color("blue")).
    Bold(true)
```

```typescript
// TypeScript - methods end with dots on next line
const style = NewStyle()
  .Foreground('blue')
  .Bold(true);
```

### 2. Import Patterns

**Go** uses package-level functions:
```go
import "github.com/charmbracelet/lipgloss"

style := lipgloss.NewStyle()
width := lipgloss.Width(text)
```

**TypeScript** uses named imports:
```typescript
import { NewStyle, Width } from '@tsports/lipgloss';

const style = NewStyle();
const width = Width(text);
```

### 3. Color Handling

Both versions accept the same color formats, but TypeScript doesn't need explicit `Color()` wrapping:

```go
// Go
.Foreground(lipgloss.Color("205"))
```

```typescript
// TypeScript
.Foreground('205')
```

### 4. Position Constants

::: code-group

```go [Go]
lipgloss.Left
lipgloss.Center
lipgloss.Right
lipgloss.Top
lipgloss.Bottom
```

```typescript [TypeScript]
Position.Left
Position.Center
Position.Right
Position.Top
Position.Bottom
```

:::

## Migration Checklist

### Phase 1: Setup
- [ ] Install `@tsports/lipgloss`
- [ ] Update imports to use named imports
- [ ] Replace `lipgloss.NewStyle()` with `NewStyle()`

### Phase 2: Styles
- [ ] Convert color values (remove `lipgloss.Color()` wrapper)
- [ ] Update position constants to use `Position.` prefix
- [ ] Convert variable declarations to TypeScript syntax

### Phase 3: Layout
- [ ] Update join function calls with spread operator
- [ ] Convert border style constants
- [ ] Update alignment constants

### Phase 4: Testing
- [ ] Run comparative tests to verify output
- [ ] Check terminal compatibility
- [ ] Validate color rendering

## Common Migration Patterns

### Converting Complex Layouts

::: code-group

```go [Go]
func createDashboard() string {
    titleStyle := lipgloss.NewStyle().
        Foreground(lipgloss.Color("white")).
        Background(lipgloss.Color("blue")).
        Bold(true).
        Padding(1).
        Width(60).
        Align(lipgloss.Center)

    contentStyle := lipgloss.NewStyle().
        Padding(2).
        Border(lipgloss.RoundedBorder()).
        BorderForeground(lipgloss.Color("gray"))

    title := titleStyle.Render("Dashboard")
    content := contentStyle.Render("Welcome!")

    return lipgloss.JoinVertical(lipgloss.Left, title, content)
}
```

```typescript [TypeScript]
function createDashboard(): string {
  const titleStyle = NewStyle()
    .Foreground('white')
    .Background('blue')
    .Bold(true)
    .Padding(1)
    .Width(60)
    .Align('center');

  const contentStyle = NewStyle()
    .Padding(2)
    .BorderStyle('rounded')
    .BorderForeground('gray');

  const title = titleStyle.Render('Dashboard');
  const content = contentStyle.Render('Welcome!');

  return JoinVertical(Position.Left, title, content);
}
```

:::

### Converting Adaptive Colors

::: code-group

```go [Go]
adaptiveStyle := lipgloss.NewStyle().
    Foreground(lipgloss.AdaptiveColor{
        Light: "#1a1a1a",
        Dark:  "#dddddd",
    }).
    Background(lipgloss.AdaptiveColor{
        Light: "#ffffff",
        Dark:  "#1a1a1a",
    })
```

```typescript [TypeScript]
const adaptiveStyle = NewStyle()
  .Foreground({
    light: '#1a1a1a',
    dark: '#dddddd'
  })
  .Background({
    light: '#ffffff',
    dark: '#1a1a1a'
  });
```

:::

## Testing Your Migration

Use the comparative testing approach to ensure your migration is correct:

```typescript
// Create test cases comparing Go and TypeScript output
import { NewStyle } from '@tsports/lipgloss';

const style = NewStyle()
  .Foreground('blue')
  .Bold(true)
  .Padding(1)
  .BorderStyle('rounded');

const result = style.Render('Test');
console.log(result);

// Compare with Go output to verify compatibility
```

## Performance Considerations

The TypeScript version maintains the same performance characteristics as Go Lipgloss:

- **Immutable styles** prevent accidental mutations
- **Efficient rendering** with optimized ANSI generation
- **Memory usage** comparable to Go version
- **Terminal detection** works identically

## Getting Help

If you encounter issues during migration:

1. **Check the examples** - See working patterns in `/examples/`
2. **Run comparative tests** - Verify output matches Go version
3. **Review API docs** - Complete method documentation available
4. **Open an issue** - Report compatibility problems on GitHub

The TypeScript port is designed to make migration seamless. Most code translates directly with only syntax changes needed!
