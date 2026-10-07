"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useScroll, useSpring, type Variants } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { EXPERIENCE, type Role } from "@/lib/data";

// Main branch sits at x=7.5, the side branch one lane over.
const MAIN_X = 7.5;
const SIDE_X = 35.5;

/** Start year of the role at `i`; side work inherits the role above it. */
function yearAt(i: number) {
  for (let j = i; j >= 0; j--) {
    const y = EXPERIENCE[j].startYear;
    if (y !== null) return y;
  }
  return 0;
}

function emphasise(text: string) {
  return text.split(/(\*[^*]+\*)/).map((chunk, i) =>
    chunk.startsWith("*") ? (
      <strong key={i} className="font-medium text-ink">
        {chunk.slice(1, -1)}
      </strong>
    ) : (
      <Fragment key={i}>{chunk}</Fragment>
    ),
  );
}

/** Digits roll like a split-flap counter when the value changes. */
function Odometer({ value }: { value: number }) {
  const digits = String(value).split("");
  return (
    <span className="inline-flex tabular-nums" role="img" aria-label={String(value)}>
      {digits.map((d, i) => (
        <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden leading-none">
          <span
            className="flex flex-col transition-transform duration-[1100ms] ease-expo"
            style={{ transform: `translateY(-${Number(d) * 10}%)`, transitionDelay: `${(digits.length - i) * 70}ms` }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n} className="block h-[1em] leading-none">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const item: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function RoleEntry({ role, index, active, lit }: { role: Role; index: number; active: boolean; lit: boolean }) {
  const side = !!role.side;
  return (
    <li data-index={index} className={`relative pb-20 last:pb-6 ${side ? "pl-[64px] sm:pl-[76px]" : "pl-10 sm:pl-14"}`}>
      {side && <Branch lit={lit} />}

      {/* commit node */}
      <span
        aria-hidden
        className={`absolute top-[7px] h-[15px] w-[15px] -translate-x-1/2 rounded-full border-2 transition-all duration-500 ${
          active
            ? "scale-110 border-accent bg-accent shadow-[0_0_0_6px_rgba(255,106,10,0.16),0_0_24px_rgba(255,106,10,0.55)]"
            : lit
              ? "border-accent bg-bg"
              : "border-line-strong bg-bg"
        } ${side ? "border-dashed" : ""}`}
        style={{ left: side ? SIDE_X : MAIN_X }}
      />

      <m.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={list}
        className={side ? "rounded-[22px] border border-dashed border-line-strong bg-card/50 p-6 sm:p-8" : ""}
      >
        <m.div
          variants={item}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3"
        >
          <span className={`transition-colors duration-500 ${active ? "text-accent" : "text-ink-2"}`}>{role.period}</span>
          <span className="hidden h-px w-6 bg-line-strong sm:block" />
          <span>{role.domain}</span>
          <span className="hidden sm:inline">· {role.location}</span>
          {side && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent/50 px-2.5 py-0.5 text-accent">
              <BranchIcon /> side branch
            </span>
          )}
        </m.div>

        <m.h3
          variants={item}
          className="mt-4 text-[clamp(26px,2.9vw,42px)] font-medium leading-[1.04] tracking-[-0.035em] text-ink [font-stretch:92%]"
        >
          {role.role}
        </m.h3>
        <m.p variants={item} className="serif-accent mt-1.5 text-[clamp(22px,2.2vw,30px)] leading-tight text-ink-2">
          {role.company}
        </m.p>

        <ul className="mt-7 grid max-w-[46rem] gap-3.5 text-[15.5px] leading-relaxed text-ink-2">
          {role.highlights.map((h) => (
            <m.li key={h} variants={item} className="flex gap-4">
              <span aria-hidden className="mt-[0.8em] h-px w-3.5 shrink-0 bg-accent/70" />
              <span>{emphasise(h)}</span>
            </m.li>
          ))}
        </ul>

        <m.ul variants={item} className="mt-7 flex flex-wrap gap-2" aria-label="Stack">
          {role.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 transition-colors duration-300 hover:border-accent/50 hover:text-ink"
            >
              {t}
            </li>
          ))}
        </m.ul>
      </m.div>
    </li>
  );
}

/** A dashed lane that forks off main above the entry and merges back below it. */
function Branch({ lit }: { lit: boolean }) {
  const stroke = lit ? "var(--accent)" : "var(--border-strong)";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-12">
      <svg className="absolute -top-14 left-0 h-[78px] w-12 overflow-visible" viewBox="0 0 48 78" fill="none">
        <path
          d={`M${MAIN_X} 0 C${MAIN_X} 40 ${SIDE_X} 34 ${SIDE_X} 78`}
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="4 5"
          className="transition-[stroke] duration-500"
        />
      </svg>
      <span
        className="absolute bottom-[70px] top-[22px] border-l-[1.5px] border-dashed transition-colors duration-500"
        style={{ left: SIDE_X - 0.75, borderColor: stroke }}
      />
      <svg className="absolute bottom-0 left-0 h-[70px] w-12 overflow-visible" viewBox="0 0 48 70" fill="none">
        <path
          d={`M${SIDE_X} 0 C${SIDE_X} 40 ${MAIN_X} 30 ${MAIN_X} 70`}
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="4 5"
          className="transition-[stroke] duration-500"
        />
      </svg>
    </span>
  );
}

function BranchIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="4" cy="3" r="1.8" />
      <circle cx="4" cy="13" r="1.8" />
      <circle cx="12" cy="5" r="1.8" />
      <path d="M4 4.8v6.4M12 6.8c0 3-8 2-8 4.4" />
    </svg>
  );
}

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 55%", "end 55%"] });
  const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-42% 0px -52% 0px" },
    );
    el.querySelectorAll("[data-index]").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  const role = EXPERIENCE[active];

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          index="03"
          label="Experience"
          title="Eight years, *one changelog.*"
          intro="From payment gateways to a 0‑to‑1 SaaS launch, a digital bank, and now AI platform work, newest first. The dashed branch is after‑hours contract work."
        />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Sticky readout: the start year rolls as you move through the log. */}
          <aside className="hidden lg:col-span-4 lg:block" aria-hidden>
            <div className="sticky top-32">
              <div className="eyebrow">git log · main</div>
              <div className="mt-5 text-[clamp(96px,10.5vw,168px)] font-medium leading-none tracking-[-0.06em] text-ink [font-stretch:80%]">
                <Odometer value={yearAt(active)} />
              </div>
              <div className="relative mt-6 h-[72px] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.div
                    key={role.id}
                    initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -28, opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 top-0"
                  >
                    <div className="text-[22px] font-medium tracking-[-0.02em] text-ink">{role.company}</div>
                    <div className="mt-1 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-3">{role.period}</div>
                  </m.div>
                </AnimatePresence>
              </div>
              <div className="mt-8 flex items-center gap-1.5">
                {EXPERIENCE.map((r, i) => (
                  <span
                    key={r.id}
                    className={`h-1 rounded-full transition-all duration-500 ease-expo ${
                      i === active ? "w-9 bg-accent" : i < active ? "w-3 bg-ink-3" : "w-3 bg-line-strong"
                    } ${r.side ? "opacity-60" : ""}`}
                  />
                ))}
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {String(active + 1).padStart(2, "0")} / {String(EXPERIENCE.length).padStart(2, "0")}
              </div>
            </div>
          </aside>

          <ol ref={listRef} className="relative lg:col-span-8">
            {/* main branch: a faint track plus the lit part that follows your scroll */}
            <span aria-hidden className="absolute bottom-0 top-3 w-px bg-line" style={{ left: MAIN_X - 0.5 }} />
            <m.span
              aria-hidden
              className="absolute bottom-0 top-3 w-px origin-top bg-gradient-to-b from-accent via-accent to-peach"
              style={{ left: MAIN_X - 0.5, scaleY: rail }}
            />
            {EXPERIENCE.map((r, i) => (
              <RoleEntry key={r.id} role={r} index={i} active={i === active} lit={i <= active} />
            ))}
            <li className="relative pl-10 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:pl-14">
              <span
                aria-hidden
                className="absolute top-[3px] h-[11px] w-[11px] -translate-x-1/2 rounded-full border-2 border-line-strong bg-bg"
                style={{ left: MAIN_X }}
              />
              Nov 2018 · initial commit
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
