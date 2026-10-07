"use client";

import { useRef } from "react";
import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { MARQUEE } from "@/lib/data";

/** A ticker that idles along, then speeds up, reverses and skews with your scroll. */
function Row({ items, speed, variant }: { items: string[]; speed: number; variant: "solid" | "outline" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [10, 0, -10]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    let move = direction.current * speed * (delta / 1000);
    move += direction.current * move * b;
    baseX.set(baseX.get() + move);
  });

  return (
    <div ref={ref} className="flex overflow-hidden whitespace-nowrap py-2">
      <m.div className="flex shrink-0" style={{ x, skewX }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((w) => (
              <span key={w} className="flex items-center">
                <span
                  className={
                    variant === "solid"
                      ? "px-6 text-[clamp(44px,7vw,104px)] font-medium leading-[1.05] tracking-[-0.04em] text-ink [font-stretch:85%] md:px-9"
                      : "serif-accent px-6 text-[clamp(44px,7vw,104px)] leading-[1.05] text-transparent [-webkit-text-stroke:1px_var(--text-3)] md:px-9"
                  }
                >
                  {w}
                </span>
                <svg viewBox="0 0 24 24" className="h-[clamp(18px,2.4vw,34px)] w-[clamp(18px,2.4vw,34px)] shrink-0 text-accent" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M12 0c.6 5.6 1.9 8.9 4 10.2 1.6 1 4.3 1.5 8 1.8-5.6.6-8.9 1.9-10.2 4-1 1.6-1.5 4.3-1.8 8-.6-5.6-1.9-8.9-4-10.2C6.4 12.8 3.7 12.3 0 12c5.6-.6 8.9-1.9 10.2-4C11.2 6.4 11.7 3.7 12 0Z"
                  />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </m.div>
    </div>
  );
}

export default function Marquee() {
  const half = Math.ceil(MARQUEE.length / 2);
  return (
    <section aria-label="Specialties and stack" className="relative border-y border-line py-6 md:py-10">
      <p className="sr-only">Specialties and stack: {MARQUEE.join(", ")}.</p>
      <Row items={MARQUEE.slice(0, half)} speed={-3.2} variant="solid" />
      <Row items={MARQUEE.slice(half)} speed={2.6} variant="outline" />
    </section>
  );
}
