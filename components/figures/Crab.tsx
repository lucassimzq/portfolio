"use client";

import { Box, Label, Stage, clamp, d, iso, quad, type Frame } from "./kit";

/*
 * Claude Usage Mod: a terminal with its context meter, and the pixel crab that sits
 * on it and worries as the meter fills. The pointer's height is the usage.
 */

const P = iso(200, 168, 1.38);
const HX = 92, HY = 62, TH = 10, SEG = 10;
const PX = 4.4 * 1.38;
const BODY = [
  "XX.........XX",
  "X.X.......X.X",
  ".XX.......XX.",
  "..X.XXXXX.X..",
  "..XXXXXXXXX..",
  "...XEXXXEX...",
  "...XXXXXXX...",
  "..X.X...X.X..",
  ".X..X...X..X.",
];
/** The claws shut: the top three rows swap for these. */
const SNAP = ["..X.......X..", ".XX.......XX.", "..X.......X.."];

const usage = (f: Frame) => Math.round(8 + 90 * clamp((0.85 - f.y) / 0.7));
const mood = (pct: number) => (pct < 50 ? "calm" : pct < 80 ? "uneasy" : "sweating");

function draw(f: Frame) {
  const pct = usage(f);
  const m = mood(pct);
  const lit = Math.round((pct / 100) * SEG);
  const snap = !f.still && Math.floor(f.t / (m === "sweating" ? 0.22 : m === "uneasy" ? 0.6 : 1.4)) % 2 === 1;
  const shake = m === "sweating" && !f.still ? Math.sin(f.t * 40) * 0.8 : 0;
  const bob = f.still ? 0 : Math.abs(Math.sin(f.t * (m === "calm" ? 2 : 4))) * -2;
  const rows = snap ? [...SNAP, ...BODY.slice(3)] : BODY;
  const [bx, by] = P(-6, 6, TH);
  const left = bx - (13 * PX) / 2 + shake, topY = by - 9 * PX - 4 + bob;
  const look = m === "calm" ? 0 : m === "uneasy" ? 1 : -1;

  return (
    <>
      <Box P={P} x={-HX} y={-HY} w={2 * HX} dp={2 * HY} h={TH}>
        <path d={d([P(-HX, -HY + 14, TH), P(HX, -HY + 14, TH)], false)} className="c" />
        {[0, 1, 2].map((i) => {
          const [cx, cy] = P(-HX + 9 + i * 8, -HY + 7, TH);
          return <ellipse key={i} cx={cx} cy={cy} rx={2.4} ry={1.4} className="c" />;
        })}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={d([P(-HX + 10, -HY + 26 + i * 10, TH), P(-HX + 40 + ((i * 37) % 60), -HY + 26 + i * 10, TH)], false)} className="c" />
        ))}
        {Array.from({ length: SEG }, (_, i) => (
          <path key={i} d={quad(P, -HX + 12 + i * 16.8, HY - 20, 13, 9, TH)} className={i < lit ? (pct >= 80 ? "of" : "ot") : "c"} />
        ))}
        <Label P={P} x={-HX + 12} y={HY - 4} z={TH}>
          ctx
        </Label>
      </Box>

      <g transform={`translate(${left.toFixed(1)} ${topY.toFixed(1)})`}>
        <ellipse cx={(13 * PX) / 2} cy={9 * PX + 5} rx={36} ry={8} className="g" />
        {rows.map((row, r) =>
          [...row].map((c, k) =>
            c === "." ? null : (
              <rect key={r + "-" + k} x={k * PX} y={r * PX} width={PX + 0.4} height={PX + 0.4} className={c === "E" ? "f" : "of"} />
            ),
          ),
        )}
        {[4, 8].map((k) => (
          <rect key={k} x={k * PX + PX * 0.3 + look * PX * 0.2} y={5 * PX + PX * 0.2 - (m === "sweating" ? PX * 0.1 : 0)} width={PX * 0.45} height={PX * 0.6} className="k" />
        ))}
        {m !== "calm" && (
          <path
            d={`M${13 * PX + 4} ${PX * 2.4}c-3.3 5 -4.2 7.2 -4.2 8.8a4.2 4.2 0 0 0 8.4 0c0 -1.6 -0.9 -3.8 -4.2 -8.8z`}
            className={m === "sweating" ? "s" : "c"}
            opacity={m === "sweating" ? 1 : 0.7}
          />
        )}
      </g>
    </>
  );
}

export default function Crab({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5, 0.5 + 0.36 * Math.sin(t * 0.42)]}
      still={0}
      read={(f) => {
        const pct = usage(f);
        return `ctx ${pct}% · ${mood(pct)}`;
      }}
    />
  );
}
