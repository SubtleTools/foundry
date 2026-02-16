/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Simple test file for Tree component
 * This replicates the Go example from examples/tree/simple/main.go
 */

import { newTree, RoundedEnumerator, rootTree } from './index';

// Test the simple Go example
function testSimpleTree() {
  console.log('Testing simple tree structure:');

  const t = rootTree('.')
    .child('macOS')
    .child(newTree().root('Linux').child('NixOS').child('Arch Linux (btw)').child('Void Linux'))
    .child(newTree().root('BSD').child('FreeBSD').child('OpenBSD'));

  console.log(t.toString());
  console.log('\n' + '='.repeat(50) + '\n');
}

// Test with rounded enumerator
function testRoundedTree() {
  console.log('Testing tree with rounded enumerator:');

  const t = rootTree('.')
    .child('macOS')
    .child(newTree().root('Linux').child('NixOS').child('Arch Linux (btw)').child('Void Linux'))
    .child(newTree().root('BSD').child('FreeBSD').child('OpenBSD'))
    .enumerator(RoundedEnumerator);

  console.log(t.toString());
  console.log('\n' + '='.repeat(50) + '\n');
}

// Test with styling
function testStyledTree() {
  console.log('Testing tree with styling:');

  const t = newTree().child(
    'Glossier',
    "Claire's Boutique",
    rootTree('Nyx').child('Lip Gloss', 'Foundation'),
    'Mac',
    'Milk'
  );

  console.log(t.toString());
}

// Run the tests (ES module check)
if (import.meta.url === `file://${process.argv[1]}`) {
  testSimpleTree();
  testRoundedTree();
  testStyledTree();
}
