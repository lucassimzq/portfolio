"use client";

import { Fragment, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import OrgLogo from "@/components/site/OrgLogo";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { CONTRACT, EDUCATION, EXPERIENCE, SKILLS, type Role } from "@/lib/data";

// The rail runs from just before the first role to the start of next year.
const AX_START = 2018.6;
const AX_END = new Date().getFullYear() + 1;
const YEARS = Array.from({ length: Math.floor(AX_END) - 2019 }, (_, i) => 2019 + i);
const at = (year: number) => ((year - AX_START) / (AX_END - AX_START)) * 100;
const EXPO = [0.16, 1, 0.3, 1] as const;
const N = EXPERIENCE.length;
// Scroll distance given to each role while the rail is pinned.
const STEP_SVH = 60;
// The bullets shown per role; the rest live in the résumé.
const BULLETS = 3;

// Rail and label columns, shared by the axis, the rows and the detail panel.
const ROW_GRID = "grid grid-cols-[minmax(0,38%)_1fr] items-center gap-x-4 lg:grid-cols-12 lg:gap-x-5";
const LABEL_COL = "lg:col-span-4";
const RAIL_COL = "lg:col-span-7";

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

function Bullets({ lines }: { lines: string[] }) {
  return (
    <ul className="grid gap-2 text-[14px] leading-relaxed text-ink-2 max-sm:[&>li:nth-child(n+3)]:hidden sm:text-[15px]">
      {lines.map((h) => (
        <li key={h} className="flex gap-3.5">
          <span aria-hidden className="mt-[0.8em] h-px w-3 shrink-0 bg-accent/70" />
          <span>{emphasise(h)}</span>
        </li>
      ))}
    </ul>
  );
}

function RailRow({
  role,
  index,
  active,
  shown,
  reduced,
  onPick,
}: {
  role: Role;
  index: number;
  active: boolean;
  shown: boolean;
  reduced: boolean;
  onPick: (i: number) => void;
}) {
  const now = role.end === null;
  const left = at(role.start);
  const right = at(role.end ?? AX_END);
  // The result sits on whichever side of the bar has more room.
  const after = 100 - right > left;
  // Bars draw in career order, oldest first, so the rail reads left to right.
  const delay = reduced ? 0 : 0.1 + ((role.start - AX_START) / (AX_END - AX_START)) * 0.8;

  return (
    <li className="border-t border-line">
      <button
        type="button"
        onClick={() => onPick(index)}
        aria-current={active ? "step" : undefined}
        className={`group w-full py-2.5 text-left transition-opacity duration-500 lg:py-3 ${ROW_GRID} ${
          active ? "opacity-100" : "opacity-40 hover:opacity-75"
        }`}
      >
        <span className={`flex min-w-0 items-center gap-2.5 sm:gap-3 ${LABEL_COL}`}>
          <OrgLogo org={role.org} size={30} className={active ? "border-accent/60" : ""} />
          <span className="min-w-0">
            <span
              className={`serif-accent block truncate text-[17px] leading-tight transition-colors duration-500 sm:text-[21px] ${
                active ? "text-accent" : "text-ink"
              }`}
            >
              {role.company}
            </span>
            <span className="hidden truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3 sm:block">
              {role.role}
            </span>
          </span>
        </span>

        <span className={`relative block h-8 ${RAIL_COL}`} aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
          <m.span
            className={`absolute top-1/2 h-2.5 -translate-y-1/2 origin-left rounded-full transition-shadow duration-500 ${
              now ? "bg-gradient-to-r from-accent to-accent/20" : "bg-gradient-to-r from-accent/75 to-peach/70"
            } ${active ? "shadow-[0_0_18px_rgba(255,106,10,0.55)]" : ""}`}
            style={{ left: `${left}%`, width: `${right - left}%` }}
            initial={false}
            animate={{ scaleX: shown ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.9, ease: EXPO, delay: shown ? delay : 0 }}
          />
          {now && (
            <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%` }}>
              <span className="live-dot text-accent" />
            </span>
          )}
          <m.span
            className={`absolute top-1/2 hidden -translate-y-1/2 items-baseline gap-2 whitespace-nowrap sm:flex ${
              after ? "" : "flex-row-reverse"
            }`}
            style={after ? { left: `calc(${right}% + 12px)` } : { right: `calc(${100 - left}% + 14px)` }}
            initial={false}
            animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : after ? -8 : 8 }}
            transition={{ duration: reduced ? 0 : 0.6, ease: EXPO, delay: shown ? delay + 0.35 : 0 }}
          >
            <span className="text-[16px] font-medium tracking-[-0.02em] text-ink">{role.win.metric}</span>
            <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3 xl:inline">
              {role.period}
            </span>
          </m.span>
        </span>
      </button>
    </li>
  );
}

/** One role's story: the result on the left, the detail on the right. */
function Detail({ role }: { role: Role }) {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-x-5">
      <div className="lg:col-span-4">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {role.period} · {role.domain}
        </div>
        <div className="mt-2 text-[clamp(28px,3vw,44px)] font-medium leading-none tracking-[-0.04em] text-ink [font-stretch:88%]">
          {role.win.metric}
        </div>
        <div className="mt-2 text-[14px] text-ink-2">{role.win.label}</div>
      </div>
      <div className="lg:col-span-7">
        <Bullets lines={role.highlights.slice(0, BULLETS)} />
      </div>
    </div>
  );
}

/** A role's detail, fading through as the scroll passes its step, with the two columns at different depths. */
function PinnedDetail({ role, index, step }: { role: Role; index: number; step: MotionValue<number> }) {
  // One story at a time: each fades out before the next fades in. The first and last
  // roles stay up at the ends of the scroll.
  const fadeIn = index === 0 ? [-2, -1] : [index - 0.42, index - 0.12];
  const fadeOut = index === N - 1 ? [N + 1, N + 2] : [index + 0.12, index + 0.42];
  const opacity = useTransform(step, [...fadeIn, ...fadeOut], [0, 1, 1, 0]);
  const near = useTransform(step, [index - 0.5, index + 0.5], [48, -48]);
  const far = useTransform(step, [index - 0.5, index + 0.5], [16, -16]);
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? "hidden" : "visible"));

  return (
    <m.div className="absolute inset-0" style={{ opacity, visibility }}>
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-x-5">
        <m.div className="lg:col-span-4" style={{ y: far }}>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
            {role.period} · {role.domain}
          </div>
          <div className="mt-2 text-[clamp(28px,3vw,44px)] font-medium leading-none tracking-[-0.04em] text-ink [font-stretch:88%]">
            {role.win.metric}
          </div>
          <div className="mt-2 text-[14px] text-ink-2">{role.win.label}</div>
        </m.div>
        <m.div className="lg:col-span-7" style={{ y: near }}>
          <Bullets lines={role.highlights.slice(0, BULLETS)} />
        </m.div>
      </div>
    </m.div>
  );
}

function Axis() {
  return (
    <div className={ROW_GRID} aria-hidden>
      <span className={LABEL_COL} />
      <div className={`relative h-6 font-mono text-[10px] tracking-[0.1em] text-ink-3 sm:text-[10.5px] ${RAIL_COL}`}>
        {YEARS.map((y) => (
          <span key={y} className={`absolute bottom-1 -translate-x-1/2 ${y % 2 ? "max-lg:hidden" : ""}`} style={{ left: `${at(y)}%` }}>
            {y}
          </span>
        ))}
      </div>
    </div>
  );
}

function Toolbox() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-y border-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-center gap-4 py-4 text-left"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Kit</span>
        <span className="min-w-0 flex-1 text-[15px] text-ink-2 transition-colors duration-300 group-hover:text-ink">
          Full toolbox &amp; education
        </span>
        <span
          aria-hidden
          className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            open ? "border-accent text-accent" : "border-line-strong text-ink-3 group-hover:text-ink"
          }`}
        >
          <span className="absolute h-px w-2.5 bg-current" />
          <span className={`absolute h-2.5 w-px bg-current transition-transform duration-500 ease-expo ${open ? "scale-y-0" : ""}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EXPO }}
            className="overflow-hidden"
          >
            <dl className="grid gap-x-8 gap-y-3 pb-6 pt-1 text-[14.5px] sm:grid-cols-2 lg:grid-cols-3">
              {SKILLS.map((g) => (
                <div key={g.cat}>
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">{g.cat}</dt>
                  <dd className="mt-1 text-ink-2">
                    {g.items.map((s, i) => (
                      <Fragment key={typeof s === "string" ? s : s.label}>
                        {i > 0 && " · "}
                        {typeof s === "string" ? (
                          s
                        ) : (
                          <span>
                            {s.label} <span className="text-peach">({s.note})</span>
                          </span>
                        )}
                      </Fragment>
                    ))}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">Education</dt>
                {EDUCATION.map((e) => (
                  <dd key={e.degree} className="mt-1 text-ink-2">
                    {e.degree}, {e.school} · {e.year}
                  </dd>
                ))}
              </div>
            </dl>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The career rail. While pinned, scrolling walks down the roles one at a time: the
 * active bar lights up and its story slides through underneath, nothing to click.
 * With reduced motion every role's story is simply listed under its row.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();
  const pinned = !reduced;
  // Draw once; scrolling back up shouldn't erase the rail.
  const shown = useInView(railRef, { once: true, amount: 0.25 });
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const step = useTransform(scrollYProgress, (v) => v * (N - 1));
  const yearY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);
  useMotionValueEvent(step, "change", (v) => setActive(Math.min(N - 1, Math.max(0, Math.round(v)))));

  // A row tap scrolls to that role's step.
  const pick = (i: number) => {
    const el = sectionRef.current;
    if (!el || !pinned) return;
    const top = el.getBoundingClientRect().top + window.scrollY + (i / (N - 1)) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + 2, behavior: "smooth" });
  };

  const role = EXPERIENCE[active];

  return (
    <>
      <section
        ref={sectionRef}
        id="experience"
        className="relative"
        style={pinned ? { height: `${100 + (N - 1) * STEP_SVH}svh` } : undefined}
      >
        <div className={pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-12" : "py-20 md:py-28"}>
          {/* Parallax layer: the active role's start year, huge and faint, drifting slower than the page. */}
          {pinned && (
            <m.div
              aria-hidden
              style={{ y: yearY }}
              className="pointer-events-none absolute -right-[2vw] top-1/2 -translate-y-1/2 select-none"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={role.startYear}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -60 }}
                  transition={{ duration: 0.8, ease: EXPO }}
                  className="block text-[clamp(160px,30vw,460px)] font-medium leading-none tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_rgba(255,106,10,0.14)] [font-stretch:80%]"
                >
                  {role.startYear}
                </m.span>
              </AnimatePresence>
            </m.div>
          )}

          <div className="shell relative w-full">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
              <div>
                <Reveal y={12} className="eyebrow flex items-center gap-3">
                  <span className="text-accent">03</span>
                  <span className="h-px w-10 bg-line-strong" />
                  Career
                </Reveal>
                <SplitText
                  as="h2"
                  text="Eight years, *one changelog.*"
                  className="display mt-3 text-[clamp(34px,4.6vw,72px)] [font-stretch:88%]"
                />
              </div>
              {pinned && (
                <div className="flex items-center gap-1.5 pb-2" aria-hidden>
                  {EXPERIENCE.map((r, i) => (
                    <span
                      key={r.id}
                      className={`h-1 rounded-full transition-all duration-500 ease-expo ${
                        i === active ? "w-8 bg-accent" : i < active ? "w-3 bg-ink-3" : "w-3 bg-line-strong"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 lg:mt-8">
              <Axis />
              <ol ref={railRef} className="relative border-b border-line">
                {/* Year gridlines behind the rows */}
                <li aria-hidden className={`pointer-events-none absolute inset-0 ${ROW_GRID}`}>
                  <span className={LABEL_COL} />
                  <span className={`relative h-full ${RAIL_COL}`}>
                    {YEARS.map((y) => (
                      <span key={y} className="absolute inset-y-0 w-px bg-line/60" style={{ left: `${at(y)}%` }} />
                    ))}
                  </span>
                </li>
                {EXPERIENCE.map((r, i) =>
                  pinned ? (
                    <RailRow key={r.id} role={r} index={i} active={i === active} shown={shown} reduced={reduced} onPick={pick} />
                  ) : (
                    <Fragment key={r.id}>
                      <RailRow role={r} index={i} active shown={shown} reduced={reduced} onPick={pick} />
                      <li className="pb-8 pt-2">
                        <Detail role={r} />
                      </li>
                    </Fragment>
                  ),
                )}
              </ol>
            </div>

            {pinned && (
              <div className="relative mt-4 h-[clamp(250px,32svh,270px)] overflow-hidden pt-2 lg:mt-6" aria-live="polite">
                <span className="sr-only">
                  {role.company}, {role.role}, {role.period}
                </span>
                {EXPERIENCE.map((r, i) => (
                  <PinnedDetail key={r.id} role={r} index={i} step={step} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contract work sits outside the dated rail; the toolbox is reference, so it stays folded. */}
      <div className="shell pb-6 pt-10 md:pt-14">
        <Reveal className="grid gap-4 border-t border-line pt-6 lg:grid-cols-12 lg:gap-x-5">
          <div className="lg:col-span-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Also · {CONTRACT.location}</div>
            <div className="mt-2 text-[17px] text-ink">{CONTRACT.role}</div>
            <div className="serif-accent text-[18px] text-ink-2">{CONTRACT.company}</div>
          </div>
          <div className="lg:col-span-7">
            <Bullets lines={CONTRACT.highlights} />
          </div>
        </Reveal>
        <div className="mt-8">
          <Toolbox />
        </div>
      </div>
    </>
  );
}
