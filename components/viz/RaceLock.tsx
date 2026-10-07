"use client";

import { Lock } from "@/components/ui/Icons";
import { useActive, usePhases } from "@/components/ui/hooks";

// Two acts: the race without a lock, then the same race behind a Redis mutex.
const PHASES = [700, 1100, 1800, 800, 1100, 1300, 1100, 2000] as const;

const STATUS = [
  "two requests · same user · same instant",
  "both read “not onboarded yet”…",
  "✗ race: user onboarded twice",
  "now behind a Redis mutex",
  "A acquires the lock",
  "B waits for the lock",
  "A releases · B acquires",
  "✓ onboarded once · state consistent",
];

const posA = [0, 100, 100, 0, 100, 100, 100, 100];
const posB = [0, 100, 100, 0, 62, 62, 100, 100];

export default function RaceLock() {
  const [ref, active] = useActive<HTMLDivElement>(0.4);
  const phase = usePhases(PHASES, active, { staticPhase: 7 });
  const locked = phase >= 3;
  const clash = phase === 2;
  const holder = phase === 4 || phase === 5 ? "A" : phase === 6 ? "B" : null;
  const ok = phase === 7;
  const resetting = phase === 0 || phase === 3;

  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-5 py-4" aria-hidden>
      <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.14em]">
        <span
          className={`rounded-full border px-2.5 py-1 transition-colors duration-500 ${
            locked ? "border-accent/50 bg-accent/10 text-accent" : "border-err/50 bg-err/10 text-err"
          }`}
        >
          {locked ? "with redis mutex" : "without a lock"}
        </span>
        <span className="text-ink-3">onboarding flow</span>
      </div>

      <div className="flex items-stretch gap-3">
        <div className="flex flex-1 flex-col justify-around gap-6 py-2">
          {(["A", "B"] as const).map((who) => {
            const pos = (who === "A" ? posA : posB)[phase];
            const waiting = who === "B" && phase === 5;
            const doneA = who === "A" && phase >= 6;
            return (
              <div key={who} className="relative flex items-center gap-3">
                <span className="w-12 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">req {who}</span>
                <div className="relative h-px flex-1 bg-line-strong">
                  <span
                    className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                      clash ? "bg-err" : "bg-accent"
                    } ${waiting ? "race-wait" : ""}`}
                    style={{
                      left: `${pos}%`,
                      opacity: doneA ? 0.25 : 1,
                      boxShadow: clash ? "0 0 16px rgba(255,90,90,.8)" : "0 0 14px rgba(255,106,10,.7)",
                      transition: resetting
                        ? "left 0.35s ease, opacity 0.3s"
                        : "left 1s cubic-bezier(0.65,0,0.35,1), opacity 0.4s, background-color 0.3s",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`relative flex w-[132px] shrink-0 flex-col justify-center rounded-xl border px-3 py-3 font-mono text-[11px] transition-colors duration-300 ${
            clash
              ? "border-err bg-err/10 text-err"
              : ok
                ? "border-ok/60 bg-ok/10 text-ok"
                : holder
                  ? "border-accent/70 bg-accent/10 text-ink"
                  : "border-line-strong bg-[#0c0c0e] text-ink-2"
          }`}
          style={{ animation: clash ? "shake 0.5s" : undefined }}
        >
          <span className="text-[10px] uppercase tracking-[0.12em] text-ink-3">resource</span>
          <span className="mt-0.5">user_42</span>
          <span className="mt-2 flex items-center gap-1.5 text-[10.5px]">
            {clash ? "rows: 2 ✗" : ok ? "rows: 1 ✓" : holder ? `held by ${holder}` : "rows: 0"}
          </span>
          <span
            className={`absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full border bg-bg transition-all duration-300 ${
              holder ? "scale-100 border-accent text-accent opacity-100" : "scale-75 border-line text-ink-3 opacity-0"
            }`}
          >
            <Lock size={14} />
          </span>
        </div>
      </div>

      <div className="h-5 font-mono text-[11.5px] text-ink-2">
        <span key={phase} className="inline-block animate-[fade-rise_0.4s_var(--ease-expo)_forwards] opacity-0">
          {STATUS[phase]}
        </span>
      </div>
    </div>
  );
}
