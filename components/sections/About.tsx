"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import { useActive } from "@/components/ui/hooks";
import { EDUCATION } from "@/lib/data";

const STORY =
  "I'm Lucas, a backend engineer with *8+ years* in production. I've built Go microservices for a *digital bank,* led a 0‑to‑1 Laravel platform with a team of five to six, and now build *MCP tooling* and agent guardrails at YTL AI Labs. I like the parts nobody sees: race conditions, query plans, hash slots, and the CI/CD that keeps releases boring. Next chapter: *Australia or New Zealand.*";

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

const FACTS: { to?: number; text?: string; suffix?: string; label: string }[] = [
  { to: 8, suffix: "+", label: "years shipping production systems" },
  { to: 3, label: "industries: fintech, SaaS, AI platforms" },
  { text: "5–6", label: "engineers led and mentored as Lead Developer" },
];

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ["start 0.85", "end 0.5"] });
  const { scrollYProgress: ringProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const rotate = useTransform(ringProgress, [0, 1], [-90, 200]);
  const [factsRef, factsActive] = useActive<HTMLDivElement>(0.5);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal y={12} className="eyebrow flex items-center gap-3">
            <span className="text-accent">01</span>
            <span className="h-px w-10 bg-line-strong" />
            About
          </Reveal>

          <Reveal delay={0.1} className="relative mt-10 aspect-square w-[min(280px,70vw)]">
            <m.svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" style={{ rotate }} aria-hidden>
              <defs>
                <path id="ring" d="M150,150 m-132,0 a132,132 0 1,1 264,0 a132,132 0 1,1 -264,0" />
              </defs>
              <text className="font-mono" fontSize="12.5" fill="var(--text-3)" letterSpacing="4">
                <textPath href="#ring" textLength="826" lengthAdjust="spacing">
                  BACKEND ENGINEER ✳ 8+ YEARS ✳ KUALA LUMPUR ✳ OPEN TO AU / NZ ✳
                </textPath>
              </text>
            </m.svg>
            <div className="absolute inset-[15%] overflow-hidden rounded-full ring-1 ring-line-strong">
              <Image
                src="/icon.png"
                alt="Illustrated portrait of Lucas Sim"
                fill
                sizes="(max-width: 1024px) 50vw, 200px"
                className="object-cover transition-transform duration-700 ease-expo hover:scale-105"
              />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <p
            ref={textRef}
            className="text-[clamp(26px,3.3vw,48px)] font-medium leading-[1.18] tracking-[-0.03em] text-ink"
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

          <div ref={factsRef} className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
            {FACTS.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.08}>
                <div className="text-[clamp(44px,5vw,72px)] font-medium leading-none tracking-[-0.05em] text-ink [font-stretch:85%]">
                  {f.to !== undefined ? <Counter to={f.to} duration={1.4} play={factsActive} ease="easeOut" /> : f.text}
                  {f.suffix && <span className="text-accent">{f.suffix}</span>}
                </div>
                <p className="mt-3 max-w-[16rem] text-[14.5px] leading-snug text-ink-2">{f.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col gap-3 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3 sm:flex-row sm:gap-8">
            {EDUCATION.map((e) => (
              <span key={e.degree}>
                <span className="text-ink-2">{e.degree}</span> · {e.school} · {e.year}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
