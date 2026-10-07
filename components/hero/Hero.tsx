"use client";

import { useEffect, useRef, useState } from "react";
import AvatarRing from "./AvatarRing";
import Swap from "@/components/ui/Swap";
import EmailPill from "@/components/site/EmailPill";
import Counter from "@/components/ui/Counter";
import { at } from "@/components/ui/InView";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { PROFILE, PROOF } from "@/lib/data";

// The headline's three claims, one at a time: the serif word is what each one is for.
const CLAIMS: { lead: string; word: string }[] = [
  { lead: "money move", word: "safely" },
  { lead: "queries run", word: "fast" },
  { lead: "AI agents", word: "behave" },
];

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const stats = useRef<HTMLUListElement>(null);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    const el = stats.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setCounting(true), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="top" className="shell pb-16 pt-[clamp(40px,8vh,88px)] md:pb-20">
      <div className="rise grid grid-cols-[minmax(0,1fr)] justify-items-center text-center">
        <div style={at(0)}>
          <AvatarRing />
        </div>

        <h1 className="hero-title mt-7" style={at(1)} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
          <span className="sr-only">I make money move safely, queries run fast, and AI agents behave.</span>
          <span aria-hidden>
            I make{" "}
            <Swap
              paused={reduced || hover}
              items={CLAIMS.map((c) => (
                <>
                  {c.lead} <em>{c.word}</em>.
                </>
              ))}
            />
          </span>
        </h1>

        <p className="hero-sub" style={at(2)}>
          <b>{PROFILE.name}</b>, backend engineer, {PROFILE.years} years across fintech, SaaS and AI platforms. Now{" "}
          {PROFILE.current.role} at <b>{PROFILE.current.company}</b>.
        </p>

        <div className="mt-7 flex w-full flex-wrap items-center justify-center gap-2" style={at(3)}>
          <EmailPill className="w-full max-w-[300px] sm:mr-1 sm:w-auto sm:flex-[0_1_300px]" />
          <a href="#proof" className="btn btn-primary">
            See the proof
          </a>
        </div>

        <ul ref={stats} className="stats mt-14 w-full text-left md:mt-16" style={at(4)}>
          {PROOF.map((p) => (
            <li key={p.label}>
              <div className="stat-n">
                {p.prefix && <span className="unit">{p.prefix}</span>}
                {p.text ?? <Counter to={p.to} duration={1.4} play={counting} ease="easeOut" />}
                {p.suffix && <span className="unit">{p.suffix}</span>}
              </div>
              <div className="stat-l">{p.label}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
