"use client";

import { m } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { spotlight } from "@/components/ui/hooks";
import { IMPACT, type Impact as ImpactItem } from "@/lib/data";
import QueryRace from "@/components/viz/QueryRace";
import Migration from "@/components/viz/Migration";
import Guardrails from "@/components/viz/Guardrails";
import RaceLock from "@/components/viz/RaceLock";
import HashSlots from "@/components/viz/HashSlots";
import ShipPipeline from "@/components/viz/ShipPipeline";
import SsoQr from "@/components/viz/SsoQr";

type Card = { item: ImpactItem; Viz: React.ComponentType; span?: string; vizH: string };

// The two results Lucas is hired for lead, larger; the rest follow as receipts.
const SIGNATURE: Card[] = [
  { item: IMPACT.query, Viz: QueryRace, vizH: "h-[210px] sm:h-[230px]" },
  { item: IMPACT.ship, Viz: ShipPipeline, vizH: "h-[250px] sm:h-[230px]" },
];
// 6-column bento on desktop; spans tuned so every row lands flush. Each card is a
// 3-row subgrid so headers, visuals and metrics line up across a row.
const RECEIPTS: Card[] = [
  { item: IMPACT.race, Viz: RaceLock, span: "lg:col-span-3", vizH: "h-[250px]" },
  { item: IMPACT.guardrails, Viz: Guardrails, span: "lg:col-span-3", vizH: "h-[250px]" },
  { item: IMPACT.migration, Viz: Migration, span: "lg:col-span-2", vizH: "h-[250px]" },
  { item: IMPACT.slots, Viz: HashSlots, span: "lg:col-span-2", vizH: "h-[250px]" },
  { item: IMPACT.sso, Viz: SsoQr, span: "lg:col-span-2", vizH: "h-[250px]" },
];

const rise = (i: number) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: (i % 3) * 0.08 },
});

export default function Impact() {
  return (
    <section id="impact" className="relative py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          index="02"
          label="Impact"
          title="Proof, *in motion.*"
          intro="Two things I'm hired for: making slow systems fast, and leading a team to launch. The rest are receipts. Each card plays while it's on screen."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {SIGNATURE.map(({ item, Viz, vizH }, i) => (
            <m.article
              key={item.id}
              {...rise(i)}
              onPointerMove={spotlight}
              className="spotlight relative row-span-3 grid grid-cols-1 grid-rows-subgrid gap-0 overflow-hidden rounded-[26px] border border-accent/25 bg-card"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/[0.12] blur-[90px]"
              />
              <div className="relative flex flex-wrap items-center justify-between gap-3 px-6 pt-6 sm:px-8 sm:pt-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M12 0c.6 5.6 1.9 8.9 4 10.2 1.6 1 4.3 1.5 8 1.8-5.6.6-8.9 1.9-10.2 4-1 1.6-1.5 4.3-1.8 8-.6-5.6-1.9-8.9-4-10.2C6.4 12.8 3.7 12.3 0 12c5.6-.6 8.9-1.9 10.2-4C11.2 6.4 11.7 3.7 12 0Z"
                    />
                  </svg>
                  Specialty · {item.specialty}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                  {item.company} · {item.year}
                </span>
              </div>
              <div className={`relative px-6 sm:px-8 ${vizH}`}>
                <Viz />
              </div>
              <div className="relative border-t border-line px-6 pb-7 pt-6 sm:px-8">
                <div className="text-[clamp(38px,4.2vw,60px)] font-medium leading-none tracking-[-0.045em] text-ink [font-stretch:88%]">
                  {item.metric}
                </div>
                <h3 className="mt-4 text-[19px] font-medium tracking-[-0.01em] text-ink">{item.title}</h3>
                <p className="mt-2 max-w-[38rem] text-[15px] leading-relaxed text-ink-2">{item.body}</p>
              </div>
            </m.article>
          ))}
        </div>

        <div className="mb-5 mt-14 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          More receipts
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {RECEIPTS.map(({ item, Viz, span, vizH }, i) => (
            <m.article
              key={item.id}
              {...rise(i)}
              onPointerMove={spotlight}
              className={`spotlight group row-span-3 grid grid-cols-1 grid-rows-subgrid gap-0 rounded-[22px] border border-line bg-card ${span} ${
                i === RECEIPTS.length - 1 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4 px-5 pt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 sm:px-6">
                <span className="flex items-center gap-2">
                  <span className="text-accent">{String(i + 3).padStart(2, "0")}</span>
                  {item.company}
                </span>
                <span>{item.year}</span>
              </div>
              <div className={`relative px-5 sm:px-6 ${vizH}`}>
                <Viz />
              </div>
              <div className="border-t border-line px-5 pb-6 pt-5 sm:px-6">
                <div className="text-[clamp(26px,2.6vw,36px)] font-medium leading-none tracking-[-0.035em] text-ink">
                  {item.metric}
                </div>
                <h3 className="mt-3 text-[16px] font-medium text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{item.body}</p>
              </div>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
