"use client";

import { useEffect, useState } from "react";
import { useActive, usePhases, usePrefersReducedMotion } from "@/components/ui/hooks";

// The figures and wording come from InletDB's own site: its "reconnect for every query" race
// and its safe-mode demo, run against the same shop-eu production connection.
const COLD: [string, number][] = [
  ["Connect", 50],
  ["TLS", 100],
  ["Sign in", 163],
  ["Query", 52],
];
const COLD_MS = 365;
const WARM_MS = 52;
const RACE_MS = 3000; // how long the slow lane takes to draw

// rows → ⌘K → race → verdict → safe mode holds a write → Esc
const PHASES = [1900, 1700, RACE_MS + 500, 2600, 3300, 2000] as const;
const VERDICT = 3;

const TABLES: [string, string][] = [
  ["customers", "48k"],
  ["invoices", "1.2M"],
  ["order_items", "3.4M"],
  ["orders", "1.2M"],
  ["payments", "980k"],
  ["products", "2.1k"],
  ["refunds", "8.7k"],
];

const ROWS: [number, string, string, string][] = [
  [10482, "aisyah", "pro", "10-06 09:41"],
  [10477, "wei.jie", "team", "10-06 09:12"],
  [10455, "priya", "pro", "10-05 22:03"],
  [10431, "daniel", "free", "10-05 17:48"],
  [10419, "hana", "team", "10-05 11:26"],
  [10398, "arjun", "pro", "10-04 20:15"],
  [10376, "siti", "pro", "10-04 08:57"],
  [10351, "marcus", "team", "10-03 19:30"],
  [10327, "nur", "free", "10-03 07:04"],
  [10302, "kai", "pro", "10-02 16:22"],
];

type Tok = [text: string, className?: string];
const K = "text-peach";
const S = "text-ok";
const SELECT_SQL: Tok[][] = [
  [["-- Customers who paid this week", "text-ink-3"]],
  [["SELECT", K], [" c.id, c.email, c.plan, i.paid_at"]],
  [["FROM", K], [" customers c"]],
  [["JOIN", K], [" invoices i "], ["ON", K], [" i.customer_id = c.id"]],
  [["WHERE", K], [" i.paid_at > now() - "], ["interval", K], [" "], ["'7 days'", S]],
];
const UPDATE_SQL: Tok[][] = [
  [["UPDATE", K], [" customers"]],
  [["SET", K], [" plan = "], ["'free'", S], [";"]],
];

export default function InletPreview() {
  const [ref, active] = useActive<HTMLDivElement>(0.3);
  const phase = usePhases(PHASES, active, { staticPhase: VERDICT });
  const palette = phase === 1;
  const racing = phase === 2 || phase === VERDICT;
  const held = phase === 4;
  const dropped = phase === 5;
  const sql = phase >= 4 ? UPDATE_SQL : SELECT_SQL;

  return (
    <div ref={ref} className="flex h-full text-[12px]" aria-hidden>
      {/* schema panel */}
      <aside className="hidden w-[152px] shrink-0 flex-col border-r border-line bg-[#0e0e10] p-3 sm:flex">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#f0525a] shadow-[0_0_0_3px_rgba(240,82,90,0.16)]" />
          <span className="truncate font-medium text-ink">shop-eu</span>
          <span className="ml-auto rounded border border-[#f0525a]/40 px-1 font-mono text-[8.5px] leading-[14px] text-[#f0525a]">PRD</span>
        </div>
        <div className="mt-1 pl-4 font-mono text-[10px] text-ink-3">postgres · shop</div>
        <div className="mt-5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-3">Tables</div>
        <ul className="mt-1.5 flex flex-col gap-0.5 text-[11.5px]">
          {TABLES.map(([t, n]) => (
            <li
              key={t}
              className={`flex items-center justify-between gap-2 rounded-md px-1.5 py-[3px] ${
                t === "customers" ? "bg-white/[0.06] text-ink" : "text-ink-2"
              }`}
            >
              <span className="truncate">{t}</span>
              <span className="font-mono text-[9.5px] text-ink-3">{n}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-1.5 font-mono text-[9.5px] text-ink-3">
          <span className="live-dot text-ok" style={{ width: 5, height: 5 }} />
          MCP · read-only
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* tabs */}
        <div className="flex items-center gap-1 border-b border-line px-2 py-1.5">
          <span className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2.5 py-1 text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            Query 1
          </span>
          <span className="px-2.5 py-1 text-ink-3">customers</span>
          <span
            className={`ml-auto rounded border px-1.5 font-mono text-[10px] leading-[18px] transition-colors duration-300 ${
              palette ? "border-accent/60 text-accent" : "border-line-strong text-ink-3"
            }`}
          >
            ⌘K
          </span>
        </div>

        {/* editor */}
        <div className="h-[104px] shrink-0 overflow-hidden border-b border-line py-2 font-mono text-[11px] leading-[19px] sm:text-[11.5px]">
          {sql.map((line, i) => (
            <div key={`${phase >= 4}-${i}`} className="flex whitespace-pre">
              <span className="w-8 shrink-0 select-none pr-3 text-right text-ink-3/60">{i + 1}</span>
              <span className="min-w-0 truncate text-ink-2">
                {line.map(([text, cls], j) => (
                  <span key={j} className={cls}>
                    {text}
                  </span>
                ))}
                {i === sql.length - 1 && (palette || held) && (
                  <span className="caret ml-px inline-block h-[13px] w-[6px] translate-y-[2px] bg-accent" />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* results */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {racing ? (
            <Race verdict={phase === VERDICT} />
          ) : (
            <Grid key={phase <= 1 ? "run" : "held"} dim={held} />
          )}

          {/* safe mode holds the write */}
          <div
            className={`absolute inset-x-2.5 bottom-2.5 rounded-xl border border-[#f0525a]/45 bg-[#18100f]/95 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 ease-expo sm:inset-x-3 ${
              held ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
            <div className="flex gap-2.5">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-[#f0525a]">
                <path d="M8 2.2 14.3 13H1.7z" />
                <path d="M8 6.6v3M8 11.4v.1" />
              </svg>
              <div className="min-w-0 leading-snug">
                <div className="font-medium text-ink">UPDATE on customers isn&apos;t run yet</div>
                <div className="mt-0.5 text-[#f0a0a4]">No WHERE: this changes every row in customers (about 48,213).</div>
                <div className="mt-1 truncate font-mono text-[9.5px] text-ink-3">prd · shop-eu / shop · Confirm writes is on</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-end gap-2 font-mono text-[10.5px]">
              <span className="rounded-md border border-line-strong px-2 py-1 text-ink-2">
                Cancel <span className="ml-1 text-ink-3">esc</span>
              </span>
              <span className="rounded-md border border-[#f0525a]/50 bg-[#f0525a]/10 px-2 py-1 text-[#f0525a]">
                Update all rows <span className="ml-1 opacity-70">⇧⌘↵</span>
              </span>
            </div>
          </div>

          <div
            className={`absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-[#151518] px-3.5 py-1.5 text-ink shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] transition-all duration-500 ease-expo ${
              dropped ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
            }`}
          >
            <span className="text-ok">✓</span> Nothing ran. Nothing changed.
          </div>
        </div>

        {/* status bar */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-1.5 font-mono text-[10px] text-ink-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            connected · warm
          </span>
          <span className={held ? "text-[#f0525a]" : ""}>
            {held ? "write held" : racing ? `${WARM_MS} ms vs ${COLD_MS} ms` : `1,284 rows · ${WARM_MS} ms`}
          </span>
        </div>

        {/* ⌘K palette */}
        <div
          className={`absolute left-1/2 top-9 w-[min(88%,330px)] -translate-x-1/2 overflow-hidden rounded-xl border border-line-strong bg-[#141417]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)] backdrop-blur transition-all duration-300 ease-expo ${
            palette ? "scale-100 opacity-100" : "pointer-events-none scale-[0.97] opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-ink-3">
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" />
            </svg>
            <span className="flex items-center text-ink">
              <span
                className="inline-block overflow-hidden whitespace-nowrap"
                style={{
                  width: palette ? "3ch" : "0ch",
                  transition: palette ? "width 540ms steps(3) 260ms" : "none",
                }}
              >
                run
              </span>
              <span className="caret ml-px inline-block h-[13px] w-[6px] bg-accent" />
            </span>
          </div>
          <div className="p-1.5">
            <div className="px-2 pb-1 pt-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-3">Commands</div>
            <div className="flex items-center justify-between rounded-md bg-accent/[0.12] px-2 py-1.5 text-ink">
              Run statement <span className="font-mono text-[10px] text-accent">⌘↵</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 text-ink-2">
              Run all statements <span className="font-mono text-[10px] text-ink-3">⇧⌘↵</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid({ dim }: { dim: boolean }) {
  return (
    <div className={`h-full overflow-hidden transition-opacity duration-500 ${dim ? "opacity-35" : ""}`}>
      <div className="grid grid-cols-[52px_minmax(0,1fr)_44px_76px] gap-x-3 border-b border-line px-3 py-1.5 font-mono text-[10px] text-ink-3 sm:grid-cols-[58px_minmax(0,1fr)_52px_84px]">
        <span className="text-right">id</span>
        <span>email</span>
        <span>plan</span>
        <span>paid_at</span>
      </div>
      {ROWS.map(([id, user, plan, at], i) => (
        <div
          key={id}
          className="ws-line grid grid-cols-[52px_minmax(0,1fr)_44px_76px] gap-x-3 border-b border-line/60 px-3 py-[5px] font-mono text-[10.5px] text-ink-2 sm:grid-cols-[58px_minmax(0,1fr)_52px_84px]"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <span className="text-right tabular-nums text-ink-3">{id}</span>
          <span className="truncate">
            {user}
            <span className="text-ink-3">@example.com</span>
          </span>
          <span className={plan === "free" ? "text-ink-3" : plan === "team" ? "text-peach" : "text-ink"}>{plan}</span>
          <span className="tabular-nums text-ink-3">{at}</span>
        </div>
      ))}
    </div>
  );
}

/** The same query twice: reconnecting for it, and on a tab that stayed connected. */
function Race({ verdict }: { verdict: boolean }) {
  const animate = !usePrefersReducedMotion();
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-3 sm:px-5">
      <div className="font-mono text-[10.5px] text-ink-3">
        <span className="text-peach">SELECT</span> 1; <span className="text-ink-3/70">-- over a 50 ms link</span>
      </div>
      <Lane label="Reconnect for every query" segs={COLD} animate={animate} />
      <Lane label="InletDB, warm tab" segs={[["Query", WARM_MS]]} animate={animate} warm />
      <p
        className={`text-[13px] text-ink-2 transition-all duration-500 ease-expo ${
          verdict ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <b className="font-medium text-accent">7× faster.</b> Same server, same network.
      </p>
    </div>
  );
}

function Lane({ label, segs, animate, warm }: { label: string; segs: [string, number][]; animate: boolean; warm?: boolean }) {
  const total = segs.reduce((n, [, ms]) => n + ms, 0);
  const ms = useCount(total, (total / COLD_MS) * RACE_MS, animate);
  // Where each step starts, in ms from the moment the query is sent.
  const starts = segs.map((_, i) => segs.slice(0, i).reduce((n, [, w]) => n + w, 0));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={warm ? "text-ink" : "text-ink-2"}>{label}</span>
        <span className="font-mono text-[11px] text-ink-3">
          <b className={`text-[15px] font-medium tabular-nums ${warm ? "text-accent" : "text-ink"}`}>{ms}</b> ms
        </span>
      </div>
      <div className="mt-2 flex h-7 overflow-hidden rounded-md bg-[#151518]">
        {segs.map(([name, w], i) => {
          const at = (starts[i] / COLD_MS) * RACE_MS;
          const q = name === "Query";
          return (
            <span key={name} className="relative h-full border-r-2 border-[#0c0c0e] last:border-r-0" style={{ width: `${(w / COLD_MS) * 100}%` }}>
              <span
                className={`absolute inset-0 origin-left ${animate ? "grow-x" : ""} ${q ? "bg-accent" : "bg-[#34343a]"}`}
                style={animate ? { animationDelay: `${at}ms`, animationDuration: `${(w / COLD_MS) * RACE_MS}ms` } : undefined}
              />
              <span className={`relative block truncate px-1.5 font-mono text-[9.5px] leading-7 ${q ? "text-bg" : "text-ink-2"}`}>{name}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Counts up to `to` over `ms` once mounted; shows `to` straight away when not animating. */
function useCount(to: number, ms: number, animate: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const f = Math.min(1, (now - start) / ms);
      setValue(Math.round(to * f));
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms, animate]);
  return animate ? value : to;
}
