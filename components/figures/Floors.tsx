"use client";

import { Box, Label, Stage, clamp, d, iso, type Frame } from "./kit";

/*
 * A career as a building: one floor a role, the first job at the bottom. A lift
 * runs up the side to the floor in view as the page scrolls, or to the one the
 * pointer's height picks.
 */

const P = iso(196, 230);
const HALF = 50, SPAN = 32, SLAB = 5;
const CAR = { x: HALF + 8, y: -22, w: 14, dp: 22, h: 18 };

export default function Floors({
  label,
  onRead,
  names,
  floor,
}: {
  label: string;
  onRead?: (s: string) => void;
  /** Bottom floor first. */
  names: string[];
  /** The floor to send the lift to; when unset it wanders. */
  floor?: number;
}) {
  const N = names.length;
  const toY = (k: number) => 0.88 - (k / (N - 1)) * 0.76;
  const level = (f: Frame) => clamp((0.88 - f.y) / 0.76) * (N - 1);

  const draw = (f: Frame) => {
    const lvl = level(f);
    const here = Math.round(lvl);
    const top = (N - 1) * SPAN + SLAB;
    return (
      <>
        {[-HALF, HALF].map((x) =>
          [-HALF, HALF].map((y) => <path key={x + "," + y} d={d([P(x, y, 0), P(x, y, top)], false)} className="d" />),
        )}
        {names.map((name, k) => (
          <g key={k} transform={k === here ? `translate(0 ${-3 * clamp(1 - Math.abs(lvl - k) * 2)})` : undefined}>
            <Box P={P} x={-HALF} y={-HALF} z={k * SPAN} w={2 * HALF} dp={2 * HALF} h={SLAB} tone={k === here ? "o" : undefined} top={k === here ? "ot" : undefined}>
              <Label P={P} x={-HALF + 8} y={HALF - 9} z={k * SPAN + SLAB} className={k === here ? "to" : "t"}>
                {name}
              </Label>
            </Box>
          </g>
        ))}
        {[CAR.y - 3, CAR.y + CAR.dp + 3].map((y) => (
          <path key={y} d={d([P(CAR.x + CAR.w / 2, y, 0), P(CAR.x + CAR.w / 2, y, top + 22)], false)} className="c" />
        ))}
        <Box P={P} x={CAR.x} y={CAR.y} z={lvl * SPAN + SLAB} w={CAR.w} dp={CAR.dp} h={CAR.h} tone="o" top="ot" />
      </>
    );
  };

  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5, toY(floor ?? Math.floor(t / 1.8) % N)]}
      still={0}
      read={(f) => {
        const k = Math.round(level(f));
        return `floor ${k + 1} · ${names[k]}`;
      }}
    />
  );
}
