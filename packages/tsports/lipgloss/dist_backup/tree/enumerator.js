/**
 * Tree enumerators for rendering tree structures
 */
/**
 * Default tree enumerator using box drawing characters
 * ├── Foo
 * ├── Bar
 * └── Baz
 */
export const DefaultEnumerator = (children, index) => {
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
export const RoundedEnumerator = (children, index) => {
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
export const DefaultIndenter = (children, index) => {
    if (children.length() - 1 === index) {
        return '   ';
    }
    return '│  ';
};
//# sourceMappingURL=enumerator.js.map