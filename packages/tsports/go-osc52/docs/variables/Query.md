[**@tsports/go-osc52 v2.0.14-tsport**](../README.md)

***

[@tsports/go-osc52](../globals.md) / Query

# Variable: Query()

> `const` **Query**: () => [`Sequence`](../classes/Sequence.md) = `querySequence`

Defined in: [index.ts:27](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/index.ts#L27)

querySequence creates a new OSC52 sequence with the QueryOperation.
This returns a new OSC52 sequence to query the clipboard contents.

This is syntactic sugar for newSequence().query().

## Returns

[`Sequence`](../classes/Sequence.md)

A new Sequence instance with query operation
