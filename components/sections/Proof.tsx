"use client";

import { useState } from "react";
import InView, { at } from "@/components/ui/InView";
import { Figure, Plate, type FigureName } from "@/components/ui/Figure";
import { IMPACT, type Impact } from "@/lib/data";

/** Each result, the figure that stands for it, and what to do to it. */
const LEAD: { id: keyof typeof IMPACT; figure: FigureName; label: string; hint: string }[] = [
  { id: "query", figure: "query", label: "A question mark built as a solid; its hook turns toward the pointer", hint: "Point anywhere" },
  { id: "ship", figure: "branches", label: "A commit graph with a branch forking off main and merging back", hint: "Hover a commit" },
];
const REST: { id: keyof typeof IMPACT; figure: FigureName; label: string; hint: string }[] = [
  { id: "migration", figure: "riffle", label: "A tray of eight cards; the one under the pointer stands up", hint: "Hover · ← →" },
  { id: "guardrails", figure: "sieve", label: "Three sieves over a pan; the pointer's height lifts one clear", hint: "Move up, down" },
  { id: "race", figure: "padlock", label: "A padlock whose shackle swings open as the pointer comes near", hint: "Come closer" },
  { id: "slots", figure: "terrain", label: "A field of pillars that rise around the pointer, like a hot key", hint: "Find the hot spot" },
];

/** A specialty: the figure large on the left, the result beside it. */
function Lead({ item, figure, label, hint, n }: { item: Impact; figure: FigureName; label: string; hint: string; n: number }) {
  const [read, setRead] = useState("");
  return (
    <article className="plate plate-wide h-full md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="plate-stage md:border-r md:border-line">
        <div className="plate-corner top">
          <span>Fig 2.{n}</span>
          <span>{item.specialty}</span>
        </div>
        <Figure name={figure} label={label} onRead={setRead} intensity={0.7} />
        <div className="plate-corner bottom" aria-hidden>
          <span>{hint}</span>
          <span className="readout">{read}</span>
        </div>
      </div>
      <div className="flex flex-col justify-end gap-3 border-t border-line p-5 md:border-t-0 md:p-7">
        <div className="plate-metric">{item.metric}</div>
        <p className="max-w-[38ch] text-[14px] leading-[1.6] text-ink-3 text-pretty">{item.detail}</p>
        <p className="mono-label mt-1">
          {item.company} · {item.year}
        </p>
      </div>
    </article>
  );
}

export default function Proof() {
  return (
    <section id="proof" className="sec shell py-14 md:py-20">
      <InView>
        <p className="sec-label" style={at(0)}>
          <span>
            <b>02</b> · Proof
          </span>
        </p>
        <h2 className="sec-h" style={at(1)}>
          Two things I&apos;m <em>known</em> for, and four more.
        </h2>
        <p className="sec-lede" style={at(2)}>
          Every figure on this page answers the pointer.
        </p>
      </InView>

      <InView className="mt-10 grid gap-3.5 lg:grid-cols-2" amount={0.1}>
        {LEAD.map((l, i) => (
          <div key={l.id} style={at(i)} className="h-full">
            <Lead item={IMPACT[l.id]} figure={l.figure} label={l.label} hint={l.hint} n={i + 1} />
          </div>
        ))}
      </InView>

      <InView className="mt-3.5 grid grid-cols-1 gap-3.5 min-[440px]:grid-cols-2 lg:grid-cols-4" amount={0.1}>
        {REST.map((r, i) => {
          const item = IMPACT[r.id];
          return (
            <div key={r.id} style={at(i)} className="h-full">
              <Plate className="h-full" name={r.figure} label={r.label} fig={`2.${i + 3}`} note={item.company} hint={r.hint}>
                <div className="plate-foot">
                  <div className="plate-metric">{item.metric}</div>
                  <div className="plate-title">{item.title}</div>
                </div>
              </Plate>
            </div>
          );
        })}
      </InView>
    </section>
  );
}
