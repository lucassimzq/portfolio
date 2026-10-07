"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { LINKS, NAV, PROFILE } from "@/lib/data";
import { ArrowUpRight } from "@/components/ui/Icons";
import { useEmail } from "@/components/site/Email";
import avatar from "@/assets/me/avatar.webp";

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const email = useEmail();

  // Hide on the way down, return on the way up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
    setScrolled(y > 24);
  });

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <m.header
        initial={false}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled || open ? "border-line bg-bg/75 backdrop-blur-xl" : "border-transparent"
          }`}
        >
          <div className="shell flex h-16 items-center justify-between gap-6">
            <a href="#top" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
              <Image
                src={avatar}
                alt=""
                width={30}
                height={30}
                className="shrink-0 rounded-full transition-transform duration-700 ease-expo group-hover:rotate-[360deg]"
              />
              <span className="text-[15px] font-medium tracking-tight">{PROFILE.name}</span>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3 sm:inline">
                / {PROFILE.role}
              </span>
            </a>

            <NavLinks active={active} />

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 xl:flex">
                <span className="live-dot text-ok" style={{ width: 6, height: 6 }} />
                Open to AU / NZ
              </span>
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noopener"
                className="hidden items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-[13px] text-ink transition-colors duration-300 hover:border-accent hover:text-accent sm:flex"
              >
                Résumé <ArrowUpRight size={14} />
              </a>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line-strong lg:hidden"
              >
                <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
                <span
                  className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-expo ${open ? "rotate-45" : "-translate-y-[3px]"}`}
                />
                <span
                  className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-expo ${open ? "-rotate-45" : "translate-y-[3px]"}`}
                />
              </button>
            </div>
          </div>
        </div>
        <m.div aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent" style={{ scaleX: progress }} />
      </m.header>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-6 pb-10 pt-28 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((n, i) => (
                <li key={n.id} className="overflow-hidden">
                  <m.a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-4 py-1 text-[44px] font-medium leading-tight tracking-[-0.04em]"
                  >
                    <span className="font-mono text-[12px] tracking-normal text-accent">0{i + 1}</span>
                    {n.label}
                  </m.a>
                </li>
              ))}
            </ul>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2 border-t border-line pt-6 text-[15px] text-ink-2"
            >
              {email && <a href={`mailto:${email}`}>{email}</a>}
              <div className="flex gap-5">
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href={LINKS.resume} target="_blank" rel="noopener">Résumé</a>
              </div>
            </m.div>
          </m.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/** Desktop links with a pill that glides to the section in view. */
function NavLinks({ active }: { active: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
      setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul
        ref={listRef}
        className="relative flex items-center gap-0.5 rounded-full border border-line bg-elev/70 p-1 backdrop-blur-md"
      >
        <m.span
          aria-hidden
          className="absolute bottom-1 left-0 top-1 rounded-full bg-[#1d1d21]"
          initial={false}
          animate={pill ? { x: pill.x, width: pill.w, opacity: 1 } : { opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        />
        {NAV.map((n) => (
          <li key={n.id} data-id={n.id} className="relative">
            <a
              href={`#${n.id}`}
              aria-current={active === n.id ? "true" : undefined}
              className={`relative block rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${
                active === n.id ? "text-ink" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              {n.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
