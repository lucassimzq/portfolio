"use client";

import { m, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/hooks";

const GRID = 72;

/**
 * The page's backdrop: a faint blueprint grid and a few slow ember glows, each layer
 * sliding at its own rate as you scroll so the black has some depth behind the content.
 */
export default function Backdrop() {
  const reduced = usePrefersReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const gridY = useTransform(scrollY, (v) => -((v * 0.18) % GRID));
  const slow = useTransform(scrollYProgress, [0, 1], ["0vh", "-35vh"]);
  const fast = useTransform(scrollYProgress, [0, 1], ["0vh", "-90vh"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Glows: drift on their own, and move at different speeds with the scroll. */}
      <m.div style={reduced ? undefined : { y: slow }} className="absolute inset-x-0 top-0 h-[200vh]">
        <div className="ember ember-a" />
        <div className="ember ember-c" />
      </m.div>
      <m.div style={reduced ? undefined : { y: fast }} className="absolute inset-x-0 top-0 h-[260vh]">
        <div className="ember ember-b" />
        <div className="ember ember-d" />
      </m.div>

      {/* Blueprint grid, fading out towards the edges. */}
      <m.div
        style={reduced ? undefined : { y: gridY }}
        className="backdrop-grid absolute inset-x-0 -bottom-[72px] top-0"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)]" />
    </div>
  );
}
