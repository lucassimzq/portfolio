"use client";

import { useState, type ReactNode } from "react";
import {
  Branches,
  Cabinet,
  Drawer,
  Elevator,
  Exploded,
  Loupe,
  Padlock,
  Phone,
  Plug,
  Query,
  Riffle,
  Sieve,
  Slow,
  Terminal,
  Terrain,
} from "@lucasmarkes/hairline/react";

/**
 * The line figures from hairline (github.com/lucasmarkes/hairline, MIT) the site uses,
 * by name. Each answers the pointer and reports a short caption through `onRead`.
 */
const FIGURES = {
  branches: Branches,
  cabinet: Cabinet,
  drawer: Drawer,
  elevator: Elevator,
  exploded: Exploded,
  loupe: Loupe,
  padlock: Padlock,
  phone: Phone,
  plug: Plug,
  query: Query,
  riffle: Riffle,
  sieve: Sieve,
  slow: Slow,
  terminal: Terminal,
  terrain: Terrain,
};

export type FigureName = keyof typeof FIGURES;

/** One figure on its 5:4 stage, light whatever the OS theme, with its caption handed up. */
export function Figure({
  name,
  label,
  intensity = 0.6,
  onRead,
  className,
}: {
  name: FigureName;
  label: string;
  intensity?: number;
  onRead?: (text: string) => void;
  className?: string;
}) {
  const Fig = FIGURES[name];
  return <Fig theme="light" intensity={intensity} label={label} onRead={onRead} className={className} />;
}

/**
 * A plate: a card with a live figure on its stage, a figure number and a note in its
 * top corners, a hint and the figure's read-out in its bottom ones, and whatever the
 * caller puts under it.
 */
export function Plate({
  name,
  label,
  fig,
  note,
  hint,
  intensity,
  children,
  className = "",
}: {
  name: FigureName;
  label: string;
  fig: string;
  note?: string;
  hint: string;
  intensity?: number;
  children?: ReactNode;
  className?: string;
}) {
  const [read, setRead] = useState("");
  return (
    <article className={`plate ${className}`}>
      <div className="plate-stage">
        <div className="plate-corner top">
          <span>Fig {fig}</span>
          {note && <span className="text-right">{note}</span>}
        </div>
        <Figure name={name} label={label} intensity={intensity} onRead={setRead} />
        <div className="plate-corner bottom" aria-hidden>
          <span>{hint}</span>
          <span className="readout">{read}</span>
        </div>
      </div>
      {children}
    </article>
  );
}
