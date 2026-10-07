"use client";

import { useActive, usePhases } from "@/components/ui/hooks";

const STAGES = ["commit", "build", "test", "deploy"] as const;
// one phase per stage → shipped → reset
const PHASES = [700, 900, 1500, 900, 1900, 500] as const;
const TESTS = Array.from({ length: 24 }, (_, i) => i);
const TEAM = [0, 1, 2, 3, 4];

export default function ShipPipeline() {
  const [ref, active] = useActive<HTMLDivElement>(0.4);
  const phase = usePhases(PHASES, active, { staticPhase: 4 });
  const shipped = phase === 4;
  const reset = phase === 5;
  const testing = phase === 2 && active;
  const testsDone = phase >= 3 && !reset;

  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-5 py-4" aria-hidden>
      <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.14em]">
        <span className="text-ink-3">ci/cd pipeline</span>
        <span className={`transition-colors duration-500 ${shipped ? "text-ok" : "text-ink-3"}`}>
          {shipped ? "shipped ✓" : "building…"}
        </span>
      </div>

      <div className="relative flex items-center justify-between">
        <div className="absolute left-3 right-3 top-3 h-px bg-line-strong" />
        <div
          className="absolute left-3 top-3 h-px bg-accent transition-[width] duration-700 ease-expo"
          style={{ width: reset ? "0%" : `calc(${(Math.min(phase, 3) / 3) * 100}% - ${(Math.min(phase, 3) / 3) * 24}px)` }}
        />
        {STAGES.map((s, i) => {
          const done = !reset && (phase > i || shipped);
          const now = !reset && phase === i && active;
          return (
            <div key={s} className="relative flex flex-col items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] transition-all duration-300 ${
                  done
                    ? "border-ok bg-ok text-bg"
                    : now
                      ? "border-accent bg-bg text-accent shadow-[0_0_0_4px_rgba(255,106,10,0.15)]"
                      : "border-line-strong bg-bg text-ink-3"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${done || now ? "text-ink-2" : "text-ink-3"}`}>
                {s}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">phpunit</span>
        <div className="grid flex-1 grid-cols-12 gap-[3px]">
          {TESTS.map((t) => (
            <span
              key={t}
              className={`h-2 rounded-[2px] transition-colors duration-200 ${testsDone || testing ? "bg-ok/80" : "bg-[#1f1f23]"}`}
              style={{ transitionDelay: testing ? `${(t / TESTS.length) * 1.1}s` : "0s" }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">team</span>
        <div className="flex flex-1 items-center">
          <span className="relative z-10 flex h-6 items-center rounded-full border border-accent/60 bg-accent/10 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
            lead
          </span>
          <div className="h-px w-4 bg-line-strong" />
          <div className="flex -space-x-1">
            {TEAM.map((m) => (
              <span
                key={m}
                className={`h-5 w-5 rounded-full border-2 border-card transition-colors duration-500 ${shipped ? "bg-peach" : "bg-[#3a3a41]"}`}
                style={{ transitionDelay: `${m * 0.07}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
