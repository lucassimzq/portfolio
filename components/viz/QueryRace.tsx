"use client";

import Counter from "@/components/ui/Counter";
import { useActive, usePhases } from "@/components/ui/hooks";

// run → hold → reset
const PHASES = [5600, 2600, 600] as const;
const AFTER_PCT = (9.5 / 120) * 100;
const TEN_SEC_PCT = (10 / 120) * 100;

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function QueryRace() {
  const [ref, active] = useActive<HTMLDivElement>(0.4);
  const phase = usePhases(PHASES, active, { staticPhase: 1 });
  const running = phase === 0 && active;
  const done = phase === 1;
  const filled = running || done;

  return (
    <div ref={ref} className="relative flex h-full flex-col justify-center gap-7 py-6" aria-hidden>
      {/* "10 s" budget marker shared by both lanes */}
      <div className="pointer-events-none absolute inset-y-2 left-[72px] right-0 sm:left-[88px]">
        <div className="absolute inset-y-0 border-l border-dashed border-ok/40" style={{ left: `${TEN_SEC_PCT}%` }}>
          <span className="absolute -top-1 left-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-ok/80">10 s</span>
        </div>
      </div>

      <Lane label="before">
        <div
          className="query-stripes absolute inset-y-0 left-0 rounded-full"
          style={{
            width: filled ? "100%" : "0%",
            transition: running ? `width ${PHASES[0]}ms linear` : done ? "none" : "width 0.5s ease",
          }}
        />
        <Readout>
          {done ? <span className="text-ink-2">~2 min</span> : <Counter to={120} duration={PHASES[0] / 1000} play={running} format={clock} />}
        </Readout>
      </Lane>

      <Lane label="after">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent shadow-[0_0_24px_rgba(255,106,10,0.6)]"
          style={{
            width: filled ? `${AFTER_PCT}%` : "0%",
            transition: running ? "width 0.48s cubic-bezier(0.2,0.7,0.2,1)" : done ? "none" : "width 0.5s ease",
          }}
        />
        <Readout>
          <span
            className="inline-flex items-center gap-1.5 text-ok transition-opacity duration-300"
            style={{ opacity: filled ? 1 : 0, transitionDelay: running ? "0.5s" : "0s" }}
          >
            &lt;10 s ✓
          </span>
        </Readout>
      </Lane>

      <div
        className="absolute bottom-0 right-0 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-all duration-500"
        style={{ opacity: done ? 1 : 0, transform: done ? "translateY(0)" : "translateY(6px)" }}
      >
        ~12× faster
      </div>
    </div>
  );
}

function Lane({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="w-[60px] shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:w-[72px]">{label}</span>
      <div className="relative h-3.5 flex-1 rounded-full bg-[#1b1b1f]">{children}</div>
    </div>
  );
}

function Readout({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-6 right-0 font-mono text-[12px] tabular-nums text-ink">{children}</span>
  );
}
