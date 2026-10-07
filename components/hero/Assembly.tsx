"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The hero's drawing: a backend drawn as three plates in hairlines, in the manner of
 * hairline's own hero (github.com/lucasmarkes/hairline, MIT). A floor of rules and dots
 * draws itself out from the middle, then the plates peel off one another, data first,
 * then services, then the edge, each drawing its own parts as it rises. Once built the
 * stack breathes, and a request drops through it, from the edge to the row it was for.
 * The pointer's height picks a layer; its label and its rim go to ink.
 */

type Pt = [number, number];

/** The floor's isometric projection at 30px a unit, so every stroke is one screen pixel whatever its direction. */
const C = Math.cos(Math.PI / 6), S = 0.5, K = 30;
const P = (x: number, y: number, z = 0): Pt => [K * C * (x - y), K * S * (x + y) - z];

const NS = "http://www.w3.org/2000/svg";
const mk = (tag: string, at: Record<string, string | number>, parent: Element) => {
  const el = document.createElementNS(NS, tag) as SVGElement;
  for (const k in at) el.setAttribute(k, String(at[k]));
  parent.appendChild(el);
  return el;
};
const f = (n: number) => n.toFixed(2);
const line = (pts: Pt[]) => "M" + pts.map((p) => f(p[0]) + "," + f(p[1])).join("L");
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
/** A critically damped spring from 0 to 1: no jolt leaving rest, a long soft tail. */
const spring = (t: number, w: number) => (t <= 0 ? 0 : 1 - (1 + w * t) * Math.exp(-w * t));
const inout = (t: number) => ((t = clamp(t)) < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

/** A rounded rectangle on the floor, as points: four quarter arcs, n steps each. */
function ring(x0: number, y0: number, x1: number, y1: number, r: number, n = 8): Pt[] {
  const pts: Pt[] = [];
  for (const [cx, cy, a0] of [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]]) {
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + (90 * i) / n) * Math.PI) / 180;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

/** The rim split at its left and right extremes on screen; the half nearer the viewer is the side you see. */
function frontHalf(pts: Pt[]) {
  let l = 0, r = 0;
  pts.forEach((p, i) => {
    if (p[0] < pts[l][0]) l = i;
    if (p[0] > pts[r][0]) r = i;
  });
  const walk = (a: number, b: number) => {
    const o: Pt[] = [];
    for (let i = a; ; i = (i + 1) % pts.length) {
      o.push(pts[i]);
      if (i === b) break;
    }
    return o;
  };
  const h1 = walk(l, r), h2 = walk(r, l), avg = (h: Pt[]) => h.reduce((s, p) => s + p[1], 0) / h.length;
  return avg(h1) > avg(h2) ? h1 : h2.reverse();
}

/** Plates: half-widths A × B, corners R, each T thick, undersides at rest at Z. N is the floor's reach. */
const A = 3.4, B = 2.4, R = 0.6, T = 6, Z = [20, 70, 120], N = 7;
const RIM = ring(-A, -B, A, B, R, 10);
/** Where the request drops: the edge's lit port, a service, then a row of the table. */
const G: Pt = [0, -0.65];

export const LAYERS = ["Data", "Services", "Edge"] as const;

type Part = { pts: Pt[]; cls: string; closed: boolean };
const PARTS: Part[][] = [[], [], []];
const add = (plate: number, pts: Pt[], cls = "part", closed = false) => PARTS[plate].push({ pts, cls, closed });

// 0 · data: a table, its header, its columns and its rows; one row lit, the one the request is for
add(0, ring(-A + 0.4, -B + 0.4, A - 0.4, B - 0.4, 0.16, 6), "part", true);
add(0, [[-A + 0.4, -B + 0.95], [A - 0.4, -B + 0.95]]);
[-1.6, 0.5].forEach((x) => add(0, [[x, -B + 0.4], [x, B - 0.4]]));
for (let k = 0; k < 6; k++) {
  const y = -1.15 + k * 0.5;
  if (Math.abs(y - G[1]) < 0.01) continue;
  add(0, [[-A + 0.4, y], [A - 0.4, y]]);
}
add(0, [[-A + 0.4, G[1]], [A - 0.4, G[1]]], "lit");

// 1 · services: three boxes on a bus, a port in each; the middle one takes the request
[-2.3, 0, 2.3].forEach((cx) => {
  add(1, ring(cx - 0.6, -1.25, cx + 0.6, -0.05, 0.18, 6), cx === 0 ? "lit" : "part", true);
  const r = 0.09;
  add(1, ring(cx - r, -0.65 - r, cx + r, -0.65 + r, r, 6), "part pip", true);
  add(1, [[cx, -0.05], [cx, 0.95]]);
});
add(1, [[-2.3, 0.95], [2.3, 0.95]]);
add(1, ring(-0.5, 1.35, 0.5, 1.85, 0.14, 6), "part", true);

// 2 · edge: a gateway with its port, and the requests waiting in two rows in front of it
add(2, ring(-2.6, -1.05, 2.6, -0.25, 0.2, 6), "part", true);
for (let k = 0; k < 6; k++) {
  for (const y of [0.75, 1.35]) {
    const x = -2.5 + k, r = 0.085;
    add(2, ring(x - r, y - r, x + r, y + r, r, 6), "part pip", true);
  }
}
add(2, [[0, -0.25], [0, 0.66]], "lit");
add(2, ring(-0.12, G[1] - 0.12, 0.12, G[1] + 0.12, 0.12, 6), "pip", true);

/** In ms from mount: the floor at D, the first plate at RISE, one more every STEP; all arrived at REST. */
const D = 500, RISE = D + 800, STEP = 560, REST = RISE + 2 * STEP + 1000;
/** A request drops every CYCLE once the stack has settled. */
const CYCLE = 3600;

function build(host: HTMLElement) {
  const svg = mk("svg", { viewBox: "-380 -240 760 400", "aria-hidden": "true" }, host);
  const defs = mk("defs", {}, svg);
  const fade = mk("radialGradient", { id: "assembly-fade", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse" }, defs);
  mk("stop", { offset: 0.45, "stop-color": "#fff" }, fade);
  mk("stop", { offset: 1, "stop-color": "#fff", "stop-opacity": 0 }, fade);
  const mask = mk("mask", { id: "assembly-mask", maskUnits: "userSpaceOnUse", x: -400, y: -260, width: 800, height: 480 }, defs);
  mk("rect", { x: -400, y: -260, width: 800, height: 480, fill: "url(#assembly-fade)" }, mask);

  // the floor: a rule every unit, each drawn as two halves running out from the middle, a dot every quarter
  const floor = mk("g", { mask: "url(#assembly-mask)" }, svg);
  let d = "";
  for (let i = -N * 4; i <= N * 4; i++) {
    for (let j = -N * 4; j <= N * 4; j++) {
      if (i % 4 === 0 || j % 4 === 0) continue;
      const [x, y] = P(i / 4, j / 4);
      d += `M${f(x)},${f(y)}h.01`;
    }
  }
  const dots = mk("path", { d, class: "dots" }, floor);
  const rules: [SVGElement, number][] = [];
  for (let i = -N; i <= N; i++) {
    for (const e of [N, -N]) {
      rules.push([mk("path", { class: "rule", d: line([P(i, 0), P(i, e)]), pathLength: 1 }, floor), Math.abs(i)]);
      rules.push([mk("path", { class: "rule", d: line([P(0, i), P(e, i)]), pathLength: 1 }, floor), Math.abs(i)]);
    }
  }
  const foot = mk("path", { class: "foot", d: line(RIM.map((p) => P(p[0], p[1]))) + "Z" }, svg);
  const drop = mk("path", { class: "drop", d: line(ring(-A + 0.15, -B + 0.15, A - 0.15, B - 0.15, R).map((p) => P(p[0], p[1]))) + "Z" }, svg);

  const plates = Z.map((_, i) => {
    const g = mk("g", {}, svg);
    const band = mk("path", { class: "band" }, g), side = mk("path", { class: "edge" }, g), face = mk("path", { class: "face" }, g);
    const pg = mk("g", {}, g);
    const parts = PARTS[i].map((w, k) => ({ ...w, k, el: mk("path", { class: w.cls, pathLength: 1 }, pg) }));
    const top = mk("path", { class: "edge" }, g);
    // the guide from this plate's top up to the underside of the next, painted before the plate above covers it
    const guide = i < Z.length - 1 ? mk("path", { class: "guide" }, g) : null;
    // the callout: a dashed leader from the rim's right end, and the layer's name
    const tick = mk("path", { class: "tick", "stroke-dasharray": "1 3" }, svg);
    const tag = mk("text", { class: "tag", "text-anchor": "start" }, svg);
    tag.textContent = `0${3 - i} · ${LAYERS[i]}`;
    return { g, band, side, face, parts, top, guide, tick, tag };
  });
  const packet = mk("circle", { class: "packet", r: 3.4 }, svg);
  return { svg, fade, rules, dots, foot, drop, plates, packet };
}

type Scene = ReturnType<typeof build>;

/** The floor's entrance: the disc widens while the rules run out to meet its edge, the nearer ones first. */
function drawFloor(s: Scene, t: number) {
  const k = N * (0.1 + 0.9 * out((t - D) / 1500));
  s.fade.setAttribute("gradientTransform", `matrix(${f(K * C * k)} ${f(K * S * k)} ${f(-K * C * k)} ${f(K * S * k)} 0 0)`);
  for (const [el, dist] of s.rules) {
    const p = out((t - D - dist * 55) / 1000);
    el.style.strokeDashoffset = String(1 - p);
    el.style.opacity = p ? "1" : "0";
  }
  s.dots.style.opacity = String(out((t - D - 200) / 1200));
}

/** At rest the stack breathes as one body: the gaps open and close together, slowly. */
const breath = (t: number) => Math.sin(((t - REST) / 1000) * 1.05) * inout((t - REST) / 2400);

/** One frame at `t`. `open` (0…1) widens the gaps while the pointer is on the stack; `pick` is the layer it chose. */
function draw(s: Scene, t: number, still: boolean, open: number, pick: number) {
  const b = still ? 0 : breath(t);
  let below = 0, lift = 0;
  const tops: number[] = [];
  s.plates.forEach((pl, i) => {
    const u = (t - RISE - i * STEP) / 1000;
    const rest = Z[i] + open * 16 * i;
    const z = below + (rest - below) * spring(u, 5.2) + b * (1.4 + 1.6 * i), th = T * out(u / 0.6);
    if (!i) lift = z;
    below = z + th;
    tops.push(z + th);
    pl.g.style.opacity = String(i ? (u >= 0 ? 1 : 0) : clamp(u / 0.25));
    const top = RIM.map((p) => P(p[0], p[1], z + th)), bot = RIM.map((p) => P(p[0], p[1], z));
    const fb = frontHalf(bot), ft = frontHalf(top), rim = line(top) + "Z";
    pl.band.setAttribute("d", line([...ft, ...fb.slice().reverse()]) + "Z");
    pl.side.setAttribute("d", line(fb) + line([ft[0], fb[0]]) + line([ft[ft.length - 1], fb[fb.length - 1]]));
    pl.side.style.opacity = th > 0.2 ? "1" : "0";
    pl.face.setAttribute("d", rim);
    pl.top.setAttribute("d", rim);
    pl.top.style.stroke = pick === i ? "var(--text-1)" : "";
    for (const w of pl.parts) {
      const p = out((t - RISE - i * STEP - 260 - w.k * 40) / 520);
      w.el.setAttribute("d", line(w.pts.map((q) => P(q[0], q[1], z + th))) + (w.closed ? "Z" : ""));
      w.el.style.strokeDashoffset = String(1 - p);
      w.el.style.opacity = p ? "1" : "0";
    }
    // the callout sits level with the plate, off its right end
    const [rx, ry] = P(A, -B, z + th / 2);
    const shown = out((t - RISE - i * STEP - 500) / 500);
    pl.tick.setAttribute("d", line([[rx + 14, ry], [rx + 46, ry]]));
    pl.tick.style.opacity = String(shown);
    pl.tag.setAttribute("x", f(rx + 54));
    pl.tag.setAttribute("y", f(ry + 3.5));
    pl.tag.style.opacity = String(shown);
    pl.tag.style.fill = pick === i ? "var(--text-1)" : "";
  });
  // guides run through the gaps only, so a plate never shows a line it should hide
  s.plates.forEach((pl, i) => {
    if (!pl.guide) return;
    const z0 = tops[i], z1 = tops[i + 1] - T;
    pl.guide.setAttribute("d", line([P(G[0], G[1], z0), P(G[0], G[1], z1)]));
    pl.guide.style.opacity = String(out((t - REST + 600) / 600));
  });
  s.foot.style.opacity = String(inout((t - D - 450) / 700));
  s.drop.style.opacity = String(0.55 * clamp(lift / Z[0]));

  // the request: a dot that drops from the edge's port to its row, painted between the plates it is between
  const c = t - REST;
  if (still || c < 0) {
    s.packet.style.opacity = "0";
    return;
  }
  const u = (c % CYCLE) / 1400;
  if (u > 1.25) {
    s.packet.style.opacity = "0";
    return;
  }
  const from = tops[2], to = tops[0];
  const z = from + (to - from) * inout(u);
  const [px, py] = P(G[0], G[1], z);
  s.packet.setAttribute("cx", f(px));
  s.packet.setAttribute("cy", f(py));
  s.packet.style.opacity = String(u > 1 ? 1 - (u - 1) / 0.25 : clamp(u / 0.08));
  const above = s.plates.find((_, i) => tops[i] - T > z - 0.01 && i > 0 && tops[i - 1] <= z + 0.01);
  const inside = s.plates.findIndex((_, i) => z < tops[i] - 0.01 && z > tops[i] - T + 0.01);
  if (inside >= 0) s.plates[inside].g.before(s.packet);
  else if (above) above.g.before(s.packet);
  else s.svg.appendChild(s.packet);
}

/**
 * The stack, drawn in hairlines. One clock drives it and only counts time on screen,
 * so a hidden tab or a scroll away picks up where it left off. Under reduced motion it
 * is drawn at rest, at once, with no request in flight.
 */
export default function Assembly() {
  const host = useRef<HTMLDivElement>(null);
  const [layer, setLayer] = useState(-1);

  useEffect(() => {
    const el = host.current!;
    const scene = build(el);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t = 0, prev = 0, raf = 0, visible = true;
    let open = 0, vel = 0, target = 0, pick = -1;

    const frame = () => {
      if (t < REST + 50) drawFloor(scene, t);
      draw(scene, t, reduced, open, pick);
    };

    // the layer under the pointer: the plate whose rest height is nearest, tested in the drawing's own units
    const move = (e: PointerEvent) => {
      const box = scene.svg.getBoundingClientRect();
      const sx = ((e.clientX - box.left) / box.width) * 760 - 380;
      const sy = ((e.clientY - box.top) / box.height) * 400 - 240;
      if (Math.abs(sx) > 260 || sy < -230 || sy > 110) return leave();
      target = 1;
      let best = 0, bestD = Infinity;
      Z.forEach((z, i) => {
        const cy = P(0, 0, z + T / 2 + 16 * i)[1];
        const dd = Math.abs(sy - cy);
        if (dd < bestD) {
          best = i;
          bestD = dd;
        }
      });
      if (best !== pick) {
        pick = best;
        setLayer(best);
      }
      if (reduced) frame();
    };
    const leave = () => {
      target = 0;
      if (pick !== -1) {
        pick = -1;
        setLayer(-1);
      }
      if (reduced) frame();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    if (reduced) {
      t = REST + 1;
      frame();
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        el.replaceChildren();
      };
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        prev = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);

    const tick = (now: number) => {
      const dt = prev ? Math.min(now - prev, 50) : 0;
      prev = now;
      t += dt;
      // the gaps follow the pointer on a spring (k 100, c 18, m 1)
      const s = dt / 1000;
      vel += (100 * (target - open) - 18 * vel) * s;
      open += vel * s;
      frame();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.replaceChildren();
    };
  }, []);

  return (
    <div className="relative">
      <div ref={host} className="assembly" role="img" aria-label="A backend drawn as three stacked layers, edge, services and data, with a request dropping through them" />
      <p aria-hidden className="mono-label mt-1 flex justify-between gap-4 sm:hidden">
        <span>Edge → services → data</span>
        <span className="text-ink">{layer < 0 ? "" : LAYERS[layer]}</span>
      </p>
    </div>
  );
}
