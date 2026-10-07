"use client";

import Link from "next/link";
import { m, useScroll, useSpring } from "motion/react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import { ArrowLeft, ArrowUpRight, Github } from "@/components/ui/Icons";
import { PROFILE } from "@/lib/data";

type Props = {
  index: string;
  slug: string;
  title: string;
  subtitle?: string;
  dek: string;
  tags: string[];
  demoUrl: string;
  repoUrl?: string;
  next: { href: string; title: string; kicker: string };
  children: React.ReactNode;
};

/** Frame for the long-form case studies: reading progress, header, and a hand-off to the next one. */
export default function ArticleShell({ index, slug, title, subtitle, dek, tags, demoUrl, repoUrl, next, children }: Props) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <>
      <a
        href="#article"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to article
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="shell flex h-14 items-center justify-between gap-4">
          <Link href="/#projects" className="group inline-flex items-center gap-2 text-[14px] text-ink-2 transition-colors hover:text-ink">
            <ArrowLeft size={16} className="transition-transform duration-500 ease-expo group-hover:-translate-x-1" />
            Back to projects
          </Link>
          <div className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 md:block">
            <Link href="/" className="transition-colors hover:text-ink">
              {PROFILE.name}
            </Link>{" "}
            / projects / <span className="text-ink-2">{slug}</span>
          </div>
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[14px] text-accent"
          >
            Live demo
            <ArrowUpRight size={15} className="transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
        <m.div aria-hidden className="absolute -bottom-px left-0 h-px w-full origin-left bg-accent" style={{ scaleX: progress }} />
      </header>

      <main id="article" className="relative overflow-hidden pb-24 pt-32 md:pt-40">
        <div className="shell relative">
          <div className="mx-auto max-w-[880px]">
            <Reveal y={12} className="eyebrow flex items-center gap-3">
              <span className="text-accent">Case study · {index}</span>
              <span className="h-px w-10 bg-line-strong" />
              {slug}
            </Reveal>
            <SplitText as="h1" text={title} className="display mt-6 text-[clamp(34px,5vw,56px)]" stagger={0.045} />
            {subtitle && (
              <Reveal delay={0.25} className="serif-accent mt-3 text-[clamp(24px,2.8vw,38px)] leading-tight text-ink-2">
                {subtitle}
              </Reveal>
            )}
            <Reveal delay={0.3} className="mt-8 max-w-[640px] text-[19px] leading-relaxed text-ink-2">
              {dek}
            </Reveal>
            <Reveal delay={0.4} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-line pt-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                By <span className="text-ink-2">{PROFILE.name}</span>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Stack">
                {tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 md:ml-auto">
                <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                  Live demo <ArrowUpRight size={16} className="btn-icon-x" />
                </a>
                {repoUrl && (
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                    <Github size={16} /> Code
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          <article className="article-body mx-auto mt-20 max-w-[720px]">{children}</article>

          <Reveal className="mx-auto mt-24 max-w-[880px]">
            <Link
              href={next.href}
              className="group relative block overflow-hidden plate p-8 sm:p-10"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Next case study</span>
              <span className="mt-4 flex items-end justify-between gap-6">
                <span>
                  <span className="block text-[clamp(26px,3.2vw,40px)] font-medium leading-[1.05] tracking-[-0.035em] text-ink">
                    {next.title}
                  </span>
                  <span className="serif-accent mt-2 block text-[22px] text-ink-2">{next.kicker}</span>
                </span>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-ink group-hover:text-white">
                  <ArrowUpRight size={22} />
                </span>
              </span>
            </Link>
            <div className="mt-8 flex justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              <Link href="/#projects" className="transition-colors hover:text-ink">
                ← All projects
              </Link>
              <Link href="/#contact" className="transition-colors hover:text-ink">
                Get in touch →
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
    </>
  );
}
