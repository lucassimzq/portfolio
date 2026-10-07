"use client";

import Counter from "@/components/ui/Counter";
import { useActive, usePhases } from "@/components/ui/hooks";

const DOCS = ["bank_mar.pdf", "card_a_mar.pdf", "card_b_mar.pdf"];
const CATS = {
  Groceries: "#ff6a0a",
  Utilities: "#ffc2a1",
  Transport: "#5ee08f",
  Subscriptions: "#8b8bff",
  Food: "#ffc24b",
  Travel: "#ff5a5a",
  Health: "#7dd3fc",
  Shopping: "#c084fc",
} as const;
type Cat = keyof typeof CATS;

const ROWS: { doc: number; date: string; what: string; cat: Cat; amt: number; line: number }[] = [
  { doc: 0, date: "03 Mar", what: "Grocer", cat: "Groceries", amt: 142.3, line: 1 },
  { doc: 0, date: "05 Mar", what: "Electricity", cat: "Utilities", amt: 96.4, line: 3 },
  { doc: 0, date: "07 Mar", what: "Pharmacy", cat: "Health", amt: 38.6, line: 5 },
  { doc: 1, date: "08 Mar", what: "Ride-hailing", cat: "Transport", amt: 18.9, line: 0 },
  { doc: 1, date: "11 Mar", what: "Streaming", cat: "Subscriptions", amt: 54.9, line: 2 },
  { doc: 1, date: "12 Mar", what: "Bookstore", cat: "Shopping", amt: 64.2, line: 4 },
  { doc: 2, date: "14 Mar", what: "Coffee", cat: "Food", amt: 15.8, line: 1 },
  { doc: 2, date: "19 Mar", what: "Flights", cat: "Travel", amt: 620, line: 4 },
  { doc: 2, date: "22 Mar", what: "Hotel", cat: "Travel", amt: 412, line: 5 },
];
const TOTAL = ROWS.reduce((s, r) => s + r.amt, 0);
// running total after 0, 1, 2 and 3 statements
const SUMS = [0, ...[0, 1, 2].map((d) => ROWS.filter((r) => r.doc <= d).reduce((s, r) => s + r.amt, 0))];
const LINES = [88, 64, 80, 56, 74, 60];
// scan → extract, per statement, then total → hold → reset
const PHASES = [1300, 700, 1300, 700, 1300, 700, 2900, 500] as const;

const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function StatementPreview() {
  const [ref, active] = useActive<HTMLDivElement>(0.3);
  const phase = usePhases(PHASES, active, { staticPhase: 6 });
  const reset = phase === 7;
  const scanning = phase < 6 && phase % 2 === 0 && active ? phase / 2 : -1;
  const parsed = (doc: number) => !reset && (phase > doc * 2 || phase >= 6);
  const parsedDocs = DOCS.filter((_, i) => parsed(i)).length;
  const totalling = phase === 6;

  return (
    <div
      ref={ref}
      className="grid h-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 p-4 sm:grid-cols-[0.78fr_1.4fr] sm:grid-rows-1 sm:gap-4 sm:p-5"
      aria-hidden
    >
      {/* statements */}
      <div className="flex min-h-0 gap-2 sm:flex-col sm:gap-2.5">
        {DOCS.map((d, i) => {
          const isScanning = scanning === i;
          const done = parsed(i) && !isScanning;
          return (
            <div
              key={d}
              className={`relative h-[96px] min-w-0 flex-1 overflow-hidden rounded-lg border bg-[#ece8e1] px-2.5 py-2 transition-[border-color,box-shadow] duration-500 sm:h-auto ${
                isScanning ? "border-accent shadow-[0_0_0_3px_rgba(255,106,10,0.25)]" : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-2 font-mono text-[9px] text-[#55524d]">
                <span className="truncate">{d}</span>
                <span
                  className={`shrink-0 rounded-sm px-1 transition-colors duration-300 ${done ? "bg-[#1f7a46] text-white" : "bg-[#d9d4cb]"}`}
                >
                  {done ? (
                    <>
                      ✓<span className="hidden sm:inline"> parsed</span>
                    </>
                  ) : (
                    "PDF"
                  )}
                </span>
              </div>
              <div className="mt-2 space-y-[5px]">
                {LINES.map((w, j) => {
                  const hit = ROWS.some((r) => r.doc === i && r.line === j);
                  return (
                    <span
                      key={j}
                      className="block h-[3px] rounded-full transition-colors duration-300"
                      style={{
                        width: `${w}%`,
                        backgroundColor: hit && (isScanning || done) ? "rgba(255,106,10,0.85)" : "#cdc7bd",
                        transitionDelay: isScanning ? `${0.15 + j * 0.15}s` : "0s",
                      }}
                    />
                  );
                })}
              </div>
              {isScanning && <span className="pdf-scan absolute inset-x-0 h-6" />}
            </div>
          );
        })}
      </div>

      {/* consolidated ledger */}
      <div className="flex min-h-0 flex-col rounded-xl border border-line bg-[#0f0f12] p-3">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
          <span>consolidated · mar</span>
          <span className={parsedDocs === 3 ? "text-ok" : ""}>{parsedDocs}/3 parsed</span>
        </div>

        <ul className="mt-2.5 flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
          {ROWS.map((r, i) => {
            const on = parsed(r.doc);
            return (
              <li
                key={i}
                className="grid grid-cols-[3.2rem_1fr_auto] items-center gap-2 rounded-md px-1.5 py-[5px] font-mono text-[10.5px] transition-all duration-500 sm:py-[7px] sm:text-[11px]"
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "translateX(0)" : "translateX(-18px)",
                  transitionDelay: on ? `${(i % 3) * 110}ms` : "0ms",
                  backgroundColor: on && phase === r.doc * 2 + 1 ? "rgba(255,106,10,0.1)" : "transparent",
                }}
              >
                <span className="text-ink-3">{r.date}</span>
                <span className="flex min-w-0 items-center gap-1.5 truncate text-ink-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: CATS[r.cat] }} />
                  {r.what} <span className="hidden truncate text-ink-3 md:inline">· {r.cat}</span>
                </span>
                <span className="tabular-nums text-ink">−{money(r.amt)}</span>
              </li>
            );
          })}
        </ul>

        {/* spend split grows as each statement lands */}
        <div className="mt-2 flex h-1.5 shrink-0 overflow-hidden rounded-full bg-[#1b1b1f]">
          {ROWS.map((r, i) => (
            <span
              key={i}
              className="h-full transition-[width] duration-700 ease-expo"
              style={{
                width: parsed(r.doc) ? `${(r.amt / TOTAL) * 100}%` : "0%",
                backgroundColor: CATS[r.cat],
              }}
            />
          ))}
        </div>

        <div className="mt-2.5 flex shrink-0 items-baseline justify-between border-t border-line pt-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">total spend</span>
          <span
            className={`font-mono text-[15px] tabular-nums transition-colors duration-500 sm:text-[17px] ${totalling ? "text-ok" : "text-ink"}`}
          >
            RM{" "}
            {parsedDocs > 0 ? (
              <Counter
                key={parsedDocs}
                from={SUMS[parsedDocs - 1]}
                to={SUMS[parsedDocs]}
                duration={0.8}
                play
                ease="easeOut"
                format={money}
              />
            ) : (
              <span className="text-ink-3">—</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
