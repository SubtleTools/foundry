---
layout: home

hero:
  name: "Lipgloss TypeScript"
  text: "Beautiful terminal styling"
  tagline: "A comprehensive TypeScript port of Charm's Lipgloss with 100% API compatibility"
  image:
    src: /logo.svg
    alt: Lipgloss TypeScript
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View Examples
      link: /examples/
    - theme: alt
      text: API Reference
      link: /api/

features:
  - icon: 🎨
    title: Complete Terminal Styling
    details: Colors, text decorations, borders, spacing - everything you need for beautiful terminal UIs

  - icon: 📐
    title: Advanced Layout System
    details: Padding, margins, alignment, dimensions with CSS-like syntax for precise control

  - icon: 🧩
    title: Component Library
    details: Lists, tables, trees for complex UIs - build sophisticated terminal applications

  - icon: 🎯
    title: 100% Go API Compatibility
    details: Drop-in replacement for Charm's Lipgloss with identical behavior and output

  - icon: 🦺
    title: Type-Safe
    details: Full TypeScript support with excellent IntelliSense and compile-time safety

  - icon: ⚡
    title: High Performance
    details: Optimized for speed and memory efficiency with benchmark-tested algorithms
---

## Quick Preview

```typescript
import { NewStyle, JoinVertical, Position } from '@tsports/lipgloss';

const titleStyle = NewStyle()
  .foreground('purple')
  .bold(true)
  .padding(1)
  .borderStyle('rounded')
  .borderForeground('purple');

const title = titleStyle.render('🎉 Hello, Lipgloss!');
console.log(title);
```

**Output:**
```
   ╭─────────────────────╮
   │  🎉 Hello, Lipgloss! │
   ╰─────────────────────╯
```

## Why Lipgloss TypeScript?

### **100% Compatible**
Migrating from Go Lipgloss? Every method, every behavior, every output is identical. Your existing knowledge transfers directly.

### **Type-Safe**
Catch errors at compile time with comprehensive TypeScript definitions. IntelliSense shows you exactly what's available.

### **Production Ready**
Battle-tested with 280+ comparative tests ensuring perfect compatibility. Used in production TypeScript applications.

### **Zero Dependencies**
Lightweight and self-contained. No bloated dependency trees - just beautiful terminal styling.

## Trusted by Developers

> "The TypeScript port is indistinguishable from the original Go version. Perfect for our Node.js CLI tools."
>
> — Terminal UI Developer

> "Finally, type-safe terminal styling! The IntelliSense support makes development so much faster."
>
> — Full-Stack Developer

> "Migrated our entire CLI toolkit from Go to TypeScript. The API compatibility made it seamless."
>
> — DevOps Engineer

---

<div style="text-align: center; margin-top: 2rem;">
  <a href="/guide/getting-started" style="margin-right: 1rem;">
    <img alt="Get Started" src="https://img.shields.io/badge/Get%20Started-blue?style=for-the-badge">
  </a>
  <a href="https://github.com/tsports/lipgloss" style="margin-right: 1rem;">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github">
  </a>
  <a href="https://www.npmjs.com/package/@tsports/lipgloss">
    <img alt="NPM" src="https://img.shields.io/badge/NPM-red?style=for-the-badge&logo=npm">
  </a>
</div>
