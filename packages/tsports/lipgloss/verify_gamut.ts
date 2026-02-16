import { blends, toHex, hex } from '@tsports/gamut';

console.log("Gamut integration check:");
try {
    const c1 = hex("#F25D94");
    const c2 = hex("#EDFF82");
    const b = blends(c1, c2, 5);
    console.log("Blends successful:", b.length);
    console.log("First color:", toHex(b[0]));
} catch (e) {
    console.error("Integration failed:", e);
}
