/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Tree enumerators for rendering tree structures
 */

import type { Children, Enumerator, Indenter } from './types';

/**
 * Default tree enumerator using box drawing characters
 * ├── Foo
 * ├── Bar
 * └── Baz
 */
export const DefaultEnumerator: Enumerator = (children: Children, index: number): string => {
  if (children.length() - 1 === index) {
    return '└──';
  }
  return '├──';
};

/**
 * Rounded tree enumerator using rounded box drawing characters
 * ├── Foo
 * ├── Bar
 * ╰── Baz
 */
export const RoundedEnumerator: Enumerator = (children: Children, index: number): string => {
  if (children.length() - 1 === index) {
    return '╰──';
  }
  return '├──';
};

/**
 * Default indenter for nested trees and multiline content
 * ├── Foo
 * ├── Bar
 * │   ├── Qux
 * │   └── Quux
 * └── Baz
 */
export const DefaultIndenter: Indenter = (children: Children, index: number): string => {
  if (children.length() - 1 === index) {
    return '   ';
  }
  return '│  ';
};
