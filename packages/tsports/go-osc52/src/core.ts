// @tsports/go-osc52 - Core OSC52 implementation

import { Clipboard, Mode, Operation, type Stringer, type Writer, type WriterTo } from './types.js';

/**
 * Sequence represents an OSC52 escape sequence for clipboard operations.
 * This class implements both Stringer and WriterTo interfaces for compatibility with Go patterns.
 */
export class Sequence implements Stringer, WriterTo {
  private str: string;
  private limit: number;
  private op: Operation;
  private mode: Mode;
  private clipboard: Clipboard;

  /**
   * Creates a new Sequence instance with the given parameters.
   * @param str - The string to copy to clipboard
   * @param limit - Maximum string length (0 = no limit)
   * @param op - The operation type
   * @param mode - The terminal mode
   * @param clipboard - The clipboard buffer
   */
  constructor(
    str: string = '',
    limit: number = 0,
    op: Operation = Operation.SetOperation,
    mode: Mode = Mode.DefaultMode,
    clipboard: Clipboard = Clipboard.SystemClipboard
  ) {
    this.str = str;
    this.limit = limit;
    this.op = op;
    this.mode = mode;
    this.clipboard = clipboard;
  }

  /**
   * toString returns the OSC52 sequence as a string.
   * This implements the Stringer interface.
   */
  toString(): string {
    let seq = '';

    // Mode escape sequences start
    seq += this.seqStart();

    // Actual OSC52 sequence start
    seq += `\x1b]52;${this.clipboard};`;

    switch (this.op) {
      case Operation.SetOperation: {
        const str = this.str;
        if (this.limit > 0 && str.length > this.limit) {
          return '';
        }
        const b64 = Buffer.from(str, 'utf-8').toString('base64');

        if (this.mode === Mode.ScreenMode) {
          // Screen doesn't support OSC52 but will pass the contents of a DCS
          // sequence to the outer terminal unchanged.
          //
          // Here, we split the encoded string into 76 bytes chunks and then
          // join the chunks with <end-dcs><start-dcs> sequences.
          const chunks: string[] = [];
          for (let i = 0; i < b64.length; i += 76) {
            const end = Math.min(i + 76, b64.length);
            chunks.push(b64.slice(i, end));
          }
          seq += chunks.join('\x1b\\\x1bP');
        } else {
          seq += b64;
        }
        break;
      }

      case Operation.QueryOperation:
        // OSC52 queries the clipboard using "?"
        seq += '?';
        break;

      case Operation.ClearOperation:
        // OSC52 clears the clipboard if the data is neither a base64 string nor "?"
        // we're using "!" as a default
        seq += '!';
        break;
    }

    // Actual OSC52 sequence end
    seq += '\x07';

    // Mode escape end
    seq += this.seqEnd();

    return seq;
  }

  /**
   * writeTo writes the OSC52 sequence to the provided writer.
   * This implements the WriterTo interface.
   * @param writer - The writer to write to
   * @returns Promise resolving to the number of bytes written
   */
  async writeTo(writer: Writer): Promise<number> {
    const data = this.toString();
    const buffer = Buffer.from(data, 'utf-8');

    // Handle different writer types
    if (typeof writer.write === 'function') {
      writer.write(buffer);
      return buffer.length;
    }

    throw new Error('Invalid writer: must have write method');
  }

  /**
   * mode sets the mode for the OSC52 sequence.
   * @param m - The mode to set
   * @returns A new Sequence instance with the updated mode
   */
  withMode(m: Mode): Sequence {
    return new Sequence(this.str, this.limit, this.op, m, this.clipboard);
  }

  /**
   * tmux sets the mode to TmuxMode.
   * Used to escape the OSC52 sequence for `tmux`.
   *
   * Note: this is not needed if tmux clipboard is set to `set-clipboard on`. If
   * TmuxMode is used, tmux must have `allow-passthrough on` set.
   *
   * This is syntactic sugar for withMode(Mode.TmuxMode).
   * @returns A new Sequence instance with TmuxMode
   */
  tmux(): Sequence {
    return this.withMode(Mode.TmuxMode);
  }

  /**
   * screen sets the mode to ScreenMode.
   * Used to escape the OSC52 sequence for `screen`.
   *
   * This is syntactic sugar for withMode(Mode.ScreenMode).
   * @returns A new Sequence instance with ScreenMode
   */
  screen(): Sequence {
    return this.withMode(Mode.ScreenMode);
  }

  /**
   * withClipboard sets the clipboard buffer for the OSC52 sequence.
   * @param c - The clipboard buffer to use
   * @returns A new Sequence instance with the updated clipboard
   */
  withClipboard(c: Clipboard): Sequence {
    return new Sequence(this.str, this.limit, this.op, this.mode, c);
  }

  /**
   * primary sets the clipboard buffer to PrimaryClipboard.
   * This is the X11 primary clipboard.
   *
   * This is syntactic sugar for withClipboard(Clipboard.PrimaryClipboard).
   * @returns A new Sequence instance with primary clipboard
   */
  primary(): Sequence {
    return this.withClipboard(Clipboard.PrimaryClipboard);
  }

  /**
   * withLimit sets the limit for the OSC52 sequence.
   * The default limit is 0 (no limit).
   *
   * Strings longer than the limit get ignored. Setting the limit to 0 or a
   * negative value disables the limit. Each terminal defines its own escape
   * sequence limit.
   * @param l - The limit to set
   * @returns A new Sequence instance with the updated limit
   */
  withLimit(l: number): Sequence {
    const limit = l < 0 ? 0 : l;
    return new Sequence(this.str, limit, this.op, this.mode, this.clipboard);
  }

  /**
   * withOperation sets the operation for the OSC52 sequence.
   * The default operation is SetOperation.
   * @param o - The operation to set
   * @returns A new Sequence instance with the updated operation
   */
  withOperation(o: Operation): Sequence {
    return new Sequence(this.str, this.limit, o, this.mode, this.clipboard);
  }

  /**
   * clear sets the operation to ClearOperation.
   * This clears the clipboard.
   *
   * This is syntactic sugar for withOperation(Operation.ClearOperation).
   * @returns A new Sequence instance with clear operation
   */
  clear(): Sequence {
    return this.withOperation(Operation.ClearOperation);
  }

  /**
   * query sets the operation to QueryOperation.
   * This queries the clipboard contents.
   *
   * This is syntactic sugar for withOperation(Operation.QueryOperation).
   * @returns A new Sequence instance with query operation
   */
  query(): Sequence {
    return this.withOperation(Operation.QueryOperation);
  }

  /**
   * withString sets the string for the OSC52 sequence.
   * @param strs - The strings to join with space character
   * @returns A new Sequence instance with the updated string
   */
  withString(...strs: string[]): Sequence {
    const str = strs.join(' ');
    return new Sequence(str, this.limit, this.op, this.mode, this.clipboard);
  }

  /**
   * Private method to get the sequence start based on mode
   */
  private seqStart(): string {
    switch (this.mode) {
      case Mode.TmuxMode:
        // Write the start of a tmux DCS escape sequence.
        return '\x1bPtmux;\x1b';
      case Mode.ScreenMode:
        // Write the start of a DCS sequence.
        return '\x1bP';
      default:
        return '';
    }
  }

  /**
   * Private method to get the sequence end based on mode
   */
  private seqEnd(): string {
    switch (this.mode) {
      case Mode.TmuxMode:
      case Mode.ScreenMode:
        // Terminate the DCS escape sequence.
        return '\x1b\\';
      default:
        return '';
    }
  }
}

/**
 * newSequence creates a new OSC52 sequence with the given string(s).
 * Strings are joined with a space character.
 * @param strs - The strings to include in the sequence
 * @returns A new Sequence instance
 */
export function newSequence(...strs: string[]): Sequence {
  const str = strs.join(' ');
  return new Sequence(str, 0, Operation.SetOperation, Mode.DefaultMode, Clipboard.SystemClipboard);
}

/**
 * querySequence creates a new OSC52 sequence with the QueryOperation.
 * This returns a new OSC52 sequence to query the clipboard contents.
 *
 * This is syntactic sugar for newSequence().query().
 * @returns A new Sequence instance with query operation
 */
export function querySequence(): Sequence {
  return newSequence().query();
}

/**
 * clearSequence creates a new OSC52 sequence with the ClearOperation.
 * This returns a new OSC52 sequence to clear the clipboard.
 *
 * This is syntactic sugar for newSequence().clear().
 * @returns A new Sequence instance with clear operation
 */
export function clearSequence(): Sequence {
  return newSequence().clear();
}
