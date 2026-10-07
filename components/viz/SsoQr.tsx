"use client";

import { useActive, usePhases } from "@/components/ui/hooks";
import { hash01 } from "./geometry";

const SIZE = 21;

function isFinder(r: number, c: number) {
  const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
  return inBox(0, 0) || inBox(0, SIZE - 7) || inBox(SIZE - 7, 0);
}

function finderDark(r: number, c: number) {
  const r0 = r < 7 ? 0 : SIZE - 7;
  const c0 = c < 7 ? 0 : SIZE - 7;
  const y = r - r0;
  const x = c - c0;
  const ring = x === 0 || x === 6 || y === 0 || y === 6;
  const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
  return ring || core;
}

// Decorative only: random modules + finder patterns, so it never decodes to anything.
const MODULES = (() => {
  const out: { r: number; c: number; finder: boolean; sx: number; sy: number; d: number }[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const i = r * SIZE + c;
      const finder = isFinder(r, c);
      const separator = !finder && ((r === 7 && (c < 8 || c > SIZE - 9)) || (c === 7 && (r < 8 || r > SIZE - 9)) || (c === SIZE - 8 && r < 8));
      const dark = finder ? finderDark(r, c) : !separator && hash01(i) > 0.52;
      if (!dark) continue;
      out.push({
        r,
        c,
        finder,
        sx: Math.round((hash01(i + 900) - 0.5) * 80),
        sy: Math.round((hash01(i + 1900) - 0.5) * 80),
        d: Math.round(hash01(i + 2900) * 700) / 1000,
      });
    }
  }
  return out;
})();

const PRODUCTS = ["web app", "portal", "back office"];

// assemble → scan → signed in → reset
const PHASES = [1500, 1300, 2300, 600] as const;

export default function SsoQr() {
  const [ref, active] = useActive<HTMLDivElement>(0.4);
  const phase = usePhases(PHASES, active, { staticPhase: 2 });
  const built = (phase === 0 && active) || phase === 1 || phase === 2;
  const scanning = phase === 1 && active;
  const signed = phase === 2;

  return (
    <div ref={ref} className="flex h-full items-center gap-5 py-4" aria-hidden>
      <div className="relative aspect-square w-[118px] shrink-0 rounded-lg bg-[#efe9df] p-2">
        <div className="relative h-full w-full">
          {MODULES.map((mod) => (
            <span
              key={`${mod.r}-${mod.c}`}
              className="absolute bg-[#0a0a0b]"
              style={{
                left: `${(mod.c / SIZE) * 100}%`,
                top: `${(mod.r / SIZE) * 100}%`,
                width: `${100 / SIZE + 0.4}%`,
                height: `${100 / SIZE + 0.4}%`,
                opacity: built || mod.finder ? 1 : 0,
                transform: built || mod.finder ? "none" : `translate(${mod.sx}px, ${mod.sy}px) scale(0.3)`,
                transition: `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${built ? mod.d : 0}s, opacity 0.4s ease ${built ? mod.d : 0}s`,
              }}
            />
          ))}
          <span
            className="absolute inset-x-[-6px] h-[2px] bg-accent shadow-[0_0_12px_2px_rgba(255,106,10,0.7)]"
            style={{ top: 0, opacity: scanning ? 1 : 0, animation: scanning ? "qr-scan 1.2s ease-in-out forwards" : "none" }}
          />
        </div>
        <span
          className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-ok text-[15px] font-bold text-bg shadow-lg transition-all duration-500 ease-expo ${
            signed ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          ✓
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 font-mono text-[11px]">
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-3">identity server</span>
        {PRODUCTS.map((p, i) => (
          <div
            key={p}
            className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 transition-all duration-500 ${
              signed ? "border-ok/40 bg-ok/10 text-ink" : "border-line text-ink-3"
            }`}
            style={{ transitionDelay: signed ? `${0.25 + i * 0.15}s` : "0s" }}
          >
            <span className="truncate">{p}</span>
            <span className={signed ? "text-ok" : "text-ink-3"}>{signed ? "signed in" : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
