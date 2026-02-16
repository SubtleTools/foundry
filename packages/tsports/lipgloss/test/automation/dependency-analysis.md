# Lipgloss API Dependency Analysis

## Summary

- **Total API methods**: 512
- **Execution order determined**: 512 methods

## Methods by Category

### Basic (12 methods)

- `String` (complexity: 1)
- `NewStyle` (complexity: 1)
- `Renderer.NewStyle` (complexity: 1)
- `Style.String` (complexity: 1)
- `Style.Render` (complexity: 1)
- `Document.String` (complexity: 1)
- `List.String` (complexity: 1)
- `Render` (complexity: 5)
- `Table.Render` (complexity: 5)
- `Table.String` (complexity: 9)
- ... and 2 more

### Layout (124 methods)

- `UnsetWidth` (complexity: 1)
- `UnsetHeight` (complexity: 1)
- `UnsetAlign` (complexity: 1)
- `UnsetAlignHorizontal` (complexity: 1)
- `UnsetAlignVertical` (complexity: 1)
- `UnsetPaddingLeft` (complexity: 1)
- `UnsetPaddingRight` (complexity: 1)
- `UnsetPaddingTop` (complexity: 1)
- `UnsetPaddingBottom` (complexity: 1)
- `UnsetMarginLeft` (complexity: 1)
- ... and 114 more

### Color (93 methods)

- `RGBA` (complexity: 1)
- `NoColor.RGBA` (complexity: 1)
- `Color.RGBA` (complexity: 1)
- `ANSIColor.RGBA` (complexity: 1)
- `AdaptiveColor.RGBA` (complexity: 1)
- `CompleteColor.RGBA` (complexity: 1)
- `CompleteAdaptiveColor.RGBA` (complexity: 1)
- `UnsetForeground` (complexity: 1)
- `UnsetBackground` (complexity: 1)
- `UnsetColorWhitespace` (complexity: 1)
- ... and 83 more

### Border (76 methods)

- `UnsetBorderStyle` (complexity: 1)
- `UnsetBorderTop` (complexity: 1)
- `UnsetBorderRight` (complexity: 1)
- `UnsetBorderBottom` (complexity: 1)
- `UnsetBorderLeft` (complexity: 1)
- `Style.UnsetBorderStyle` (complexity: 1)
- `Style.UnsetBorderTop` (complexity: 1)
- `Style.UnsetBorderRight` (complexity: 1)
- `Style.UnsetBorderBottom` (complexity: 1)
- `Style.UnsetBorderLeft` (complexity: 1)
- ... and 66 more

### Component (101 methods)

- `Append` (complexity: 1)
- `Length` (complexity: 1)
- `NewFilter` (complexity: 1)
- `Filter` (complexity: 1)
- `NodeChildren.Append` (complexity: 1)
- `NodeChildren.Length` (complexity: 1)
- `Filter.Filter` (complexity: 1)
- `Filter.Length` (complexity: 1)
- `NewLeaf` (complexity: 1)
- `Children` (complexity: 1)
- ... and 91 more

### Advanced (106 methods)

- `SetString` (complexity: 1)
- `Copy` (complexity: 1)
- `Style.SetString` (complexity: 1)
- `Style.Value` (complexity: 1)
- `Style.Copy` (complexity: 1)
- `UnsetBold` (complexity: 1)
- `UnsetItalic` (complexity: 1)
- `UnsetUnderline` (complexity: 1)
- `UnsetStrikethrough` (complexity: 1)
- `UnsetReverse` (complexity: 1)
- ... and 96 more

## Recommended Test Execution Order

Tests should be executed in this order to ensure dependencies are satisfied:

1. **Basic** (12 methods)
1. **Color** (93 methods)
1. **Layout** (124 methods)
1. **Border** (76 methods)
1. **Component** (101 methods)
1. **Advanced** (106 methods)
