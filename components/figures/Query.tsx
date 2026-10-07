"use client";

import { Box, Label, Stage, clamp, d, ease, iso, quad, type Frame } from "./kit";

/*
 * Heavy queries, before and after. A table of eight rows, and above it an index:
 * a root, two branches, four leaves. On the left the index is barely there and a
 * cursor reads every row in turn; on the right the lookup drops root → branch →
 * leaf → row in three hops.
 */

const P = iso(207, 207, 1.08);
const X0 = -100, RW = 25, Y0 = -30, DP = 60, TH = 14, ROWS = 8, S = 12;
const NODES = [
  { x: 0, z: 132 },
  { x: -50, z: 94 },
  { x: 50, z: 94 },
  { x: -75, z: 56 },
  { x: -25, z: 56 },
  { x: 25, z: 56 },
  { x: 75, z: 56 },
];
const PARENT = [-1, 0, 0, 1, 1, 2, 2];
const LOOKUP = 1.9;

const mode = (f: Frame) => ease((f.x - 0.3) / 0.4);
const scanRow = (f: Frame) => Math.floor(f.t * 2.4) % ROWS;

function draw(f: Frame) {
  const m = mode(f);
  const scan = scanRow(f);
  const key = Math.floor(f.t / LOOKUP);
  const target = (key * 5 + 3) % ROWS;
  const hop = clamp(((f.t % LOOKUP) / LOOKUP) * 4.2);
  const leaf = 3 + Math.floor(target / 2);
  const route = [0, PARENT[leaf], leaf];
  const rowAt = (i: number) => quad(P, X0 + RW * i, Y0, RW, DP, TH);
  const mid = (x: number, z: number) => P(x, 0, z);

  return (
    <>
      <Box P={P} x={X0} y={Y0} w={RW * ROWS} dp={DP} h={TH}>
        {Array.from({ length: ROWS }, (_, i) => (
          <g key={i}>
            {i < scan && <path d={rowAt(i)} className="ot" opacity={(1 - m) * 0.55} />}
            {i === scan && <path d={rowAt(i)} className="of" opacity={(1 - m) * 0.9} />}
            {i === target && <path d={rowAt(i)} className="of" opacity={m * clamp(hop - 3) * 0.9} />}
            {i > 0 && <path d={d([P(X0 + RW * i, Y0, TH), P(X0 + RW * i, Y0 + DP, TH)], false)} className="c" />}
          </g>
        ))}
      </Box>
      <Label P={P} x={X0} y={Y0 + DP + 12}>
        orders · 8 rows
      </Label>

      <g opacity={0.22 + 0.78 * m}>
        {NODES.map((nd, i) =>
          i === 0 ? null : (
            <path
              key={"e" + i}
              d={d([mid(NODES[PARENT[i]].x, NODES[PARENT[i]].z), mid(nd.x, nd.z + S)], false)}
              className={route.includes(i) && hop > route.indexOf(i) ? "o" : "c"}
            />
          ),
        )}
        {NODES.map((nd, i) => (
          <Box key={i} P={P} x={nd.x - S / 2} y={-S / 2} z={nd.z} w={S} dp={S} h={S} tone={route.includes(i) && hop > route.indexOf(i) ? "o" : undefined} />
        ))}
        <path
          d={d([mid(NODES[leaf].x, NODES[leaf].z), mid(X0 + RW * (target + 0.5), TH)], false)}
          className={hop > 3 ? "od" : "d"}
        />
      </g>
    </>
  );
}

export default function Query({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5 - 0.46 * Math.cos(t * 0.32), 0.5]}
      still={9}
      read={(f) => (mode(f) < 0.5 ? `scan · row ${scanRow(f) + 1} of 8` : "index · 3 hops")}
    />
  );
}
