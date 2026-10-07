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

// 6-column bento on desktop; spans tuned so every row lands flush. Each card is a
// 3-row subgrid so headers, visuals and metrics line up across a row.
const CARDS: { item: ImpactItem; Viz: React.ComponentType; span: string; vizH: string }[] = [
  { item: IMPACT.query, Viz: QueryRace, span: "lg:col-span-4", vizH: "h-[190px]" },
  { item: IMPACT.migration, Viz: Migration, span: "lg:col-span-2", vizH: "h-[190px]" },
  { item: IMPACT.guardrails, Viz: Guardrails, span: "lg:col-span-3", vizH: "h-[250px]" },
  { item: IMPACT.race, Viz: RaceLock, span: "lg:col-span-3", vizH: "h-[250px]" },
  { item: IMPACT.slots, Viz: HashSlots, span: "lg:col-span-2", vizH: "h-[250px]" },
  { item: IMPACT.ship, Viz: ShipPipeline, span: "lg:col-span-2", vizH: "h-[250px]" },
  { item: IMPACT.sso, Viz: SsoQr, span: "lg:col-span-2", vizH: "h-[250px]" },
];

export default function Impact() {
  return (
    <section id="impact" className="relative py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          index="02"
          label="Impact"
          title="Proof, *in motion.*"
          intro="Real outcomes from my resume, animated the way I picture them when I'm debugging. Each card plays while it's on screen."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {CARDS.map(({ item, Viz, span, vizH }, i) => (
            <m.article
              key={item.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
              onPointerMove={spotlight}
              className={`spotlight group row-span-3 grid grid-cols-1 grid-rows-subgrid gap-0 rounded-[22px] border border-line bg-card ${span} ${
                i === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4 px-5 pt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 sm:px-6">
                <span className="flex items-center gap-2">
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
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
