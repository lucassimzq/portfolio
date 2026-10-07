"use client";

import { Fragment, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import OrgLogo from "@/components/site/OrgLogo";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { CONTRACT, EDUCATION, EXPERIENCE, SKILLS, type Role } from "@/lib/data";

// The rail runs from just before the first role to the start of next year.
const AX_START = 2018.6;
const AX_END = new Date().getFullYear() + 1;
const YEARS = Array.from({ length: Math.floor(AX_END) - 2019 }, (_, i) => 2019 + i);
const at = (year: number) => ((year - AX_START) / (AX_END - AX_START)) * 100;
const EXPO = [0.16, 1, 0.3, 1] as const;

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

/** Bullets and tags, folded away until a row is opened. */
function Details({ open, lines, tags }: { open: boolean; lines: string[]; tags: string[] }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: EXPO }}
          className="overflow-hidden"
        >
          <ul className="grid max-w-[46rem] gap-2.5 pb-6 pt-1 text-[15px] leading-relaxed text-ink-2 lg:ml-[calc(33.333%+10px)]">
            {lines.map((h) => (
              <li key={h} className="flex gap-4">
                <span aria-hidden className="mt-[0.8em] h-px w-3.5 shrink-0 bg-accent/70" />
                <span>{emphasise(h)}</span>
              </li>
            ))}
            <li className="mt-2 flex flex-wrap gap-2" aria-label="Stack">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3"
                >
                  {t}
                </span>
              ))}
            </li>
          </ul>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function Toggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
        open ? "border-accent text-accent" : "border-line-strong text-ink-3 group-hover:border-ink-3 group-hover:text-ink"
      }`}
    >
      <span className="absolute h-px w-2.5 bg-current" />
      <span className={`absolute h-2.5 w-px bg-current transition-transform duration-500 ease-expo ${open ? "scale-y-0" : ""}`} />
    </span>
  );
}

function RoleRow({ role, open, onToggle, shown, reduced }: { role: Role; open: boolean; onToggle: () => void; shown: boolean; reduced: boolean }) {
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
        onClick={onToggle}
        aria-expanded={open}
        className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-4 text-left lg:grid-cols-12 lg:gap-x-5 lg:py-5"
      >
        <span className="flex min-w-0 items-center gap-3 lg:col-span-4">
          <OrgLogo org={role.org} size={36} />
          <span className="min-w-0">
            <span className="serif-accent block truncate text-[22px] leading-tight text-ink transition-colors duration-300 group-hover:text-accent">
              {role.company}
            </span>
            <span className="block truncate font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
              {role.role}
            </span>
          </span>
        </span>
        <span className="lg:hidden">
          <Toggle open={open} />
        </span>

        <span className="relative col-span-2 block h-9 lg:col-span-7" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
          <m.span
            className={`absolute top-1/2 h-2.5 -translate-y-1/2 origin-left rounded-full ${
              now ? "bg-gradient-to-r from-accent to-accent/20" : "bg-gradient-to-r from-accent/75 to-peach/70"
            }`}
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
            className={`absolute top-1/2 flex -translate-y-1/2 items-baseline gap-2 whitespace-nowrap ${after ? "" : "flex-row-reverse"}`}
            style={after ? { left: `calc(${right}% + 12px)` } : { right: `calc(${100 - left}% + 14px)` }}
            initial={false}
            animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : after ? -8 : 8 }}
            transition={{ duration: reduced ? 0 : 0.6, ease: EXPO, delay: shown ? delay + 0.35 : 0 }}
          >
            <span className="text-[15px] font-medium tracking-[-0.02em] text-ink sm:text-[17px]">{role.win.metric}</span>
            <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3 xl:inline">
              {role.period}
            </span>
          </m.span>
        </span>

        <span className="hidden justify-end lg:col-span-1 lg:flex">
          <Toggle open={open} />
        </span>
      </button>
      <Details open={open} lines={role.highlights} tags={role.tags} />
    </li>
  );
}

export default function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  // Draw once; scrolling back up shouldn't erase the rail.
  const shown = useInView(ref, { once: true, amount: 0.25 });
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));

  return (
    <section id="experience" className="relative py-20 md:py-28">
      <div className="shell">
        <SectionHeading index="03" label="Career" title="Eight years, *one changelog.*" />

        {/* Year axis, aligned with the bars. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-5" aria-hidden>
          <div className="relative h-6 font-mono text-[10.5px] tracking-[0.1em] text-ink-3 lg:col-span-7 lg:col-start-5">
            {YEARS.map((y) => (
              <span
                key={y}
                className={`absolute bottom-1 -translate-x-1/2 ${y % 2 ? "max-sm:hidden" : ""}`}
                style={{ left: `${at(y)}%` }}
              >
                {y}
              </span>
            ))}
          </div>
        </div>

        <ol ref={ref} className="relative border-b border-line">
          {/* Year gridlines behind the rows */}
          <li aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-5">
            <span className="relative lg:col-span-7 lg:col-start-5">
              {YEARS.map((y) => (
                <span key={y} className="absolute inset-y-0 w-px bg-line/60" style={{ left: `${at(y)}%` }} />
              ))}
            </span>
          </li>
          {EXPERIENCE.map((r) => (
            <RoleRow key={r.id} role={r} open={open === r.id} onToggle={() => toggle(r.id)} shown={shown} reduced={reduced} />
          ))}

          {/* Contract work sits outside the dated rail. */}
          <li className="border-t border-line">
            <button
              type="button"
              onClick={() => toggle("contract")}
              aria-expanded={open === "contract"}
              className="group flex w-full items-center gap-4 py-4 text-left lg:py-5"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Also</span>
              <span className="min-w-0 flex-1 text-[15px] text-ink-2 transition-colors duration-300 group-hover:text-ink">
                {CONTRACT.role} · <span className="serif-accent text-[17px]">{CONTRACT.company}</span> · {CONTRACT.location}
              </span>
              <Toggle open={open === "contract"} />
            </button>
            <Details open={open === "contract"} lines={CONTRACT.highlights} tags={CONTRACT.tags} />
          </li>

          <li className="border-t border-line">
            <button
              type="button"
              onClick={() => toggle("toolbox")}
              aria-expanded={open === "toolbox"}
              className="group flex w-full items-center gap-4 py-4 text-left lg:py-5"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Kit</span>
              <span className="min-w-0 flex-1 text-[15px] text-ink-2 transition-colors duration-300 group-hover:text-ink">
                Full toolbox &amp; education
              </span>
              <Toggle open={open === "toolbox"} />
            </button>
            <AnimatePresence initial={false}>
              {open === "toolbox" && (
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
          </li>
        </ol>
      </div>
    </section>
  );
}
