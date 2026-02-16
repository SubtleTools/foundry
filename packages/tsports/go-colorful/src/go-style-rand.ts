/**
 * Go-style random interface wrapper that converts between Go naming (Float64, Intn)
 * and JavaScript naming (float64, intn)
 */

import type { RandInterface as TSRandInterface } from './rand';

// Go-style interface with capitalized method names
export interface RandInterface {
  Float64(): number;
  Intn(n: number): number;
}

// Wrapper that adapts TypeScript rand to Go-style API
export class GoStyleRandWrapper implements RandInterface {
  constructor(private tsRand: TSRandInterface) {}

  Float64(): number {
    return this.tsRand.float64();
  }

  Intn(n: number): number {
    return this.tsRand.intn(n);
  }
}

// Wrapper that adapts Go-style rand to TypeScript API
export class TSStyleRandWrapper implements TSRandInterface {
  constructor(private goRand: RandInterface) {}

  float64(): number {
    return this.goRand.Float64();
  }

  intn(n: number): number {
    return this.goRand.Intn(n);
  }
}
