[**@tsports/go-osc52 v2.0.14-tsport**](../README.md)

***

[@tsports/go-osc52](../globals.md) / Sequence

# Class: Sequence

Defined in: [core.ts:9](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L9)

Sequence represents an OSC52 escape sequence for clipboard operations.
This class implements both Stringer and WriterTo interfaces for compatibility with Go patterns.

## Implements

- [`Stringer`](../interfaces/Stringer.md)
- [`WriterTo`](../interfaces/WriterTo.md)

## Constructors

### Constructor

> **new Sequence**(`str`, `limit`, `op`, `mode`, `clipboard`): `Sequence`

Defined in: [core.ts:24](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L24)

Creates a new Sequence instance with the given parameters.

#### Parameters

##### str

`string` = `''`

The string to copy to clipboard

##### limit

`number` = `0`

Maximum string length (0 = no limit)

##### op

[`Operation`](../enumerations/Operation.md) = `Operation.SetOperation`

The operation type

##### mode

[`Mode`](../enumerations/Mode.md) = `Mode.DefaultMode`

The terminal mode

##### clipboard

[`Clipboard`](../enumerations/Clipboard.md) = `Clipboard.SystemClipboard`

The clipboard buffer

#### Returns

`Sequence`

## Methods

### toString()

> **toString**(): `string`

Defined in: [core.ts:42](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L42)

toString returns the OSC52 sequence as a string.
This implements the Stringer interface.

#### Returns

`string`

#### Implementation of

[`Stringer`](../interfaces/Stringer.md).[`toString`](../interfaces/Stringer.md#tostring)

***

### writeTo()

> **writeTo**(`writer`): `Promise`\<`number`\>

Defined in: [core.ts:104](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L104)

writeTo writes the OSC52 sequence to the provided writer.
This implements the WriterTo interface.

#### Parameters

##### writer

[`Writer`](../interfaces/Writer.md)

The writer to write to

#### Returns

`Promise`\<`number`\>

Promise resolving to the number of bytes written

#### Implementation of

[`WriterTo`](../interfaces/WriterTo.md).[`writeTo`](../interfaces/WriterTo.md#writeto)

***

### withMode()

> **withMode**(`m`): `Sequence`

Defined in: [core.ts:122](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L122)

mode sets the mode for the OSC52 sequence.

#### Parameters

##### m

[`Mode`](../enumerations/Mode.md)

The mode to set

#### Returns

`Sequence`

A new Sequence instance with the updated mode

***

### tmux()

> **tmux**(): `Sequence`

Defined in: [core.ts:136](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L136)

tmux sets the mode to TmuxMode.
Used to escape the OSC52 sequence for `tmux`.

Note: this is not needed if tmux clipboard is set to `set-clipboard on`. If
TmuxMode is used, tmux must have `allow-passthrough on` set.

This is syntactic sugar for withMode(Mode.TmuxMode).

#### Returns

`Sequence`

A new Sequence instance with TmuxMode

***

### screen()

> **screen**(): `Sequence`

Defined in: [core.ts:147](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L147)

screen sets the mode to ScreenMode.
Used to escape the OSC52 sequence for `screen`.

This is syntactic sugar for withMode(Mode.ScreenMode).

#### Returns

`Sequence`

A new Sequence instance with ScreenMode

***

### withClipboard()

> **withClipboard**(`c`): `Sequence`

Defined in: [core.ts:156](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L156)

withClipboard sets the clipboard buffer for the OSC52 sequence.

#### Parameters

##### c

[`Clipboard`](../enumerations/Clipboard.md)

The clipboard buffer to use

#### Returns

`Sequence`

A new Sequence instance with the updated clipboard

***

### primary()

> **primary**(): `Sequence`

Defined in: [core.ts:167](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L167)

primary sets the clipboard buffer to PrimaryClipboard.
This is the X11 primary clipboard.

This is syntactic sugar for withClipboard(Clipboard.PrimaryClipboard).

#### Returns

`Sequence`

A new Sequence instance with primary clipboard

***

### withLimit()

> **withLimit**(`l`): `Sequence`

Defined in: [core.ts:181](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L181)

withLimit sets the limit for the OSC52 sequence.
The default limit is 0 (no limit).

Strings longer than the limit get ignored. Setting the limit to 0 or a
negative value disables the limit. Each terminal defines its own escape
sequence limit.

#### Parameters

##### l

`number`

The limit to set

#### Returns

`Sequence`

A new Sequence instance with the updated limit

***

### withOperation()

> **withOperation**(`o`): `Sequence`

Defined in: [core.ts:192](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L192)

withOperation sets the operation for the OSC52 sequence.
The default operation is SetOperation.

#### Parameters

##### o

[`Operation`](../enumerations/Operation.md)

The operation to set

#### Returns

`Sequence`

A new Sequence instance with the updated operation

***

### clear()

> **clear**(): `Sequence`

Defined in: [core.ts:203](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L203)

clear sets the operation to ClearOperation.
This clears the clipboard.

This is syntactic sugar for withOperation(Operation.ClearOperation).

#### Returns

`Sequence`

A new Sequence instance with clear operation

***

### query()

> **query**(): `Sequence`

Defined in: [core.ts:214](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L214)

query sets the operation to QueryOperation.
This queries the clipboard contents.

This is syntactic sugar for withOperation(Operation.QueryOperation).

#### Returns

`Sequence`

A new Sequence instance with query operation

***

### withString()

> **withString**(...`strs`): `Sequence`

Defined in: [core.ts:223](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/core.ts#L223)

withString sets the string for the OSC52 sequence.

#### Parameters

##### strs

...`string`[]

The strings to join with space character

#### Returns

`Sequence`

A new Sequence instance with the updated string
