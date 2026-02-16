import { Hex, HSV } from '@tsports/go-colorful';

const c = Hex('#2F1B82');
const [h, s, v] = c.hsv();
console.log(`Original: HSV(${h}, ${s}, ${v})`);

const complementary = HSV((h + 180) % 360, s, v).clamped();
const [h2, s2, v2] = complementary.hsv();
console.log(`Complementary: HSV(${h2}, ${s2}, ${v2})`);

const split1 = HSV(h2 - 30, s2, v2).clamped();
console.log(`Split1 hue input: ${h2 - 30}`);
console.log(`Split1 RGB: r=${split1.r}, g=${split1.g}, b=${split1.b}`);
console.log(`Split1 hex: ${split1.hex()}`);

// What does Go give us?
console.log('\nExpected from Go: #82631b');
console.log('  Which is RGB(130, 99, 27) = (0.509804, 0.388235, 0.105882)');
