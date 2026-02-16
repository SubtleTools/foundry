**@tsports/go-osc52 v2.0.14-tsport**

***

# @tsports/go-osc52

[![npm version](https://badge.fury.io/js/@tsports%2Fgo-osc52.svg)](https://badge.fury.io/js/@tsports%2Fgo-osc52)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript port of [go-osc52](https://github.com/aymanbagabas/go-osc52) - Generate OSC52 escape sequences for terminal clipboard operations.

OSC52 is a terminal escape sequence that allows copying text to the clipboard from anywhere, including:

- SSH sessions
- Docker containers
- Terminal multiplexers (tmux, screen)
- Local terminals

This library provides a complete TypeScript implementation with 100% API compatibility with the original Go package.

## 🚀 Installation

```bash
# Using npm
npm install @tsports/go-osc52

# Using bun (recommended)
bun add @tsports/go-osc52

# Using yarn
yarn add @tsports/go-osc52
```

## 📖 Quick Start

### TypeScript-native API (Recommended)

```typescript
import { Sequence } from '@tsports/go-osc52';

// Copy text to system clipboard
const seq = new Sequence('Hello, clipboard!');
process.stderr.write(seq.toString());

// Copy to primary clipboard (X11)
const primary = new Sequence('Primary clipboard text').primary();
process.stderr.write(primary.toString());

// Use with tmux
const tmux = new Sequence('From tmux session').tmux();
process.stderr.write(tmux.toString());

// Query clipboard contents
const query = new Sequence().query();
process.stderr.write(query.toString());

// Clear clipboard
const clear = new Sequence().clear();
process.stderr.write(clear.toString());
```

### Go-compatible API

```typescript
import { New, Query, Clear } from '@tsports/go-osc52/go-style';

// Exact Go API compatibility
const seq = New('Hello from Go-style API');
process.stderr.write(seq.String());

// Chain operations like in Go
const result = New('text')
  .Primary()
  .Tmux()
  .Limit(1000);
process.stderr.write(result.String());

// Query and clear operations
process.stderr.write(Query().String());
process.stderr.write(Clear().String());
```

## 🔧 API Reference

### Core Types

```typescript
enum Clipboard {
  SystemClipboard = 'c',  // System clipboard
  PrimaryClipboard = 'p'  // X11 primary clipboard
}

enum Mode {
  DefaultMode = 0,  // Standard OSC52
  ScreenMode = 1,   // Escape for GNU screen
  TmuxMode = 2      // Escape for tmux
}

enum Operation {
  SetOperation = 0,    // Copy to clipboard
  QueryOperation = 1,  // Query clipboard
  ClearOperation = 2   // Clear clipboard
}
```

### Sequence Class

```typescript
class Sequence {
  // Fluent API methods
  tmux(): Sequence              // Set tmux mode
  screen(): Sequence            // Set screen mode
  primary(): Sequence           // Use primary clipboard
  withLimit(limit: number): Sequence  // Set size limit
  query(): Sequence             // Query operation
  clear(): Sequence             // Clear operation

  // Output methods
  toString(): string            // Get escape sequence
  writeTo(writer: Writer): Promise<number>  // Write to stream
}
```

### Module Functions

```typescript
// Create new sequences
New(...strings: string[]): Sequence
Query(): Sequence
Clear(): Sequence

// TypeScript-native alternatives
newSequence(...strings: string[]): Sequence
querySequence(): Sequence
clearSequence(): Sequence
```

## 🎨 Usage Examples

### SSH Session Clipboard

```typescript
import { Sequence } from '@tsports/go-osc52';

// Detect if we're in tmux and adjust accordingly
const isInTmux = process.env.TMUX !== undefined;
let seq = new Sequence('Copied from SSH!');

if (isInTmux) {
  seq = seq.tmux();
}

process.stderr.write(seq.toString());
```

### Large Text with Limits

```typescript
import { Sequence } from '@tsports/go-osc52';

const largeText = 'A'.repeat(10000);

// Set a limit to prevent terminal issues
const seq = new Sequence(largeText).withLimit(5000);
const result = seq.toString();

if (result === '') {
  console.log('Text too large for clipboard');
} else {
  process.stderr.write(result);
}
```

### Environment-aware Copying

```typescript
import { Sequence } from '@tsports/go-osc52';

function smartCopy(text: string): string {
  let seq = new Sequence(text);

  // Detect terminal environment
  const term = process.env.TERM || '';

  if (term.includes('screen')) {
    seq = seq.screen();
  } else if (process.env.TMUX) {
    seq = seq.tmux();
  }

  return seq.toString();
}

// Use it
process.stderr.write(smartCopy('Smart clipboard copy!'));
```

### Multiple Clipboard Targets

```typescript
import { Sequence, Clipboard } from '@tsports/go-osc52';

const text = 'Copy to multiple clipboards';

// System clipboard
const system = new Sequence(text);
process.stderr.write(system.toString());

// Primary clipboard (X11)
const primary = new Sequence(text).primary();
process.stderr.write(primary.toString());
```

### Stream Integration

```typescript
import { Sequence } from '@tsports/go-osc52';
import { Writable } from 'stream';

const seq = new Sequence('Stream integration example');

// Write to process.stderr
await seq.writeTo(process.stderr);

// Write to custom stream
const customStream = new Writable({
  write(chunk, encoding, callback) {
    console.log('Received:', chunk.toString());
    callback();
  }
});

await seq.writeTo(customStream);
```

## 🧪 Terminal Compatibility

| Terminal         | OSC52 Support | Notes                                              |
| ---------------- | ------------- | -------------------------------------------------- |
| Alacritty        | ✅ Yes        | Full support                                       |
| iTerm2           | ✅ Yes        | May need configuration                             |
| Kitty            | ✅ Yes        | Full support                                       |
| WezTerm          | ✅ Yes        | Full support                                       |
| tmux             | ⚠️ Partial     | Use `.tmux()` mode or configure `set-clipboard on` |
| GNU Screen       | ⚠️ Partial     | Use `.screen()` mode                               |
| Windows Terminal | ✅ Yes        | Recent versions                                    |
| VS Code Terminal | ❌ No         | Use extension workarounds                          |

## 🔧 Configuration

### Tmux Configuration

Add to your `~/.tmux.conf`:

```bash
# Enable clipboard integration
set -g set-clipboard on

# Or for manual mode (use .tmux() in code)
set -g allow-passthrough on
```

### SSH Configuration

For clipboard forwarding over SSH, some terminals support it automatically. For others, OSC52 sequences work without additional configuration.

## 🏗️ Development

```bash
# Clone the repository
git clone https://github.com/tsports/go-osc52.git
cd go-osc52

# Install dependencies
bun install

# Run tests
bun test

# Build the project
bun run build

# Run examples
bun run examples/usage-comparison.ts
```

## 🧪 Testing

The library includes comprehensive tests that verify 100% compatibility with the original Go implementation:

```bash
# Run all tests
bun test

# Run specific test suites
bun test test/basic.test.ts
```

Test coverage includes:

- All OSC52 sequence variations
- Tmux and Screen mode escaping
- Base64 encoding correctness
- Size limits and edge cases
- WriteTo functionality
- Go API compatibility

## 📦 Package Structure

```
@tsports/go-osc52/
├── index.js          # TypeScript-native API
├── go-style.js       # Go-compatible API
├── types.d.ts        # Type definitions
└── package.json
```

Import paths:

```typescript
// TypeScript-native (recommended)
import { Sequence, New, Query, Clear } from '@tsports/go-osc52';

// Go-compatible API
import { New, Query, Clear, Sequence } from '@tsports/go-osc52/go-style';
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`bun test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

- **[Ayman Bagabas](https://github.com/aymanbagabas)** - Author of the original [go-osc52](https://github.com/aymanbagabas/go-osc52) library
- **[Charm](https://charm.sh/)** - For the excellent terminal tooling ecosystem
- **[OSC52 Specification](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html)** - For the technical documentation

## 🔗 Related Projects

- [go-osc52](https://github.com/aymanbagabas/go-osc52) - Original Go implementation
- [@tsports/uniseg](https://github.com/tsports/uniseg) - Unicode text segmentation
- [Charm](https://charm.sh/) - Terminal applications and tools

---

<div align="center">
  <strong>Made with ❤️ for the terminal community</strong>
</div>
