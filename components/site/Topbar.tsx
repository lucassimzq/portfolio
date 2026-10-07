"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Github } from "@/components/ui/Icons";
import { LINKS, NAV, PROFILE } from "@/lib/data";

/**
 * The bar on every page: the name home with the role beside it, a step smaller and
 * greyer, then the sections and GitHub. A dot flies to the section in view.
 */
export default function Topbar() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el);
    const pick = () => {
      setScrolled(window.scrollY > 8);
      const band = window.innerHeight * 0.35;
      // the last section in page order whose top has passed the band
      let hit: string | null = null;
      for (const s of sections) if (s.getBoundingClientRect().top < band) hit = s.id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) hit = sections.at(-1)?.id ?? hit;
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

  // before paint, so the dot is never drawn by a link that is no longer marked
  useLayoutEffect(() => {
    const d = dot.current, list = nav.current;
    if (!d || !list) return;
    const link = active ? list.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (!link) {
      d.style.opacity = "0";
      return;
    }
    const box = list.getBoundingClientRect(), at = link.getBoundingClientRect();
    d.style.translate = `${at.left - box.left + 2}px 0`;
    d.style.opacity = "1";
  }, [active]);

  return (
    <header className="topbar" data-scrolled={scrolled ? "" : undefined}>
      <div className="flex items-baseline gap-2">
        <Link href="/" className="relative text-[15px] font-medium tracking-[-0.02em]">
          {PROFILE.name}
        </Link>
        <span className="topbar-sub">{PROFILE.role}</span>
      </div>
      <nav ref={nav} aria-label="Sections" className="relative flex items-center">
        <span ref={dot} className="topbar-dot" aria-hidden />
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`/#${n.id}`}
            className={`topbar-link ${n.id === "about" ? "max-[519px]:hidden" : ""}`}
            aria-current={active === n.id ? "location" : undefined}
          >
            {n.label}
          </a>
        ))}
        <a className="topbar-link" href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Github size={16} />
        </a>
      </nav>
    </header>
  );
}
