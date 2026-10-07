"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/** A child's place in an entrance stagger (70ms apart). */
export const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Its children wait off-stage until the block scrolls into view, then each rises out
 * of a blur in turn, as the hero's do. Give a child `style={at(n)}` to set its place.
 */
export default function InView({
  as: Tag = "div",
  className,
  children,
  amount = 0.2,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  amount?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return (
    <Tag ref={ref} className={className} data-reveal="" data-shown={shown ? "" : undefined}>
      {children}
    </Tag>
  );
}
