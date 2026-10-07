"use client";

import { m, type Variants } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { spotlight } from "@/components/ui/hooks";
import { SKILLS, SPECIALTIES } from "@/lib/data";

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
          title="What I'm *known for.*"
          intro="Four specialties, each with the proof behind it, then the toolbox I reach for every day."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {SPECIALTIES.map((s, i) => (
            <m.article
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
              onPointerMove={spotlight}
              className={`spotlight flex flex-col rounded-[22px] border bg-card p-6 sm:p-8 ${i < 2 ? "border-accent/25" : "border-line"}`}
            >
              <div className="flex items-center justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span>{s.where}</span>
              </div>
              <h3 className="mt-5 text-[clamp(26px,2.6vw,36px)] font-medium leading-[1.05] tracking-[-0.035em] text-ink">
                {s.title}
              </h3>
              <ul className="mt-5 grid gap-2.5 text-[15px] leading-relaxed text-ink-2">
                {s.proof.map((p) => (
                  <li key={p} className="flex gap-3.5">
                    <span aria-hidden className="mt-[0.8em] h-px w-3 shrink-0 bg-accent/80" />
                    {p}
                  </li>
                ))}
              </ul>
              <ul className="mt-auto flex flex-wrap gap-2 pt-7" aria-label="Tools">
                {s.tools.map((t) => (
                  <li key={t} className="rounded-full border border-line-strong bg-elev px-3 py-1 text-[13px] text-ink">
                    {t}
                  </li>
                ))}
              </ul>
            </m.article>
          ))}
        </div>

        <div className="mb-2 mt-16 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          The toolbox
          <span className="hidden h-px w-10 bg-line-strong sm:block" />
          <span className="normal-case tracking-normal text-[13px] font-sans text-ink-3">
            <span className="whitespace-nowrap rounded-full border border-dashed border-ink-3/60 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em]">
              dashed
            </span>{" "}
            means still ramping up or hands-on exposure.
          </span>
        </div>

        <div className="border-b border-line">
          {SKILLS.map((group, gi) => (
            <m.div
              key={group.cat}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={row}
              className="group relative grid gap-4 py-6 md:grid-cols-12 md:items-center md:gap-8 md:py-7"
            >
              <m.span variants={rule} aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-expo group-hover:scale-x-100"
              />

              <m.h3 variants={label} className="flex items-baseline gap-4 md:col-span-4">
                <span className="font-mono text-[11px] text-accent">{String(gi + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(22px,2.2vw,30px)] font-medium tracking-[-0.03em] text-ink transition-transform duration-500 ease-expo group-hover:translate-x-2">
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
