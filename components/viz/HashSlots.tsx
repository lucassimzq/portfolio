"use client";

import { useActive, usePhases } from "@/components/ui/hooks";
import { hash01 as rand } from "./geometry";

const COLS = 20;
const ROWS = 6;
const N = COLS * ROWS;

// Before: a handful of slots on one node take most of the keys. After: spread out.
const HOT = new Set(
  [
    [1, 2], [1, 3], [1, 4],
    [2, 2], [2, 3], [2, 4], [2, 5],
    [3, 2], [3, 3], [3, 4], [3, 5],
    [4, 3], [4, 4],
  ].map(([r, c]) => r * COLS + c),
);
const heatBefore = Array.from({ length: N }, (_, i) => (HOT.has(i) ? 0.85 + rand(i) * 0.15 : 0.05 + rand(i) * 0.12));
const heatAfter = Array.from({ length: N }, (_, i) => 0.32 + rand(i + 7) * 0.22);
const delays = Array.from({ length: N }, (_, i) => rand(i + 101) * 0.9);

const a = (n: number) => Math.round(n * 1000) / 1000;
const color = (h: number) => {
  if (h > 0.7) return `rgba(255, ${Math.round(90 - (h - 0.7) * 120)}, 40, ${a(0.6 + h * 0.4)})`;
  if (h < 0.25) return `rgba(255, 255, 255, ${a(0.05 + h * 0.25)})`;
  return `rgba(255, 106, 10, ${a(0.12 + h * 0.7)})`;
};

const LOAD = {
  before: [86, 8, 6],
  after: [34, 33, 33],
};

// hot → rebalance → balanced → back
const PHASES = [2600, 1500, 2800, 900] as const;

export default function HashSlots() {
  const [ref, active] = useActive<HTMLDivElement>(0.4);
  const phase = usePhases(PHASES, active, { staticPhase: 2 });
  const balanced = phase === 1 || phase === 2;
  const heat = balanced ? heatAfter : heatBefore;
  const load = balanced ? LOAD.after : LOAD.before;

  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-4 py-4" aria-hidden>
      <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.14em]">
        <span className="text-ink-3">16384 slots · sampled</span>
        <span className={`transition-colors duration-500 ${balanced ? "text-ok" : "text-err"}`}>
          {balanced ? "balanced" : "hotspot"}
        </span>
      </div>

      <div className="grid gap-[2px] sm:gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {heat.map((h, i) => (
          <span
            key={i}
            className="aspect-square rounded-[2px]"
            style={{
              backgroundColor: color(h),
              transition: `background-color ${phase === 1 ? 0.9 : 0.6}s ease`,
              transitionDelay: `${a(phase === 1 ? delays[i] : delays[i] * 0.4)}s`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        {load.map((pct, i) => (
          <div key={i} className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
            <span className="w-12 shrink-0">node {String.fromCharCode(97 + i)}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1b1b1f]">
              <div
                className={`h-full rounded-full transition-[width,background-color] duration-1000 ease-expo ${
                  pct > 60 ? "bg-err" : "bg-accent"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
