"use client";

import { useActive, usePhases } from "@/components/ui/hooks";

type Status = "idle" | "processing" | "ok" | "failed";
// Same envelope the real demo broadcasts over its WebSocket hub.
type Event = { event: string; step?: number; message: string };

const STEPS = ["Check balance", "Check daily limit", "Verify receiver", "Process transfer", "Confirmation"];

// Each frame: how long it holds, every step's status, and the event that produced it.
// The daily-limit check fails once and is retried, like the randomised failures in the real demo.
type Frame = { ms: number; s: Status[]; ev?: Event };
const I: Status = "idle";
const P: Status = "processing";
const O: Status = "ok";
const F: Status = "failed";
const processing = (step: number): Event => ({ event: "step.processing", step, message: "Processing..." });
const success = (step: number): Event => ({ event: "step.success", step, message: `${STEPS[step]} passed` });
const FRAMES: Frame[] = [
  { ms: 800, s: [P, I, I, I, I], ev: processing(0) },
  { ms: 420, s: [O, I, I, I, I], ev: success(0) },
  { ms: 800, s: [O, P, I, I, I], ev: processing(1) },
  { ms: 1200, s: [O, F, I, I, I], ev: { event: "step.failed", step: 1, message: "Check daily limit failed" } },
  { ms: 800, s: [O, P, I, I, I], ev: processing(1) },
  { ms: 420, s: [O, O, I, I, I], ev: success(1) },
  { ms: 800, s: [O, O, P, I, I], ev: processing(2) },
  { ms: 420, s: [O, O, O, I, I], ev: success(2) },
  { ms: 900, s: [O, O, O, P, I], ev: processing(3) },
  { ms: 420, s: [O, O, O, O, I], ev: success(3) },
  { ms: 700, s: [O, O, O, O, P], ev: processing(4) },
  { ms: 2800, s: [O, O, O, O, O], ev: { event: "job.completed", message: "Transfer completed" } },
  { ms: 500, s: [I, I, I, I, I] },
];
const PHASES = FRAMES.map((f) => f.ms);
const DONE = FRAMES.length - 2;

const tone: Record<Status, string> = {
  idle: "border-line text-ink-3",
  processing: "border-accent/60 bg-accent/10 text-accent",
  ok: "border-ok/40 bg-ok/10 text-ok",
  failed: "border-err/50 bg-err/10 text-err",
};
const rowTone: Record<Status, string> = {
  idle: "border-line",
  processing: "border-accent/50 bg-accent/[0.06]",
  ok: "border-line",
  failed: "border-err/60 bg-err/[0.07]",
};
const word: Record<Status, string> = { idle: "idle", processing: "running", ok: "success", failed: "failed" };
const evTone = (t: string) =>
  t.endsWith("failed") ? "text-err" : t.startsWith("job") ? "text-ok" : t.endsWith("success") ? "text-ink" : "text-ink-2";

export default function TransferPreview() {
  const [ref, active] = useActive<HTMLDivElement>(0.3);
  const phase = usePhases(PHASES, active, { staticPhase: DONE });
  const frame = FRAMES[phase];
  const done = phase === DONE;
  const okCount = frame.s.filter((s) => s === "ok").length;
  const log = (phase === FRAMES.length - 1 ? [] : FRAMES.slice(0, phase + 1))
    .map((f, i) => ({ ev: f.ev, i }))
    .filter((e): e is { ev: Event; i: number } => !!e.ev)
    .slice(-7)
    .reverse();
  const latest = frame.ev;

  return (
    <div ref={ref} className="flex h-full flex-col gap-3 p-4 sm:gap-4 sm:p-5" aria-hidden>
      {/* the transfer */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-line-strong bg-[#111114] px-3.5 py-3">
        <Account label="from" id="•• 4821" balance={done ? "1,000.00" : "1,250.00"} />
        <div className="relative mx-1 h-px flex-1 bg-line-strong">
          <span
            className="absolute -top-[9px] rounded-full bg-accent px-1.5 font-mono text-[10px] leading-[18px] text-bg shadow-[0_0_16px_rgba(255,106,10,0.7)]"
            style={{
              left: done ? "calc(100% - 52px)" : "0%",
              opacity: phase >= DONE - 1 && phase <= DONE ? 1 : 0,
              transition: done ? "left 1.1s cubic-bezier(0.65,0,0.35,1), opacity .3s" : "opacity .3s",
            }}
          >
            RM 250
          </span>
        </div>
        <Account label="to" id="•• 1093" balance={done ? "830.00" : "580.00"} align="right" />
      </div>

      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-[1.1fr_1fr]">
        {/* pipeline */}
        <div className="flex min-h-0 flex-col rounded-xl border border-line bg-[#0f0f12] p-3">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
            <span>transfer job</span>
            <span className={done ? "text-ok" : ""}>{okCount}/5 steps</span>
          </div>
          <ol className="mt-2.5 flex min-h-0 flex-1 flex-col gap-1.5">
            {STEPS.map((label, i) => {
              const st = frame.s[i];
              return (
                <li
                  key={label}
                  className={`relative flex max-h-14 min-h-9 flex-1 items-center gap-3 overflow-hidden rounded-lg border px-2.5 transition-colors duration-300 ${rowTone[st]} ${
                    st === "failed" ? "shake" : ""
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[9px] transition-colors duration-300 ${tone[st]}`}
                  >
                    {st === "ok" ? "✓" : st === "failed" ? "✗" : st === "processing" ? (
                      <span className="spin h-2.5 w-2.5 rounded-full border border-accent border-t-transparent" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className={`flex-1 truncate text-[12.5px] transition-colors duration-300 ${st === "idle" ? "text-ink-3" : "text-ink"}`}>
                    {label}
                  </span>
                  <span
                    className={`hidden rounded-full border px-2 py-[1px] font-mono text-[9.5px] uppercase tracking-[0.1em] transition-colors duration-300 min-[420px]:inline ${tone[st]}`}
                  >
                    {st === "failed" ? "retry" : word[st]}
                  </span>
                  {st === "processing" && active && (
                    <span
                      key={phase}
                      className="step-progress absolute bottom-0 left-0 h-px bg-accent"
                      style={{ animationDuration: `${frame.ms}ms` }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* websocket feed */}
        <div className="hidden min-h-0 flex-col rounded-xl border border-line bg-[#0b0b0d] p-3 sm:flex">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
            <span>websocket · job 7f3a</span>
            <span className="flex items-center gap-1.5 text-ok">
              <span className="live-dot" style={{ width: 6, height: 6 }} /> live
            </span>
          </div>

          <pre
            key={phase}
            className="ws-line mt-2.5 rounded-lg border border-line bg-[#111114] px-3 py-2.5 font-mono text-[11px] leading-[1.65] text-ink-3"
          >
            {latest ? (
              <>
                {"{\n"}
                {'  "event": '}
                <span className={evTone(latest.event)}>&quot;{latest.event}&quot;</span>
                {",\n"}
                {'  "jobId": '}
                <span className="text-peach">&quot;7f3a…&quot;</span>
                {",\n"}
                {'  "message": '}
                <span className="text-ink">&quot;{latest.message}&quot;</span>
                {"\n}"}
              </>
            ) : (
              "waiting for events…"
            )}
          </pre>

          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">history</div>
          <ul className="mt-1.5 flex min-h-0 flex-1 flex-col gap-1 overflow-hidden font-mono text-[10.5px] leading-tight">
            {log.map(({ ev: e, i }) => (
              <li key={i} className={`ws-line truncate ${evTone(e.event)}`}>
                <span className="text-ink-3">← </span>
                {e.event}
                {e.step !== undefined && <span className="text-ink-3"> · {STEPS[e.step].toLowerCase()}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Account({ label, id, balance, align }: { label: string; id: string; balance: string; align?: "right" }) {
  return (
    <div className={`shrink-0 ${align === "right" ? "text-right" : ""}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
        {label} {id}
      </div>
      <div className="mt-0.5 font-mono text-[13px] tabular-nums text-ink">RM {balance}</div>
    </div>
  );
}
