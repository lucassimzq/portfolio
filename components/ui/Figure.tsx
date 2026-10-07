"use client";

import { useState, type ReactNode } from "react";
import Query from "@/components/figures/Query";
import Ship from "@/components/figures/Ship";
import Migration from "@/components/figures/Migration";
import Guardrails from "@/components/figures/Guardrails";
import Race from "@/components/figures/Race";
import Slots from "@/components/figures/Slots";
import Inlet from "@/components/figures/Inlet";
import Rag from "@/components/figures/Rag";
import Transfer from "@/components/figures/Transfer";
import Crab from "@/components/figures/Crab";

/**
 * The site's line figures, by name, all drawn with components/figures/kit.tsx. Each
 * answers the pointer and reports a short caption through `onRead`.
 */
const FIGURES = {
  query: Query,
  ship: Ship,
  migration: Migration,
  guardrails: Guardrails,
  race: Race,
  slots: Slots,
  inlet: Inlet,
  rag: Rag,
  transfer: Transfer,
  crab: Crab,
};

export type FigureName = keyof typeof FIGURES;

export function Figure({ name, label, onRead }: { name: FigureName; label: string; onRead?: (text: string) => void }) {
  const Fig = FIGURES[name];
  return <Fig label={label} onRead={onRead} />;
}

/**
 * A plate: a card with a live figure on its stage, a figure number and a note in its
 * top corners, a hint and the figure's read-out in its bottom ones, and whatever the
 * caller puts under it. A figure that needs more than a name comes in through `draw`.
 */
export function Plate({
  name,
  draw,
  label,
  fig,
  note,
  hint,
  children,
  className = "",
}: {
  name?: FigureName;
  draw?: (onRead: (text: string) => void) => ReactNode;
  label: string;
  fig: string;
  note?: string;
  hint: string;
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
        {draw ? draw(setRead) : name && <Figure name={name} label={label} onRead={setRead} />}
        <div className="plate-corner bottom" aria-hidden>
          <span>{hint}</span>
          <span className="readout">{read}</span>
        </div>
      </div>
      {children}
    </article>
  );
}
