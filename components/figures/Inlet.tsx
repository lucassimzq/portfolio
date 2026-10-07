"use client";

import { Box, Label, Stage, clamp, d, iso, lerp, quad, type Frame } from "./kit";

/*
 * InletDB taken apart: the window, the result grid, and the query bar, each a layer.
 * A query types itself, runs, and its rows come back in one round trip. Moving
 * across pulls the layers apart.
 */

const P = iso(200, 216, 0.96);
const HX = 85, HY = 56, BAR = { y0: -HY, y1: -HY + 24 };
const SQL = "select * from orders";
const LOOP = 4.2;
/** One character of the query bar's mono type, in screen units. */
const CH = 6.6;
const COLS = [-38, 4, 46];
const ROWS = [-14, 6, 26, 46];

function state(f: Frame) {
  const u = (f.t % LOOP) / LOOP;
  const typed = Math.floor(clamp(u / 0.42) * SQL.length);
  const back = clamp((u - 0.5) / 0.28) * ROWS.length;
  return { u, typed, back };
}

function draw(f: Frame) {
  const gap = lerp(14, 38, clamp((f.x - 0.1) / 0.8));
  const s = state(f);
  const z1 = 6 + gap, z2 = z1 + gap;
  const caret = f.still || Math.floor(f.t * 2.5) % 2 === 0;
  const lit = (i: number) => s.back > i;

  return (
    <>
      {[[-HX, -HY], [HX, -HY], [-HX, HY], [HX, HY]].map(([x, y]) => (
        <path key={x + "," + y} d={d([P(x, y, 0), P(x, y, z2)], false)} className="d" />
      ))}

      {/* the window */}
      <Box P={P} x={-HX} y={-HY} w={2 * HX} dp={2 * HY} h={6}>
        {[0, 1, 2].map((i) => {
          const [cx, cy] = P(-HX + 10 + i * 8, -HY + 8, 6);
          return <ellipse key={i} cx={cx} cy={cy} rx={2.6 * P.k} ry={1.6 * P.k} className="c" />;
        })}
        <path d={d([P(-HX + 40, -HY, 6), P(-HX + 40, HY, 6)], false)} className="c" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={d([P(-HX + 8, -HY + 22 + i * 12, 6), P(-HX + 30 - (i % 2) * 8, -HY + 22 + i * 12, 6)], false)} className="c" />
        ))}
      </Box>

      {/* the grid, where the rows land */}
      <path d={quad(P, -HX + 44, -HY + 30, 2 * HX - 50, 2 * HY - 36, z1)} className="f" />
      {ROWS.map((y, i) => lit(i) && <path key={i} d={quad(P, -HX + 44, y - 4, 2 * HX - 50, 18, z1)} className="ot" />)}
      <path d={quad(P, -HX + 44, -HY + 30, 2 * HX - 50, 2 * HY - 36, z1)} className="s" />
      {COLS.map((x) => (
        <path key={x} d={d([P(x, -HY + 30, z1), P(x, HY - 6, z1)], false)} className="c" />
      ))}
      {ROWS.map((y) => (
        <path key={y} d={d([P(-HX + 44, y + 14, z1), P(HX - 6, y + 14, z1)], false)} className="c" />
      ))}

      {/* the query bar */}
      <Box P={P} x={-HX} y={BAR.y0} z={z2} w={2 * HX} dp={BAR.y1 - BAR.y0} h={5} top={s.u > 0.42 && s.u < 0.55 ? "ot" : undefined}>
        <Label P={P} x={-HX + 10} y={BAR.y0 + 15} z={z2 + 5} className="tq">
          {SQL.slice(0, s.typed)}
        </Label>
      </Box>
      {caret && (
        <path
          d={d([P(-HX + 11 + (s.typed * CH) / P.k, BAR.y0 + 4, z2 + 5), P(-HX + 11 + (s.typed * CH) / P.k, BAR.y0 + 19, z2 + 5)], false)}
          className="o"
        />
      )}
    </>
  );
}

export default function Inlet({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5 + 0.4 * Math.sin(t * 0.45), 0.5]}
      still={3.6}
      read={(f) => {
        const s = state(f);
        if (s.u < 0.42) return "typing";
        if (s.u < 0.5) return "⌘ ↵";
        return `1 round trip · ${Math.min(ROWS.length, Math.ceil(s.back))} rows`;
      }}
    />
  );
}
