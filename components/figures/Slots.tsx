"use client";

import { Box, Label, Stage, clamp, ease, iso, lerp, unproject, type Frame } from "./kit";

/*
 * Hot keys on a Redis cluster. Sixteen slots, each a pillar as tall as its load.
 * Traffic piles onto the slots near the pointer until they run hot, then the load
 * is spread back out across the cluster, and it starts again wherever you point.
 */

const P = iso(205, 171, 1.2);
const G = 4, PITCH = 40, CELL = 28, O = -((G - 1) * PITCH) / 2 - CELL / 2, LOOP = 5.4;
const NOISE = [0.12, 0.2, 0.15, 0.1, 0.18, 0.09, 0.16, 0.13, 0.1, 0.17, 0.11, 0.19, 0.14, 0.1, 0.16, 0.12];

function loads(f: Frame) {
  const [hx, hy] = unproject(P, f.x, f.y);
  const u = (f.t % LOOP) / LOOP;
  const build = ease(u / 0.4);
  const spread = ease((u - 0.5) / 0.16);
  const raw = NOISE.map((nz, k) => {
    const cx = O + (k % G) * PITCH + CELL / 2, cy = O + Math.floor(k / G) * PITCH + CELL / 2;
    const dist2 = (cx - hx) ** 2 + (cy - hy) ** 2;
    return nz + 0.78 * build * Math.exp(-dist2 / (2 * 26 * 26));
  });
  const mean = raw.reduce((a, b) => a + b, 0) / raw.length;
  const out = raw.map((v, k) => clamp(lerp(v, mean + (NOISE[k] - 0.14) * 0.6, spread), 0.05, 0.98));
  return { out, spread };
}

function draw(f: Frame) {
  const { out } = loads(f);
  const order = out.map((v, k) => k).sort((a, b) => (a % G) + Math.floor(a / G) - ((b % G) + Math.floor(b / G)));
  return (
    <>
      <Box P={P} x={O - 12} y={O - 12} w={(G - 1) * PITCH + CELL + 24} dp={(G - 1) * PITCH + CELL + 24} h={0} />
      {order.map((k) => {
        const hot = out[k] > 0.5;
        return (
          <Box
            key={k}
            P={P}
            x={O + (k % G) * PITCH}
            y={O + Math.floor(k / G) * PITCH}
            w={CELL}
            dp={CELL}
            h={8 + out[k] * 92}
            tone={hot ? "o" : undefined}
            top={hot ? "ot" : undefined}
          />
        );
      })}
      <Label P={P} x={O - 8} y={O + (G - 1) * PITCH + CELL + 22}>
        16 slots · 4 nodes
      </Label>
    </>
  );
}

export default function Slots({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5 + 0.22 * Math.sin(t * 0.21), 0.6 + 0.14 * Math.cos(t * 0.27)]}
      still={2.1}
      read={(f) => {
        const { out, spread } = loads(f);
        const top = out.reduce((m, v, k) => (v > out[m] ? k : m), 0);
        const pct = Math.round(out[top] * 100);
        return spread < 0.5 ? `slot ${top + 1} · ${pct}%` : `spread · ${pct}%`;
      }}
    />
  );
}
