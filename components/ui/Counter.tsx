"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";

/** Tweens a number into its own text node (no re-renders). Resets to `from` when `play` turns off. */
export default function Counter({
  to,
  from = 0,
  duration = 1.2,
  play,
  format = (v) => Math.round(v).toLocaleString("en-US"),
  ease = "linear",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  play: boolean;
  format?: (v: number) => string;
  ease?: "linear" | "easeOut" | "easeInOut";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = useRef(format);

  useEffect(() => {
    fmt.current = format;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!play) {
      el.textContent = fmt.current(from);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease,
      onUpdate: (v) => {
        el.textContent = fmt.current(v);
      },
    });
    return () => controls.stop();
  }, [play, from, to, duration, ease]);

  return (
    <span ref={ref} className={className}>
      {format(from)}
    </span>
  );
}
