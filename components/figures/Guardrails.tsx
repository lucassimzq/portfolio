"use client";

import { Box, Can, Label, Stage, clamp, d, iso, quad, unproject, type Frame } from "./kit";

/*
 * An agent with boundaries. Inside the fence are the tools it may use; outside are
 * the ones it may not. The agent follows the pointer, and when the pointer strays
 * past the fence it stops at the rail, and the rail it leans on lights up.
 */

const P = iso(200, 161, 1.04);
const R = 62, PLATE = 6, ME = 9, POST = 26;
const IN = [
  { name: "read", x: -50, y: -46 },
  { name: "query", x: 10, y: -46 },
  { name: "search", x: -46, y: 14 },
];
const OUT = [
  { name: "drop", x: 68, y: -52 },
  { name: "delete", x: -50, y: 68 },
  { name: "prod", x: 68, y: 26 },
];
const TILE = 30;

function agent(f: Frame) {
  const [wx, wy] = unproject(P, f.x, f.y, PLATE);
  const lim = R - ME - 4;
  const x = clamp(wx, -lim, lim), y = clamp(wy, -lim, lim);
  const hit = { px: wx > lim + 3, nx: wx < -lim - 3, py: wy > lim + 3, ny: wy < -lim - 3 };
  const near = (list: typeof IN, ax: number, ay: number) =>
    list.find((t) => Math.abs(ax - (t.x + TILE / 2)) < TILE / 2 + 4 && Math.abs(ay - (t.y + TILE / 2)) < TILE / 2 + 4);
  const blocked = hit.px || hit.nx || hit.py || hit.ny;
  return { x, y, hit, blocked, inside: near(IN, x, y), outside: blocked ? near(OUT, wx, wy) : undefined };
}

function Rail({ a, b, lit }: { a: [number, number]; b: [number, number]; lit: boolean }) {
  return (
    <>
      {[12, 22].map((z) => (
        <path key={z} d={d([P(a[0], a[1], PLATE + z), P(b[0], b[1], PLATE + z)], false)} className={lit ? "o" : "s"} />
      ))}
    </>
  );
}

function Posts({ at }: { at: [number, number][] }) {
  return (
    <>
      {at.map(([x, y]) => (
        <Can key={x + "," + y} P={P} x={x} y={y} z={PLATE} r={2.4} h={POST} />
      ))}
    </>
  );
}

function draw(f: Frame) {
  const a = agent(f);
  const bob = f.still ? 0 : Math.sin(f.t * 4) * 1.5;
  const [hx, hy] = P(a.x, a.y, PLATE + 16 + bob);
  const k = P.k;

  return (
    <>
      <path d={quad(P, -R - 40, -R - 40, 2 * R + 80, 2 * R + 80)} className="d" />
      {OUT.map((t) => (
        <g key={t.name}>
          <path d={quad(P, t.x, t.y, TILE, TILE)} className={a.outside === t ? "ot" : "f"} />
          <path d={quad(P, t.x, t.y, TILE, TILE)} className={a.outside === t ? "od" : "d"} />
          <Label P={P} x={t.x + 3} y={t.y + TILE + 9} className={a.outside === t ? "to" : "t"}>
            {t.name}
          </Label>
        </g>
      ))}
      <Box P={P} x={-R} y={-R} w={2 * R} dp={2 * R} h={PLATE}>
        {IN.map((t) => (
          <g key={t.name}>
            <path d={quad(P, t.x, t.y, TILE, TILE, PLATE)} className={a.inside === t ? "ot" : undefined} />
            <path d={quad(P, t.x, t.y, TILE, TILE, PLATE)} className="c" />
            <Label P={P} x={t.x + 3} y={t.y + TILE + 9} z={PLATE}>
              {t.name}
            </Label>
          </g>
        ))}
      </Box>

      {/* the two far sides of the fence, then the agent, then the near two */}
      <Rail a={[-R, -R]} b={[R, -R]} lit={a.hit.ny} />
      <Rail a={[-R, -R]} b={[-R, R]} lit={a.hit.nx} />
      <Posts at={[[-R, R], [-R, 0], [-R, -R], [0, -R], [R, -R]]} />

      <Can P={P} x={a.x} y={a.y} z={PLATE + bob} r={ME} h={16} tone="o" fill="ot" />
      <path d={`M${hx.toFixed(1)} ${(hy - 4 * k).toFixed(1)}V${(hy - 13 * k).toFixed(1)}`} className="o" />
      <circle cx={hx} cy={hy - 15.5 * k} r={2.4 * k} className={a.blocked ? "of" : "f"} />
      <circle cx={hx} cy={hy - 15.5 * k} r={2.4 * k} className="o" />

      <Rail a={[R, -R]} b={[R, R]} lit={a.hit.px} />
      <Rail a={[-R, R]} b={[R, R]} lit={a.hit.py} />
      <Posts at={[[R, 0], [0, R], [R, R]]} />
    </>
  );
}

export default function Guardrails({ label, onRead }: { label: string; onRead?: (s: string) => void }) {
  return (
    <Stage
      label={label}
      draw={draw}
      onRead={onRead}
      idle={(t) => [0.5 + 0.4 * Math.sin(t * 0.5), 0.5 + 0.3 * Math.sin(t * 0.37 + 0.8)]}
      still={2.2}
      read={(f) => {
        const a = agent(f);
        if (a.blocked) return `${a.outside?.name ?? "edge"} · blocked`;
        return a.inside ? `${a.inside.name} · ok` : "in scope";
      }}
    />
  );
}
