/**
 * Usage examples for @tsports/go-osc52
 * Demonstrates both TypeScript-style and Go-style APIs for OSC52 clipboard operations
 */

// TypeScript-style API (recommended)
import {
  Sequence,
  New,
  Query,
  Clear,
  Clipboard,
  Mode
} from '../src/index.js';

// Go-style API (for exact Go compatibility)
import {
  New as GoNew,
  Query as GoQuery,
  Clear as GoClear,
  SystemClipboard,
  PrimaryClipboard,
  TmuxMode,
  ScreenMode
} from '../src/go-style.js';

console.log('=== TypeScript-style API ===\n');

// Basic clipboard copy operation
console.log('Basic clipboard operations:');
const text = 'Hello, clipboard!';
const copySeq = new Sequence(text);
console.log('Copy sequence:', JSON.stringify(copySeq.toString()));

// Fluent API chaining
console.log('\nFluent API chaining:');
const tmuxSeq = new Sequence('Hello from Tmux!')
  .tmux()
  .primary()
  .withLimit(1000);
console.log('Tmux + Primary + Limit:', JSON.stringify(tmuxSeq.toString()));

// Query clipboard
console.log('\nQuery operations:');
const querySeq = new Sequence().query();
console.log('Query system clipboard:', JSON.stringify(querySeq.toString()));

const queryPrimary = new Sequence().query().primary();
console.log('Query primary clipboard:', JSON.stringify(queryPrimary.toString()));

// Clear clipboard
console.log('\nClear operations:');
const clearSeq = new Sequence().clear();
console.log('Clear system clipboard:', JSON.stringify(clearSeq.toString()));

const clearTmux = new Sequence().clear().tmux();
console.log('Clear with Tmux mode:', JSON.stringify(clearTmux.toString()));

// Screen mode with long text (demonstrates 76-byte chunking)
console.log('\nScreen mode with long text:');
const longText = 'This is a very long text that will be split into chunks when using screen mode because screen has limitations on OSC52 sequences';
const screenSeq = new Sequence(longText).screen();
console.log('Screen mode sequence (chunked):', JSON.stringify(screenSeq.toString()));

// Mock writer example
console.log('\nWriting to mock output:');
class MockWriter {
  private data = '';

  write(data: string | Buffer): boolean {
    this.data += data.toString();
    return true;
  }

  getData(): string {
    return this.data;
  }
}

const writer = new MockWriter();
const writeSeq = new Sequence('Written to output');
writeSeq.writeTo(writer).then(bytesWritten => {
  console.log(`Wrote ${bytesWritten} bytes:`, JSON.stringify(writer.getData()));
});

console.log('\n=== Go-style API ===\n');

// Same functionality with exact Go API
console.log('Go-style basic copy:');
const goSeq = GoNew('Hello from Go-style API');
console.log('Go-style sequence:', JSON.stringify(goSeq.String()));

// Chain operations like in Go
console.log('\nGo-style chaining:');
const goChained = GoNew('Chained operations')
  .Primary()
  .Tmux()
  .Limit(500);
console.log('Go-style chained:', JSON.stringify(goChained.String()));

// Query operations
console.log('\nGo-style query:');
const goQuery = GoQuery().Primary().Mode(TmuxMode);
console.log('Go-style query:', JSON.stringify(goQuery.String()));

// Clear operations
console.log('\nGo-style clear:');
const goClear = GoClear().Mode(ScreenMode);
console.log('Go-style clear:', JSON.stringify(goClear.String()));

// Demonstrating exact Go compatibility
console.log('\nExact Go pattern replication:');
const goPattern = GoNew('multiple', 'strings', 'joined')
  .Clipboard(SystemClipboard)
  .Mode(TmuxMode)
  .Limit(100);
console.log('Go pattern:', JSON.stringify(goPattern.String()));

// WriteTo with Go-style error handling
console.log('\nGo-style WriteTo with error handling:');
const goWriter = new MockWriter();
GoNew('Go-style write').WriteTo(goWriter).then(result => {
  if (result.err) {
    console.log('Error:', result.err.message);
  } else {
    console.log(`Go-style wrote ${result.n} bytes:`, JSON.stringify(goWriter.getData()));
  }
});

console.log('\n=== Practical Usage Examples ===\n');

// Real-world usage scenarios
console.log('Real-world scenarios:');

// 1. SSH session clipboard copy
console.log('\n1. SSH session clipboard copy:');
const sshCopy = new Sequence('Copied from SSH session').tmux();
console.log('SSH sequence:', JSON.stringify(sshCopy.toString()));

// 2. Terminal multiplexer detection
console.log('\n2. Dynamic mode selection:');
const termEnv = 'screen'; // Simulated environment variable
let sequence = new Sequence('Environment-aware copy');
if (termEnv === 'screen') {
  sequence = sequence.screen();
} else if (termEnv.includes('tmux')) {
  sequence = sequence.tmux();
}
console.log('Environment-aware:', JSON.stringify(sequence.toString()));

// 3. Large text handling
console.log('\n3. Large text with limits:');
const largeText = 'A'.repeat(10000);
const limitedSeq = new Sequence(largeText).withLimit(100);
console.log('Large text result:', limitedSeq.toString() === '' ? 'Rejected (too large)' : 'Accepted');

const allowedSeq = new Sequence(largeText).withLimit(15000);
console.log('Within limit result:', allowedSeq.toString().length > 0 ? 'Accepted' : 'Rejected');

// 4. Clipboard selection patterns
console.log('\n4. Clipboard selection patterns:');
const systemClip = new Sequence('System clipboard text');
const primaryClip = new Sequence('Primary clipboard text').primary();

console.log('System clipboard:', JSON.stringify(systemClip.toString()));
console.log('Primary clipboard:', JSON.stringify(primaryClip.toString()));

console.log('\nExamples completed! 🎉');
