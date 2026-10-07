"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { m } from "motion/react";
import { ArrowRight } from "@/components/ui/Icons";
import { useActive, usePrefersReducedMotion } from "@/components/ui/hooks";
import desk from "@/assets/me/desk.webp";
import tennis from "@/assets/me/tennis.webp";
import gaming from "@/assets/me/gaming.webp";
import cat from "@/assets/me/cat.webp";

const SHOTS: { img: StaticImageData; alt: string; caption: string }[] = [
  {
    img: desk,
    alt: "Illustration of Lucas coding on a laptop, with books on Go and Postgres on the desk",
    caption: "Heads down in Go and Postgres.",
  },
  { img: tennis, alt: "Illustration of Lucas in a cap, holding a tennis racket and a ball", caption: "Out on the court." },
  {
    img: gaming,
    alt: "Illustration of Lucas holding a game controller under a sign that reads Good games, good mood",
    caption: "Good games, good mood.",
  },
  {
    img: cat,
    alt: "Illustration of Lucas hugging a grey cat under a sign that reads Small steps, big progress",
    caption: "Small steps, big progress.",
  },
];

// Where each print sits in the pile, top first.
const PILE = [
  { x: "0%", y: "0%", rotate: -3, scale: 1 },
  { x: "7%", y: "-5%", rotate: 4, scale: 0.95 },
  { x: "-6%", y: "-9%", rotate: -7, scale: 0.9 },
  { x: "2%", y: "-12%", rotate: 1, scale: 0.86 },
];
const EXPO = [0.16, 1, 0.3, 1] as const;
const HOLD_MS = 3600;
const FLICK_S = 1.15;
// Share of the flick spent out to the side; the print drops under the pile at this point.
const OUT = 0.38;

/** A pile of prints: the top one is flicked aside and slides in at the back, on a timer or a tap. */
export default function Snapshots({ className = "" }: { className?: string }) {
  const [ref, inView] = useActive<HTMLElement>(0.5);
  const reduced = usePrefersReducedMotion();
  const [turn, setTurn] = useState(0);
  // The flicked print stays above the pile until it is out to the side.
  const [lifted, setLifted] = useState(false);
  const [hover, setHover] = useState(false);
  const n = SHOTS.length;
  const top = turn % n;

  const next = () => {
    setTurn((k) => k + 1);
    setLifted(true);
  };

  useEffect(() => {
    if (!inView || reduced || hover) return;
    const t = window.setTimeout(next, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [inView, reduced, hover, turn]);

  useEffect(() => {
    if (!lifted) return;
    const t = window.setTimeout(() => setLifted(false), FLICK_S * OUT * 1000);
    return () => window.clearTimeout(t);
  }, [lifted, turn]);

  return (
    <figure ref={ref} className={className}>
      <div
        className="relative aspect-[10/12] w-full cursor-pointer select-none"
        onClick={next}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        {SHOTS.map((s, i) => {
          const pos = (i - top + n) % n;
          const p = PILE[pos];
          // The print that just left the top: out to the left, then back in under the pile.
          const flicked = turn > 0 && pos === n - 1;
          return (
            <m.div
              key={s.caption}
              aria-hidden={pos !== 0}
              style={{ zIndex: flicked && lifted ? n + 1 : n - pos }}
              initial={false}
              animate={
                flicked
                  ? {
                      x: [PILE[0].x, "-72%", "-72%", p.x],
                      y: [PILE[0].y, "4%", "4%", p.y],
                      rotate: [PILE[0].rotate, -16, -16, p.rotate],
                      scale: [1, 0.97, 0.97, p.scale],
                    }
                  : p
              }
              transition={
                flicked
                  ? { duration: FLICK_S, times: [0, OUT, OUT + 0.01, 1], ease: [[0.5, 0, 0.2, 1], "linear", EXPO] }
                  : { duration: 0.8, ease: EXPO, delay: 0.12 }
              }
              className="absolute inset-0 flex flex-col rounded-[6px] bg-[#f3f0ea] p-2.5 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[3px] bg-[#e4dfd6]">
                <Image
                  src={s.img}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 270px, 66vw"
                  placeholder="blur"
                  draggable={false}
                  className="object-cover"
                />
              </div>
              <p className="serif-accent flex flex-1 items-center px-1 text-[clamp(17px,1.5vw,20px)] leading-tight text-[#2b2724]">
                {s.caption}
              </p>
            </m.div>
          );
        })}
      </div>

      <figcaption className="mt-7 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
        <span className="whitespace-nowrap tabular-nums">
          <span className="text-ink-2">{String(top + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
        </span>
        <span className="hidden h-px w-8 bg-line-strong sm:block" />
        <button
          type="button"
          onClick={next}
          aria-label="Next snapshot"
          className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 uppercase text-ink-2 transition-colors duration-300 hover:border-accent hover:text-ink"
        >
          Next
          <ArrowRight size={13} className="transition-transform duration-500 ease-expo group-hover:translate-x-0.5" />
        </button>
      </figcaption>
    </figure>
  );
}
