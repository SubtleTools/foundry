[**@tsports/go-osc52 v2.0.14-tsport**](../README.md)

***

[@tsports/go-osc52](../globals.md) / Clear

# Variable: Clear()

> `const` **Clear**: () => [`Sequence`](../classes/Sequence.md) = `clearSequence`

Defined in: [index.ts:28](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/index.ts#L28)

clearSequence creates a new OSC52 sequence with the ClearOperation.
This returns a new OSC52 sequence to clear the clipboard.

This is syntactic sugar for newSequence().clear().

## Returns

[`Sequence`](../classes/Sequence.md)

A new Sequence instance with clear operation
