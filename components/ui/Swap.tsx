"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Steps through `items` every `every` ms unless paused: the leaving one blurs up and out
 * as the next rises out of a blur. The box eases to the new item's width, so a centred
 * line re-centres smoothly instead of jumping. `index`/`onIndex` let a caller drive or follow it.
 */
export default function Swap({
  items,
  every = 3400,
  paused = false,
  index,
  onIndex,
}: {
  items: ReactNode[];
  every?: number;
  paused?: boolean;
  index?: number;
  onIndex?: (i: number) => void;
}) {
  const [state, setState] = useState({ now: index ?? 0, was: -1, n: 0 });
  const [seen, setSeen] = useState(index);

  // a caller that picks an item takes the swap there at once (state adjusted while rendering, not in an effect)
  if (index !== seen) {
    setSeen(index);
    if (index !== undefined && index !== state.now) setState({ now: index, was: state.now, n: state.n + 1 });
  }

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => {
      const next = (state.now + 1) % items.length;
      setState({ now: next, was: state.now, n: state.n + 1 });
      onIndex?.(next);
    }, every);
    return () => window.clearTimeout(t);
  }, [state, paused, every, items.length, onIndex]);

  const box = useRef<HTMLSpanElement>(null);
  const current = useRef<HTMLSpanElement>(null);
  // before paint: the box takes the incoming item's width, and the width transition does the rest
  useLayoutEffect(() => {
    const b = box.current, c = current.current;
    if (b && c) b.style.width = `${c.offsetWidth}px`;
  });
  useEffect(() => {
    const b = box.current, c = current.current;
    if (!b || !c) return;
    const ro = new ResizeObserver(() => (b.style.width = `${c.offsetWidth}px`));
    ro.observe(c);
    return () => ro.disconnect();
  }, [state.n]);

  const { now, was, n } = state;
  return (
    <span ref={box} className="swap">
      {was >= 0 && (
        <span key={`out-${n}`} className="swap-out">
          {items[was]}
        </span>
      )}
      <span key={`in-${n}`} ref={current} className={n ? "swap-in" : undefined}>
        {items[now]}
      </span>
    </span>
  );
}
