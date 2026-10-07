"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import InView, { at } from "@/components/ui/InView";
import { Figure, type FigureName } from "@/components/ui/Figure";
import { ArrowRight, ArrowUpRight, Github } from "@/components/ui/Icons";
import { PROJECTS, type Project } from "@/lib/data";

/** The figure that stands for each project, and what it shows. */
const FIGURE: Record<Project["preview"], { name: FigureName; label: string }> = {
  inlet: { name: "exploded", label: "An app window in four layers; moving across opens the gap" },
  rag: { name: "loupe", label: "A loupe over a ruled sheet; the pointer drags it across" },
  transfer: { name: "slow", label: "Crates riding a belt through a gate; hovering slows the clock" },
  crab: { name: "terminal", label: "A terminal window; the pointer's height scrolls back through its history" },
};

function Tile({ p, n, picked, onOpen }: { p: Project; n: number; picked: boolean; onOpen: (el: HTMLButtonElement) => void }) {
  const button = useRef<HTMLButtonElement>(null);
  const [read, setRead] = useState("");
  const fig = FIGURE[p.preview];
  return (
    <article className="tile flex flex-col" data-picked={picked ? "" : undefined} onClick={() => button.current && onOpen(button.current)}>
      <div className="plate-stage">
        <div className="plate-corner top">
          <span>Fig 4.{n}</span>
          <span>{p.status ? "Alpha" : p.repoUrl ? "Open source" : ""}</span>
        </div>
        <Figure name={fig.name} label={fig.label} onRead={setRead} />
        <div className="plate-corner bottom" aria-hidden>
          <span>Open</span>
          <span className="readout">{read}</span>
        </div>
      </div>
      <div className="tile-foot mt-auto">
        <div className="min-w-0">
          <h3 className="tile-name">
            <button ref={button} type="button" className="text-left" aria-haspopup="dialog">
              {p.title}
            </button>
          </h3>
          <p className="tile-kicker">{p.kicker}</p>
        </div>
        <ArrowRight size={15} className="shrink-0 text-ink-3" />
      </div>
    </article>
  );
}

/** The project's card: a sheet from below on a phone, a card at the right on a desk. */
function Detail({ p, open, onClose }: { p: Project | null; open: boolean; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const [read, setRead] = useState("");

  useEffect(() => {
    if (!open) return;
    close.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose]);

  const fig = p ? FIGURE[p.preview] : null;
  return (
    <>
      <div className="scrim" data-open={open ? "" : undefined} onClick={onClose} aria-hidden />
      <aside className="drawer" data-open={open ? "" : undefined} role="dialog" aria-modal="false" aria-label={p?.title ?? "Project"}>
        {p && fig && (
          <div className="grid gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[17px] font-medium leading-tight tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-1 text-[13px] text-ink-3">
                  {p.kicker}
                  {p.status && <> · {p.status}</>}
                </p>
              </div>
              <button ref={close} type="button" className="detail-close" onClick={onClose} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <div className="detail-stage plate-stage" key={p.slug}>
              <Figure name={fig.name} label={fig.label} onRead={setRead} intensity={0.75} />
              <div className="plate-corner bottom" aria-hidden>
                <span />
                <span className="readout">{read}</span>
              </div>
            </div>
            <p className="text-[14px] leading-relaxed text-ink-2">{p.blurb}</p>
            {p.note && <p className="text-[12.5px] text-ink-3">{p.note}</p>}
            <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
              {p.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-1">
              {p.demoUrl && (
                <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  {p.demoLabel ?? "Live demo"} <ArrowUpRight size={14} className="btn-icon-x" />
                </a>
              )}
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                  <Github size={14} /> Code
                </a>
              )}
              {p.caseStudy && (
                <Link href={p.caseStudy} className="btn btn-sm">
                  Case study <ArrowRight size={14} className="btn-icon-x" />
                </Link>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default function Projects() {
  const [picked, setPicked] = useState<number | null>(null);
  // the card keeps its project while it slides away, so its contents don't vanish mid-exit
  const [shown, setShown] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const onClose = () => {
    setPicked(null);
    opener.current?.focus({ preventScroll: true });
  };

  return (
    <section id="projects" className="sec shell py-14 md:py-20">
      <InView>
        <p className="sec-label" style={at(0)}>
          <span>
            <b>04</b> · Projects
          </span>
        </p>
        <h2 className="sec-h" style={at(1)}>
          Things I&apos;ve <em>built</em>.
        </h2>
        <p className="sec-lede" style={at(2)}>
          Pick one for the details.
        </p>
      </InView>

      <InView className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4" amount={0.1}>
        {PROJECTS.map((p, i) => (
          <div key={p.slug} style={at(i)} className="[&>.tile]:h-full">
            <Tile
              p={p}
              n={i + 1}
              picked={picked === i}
              onOpen={(el) => {
                opener.current = el;
                setShown(i);
                setPicked((cur) => (cur === i ? null : i));
              }}
            />
          </div>
        ))}
      </InView>

      <Detail p={shown === null ? null : PROJECTS[shown]} open={picked !== null} onClose={onClose} />
    </section>
  );
}
