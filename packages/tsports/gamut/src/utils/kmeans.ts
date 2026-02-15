/**
 * Simple K-Means clustering implementation for 3D points.
 * Used by generator.ts
 */

export type Point = [number, number, number];

export class KMeans {
  private k: number;
  private points: Point[];
  private centroids: Point[];

  constructor(k: number, points: Point[]) {
    this.k = k;
    this.points = points;
    this.centroids = [];
  }

  run(iterations: number = 100): Point[] {
    if (this.points.length === 0) return [];
    if (this.points.length <= this.k) return this.points;

    // Initialize centroids randomly
    const indices = new Set<number>();
    while (indices.size < this.k) {
      indices.add(Math.floor(Math.random() * this.points.length));
    }
    this.centroids = Array.from(indices)
      .map((i) => this.points[i])
      .filter((point) => point !== undefined) as Point[];

    for (let i = 0; i < iterations; i++) {
      const assignments = this.assignPoints();
      const newCentroids = this.updateCentroids(assignments);

      if (this.converged(this.centroids, newCentroids)) {
        this.centroids = newCentroids;
        break;
      }
      this.centroids = newCentroids;
    }

    return this.centroids;
  }

  private assignPoints(): number[] {
    return this.points.map((p) => {
      let minDist = Infinity;
      let clusterIndex = 0;
      for (let i = 0; i < this.centroids.length; i++) {
        const centroid = this.centroids[i];
        if (centroid) {
          // Check existence
          const d = this.distanceSq(p, centroid);
          if (d < minDist) {
            minDist = d;
            clusterIndex = i;
          }
        }
      }
      return clusterIndex;
    });
  }

  private updateCentroids(assignments: number[]): Point[] {
    const sums: Point[] = Array(this.k)
      .fill(0)
      .map(() => [0, 0, 0]);
    const counts: number[] = Array(this.k).fill(0);

    for (let i = 0; i < this.points.length; i++) {
      const cluster = assignments[i];
      if (cluster === undefined) continue;

      const p = this.points[i];
      if (!p) continue;

      const currentSum = sums[cluster];
      if (currentSum) {
        currentSum[0] += p[0];
        currentSum[1] += p[1];
        currentSum[2] += p[2];

        const count = counts[cluster];
        if (count !== undefined) {
          counts[cluster] = count + 1;
        }
      }
    }

    return sums.map((sum, i) => {
      const count = counts[i];
      const oldCentroid = this.centroids[i];
      if (count === undefined || count === 0) {
        // Keep old centroid if empty
        if (oldCentroid) {
          return oldCentroid;
        }
        return [0, 0, 0] as Point; // Fallback if old centroid doesn't exist
      }

      return [sum[0] / count, sum[1] / count, sum[2] / count] as Point;
    });
  }

  private converged(oldC: Point[], newC: Point[]): boolean {
    const threshold = 1e-5;
    for (let i = 0; i < this.k; i++) {
      const p1 = oldC[i];
      const p2 = newC[i];
      if (!p1 || !p2) continue; // Should not happen with valid logic
      if (this.distanceSq(p1, p2) > threshold) return false;
    }
    return true;
  }

  private distanceSq(p1: Point, p2: Point): number {
    return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2;
  }
}
