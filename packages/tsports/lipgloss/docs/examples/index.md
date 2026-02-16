# Examples

Welcome to the Lipgloss TypeScript examples! These examples demonstrate various features and use cases of the library.

## Basic Examples

### Hello World

The simplest example showing basic text styling:

```typescript
import { NewStyle } from '@tsports/lipgloss';

const style = NewStyle()
  .Foreground('hotpink')
  .Bold(true);

console.log(style.Render('Hello, Lipgloss!'));
```

### Colors and Text Styling

```typescript
import { NewStyle } from '@tsports/lipgloss';

// Different color formats
const hexStyle = NewStyle().Foreground('#FF5733');
const rgbStyle = NewStyle().Foreground('rgb(255, 87, 51)');
const namedStyle = NewStyle().Foreground('red');

// Text decorations
const bold = NewStyle().Bold(true);
const italic = NewStyle().Italic(true);
const underline = NewStyle().Underline(true);
const combined = NewStyle().Bold(true).Italic(true).Underline(true);

console.log(hexStyle.Render('Hex color'));
console.log(rgbStyle.Render('RGB color'));
console.log(namedStyle.Render('Named color'));
console.log(bold.Render('Bold text'));
console.log(italic.Render('Italic text'));
console.log(underline.Render('Underlined text'));
console.log(combined.Render('Bold, italic, and underlined'));
```

### Borders and Boxes

```typescript
import { NewStyle } from '@tsports/lipgloss';

const boxStyle = NewStyle()
  .BorderStyle('rounded')
  .BorderForeground('cyan')
  .Padding(1, 2)
  .Width(30);

console.log(boxStyle.Render('This is a bordered box'));
```

### Layout and Alignment

```typescript
import { NewStyle, JoinVertical, JoinHorizontal, Position } from '@tsports/lipgloss';

// Create header
const headerStyle = NewStyle()
  .Foreground('white')
  .Background('blue')
  .Bold(true)
  .Padding(1)
  .Width(60)
  .Align('center');

// Create sidebar
const sidebarStyle = NewStyle()
  .Foreground('yellow')
  .Background('darkgray')
  .Padding(1)
  .Width(20)
  .Height(8);

// Create content
const contentStyle = NewStyle()
  .Padding(1)
  .BorderStyle('rounded')
  .Width(38)
  .Height(8);

const header = headerStyle.Render('My Application');
const sidebar = sidebarStyle.Render('Menu\n• Home\n• About\n• Contact');
const content = contentStyle.Render('Welcome to the main content area!');

// Compose layout
const mainArea = JoinHorizontal(Position.Top, sidebar, content);
const layout = JoinVertical(Position.Left, header, mainArea);

console.log(layout);
```

## Advanced Examples

### Dashboard Layout

```typescript
import { NewStyle, JoinVertical, JoinHorizontal, Position } from '@tsports/lipgloss';

function createDashboard() {
  // Title
  const titleStyle = NewStyle()
    .Foreground('cyan')
    .Bold(true)
    .Width(80)
    .Align('center')
    .Padding(1);

  // Stats
  const statStyle = NewStyle()
    .BorderStyle('rounded')
    .Padding(1)
    .Width(25)
    .Height(4);

  const goodStat = statStyle.copy().BorderForeground('green');
  const warnStat = statStyle.copy().BorderForeground('yellow');
  const errorStat = statStyle.copy().BorderForeground('red');

  const title = titleStyle.Render('🚀 System Dashboard');

  const cpu = goodStat.Render('CPU Usage\n45%\n✓ Normal');
  const memory = warnStat.Render('Memory\n78%\n⚠ High');
  const disk = errorStat.Render('Disk Space\n95%\n❌ Critical');

  const stats = JoinHorizontal(Position.Top, cpu, ' ', memory, ' ', disk);

  return JoinVertical(Position.Left, title, '', stats);
}

console.log(createDashboard());
```

### Progress Bar

```typescript
import { NewStyle } from '@tsports/lipgloss';

function createProgressBar(progress: number, total: number, width: number = 40) {
  const percentage = Math.floor((progress / total) * 100);
  const filled = Math.floor((progress / total) * width);
  const empty = width - filled;

  const progressStyle = NewStyle().Foreground('green');
  const emptyStyle = NewStyle().Foreground('gray');
  const textStyle = NewStyle().Bold(true);

  const bar = progressStyle.Render('█'.repeat(filled)) +
              emptyStyle.Render('░'.repeat(empty));

  return `${bar} ${textStyle.Render(`${percentage}%`)}`;
}

// Demo different progress levels
console.log('Loading...', createProgressBar(25, 100));
console.log('Installing...', createProgressBar(67, 100));
console.log('Complete!', createProgressBar(100, 100));
```

### Table Layout

```typescript
import { NewStyle, JoinVertical } from '@tsports/lipgloss';

function createTable() {
  const headerStyle = NewStyle()
    .Bold(true)
    .Foreground('cyan')
    .BorderStyle('normal')
    .Padding(0, 1);

  const cellStyle = NewStyle()
    .BorderStyle('normal')
    .Padding(0, 1)
    .Width(15);

  const headers = ['Name', 'Age', 'City'].map(h =>
    headerStyle.copy().Width(15).Render(h)
  ).join('');

  const rows = [
    ['Alice', '25', 'New York'],
    ['Bob', '30', 'Los Angeles'],
    ['Charlie', '35', 'Chicago']
  ].map(row =>
    row.map(cell => cellStyle.Render(cell)).join('')
  );

  return JoinVertical(Position.Left, headers, ...rows);
}

console.log(createTable());
```

### Color Themes

```typescript
import { NewStyle } from '@tsports/lipgloss';

// Define theme colors
const themes = {
  dark: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#1f2937',
    text: '#f9fafb'
  },
  light: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    background: '#ffffff',
    text: '#111827'
  }
};

function createThemedButton(text: string, theme: 'primary' | 'success' | 'warning' | 'error', mode: 'dark' | 'light' = 'dark') {
  const colors = themes[mode];

  return NewStyle()
    .Foreground(colors.text)
    .Background(colors[theme])
    .Bold(true)
    .Padding(1, 3)
    .BorderStyle('rounded')
    .Render(text);
}

console.log('Dark theme:');
console.log(createThemedButton('Primary', 'primary', 'dark'));
console.log(createThemedButton('Success', 'success', 'dark'));
console.log(createThemedButton('Warning', 'warning', 'dark'));
console.log(createThemedButton('Error', 'error', 'dark'));

console.log('\nLight theme:');
console.log(createThemedButton('Primary', 'primary', 'light'));
console.log(createThemedButton('Success', 'success', 'light'));
console.log(createThemedButton('Warning', 'warning', 'light'));
console.log(createThemedButton('Error', 'error', 'light'));
```

## Real-World Examples

### CLI Application Interface

```typescript
import { NewStyle, JoinVertical, JoinHorizontal, Position } from '@tsports/lipgloss';

function createCLIInterface() {
  // Header
  const headerStyle = NewStyle()
    .Foreground('white')
    .Background('blue')
    .Bold(true)
    .Padding(1)
    .Width(80)
    .Align('center');

  // Command prompt
  const promptStyle = NewStyle()
    .Foreground('green')
    .Bold(true);

  // Status bar
  const statusStyle = NewStyle()
    .Foreground('white')
    .Background('gray')
    .Padding(0, 1)
    .Width(80);

  // Content area
  const contentStyle = NewStyle()
    .Padding(1)
    .Height(10)
    .Width(78);

  const header = headerStyle.Render('📁 File Manager v1.0');
  const content = contentStyle.Render(
    'Documents/\n' +
    'Pictures/\n' +
    'Downloads/\n' +
    'README.md\n' +
    'package.json'
  );
  const prompt = promptStyle.Render('$ ') + 'ls -la';
  const status = statusStyle.Render('Ready | 5 items | Press ? for help');

  return JoinVertical(Position.Left, header, content, prompt, status);
}

console.log(createCLIInterface());
```

### Log Viewer

```typescript
import { NewStyle, JoinVertical } from '@tsports/lipgloss';

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  timestamp: string;
  message: string;
}

function formatLogEntry(entry: LogEntry) {
  const levelStyles = {
    info: NewStyle().Foreground('blue'),
    warn: NewStyle().Foreground('yellow'),
    error: NewStyle().Foreground('red').Bold(true),
    debug: NewStyle().Foreground('gray')
  };

  const timestampStyle = NewStyle().Foreground('gray');
  const messageStyle = NewStyle().Foreground('white');

  const level = levelStyles[entry.level].Render(entry.level.toUpperCase().padEnd(5));
  const timestamp = timestampStyle.Render(entry.timestamp);
  const message = messageStyle.Render(entry.message);

  return `${timestamp} ${level} ${message}`;
}

const logs: LogEntry[] = [
  { level: 'info', timestamp: '2024-01-15 10:30:15', message: 'Application started' },
  { level: 'warn', timestamp: '2024-01-15 10:30:45', message: 'High memory usage detected' },
  { level: 'error', timestamp: '2024-01-15 10:31:12', message: 'Failed to connect to database' },
  { level: 'debug', timestamp: '2024-01-15 10:31:15', message: 'Retrying connection...' },
  { level: 'info', timestamp: '2024-01-15 10:31:18', message: 'Database connection restored' }
];

const formattedLogs = logs.map(formatLogEntry);
const logViewer = JoinVertical(Position.Left, ...formattedLogs);

console.log(NewStyle().BorderStyle('rounded').Padding(1).Render(logViewer));
```

## Running Examples

To run these examples locally:

1. Install the package:
   ```bash
   bun add @tsports/lipgloss
   ```

2. Create a TypeScript file with any example above

3. Run with Bun:
   ```bash
   bun run example.ts
   ```

Or check out the complete example files in the project's `examples/` directory on GitHub.

## Next Steps

- Explore the [API Documentation](../API.md) for complete method references
- Read the [Getting Started Guide](../guide/getting-started.md) for detailed tutorials
- Check the [Migration Guide](../guide/migration.md) if coming from Go Lipgloss
