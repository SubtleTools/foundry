import { GoCompatibleRand, GO_DEFAULT_SEED } from './go-compatible-rand';

export interface RandInterface {
  float64(): number;
  intn(n: number): number;
}

// Global random instance to match Go's global rand source
let globalRand: RandInterface = new GoCompatibleRand(GO_DEFAULT_SEED);

export function getDefaultGlobalRand(): RandInterface {
  return globalRand;
}

// Allow seeding the global random instance (like rand.Seed)
export function seedGlobalRand(seed: number): void {
  globalRand = new GoCompatibleRand(seed);
}
