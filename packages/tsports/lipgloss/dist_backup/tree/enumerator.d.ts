/**
 * Tree enumerators for rendering tree structures
 */
import type { Enumerator, Indenter } from './types';
/**
 * Default tree enumerator using box drawing characters
 * ├── Foo
 * ├── Bar
 * └── Baz
 */
export declare const DefaultEnumerator: Enumerator;
/**
 * Rounded tree enumerator using rounded box drawing characters
 * ├── Foo
 * ├── Bar
 * ╰── Baz
 */
export declare const RoundedEnumerator: Enumerator;
/**
 * Default indenter for nested trees and multiline content
 * ├── Foo
 * ├── Bar
 * │   ├── Qux
 * │   └── Quux
 * └── Baz
 */
export declare const DefaultIndenter: Indenter;
//# sourceMappingURL=enumerator.d.ts.map