export type Pt = readonly [number, number];

const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

function towards(from: Pt, to: Pt, by: number): Pt {
  const d = dist(from, to) || 1;
  return [from[0] + ((to[0] - from[0]) / d) * by, from[1] + ((to[1] - from[1]) / d) * by];
}

function quadLength(a: Pt, c: Pt, b: Pt, samples = 12) {
  let len = 0;
  let prev = a;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const mt = 1 - t;
    const p: Pt = [
      mt * mt * a[0] + 2 * mt * t * c[0] + t * t * b[0],
      mt * mt * a[1] + 2 * mt * t * c[1] + t * t * b[1],
    ];
    len += dist(prev, p);
    prev = p;
  }
  return len;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Polyline → SVG path with softened corners, plus its length so packets can be
 * animated with stroke-dash maths in plain CSS (no per-frame JS).
 */
export function routePath(pts: readonly Pt[], radius = 14) {
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  let len = 0;
  let cur = pts[0];
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const next = pts[i + 1];
    if (!next) {
      d += ` L${r1(p[0])} ${r1(p[1])}`;
      len += dist(cur, p);
      break;
    }
    const r = Math.min(radius, dist(cur, p) / 2, dist(p, next) / 2);
    const a = towards(p, cur, r);
    const b = towards(p, next, r);
    d += ` L${r1(a[0])} ${r1(a[1])} Q${r1(p[0])} ${r1(p[1])} ${r1(b[0])} ${r1(b[1])}`;
    len += dist(cur, a) + quadLength(a, p, b);
    cur = b;
  }
  return { d, len: Math.round(len) };
}

/** Gentle bow between two points, for map arcs. `bend` is a fraction of the chord. */
export function arcPath(a: Pt, b: Pt, bend = 0.22) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  // normal pointing to the right of travel
  const c: Pt = [mx - dy * bend, my + dx * bend];
  return { d: `M${r1(a[0])} ${r1(a[1])} Q${r1(c[0])} ${r1(c[1])} ${r1(b[0])} ${r1(b[1])}`, len: Math.round(quadLength(a, c, b, 24)), c };
}

/**
 * Integer hash → [0, 1). Same answer on every JS engine (unlike Math.sin tricks),
 * so server-rendered markup hydrates cleanly.
 */
export function hash01(i: number) {
  let x = Math.imul(i + 1, 0x9e3779b1);
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}
