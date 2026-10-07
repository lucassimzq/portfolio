"use client";

import { Can, Label, Stage, d, iso, quad, seeded, unproject, clamp, type Frame } from "./kit";

/*
 * Semantic search, seen from above. Fifty profiles lie scattered by meaning; the
 * query is the orange marker under the pointer, and the three nearest profiles
 * stand up as tall as they are similar.
 */

const P = iso(205, 164, 1.03);
const F = 100;
const DOTS = (() => {
  const r = seeded(7);
  return Array.from({ length: 50 }, () => ({ x: (r() * 2 - 1) * (F - 8), y: (r() * 2 - 1) * (F - 8) }));
})();

function search(f: Frame) {
  const [wx, wy] = unproject(P, f.x, f.y);
  const q = { x: clamp(wx, -F + 6, F - 6), y: clamp(wy, -F + 6, F - 6) };
  const ranked = DOTS.map((p, i) => ({ i, dist: Math.hypot(p.x - q.x, p.y - q.y) })).sort((a, b) => a.dist - b.dist);
  const top = ranked.slice(0, 3).map((r) => ({ ...r, sim: clamp(1 - r.dist / 220, 0, 0.99) }));
  return { q, top };
}

function draw(f: Frame) {
  const { q, top } = search(f);
  const picked = new Set(top.map((r) => r.i));
  const pulse = f.still ? 0.5 : (f.t % 1.6) / 1.6;
  const [qx, qy] = P(q.x, q.y);
  const stand = [...top.map((r) => ({ kind: "hit" as const, ...r, p: DOTS[r.i] })), { kind: "q" as const, i: -1, dist: 0, sim: 1, p: q }].sort(
    (a, b) => a.p.x + a.p.y - (b.p.x + b.p.y),
  );

  return (
    <>
      <path d={quad(P, -F, -F, 2 * F, 2 * F)} className="f" />
      <path d={quad(P, -F, -F, 2 * F, 2 * F)} className="s" />
      <path d={d([P(-F, 0), P(F, 0)], false) + d([P(0, -F), P(0, F)], false)} className="d" />
      {DOTS.map((p, i) => {
        if (picked.has(i)) return null;
        const [x, y] = P(p.x, p.y);
        return <ellipse key={i} cx={x} cy={y} rx={2.6 * P.k} ry={1.5 * P.k} className="k" />;
      })}
      <ellipse cx={qx} cy={qy} rx={(10 + 26 * pulse) * 1.22 * P.k} ry={(10 + 26 * pulse) * 0.71 * P.k} className="o" opacity={1 - pulse} />
      {top.map((r) => (
        <path key={"l" + r.i} d={d([P(q.x, q.y), P(DOTS[r.i].x, DOTS[r.i].y)], false)} className="od" />
      ))}
      {stand.map((s) =>
        s.kind === "q" ? (
          <Can key="q" P={P} x={q.x} y={q.y} r={5.5} h={6} tone="o" fill="of" />
        ) : (
          <Can key={s.i} P={P} x={s.p.x} y={s.p.y} r={4.2} h={10 + 72 * s.sim * s.sim} fill="ot" />
        ),
      )}
      <Label P={P} x={-F + 4} y={F + 12}>
        50 profiles · pgvector
      </Label>
    </>
  );
}

export default function Rag({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5 + 0.3 * Math.sin(t * 0.43), 0.52 + 0.2 * Math.sin(t * 0.31 + 2)]}
      still={4}
      read={(f) => `top 3 · ${search(f).top[0].sim.toFixed(2)}`}
    />
  );
}
