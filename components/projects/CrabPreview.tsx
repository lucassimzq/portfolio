"use client";

import { useEffect, useRef } from "react";
import { useActive, usePhases, usePrefersReducedMotion } from "@/components/ui/hooks";
import { CRAB, type Mood } from "@/components/projects/crab-sprites";

// Colours, thresholds and wording follow the mod itself (hooks/register.tsx).
const TONES = { ok: "#6b9e7a", warn: "#c4a05a", hot: "#c06565" } as const;
const MUTED = "#8b9099";
const toneOf = (pct: number) => TONES[pct >= 80 ? "hot" : pct >= 50 ? "warn" : "ok"];
const moodOf = (pct: number): Mood =>
  pct >= 100 ? "asleep" : pct >= 95 ? "panic" : pct >= 80 ? "frantic" : pct >= 50 ? "anxious" : "happy";
const noteOf = (pct: number) =>
  pct >= 100
    ? "Weekly limit reached · resets in 2d 4h"
    : pct >= 95
      ? "Weekly limit nearly used up"
      : pct >= 80
        ? "You're almost reaching your weekly limit"
        : pct >= 50
          ? "Weekly limit is over half used"
          : "";

const MOOD_LABEL: Record<Mood, string> = {
  happy: "happy · under 50%",
  anxious: "anxious · 50% and up",
  frantic: "frantic · 80% and up",
  panic: "this is fine · 95% and up",
  asleep: "asleep until the reset",
};

// Each frame is a turn ending: the weekly limit climbs and the crab's mood follows it.
const FRAMES = [
  { week: 34, five: 27, ctx: 18, cost: "3.17", xp: 0.42, toast: "" },
  { week: 62, five: 36, ctx: 27, cost: "3.48", xp: 0.46, toast: "Clawd is sweating: Weekly limit passed 50%" },
  { week: 84, five: 44, ctx: 35, cost: "3.86", xp: 0.5, toast: "Clawd is sweating: Weekly limit passed 80%" },
  { week: 97, five: 51, ctx: 42, cost: "4.19", xp: 0.53, toast: "Clawd is sweating: Weekly limit passed 95%" },
  { week: 100, five: 55, ctx: 46, cost: "4.31", xp: 0.64, toast: "Maxed out the weekly limit! (+150 XP)" },
] as const;
const PHASES = [2400, 2700, 2700, 2700, 3400] as const;

const STEPS = [
  { icon: "Read", text: "webhook.go" },
  { icon: "Edited", text: "webhook.go", diff: ["+18", "−4"] },
  { icon: "Ran", text: "go test ./...", result: "42 passed" },
  { icon: "Committed", text: "Retry failed webhook deliveries" },
];

const CELLS = 16;

export default function CrabPreview() {
  const [ref, active] = useActive<HTMLDivElement>(0.3);
  const reduced = usePrefersReducedMotion();
  const phase = usePhases(PHASES, active, { staticPhase: 1 });
  const f = FRAMES[phase];
  const mood = moodOf(f.week);
  const note = noteOf(f.week);

  const run = active && !reduced;

  return (
    <div ref={ref} className="flex h-full flex-col" aria-hidden>
      <div className="relative flex min-h-0 flex-1 gap-6 overflow-hidden px-4 pt-4 sm:px-6 sm:pt-5">
        {/* the session above the band */}
        <div className="hidden min-w-0 flex-1 flex-col gap-2.5 sm:flex">
          <div className="max-w-full self-start rounded-2xl bg-white/[0.06] px-3.5 py-2 text-[12.5px] text-ink-2">
            Add retries to the payment webhook
          </div>
          <ul className="flex flex-col gap-1.5 font-mono text-[11px] leading-snug">
            {STEPS.slice(0, Math.min(phase + 1, STEPS.length)).map((s) => (
              <li key={s.icon} className="ws-line flex min-w-0 items-baseline gap-2 text-ink-3">
                <span className="text-ok">●</span>
                <span className="shrink-0 text-ink-2">{s.icon}</span>
                <span className="truncate">{s.text}</span>
                {s.diff && (
                  <span className="shrink-0">
                    <span className="text-ok">{s.diff[0]}</span> <span className="text-err">{s.diff[1]}</span>
                  </span>
                )}
                {s.result && <span className="shrink-0 text-ok">{s.result}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* the crab up close, and where the weekly limit sits on his mood scale */}
        <div className="flex flex-1 flex-col items-center justify-center pb-10">
          <Crab mood={mood} run={run} className="block h-[84px] w-[182px] sm:h-[96px] sm:w-[208px]" />
          <div
            key={mood}
            className="ws-line mt-3 font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{ color: toneOf(f.week) }}
          >
            {MOOD_LABEL[mood]}
          </div>
          <MoodScale pct={f.week} />
        </div>

        {f.toast && (
          <div
            key={phase}
            className="ws-line absolute bottom-2 right-4 hidden max-w-[calc(100%-2rem)] truncate sm:block rounded-lg border border-line-strong bg-[#18181b] px-3 py-1.5 text-[11.5px] text-ink shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] sm:right-6"
          >
            {f.toast}
          </div>
        )}
      </div>

      {/* the band and the prompt */}
      <div className="p-2.5 sm:p-3.5">
        <div className="rounded-2xl border border-line-strong bg-[#161618] p-2.5 sm:p-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-1">
            <Crab mood={mood} run={run} className="block h-[38px] w-[82px]" />
            <span className="flex flex-col gap-[3px] font-mono text-[10.5px] leading-none">
              <span className="text-[#a99be0]">Lv14</span>
              <span className="block h-[2px] w-8 bg-white/10">
                <span
                  className="block h-full bg-[#a99be0] transition-[width] duration-700 ease-expo"
                  style={{ width: `${f.xp * 100}%` }}
                />
              </span>
              <span className="text-[#c4a05a]">● 1.2k</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-[10.5px] text-ink-3">
              <svg viewBox="0 0 4 5" className="h-[10px] w-[8px]" shapeRendering="crispEdges">
                <path d="M2 0h1v1H2zM1 1h2v1H1zM0 2h4v3H0z" fill="#e8743b" />
                <path d="M1 3h2v2H1z" fill="#f2c14e" />
              </svg>
              21
            </span>
            <span
              className={`order-last basis-full sm:order-none sm:min-w-0 sm:flex-1 sm:basis-auto ${note ? "" : "invisible"}`}
            >
              <span
                key={note}
                className="ws-line inline-block max-w-full truncate border px-2 py-[3px] font-mono text-[10.5px]"
                style={{ color: toneOf(f.week), borderColor: `${MUTED}73`, backgroundColor: `${MUTED}14` }}
              >
                {note || "·"}
              </span>
            </span>
            <span className="ml-auto flex items-center gap-3 font-mono text-[11px] text-ink-3">
              <span className="tabular-nums">${f.cost}</span>
              <span>↻</span>
            </span>
          </div>

          <div className="mt-2.5 grid gap-1.5 px-1 sm:grid-cols-3 sm:gap-4">
            <Bar label="ctx" pct={f.ctx} />
            <Bar label="5h" pct={f.five} elapsed={0.48} />
            <Bar label="7d" pct={f.week} elapsed={0.71} />
          </div>

          <div className="mt-3 rounded-xl border border-line px-3.5 py-2.5 text-[12.5px] text-ink-3">Type / for commands</div>
        </div>
      </div>
    </div>
  );
}

/** One mood sprite. SMIL can't be paused from CSS, so it stops here off screen and for reduced motion. */
function Crab({ mood, run, className }: { mood: Mood; run: boolean; className: string }) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    if (run) el.unpauseAnimations();
    else el.pauseAnimations();
  }, [run, mood]);
  return (
    <span key={mood} className="crab-hop shrink-0">
      <svg
        ref={svg}
        viewBox="-8 -5 52 24"
        className={className}
        shapeRendering="crispEdges"
        dangerouslySetInnerHTML={{ __html: CRAB[mood] }}
      />
    </span>
  );
}

/** The weekly figure on the scale the crab's mood follows: happy, anxious, frantic, this is fine. */
function MoodScale({ pct }: { pct: number }) {
  const zones = [
    [0, 50, TONES.ok],
    [50, 80, TONES.warn],
    [80, 95, TONES.hot],
    [95, 100, TONES.hot],
  ] as const;
  return (
    <div className="mt-4 w-[208px]">
      <div className="relative">
        <div className="flex h-1.5 gap-[3px]">
          {zones.map(([from, to, color]) => (
            <span
              key={from}
              className="h-full rounded-[1px] transition-opacity duration-500"
              style={{ width: `${to - from}%`, backgroundColor: color, opacity: pct >= from ? 0.9 : 0.25 }}
            />
          ))}
        </div>
        <span
          className="absolute -top-[7px] h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent transition-[left] duration-700 ease-expo"
          style={{ left: `${pct}%`, borderTopColor: "var(--text-1)" }}
        />
      </div>
      <div className="relative mt-1.5 h-3 font-mono text-[9.5px] text-ink-3">
        <span className="absolute left-0">0</span>
        {[50, 80].map((t) => (
          <span key={t} className="absolute -translate-x-1/2" style={{ left: `${t}%` }}>
            {t}
          </span>
        ))}
        <span className="absolute right-0">95 · 100</span>
      </div>
    </div>
  );
}

/** A segmented limit bar; the arrow above marks how far through its window you are. */
function Bar({ label, pct, elapsed }: { label: string; pct: number; elapsed?: number }) {
  const lit = pct <= 0 ? 0 : Math.max(1, Math.round((Math.min(100, pct) / 100) * CELLS));
  const color = toneOf(pct);
  return (
    <div className="flex items-center gap-2 font-mono text-[11px]">
      <span className="w-6 shrink-0 text-ink-3">{label}</span>
      <span className="relative flex flex-1 gap-[2px] pt-[6px]">
        {elapsed !== undefined && (
          <svg
            viewBox="0 0 3 2"
            className="absolute top-0 h-[4px] w-[6px] -translate-x-1/2"
            style={{ left: `${elapsed * 100}%` }}
            shapeRendering="crispEdges"
          >
            <path d="M0 0h3v1H0zM1 1h1v1H1z" fill={MUTED} />
          </svg>
        )}
        {Array.from({ length: CELLS }, (_, j) => (
          <span
            key={j}
            className="h-[9px] flex-1 transition-colors duration-300"
            style={{ backgroundColor: j < lit ? color : `${MUTED}38`, transitionDelay: `${j * 18}ms` }}
          />
        ))}
      </span>
      <span className="w-9 shrink-0 text-right tabular-nums transition-colors duration-300" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}
