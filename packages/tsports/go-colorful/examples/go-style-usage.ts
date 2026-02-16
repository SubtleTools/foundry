/**
 * Example showing both TypeScript-style and Go-style APIs
 */

// TypeScript-style API (camelCase, modern conventions)
import { Color as TSColor, Hex as TSHex, Lab as TSLab } from '../src';

// Go-style API (PascalCase, matches Go exactly)
import { Color as GoColor, Hex as GoHex, Lab as GoLab } from '../src/go-style';

console.log("=== TypeScript Style API ===");

// TypeScript style - camelCase methods
const tsColor = new TSColor(0.7, 0.2, 0.9);
console.log("RGB values:", tsColor.r, tsColor.g, tsColor.b);
console.log("Is valid:", tsColor.isValid());
console.log("RGB255:", tsColor.rgb255());
console.log("HSV:", tsColor.hsv());
console.log("Lab:", tsColor.lab());
console.log("Hex:", tsColor.hex());

// TypeScript constructor functions - PascalCase
const tsFromHex = TSHex("#ff8040");
const tsFromLab = TSLab(0.5, 0.1, -0.2);

console.log("From hex #ff8040:", tsFromHex.hex());
console.log("From Lab(0.5, 0.1, -0.2):", tsFromLab.hex());

console.log("\n=== Go Style API ===");

// Go style - PascalCase methods (matches Go exactly)
const goColor = new GoColor(0.7, 0.2, 0.9);
console.log("RGB values:", goColor.R, goColor.G, goColor.B); // Capital R, G, B like Go
console.log("Is valid:", goColor.IsValid()); // PascalCase like Go
console.log("RGB255:", goColor.RGB255()); // All caps like Go
console.log("HSV:", goColor.Hsv()); // Go uses Hsv, not HSV
console.log("Lab:", goColor.Lab()); // Go uses Lab method
console.log("Hex:", goColor.Hex()); // Go uses Hex method

// Go constructor functions - exact Go naming
const goFromHex = GoHex("#ff8040");
const goFromLab = GoLab(0.5, 0.1, -0.2);

console.log("From hex #ff8040:", goFromHex.Hex());
console.log("From Lab(0.5, 0.1, -0.2):", goFromLab.Hex());

console.log("\n=== Comparison ===");
console.log("Both APIs produce identical results:");
console.log("TS hex:", tsColor.hex(), "== Go hex:", goColor.Hex());
console.log("Results match:", tsColor.hex() === goColor.Hex());

// Distance calculations
const ts1 = TSHex("#ff0000");
const ts2 = TSHex("#0000ff");
const go1 = GoHex("#ff0000");  
const go2 = GoHex("#0000ff");

console.log("TS Lab distance:", ts1.distanceLab(ts2));
console.log("Go Lab distance:", go1.DistanceLab(go2));
console.log("Results match:", Math.abs(ts1.distanceLab(ts2) - go1.DistanceLab(go2)) < 1e-10);

console.log("\n=== Use Case ===");
console.log("Use TypeScript style for new TypeScript projects");
console.log("Use Go style when porting existing Go code or for Go developers");