"use client";

import { Fragment } from "react";
import { m, type Variants } from "motion/react";

type Tag = "h1" | "h2" | "h3" | "p";

const word: Variants = {
  hidden: { y: "112%", rotate: 3 },
  show: { y: "0%", rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Words rise out of their own masks, staggered. Wrap a phrase in *asterisks*
 * to set it in the italic serif accent.
 */
export default function SplitText({
  text,
  as = "h2",
  className = "",
  delay = 0,
  stagger = 0.055,
}: {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const Comp = m[as];
  const tokens: { w: string; accent: boolean }[] = [];
  text.split(/(\*[^*]+\*)/).forEach((chunk) => {
    const accent = chunk.startsWith("*") && chunk.endsWith("*");
    chunk
      .replace(/\*/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => tokens.push({ w, accent }));
  });
  const plain = text.replace(/\*/g, "");

  return (
    <Comp
      className={className}
      aria-label={plain}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {tokens.map((t, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <m.span variants={word} className={`inline-block origin-bottom-left ${t.accent ? "serif-accent text-accent" : ""}`}>
              {t.w}
            </m.span>
          </span>
          {i < tokens.length - 1 && " "}
        </Fragment>
      ))}
    </Comp>
  );
}
