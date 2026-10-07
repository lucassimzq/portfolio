"use client";

import { m, type Variants } from "motion/react";
import { ArrowUp } from "@/components/ui/Icons";
import { useZonedTime } from "@/components/ui/hooks";
import { LINKS, PROFILE } from "@/lib/data";

const WORD = "Lucas Sim";
const letters: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.045 } } };
const letter: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

export default function Footer({ year }: { year: number }) {
  const { time } = useZonedTime(PROFILE.timezone);

  return (
    <footer className="relative overflow-hidden border-t border-line pt-14">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <p className="text-[clamp(22px,2.2vw,30px)] font-medium leading-tight tracking-[-0.025em] text-ink">
            Thanks for scrolling this far.{" "}
            <span className="serif-accent text-ink-2">The inbox is open.</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-2">
            <a href={LINKS.email} className="draw-underline hover:text-ink">
              Email
            </a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="draw-underline hover:text-ink">
              LinkedIn
            </a>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="draw-underline hover:text-ink">
              GitHub
            </a>
            <a href={LINKS.resume} target="_blank" rel="noopener" className="draw-underline hover:text-ink">
              Résumé
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          <span>
            Kuala Lumpur <span className="tabular-nums text-ink-2">{time}</span>
          </span>
          <span>Built with Next.js, Tailwind &amp; Motion</span>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-ink-2 transition-colors duration-300 hover:border-accent hover:text-ink"
          >
            Back to top
            <ArrowUp size={14} className="transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Giant wordmark, letters rising out of the floor. */}
      <m.div
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={letters}
        className="mt-12 flex select-none justify-center overflow-hidden px-2 text-[clamp(64px,19.5vw,320px)] font-medium leading-[0.8] tracking-[-0.065em] [font-stretch:82%]"
      >
        {WORD.split("").map((ch, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden pb-[0.04em] transition-[translate] duration-500 ease-expo hover:-translate-y-[5%]"
          >
            <m.span variants={letter} className="inline-block bg-gradient-to-b from-ink via-ink/70 to-ink/5 bg-clip-text text-transparent">
              {ch === " " ? "\u00a0" : ch}
            </m.span>
          </span>
        ))}
      </m.div>

      <div className="shell flex justify-between border-t border-line py-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
        <span>© {year} {PROFILE.fullName}</span>
        <span>{PROFILE.location}</span>
      </div>
    </footer>
  );
}
