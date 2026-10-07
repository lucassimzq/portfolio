"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import RelocationMap from "@/components/contact/RelocationMap";
import { ArrowUpRight, Check, Copy, Download, Github, Linkedin } from "@/components/ui/Icons";
import { useActive, useZonedTime } from "@/components/ui/hooks";
import { useEmail } from "@/components/site/Email";
import { LINKS, PROFILE } from "@/lib/data";
import { CITIES, HOME } from "@/lib/map";

/** "GMT+5:30" → minutes east of UTC */
function offsetMinutes(label: string) {
  const mt = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(label);
  if (!mt) return 0;
  return (mt[1] === "-" ? -1 : 1) * (Number(mt[2]) * 60 + Number(mt[3] ?? 0));
}

function Clock({ city, timeZone }: { city: string; timeZone: string }) {
  const { time } = useZonedTime(timeZone);
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">{city}</div>
      <div className="mt-1 font-mono text-[20px] tabular-nums tracking-[-0.02em] text-ink">{time}</div>
    </div>
  );
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      disabled={!email}
      onClick={() => {
        navigator.clipboard
          ?.writeText(email)
          .then(() => setCopied(true))
          .catch(() => {});
      }}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-2 transition-colors duration-300 hover:border-accent hover:text-ink"
      aria-label={copied ? "Email address copied" : "Copy email address"}
    >
      {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export default function Contact() {
  const [ref, inView] = useActive<HTMLElement>(0.2);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  // Cycle destinations while on screen; a hover or tap holds the current one for a while.
  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setTimeout(
      () => {
        setHeld(false);
        setActive((i) => (i + 1) % CITIES.length);
      },
      held ? 7000 : 2900,
    );
    return () => window.clearTimeout(t);
  }, [active, held, inView, reduced]);

  const email = useEmail();
  const city = CITIES[active];
  const home = useZonedTime(HOME.timeZone);
  const there = useZonedTime(city.timeZone);
  const diff = there.offset && home.offset ? (offsetMinutes(there.offset) - offsetMinutes(home.offset)) / 60 : null;
  const diffLabel = diff === null ? "" : diff === 0 ? "same time as KL" : `${diff > 0 ? "+" : ""}${diff} h from KL`;

  return (
    <section ref={ref} id="contact" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[20%] h-[640px] w-[640px] rounded-full bg-accent/[0.07] blur-[140px]"
      />
      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal y={12} className="eyebrow flex items-center gap-3">
            <span className="text-accent">06</span>
            <span className="h-px w-10 bg-line-strong" />
            Contact
          </Reveal>

          <h2 className="display mt-6 text-[clamp(52px,7vw,112px)] [font-stretch:86%]">
            <span className="sr-only">Next stop: Australia or New Zealand.</span>
            <span aria-hidden className="block">
              Next stop:
            </span>
            <span aria-hidden className="relative block h-[1.12em] overflow-hidden">
              <AnimatePresence initial={false}>
                <m.span
                  key={city.id}
                  className="serif-accent absolute left-0 top-0 block whitespace-nowrap text-accent"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  // far enough that descenders (the y in Sydney) clear the mask too
                  exit={{ y: "-150%" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                  {city.name}.
                </m.span>
              </AnimatePresence>
            </span>
          </h2>

          <Reveal delay={0.1} className="mt-8 max-w-[30rem] text-[17px] leading-relaxed text-ink-2">
            I&apos;m looking for <span className="text-ink">senior backend or full‑stack roles</span>{" "}
            in Australia or New
            Zealand. If your team needs someone who makes money move safely and queries run fast, let&apos;s talk.
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">Email</div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={email ? `mailto:${email}` : "#contact"}
                className="draw-underline min-h-[1.2em] text-[clamp(22px,2.4vw,34px)] font-medium tracking-[-0.025em] text-ink"
              >
                {email || "Email me"}
              </a>
              <CopyEmail email={email} />
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                <Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} className="btn-icon-x" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                <Github size={16} /> GitHub <ArrowUpRight size={14} className="btn-icon-x" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={LINKS.resume} target="_blank" rel="noopener" className="btn btn-sm btn-primary">
                Résumé PDF <Download size={16} className="btn-icon" />
              </a>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.25} className="mt-10 flex items-start gap-3 border-t border-line pt-6 text-[14px] leading-relaxed text-ink-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-0.5 shrink-0 text-accent" aria-hidden>
              <path d="M2.5 19h19M3 13.5l3.5 1.2L17 9.6c1.5-.7 3.2-.3 3.6.6.4.8-.4 1.9-1.9 2.6L8.4 17.7 4.4 16.3 3 13.5Z" />
              <path d="m10.5 11.5-4-5 2-.8 6.3 3.2" />
            </svg>
            <span>{PROFILE.workAuth}</span>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <RelocationMap
            active={active}
            shown={inView}
            onPick={(i) => {
              setActive(i);
              setHeld(true);
            }}
          />

          <div className="mt-6 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
            <div className="col-span-2">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">Route</div>
              <div className="mt-1 flex items-baseline gap-3 font-mono text-[20px] tracking-[-0.02em] text-ink">
                {HOME.code}
                <span className="text-accent">→</span>
                <span className="relative inline-block h-[1.2em] w-[3.2ch] overflow-hidden align-bottom">
                  <AnimatePresence initial={false}>
                    <m.span
                      key={city.code}
                      className="absolute left-0 top-0"
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {city.code}
                    </m.span>
                  </AnimatePresence>
                </span>
                <span className="text-[12px] uppercase tracking-[0.12em] text-ink-3">
                  {city.km.toLocaleString("en-US")} km
                </span>
              </div>
            </div>
            <Clock city="Kuala Lumpur" timeZone={HOME.timeZone} />
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">{city.name}</div>
              <div className="mt-1 font-mono text-[20px] tabular-nums tracking-[-0.02em] text-ink">{there.time}</div>
              <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">{diffLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
