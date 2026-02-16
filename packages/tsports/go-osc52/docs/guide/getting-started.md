# Getting Started

## Installation

Install the package using your preferred package manager:

::: code-group

```bash [bun]
bun add @tsports/go-osc52
```

```bash [npm]
npm install @tsports/go-osc52
```

```bash [yarn]
yarn add @tsports/go-osc52
```

:::

## Quick Start

### TypeScript-Native API (Recommended)

```typescript
import { newSequence, clearSequence, querySequence } from '@tsports/go-osc52';

// Copy text to clipboard
const seq = newSequence('Hello, clipboard!');
process.stdout.write(seq.copy());

// Query clipboard contents
process.stdout.write(querySequence());

// Clear clipboard
process.stdout.write(clearSequence());
```

### Go-Compatible API

Perfect for developers migrating from Go - import from the `go-style` module:

```typescript
import { New, Clear, Query } from '@tsports/go-osc52/go-style';

// Exact Go API with PascalCase methods
const seq = New('Hello, clipboard!');
process.stdout.write(seq.Copy());

// Query and clear clipboard
process.stdout.write(Query());
process.stdout.write(Clear());
```

#### Available Go-Compatible Functions

The `go-style` export provides all Go functions with exact naming:

**Core Functions:**
- `New(text)` - Create new OSC52 sequence
- `Clear()` - Create clear sequence
- `Query()` - Create query sequence

**Sequence Methods:**
- `seq.Copy()` - Generate copy escape sequence
- `seq.String()` - Get the text content
- `seq.Bytes()` - Get sequence as bytes

**Clipboard Modes:**
- Support for system clipboard, primary selection
- Terminal multiplexer compatibility (tmux, screen)

## Next Steps

- Check out the [Examples](/guide/examples) for more detailed usage
- Browse the complete [API Reference](/api/) for all available functions
- See the [GitHub repository](https://github.com/tsports/go-osc52) for source code and issues