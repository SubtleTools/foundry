import { hex, blends as gamutBlends, toHex } from '@tsports/gamut';

const c1 = hex("#F25D94");
const c2 = hex("#EDFF82");

console.log('Luv Blends (first 5):');
for (let i = 0; i < 5; i++) {
    const t = i / 49; // steps=50, matching case.ts logic i/(steps-1)
    console.log(toHex(c1.blendLuv(c2, t)));
}

console.log('\nGamut Blends (Lab) (first 5):');
const blends = gamutBlends(c1, c2, 50);
for (let i = 0; i < 5; i++) {
    console.log(toHex(blends[i]));
}
