"use client";

import { m, type Variants } from "motion/react";
import { SPECIALTY_TAGS, STACK } from "@/lib/data";

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const phrase: Variants = {
  hidden: { opacity: 0.12, y: "0.35em" },
  show: { opacity: 1, y: "0em", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};
const chip: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`spin-slow shrink-0 text-accent ${className}`} aria-hidden>
      <path
        fill="currentColor"
        d="M12 0c.6 5.6 1.9 8.9 4 10.2 1.6 1 4.3 1.5 8 1.8-5.6.6-8.9 1.9-10.2 4-1 1.6-1.5 4.3-1.8 8-.6-5.6-1.9-8.9-4-10.2C6.4 12.8 3.7 12.3 0 12c5.6-.6 8.9-1.9 10.2-4C11.2 6.4 11.7 3.7 12 0Z"
      />
    </svg>
  );
}

/**
 * What Lucas is known for, set still so it can be read: each phrase lights up once as
 * the band scrolls in, and only the stars keep turning.
 */
export default function Marquee() {
  return (
    <section aria-label="Known for" className="relative border-y border-line py-10 md:py-14">
      <div className="shell">
        <div className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-accent">Known for</span>
          <span className="h-px w-10 bg-line-strong" />
        </div>
        <m.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={list}
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[clamp(26px,3.6vw,52px)] font-medium leading-[1.15] tracking-[-0.035em] [font-stretch:88%] md:gap-x-6"
        >
          {SPECIALTY_TAGS.map((t, i) => (
            <m.li key={t} variants={phrase} className="flex items-center gap-x-4 md:gap-x-6">
              {i > 0 && <Star className="h-[0.42em] w-[0.42em]" />}
              <span className="text-ink transition-colors duration-300 hover:text-accent">{t}</span>
            </m.li>
          ))}
        </m.ul>
        <m.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={list}
          aria-label="Stack"
          className="mt-7 flex flex-wrap gap-2"
        >
          {STACK.map((t) => (
            <m.li
              key={t}
              variants={chip}
              className="rounded-full border border-line-strong bg-elev/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 transition-colors duration-300 hover:border-accent hover:text-ink"
            >
              {t}
            </m.li>
          ))}
        </m.ul>
      </div>
    </section>
  );
}
