"use client";

import Counter from "@/components/ui/Counter";
import { useActive, usePhases } from "@/components/ui/hooks";

// copy → cut over → hold → reset
const PHASES = [4200, 900, 2200, 700] as const;
const COLS = 8;
const ROWS = 6;
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => i);

export default function Migration() {
  const [ref, active] = useActive<HTMLDivElement>(0.4);
  const phase = usePhases(PHASES, active, { staticPhase: 2 });
  const copying = phase === 0 && active;
  const copied = phase === 1 || phase === 2;
  const live = phase >= 1 && phase <= 2;

  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-5 py-4" aria-hidden>
      <div className="flex items-center gap-3">
        <Table name="events_v1" dim={copied} cells={() => (copied ? "bg-[#26262b]" : "bg-[#55555e]")} />
        <div className="relative h-px flex-1 bg-line-strong">
          <span
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_12px_rgba(255,106,10,0.9)]"
            style={{ animation: copying ? "migrate-dot 0.7s linear infinite" : "none", opacity: copying ? 1 : 0 }}
          />
        </div>
        <Table
          name="events_v2"
          badge={live ? "live" : undefined}
          cells={() => (copying || copied ? "bg-accent" : "bg-[#1b1b1f]")}
          delay={(i) => (copying ? (i / CELLS.length) * (PHASES[0] / 1000 - 0.4) : 0)}
        />
      </div>

      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
        <div className="flex items-baseline justify-between">
          <span>rows copied</span>
          <span className="text-[13px] tabular-nums tracking-normal text-ink">
            {copied ? "20,000,000" : <Counter to={20_000_000} duration={PHASES[0] / 1000 - 0.3} play={copying} />}
          </span>
        </div>
        {/* external traffic keeps flowing the whole time */}
        <div className="mt-3 flex items-center gap-2">
          <span className="shrink-0">traffic</span>
          <div className="uptime-track h-4 flex-1" />
          <span className="shrink-0 text-ok">200 OK</span>
        </div>
      </div>
    </div>
  );
}

function Table({
  name,
  cells,
  delay,
  dim,
  badge,
}: {
  name: string;
  cells: (i: number) => string;
  delay?: (i: number) => number;
  dim?: boolean;
  badge?: string;
}) {
  return (
    <div className={`shrink-0 transition-opacity duration-500 ${dim ? "opacity-60" : ""}`}>
      <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
        {name}
        <span
          className="rounded-full bg-ok/15 px-1.5 text-ok transition-opacity duration-300"
          style={{ opacity: badge ? 1 : 0 }}
        >
          {badge ?? "live"}
        </span>
      </div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, 9px)` }}>
        {CELLS.map((i) => (
          <span
            key={i}
            className={`h-[9px] w-[9px] rounded-[2px] transition-colors duration-200 ${cells(i)}`}
            style={{ transitionDelay: `${delay?.(i) ?? 0}s` }}
          />
        ))}
      </div>
    </div>
  );
}
