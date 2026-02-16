// @tsports/go-osc52 - Go-compatible API
// This file provides the Go-compatible API matching the original Go package exactly

import {
  type Sequence as CoreSequence,
  clearSequence,
  newSequence,
  querySequence,
} from './core.js';
import { Clipboard, Mode, Operation, type Writer } from './types.js';

/**
 * Go-compatible Sequence class that matches the original Go API exactly.
 * All method names match the Go implementation.
 */
export class Sequence {
  private readonly _seq: CoreSequence;

  constructor(seq: CoreSequence) {
    this._seq = seq;
  }

  /**
   * String returns the OSC52 sequence as a string.
   * This matches the Go String() method exactly.
   */
  String(): string {
    return this._seq.toString();
  }

  /**
   * WriteTo writes the OSC52 sequence to the writer.
   * This matches the Go WriteTo(io.Writer) method.
   * @param writer The writer to write to
   * @returns Promise resolving to the number of bytes written and any error
   */
  async WriteTo(writer: Writer): Promise<{ n: number; err?: Error }> {
    try {
      const n = await this._seq.writeTo(writer);
      return { n };
    } catch (err) {
      return { n: 0, err: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  /**
   * Mode sets the mode for the OSC52 sequence.
   * @param m The mode to set
   * @returns A new Sequence instance with the updated mode
   */
  Mode(m: Mode): Sequence {
    return new Sequence(this._seq.withMode(m));
  }

  /**
   * Tmux sets the mode to TmuxMode.
   * This is syntactic sugar for Mode(TmuxMode).
   */
  Tmux(): Sequence {
    return new Sequence(this._seq.tmux());
  }

  /**
   * Screen sets the mode to ScreenMode.
   * This is syntactic sugar for Mode(ScreenMode).
   */
  Screen(): Sequence {
    return new Sequence(this._seq.screen());
  }

  /**
   * Clipboard sets the clipboard buffer for the OSC52 sequence.
   * @param c The clipboard buffer to use
   */
  Clipboard(c: Clipboard): Sequence {
    return new Sequence(this._seq.withClipboard(c));
  }

  /**
   * Primary sets the clipboard buffer to PrimaryClipboard.
   * This is syntactic sugar for Clipboard(PrimaryClipboard).
   */
  Primary(): Sequence {
    return new Sequence(this._seq.primary());
  }

  /**
   * Limit sets the limit for the OSC52 sequence.
   * @param l The limit to set
   */
  Limit(l: number): Sequence {
    return new Sequence(this._seq.withLimit(l));
  }

  /**
   * Operation sets the operation for the OSC52 sequence.
   * @param o The operation to set
   */
  Operation(o: Operation): Sequence {
    return new Sequence(this._seq.withOperation(o));
  }

  /**
   * Clear sets the operation to ClearOperation.
   * This is syntactic sugar for Operation(ClearOperation).
   */
  Clear(): Sequence {
    return new Sequence(this._seq.clear());
  }

  /**
   * Query sets the operation to QueryOperation.
   * This is syntactic sugar for Operation(QueryOperation).
   */
  Query(): Sequence {
    return new Sequence(this._seq.query());
  }

  /**
   * SetString sets the string for the OSC52 sequence.
   * @param strs The strings to join with space character
   */
  SetString(...strs: string[]): Sequence {
    return new Sequence(this._seq.withString(...strs));
  }
}

/**
 * New creates a new OSC52 sequence with the given string(s).
 * Strings are joined with a space character.
 * This matches the Go New(...string) function exactly.
 * @param strs The strings to include in the sequence
 */
export function New(...strs: string[]): Sequence {
  return new Sequence(newSequence(...strs));
}

/**
 * Query creates a new OSC52 sequence with the QueryOperation.
 * This matches the Go Query() function exactly.
 */
export function Query(): Sequence {
  return new Sequence(querySequence());
}

/**
 * Clear creates a new OSC52 sequence with the ClearOperation.
 * This matches the Go Clear() function exactly.
 */
export function Clear(): Sequence {
  return new Sequence(clearSequence());
}

// Export constants that match the Go package exactly
export {
  Clipboard,
  Mode,
  Operation,
} from './types.js';

// Export individual clipboard constants for direct access
export const SystemClipboard = Clipboard.SystemClipboard;
export const PrimaryClipboard = Clipboard.PrimaryClipboard;

// Export individual mode constants for direct access
export const DefaultMode = Mode.DefaultMode;
export const ScreenMode = Mode.ScreenMode;
export const TmuxMode = Mode.TmuxMode;

// Export individual operation constants for direct access
export const SetOperation = Operation.SetOperation;
export const QueryOperation = Operation.QueryOperation;
export const ClearOperation = Operation.ClearOperation;
