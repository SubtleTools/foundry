import { MakeColor } from '@tsports/go-colorful';
import { generate, PastelGenerator } from '#src/index.js';

async function main() {
  const [colors, err] = await generate(8, new PastelGenerator());
  if (err !== null) {
    throw err;
  }

  const hexColors: string[] = [];
  for (const c of colors) {
    const [col, ok] = MakeColor(c);
    if (!ok) {
      throw new Error(`invalid RGB color: ${JSON.stringify(c)}`);
    }
    hexColors.push(col.hex());
  }

  process.stdout.write(`${JSON.stringify(hexColors, null, 2)}\n`);
}

main().catch(console.error);
