#!/usr/bin/env bun

/**
 * Toggle Tree Example
 *
 * Demonstrates tree with custom directory/file types and toggle functionality
 * Port of: test/archive/go-reference/examples/tree/toggle/main.go
 */

import { NewStyle, newTree, rootTree, RoundedEnumerator, SetColorProfile, ColorProfile } from '../../../src/index';

interface Styles {
  base: any;
  block: any;
  enumerator: any;
  dir: any;
  toggle: any;
  file: any;
}

function defaultStyles(): Styles {
  const base = NewStyle().backgroundColor('57').color('225');

  const block = base.padding(1, 3).margin(1, 3).width(40);

  const enumerator = base.color('212').paddingRight(1);

  const dir = base.inline(true);

  const toggle = base.color('207').paddingRight(1);

  const file = base;

  return {
    base,
    block,
    enumerator,
    dir,
    toggle,
    file,
  };
}

class Dir {
  constructor(
    public name: string,
    public open: boolean,
    public styles: Styles
  ) {}

  toString(): string {
    const t = (text: string) => this.styles.toggle.render(text);
    const n = (text: string) => this.styles.dir.render(text);

    if (this.open) {
      return t('▼') + n(this.name);
    }
    return t('▶') + n(this.name);
  }
}

class File {
  constructor(
    public name: string,
    public styles: Styles
  ) {}

  toString(): string {
    return this.styles.file.render(this.name);
  }
}

function main() {
  // Set color profile based on environment variables (like Go reference does)
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    SetColorProfile(ColorProfile.Ascii);
  } else if (process.env.FORCE_COLOR === '3') {
    SetColorProfile(ColorProfile.TrueColor);
  } else if (process.env.FORCE_COLOR === '2') {
    SetColorProfile(ColorProfile.ANSI256);
  } else if (process.env.FORCE_COLOR === '1') {
    SetColorProfile(ColorProfile.ANSI);
  }
    const s = defaultStyles();

  const t = rootTree(new Dir('~/charm', true, s))
    .enumerator(RoundedEnumerator)
    .enumeratorStyle(s.enumerator)
    .child(
      new Dir('ayman', false, s),
      rootTree(new Dir('bash', true, s)).child(
        rootTree(new Dir('tools', true, s)).child(new File('zsh', s), new File('doom-emacs', s))
      ),
      rootTree(new Dir('carlos', true, s)).child(
        rootTree(new Dir('emotes', true, s)).child(
          new File('chefkiss.png', s),
          new File('kekw.png', s)
        )
      ),
      new Dir('maas', false, s)
    );

  console.log(s.block.render(t.toString()));
}

// Run the example
main();
