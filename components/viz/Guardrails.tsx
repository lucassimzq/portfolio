"use client";

import { useActive, usePhases } from "@/components/ui/hooks";

type Call = { tool: string; args: string; verdict: "allow" | "approve" | "block"; note: string };

const CALLS: Call[] = [
  { tool: "grafana.get_dashboard", args: '"payments"', verdict: "allow", note: "allowed · read" },
  { tool: "datadog.query_metrics", args: '"p99 latency"', verdict: "allow", note: "allowed · read" },
  { tool: "ops_portal.run_action", args: '"rerun_report"', verdict: "approve", note: "approved action" },
  { tool: "db.execute", args: '"DROP TABLE users"', verdict: "block", note: "blocked · behavioural boundary" },
];

// one phase per call, then hold, then reset
const PHASES = [1300, 1300, 1500, 2300, 1600, 500] as const;

const tone = {
  allow: "text-ok border-ok/40 bg-ok/10",
  approve: "text-warn border-warn/40 bg-warn/10",
  block: "text-err border-err/50 bg-err/10",
};

export default function Guardrails() {
  const [ref, active] = useActive<HTMLDivElement>(0.4);
  const phase = usePhases(PHASES, active, { staticPhase: 4 });
  const shown = phase >= 5 ? 0 : Math.min(phase + 1, CALLS.length);
  const current = phase < CALLS.length ? CALLS[phase] : null;
  const blocking = current?.verdict === "block" && active;

  return (
    <div ref={ref} className="flex h-full flex-col gap-4 py-4" aria-hidden>
      {/* agent → guardrail → mcp schematic */}
      <div className="relative flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em]">
        <Box>agent</Box>
        <div className="relative mx-2 h-px flex-1 bg-line-strong">
          {current && active && (
            <span
              key={`a-${phase}`}
              className={`absolute -top-[3px] h-[7px] w-[7px] rounded-full ${current.verdict === "block" ? "bg-err" : "bg-accent"}`}
              style={{ animation: `${current.verdict === "block" ? "guard-bounce" : "guard-pass-a"} 0.9s cubic-bezier(0.4,0,0.2,1) forwards` }}
            />
          )}
        </div>
        <div
          className={`relative rounded-md border px-2.5 py-1.5 transition-colors duration-300 ${
            blocking ? "border-err text-err" : "border-accent/60 text-accent"
          }`}
          style={{ animation: blocking ? "shake 0.45s 0.45s" : undefined }}
        >
          guardrails
        </div>
        <div className="relative mx-2 h-px flex-1 bg-line-strong">
          {current && active && current.verdict !== "block" && (
            <span
              key={`b-${phase}`}
              className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-accent"
              style={{ animation: "guard-pass-b 0.9s cubic-bezier(0.4,0,0.2,1) 0.85s both" }}
            />
          )}
        </div>
        <Box>mcp</Box>
      </div>

      <ol className="flex flex-col gap-2 rounded-xl border border-line bg-[#0c0c0e] p-3 font-mono text-[11.5px] leading-snug">
        {CALLS.map((c, i) => (
          <li
            key={c.tool}
            className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 transition-all duration-500 ${
              i < shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <span className="min-w-0 truncate text-ink-2">
              <span className="text-ink-3">›</span> {c.tool}
              <span className="text-ink-3">({c.args})</span>
            </span>
            <span className={`shrink-0 rounded-full border px-2 py-[1px] text-[10px] uppercase tracking-[0.1em] ${tone[c.verdict]}`}>
              {c.verdict === "block" ? "✗" : "✓"} {c.note}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-line-strong px-2.5 py-1.5 text-ink-2">{children}</div>;
}
