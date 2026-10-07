"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import SystemMesh, { FLOWS, type Flow } from "./SystemMesh";
import Magnetic from "@/components/ui/Magnetic";
import { ArrowDown, Download } from "@/components/ui/Icons";
import { useZonedTime } from "@/components/ui/hooks";
import { LINKS, PROFILE } from "@/lib/data";

// The headline is three claims; each one lights up its path on the system map.
const LINES: { flow: Flow; pre: string; em: string; post: string }[] = [
  { flow: "pay", pre: "I make ", em: "money", post: " move safely," },
  { flow: "query", pre: "", em: "queries", post: " run fast," },
  { flow: "agent", pre: "and ", em: "AI agents", post: " behave." },
];

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });
  const reduced = useReducedMotion();
  const [flow, setFlow] = useState<Flow>("pay");
  const [pinned, setPinned] = useState(0);
  const { time } = useZonedTime(PROFILE.timezone);

  // Cycle through the stories; a hover pins one for a while.
  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setTimeout(
      () => {
        const i = FLOWS.findIndex((f) => f.id === flow);
        setFlow(FLOWS[(i + 1) % FLOWS.length].id);
        setPinned(0);
      },
      pinned ? 9000 : 4400,
    );
    return () => window.clearTimeout(t);
  }, [flow, pinned, inView, reduced]);

  const select = (f: Flow, pin: boolean) => {
    setFlow(f);
    if (pin) setPinned((n) => n + 1);
  };

  return (
    <section ref={sectionRef} id="top" className="relative overflow-x-clip pt-28 sm:pt-32 lg:pt-36">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_40%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[680px] w-[680px] rounded-full bg-accent/[0.09] blur-[140px]"
      />

      <div className="shell relative grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="relative z-10 lg:col-span-7">
          <p className="fade-rise eyebrow flex flex-wrap items-center gap-x-3 gap-y-1" style={delay(0.05)}>
            <span className="live-dot shrink-0 text-ok" />
            <span className="text-ink-2">
              Open to senior <span className="hidden sm:inline">backend &amp; full-stack </span>roles
            </span>
            <span className="text-ink-3">
              · <span className="sm:hidden">AU / NZ</span>
              <span className="hidden sm:inline">Australia / New Zealand</span>
            </span>
          </p>

          <h1 className="display mt-7 text-[clamp(42px,4.9vw,84px)] [font-stretch:86%]">
            {LINES.map((l, i) => {
              const on = flow === l.flow;
              return (
                <span key={l.flow} className="line-mask">
                  <span className="line-rise" style={delay(0.15 + i * 0.1)}>
                    <span
                      onPointerEnter={() => select(l.flow, true)}
                      className={`transition-opacity duration-700 ${on ? "opacity-100" : "opacity-[0.42]"}`}
                    >
                      {l.pre}
                      <em
                        className={`serif-accent relative inline-block pr-[0.06em] text-[1.06em] transition-colors duration-700 ${
                          on ? "text-accent" : ""
                        }`}
                      >
                        {l.em}
                        <span
                          aria-hidden
                          className={`absolute bottom-[0.08em] left-0 h-[0.05em] w-full origin-left bg-accent transition-transform duration-700 ease-expo ${
                            on ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </em>
                      {l.post}
                    </span>
                  </span>
                </span>
              );
            })}
          </h1>

          <p className="fade-rise mt-8 max-w-[36rem] text-[17px] leading-relaxed text-ink-2 sm:text-[19px]" style={delay(0.55)}>
            <strong className="font-medium text-ink">Lucas Sim</strong>, backend engineer. {PROFILE.years} years
            shipping production systems across fintech, SaaS and AI platforms. Currently{" "}
            <span className="text-ink">{PROFILE.current.role}</span> at{" "}
            <span className="text-ink">{PROFILE.current.company}</span>, Kuala Lumpur.
          </p>

          <div className="fade-rise mt-10 flex flex-wrap items-center gap-3" style={delay(0.7)}>
            <Magnetic>
              <a href="#impact" className="btn btn-primary">
                See the impact <ArrowDown className="btn-icon" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={LINKS.resume} target="_blank" rel="noopener" className="btn btn-ghost">
                Résumé PDF <Download className="btn-icon" />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="fade-rise relative lg:col-span-5 lg:-mr-4" style={delay(0.45)}>
          <SystemMesh flow={flow} onFlow={select} />
        </div>
      </div>

      <div className="shell relative">
        <div
          className="fade-rise mt-16 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line py-6 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-3 md:mt-20 md:grid-cols-4"
          style={delay(0.95)}
        >
          <div>
            <span className="text-ink-2">{PROFILE.years} years</span> in production
          </div>
          <div>Go · PHP · Python · SQL</div>
          <div>Fintech · SaaS · AI platforms</div>
          <div className="md:text-right">
            Kuala Lumpur <span className="text-ink-2">{time}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
