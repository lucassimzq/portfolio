"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useScroll, useSpring, type Variants } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import OrgLogo from "@/components/site/OrgLogo";
import { CONTRACT, EXPERIENCE, ORGS, type Role } from "@/lib/data";

// The branch line runs down this x offset.
const MAIN_X = 7.5;

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

function Bullets({ lines }: { lines: string[] }) {
  return (
    <ul className="mt-7 grid max-w-[46rem] gap-3.5 text-[15.5px] leading-relaxed text-ink-2">
      {lines.map((h) => (
        <m.li key={h} variants={item} className="flex gap-4">
          <span aria-hidden className="mt-[0.8em] h-px w-3.5 shrink-0 bg-accent/70" />
          <span>{emphasise(h)}</span>
        </m.li>
      ))}
    </ul>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <m.ul variants={item} className="mt-7 flex flex-wrap gap-2" aria-label="Stack">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 transition-colors duration-300 hover:border-accent/50 hover:text-ink"
        >
          {t}
        </li>
      ))}
    </m.ul>
  );
}

function RoleEntry({ role, index, active, lit }: { role: Role; index: number; active: boolean; lit: boolean }) {
  return (
    <li data-index={index} className="relative pb-20 pl-10 last:pb-6 sm:pl-14">
      {/* commit node */}
      <span
        aria-hidden
        className={`absolute top-[7px] h-[15px] w-[15px] -translate-x-1/2 rounded-full border-2 transition-all duration-500 ${
          active
            ? "scale-110 border-accent bg-accent shadow-[0_0_0_6px_rgba(255,106,10,0.16),0_0_24px_rgba(255,106,10,0.55)]"
            : lit
              ? "border-accent bg-bg"
              : "border-line-strong bg-bg"
        }`}
        style={{ left: MAIN_X }}
      />

      <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={list}>
        <m.div
          variants={item}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3"
        >
          <span className={`transition-colors duration-500 ${active ? "text-accent" : "text-ink-2"}`}>{role.period}</span>
          <span className="hidden h-px w-6 bg-line-strong sm:block" />
          <span>{role.domain}</span>
          <span className="hidden sm:inline">· {role.location}</span>
        </m.div>

        <m.h3
          variants={item}
          className="mt-4 text-[clamp(26px,2.9vw,42px)] font-medium leading-[1.04] tracking-[-0.035em] text-ink [font-stretch:92%]"
        >
          {role.role}
        </m.h3>
        <m.p variants={item} className="mt-3 flex items-center gap-3">
          <OrgLogo org={role.org} size={38} />
          <span className="serif-accent text-[clamp(22px,2.2vw,30px)] leading-tight text-ink-2">{role.company}</span>
        </m.p>

        {/* The one result to take away from this role, before the detail. */}
        <m.p
          variants={item}
          className="mt-6 inline-flex max-w-full flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-accent/30 bg-accent/[0.07] px-4 py-2.5"
        >
          <span className="text-[clamp(18px,1.7vw,22px)] font-medium tracking-[-0.025em] text-accent">{role.win.metric}</span>
          <span className="text-[14.5px] text-ink-2">{role.win.label}</span>
        </m.p>

        <Bullets lines={role.highlights} />
        <Tags tags={role.tags} />
      </m.div>
    </li>
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
          intro="From payment gateways to a 0‑to‑1 SaaS launch, a digital bank, and now AI platform work, newest first."
        />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Sticky readout: the start year rolls and the logo swaps as you move through the log. */}
          <aside className="hidden lg:col-span-4 lg:block" aria-hidden>
            <div className="sticky top-32">
              <div className="eyebrow">git log · main</div>
              <div className="mt-5 text-[clamp(96px,10.5vw,168px)] font-medium leading-none tracking-[-0.06em] text-ink [font-stretch:80%]">
                <Odometer value={role.startYear} />
              </div>
              <div className="relative mt-7 h-[64px] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.div
                    key={role.id}
                    initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -28, opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 top-0 flex items-center gap-4"
                  >
                    <OrgLogo org={role.org} size={56} />
                    <div className="min-w-0">
                      <div className="truncate text-[22px] font-medium tracking-[-0.02em] text-ink">{ORGS[role.org].name}</div>
                      <div className="mt-1 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-3">{role.period}</div>
                    </div>
                  </m.div>
                </AnimatePresence>
              </div>
              <div className="mt-8 flex items-center gap-1.5">
                {EXPERIENCE.map((r, i) => (
                  <span
                    key={r.id}
                    className={`h-1 rounded-full transition-all duration-500 ease-expo ${
                      i === active ? "w-9 bg-accent" : i < active ? "w-3 bg-ink-3" : "w-3 bg-line-strong"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {String(active + 1).padStart(2, "0")} / {String(EXPERIENCE.length).padStart(2, "0")}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <ol ref={listRef} className="relative">
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

            {/* Contract work sits outside the dated log. */}
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={list}
              className="mt-16 rounded-[22px] border border-line bg-card/60 p-6 sm:p-8"
            >
              <m.div variants={item} className="eyebrow flex items-center gap-3">
                <span className="text-accent">Also</span>
                <span className="h-px w-6 bg-line-strong" />
                Contract work · {CONTRACT.location}
              </m.div>
              <m.h3 variants={item} className="mt-4 text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.05] tracking-[-0.03em] text-ink">
                {CONTRACT.role}
              </m.h3>
              <m.p variants={item} className="serif-accent mt-1.5 text-[clamp(20px,1.9vw,26px)] leading-tight text-ink-2">
                {CONTRACT.company}
              </m.p>
              <Bullets lines={CONTRACT.highlights} />
              <Tags tags={CONTRACT.tags} />
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}
