"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate } from "motion/react";
import { arcPath, type Pt } from "@/components/viz/geometry";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { CITIES, HOME, LAND_DOTS, MAP_H, MAP_W } from "@/lib/map";
import traveller from "@/assets/me/pin.webp";

const FROM: Pt = [HOME.x, HOME.y];
const DRAW_S = 1.3; // matches .arc-draw
const EXPO = [0.16, 1, 0.3, 1] as const;

function quad(a: Pt, c: Pt, b: Pt, t: number): Pt {
  const mt = 1 - t;
  return [mt * mt * a[0] + 2 * mt * t * c[0] + t * t * b[0], mt * mt * a[1] + 2 * mt * t * c[1] + t * t * b[1]];
}

// Every route bows north-east of the straight line, like a great-circle track on Mercator.
// `lut` is the running length at even steps of t, so a marker can keep pace with the line as it draws.
const ARCS = CITIES.map((city) => {
  const to: Pt = [city.x, city.y];
  const arc = arcPath(FROM, to, -0.17);
  const lut = [0];
  let prev = FROM;
  for (let i = 1; i <= 64; i++) {
    const p = quad(FROM, arc.c, to, i / 64);
    lut.push(lut[i - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1]));
    prev = p;
  }
  return { id: city.id, ...arc, to, lut };
});

/** The point a given fraction of the way along a route, by length. */
function along(i: number, f: number): Pt {
  const { lut, c, to } = ARCS[i];
  const goal = f * lut[lut.length - 1];
  let k = 1;
  while (k < lut.length - 1 && lut[k] < goal) k++;
  const t = (k - 1 + (goal - lut[k - 1]) / (lut[k] - lut[k - 1] || 1)) / (lut.length - 1);
  return quad(FROM, c, to, t);
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function RelocationMap({
  active,
  shown,
  onPick,
}: {
  active: number;
  shown: boolean;
  onPick: (i: number) => void;
}) {
  const arc = ARCS[active];

  return (
    <div className="relative" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="Flight paths from Kuala Lumpur to Sydney, Melbourne, Brisbane, Perth, Auckland and Wellington"
      >
        <defs>
          <radialGradient id="map-reveal-fill">
            <stop offset="0.75" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="map-reveal" maskUnits="userSpaceOnUse" x="-100" y="-100" width={MAP_W + 200} height={MAP_H + 200}>
            <circle
              cx={HOME.x}
              cy={HOME.y}
              r="1250"
              fill="url(#map-reveal-fill)"
              style={{
                transformOrigin: `${HOME.x}px ${HOME.y}px`,
                transform: `scale(${shown ? 1 : 0})`,
                transition: "transform 2.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </mask>
        </defs>

        <g mask="url(#map-reveal)">
          <path d={LAND_DOTS} stroke="#34343b" strokeWidth="4.6" strokeLinecap="round" />

          {/* every route, faint */}
          {ARCS.map((a, i) => (
            <path
              key={a.id}
              d={a.d}
              fill="none"
              stroke={i === active ? "transparent" : "rgba(243,240,234,0.16)"}
              strokeWidth="1.6"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
          ))}

          {/* the current route draws itself, then carries a packet */}
          <path
            key={`draw-${arc.id}`}
            d={arc.d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="arc-draw"
            style={{ "--len": `${arc.len}px` } as React.CSSProperties}
          />
          <path
            key={`packet-${arc.id}`}
            d={arc.d}
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="5"
            strokeLinecap="round"
            className="packet"
            style={
              {
                "--dash": "34px",
                "--len": `${arc.len}px`,
                "--dur": "2.4s",
                "--delay": "0.9s",
                filter: "drop-shadow(0 0 8px rgba(255,106,10,0.9))",
              } as React.CSSProperties
            }
          />
        </g>

        {/* home */}
        <circle cx={HOME.x} cy={HOME.y} r="22" fill="var(--accent)" className="map-ping" style={{ transformOrigin: `${HOME.x}px ${HOME.y}px` }} />
        <circle cx={HOME.x} cy={HOME.y} r="8" fill="var(--accent)" />

        {CITIES.map((c, i) => (
          <g key={c.id}>
            {i === active && (
              <circle
                cx={c.x}
                cy={c.y}
                r="22"
                fill="var(--accent-2)"
                className="map-ping"
                style={{ transformOrigin: `${c.x}px ${c.y}px` }}
              />
            )}
            <circle
              cx={c.x}
              cy={c.y}
              r={i === active ? 8 : 5.5}
              fill={i === active ? "var(--accent-2)" : "var(--text-3)"}
              className="transition-all duration-500"
            />
          </g>
        ))}
      </svg>

      <Traveller active={active} shown={shown} />

      {/* Labels live in HTML so they stay legible at any map size. */}
      <span
        className="pointer-events-none absolute -translate-y-1/2 pl-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2 sm:text-[11.5px]"
        style={{ left: pct(HOME.x, MAP_W), top: pct(HOME.y, MAP_H) }}
      >
        KUL <span className="text-ink-3">· home</span>
      </span>
      {CITIES.map((c, i) => {
        const leftSide = c.id !== "syd" && c.id !== "bne";
        return (
          <button
            key={c.id}
            type="button"
            onPointerEnter={() => onPick(i)}
            onFocus={() => onPick(i)}
            onClick={() => onPick(i)}
            aria-pressed={i === active}
            className={`absolute -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-300 sm:block sm:text-[11.5px] ${
              leftSide ? "-ml-2.5 -translate-x-full" : "ml-2.5"
            } ${i === active ? "text-ink" : "hidden text-ink-3 hover:text-ink-2"}`}
            style={{ left: pct(c.x, MAP_W), top: pct(c.y, MAP_H) }}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}

/** A pin of Lucas that rides the tip of the route as it draws out to the next city. */
function Traveller({ active, shown }: { active: number; shown: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !shown) return;
    const place = (f: number) => {
      const [x, y] = along(active, f);
      el.style.left = pct(x, MAP_W);
      el.style.top = pct(y, MAP_H);
    };
    if (reduced) {
      place(1);
      return;
    }
    place(0);
    const flight = animate(0, 1, { duration: DRAW_S, ease: EXPO, onUpdate: place });
    return () => flight.stop();
  }, [active, shown, reduced]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full transition-opacity duration-500"
      style={{ left: pct(HOME.x, MAP_W), top: pct(HOME.y, MAP_H), opacity: shown ? 1 : 0 }}
    >
      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-accent bg-[#e2f4fe] shadow-[0_10px_28px_-8px_rgba(255,106,10,0.7)] sm:h-12 sm:w-12">
        <Image src={traveller} alt="" fill sizes="48px" className="object-cover" />
      </div>
      <span className="mx-auto -mt-px block h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-accent" />
    </div>
  );
}
