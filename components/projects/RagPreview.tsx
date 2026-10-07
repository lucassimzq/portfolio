"use client";

import { useActive, usePhases } from "@/components/ui/hooks";
import { hash01 } from "@/components/viz/geometry";

const QUERY = "Go + payments, can mentor";
const STEPS = ["embed", "search", "retrieve", "generate"] as const;
// type → embed → search → retrieve → stream → hold → reset
const PHASES = [2100, 1300, 1600, 1300, 2800, 2400, 500] as const;

const BARS = Array.from({ length: 44 }, (_, i) => Math.round((0.18 + hash01(i + 11) * 0.82) * 100) / 100);
const NEG = Array.from({ length: 44 }, (_, i) => hash01(i + 400) > 0.55);
const PROFILES = 50;
const TOP = [
  { id: 12, score: "0.91" },
  { id: 31, score: "0.88" },
  { id: 7, score: "0.86" },
  { id: 44, score: "0.83" },
  { id: 19, score: "0.81" },
];
const TOP_IDS = new Set(TOP.map((t) => t.id));
const ANSWER =
  "Profile #12 is the strongest fit: years of Go in payments and has mentored a small team. #31 is close behind with deeper platform work but less leadership.".split(
    " ",
  );

export default function RagPreview() {
  const [ref, active] = useActive<HTMLDivElement>(0.3);
  const phase = usePhases(PHASES, active, { staticPhase: 5 });
  const reset = phase === 6;
  const typed = phase >= 0 && !reset;
  const typing = phase === 0 && active;
  const embedded = phase >= 1 && !reset;
  const searching = phase === 2 && active;
  const ranked = phase >= 3 && !reset;
  const streaming = phase >= 4 && !reset;
  const step = reset ? -1 : phase >= 5 ? STEPS.length : phase - 1;

  return (
    <div ref={ref} className="flex h-full flex-col gap-4 p-4 sm:p-5" aria-hidden>
      {/* query box */}
      <div className="flex items-center gap-3 rounded-xl border border-line-strong bg-[#111114] px-3.5 py-2.5 font-mono text-[12px] sm:text-[12.5px]">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-ink-3">
          <circle cx="7" cy="7" r="5" />
          <path d="m11 11 3.5 3.5" />
        </svg>
        <span className="relative min-w-0 flex-1 overflow-hidden whitespace-nowrap text-ink">
          <span
            className="inline-block overflow-hidden whitespace-nowrap align-bottom"
            style={{
              width: typed && (phase > 0 || typing) ? `${QUERY.length}ch` : "0ch",
              transition: typing ? `width ${PHASES[0] - 300}ms steps(${QUERY.length})` : "none",
            }}
          >
            {QUERY}
          </span>
          <span className={`caret ml-px inline-block h-[1.1em] w-[7px] translate-y-[2px] bg-accent ${typing ? "" : "opacity-0"}`} />
        </span>
        <span
          className={`shrink-0 rounded border px-1.5 text-[10px] transition-colors duration-300 ${
            embedded ? "border-accent/60 text-accent" : "border-line-strong text-ink-3"
          }`}
        >
          ↵
        </span>
      </div>

      {/* pipeline stepper */}
      <ol className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] sm:gap-2 sm:tracking-[0.14em]">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 transition-all duration-300 ${
                step === i
                  ? "border-accent bg-accent/15 text-accent"
                  : step > i
                    ? "border-ok/40 text-ok"
                    : "border-line text-ink-3"
              }`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && <span className="hidden h-px w-5 bg-line-strong sm:block" />}
          </li>
        ))}
      </ol>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
        {/* query vector */}
        <div className="flex flex-col rounded-xl border border-line bg-[#0f0f12] p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
            <span className="hidden sm:inline">query vector · </span>768‑d
          </div>
          <div className="relative mt-2 flex flex-1 items-center gap-px sm:gap-[2px]">
            <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
            {BARS.map((h, i) => (
              <span key={i} className="relative flex h-full flex-1 items-center">
                <span
                  className={`absolute inset-x-0 rounded-[1px] ${NEG[i] ? "top-1/2 origin-top bg-peach/70" : "bottom-1/2 origin-bottom bg-accent"}`}
                  style={{
                    height: `${h * 46}%`,
                    transform: `scaleY(${embedded ? 1 : 0})`,
                    transition: embedded ? `transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 14}ms` : "transform 0.3s ease",
                  }}
                />
              </span>
            ))}
          </div>
          <div className="mt-2 font-mono text-[10px] text-ink-3">
            [{embedded ? "0.021, -0.113, 0.087, …" : "…"}]
          </div>
        </div>

        {/* pgvector search */}
        <div className="flex flex-col rounded-xl border border-line bg-[#0f0f12] p-3">
          <div className="flex justify-between gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
            <span>
              pgvector<span className="hidden sm:inline"> · cosine</span>
            </span>
            <span className={ranked ? "text-ok" : ""}>
              {ranked ? "top 5" : PROFILES}
              {!ranked && <span className="hidden sm:inline"> profiles</span>}
            </span>
          </div>
          <div className="mt-3 grid flex-1 grid-cols-10 place-items-center content-center gap-y-3">
            {Array.from({ length: PROFILES }, (_, i) => {
              const top = TOP_IDS.has(i);
              return (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-300 sm:h-2.5 sm:w-2.5 ${
                    ranked && top
                      ? "scale-150 bg-accent shadow-[0_0_10px_rgba(255,106,10,0.8)]"
                      : searching
                        ? "rag-sweep bg-ink-3/40"
                        : ranked
                          ? "bg-[#26262b]"
                          : "bg-[#34343a]"
                  }`}
                  style={searching ? { animationDelay: `${(i % 10) * 70 + Math.floor(i / 10) * 30}ms` } : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* retrieved + generated */}
      <div className="rounded-xl border border-line bg-[#0f0f12] p-3">
        <div className="flex flex-wrap gap-1.5">
          {TOP.map((t, i) => (
            <span
              key={t.id}
              className="rounded-md border border-line-strong px-2 py-0.5 font-mono text-[10.5px] text-ink-2 transition-all duration-500"
              style={{
                opacity: ranked ? 1 : 0,
                transform: ranked ? "translateY(0)" : "translateY(6px)",
                transitionDelay: ranked ? `${i * 90}ms` : "0ms",
              }}
            >
              #{String(t.id).padStart(2, "0")} <span className="text-accent">{t.score}</span>
            </span>
          ))}
        </div>
        <p className="mt-2.5 min-h-[3.2em] text-[12.5px] leading-snug text-ink-2 sm:text-[13px]">
          <span className="mr-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">gemini ›</span>
          {ANSWER.map((w, i) => (
            <span
              key={i}
              className="transition-opacity duration-150"
              style={{
                opacity: streaming ? 1 : 0,
                transitionDelay: streaming && phase === 4 ? `${i * 85}ms` : "0ms",
              }}
            >
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
