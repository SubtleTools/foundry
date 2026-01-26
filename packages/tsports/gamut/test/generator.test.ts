import { describe, expect, it } from 'bun:test';
import type { Color } from '@tsports/go-colorful';
import { hex } from '../src/colors.js';
import {
  BroadGranularity,
  generate,
  HappyGenerator,
  PastelGenerator,
  SimilarHueGenerator,
  WarmGenerator,
} from '../src/generator.js';

class TestColorGenerator extends BroadGranularity {
  valid(col: Color): boolean {
    const [l] = col.lab();
    return 0.4 <= l && l <= 0.6;
  }
}

describe('Generator', () => {
  it('should generate colors using various generators', () => {
    const tests = [
      { generator: new PastelGenerator(), amount: 8 },
      { generator: new WarmGenerator(), amount: 8 },
      { generator: new HappyGenerator(), amount: 8 },
      { generator: new SimilarHueGenerator(hex('#ABCDEF')), amount: 8 },
      { generator: new TestColorGenerator(), amount: 8 },
    ];

    for (const t of tests) {
      const [cc, err] = generate(t.amount, t.generator);
      expect(err).toBeNull();
      expect(cc.length).toBe(t.amount);
    }
  });
});
