/**
 * Functions for sorting colors
 */

import { Color } from './colors';

// An element represents a single element of a set. It is used to
// implement a disjoint-set forest.
class Element {
  parent: Element; // Parent element
  rank: number; // Rank (approximate depth) of the subtree with this element as root

  constructor() {
    this.parent = this;
    this.rank = 0;
  }

  // find returns an arbitrary element of a set when invoked on any element of
  // the set. The important feature is that it returns the same value when
  // invoked on any element of the set. Consequently, it can be used to test if
  // two elements belong to the same set.
  find(): Element {
    let e: Element = this;
    while (e.parent !== e) {
      e.parent = e.parent.parent;
      e = e.parent;
    }
    return e;
  }
}

// newElement creates a singleton set and returns its sole element.
const newElement = (): Element => {
  return new Element();
};

// union establishes the union of two sets when given an element from each set.
// Afterwards, the original sets no longer exist as separate entities.
const union = (e1: Element, e2: Element): void => {
  // Ensure the two elements aren't already part of the same union.
  const e1Root = e1.find();
  const e2Root = e2.find();
  if (e1Root === e2Root) {
    return;
  }

  // Create a union by making the shorter tree point to the root of the
  // larger tree.
  if (e1Root.rank < e2Root.rank) {
    e1Root.parent = e2Root;
  } else if (e1Root.rank > e2Root.rank) {
    e2Root.parent = e1Root;
  } else {
    e2Root.parent = e1Root;
    e1Root.rank++;
  }
};

// An edgeIdxs describes an edge in a graph or tree. The vertices in the edge
// are indexes into a list of Color values.
type EdgeIdxs = [number, number];

// An edgeDistance is a map from an edge (pair of indices) to a distance
// between the two vertices.
type EdgeDistance = Map<string, number>;

// Helper function to create edge key
const edgeKey = (u: number, v: number): string => `${u},${v}`;

// allToAllDistancesCIEDE2000 computes the CIEDE2000 distance between each pair of
// colors. It returns a map from a pair of indices (u, v) with u < v to a
// distance.
const allToAllDistancesCIEDE2000 = (cs: Color[]): EdgeDistance => {
  const nc = cs.length;
  const m = new Map<string, number>();
  for (let u = 0; u < nc - 1; u++) {
    for (let v = u + 1; v < nc; v++) {
      m.set(edgeKey(u, v), cs[u].distanceCIEDE2000(cs[v]));
    }
  }
  return m;
};

// sortEdges sorts all edges in a distance map by increasing vertex distance.
const sortEdges = (m: EdgeDistance): EdgeIdxs[] => {
  const es: EdgeIdxs[] = [];
  for (const [key, _distance] of m.entries()) {
    const [u, v] = key.split(',').map(Number) as [number, number];
    es.push([u, v]);
  }
  es.sort((a, b) => {
    const distA = m.get(edgeKey(a[0], a[1]));
    const distB = m.get(edgeKey(b[0], b[1]));
    if (distA === undefined || distB === undefined) {
      return 0; // Equal if either distance is missing
    }
    return distA - distB;
  });
  return es;
};

// minSpanTree computes a minimum spanning tree from a vertex count and a
// distance-sorted edge list. It returns the subset of edges that belong to
// the tree, including both (u, v) and (v, u) for each edge.
const minSpanTree = (nc: number, es: EdgeIdxs[]): Set<string> => {
  // Start with each vertex in its own set.
  const elts: Element[] = [];
  for (let i = 0; i < nc; i++) {
    elts.push(newElement());
  }

  // Run Kruskal's algorithm to construct a minimal spanning tree.
  const mst = new Set<string>();
  for (const [u, v] of es) {
    if (elts[u].find() === elts[v].find()) {
      continue; // Same set: edge would introduce a cycle.
    }
    mst.add(edgeKey(u, v));
    mst.add(edgeKey(v, u));
    union(elts[u], elts[v]);
  }
  return mst;
};

// traverseMST walks a minimum spanning tree in prefix order.
const traverseMST = (mst: Set<string>, root: number): number[] => {
  // Compute a list of neighbors for each vertex.
  const neighs = new Map<number, number[]>();
  for (const key of mst.keys()) {
    const [u, v] = key.split(',').map(Number);
    if (!neighs.has(u)) {
      neighs.set(u, []);
    }
    neighs.get(u)?.push(v);
  }

  // Sort neighbors for consistent traversal
  for (const [_u, vs] of neighs.entries()) {
    vs.sort((a, b) => a - b);
  }

  // Walk the tree from a given vertex.
  const order: number[] = [];
  const visited = new Set<number>();

  const walkFrom = (r: number): void => {
    // Visit the starting vertex.
    order.push(r);
    visited.add(r);

    // Recursively visit each child in turn.
    const neighbors = neighs.get(r) || [];
    for (const c of neighbors) {
      if (!visited.has(c)) {
        walkFrom(c);
      }
    }
  };

  walkFrom(root);
  return order;
};

// Sorted sorts a list of Color values. Sorting is not a well-defined operation
// for colors so the intention here primarily is to order colors so that the
// transition from one to the next is fairly smooth.
export const Sorted = (cs: Color[]): Color[] => {
  // Do nothing in trivial cases.
  const newCs: Color[] = new Array(cs.length);
  if (cs.length < 2) {
    for (let i = 0; i < cs.length; i++) {
      newCs[i] = cs[i];
    }
    return newCs;
  }

  // Compute the distance from each color to every other color.
  const dists = allToAllDistancesCIEDE2000(cs);

  // Produce a list of edges in increasing order of the distance between
  // their vertices.
  const edges = sortEdges(dists);

  // Construct a minimum spanning tree from the list of edges.
  const mst = minSpanTree(cs.length, edges);

  // Find the darkest color in the list.
  const black = new Color(0, 0, 0);
  let dIdx = 0; // Index of darkest color
  let light = Number.MAX_VALUE; // Lightness of darkest color (distance from black)
  for (let i = 0; i < cs.length; i++) {
    const c = cs[i];
    const d = black.distanceCIEDE2000(c);
    if (d < light) {
      dIdx = i;
      light = d;
    }
  }

  // Traverse the tree starting from the darkest color.
  const idxs = traverseMST(mst, dIdx);

  // Convert the index list to a list of colors, overwriting the input.
  for (let i = 0; i < idxs.length; i++) {
    const idx = idxs[i];
    newCs[i] = cs[idx];
  }
  return newCs;
};
