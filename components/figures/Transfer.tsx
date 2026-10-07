"use client";

import { Box, Can, Label, Stage, clamp, d, ease, iso, type Frame } from "./kit";

/*
 * A transfer, step by step. The coin hops from the balance check to the debit, the
 * credit and the confirmation, and each step sends a message up the socket the
 * moment it lands. Moving across scrubs through the steps.
 */

const P = iso(196, 196, 1.04);
const STEPS = ["balance", "debit", "credit", "confirm"];
const GAP = 64, PL = 44, H = 8, WIRE = 80;
const cx = (i: number) => -GAP * 1.5 + GAP * i;

const at = (f: Frame) => clamp((f.x - 0.12) / 0.76) * (STEPS.length - 1);

function draw(f: Frame) {
  const s = at(f);
  const k = Math.floor(s + 1e-6), fr = s - k;
  const here = Math.round(s);
  const x = cx(k) + GAP * ease(fr);
  const z = H + 34 * Math.sin(Math.PI * fr);
  // once the coin settles, its step streams messages up the socket
  const settled = Math.abs(s - here) < 0.08;
  const rise = f.still ? 0.6 : (f.t % 0.9) / 0.9;

  return (
    <>
      <path d={d([P(cx(0) - 14, 0, WIRE), P(cx(3) + 30, 0, WIRE)], false)} className="d" />
      <Label P={P} x={cx(3) + 12} y={0} z={WIRE + 5} plane="wall">
        websocket
      </Label>
      {STEPS.map((name, i) => {
        const done = i < here || (i === here && settled);
        const [tx, ty] = P(cx(i), 0, H);
        return (
          <g key={name}>
            <path d={d([P(cx(i), 0, H), P(cx(i), 0, WIRE)], false)} className={i === here ? "od" : "d"} />
            <Box P={P} x={cx(i) - PL / 2} y={-PL / 2} w={PL} dp={PL} h={H} top={i === here ? "ot" : undefined}>
              {done && <path d={`M${tx - 7} ${ty}l4.5 3.5l9 -7`} className={i === here ? "o" : "s"} />}
            </Box>
            <Label P={P} x={cx(i) - PL / 2 + 2} y={PL / 2 + 12} className={i === here ? "to" : "t"}>
              {name}
            </Label>
          </g>
        );
      })}
      {settled && (() => {
        const [px, py] = P(cx(here), 0, H + 6 + (WIRE - H - 6) * rise);
        return <circle cx={px} cy={py} r={2.6} className="of" opacity={1 - rise * rise} />;
      })()}
      <Can P={P} x={x} y={0} z={z} r={9} h={4} tone="o" fill="ot" />
    </>
  );
}

export default function Transfer({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => {
        // a step every 1.25 s, a short hop then a rest, and a pause on confirm before the next transfer
        const tau = (t * 0.8) % 5;
        const s = clamp(Math.floor(tau) - 1 + ease(clamp((tau % 1) / 0.45)), 0, 3);
        return [0.12 + 0.76 * (s / 3), 0.5];
      }}
      still={5}
      read={(f) => {
        const k = Math.round(at(f));
        return `${k + 1}/4 · ${STEPS[k]}`;
      }}
    />
  );
}
