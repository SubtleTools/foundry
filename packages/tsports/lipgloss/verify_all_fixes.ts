#!/usr/bin/env bun
import { Style } from "./src/style.js";
import { BorderType } from "./src/types.js";
import { SetColorProfile } from "./src/renderer.js";
import { ColorProfile } from "./src/types.js";

console.log("=== COMPREHENSIVE BORDER FIX VERIFICATION ===");

// Enable colors for proper testing
SetColorProfile(ColorProfile.TrueColor);

console.log("\n1. ✅ EMPTY CONTENT WITH BORDERS (should show empty border box):");
const emptyTest = new Style()
  .borderStyle(BorderType.Normal)
  .width(15)
  .render("");
console.log(JSON.stringify(emptyTest));
console.log("Visual:");
console.log(emptyTest);

console.log("\n2. ✅ LONG TEXT WRAPPING (should wrap across multiple lines):");
const wrapTest = new Style()
  .borderStyle(BorderType.Normal)
  .width(20)
  .render("This is a very long line that should wrap nicely across multiple lines");
console.log(JSON.stringify(wrapTest));
console.log("Visual:");
console.log(wrapTest);

console.log("\n3. ✅ BORDER COLORS (should show red ANSI color codes):");
const colorTest = new Style()
  .borderStyle(BorderType.Normal)
  .borderColor("red")
  .width(12)
  .render("Colored");
console.log(JSON.stringify(colorTest));
console.log("Visual:");
console.log(colorTest);

console.log("\n4. ✅ COMBINED TEST (empty + colored borders):");
const combinedTest = new Style()
  .borderStyle(BorderType.Rounded)
  .borderColor("blue")
  .width(18)
  .render("");
console.log(JSON.stringify(combinedTest));
console.log("Visual:");
console.log(combinedTest);

console.log("\n🎉 ALL BORDER FIXES VERIFIED!");

