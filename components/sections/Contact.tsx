"use client";

import { useCallback, useState } from "react";
import InView, { at } from "@/components/ui/InView";
import Swap from "@/components/ui/Swap";
import EmailPill from "@/components/site/EmailPill";
import { Plate } from "@/components/ui/Figure";
import { ArrowUpRight, Download, Github, Linkedin } from "@/components/ui/Icons";
import { useZonedTime, usePrefersReducedMotion } from "@/components/ui/hooks";
import { LINKS, PROFILE } from "@/lib/data";
import { CITIES, HOME, LAND_DOTS, MAP_H, MAP_W } from "@/lib/map";

/** The arc from home to a city: a quadratic that bows up and away, like a route on a chart. */
function arc(x: number, y: number) {
  const mx = (HOME.x + x) / 2, my = (HOME.y + y) / 2;
  const dx = x - HOME.x, dy = y - HOME.y;
  const len = Math.hypot(dx, dy);
  const bow = len * 0.22;
  return `M${HOME.x} ${HOME.y}Q${(mx + (dy / len) * bow).toFixed(1)} ${(my - (dx / len) * bow).toFixed(1)} ${x} ${y}`;
}

/** The region as grey dots, home and the city in ink, the route drawn in as a dashed line each time it changes. */
function RouteMap({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const city = CITIES[active];
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block h-full w-full" role="img" aria-label={`A dot map from Kuala Lumpur to ${city.name}`}>
      <path d={LAND_DOTS} stroke="#cfcfd4" strokeWidth={6} strokeLinecap="round" fill="none" />
      <path key={city.id} d={arc(city.x, city.y)} className="route" pathLength={1} fill="none" stroke="#0a0a0a" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
      {CITIES.map((c, i) => (
        <g key={c.id} onPointerEnter={() => onPick(i)} onClick={() => onPick(i)} className="cursor-pointer">
          <circle cx={c.x} cy={c.y} r={22} fill="transparent" />
          <circle cx={c.x} cy={c.y} r={i === active ? 7 : 5} fill={i === active ? "#0a0a0a" : "#fff"} stroke="#0a0a0a" strokeWidth={1.4} style={{ transition: "r 200ms, fill 200ms" }} />
        </g>
      ))}
      <circle cx={HOME.x} cy={HOME.y} r={7} fill="#0a0a0a" />
      <circle cx={HOME.x} cy={HOME.y} r={14} fill="none" stroke="#0a0a0a" strokeWidth={1} opacity={0.35} />
    </svg>
  );
}

export default function Contact() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const city = CITIES[active];
  const home = useZonedTime(HOME.timeZone);
  const there = useZonedTime(city.timeZone);
  const follow = useCallback((i: number) => setActive(i), []);

  const pick = (i: number) => {
    setActive(i);
    setHeld(true);
  };

  return (
    <section id="contact" className="sec shell py-14 md:py-20">
      <InView>
        <p className="sec-label" style={at(0)}>
          <span>
            <b>05</b> · Contact
          </span>
        </p>
      </InView>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <InView className="lg:col-span-5">
          <h2 className="hero-title !max-w-none" style={at(0)}>
            <span className="sr-only">Next stop: Australia or New Zealand.</span>
            <span aria-hidden>
              Next stop:{" "}
              <Swap
                index={active}
                onIndex={follow}
                paused={reduced || held}
                every={2800}
                items={CITIES.map((c) => (
                  <em key={c.id}>{c.name}.</em>
                ))}
              />
            </span>
          </h2>
          <p className="hero-sub" style={at(1)}>
            Senior backend or full-stack roles. {PROFILE.workAuthShort}.
          </p>
          <div className="mt-7 grid gap-2" style={at(2)}>
            <EmailPill className="max-w-[340px]" />
            <div className="flex flex-wrap gap-2">
              <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
                <Linkedin size={15} /> LinkedIn
              </a>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="btn">
                <Github size={15} /> GitHub
              </a>
              <a href={LINKS.resume} target="_blank" rel="noopener" className="btn btn-primary">
                Résumé PDF <Download size={15} className="btn-icon" />
              </a>
            </div>
          </div>
        </InView>

        <InView className="grid gap-3.5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:col-span-7" amount={0.15}>
          <figure className="plate" style={at(0)} onPointerLeave={() => setHeld(false)}>
            <div className="relative aspect-[1000/745]">
              <div className="plate-corner top">
                <span>Fig 5.1</span>
                <span>
                  {HOME.code} → {city.code} · {city.km.toLocaleString("en-US")} km
                </span>
              </div>
              <div className="absolute inset-x-3 bottom-3 top-9">
                <RouteMap active={active} onPick={pick} />
              </div>
            </div>
            <figcaption className="grid grid-cols-2 border-t border-line">
              <div className="px-4 py-3">
                <p className="mono-label">Kuala Lumpur</p>
                <p className="mt-1.5 font-mono text-[17px] tabular-nums">{home.time}</p>
              </div>
              <div className="border-l border-line px-4 py-3">
                <p className="mono-label">{city.name}</p>
                <p className="mt-1.5 font-mono text-[17px] tabular-nums">{there.time}</p>
              </div>
            </figcaption>
          </figure>
          <div style={at(1)} className="hidden sm:block">
            <Plate
              name="plug"
              label="A plug on the floor at the end of its cord; the pointer draws it up toward the socket"
              fig="5.2"
              hint="Bring it closer"
              intensity={0.8}
            >
              <div className="plate-foot">
                <div className="plate-metric">Let&apos;s connect.</div>
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="plate-title doc-more inline-flex items-center gap-1">
                  Message on LinkedIn <ArrowUpRight size={12} />
                </a>
              </div>
            </Plate>
          </div>
        </InView>
      </div>
    </section>
  );
}
