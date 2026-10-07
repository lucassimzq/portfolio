"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import InView, { at } from "@/components/ui/InView";
import { Plate } from "@/components/ui/Figure";
import { CONTRACT, EDUCATION, EXPERIENCE, STACK } from "@/lib/data";

/** *phrase* → bold ink. */
function emphasise(text: string) {
  return text.split(/(\*[^*]+\*)/).map((chunk, i) =>
    chunk.startsWith("*") ? <b key={i}>{chunk.slice(1, -1)}</b> : <Fragment key={i}>{chunk}</Fragment>,
  );
}

/** "Jul 2026 — Present" → "2026 — now"; the months stay in the résumé. */
const years = (period: string) =>
  period
    .replace(/[A-Z][a-z]{2} /g, "")
    .replace("Present", "now")
    .replace(/(\d{4}) — \1/, "$1");

/**
 * The career as a rail: each role hangs off a trunk on a hairline arm. As the page
 * scrolls, the trunk draws down to the role in view, its arm bends out in ink, a dot
 * lands by its year, and the other roles step back.
 */
export default function Career() {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-role]"));
    const pick = () => {
      const band = window.innerHeight * 0.55;
      let hit = -1;
      rows.forEach((r, i) => {
        if (r.getBoundingClientRect().top < band) hit = i;
      });
      // once the list is fully read, keep the last role marked
      setActive(hit);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  // the trunk reaches to the marked role's arm, measured before paint so the two meet with no seam
  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const row = active >= 0 ? el.querySelectorAll<HTMLElement>("[data-role]")[active] : null;
    const reach = row ? (row.offsetTop + 22) / (el.clientHeight - 12) : 0;
    el.style.setProperty("--reach", String(Math.min(1, reach)));
  }, [active]);

  return (
    <section id="career" className="sec shell py-14 md:py-20">
      <InView>
        <p className="sec-label" style={at(0)}>
          <span>
            <b>03</b> · Career
          </span>
        </p>
        <h2 className="sec-h" style={at(1)}>
          Eight years, four <em>companies</em>.
        </h2>
      </InView>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <aside className="hidden md:block lg:col-span-5">
          <div className="grid gap-3.5 lg:sticky lg:top-[calc(var(--topbar)+24px)]">
            <Plate
              name="elevator"
              label="Four floors beside an open shaft; the pointer's height picks a floor and the car travels there"
              fig="3.1"
              note="4 floors · 4 companies"
              hint="Move up, down"
            />
            <div className="plate p-4">
              <p className="mono-label">Everyday stack</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {STACK.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-7">
          <ol ref={list} className="career" data-live={active >= 0 ? "" : undefined}>
            {EXPERIENCE.map((r, i) => (
              <li key={r.id} data-role className="role" data-on={i === active ? "" : undefined} aria-current={i === active ? "step" : undefined}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="role-when">{years(r.period)}</p>
                  <p className="mono-label">{r.domain}</p>
                </div>
                <h3 className="role-name">
                  {r.role} <span className="role-org">· {r.company}</span>
                </h3>
                <p className="role-win mt-1.5">
                  <b>{r.win.metric}</b> · {r.win.label}
                </p>
                <ul className="role-list max-sm:[&>li:nth-child(n+2)]:hidden">
                  {r.highlights.slice(0, 2).map((h) => (
                    <li key={h}>{emphasise(h)}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <InView className="mt-8 grid gap-3.5 sm:grid-cols-2">
            <div className="plate p-4" style={at(0)}>
              <p className="mono-label">Also · contract</p>
              <p className="mt-2.5 text-[14px] font-medium leading-snug">{CONTRACT.company}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-3">Concurrency, locking and money movement. {CONTRACT.location}.</p>
            </div>
            <div className="plate p-4" style={at(1)}>
              <p className="mono-label">Education</p>
              <ul className="mt-2.5 grid gap-1.5 text-[13.5px] leading-snug">
                {EDUCATION.map((e) => (
                  <li key={e.degree}>
                    <span className="font-medium">{e.degree}</span>{" "}
                    <span className="text-ink-3">
                      · {e.school}, {e.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}
