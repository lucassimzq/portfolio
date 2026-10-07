"use client";

import { Box, Can, Stage, clamp, d, ease, iso, type Frame } from "./kit";

/*
 * Zero to launch: twelve steps, one a month, and a team of six climbing them in
 * single file behind the lead. The flag at the top goes up when they get there.
 */

const P = iso(192, 220, 0.96);
const N = 12, STEP = 17, RISE = 7, HALF = 26, BASE = 8, TEAM = 6;
const front = (i: number) => 92 - STEP * i;
const height = (i: number) => BASE + RISE * i;

const lead = (f: Frame) => clamp((f.x - 0.1) / 0.8) * (N - 1);
const phase = (k: number) => (k < 2 ? "architecture" : k < 5 ? "infrastructure" : k < N - 1 ? "building" : "launch");

function draw(f: Frame) {
  const s = lead(f);
  const here = Math.round(s);
  const top = s >= N - 1.02;

  const steps = [];
  for (let i = N - 1; i >= 0; i--) {
    steps.push(
      <Box key={i} P={P} x={-HALF} y={front(i) - STEP} w={HALF * 2} dp={STEP} h={height(i)} top={i === here ? "ot" : undefined} />,
    );
  }

  const team = Array.from({ length: TEAM }, (_, j) => {
    const sj = clamp(s - j * 0.62, 0, N - 1);
    const k = Math.floor(sj), fr = sj - k;
    const y = front(k) - STEP / 2 - STEP * fr;
    const z = height(k) + RISE * ease(fr) + 9 * Math.sin(Math.PI * fr);
    return { j, x: j % 2 ? 8 : -8, y, z };
  }).sort((a, b) => a.y - b.y || a.x - b.x);

  const [px, py] = P(0, front(N - 1) - STEP / 2, height(N - 1));
  const k = P.k, pole = 46 * k, lift = top ? 0 : 22 * k;
  const wave = f.still ? 0 : Math.sin(f.t * 5) * 2;
  const flagTop = py - pole + lift;

  return (
    <>
      {steps}
      <path d={`M${px} ${py}V${py - pole}`} className="s" />
      <path
        d={d([
          [px, flagTop],
          [px + 22 * k, flagTop + 5 * k + wave],
          [px, flagTop + 11 * k],
        ])}
        className={top ? "of" : "f"}
      />
      <path d={d([[px, flagTop], [px + 22 * k, flagTop + 5 * k + wave], [px, flagTop + 11 * k]])} className={top ? "o" : "s"} />
      {team.map((p) => (
        <Can key={p.j} P={P} x={p.x} y={p.y} z={p.z} r={4.2} h={11} tone={p.j === 0 ? "o" : undefined} fill={p.j === 0 ? "of" : undefined} />
      ))}
    </>
  );
}

export default function Ship({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5 - 0.42 * Math.cos(t * 0.28), 0.5]}
      still={11}
      read={(f) => {
        const k = Math.round(lead(f));
        return `month ${k + 1} · ${phase(k)}`;
      }}
    />
  );
}
