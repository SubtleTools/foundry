# Migration Guide to Lipgloss TypeScript

This guide helps you migrate from other popular terminal styling libraries to Lipgloss TypeScript.

## Table of Contents

- [Why Migrate to Lipgloss?](#why-migrate-to-lipgloss)
- [From Chalk](#from-chalk)
- [From Colors.js](#from-colorsjs)
- [From Kleur](#from-kleur)
- [From Picocolors](#from-picocolors)
- [From ANSI-Colors](#from-ansi-colors)
- [From CLI-Color](#from-cli-color)
- [Migration Strategies](#migration-strategies)
- [Advanced Features Unique to Lipgloss](#advanced-features-unique-to-lipgloss)

## Why Migrate to Lipgloss?

Lipgloss TypeScript offers several advantages over traditional styling libraries:

### 🎨 **Layout Capabilities**
- Padding, margins, borders, and alignment
- Width and height constraints
- Text wrapping and truncation
- Multi-line text handling

### 🔒 **Immutability**
- Style instances never mutate
- Safe to share and reuse
- Predictable behavior

### 📝 **TypeScript-First**
- Full type safety and IntelliSense
- Comprehensive type definitions
- Better developer experience

### 🧩 **Composability**
- Easy to build complex layouts
- Method chaining for readability
- Style inheritance and merging

### 🚀 **Performance**
- Efficient rendering pipeline
- Minimal memory footprint
- Optimized for CLI applications

## From Chalk

Chalk is the most popular Node.js terminal styling library. Here's how to migrate:

### Basic Text Styling

```typescript
// Before (Chalk)
import chalk from 'chalk';

console.log(chalk.red('Error message'));
console.log(chalk.bold.blue('Important note'));
console.log(chalk.underline.green('Success!'));

// After (Lipgloss)
import { Style } from '@tsports/lipgloss';

const errorStyle = new Style().color('red');
const importantStyle = new Style().bold(true).color('blue');
const successStyle = new Style().underline(true).color('green');

console.log(errorStyle.render('Error message'));
console.log(importantStyle.render('Important note'));
console.log(successStyle.render('Success!'));
```

### Background Colors

```typescript
// Before (Chalk)
chalk.bgRed.white('Error');
chalk.bgBlue.yellow('Info');

// After (Lipgloss)
const errorBg = new Style().backgroundColor('red').color('white');
const infoBg = new Style().backgroundColor('blue').color('yellow');

console.log(errorBg.render('Error'));
console.log(infoBg.render('Info'));
```

### Complex Styling

```typescript
// Before (Chalk)
const error = chalk.bold.red.bgWhite;
const warning = chalk.italic.yellow.underline;

console.log(error('Critical Error'));
console.log(warning('Warning Message'));

// After (Lipgloss)
const errorStyle = new Style()
  .bold(true)
  .color('red')
  .backgroundColor('white');

const warningStyle = new Style()
  .italic(true)
  .color('yellow')
  .underline(true);

console.log(errorStyle.render('Critical Error'));
console.log(warningStyle.render('Warning Message'));
```

### Template Literals

```typescript
// Before (Chalk)
console.log(`Status: ${chalk.green('✓')} ${chalk.bold('Complete')}`);

// After (Lipgloss)
const successIcon = new Style().color('green');
const boldText = new Style().bold(true);

console.log(`Status: ${successIcon.render('✓')} ${boldText.render('Complete')}`);

// Or create a reusable template
function statusMessage(icon: string, message: string, iconColor = 'green') {
  const iconStyle = new Style().color(iconColor);
  const messageStyle = new Style().bold(true);

  return `Status: ${iconStyle.render(icon)} ${messageStyle.render(message)}`;
}

console.log(statusMessage('✓', 'Complete'));
console.log(statusMessage('✗', 'Failed', 'red'));
```

### Conditional Styling

```typescript
// Before (Chalk)
const isError = true;
const message = isError ? chalk.red('Error') : chalk.green('Success');

// After (Lipgloss)
const isError = true;
const style = new Style().color(isError ? 'red' : 'green');
const message = style.render(isError ? 'Error' : 'Success');

// Or create different styles based on condition
const conditionalStyle = isError
  ? new Style().color('red')
  : new Style().color('green');
```

### RGB and Hex Colors

```typescript
// Before (Chalk)
chalk.hex('#FF5733')('Custom color');
chalk.rgb(255, 87, 51)('RGB color');

// After (Lipgloss)
const hexStyle = new Style().color('#FF5733');
const rgbStyle = new Style().color('rgb(255, 87, 51)');

console.log(hexStyle.render('Custom color'));
console.log(rgbStyle.render('RGB color'));
```

## From Colors.js

Colors.js extends String prototype. Here's the migration path:

### Basic Usage

```typescript
// Before (Colors.js)
import 'colors';

console.log('Hello'.red);
console.log('World'.blue.bold);
console.log('Success'.green.underline);

// After (Lipgloss)
import { Style } from '@tsports/lipgloss';

const redStyle = new Style().color('red');
const blueBoldStyle = new Style().color('blue').bold(true);
const greenUnderlineStyle = new Style().color('green').underline(true);

console.log(redStyle.render('Hello'));
console.log(blueBoldStyle.render('World'));
console.log(greenUnderlineStyle.render('Success'));
```

### Themes

```typescript
// Before (Colors.js)
import colors from 'colors';

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

console.log('hello'.error);

// After (Lipgloss)
// Create a theme object
const theme = {
  silly: new Style().color('rainbow'), // Note: rainbow not directly supported
  input: new Style().color('grey'),
  verbose: new Style().color('cyan'),
  prompt: new Style().color('grey'),
  info: new Style().color('green'),
  data: new Style().color('grey'),
  help: new Style().color('cyan'),
  warn: new Style().color('yellow'),
  debug: new Style().color('blue'),
  error: new Style().color('red')
};

console.log(theme.error.render('hello'));

// Or create a theme class
class Theme {
  static silly = new Style().color('magenta'); // Closest to rainbow
  static input = new Style().color('grey');
  static verbose = new Style().color('cyan');
  static prompt = new Style().color('grey');
  static info = new Style().color('green');
  static data = new Style().color('grey');
  static help = new Style().color('cyan');
  static warn = new Style().color('yellow');
  static debug = new Style().color('blue');
  static error = new Style().color('red');
}

console.log(Theme.error.render('hello'));
```

## From Kleur

Kleur is a lightweight chalk alternative:

### Basic Usage

```typescript
// Before (Kleur)
import kleur from 'kleur';

console.log(kleur.red('Error'));
console.log(kleur.bold(true).blue('Info'));
console.log(kleur.green().underline('Success'));

// After (Lipgloss)
import { Style } from '@tsports/lipgloss';

const errorStyle = new Style().color('red');
const infoStyle = new Style().bold(true).color('blue');
const successStyle = new Style().color('green').underline(true);

console.log(errorStyle.render('Error'));
console.log(infoStyle.render('Info'));
console.log(successStyle.render('Success'));
```

### Chaining

```typescript
// Before (Kleur)
const styled = kleur.bold(true).red().underline(true);
console.log(styled('Important message'));

// After (Lipgloss)
const styled = new Style().bold(true).color('red').underline(true);
console.log(styled.render('Important message'));
```

## From Picocolors

Picocolors is a minimal color library:

### Basic Usage

```typescript
// Before (Picocolors)
import pc from 'picocolors';

console.log(pc.red('Error'));
console.log(pc.bold(pc.blue('Info')));
console.log(pc.underline(pc.green('Success')));

// After (Lipgloss)
import { Style } from '@tsports/lipgloss';

const errorStyle = new Style().color('red');
const infoStyle = new Style().bold(true).color('blue');
const successStyle = new Style().underline(true).color('green');

console.log(errorStyle.render('Error'));
console.log(infoStyle.render('Info'));
console.log(successStyle.render('Success'));
```

### Conditional Colors

```typescript
// Before (Picocolors)
import pc from 'picocolors';

const isColorSupported = true;
const red = isColorSupported ? pc.red : (text) => text;
console.log(red('Maybe colored'));

// After (Lipgloss)
import { Style } from '@tsports/lipgloss';

const style = new Style().color('red'); // Color detection is automatic
console.log(style.render('Colored when supported'));

// Or with explicit control
const conditionalStyle = new Style().color(isColorSupported ? 'red' : null);
console.log(conditionalStyle.render('Maybe colored'));
```

## From ANSI-Colors

ANSI-Colors provides more granular control:

### Basic Usage

```typescript
// Before (ANSI-Colors)
import ansi from 'ansi-colors';

console.log(ansi.red('Error'));
console.log(ansi.bold.blue('Info'));

// After (Lipgloss)
import { Style } from '@tsports/lipgloss';

const errorStyle = new Style().color('red');
const infoStyle = new Style().bold(true).color('blue');

console.log(errorStyle.render('Error'));
console.log(infoStyle.render('Info'));
```

### Custom Themes

```typescript
// Before (ANSI-Colors)
import ansi from 'ansi-colors';

ansi.theme({
  danger: ansi.red,
  dark: ansi.dim.gray,
  disabled: ansi.gray,
  em: ansi.italic,
  heading: ansi.bold.underline,
  info: ansi.cyan,
  muted: ansi.dim,
  primary: ansi.blue,
  strong: ansi.bold,
  success: ansi.green,
  underline: ansi.underline,
  warning: ansi.yellow
});

// After (Lipgloss)
export const AppTheme = {
  danger: new Style().color('red'),
  dark: new Style().color('gray'), // dim not directly supported
  disabled: new Style().color('gray'),
  em: new Style().italic(true),
  heading: new Style().bold(true).underline(true),
  info: new Style().color('cyan'),
  muted: new Style().color('gray'), // dim equivalent
  primary: new Style().color('blue'),
  strong: new Style().bold(true),
  success: new Style().color('green'),
  underline: new Style().underline(true),
  warning: new Style().color('yellow')
};

console.log(AppTheme.danger.render('Error message'));
console.log(AppTheme.heading.render('Section Title'));
```

## From CLI-Color

CLI-Color has a different API:

### Basic Usage

```typescript
// Before (CLI-Color)
import clc from 'cli-color';

console.log(clc.red('Error'));
console.log(clc.blue.bold('Info'));
console.log(clc.green.underline('Success'));

// After (Lipgloss TypeScript-Native API)
import { Style } from '@tsports/lipgloss';

const errorStyle = new Style().color('red');
const infoStyle = new Style().color('blue').bold(true);
const successStyle = new Style().color('green').underline(true);

console.log(errorStyle.render('Error'));
console.log(infoStyle.render('Info'));
console.log(successStyle.render('Success'));

// Or Go-Compatible API (for Go developers)
import { NewStyle } from '@tsports/lipgloss';

console.log(NewStyle().Foreground('red').Render('Error'));
console.log(NewStyle().Foreground('blue').Bold(true).Render('Info'));
console.log(NewStyle().Foreground('green').Underline(true).Render('Success'));
```

### Formatting

```typescript
// Before (CLI-Color)
import clc from 'cli-color';

const formatted = clc.red.bold.underline;
console.log(formatted('Styled text'));

// After (Lipgloss)
import { Style } from '@tsports/lipgloss';

const formatted = new Style().color('red').bold(true).underline(true);
console.log(formatted.render('Styled text'));
```

## Migration Strategies

### 1. Gradual Migration

Start by replacing one component at a time:

```typescript
// Phase 1: Replace simple color calls
// Before: chalk.red('error')
// After: errorStyle.render('error')

// Phase 2: Replace complex styling
// Before: chalk.bold.red.bgWhite('alert')
// After: alertStyle.render('alert')

// Phase 3: Add layout features
const enhancedAlert = new Style()
  .bold(true)
  .color('red')
  .backgroundColor('white')
  .padding(1)
  .border({ top: true, bottom: true });
```

### 2. Create Migration Helpers

```typescript
// Helper to ease migration from chalk-style APIs
export class ChalkCompat {
  static red = new Style().color('red');
  static green = new Style().color('green');
  static blue = new Style().color('blue');
  static yellow = new Style().color('yellow');
  static magenta = new Style().color('magenta');
  static cyan = new Style().color('cyan');
  static white = new Style().color('white');
  static gray = new Style().color('gray');

  static bold = new Style().bold(true);
  static italic = new Style().italic(true);
  static underline = new Style().underline(true);

  // Chainable combinations
  static get boldRed() { return this.bold.color('red'); }
  static get boldBlue() { return this.bold.color('blue'); }
  // ... etc
}

// Usage
console.log(ChalkCompat.red.render('Error'));
console.log(ChalkCompat.boldBlue.render('Info'));
```

### 3. Wrapper Functions

```typescript
// Create wrapper functions for common patterns
export function error(text: string): string {
  return new Style()
    .bold(true)
    .color('red')
    .render(`❌ ${text}`);
}

export function success(text: string): string {
  return new Style()
    .bold(true)
    .color('green')
    .render(`✅ ${text}`);
}

export function warning(text: string): string {
  return new Style()
    .bold(true)
    .color('yellow')
    .render(`⚠️  ${text}`);
}

export function info(text: string): string {
  return new Style()
    .color('cyan')
    .render(`ℹ️  ${text}`);
}

// Usage
console.log(error('Something went wrong'));
console.log(success('Operation completed'));
```

## Advanced Features Unique to Lipgloss

Once migrated, you can leverage Lipgloss's unique features:

### Layout and Padding

```typescript
// Create padded boxes
const boxStyle = new Style()
  .padding(2)
  .border({ top: true, right: true, bottom: true, left: true })
  .color('white')
  .backgroundColor('blue');

console.log(boxStyle.render('This text is in a padded box'));
```

### Text Alignment

```typescript
// Center text within a specific width
const centeredStyle = new Style()
  .width(50)
  .align('center')
  .backgroundColor('gray');

console.log(centeredStyle.render('This text is centered'));
```

### Complex Layouts

```typescript
// Create sophisticated layouts
function createCard(title: string, content: string): string {
  const titleStyle = new Style()
    .bold(true)
    .color('white')
    .backgroundColor('blue')
    .width(40)
    .align('center')
    .padding(1);

  const contentStyle = new Style()
    .color('black')
    .backgroundColor('white')
    .width(40)
    .padding(1)
    .border({ left: true, right: true, bottom: true });

  return titleStyle.render(title) + '\n' + contentStyle.render(content);
}

console.log(createCard('Information', 'This is a card with a title and content area.'));
```

### Style Inheritance

```typescript
// Create base styles and extend them
const baseButtonStyle = new Style()
  .bold(true)
  .padding(1, 3)
  .border({ top: true, right: true, bottom: true, left: true });

const primaryButton = baseButtonStyle.color('white').backgroundColor('blue');
const secondaryButton = baseButtonStyle.color('blue').backgroundColor('white');
const dangerButton = baseButtonStyle.color('white').backgroundColor('red');

console.log(primaryButton.render('Primary'));
console.log(secondaryButton.render('Secondary'));
console.log(dangerButton.render('Danger'));
```

### Responsive Design

```typescript
// Adapt styles based on terminal width
function createResponsiveHeader(title: string, terminalWidth: number): string {
  const isNarrow = terminalWidth < 80;

  return new Style()
    .bold(true)
    .color('white')
    .backgroundColor('blue')
    .width(isNarrow ? terminalWidth - 4 : 80)
    .align('center')
    .padding(isNarrow ? 1 : 2)
    .render(title);
}
```

## Migration Checklist

- [ ] **Identify dependencies**: List all styling libraries currently in use
- [ ] **Create style inventory**: Document all current styling patterns
- [ ] **Plan migration phases**: Prioritize which components to migrate first
- [ ] **Create helper utilities**: Build compatibility layers for easier migration
- [ ] **Update tests**: Ensure visual output tests are updated for new styling
- [ ] **Leverage new features**: Identify opportunities to use Lipgloss's layout features
- [ ] **Performance testing**: Verify performance improvements with new implementation
- [ ] **Documentation**: Update code documentation and README files

## Common Gotchas

1. **Method chaining**: Lipgloss creates new instances, so save the result
   ```typescript
   // Wrong
   const style = new Style();
   style.bold(true); // Returns new instance, but not saved

   // Right
   const style = new Style().bold(true);
   ```

2. **Immutability**: Styles don't mutate, they return new instances
   ```typescript
   const baseStyle = new Style().color('red');
   const boldStyle = baseStyle.bold(true); // baseStyle is unchanged
   ```

3. **Rendering**: Don't forget to call `.render()`
   ```typescript
   // Wrong
   console.log(new Style().bold(true)); // Logs the Style object

   // Right
   console.log(new Style().bold(true).render('Text')); // Logs styled text
   ```

By following this migration guide, you'll be able to smoothly transition to Lipgloss TypeScript while gaining access to powerful layout and styling capabilities that aren't available in traditional color libraries.
