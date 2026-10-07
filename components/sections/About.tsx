"use client";

import { useId, useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import Snapshots from "@/components/site/Snapshots";
import avatar from "@/assets/me/avatar.webp";

const STORY =
  "I'm Lucas. *Eight years* of backends: a *digital bank,* a 0‑to‑1 SaaS I led, and now *MCP tooling* at YTL AI Labs. I like the parts nobody sees. Next chapter: *Australia or New Zealand.*";

const WORDS = (() => {
  const out: { w: string; accent: boolean }[] = [];
  STORY.split(/(\*[^*]+\*)/).forEach((chunk) => {
    const accent = chunk.startsWith("*");
    chunk
      .replace(/\*/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({ w, accent }));
  });
  return out;
})();

function Word({ w, accent, progress, range }: { w: string; accent: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <m.span style={{ opacity }} className={accent ? "serif-accent text-accent" : undefined}>
        {w}
      </m.span>{" "}
    </>
  );
}

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ["start 0.85", "end 0.55"] });
  const { scrollYProgress: ringProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const rotate = useTransform(ringProgress, [0, 1], [-90, 200]);

  return (
    <section ref={sectionRef} id="about" className="relative pb-8 pt-20 md:pb-10 md:pt-28">
      <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <Reveal y={12} className="eyebrow flex items-center gap-3">
            <span className="text-accent">01</span>
            <span className="h-px w-10 bg-line-strong" />
            About
          </Reveal>
          <Reveal delay={0.1} className="mt-8 hidden lg:block">
            <Ring rotate={rotate} className="w-[min(240px,100%)]" />
          </Reveal>
        </div>

        <p
          ref={textRef}
          className="text-[clamp(28px,3.4vw,50px)] font-medium leading-[1.14] tracking-[-0.03em] text-ink lg:col-span-6"
        >
          {WORDS.map((t, i) => (
            <Word
              key={i}
              w={t.w}
              accent={t.accent}
              progress={scrollYProgress}
              range={[i / WORDS.length, Math.min(1, (i + 3) / WORDS.length)]}
            />
          ))}
        </p>

        {/* Phones: avatar and the photo pile side by side under the text. */}
        <Reveal className="flex items-start justify-between gap-4 lg:col-span-3 lg:block">
          <Ring rotate={rotate} className="w-[44vw] max-w-[220px] shrink-0 lg:hidden" />
          <Snapshots className="w-[42vw] max-w-[220px] pt-3 lg:ml-auto lg:w-[min(250px,100%)] lg:max-w-none lg:pt-0" />
        </Reveal>
      </div>
    </section>
  );
}

/** The avatar inside a ring of text that turns with the page. */
function Ring({ rotate, className }: { rotate: MotionValue<number>; className: string }) {
  const id = useId();
  return (
    <div className={`relative aspect-square ${className}`}>
      <m.svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" style={{ rotate }} aria-hidden>
        <defs>
          <path id={id} d="M150,150 m-132,0 a132,132 0 1,1 264,0 a132,132 0 1,1 -264,0" />
        </defs>
        <text className="font-mono" fontSize="12.5" fill="var(--text-3)" letterSpacing="4">
          <textPath href={`#${id}`} textLength="826" lengthAdjust="spacing">
            BACKEND ENGINEER ✳ 8+ YEARS ✳ KUALA LUMPUR ✳ OPEN TO AU / NZ ✳
          </textPath>
        </text>
      </m.svg>
      <div className="absolute inset-[15%] overflow-hidden rounded-full ring-1 ring-line-strong">
        <Image
          src={avatar}
          alt="Illustration of Lucas in headphones, sipping from a mug with a code icon on it"
          fill
          sizes="(max-width: 1024px) 44vw, 170px"
          className="object-cover transition-transform duration-700 ease-expo hover:scale-105"
        />
      </div>
    </div>
  );
}
