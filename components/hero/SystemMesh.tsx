"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, m, useMotionValue, useSpring } from "motion/react";
import { routePath, type Pt } from "@/components/viz/geometry";
import { useActive } from "@/components/ui/hooks";

export type Flow = "pay" | "query" | "agent";

export const FLOWS: { id: Flow; label: string }[] = [
  { id: "pay", label: "Payments" },
  { id: "query", label: "Queries" },
  { id: "agent", label: "AI agents" },
];

const VB = { w: 640, h: 490 };

type NodeDef = { x: number; y: number; label: string; flows: Flow[]; fact: string; where: string };

// Each node doubles as a resume entry: hover it to read what happened there.
const NODES: Record<string, NodeDef> = {
  client: { x: 56, y: 170, label: "client", flows: ["pay", "query"], fact: "That's you. Every packet on this map is a story from my resume. Hover the nodes.", where: "You are here" },
  gateway: { x: 180, y: 170, label: "api-gateway", flows: ["pay", "query"], fact: "High-concurrency Go microservices for digital banking, built for high availability and high-volume financial traffic.", where: "GXBank" },
  identity: { x: 180, y: 60, label: "identity · sso", flows: ["pay"], fact: "A centralised Identity Server and auth package, with QR-based login across products.", where: "qBayar" },
  onboard: { x: 322, y: 170, label: "onboarding", flows: ["pay"], fact: "A critical race condition in the onboarding flow, resolved with Redis-based mutex locking.", where: "GXBank" },
  redis: { x: 458, y: 170, label: "redis · mutex", flows: ["pay"], fact: "Hash slot distribution optimised to reduce hotspotting as traffic grew.", where: "GXBank" },
  ledger: { x: 584, y: 170, label: "ledger", flows: ["pay"], fact: "Money movement that stays correct under concurrent updates, where financial state must stay consistent.", where: "Contract · casino platform" },
  portal: { x: 322, y: 290, label: "ops-portal", flows: ["query", "agent"], fact: "Heavy platform queries cut from around 2 minutes to under 10 seconds.", where: "YTL AI Labs" },
  postgres: { x: 584, y: 290, label: "postgres", flows: ["pay", "query"], fact: "A 20 million row table migrated with zero external downtime.", where: "YTL AI Labs" },
  agent: { x: 56, y: 410, label: "ai-agent", flows: ["agent"], fact: "Teammates pull data and run approved actions through an agent instead of only using the UI.", where: "YTL AI Labs" },
  guard: { x: 190, y: 410, label: "guardrails", flows: ["agent"], fact: "Guardrails beyond simple permission checks: behavioural boundaries for safer production use.", where: "YTL AI Labs" },
  mcp: { x: 322, y: 410, label: "mcp-server", flows: ["agent"], fact: "MCP built for the internal operational portal.", where: "YTL AI Labs" },
  datadog: { x: 572, y: 362, label: "datadog", flows: ["agent"], fact: "Existing market MCP servers (Datadog, Grafana, GitHub, cloud) wired into day-to-day workflows.", where: "YTL AI Labs" },
  grafana: { x: 572, y: 410, label: "grafana", flows: ["agent"], fact: "Existing market MCP servers (Datadog, Grafana, GitHub, cloud) wired into day-to-day workflows.", where: "YTL AI Labs" },
  github: { x: 572, y: 458, label: "github", flows: ["agent"], fact: "Existing market MCP servers (Datadog, Grafana, GitHub, cloud) wired into day-to-day workflows.", where: "YTL AI Labs" },
};

const ROUTES: { flow: Flow; pts: Pt[]; packets: number; dur: number }[] = [
  { flow: "pay", pts: [[56, 170], [584, 170], [584, 290]], packets: 3, dur: 4.6 },
  { flow: "pay", pts: [[56, 170], [180, 170], [180, 60]], packets: 1, dur: 3.1 },
  { flow: "query", pts: [[56, 170], [180, 170], [180, 290], [584, 290]], packets: 2, dur: 3.4 },
  { flow: "agent", pts: [[56, 410], [322, 410], [322, 290]], packets: 1, dur: 3.6 },
  { flow: "agent", pts: [[56, 410], [446, 410], [446, 362], [572, 362]], packets: 1, dur: 4.2 },
  { flow: "agent", pts: [[56, 410], [572, 410]], packets: 1, dur: 3.9 },
  { flow: "agent", pts: [[56, 410], [446, 410], [446, 458], [572, 458]], packets: 1, dur: 4.4 },
];

const BUILT = ROUTES.map((r) => ({ ...r, ...routePath(r.pts) }));
// The bad call walks up to the guardrail and gets bounced back.
const BLOCKED = { d: "M56 410 L176 410 L56 410", len: 240, dur: 3.2 };

const CALLOUTS: { flow: Flow; x: number; y: number; text: string; tone?: "err" | "ok"; flash?: boolean }[] = [
  { flow: "pay", x: 458, y: 128, text: "mutex acquired · no double write", tone: "ok" },
  { flow: "query", x: 330, y: 248, text: "~2 min → <10 s", tone: "ok" },
  { flow: "agent", x: 176, y: 368, text: "DROP TABLE · blocked", tone: "err", flash: true },
];

const nodeWidth = (label: string) => label.length * 6.6 + 26;

// The nodes share one tab stop; arrow keys move between them.
const KEYS = Object.keys(NODES);
const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

function packetStyle(len: number, dur: number, i: number, n: number, dash = 18): CSSProperties {
  // px units matter: Chrome won't interpolate unitless numbers substituted via var()
  return {
    "--dash": `${dash}px`,
    "--len": `${len}px`,
    "--dur": `${dur}s`,
    "--delay": `${(-dur * i) / n - dur * 0.13}s`,
  } as CSSProperties;
}

export default function SystemMesh({
  flow,
  onFlow,
}: {
  flow: Flow;
  onFlow: (f: Flow, pin: boolean) => void;
}) {
  const [ref, inView] = useActive<HTMLDivElement>(0.15);
  const [hover, setHover] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState(KEYS[0]);

  // Subtle 3D tilt toward the pointer
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    setHover(null);
  };

  const onNodeKey = (e: React.KeyboardEvent<SVGGElement>, key: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setHover((h) => (h === key ? null : key));
      return;
    }
    const i = KEYS.indexOf(key);
    const next =
      e.key in STEP ? KEYS[(i + STEP[e.key] + KEYS.length) % KEYS.length] : e.key === "Home" ? KEYS[0] : e.key === "End" ? KEYS.at(-1) : null;
    if (!next) return;
    e.preventDefault();
    e.currentTarget.ownerSVGElement?.querySelector<SVGGElement>(`[data-key="${next}"]`)?.focus();
  };

  const hovered = hover ? NODES[hover] : null;

  return (
    <div ref={ref} className="relative" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
        <span className="flex items-center gap-2">
          <span className="live-dot text-accent" style={{ width: 6, height: 6 }} />
          system map
        </span>
        <span className="hidden sm:inline">hover a node</span>
      </div>

      <m.div style={{ rotateX, rotateY, transformPerspective: 1100 }} className="relative">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className={`mesh block h-auto w-full overflow-visible ${inView ? "" : "paused"}`}
          role="group"
          aria-label="Animated system map. Requests flow through payment, query and AI agent paths. Each node holds a resume highlight; use the arrow keys to move between them."
        >
          {/* base wiring */}
          {BUILT.map((r, i) => (
            <path key={`base-${i}`} d={r.d} className="mesh-edge" />
          ))}

          {/* per-flow highlight + packets */}
          {FLOWS.map(({ id }) => (
            <g key={id} className="mesh-flow" data-on={flow === id}>
              {BUILT.filter((r) => r.flow === id).map((r, i) => (
                <path key={`on-${i}`} d={r.d} className="mesh-edge-on" />
              ))}
              {BUILT.filter((r) => r.flow === id).flatMap((r, ri) =>
                Array.from({ length: r.packets }, (_, i) => (
                  <g key={`p-${ri}-${i}`}>
                    <path d={r.d} className="packet" stroke="var(--accent)" strokeWidth={7} strokeOpacity={0.18} style={packetStyle(r.len, r.dur, i, r.packets)} />
                    <path d={r.d} className="packet" stroke="var(--accent)" strokeWidth={2.4} style={packetStyle(r.len, r.dur, i, r.packets)} />
                  </g>
                )),
              )}
              {id === "agent" && (
                <path
                  d={BLOCKED.d}
                  className="packet packet-blocked"
                  strokeWidth={2.6}
                  style={packetStyle(BLOCKED.len, BLOCKED.dur, 0, 1, 16)}
                />
              )}
            </g>
          ))}

          {/* nodes */}
          {Object.entries(NODES).map(([key, n]) => {
            const w = nodeWidth(n.label);
            const on = n.flows.includes(flow);
            return (
              <g
                key={key}
                className="mesh-node"
                data-on={on}
                transform={`translate(${n.x} ${n.y})`}
                data-key={key}
                tabIndex={key === focusKey ? 0 : -1}
                role="button"
                aria-label={`${n.label}: ${n.fact} (${n.where})`}
                onPointerEnter={() => setHover(key)}
                onFocus={() => {
                  setHover(key);
                  setFocusKey(key);
                }}
                onBlur={() => setHover(null)}
                onKeyDown={(e) => onNodeKey(e, key)}
                onClick={() => setHover((h) => (h === key ? null : key))}
              >
                <rect x={-w / 2} y={-15} width={w} height={30} rx={8} />
                <text textAnchor="middle" dy="0.35em" className="font-mono" fontSize={11}>
                  {n.label}
                </text>
              </g>
            );
          })}

          {/* callouts for the active flow */}
          {CALLOUTS.map((c) => {
            const w = c.text.length * 6.2 + 34;
            return (
              <g key={c.text} className="mesh-badge" data-on={flow === c.flow} transform={`translate(${c.x} ${c.y})`}>
                <g
                  className={c.flash ? "mesh-flash" : undefined}
                  style={c.flash ? ({ "--dur": `${BLOCKED.dur}s`, "--delay": `${-BLOCKED.dur * 0.13}s` } as CSSProperties) : undefined}
                >
                  <rect
                    x={-w / 2}
                    y={-12}
                    width={w}
                    height={24}
                    rx={12}
                    fill={c.tone === "err" ? "rgba(255,90,90,0.12)" : "rgba(94,224,143,0.1)"}
                    stroke={c.tone === "err" ? "rgba(255,90,90,0.55)" : "rgba(94,224,143,0.45)"}
                  />
                  <circle cx={-w / 2 + 14} cy={0} r={3} fill={c.tone === "err" ? "var(--err)" : "var(--ok)"} />
                  <text x={6} dy="0.35em" textAnchor="middle" className="font-mono" fontSize={10.5} fill={c.tone === "err" ? "#ffb3b3" : "#b9f5cf"}>
                    {c.text}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {hovered && (
            <m.div
              key={hover}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute z-20 w-[min(280px,80vw)] rounded-xl border border-line-strong bg-[#121214]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur"
              style={tooltipPosition(hovered)}
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">{hovered.where}</div>
              <p className="mt-1.5 text-[14px] leading-snug text-ink">{hovered.fact}</p>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>

      <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Highlight a flow">
        {FLOWS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={flow === f.id}
            onClick={() => onFlow(f.id, true)}
            onPointerEnter={() => onFlow(f.id, true)}
            className={`group flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 ${
              flow === f.id ? "border-accent/60 bg-accent/10 text-ink" : "border-line text-ink-3 hover:text-ink-2"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full transition-colors ${flow === f.id ? "bg-accent" : "bg-ink-3"}`} />
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function tooltipPosition(n: NodeDef): CSSProperties {
  const left = (n.x / VB.w) * 100;
  const top = (n.y / VB.h) * 100;
  const below = n.y < 120;
  const shift = n.x < 150 ? "0%" : n.x > 480 ? "-100%" : "-50%";
  // `translate` (not `transform`) so it composes with motion's own transform
  return {
    left: `${left}%`,
    top: `${top}%`,
    translate: `${shift} ${below ? "28px" : "calc(-100% - 26px)"}`,
  };
}
