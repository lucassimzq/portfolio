"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * The kit every figure on the site is drawn with: one isometric projection, a few
 * solids (a box, a disc, a slab), and a stage that knows where the pointer is, keeps
 * its own clock while on screen, and hands each figure one frame at a time.
 *
 * Drawing rules: white faces painted back to front, a bright silhouette and a dim
 * crease, ink for what is, orange for what is happening.
 */

export type Pt = [number, number];

/** Screen size of a figure; every stage is 5:4. */
export const W = 400, H = 320;

const C = Math.cos(Math.PI / 6);
/** Isometric projection about a screen origin at scale k: x runs right-down, y left-down, z up. */
export const iso = (ox: number, oy: number, k = 1) =>
  Object.assign((x: number, y: number, z = 0): Pt => [ox + k * C * (x - y), oy + k * (0.5 * (x + y) - z)], { ox, oy, k });
export type Proj = ReturnType<typeof iso>;

const n = (v: number) => v.toFixed(1);
/** Points to a path; closed unless told otherwise. */
export const d = (pts: Pt[], close = true) => "M" + pts.map((p) => n(p[0]) + " " + n(p[1])).join("L") + (close ? "Z" : "");
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => ((t = clamp(t)) < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * A box from (x, y, z), w along x, dp along y, h tall. Its hull is drawn bright, the
 * three edges inside it dim. `tone` swaps the ink for orange or for a dashed ghost.
 */
export function Box({
  P, x, y, z = 0, w, dp, h, tone, top, children,
}: {
  P: Proj; x: number; y: number; z?: number; w: number; dp: number; h: number;
  tone?: "o" | "ghost"; top?: string; children?: ReactNode;
}) {
  const a = P(x, y, z + h), b = P(x + w, y, z + h), c = P(x + w, y + dp, z + h), e = P(x, y + dp, z + h);
  const b0 = P(x + w, y, z), c0 = P(x + w, y + dp, z), e0 = P(x, y + dp, z);
  const hull = d([a, b, b0, c0, e0, e]);
  const ghost = tone === "ghost";
  return (
    <g className={ghost ? "ghost" : undefined}>
      <path d={hull} className={ghost ? "d" : "f"} />
      {top && <path d={d([a, b, c, e])} className={top} />}
      {!ghost && h > 0 && <path d={d([e, c, b], false) + d([c, c0], false)} className="c" />}
      {!ghost && h <= 0 && <path d={d([e, c, b], false)} className="c" />}
      {children}
      <path d={hull} className={ghost ? "d" : tone === "o" ? "o" : "s"} />
    </g>
  );
}

/** An upright disc or cylinder of radius r at (x, y), from z up h. */
export function Can({ P, x, y, z = 0, r, h, tone, fill }: { P: Proj; x: number; y: number; z?: number; r: number; h: number; tone?: "o"; fill?: string }) {
  const [cx, cy] = P(x, y, z + h);
  const [, by] = P(x, y, z);
  const rx = r * 1.2247 * P.k, ry = r * 0.7071 * P.k;
  const side = `M${n(cx - rx)} ${n(cy)}L${n(cx - rx)} ${n(by)}A${n(rx)} ${n(ry)} 0 0 0 ${n(cx + rx)} ${n(by)}L${n(cx + rx)} ${n(cy)}`;
  const cls = tone === "o" ? "o" : "s";
  return (
    <g>
      {h > 0 && <path d={side + "Z"} className="f" />}
      {h > 0 && <path d={side} className={cls} />}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className={fill ?? "f"} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className={cls} />
    </g>
  );
}

/** A flat rectangle on the floor at height z. */
export const quad = (P: Proj, x: number, y: number, w: number, dp: number, z = 0) => d([P(x, y, z), P(x + w, y, z), P(x + w, y + dp, z), P(x, y + dp, z)]);

const PLANES = {
  /** lying on the floor, reading along x */
  floor: "matrix(0.866 0.5 -0.866 0.5 0 0)",
  /** lying on the floor, reading along -y */
  floorY: "matrix(0.866 -0.5 0.866 0.5 0 0)",
  /** standing on a wall that runs along x */
  wall: "matrix(0.866 0.5 0 1 0 0)",
  /** standing on a wall that runs along y */
  wallY: "matrix(0.866 -0.5 0 1 0 0)",
};

/** A label set into one of the drawing's planes, starting at (x, y, z). */
export function Label({
  P, x, y, z = 0, plane = "floor", className = "t", children,
}: { P: Proj; x: number; y: number; z?: number; plane?: keyof typeof PLANES; className?: string; children: ReactNode }) {
  const [px, py] = P(x, y, z);
  return (
    <g transform={`translate(${n(px)} ${n(py)})`}>
      <text transform={PLANES[plane]} className={className}>
        {children}
      </text>
    </g>
  );
}

/** Where a point on the stage (0..1 each way) lands on the plane at height z. */
export function unproject(P: Proj, fx: number, fy: number, z = 0): Pt {
  const u = (fx * W - P.ox) / (C * P.k), v = 2 * ((fy * H - P.oy) / P.k + z);
  return [(u + v) / 2, (v - u) / 2];
}

/** A small seeded random, so scattered things land in the same place every visit. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Frame = {
  /** Seconds on screen; stands still under reduced motion. */
  t: number;
  /** The pointer, or the figure's idle wander when nobody is pointing: 0..1 across the stage, smoothed. */
  x: number;
  y: number;
  /** Someone is pointing at it right now. */
  over: boolean;
  still: boolean;
};

/**
 * A figure's stage. The clock runs only while the stage is on screen; the pointer is
 * eased toward, so every figure follows it with the same soft lag. When the pointer
 * leaves, `idle(t)` takes over, so nothing ever sits dead.
 */
export function Stage({
  label,
  draw,
  read,
  onRead,
  idle = (t) => [0.5 + 0.32 * Math.sin(t * 0.55), 0.5 + 0.22 * Math.sin(t * 0.4 + 1)],
  still = 2.4,
  className = "",
}: {
  label: string;
  draw: (f: Frame) => ReactNode;
  read?: (f: Frame) => string;
  onRead?: (text: string) => void;
  idle?: (t: number) => Pt;
  /** Where the clock stands under reduced motion. */
  still?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [f, setF] = useState<Frame>(() => {
    const [x, y] = idle(still);
    return { t: still, x, y, over: false, still: false };
  });
  const live = useRef({ idle, tx: 0.5, ty: 0.5, over: false });
  useEffect(() => {
    live.current.idle = idle;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const L = live.current;
    let raf = 0, last = 0, t = still, x = f.x, y = f.y, seen = false;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      L.tx = clamp((e.clientX - r.left) / r.width);
      L.ty = clamp((e.clientY - r.top) / r.height);
      L.over = true;
      if (reduced) setF({ t, x: L.tx, y: L.ty, over: true, still: true });
    };
    const leave = () => {
      L.over = false;
      if (reduced) {
        const [ix, iy] = L.idle(t);
        setF({ t, x: ix, y: iy, over: false, still: true });
      }
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointercancel", leave);

    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      t += dt;
      const [ix, iy] = L.over ? [L.tx, L.ty] : L.idle(t);
      const k = 1 - Math.exp(-dt * (L.over ? 9 : 4));
      x += (ix - x) * k;
      y += (iy - y) * k;
      setF({ t, x, y, over: L.over, still: false });
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      cancelAnimationFrame(raf);
      last = 0;
      if (seen && !reduced) raf = requestAnimationFrame(tick);
    });
    if (reduced) raf = requestAnimationFrame(() => setF((p) => ({ ...p, still: true })));
    else io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
    };
    // the stage wires itself once; the latest idle is read through the ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const text = read ? read(f) : "";
  const said = useRef("");
  useEffect(() => {
    if (onRead && text !== said.current) {
      said.current = text;
      onRead(text);
    }
  }, [text, onRead]);

  return (
    <div ref={ref} className={`fig ${className}`} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {draw(f)}
      </svg>
    </div>
  );
}
