[**@tsports/go-osc52 v2.0.14-tsport**](../README.md)

***

[@tsports/go-osc52](../globals.md) / WriterTo

# Interface: WriterTo

Defined in: [types.ts:51](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/types.ts#L51)

WriterTo interface represents objects that can write themselves to a Writer.
This is the TypeScript equivalent of Go's io.WriterTo interface.

## Methods

### writeTo()

> **writeTo**(`writer`): `Promise`\<`number`\>

Defined in: [types.ts:57](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/types.ts#L57)

WriteTo writes the object to the provided writer.

#### Parameters

##### writer

[`Writer`](Writer.md)

The writer to write to

#### Returns

`Promise`\<`number`\>

Promise resolving to the number of bytes written
