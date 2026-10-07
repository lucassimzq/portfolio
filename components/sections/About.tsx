"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import InView, { at } from "@/components/ui/InView";
import { useZonedTime } from "@/components/ui/hooks";
import { EDUCATION, PROFILE } from "@/lib/data";
import Sketch, { type SketchName } from "@/components/ui/Sketch";

const STORY =
  "I'm Lucas. *Eight years* of backends: a *digital bank,* a 0‑to‑1 SaaS I led, and now *MCP tooling* at YTL AI Labs. I like the parts nobody sees. Next chapter: *Australia or New Zealand.*";

const WORDS = (() => {
  const out: { w: string; em: boolean }[] = [];
  STORY.split(/(\*[^*]+\*)/).forEach((chunk) => {
    const em = chunk.startsWith("*");
    chunk
      .replace(/\*/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({ w, em }));
  });
  return out;
})();

const SHOTS: { sketch: SketchName; alt: string; name: string }[] = [
  { sketch: "desk", alt: "Line drawing of Lucas coding on a laptop beside books on Go, Postgres and system design", name: "Desk" },
  { sketch: "tennis", alt: "Line drawing of Lucas in a cap, holding a tennis racket and a ball", name: "Court" },
  { sketch: "gaming", alt: "Line drawing of Lucas holding a game controller under a sign that reads Good games, good mood", name: "Games" },
  { sketch: "cat", alt: "Line drawing of Lucas hugging his cat under a sign that reads Small steps, big progress", name: "Cat" },
];

/** Each word goes from the faint grey to ink as the paragraph passes the middle of the screen. */
function Word({ w, em, progress, range }: { w: string; em: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, ["#d4d4d4", em ? "#e8590c" : "#0a0a0a"]);
  return (
    <>
      <m.span style={{ color }} className={em ? "serif-accent text-[1.08em]" : undefined}>
        {w}
      </m.span>{" "}
    </>
  );
}

export default function About() {
  const text = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: text, offset: ["start 0.85", "end 0.5"] });
  const { time } = useZonedTime(PROFILE.timezone);

  return (
    <section id="about" className="sec shell py-14 md:py-20">
      <InView className="sec-label">
        <span style={at(0)}>
          <b>01</b> · About
        </span>
      </InView>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p ref={text} className="text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.3] tracking-[-0.025em]">
            {WORDS.map((t, i) => (
              <Word key={i} w={t.w} em={t.em} progress={scrollYProgress} range={[i / WORDS.length, Math.min(1, (i + 4) / WORDS.length)]} />
            ))}
          </p>

          <InView as="dl" className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-3">
            <div style={at(0)}>
              <dt className="mono-label">Based in</dt>
              <dd className="mt-2 text-[14px]">
                Kuala Lumpur <span className="font-mono text-[12.5px] tabular-nums text-ink-3">{time}</span>
              </dd>
            </div>
            <div style={at(1)}>
              <dt className="mono-label">Work rights</dt>
              <dd className="mt-2 text-[14px] text-ink-2">Malaysian citizen, needs AU / NZ sponsorship</dd>
            </div>
            <div style={at(2)}>
              <dt className="mono-label">Studied</dt>
              <dd className="mt-2 text-[14px] text-ink-2">
                {EDUCATION[0].degree}, {EDUCATION[0].year}
              </dd>
            </div>
          </InView>
        </div>

        <InView className="grid grid-cols-4 gap-3 self-start lg:col-span-5" amount={0.3}>
          <figure className="col-span-4" style={at(0)}>
            <div className="sketch-card sketch-hero aspect-[5/4]">
              <Sketch name="mug" alt="Line drawing of Lucas in headphones, sipping from a mug with a code icon on it" />
            </div>
            <figcaption className="mono-label mt-2.5 flex justify-between">
              <span>Fig 1.1 · Lucas</span>
              <span>{PROFILE.years} yrs · backend</span>
            </figcaption>
          </figure>
          {SHOTS.map((s, i) => (
            <figure key={s.name} style={at(i + 1)}>
              <div className="sketch-card aspect-square">
                <Sketch name={s.sketch} alt={s.alt} />
              </div>
              <figcaption className="mono-label mt-2 truncate">
                1.{i + 2} {s.name}
              </figcaption>
            </figure>
          ))}
        </InView>
      </div>
    </section>
  );
}
