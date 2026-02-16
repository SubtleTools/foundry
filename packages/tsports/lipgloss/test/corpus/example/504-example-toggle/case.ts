import {
  BorderStyles,
  Colors,
  HorizontalAlignment,
  NewStyle,
  newList,
  newTable,
  VerticalAlignment,
} from '../../../../src/index.js';
import { RoundedEnumerator, rootTree } from '../../../../src/tree/index.js';

// Set color profile for consistent output

interface StylesInterface {
  base: any;
  block: any;
  enumerator: any;
  dir: any;
  toggle: any;
  file: any;
}

function defaultStyles(): StylesInterface {
  const s: StylesInterface = {} as StylesInterface;
  s.base = NewStyle().backgroundColor(Colors[57] || '#5F00FF').color(Colors[225] || '#FFD7FF');
  s.block = s.base.padding(1, 3).margin(1, 3).width(40);
  s.enumerator = s.base.color(Colors[212] || '#FF87D7').paddingRight(1);
  s.dir = s.base.inline(true);
  s.toggle = s.base.color(Colors[207] || '#FF5FAF').paddingRight(1);
  s.file = s.base;
  return s;
}

interface DirInterface {
  name: string;
  open: boolean;
  styles: StylesInterface;
}

class Dir implements DirInterface {
  name: string;
  open: boolean;
  styles: StylesInterface;

  constructor(name: string, open: boolean, styles: StylesInterface) {
    this.name = name;
    this.open = open;
    this.styles = styles;
  }

  toString(): string {
    const t = this.styles.toggle.render;
    const n = this.styles.dir.render;
    if (this.open) {
      return t('▼') + n(this.name);
    }
    return t('▶') + n(this.name);
  }
}

interface FileInterface {
  name: string;
  styles: StylesInterface;
}

class File implements FileInterface {
  name: string;
  styles: StylesInterface;

  constructor(name: string, styles: StylesInterface) {
    this.name = name;
    this.styles = styles;
  }

  toString(): string {
    return this.styles.file.render(this.name);
  }
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
