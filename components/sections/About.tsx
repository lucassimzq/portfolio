"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import InView, { at } from "@/components/ui/InView";
import { useZonedTime } from "@/components/ui/hooks";
import { EDUCATION, PROFILE } from "@/lib/data";
import avatar from "@/assets/me/avatar.webp";
import desk from "@/assets/me/desk.webp";
import tennis from "@/assets/me/tennis.webp";
import gaming from "@/assets/me/gaming.webp";
import cat from "@/assets/me/cat.webp";

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

const SHOTS: { img: StaticImageData; alt: string; name: string }[] = [
  { img: desk, alt: "Illustration of Lucas coding on a laptop, with books on Go and Postgres on the desk", name: "Desk" },
  { img: tennis, alt: "Illustration of Lucas in a cap, holding a tennis racket and a ball", name: "Court" },
  { img: gaming, alt: "Illustration of Lucas holding a game controller under a sign that reads Good games, good mood", name: "Games" },
  { img: cat, alt: "Illustration of Lucas hugging a grey cat under a sign that reads Small steps, big progress", name: "Cat" },
];

/** Each word goes from the faint grey to ink as the paragraph passes the middle of the screen. */
function Word({ w, em, progress, range }: { w: string; em: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, ["#d4d4d4", "#0a0a0a"]);
  return (
    <>
      <m.span style={{ color }} className={em ? "serif-accent text-[1.08em]" : undefined}>
        {w}
      </m.span>{" "}
    </>
  );
}

/** A print that develops: grey until it has been on screen a moment, then its colour comes up. */
function Print({ img, alt, sizes, className = "", delay = 0, priority }: { img: StaticImageData; alt: string; sizes: string; className?: string; delay?: number; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [developed, setDeveloped] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        t = window.setTimeout(() => setDeveloped(true), 500 + delay);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [delay]);
  return (
    <div ref={ref} className={`photo ${className}`} data-color={developed ? "" : undefined}>
      <Image src={img} alt={alt} fill sizes={sizes} placeholder="blur" priority={priority} className="object-cover !duration-[1400ms]" />
    </div>
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
            <Print
              img={avatar}
              alt="Illustration of Lucas in headphones, sipping from a mug with a code icon on it"
              sizes="(min-width: 1024px) 420px, 92vw"
              className="aspect-[5/4]"
              priority
            />
            <figcaption className="mono-label mt-2.5 flex justify-between">
              <span>Fig 1.1 · Lucas</span>
              <span>{PROFILE.years} yrs · backend</span>
            </figcaption>
          </figure>
          {SHOTS.map((s, i) => (
            <figure key={s.name} style={at(i + 1)}>
              <Print img={s.img} alt={s.alt} sizes="(min-width: 1024px) 100px, 22vw" className="aspect-square" delay={150 * (i + 1)} />
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
