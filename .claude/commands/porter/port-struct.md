# Port Go Struct to TypeScript

Convert a specific Go struct and its methods to TypeScript, following the established porting patterns.

**Arguments:** `$ARGUMENTS`
- `GO_CODE` - The Go struct code to port (inline code or file path)

## Workflow

### Step 1: Analyze Go Struct

Parse the Go struct to identify:
- Field names, types, and visibility (exported = uppercase first letter)
- Embedded structs (anonymous fields for composition/inheritance)
- Struct tags (JSON, XML, YAML, custom)
- Associated receiver methods (both pointer and value receivers)
- Interface implementations (implicit in Go)
- Constructor patterns (`NewXxx` functions)

### Step 2: Apply Type Mappings

**Primitive Types:**
| Go Type | TypeScript Equivalent | Notes |
|---------|----------------------|-------|
| `int`, `int8`, `int16`, `int32` | `number` | Safe for values < 2^53 |
| `int64` | `number` or `bigint` | Use `bigint` for bitwise ops |
| `uint`, `uint8`, `uint16`, `uint32` | `number` | `uint8` → `Uint8Array` for buffers |
| `uint64` | `number` or `bigint` | Use `bigint` for bitwise ops |
| `float32`, `float64` | `number` | JS only has float64 |
| `complex64`, `complex128` | `{ re: number, im: number }` | Custom Complex class |
| `string` | `string` | Go=UTF-8 bytes, JS=UTF-16 |
| `bool` | `boolean` | Direct mapping |
| `byte` | `number` | Alias for uint8 |
| `rune` | `number` | Alias for int32 (Unicode codepoint) |

**Composite Types:**
| Go Type | TypeScript Equivalent | Notes |
|---------|----------------------|-------|
| `[]T` (slice) | `T[]` | Reference type |
| `[N]T` (array) | `readonly [T, ...]` or `T[]` | Fixed-size |
| `map[K]V` | `Map<K, V>` | Non-string keys |
| `map[string]V` | `Record<string, V>` | String keys |
| `*T` (pointer) | `T \| null` | Nullable reference |
| `chan T` | `Channel<T>` | Custom implementation |
| `func(A) B` | `(a: A) => B` | Function type |
| `interface{}` / `any` | `unknown` | Prefer generics |
| `error` | `Error \| null` | Or Result type |

**CRITICAL - 64-bit Integer Handling:**
```typescript
// JavaScript number limitations:
// - Safe integers: -(2^53 - 1) to (2^53 - 1)
// - Bitwise ops cast to 32-bit signed int

// WRONG: overflow
const bad = 1 << 31;  // -2147483648

// CORRECT: BigInt for 64-bit
const good = 1n << 31n;  // 2147483648n
```

### Step 3: Structural Conversion Patterns

**A. Simple Struct → Class:**
```go
type Color struct {
    R, G, B float64
}
```
```typescript
export class Color {
    constructor(
        public r: number,
        public g: number,
        public b: number
    ) {}
}
```

**B. Struct with Unexported Fields → Private Properties:**
```go
type Counter struct {
    count int      // unexported (lowercase)
    Name  string   // exported (uppercase)
}
```
```typescript
export class Counter {
    #count: number;  // private (use # for true privacy)
    name: string;    // public

    constructor(name: string, count: number = 0) {
        this.name = name;
        this.#count = count;
    }
}
```

**C. Embedded Struct → Inheritance or Composition:**
```go
type Point struct {
    X, Y float64
}

type ColoredPoint struct {
    Point       // embedded (anonymous)
    Color Color // named field
}

// Usage: cp.X, cp.Y accessible directly
```
```typescript
// Option A: Inheritance (if Point is primary identity)
export class ColoredPoint extends Point {
    constructor(x: number, y: number, public color: Color) {
        super(x, y);
    }
}

// Option B: Composition with delegation (preferred)
export class ColoredPoint {
    constructor(
        public point: Point,
        public color: Color
    ) {}

    // Delegate Point methods/properties if needed
    get x() { return this.point.x; }
    get y() { return this.point.y; }
}
```

**D. Multiple Embedded Structs:**
```go
type Employee struct {
    Person      // embedded
    JobInfo     // embedded
    department string
}
```
```typescript
// Use composition - TypeScript doesn't support multiple inheritance
export class Employee {
    constructor(
        public person: Person,
        public jobInfo: JobInfo,
        private department: string
    ) {}

    // Forward commonly accessed properties
    get name() { return this.person.name; }
    get title() { return this.jobInfo.title; }
}
```

**E. Receiver Methods → Class Methods:**
```go
// Value receiver (doesn't modify struct)
func (c Color) Hex() string {
    return fmt.Sprintf("#%02x%02x%02x",
        int(c.R*255), int(c.G*255), int(c.B*255))
}

// Pointer receiver (can modify struct)
func (c *Color) Brighten(factor float64) {
    c.R = min(1.0, c.R*factor)
    c.G = min(1.0, c.G*factor)
    c.B = min(1.0, c.B*factor)
}
```
```typescript
export class Color {
    constructor(public r: number, public g: number, public b: number) {}

    // Value receiver → regular method
    hex(): string {
        const toHex = (n: number) =>
            Math.round(n * 255).toString(16).padStart(2, '0');
        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
    }

    // Pointer receiver → method that mutates this
    brighten(factor: number): void {
        this.r = Math.min(1.0, this.r * factor);
        this.g = Math.min(1.0, this.g * factor);
        this.b = Math.min(1.0, this.b * factor);
    }
}
```

**F. Constructor Functions (`NewXxx`):**
```go
func NewColor(hex string) (*Color, error) {
    // parse hex, return error if invalid
    return &Color{R: r, G: g, B: b}, nil
}

func MustNewColor(hex string) *Color {
    c, err := NewColor(hex)
    if err != nil {
        panic(err)
    }
    return c
}
```
```typescript
export class Color {
    // Private constructor for factory pattern
    private constructor(public r: number, public g: number, public b: number) {}

    // Factory method with error handling
    static fromHex(hex: string): Color | null {
        const parsed = parseHex(hex);
        if (!parsed) return null;
        return new Color(parsed.r, parsed.g, parsed.b);
    }

    // Throwing factory (like MustNewXxx)
    static mustFromHex(hex: string): Color {
        const color = Color.fromHex(hex);
        if (!color) throw new Error(`Invalid hex color: ${hex}`);
        return color;
    }
}
```

**G. Struct Tags → Decorators or Separate Schema:**
```go
type User struct {
    ID        int    `json:"id" db:"user_id"`
    Email     string `json:"email" validate:"email"`
    CreatedAt time.Time `json:"created_at,omitempty"`
}
```
```typescript
// Option 1: Plain class with separate schema
export class User {
    constructor(
        public id: number,
        public email: string,
        public createdAt: Date
    ) {}
}

// JSON serialization schema
export const UserSchema = {
    id: 'id',
    email: 'email',
    createdAt: { key: 'created_at', omitEmpty: true }
};

// Option 2: Using decorators (requires experimentalDecorators)
export class User {
    @JsonProperty('id')
    id: number;

    @JsonProperty('email')
    @Validate('email')
    email: string;

    @JsonProperty('created_at', { omitEmpty: true })
    createdAt: Date;
}
```

### Step 4: Handle Go Interfaces

**A. Implicit Interface Satisfaction:**
```go
type Stringer interface {
    String() string
}

// Color implicitly implements Stringer (no declaration needed)
func (c Color) String() string {
    return c.Hex()
}
```
```typescript
interface Stringer {
    toString(): string;
}

// TypeScript requires explicit implements
export class Color implements Stringer {
    // ... fields and constructor ...

    toString(): string {
        return this.hex();
    }
}
```

**B. Interface Embedding:**
```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter interface {
    Reader
    Writer
}
```
```typescript
interface Reader {
    read(p: Uint8Array): [number, Error | null];
}

interface Writer {
    write(p: Uint8Array): [number, Error | null];
}

interface ReadWriter extends Reader, Writer {}
```

**C. Empty Interface (`interface{}`):**
```go
func Process(v interface{}) {
    switch t := v.(type) {
    case int: // ...
    case string: // ...
    }
}
```
```typescript
// Use unknown + type guards
function process(v: unknown): void {
    if (typeof v === 'number') {
        // handle number
    } else if (typeof v === 'string') {
        // handle string
    }
}

// Or use discriminated unions for known types
type Processable =
    | { kind: 'int'; value: number }
    | { kind: 'string'; value: string };
```

### Step 5: Special Patterns

**A. Functional Options Pattern:**
```go
type Option func(*Server)

func WithPort(port int) Option {
    return func(s *Server) { s.port = port }
}

func NewServer(opts ...Option) *Server {
    s := &Server{port: 8080}
    for _, opt := range opts {
        opt(s)
    }
    return s
}
```
```typescript
type ServerOptions = {
    port?: number;
    host?: string;
};

export class Server {
    private port: number;
    private host: string;

    constructor(options: ServerOptions = {}) {
        this.port = options.port ?? 8080;
        this.host = options.host ?? 'localhost';
    }
}

// Or builder pattern
export class ServerBuilder {
    private port = 8080;

    withPort(port: number): this {
        this.port = port;
        return this;
    }

    build(): Server {
        return new Server({ port: this.port });
    }
}
```

**B. Sync primitives (`sync.Mutex`, `sync.RWMutex`):**
```go
type SafeCounter struct {
    mu    sync.Mutex
    count int
}

func (c *SafeCounter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}
```
```typescript
// JavaScript is single-threaded - usually not needed
// For SharedArrayBuffer scenarios, use Atomics

export class SafeCounter {
    #count = 0;

    inc(): void {
        this.#count++;  // Atomic in single-threaded JS
    }

    // If using SharedArrayBuffer:
    // Atomics.add(this.buffer, 0, 1);
}
```

**C. Zero Values:**
```go
var c Color  // Zero value: {R: 0, G: 0, B: 0}
```
```typescript
// TypeScript doesn't have zero values - be explicit
const c = new Color(0, 0, 0);

// Or add a static factory
export class Color {
    static zero(): Color {
        return new Color(0, 0, 0);
    }
}
```

### Step 6: Output

Provide:
1. Complete TypeScript class/interface code
2. Usage examples showing common operations
3. Migration notes for Go users
4. Any caveats or behavioral differences
5. Notes on which patterns were chosen and why

## Usage Examples
```bash
/porter:port-struct "type Color struct { R, G, B float64 }"
/porter:port-struct packages/tsports/go-colorful/test/reference/color.go
```
