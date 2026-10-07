"use client";

import { useEffect, useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import { spotlight, usePrefersReducedMotion } from "@/components/ui/hooks";
import { IMPACT, type Impact as ImpactItem } from "@/lib/data";
import QueryRace from "@/components/viz/QueryRace";
import Migration from "@/components/viz/Migration";
import Guardrails from "@/components/viz/Guardrails";
import RaceLock from "@/components/viz/RaceLock";
import HashSlots from "@/components/viz/HashSlots";
import ShipPipeline from "@/components/viz/ShipPipeline";
import SsoQr from "@/components/viz/SsoQr";

type Card = { item: ImpactItem; Viz: React.ComponentType };

// The two results Lucas is hired for lead; the rest follow as receipts.
const CARDS: Card[] = [
  { item: IMPACT.query, Viz: QueryRace },
  { item: IMPACT.ship, Viz: ShipPipeline },
  { item: IMPACT.migration, Viz: Migration },
  { item: IMPACT.race, Viz: RaceLock },
  { item: IMPACT.guardrails, Viz: Guardrails },
  { item: IMPACT.slots, Viz: HashSlots },
  { item: IMPACT.sso, Viz: SsoQr },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A reel of animated results. While the section is pinned, scrolling down slides the
 * reel sideways; each visual plays only while it is on screen. With reduced motion the
 * reel is a plain horizontal scroller instead.
 */
export default function Impact() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();
  const pinned = !reduced;
  const [overflow, setOverflow] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const view = viewRef.current;
    if (!track || !view) return;
    const measure = () => setOverflow(Math.max(0, track.scrollWidth - view.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(view);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // Without pinning, progress follows the reel's own sideways scroll.
  const { scrollXProgress } = useScroll({ container: viewRef });
  const progress = pinned ? scrollYProgress : scrollXProgress;
  const x = useTransform(scrollYProgress, (v) => -v * overflow);
  const bar = useSpring(progress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  const track = (v: number) => setActive(Math.min(CARDS.length - 1, Math.round(v * (CARDS.length - 1))));
  useMotionValueEvent(scrollYProgress, "change", (v) => pinned && track(v));
  useMotionValueEvent(scrollXProgress, "change", (v) => !pinned && track(v));

  return (
    <section
      ref={sectionRef}
      id="impact"
      className="relative"
      style={pinned ? { height: `calc(100svh + ${overflow}px)` } : undefined}
    >
      <div
        className={
          pinned
            ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16"
            : "py-20 md:py-28"
        }
      >
        <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <Reveal y={12} className="eyebrow flex items-center gap-3">
              <span className="text-accent">02</span>
              <span className="h-px w-10 bg-line-strong" />
              Proof
            </Reveal>
            <SplitText
              as="h2"
              text="Proof, *in motion.*"
              className="display mt-4 text-[clamp(38px,5.4vw,84px)] [font-stretch:88%]"
            />
          </div>
          <div className="flex w-full items-center gap-4 pb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:w-auto">
            <span className="tabular-nums">
              <span className="text-ink">{pad(active + 1)}</span> / {pad(CARDS.length)}
            </span>
            <span className="relative h-px flex-1 overflow-hidden bg-line-strong sm:w-40 sm:flex-none">
              <m.span className="absolute inset-0 origin-left bg-accent" style={{ scaleX: bar }} />
            </span>
            <span className="hidden sm:inline">{pinned ? "Scroll" : "Swipe"} →</span>
          </div>
        </div>

        <div
          ref={viewRef}
          className={`mt-8 md:mt-10 ${pinned ? "" : "overflow-x-auto pb-4"}`}
        >
          <m.ol ref={trackRef} style={pinned ? { x } : undefined} className="track-pad flex w-max gap-4">
            {CARDS.map(({ item, Viz }, i) => (
              <ProofCard key={item.id} item={item} Viz={Viz} index={i} />
            ))}
          </m.ol>
        </div>
      </div>
    </section>
  );
}

function ProofCard({ item, Viz, index }: Card & { index: number }) {
  const signature = Boolean(item.specialty);
  return (
    <li
      onPointerMove={spotlight}
      className={`spotlight relative flex shrink-0 flex-col overflow-hidden rounded-[24px] border bg-card ${
        signature ? "w-[min(86vw,540px)] border-accent/30" : "w-[min(80vw,400px)] border-line"
      }`}
    >
      {signature && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/[0.12] blur-[90px]"
        />
      )}
      <div className="relative flex items-center justify-between gap-3 px-5 pt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 sm:px-6">
        {signature ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
            Specialty · {item.specialty}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="text-accent">{pad(index + 1)}</span>
            {item.company}
          </span>
        )}
        <span>{signature ? item.company : item.year}</span>
      </div>
      <div className="relative h-[clamp(200px,32svh,250px)] px-5 sm:px-6">
        <Viz />
      </div>
      <div className="relative mt-auto border-t border-line px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div
          className={`font-medium leading-none tracking-[-0.045em] text-ink [font-stretch:88%] ${
            signature ? "text-[clamp(32px,3.4vw,48px)]" : "text-[clamp(26px,2.4vw,34px)]"
          }`}
        >
          {item.metric}
        </div>
        <h3 className="mt-2.5 text-[15px] text-ink-2">{item.title}</h3>
      </div>
    </li>
  );
}
