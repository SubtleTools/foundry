# Examples

## Basic Usage Examples

### Simple Clipboard Operations

```typescript
import { newSequence, clearSequence, querySequence } from '@tsports/go-osc52';

// Copy text to clipboard
const copySeq = newSequence('Hello, clipboard!');
process.stdout.write(copySeq.copy());

// Query clipboard contents
process.stdout.write(querySequence());

// Clear clipboard
process.stdout.write(clearSequence());
```

### Terminal Output Examples

```typescript
import { newSequence } from '@tsports/go-osc52';

// Copy current working directory
const pwd = process.cwd();
process.stdout.write(newSequence(pwd).copy());
console.log(`Copied to clipboard: ${pwd}`);

// Copy JSON data
const data = { name: 'John', age: 30 };
const jsonStr = JSON.stringify(data, null, 2);
process.stdout.write(newSequence(jsonStr).copy());
console.log('JSON data copied to clipboard');
```

### Go-Compatible API

```typescript
import { New, Clear, Query } from '@tsports/go-osc52/go-style';

// Exact Go API with PascalCase methods
const seq = New('Hello from TypeScript!');
process.stdout.write(seq.Copy());

// Query and clear operations
process.stdout.write(Query());
process.stdout.write(Clear());
```

## Advanced Examples

### SSH/Remote Session Support

```typescript
import { newSequence } from '@tsports/go-osc52';

// Works over SSH connections
function copyToRemoteClipboard(text: string) {
  const seq = newSequence(text);
  
  // OSC52 sequences work through SSH
  process.stdout.write(seq.copy());
  
  console.log(`Copied "${text}" to clipboard via OSC52`);
}

// Example usage in SSH session
copyToRemoteClipboard('Remote server output');
```

### File Content Operations

```typescript
import { readFileSync } from 'fs';
import { newSequence } from '@tsports/go-osc52';

// Copy file contents
function copyFileToClipboard(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const seq = newSequence(content);
    process.stdout.write(seq.copy());
    console.log(`File ${filePath} copied to clipboard`);
  } catch (error) {
    console.error(`Error reading file: ${error}`);
  }
}

// Usage
copyFileToClipboard('./package.json');
```

### Command Line Integration

```typescript
import { newSequence, querySequence } from '@tsports/go-osc52';

// CLI utility function
function clipboardTool(command: string, text?: string) {
  switch (command) {
    case 'copy':
      if (!text) {
        console.error('Text required for copy operation');
        return;
      }
      process.stdout.write(newSequence(text).copy());
      console.log(`Copied: ${text}`);
      break;
      
    case 'query':
      process.stdout.write(querySequence());
      console.log('Querying clipboard...');
      break;
      
    case 'clear':
      process.stdout.write(clearSequence());
      console.log('Clipboard cleared');
      break;
      
    default:
      console.log('Usage: clipboardTool(copy|query|clear, [text])');
  }
}

// Example usage
clipboardTool('copy', 'Hello from CLI!');
clipboardTool('query');
```

### Terminal Multiplexer Support

```typescript
import { newSequence } from '@tsports/go-osc52';

// Function that works in tmux, screen, etc.
function copyInTerminalMultiplexer(text: string) {
  const seq = newSequence(text);
  
  // OSC52 sequences work through terminal multiplexers
  // The sequence will be properly forwarded to the terminal
  process.stdout.write(seq.copy());
  
  console.log('Text copied through terminal multiplexer');
}

// Works in tmux sessions
copyInTerminalMultiplexer('This works in tmux!');
```

## Error Handling Examples

### Safe Clipboard Operations

```typescript
import { newSequence, clearSequence } from '@tsports/go-osc52';

function safeClipboardCopy(text: string): boolean {
  try {
    if (!text || typeof text !== 'string') {
      console.error('Invalid text provided');
      return false;
    }
    
    const seq = newSequence(text);
    process.stdout.write(seq.copy());
    return true;
  } catch (error) {
    console.error('Clipboard operation failed:', error);
    return false;
  }
}

// Usage with error handling
if (safeClipboardCopy('Important data')) {
  console.log('Successfully copied to clipboard');
} else {
  console.log('Failed to copy to clipboard');
}
```

### Environment Detection

```typescript
import { newSequence } from '@tsports/go-osc52';

function copyWithEnvironmentCheck(text: string) {
  // Check if we're in a terminal that supports OSC52
  const termSupported = process.stdout.isTTY;
  
  if (!termSupported) {
    console.warn('OSC52 may not work in non-TTY environments');
  }
  
  const seq = newSequence(text);
  process.stdout.write(seq.copy());
  
  if (termSupported) {
    console.log('Text copied to clipboard');
  } else {
    console.log('OSC52 sequence sent (may not work in this environment)');
  }
}

// Usage
copyWithEnvironmentCheck('Environment-aware copy');
```