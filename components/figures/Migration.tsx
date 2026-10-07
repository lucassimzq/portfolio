"use client";

import { Box, Label, Stage, clamp, d, iso, type Frame } from "./kit";

/*
 * Twenty million rows, moved while the app kept reading. Two trays, old and new;
 * the rows go across one slab at a time, and the app above keeps sending reads,
 * to the old tray until half the rows have moved, then to the new one.
 */

const P = iso(205, 195, 0.98);
const SLABS = 8, SH = 5, GAP = 2.5, TRAY = 8;
const OLD = -125, NEW = 35, SIZE = 90, INSET = 12, Y = -45;
const APP = { x: -16, y: -16, z: 128, s: 32 };

const progress = (f: Frame) => clamp((f.x - 0.15) / 0.7);
const slabZ = (i: number) => TRAY + i * (SH + GAP);

function Slab({ x, z, tone }: { x: number; z: number; tone?: "o" }) {
  return <Box P={P} x={x + INSET} y={Y + INSET} z={z} w={SIZE - 2 * INSET} dp={SIZE - 2 * INSET} h={SH} tone={tone} top={tone ? "ot" : undefined} />;
}

function draw(f: Frame) {
  const p = progress(f);
  const moved = Math.min(SLABS, Math.floor(p * SLABS + 1e-6));
  const fly = moved < SLABS ? p * SLABS - moved : 0;
  const flying = fly > 0.02;
  const oldCount = SLABS - moved - (flying ? 1 : 0);
  const onNew = p >= 0.5;

  // the slab in the air: up out of the old stack, over, down onto the new one
  const fx = OLD + (NEW - OLD) * fly;
  const fz = slabZ(oldCount) + (slabZ(moved) - slabZ(oldCount)) * fly + 45 * Math.sin(Math.PI * fly);
  const air = flying && <Slab x={fx} z={fz} tone="o" />;

  // reads from the app, one every 0.45 s, falling to whichever tray serves
  const target = onNew ? NEW : OLD;
  const lead = (f.t % 0.45) / 0.45;
  const [ax, ay] = P(APP.x + APP.s / 2, APP.y + APP.s / 2, APP.z);
  const land = P(target + SIZE / 2, Y + SIZE / 2, slabZ(onNew ? moved : oldCount) + 2);
  const dot: [number, number] = [ax + (land[0] - ax) * lead, ay + (land[1] - ay) * lead];
  const other = P((onNew ? OLD : NEW) + SIZE / 2, Y + SIZE / 2, TRAY);

  return (
    <>
      <path d={d([[ax, ay], other], false)} className="d" />
      <Box P={P} x={OLD} y={Y} w={SIZE} dp={SIZE} h={TRAY} />
      {Array.from({ length: oldCount }, (_, i) => (
        <Slab key={"o" + i} x={OLD} z={slabZ(i)} />
      ))}
      {fly < 0.5 && air}
      <Box P={P} x={NEW} y={Y} w={SIZE} dp={SIZE} h={TRAY} />
      {Array.from({ length: moved }, (_, i) => (
        <Slab key={"n" + i} x={NEW} z={slabZ(i)} />
      ))}
      {fly >= 0.5 && air}
      <Label P={P} x={OLD + 4} y={Y + SIZE + 12}>
        old
      </Label>
      <Label P={P} x={NEW + 4} y={Y + SIZE + 12}>
        new
      </Label>
      <path d={d([[ax, ay], land], false)} className="od" />
      <Box P={P} x={APP.x} y={APP.y} z={APP.z} w={APP.s} dp={APP.s} h={10} top="ot" />
      <Label P={P} x={APP.x + 3} y={APP.y + APP.s + 3} z={APP.z} plane="wall" className="t">
        app
      </Label>
      {!f.still && <circle cx={dot[0]} cy={dot[1]} r={2.6} className="of" />}
    </>
  );
}

export default function Migration({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5 - 0.38 * Math.cos(t * 0.3), 0.5]}
      still={6}
      read={(f) => `${(progress(f) * 20).toFixed(1)}M · live`}
    />
  );
}
