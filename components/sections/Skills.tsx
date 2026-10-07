"use client";

import { m, type Variants } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { SKILLS } from "@/lib/data";

const row: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } } };
const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};
const label: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};
const chip: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          index="05"
          label="Skills"
          title="Tools I *reach for.*"
          intro={
            <>
              Production-tested first.{" "}
              <span className="whitespace-nowrap rounded-full border border-dashed border-ink-3/60 px-2.5 py-0.5 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-3">
                dashed
              </span>{" "}
              means I&apos;m still ramping up or have hands-on exposure rather than years in production.
            </>
          }
        />

        <div className="border-b border-line">
          {SKILLS.map((group, gi) => (
            <m.div
              key={group.cat}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={row}
              className="group relative grid gap-5 py-7 md:grid-cols-12 md:items-center md:gap-8 md:py-8"
            >
              <m.span variants={rule} aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-expo group-hover:scale-x-100"
              />

              <m.h3 variants={label} className="flex items-baseline gap-4 md:col-span-4">
                <span className="font-mono text-[11px] text-accent">{String(gi + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(24px,2.5vw,34px)] font-medium tracking-[-0.03em] text-ink transition-transform duration-500 ease-expo group-hover:translate-x-2">
                  {group.cat}
                </span>
                <span className="font-mono text-[11px] text-ink-3">({group.items.length})</span>
              </m.h3>

              <ul className="flex flex-wrap gap-2 md:col-span-8">
                {group.items.map((s) => {
                  const text = typeof s === "string" ? s : s.label;
                  const note = typeof s === "string" ? null : s.note;
                  return (
                    <m.li
                      key={text}
                      variants={chip}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[14px] transition-colors duration-300 sm:px-4 sm:py-2 sm:text-[14.5px] ${
                        note
                          ? "border-dashed border-ink-3/60 text-ink-2 hover:border-peach hover:text-ink"
                          : "border-line-strong bg-elev text-ink hover:border-accent hover:bg-accent hover:text-bg"
                      }`}
                    >
                      {text}
                      {note && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-peach">{note}</span>
                      )}
                    </m.li>
                  );
                })}
              </ul>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
