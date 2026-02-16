[**@tsports/go-osc52 v2.0.14-tsport**](../README.md)

***

[@tsports/go-osc52](../globals.md) / Mode

# Enumeration: Mode

Defined in: [types.ts:18](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/types.ts#L18)

Mode represents the mode to use for the OSC52 sequence.
Different terminal multiplexers require different escaping.

## Enumeration Members

### DefaultMode

> **DefaultMode**: `0`

Defined in: [types.ts:20](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/types.ts#L20)

Default OSC52 sequence mode - no additional escaping

***

### ScreenMode

> **ScreenMode**: `1`

Defined in: [types.ts:22](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/types.ts#L22)

Screen mode - escapes OSC52 sequence for screen using DCS sequences

***

### TmuxMode

> **TmuxMode**: `2`

Defined in: [types.ts:24](https://github.com/SubtleTools/go-osc52-tsport/blob/242e56775bc9901b1a189054a569847ca34a826c/src/types.ts#L24)

Tmux mode - escapes OSC52 sequence for tmux
