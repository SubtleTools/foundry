# Lipgloss TypeScript API Documentation

Complete API reference for Lipgloss TypeScript - a terminal styling library for beautiful CLI applications.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Classes](#core-classes)
- [Style Properties](#style-properties)
- [Color System](#color-system)
- [Layout System](#layout-system)
- [Text Alignment](#text-alignment)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)
- [Examples](#examples)

## Installation

```bash
bun add @tsports/lipgloss
# or
npm install @tsports/lipgloss
# or
yarn add @tsports/lipgloss
```

## Quick Start

```typescript
import { Style } from '@tsports/lipgloss';

// Create a styled component
const errorStyle = new Style()
  .bold()
  .color('red')
  .backgroundColor('white')
  .padding(1, 2)
  .border({ top: true, bottom: true });

console.log(errorStyle.render('❌ Error: Something went wrong!'));
```

## Core Classes

### Style

The main class for creating and applying terminal styles.

#### Constructor

```typescript
new Style(properties?: Partial<StyleProperties>)
```

Creates a new Style instance with optional initial properties.

**Parameters:**
- `properties` (optional): Initial style properties

**Example:**
```typescript
const style = new Style({
  color: 'red',
  fontWeight: 'bold',
  padding: { top: 1, left: 2 }
});
```

#### Methods

##### Text Styling

###### `bold(enabled?: boolean): Style`

Applies bold text styling.

**Parameters:**
- `enabled` (optional, default: `true`): Whether to enable bold styling

**Returns:** New Style instance with bold styling applied

**Example:**
```typescript
const boldStyle = new Style().bold();
const conditionalBold = new Style().bold(true);
const noBold = new Style().bold(false);
```

###### `italic(enabled?: boolean): Style`

Applies italic text styling.

**Parameters:**
- `enabled` (optional, default: `true`): Whether to enable italic styling

**Returns:** New Style instance with italic styling applied

**Example:**
```typescript
const italicStyle = new Style().italic();
```

###### `underline(enabled?: boolean): Style`

Applies underline text decoration.

**Parameters:**
- `enabled` (optional, default: `true`): Whether to enable underline

**Returns:** New Style instance with underline applied

**Example:**
```typescript
const underlineStyle = new Style().underline();
```

###### `strikethrough(enabled?: boolean): Style`

Applies strikethrough text decoration.

**Parameters:**
- `enabled` (optional, default: `true`): Whether to enable strikethrough

**Returns:** New Style instance with strikethrough applied

**Example:**
```typescript
const strikethroughStyle = new Style().strikethrough();
```

##### Color Methods

###### `color(color: ColorValue): Style`

Sets the foreground color.

**Parameters:**
- `color`: Color value (hex string, RGB object, HSL object, named color, or ANSI code)

**Returns:** New Style instance with foreground color applied

**Example:**
```typescript
const redStyle = new Style().color('red');
const hexStyle = new Style().color('#FF5733');
const rgbStyle = new Style().color({ r: 255, g: 87, b: 51 });
const hslStyle = new Style().color({ h: 9, s: 100, l: 60 });
```

###### `backgroundColor(color: ColorValue): Style`

Sets the background color.

**Parameters:**
- `color`: Color value (same formats as `color()`)

**Returns:** New Style instance with background color applied

**Example:**
```typescript
const bgStyle = new Style().backgroundColor('blue');
const highlightStyle = new Style()
  .color('white')
  .backgroundColor('#FF5733');
```

##### Layout Methods

###### `width(width: number | 'auto' | 'fit-content' | 'max-content'): Style`

Sets the width constraint.

**Parameters:**
- `width`: Numeric width in characters, or special width values

**Returns:** New Style instance with width constraint applied

**Example:**
```typescript
const fixedWidth = new Style().width(50);
const autoWidth = new Style().width('auto');
const fitContent = new Style().width('fit-content');
```

###### `height(height: number | 'auto'): Style`

Sets the height constraint.

**Parameters:**
- `height`: Numeric height in lines, or 'auto'

**Returns:** New Style instance with height constraint applied

**Example:**
```typescript
const fixedHeight = new Style().height(10);
const autoHeight = new Style().height('auto');
```

###### `padding(...values: number[]): Style`

Sets padding using CSS-style shorthand notation.

**Parameters:**
- `values`: 1-4 numeric values representing padding
  - 1 value: all sides
  - 2 values: vertical, horizontal
  - 3 values: top, horizontal, bottom
  - 4 values: top, right, bottom, left

**Returns:** New Style instance with padding applied

**Example:**
```typescript
const allSides = new Style().padding(2); // 2 on all sides
const verticalHorizontal = new Style().padding(1, 3); // 1 vertical, 3 horizontal
const asymmetric = new Style().padding(1, 2, 3, 4); // top, right, bottom, left
```

###### `paddingTop(value: number): Style`

Sets top padding.

**Parameters:**
- `value`: Numeric padding value

**Returns:** New Style instance with top padding applied

###### `paddingRight(value: number): Style`

Sets right padding.

###### `paddingBottom(value: number): Style`

Sets bottom padding.

###### `paddingLeft(value: number): Style`

Sets left padding.

###### `paddingHorizontal(value: number): Style`

Sets horizontal (left and right) padding.

###### `paddingVertical(value: number): Style`

Sets vertical (top and bottom) padding.

###### `margin(...values: number[]): Style`

Sets margin using CSS-style shorthand notation (same format as padding).

###### Individual margin methods: `marginTop()`, `marginRight()`, `marginBottom()`, `marginLeft()`, `marginHorizontal()`, `marginVertical()`

Similar to padding methods but for margins.

##### Alignment Methods

###### `align(alignment: HorizontalAlignment): Style`

Sets horizontal text alignment.

**Parameters:**
- `alignment`: 'left', 'center', 'right', or 'justify'

**Returns:** New Style instance with horizontal alignment applied

**Example:**
```typescript
const centered = new Style().width(50).align('center');
const rightAligned = new Style().width(30).align('right');
```

###### `alignLeft(): Style`

Convenience method for left alignment.

###### `alignCenter(): Style`

Convenience method for center alignment.

###### `alignRight(): Style`

Convenience method for right alignment.

###### `alignJustify(): Style`

Convenience method for justified alignment.

###### `verticalAlign(alignment: VerticalAlignment): Style`

Sets vertical text alignment.

**Parameters:**
- `alignment`: 'top', 'center', 'bottom'

**Returns:** New Style instance with vertical alignment applied

###### `alignTop(): Style`

Convenience method for top vertical alignment.

###### `alignMiddle(): Style`

Convenience method for center vertical alignment.

###### `alignBottom(): Style`

Convenience method for bottom vertical alignment.

##### Border Methods

###### `border(config: BorderConfig): Style`

Sets border configuration.

**Parameters:**
- `config`: Object specifying which borders to show

**Returns:** New Style instance with border applied

**Example:**
```typescript
const fullBorder = new Style().border({
  top: true,
  right: true,
  bottom: true,
  left: true
});

const topBottomBorder = new Style().border({
  top: true,
  bottom: true
});
```

##### Transform Methods

###### `transform(fn: (text: string) => string): Style`

Sets a text transformation function.

**Parameters:**
- `fn`: Function that transforms the input text

**Returns:** New Style instance with transform function applied

**Example:**
```typescript
const upperCase = new Style().transform(text => text.toUpperCase());
const prefixed = new Style().transform(text => `>>> ${text}`);
```

##### Options Methods

###### `wordWrap(enabled?: boolean): Style`

Enables or disables word wrapping.

**Parameters:**
- `enabled` (optional, default: `true`): Whether to enable word wrapping

**Returns:** New Style instance with word wrapping configured

##### Unset Methods (NEW - 100% Go API Coverage)

**Complete set of unset methods for precise style manipulation:**

**Text Styling Unset Methods:**
- `unsetBold(): Style` - Remove bold styling
- `unsetItalic(): Style` - Remove italic styling
- `unsetUnderline(): Style` - Remove underline
- `unsetStrikethrough(): Style` - Remove strikethrough
- `unsetReverse(): Style` - Remove reverse/invert styling
- `unsetBlink(): Style` - Remove blink styling
- `unsetFaint(): Style` - Remove faint/dim styling

**Color Unset Methods:**
- `unsetForeground(): Style` - Remove text color
- `unsetBackground(): Style` - Remove background color

**Layout Unset Methods:**
- `unsetWidth(): Style` - Remove width constraint
- `unsetHeight(): Style` - Remove height constraint
- `unsetMaxWidth(): Style` - Remove max width constraint
- `unsetMaxHeight(): Style` - Remove max height constraint

**Alignment Unset Methods:**
- `unsetAlign(): Style` - Remove horizontal alignment
- `unsetAlignHorizontal(): Style` - Remove horizontal alignment
- `unsetAlignVertical(): Style` - Remove vertical alignment

**Padding Unset Methods:**
- `unsetPadding(): Style` - Remove all padding
- `unsetPaddingTop(): Style` - Remove top padding
- `unsetPaddingRight(): Style` - Remove right padding
- `unsetPaddingBottom(): Style` - Remove bottom padding
- `unsetPaddingLeft(): Style` - Remove left padding

**Margin Unset Methods:**
- `unsetMargins(): Style` - Remove all margins
- `unsetMarginBackground(): Style` - Remove margin background color
- `unsetMarginTop(): Style` - Remove top margin
- `unsetMarginRight(): Style` - Remove right margin
- `unsetMarginBottom(): Style` - Remove bottom margin
- `unsetMarginLeft(): Style` - Remove left margin

**Border Unset Methods:**
- `unsetBorderStyle(): Style` - Remove border style
- `unsetBorderForeground(): Style` - Remove border color
- `unsetBorderBackground(): Style` - Remove border background
- `unsetBorderTop(): Style` - Remove top border
- `unsetBorderRight(): Style` - Remove right border
- `unsetBorderBottom(): Style` - Remove bottom border
- `unsetBorderLeft(): Style` - Remove left border
- `unsetBorderTopForeground(): Style` - Remove top border color
- `unsetBorderRightForeground(): Style` - Remove right border color
- `unsetBorderBottomForeground(): Style` - Remove bottom border color
- `unsetBorderLeftForeground(): Style` - Remove left border color
- `unsetBorderTopBackground(): Style` - Remove top border background
- `unsetBorderRightBackground(): Style` - Remove right border background
- `unsetBorderBottomBackground(): Style` - Remove bottom border background
- `unsetBorderLeftBackground(): Style` - Remove left border background

**Advanced Unset Methods:**
- `unsetInline(): Style` - Remove inline styling
- `unsetTransform(): Style` - Remove text transform function
- `unsetString(): Style` - Remove string content
- `unsetUnderlineSpaces(): Style` - Remove underline spaces setting
- `unsetStrikethroughSpaces(): Style` - Remove strikethrough spaces setting
- `unsetColorWhitespace(): Style` - Remove whitespace coloring
- `unsetTabWidth(): Style` - Remove tab width setting
- `unsetRenderer(): Style` - Remove custom renderer

**Example Usage:**
```typescript
// Start with a complex style
const originalStyle = new Style()
  .bold(true)
  .color('red')
  .backgroundColor('blue')
  .padding(2)
  .margin(1)
  .borderStyle('rounded');

// Remove specific properties precisely
const noBold = originalStyle.unsetBold();              // Keep everything except bold
const noColors = originalStyle.unsetForeground().unsetBackground(); // Remove colors only
const noBorders = originalStyle.unsetBorderStyle();    // Remove border style only
const noSpacing = originalStyle.unsetPadding().unsetMargins(); // Remove spacing only
```

##### Utility Methods

###### `render(text: string): string`

Renders the styled text with all applied styling.

**Parameters:**
- `text`: The text to render with styling

**Returns:** Styled text with ANSI escape sequences

**Example:**
```typescript
const style = new Style().bold().color('red');
const output = style.render('Hello World');
console.log(output); // Outputs bold red "Hello World"
```

###### `copy(): Style`

Creates a deep copy of the style.

**Returns:** New Style instance with identical properties

###### `merge(other: Style): Style`

Merges another style into this one.

**Parameters:**
- `other`: Style to merge

**Returns:** New Style instance with merged properties

###### `getProperties(): Readonly<StyleProperties>`

Gets the current style properties.

**Returns:** Read-only copy of the style properties

## Style Properties

### StyleProperties Interface

```typescript
interface StyleProperties {
  // Text styling
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  textDecoration?: TextDecoration;

  // Colors
  color?: ColorValue;
  backgroundColor?: ColorValue;

  // Layout
  width?: number | 'auto' | 'fit-content' | 'max-content';
  height?: number | 'auto';
  maxWidth?: number;
  maxHeight?: number;

  // Spacing
  padding?: PaddingConfig;
  margin?: MarginConfig;

  // Alignment
  horizontalAlignment?: HorizontalAlignment;
  verticalAlignment?: VerticalAlignment;

  // Borders
  border?: BorderConfig;

  // Transform
  transform?: (text: string) => string;

  // Options
  wordWrap?: boolean;
}
```

## Color System

### ColorValue Type

Supports multiple color formats:

```typescript
type ColorValue =
  | string                    // Hex ('#FF0000'), named ('red'), or ANSI ('31')
  | RGBColor                  // { r: 255, g: 0, b: 0 }
  | RGBAColor                 // { r: 255, g: 0, b: 0, a: 1 }
  | HSLColor                  // { h: 0, s: 100, l: 50 }
  | HSLAColor                 // { h: 0, s: 100, l: 50, a: 1 }
  | ANSIColor                 // ANSI color code number
  | null;                     // No color
```

### Named Colors

Predefined color constants:

```typescript
import { Colors } from '@tsports/lipgloss';

// Basic colors
Colors.Black, Colors.Red, Colors.Green, Colors.Yellow,
Colors.Blue, Colors.Magenta, Colors.Cyan, Colors.White

// Bright colors
Colors.BrightBlack, Colors.BrightRed, Colors.BrightGreen,
Colors.BrightYellow, Colors.BrightBlue, Colors.BrightMagenta,
Colors.BrightCyan, Colors.BrightWhite

// Extended colors
Colors.DarkRed, Colors.DarkGreen, Colors.DarkBlue,
Colors.LightRed, Colors.LightGreen, Colors.LightBlue
```

### Hex Colors

```typescript
import { HexColors } from '@tsports/lipgloss';

HexColors.Red      // '#FF0000'
HexColors.Green    // '#00FF00'
HexColors.Blue     // '#0000FF'
// ... and many more
```

## Layout System

### Padding Configuration

```typescript
interface PaddingConfig {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}
```

### Margin Configuration

```typescript
interface MarginConfig {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}
```

### Border Configuration

```typescript
interface BorderConfig {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
}
```

## Text Alignment

### Horizontal Alignment

```typescript
type HorizontalAlignment = 'left' | 'center' | 'right' | 'justify';
```

### Vertical Alignment

```typescript
type VerticalAlignment = 'top' | 'center' | 'bottom';
```

## Utility Functions

### ColorUtils

```typescript
import { ColorUtils } from '@tsports/lipgloss';

// Color conversions
ColorUtils.hexToRGB('#FF0000')           // { r: 255, g: 0, b: 0 }
ColorUtils.rgbToHex({ r: 255, g: 0, b: 0 }) // '#FF0000'
ColorUtils.hslToRGB({ h: 0, s: 100, l: 50 }) // { r: 255, g: 0, b: 0 }
ColorUtils.rgbToHSL({ r: 255, g: 0, b: 0 }) // { h: 0, s: 100, l: 50 }

// Color analysis
ColorUtils.getLuminance({ r: 255, g: 0, b: 0 }) // 0.2126
ColorUtils.getContrastRatio(color1, color2)     // 4.5
```

### AlignUtils

```typescript
import { AlignUtils } from '@tsports/lipgloss';

// Text alignment
AlignUtils.alignText('Hello', 20, 'center')     // '       Hello        '
AlignUtils.center('Hello', 20, 10)              // Centers in 20x10 box
AlignUtils.getOptimalWidth('Multi\nLine\nText') // Width of longest line
```

### BorderUtils

```typescript
import { BorderUtils } from '@tsports/lipgloss';

// Border helpers
BorderUtils.all()                    // All borders enabled
BorderUtils.none()                   // No borders
BorderUtils.horizontal()             // Top and bottom only
BorderUtils.vertical()               // Left and right only
BorderUtils.create(true, false, true, false) // Custom borders
```

## Type Definitions

### Font Types

```typescript
enum FontWeight {
  Normal = 'normal',
  Bold = 'bold',
  Faint = 'faint'
}

enum FontStyle {
  Normal = 'normal',
  Italic = 'italic'
}
```

### Text Decoration

```typescript
interface TextDecoration {
  underline?: boolean;
  strikethrough?: boolean;
}
```

## Component APIs (Enhanced with New Methods)

### Table Component - Enhanced API

The Table component has been enhanced with 5 new methods for complete Go compatibility:

#### New Table Methods

##### `borderHeader(enabled: boolean): Table`

Controls whether to show borders around table headers.

**Parameters:**
- `enabled`: Whether to show header borders

**Returns:** New Table instance with header border setting applied

##### `borderColumn(enabled: boolean): Table`

Controls whether to show vertical borders between columns.

**Parameters:**
- `enabled`: Whether to show column separators

**Returns:** New Table instance with column border setting applied

##### `borderRow(enabled: boolean): Table`

Controls whether to show horizontal borders between rows.

**Parameters:**
- `enabled`: Whether to show row separators

**Returns:** New Table instance with row border setting applied

##### `offset(offset: number): Table`

Sets the table's offset from the left margin.

**Parameters:**
- `offset`: Number of spaces to offset the table

**Returns:** New Table instance with offset applied

##### `wrap(enabled: boolean): Table`

Enables or disables text wrapping within table cells.

**Parameters:**
- `enabled`: Whether to enable text wrapping

**Returns:** New Table instance with text wrapping setting applied

#### Enhanced Table Example

```typescript
import { newTable, Style } from '@tsports/lipgloss';

// Create a sophisticated table with new controls
const advancedTable = newTable()
  .setHeaders('Product', 'Price', 'Stock Status', 'Last Updated')
  .rows(
    ['MacBook Pro', '$2,399', 'In Stock', '2024-08-18'],
    ['iPad Air', '$599', 'Low Stock', '2024-08-17'],
    ['iPhone 15', '$999', 'Out of Stock', '2024-08-16']
  )
  .borderStyle('rounded')
  .borderHeader(true)        // NEW: Show header borders
  .borderColumn(false)       // NEW: Hide column separators for cleaner look
  .borderRow(true)           // NEW: Show row separators
  .offset(4)                 // NEW: Indent table by 4 spaces
  .wrap(true)                // NEW: Enable text wrapping in cells
  .headerStyle(new Style().bold(true).color('cyan'))
  .styleFunc((row, col, value) => {
    // Style stock status column differently
    if (col === 2) {
      if (value === 'In Stock') return new Style().color('green');
      if (value === 'Low Stock') return new Style().color('yellow');
      if (value === 'Out of Stock') return new Style().color('red');
    }
    return new Style().color('white');
  });

console.log(advancedTable.render());
```

#### Go-Compatible Table API

All new methods are also available with PascalCase for Go compatibility:

```typescript
import { NewTable, NewStyle } from '@tsports/lipgloss';

const goTable = NewTable()
  .SetHeaders('Name', 'Age', 'City')
  .Row('Alice', '25', 'New York')
  .Row('Bob', '30', 'San Francisco')
  .BorderHeader(true)        // PascalCase method names
  .BorderColumn(false)
  .BorderRow(true)
  .Offset(2)
  .Wrap(true)
  .HeaderStyle(NewStyle().Bold(true).Foreground('blue'));
```

## Global Utility Functions (Enhanced)

### New Whitespace Functions

Three new global functions for advanced whitespace control:

#### `WithWhitespaceForeground(color: ColorValue): WhitespaceOption`

Sets the foreground color for rendered whitespace characters.

**Parameters:**
- `color`: Color value for whitespace characters

**Returns:** Whitespace option for use with rendering functions

#### `WithWhitespaceBackground(color: ColorValue): WhitespaceOption`

Sets the background color for rendered whitespace characters.

**Parameters:**
- `color`: Background color value for whitespace

**Returns:** Whitespace option for use with rendering functions

#### `WithWhitespaceChars(chars: string): WhitespaceOption`

Sets custom characters to display for whitespace.

**Parameters:**
- `chars`: String containing replacement characters for different whitespace types

**Returns:** Whitespace option for use with rendering functions

**Example Usage:**
```typescript
import {
  WithWhitespaceForeground,
  WithWhitespaceBackground,
  WithWhitespaceChars,
  renderWhitespace
} from '@tsports/lipgloss';

// Render text with custom whitespace visualization
const text = "Hello\t\tworld\n\nwith   spaces";

const styledWhitespace = renderWhitespace(text, [
  WithWhitespaceForeground('blue'),
  WithWhitespaceBackground('gray'),
  WithWhitespaceChars('·—¶⎵')  // Custom chars for different whitespace types
]);

console.log(styledWhitespace);
```

### New Constants

#### `NoTabConversion`

Constant to disable tab-to-space conversion in text processing.

```typescript
import { NoTabConversion } from '@tsports/lipgloss';

// Disable tab conversion
const style = new Style().tabWidth(NoTabConversion);
```

## Examples

### Basic Styling

```typescript
import { Style } from '@tsports/lipgloss';

// Simple text styling
const header = new Style()
  .bold()
  .color('blue')
  .render('Welcome to My App');

// Error message
const error = new Style()
  .color('red')
  .backgroundColor('white')
  .bold()
  .padding(1)
  .render('❌ Error: File not found');
```

### Layout Examples

```typescript
// Centered box
const box = new Style()
  .width(50)
  .height(10)
  .align('center')
  .verticalAlign('center')
  .border({ top: true, right: true, bottom: true, left: true })
  .padding(2)
  .render('This text is centered in a bordered box');

// Table-like layout
const tableHeader = new Style()
  .bold()
  .color('blue')
  .width(80)
  .render('Name                Age    City');

const tableRow = new Style()
  .color('white')
  .width(80)
  .render('John Doe            25     New York');
```

### Progress Bars

```typescript
function createProgressBar(completed: number, total: number): string {
  const percentage = Math.floor((completed / total) * 100);
  const barWidth = 30;
  const completedWidth = Math.floor((completed / total) * barWidth);

  const completedBar = '█'.repeat(completedWidth);
  const remainingBar = '░'.repeat(barWidth - completedWidth);

  const progressStyle = new Style().color('green');
  const textStyle = new Style().bold();

  return [
    progressStyle.render(`[${completedBar}${remainingBar}]`),
    textStyle.render(`${percentage}%`)
  ].join(' ');
}
```

### Dashboard Layout

```typescript
function createDashboard(): string {
  const title = new Style()
    .bold()
    .color('cyan')
    .width(60)
    .align('center')
    .render('🚀 System Dashboard');

  const separator = '─'.repeat(60);

  const stats = [
    { label: 'CPU Usage', value: '45%', status: 'good' },
    { label: 'Memory', value: '78%', status: 'warning' },
    { label: 'Disk Space', value: '92%', status: 'critical' }
  ];

  const statLines = stats.map(stat => {
    const color = stat.status === 'good' ? 'green' :
                  stat.status === 'warning' ? 'yellow' : 'red';

    const label = new Style().color('white').render(stat.label.padEnd(15));
    const value = new Style().bold().color(color).render(stat.value);

    return `${label}: ${value}`;
  });

  return [title, separator, ...statLines].join('\n');
}
```

## Best Practices

1. **Use method chaining** for readable style composition
2. **Cache Style instances** when applying the same styling multiple times
3. **Use semantic color names** or constants instead of hex values
4. **Test output** in different terminal environments
5. **Consider color contrast** for accessibility
6. **Use consistent spacing** throughout your application
7. **Leverage TypeScript types** for better development experience

## Migration from Other Libraries

### From Chalk

```typescript
// Chalk
chalk.bold.red('Error message')

// Lipgloss
new Style().bold().color('red').render('Error message')
```

### From Colors.js

```typescript
// Colors.js
'Hello'.red.bold

// Lipgloss
new Style().color('red').bold().render('Hello')
```

### From Kleur

```typescript
// Kleur
kleur.bold().red('Message')

// Lipgloss
new Style().bold().color('red').render('Message')
```

The main advantages of Lipgloss over these libraries:

- **Layout capabilities**: Padding, margins, borders, alignment
- **Immutability**: Style instances never mutate
- **TypeScript-first**: Full type safety and IntelliSense
- **Composability**: Easy to build complex layouts
- **Extensibility**: Plugin system for custom renderers
