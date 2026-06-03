"use client";

import { useEffect, useState } from "react";

const SECTIONS = ["about", "skills", "projects", "experience", "education"] as const;

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-35% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

export default function Nav() {
  const active = useActiveSection(SECTIONS);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(10,10,12,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 48,
        }}
      >
        <div style={{ fontSize: 13, color: "var(--text-3)", letterSpacing: "0.01em" }}>
          <span style={{ color: "var(--accent)" }}>~</span>/portfolio
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {SECTIONS.map((id) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className={`nav-link ${active === id ? "active" : ""}`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
