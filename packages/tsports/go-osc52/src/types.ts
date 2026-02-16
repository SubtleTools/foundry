// @tsports/go-osc52 - TypeScript type definitions

/**
 * Clipboard type represents the clipboard buffer to use.
 * Corresponds to the Pc parameter in OSC52 sequence.
 */
export enum Clipboard {
  /** System clipboard buffer (c) */
  SystemClipboard = 'c',
  /** Primary clipboard buffer (p) - X11 primary clipboard */
  PrimaryClipboard = 'p',
}

/**
 * Mode represents the mode to use for the OSC52 sequence.
 * Different terminal multiplexers require different escaping.
 */
export enum Mode {
  /** Default OSC52 sequence mode - no additional escaping */
  DefaultMode = 0,
  /** Screen mode - escapes OSC52 sequence for screen using DCS sequences */
  ScreenMode = 1,
  /** Tmux mode - escapes OSC52 sequence for tmux */
  TmuxMode = 2,
}

/**
 * Operation represents the OSC52 operation type.
 */
export enum Operation {
  /** Set operation - copy data to clipboard */
  SetOperation = 0,
  /** Query operation - query clipboard contents */
  QueryOperation = 1,
  /** Clear operation - clear clipboard contents */
  ClearOperation = 2,
}

/**
 * Writer interface compatible with Node.js streams and custom writers.
 * Supports both Node.js Writable streams and custom write methods.
 */
export interface Writer {
  write(data: string | Buffer): boolean | undefined;
}

/**
 * WriterTo interface represents objects that can write themselves to a Writer.
 * This is the TypeScript equivalent of Go's io.WriterTo interface.
 */
export interface WriterTo {
  /**
   * WriteTo writes the object to the provided writer.
   * @param writer The writer to write to
   * @returns Promise resolving to the number of bytes written
   */
  writeTo(writer: Writer): Promise<number>;
}

/**
 * Stringer interface represents objects that can represent themselves as strings.
 * This is the TypeScript equivalent of Go's fmt.Stringer interface.
 */
export interface Stringer {
  /**
   * toString returns the string representation of the object.
   */
  toString(): string;
}
