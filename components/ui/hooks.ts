"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { useInView } from "motion/react";

/**
 * Steps through a list of phase durations (ms) while `active`, looping by default.
 * Visualisations read the phase index and let CSS transitions do the tweening.
 * With reduced motion the final phase is returned and nothing ticks.
 */
export function usePhases(
  durations: readonly number[],
  active: boolean,
  { loop = true, staticPhase }: { loop?: boolean; staticPhase?: number } = {},
) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    const t = window.setTimeout(() => {
      setPhase((p) => (p + 1 < durations.length ? p + 1 : loop ? 0 : p));
    }, durations[phase]);
    return () => window.clearTimeout(t);
  }, [active, durations, loop, phase, reduced]);

  return reduced ? (staticPhase ?? durations.length - 1) : phase;
}

/**
 * Reduced-motion preference that reads false while hydrating, then follows the OS setting.
 * Motion's own hook reports the real value on the first client render, which can't match the server HTML.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** In-view flag tuned for looping visualisations: runs only while on screen. */
export function useActive<T extends Element>(amount = 0.35): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  return [ref, inView];
}

/** Writes pointer position into --mx/--my so CSS can draw a spotlight. */
export function spotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Wall-clock time in an IANA zone, refreshed every 15s. Empty until mounted to avoid hydration drift. */
export function useZonedTime(timeZone: string) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  if (!now) return { time: "--:--", offset: "" };
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(now);
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return { time, offset };
}

/** Live media-query match; false during SSR and the first client render. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
