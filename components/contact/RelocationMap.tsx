"use client";

import { arcPath } from "@/components/viz/geometry";
import { CITIES, HOME, LAND_DOTS, MAP_H, MAP_W } from "@/lib/map";

// Every route bows north-east of the straight line, like a great-circle track on Mercator.
const ARCS = CITIES.map((c) => ({ id: c.id, ...arcPath([HOME.x, HOME.y], [c.x, c.y], -0.17) }));

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
