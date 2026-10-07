"use client";

import { Box, Label, Stage, clamp, d, iso, lerp, type Frame } from "./kit";

/*
 * The onboarding race. Two sign-ups for the same person arrive together. With the
 * Redis lock, the first one through takes it, makes the account, and lets go; the
 * second finds the account there and makes nothing. Point at it to take the lock
 * away: both get through, and there are two accounts.
 */

const P = iso(218, 175, 1.18);
const LANE = 26, CUBE = 14, GATE = { x: -8, w: 16, h: 36 }, END = 74, LOOP = 4.6;
const lanes = [-LANE, LANE];

function scene(f: Frame) {
  const u = (f.t % LOOP) / LOOP;
  const free = f.over;
  const seg = (a: number, b: number) => clamp((u - a) / (b - a));
  if (free) {
    const x = u < 0.25 ? lerp(-150, -24, seg(0, 0.25)) : lerp(-24, END, seg(0.25, 0.45));
    const gone = 1 - seg(0.47, 0.57);
    return { u, free, ax: x, bx: x + 4, held: "", cards: u >= 0.45 ? 2 : 0, aFade: gone, bFade: gone };
  }
  const ax = u < 0.25 ? lerp(-150, -24, seg(0, 0.25)) : lerp(-24, END, seg(0.25, 0.45));
  const bx = u < 0.27 ? lerp(-146, -26, seg(0, 0.27)) : u < 0.49 ? -26 : lerp(-26, END, seg(0.49, 0.69));
  const held = u >= 0.25 && u < 0.45 ? "A" : u >= 0.49 && u < 0.69 ? "B" : "";
  return { u, free, ax, bx, held, cards: u >= 0.45 ? 1 : 0, aFade: 1 - seg(0.47, 0.57), bFade: 1 - seg(0.71, 0.81) };
}

function Req({ x, lane, name, on, fade = 1 }: { x: number; lane: number; name: string; on: boolean; fade?: number }) {
  if (fade <= 0) return null;
  return (
    <g opacity={fade}>
      <Box P={P} x={x - CUBE / 2} y={lane - CUBE / 2} w={CUBE} dp={CUBE} h={CUBE} tone={on ? "o" : undefined} top={on ? "ot" : undefined} />
      <Label P={P} x={x - 3} y={lane + 3} z={CUBE} className={on ? "to" : "t"}>
        {name}
      </Label>
    </g>
  );
}

function draw(f: Frame) {
  const s = scene(f);
  const behind = (x: number) => x < GATE.x;
  const [lx, ly] = P(GATE.x + GATE.w / 2, -6, GATE.h + 9);
  const k = P.k;
  const locked = !s.free;
  const lit = s.held !== "";

  const a = <Req key="a" x={s.ax} lane={lanes[0]} name="A" on={s.held === "A" || (s.free && s.u > 0.25)} fade={s.aFade} />;
  const b = <Req key="b" x={s.bx} lane={lanes[1]} name="A'" on={s.held === "B" || (s.free && s.u > 0.25)} fade={s.bFade} />;

  return (
    <>
      {lanes.map((y) => (
        <path key={y} d={d([P(-170, y), P(END + 50, y)], false)} className="d" />
      ))}
      <Box P={P} x={END - 18} y={-LANE - 22} w={56} dp={2 * LANE + 44} h={4} />
      <Label P={P} x={END - 14} y={LANE + 34}>
        accounts
      </Label>
      {behind(s.ax) && a}
      {behind(s.bx) && b}
      <Box P={P} x={GATE.x} y={-LANE - 20} w={GATE.w} dp={2 * LANE + 40} h={GATE.h} top={lit ? "ot" : undefined} />
      {/* the lock on the gate: shut and orange while held, hanging open when there's none */}
      <path
        d={`M${(lx - 6 * k).toFixed(1)} ${ly.toFixed(1)}v${-6 * k}a${6 * k} ${6 * k} 0 0 1 ${12 * k} 0v${(locked ? 6 : -4) * k}`}
        className={lit ? "o" : locked ? "s" : "d"}
        transform={locked ? undefined : `translate(0 ${-6 * k})`}
      />
      <rect x={lx - 9 * k} y={ly} width={18 * k} height={13 * k} rx={2.5} className={lit ? "of" : "f"} />
      <rect x={lx - 9 * k} y={ly} width={18 * k} height={13 * k} rx={2.5} className={lit ? "o" : locked ? "s" : "d"} />
      {s.cards >= 1 && <Box P={P} x={END - 12} y={lanes[0] - 12} z={4} w={30} dp={24} h={5} top="ot" />}
      {s.cards >= 2 && <Box P={P} x={END - 12} y={lanes[1] - 12} z={4} w={30} dp={24} h={5} tone="o" top="ot" />}
      {!behind(s.ax) && a}
      {!behind(s.bx) && b}
    </>
  );
}

export default function Race({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      still={1.6}
      read={(f) => {
        const s = scene(f);
        if (s.free) return s.cards ? "2 accounts" : "no lock";
        if (s.held === "A") return "A has the lock";
        if (s.held === "B") return "A' · exists";
        return s.cards ? "1 account" : "two at once";
      }}
    />
  );
}
