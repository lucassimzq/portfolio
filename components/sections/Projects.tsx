"use client";

import { useRef } from "react";
import Link from "next/link";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight, Github } from "@/components/ui/Icons";
import { spotlight, useMediaQuery } from "@/components/ui/hooks";
import { PROJECTS, type Project } from "@/lib/data";
import Window from "@/components/projects/Window";
import InletPreview from "@/components/projects/InletPreview";
import RagPreview from "@/components/projects/RagPreview";
import TransferPreview from "@/components/projects/TransferPreview";
import CrabPreview from "@/components/projects/CrabPreview";

const PREVIEW = { inlet: InletPreview, rag: RagPreview, transfer: TransferPreview, crab: CrabPreview } as const;
// Phones stack the preview under the copy, so each one gets the height its content needs.
const PREVIEW_H = { inlet: "h-[500px]", rag: "h-[560px]", transfer: "h-[480px]", crab: "h-[500px]" } as const;

function ProjectCard({
  project: p,
  index,
  total,
  progress,
  stacked,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacked: boolean;
}) {
  // Earlier cards sink back and dim as the next one slides over them.
  const end = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [index / total, 1], [1, end]);
  const dim = useTransform(progress, [index / total, 1], [0, (total - 1 - index) * 0.28]);
  const Preview = PREVIEW[p.preview];

  return (
    <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
      <m.article
        onPointerMove={spotlight}
        style={stacked ? { scale, top: index * 28 } : undefined}
        className="spotlight relative w-full origin-top overflow-hidden rounded-[28px] border border-line bg-card lg:h-[min(640px,calc(100vh-150px))]"
      >
        <div className="grid h-full grid-cols-1 lg:grid-cols-12">
          <div className="flex flex-col p-7 sm:p-10 lg:col-span-5">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              <span className="text-accent">P/{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-6 bg-line-strong" />
              {p.kicker}
            </div>
            <h3 className="mt-6 text-[clamp(34px,3.7vw,58px)] font-medium leading-[0.98] tracking-[-0.045em] text-ink [font-stretch:88%]">
              {p.title}
            </h3>
            <p className="mt-5 max-w-[34rem] text-[15.5px] leading-relaxed text-ink-2">{p.description}</p>
            {p.note && <p className="mt-2.5 text-[12.5px] text-ink-3">{p.note}</p>}
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Built with">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3"
                >
                  {t}
                </li>
              ))}
            </ul>
            <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2" aria-label="How it works">
              {p.flow.map((step, s) => (
                <li key={step} className="flex items-center gap-2">
                  {s > 0 && <span className="text-accent" aria-hidden>→</span>}
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-9">
              {p.caseStudy && (
                <Link href={p.caseStudy} className="btn btn-sm btn-primary">
                  Read the case study <ArrowUpRight className="btn-icon-x" size={16} />
                </Link>
              )}
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost"
                  aria-label={`${p.title} live demo (opens in a new tab)`}
                >
                  Live demo <ArrowUpRight className="btn-icon-x" size={16} />
                </a>
              )}
              {p.repoUrl && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost"
                  aria-label={`${p.title} source code on GitHub (opens in a new tab)`}
                >
                  <Github size={16} /> Code
                </a>
              )}
              {p.status && (
                <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">
                  <span className="live-dot text-accent" style={{ width: 6, height: 6 }} />
                  {p.status}
                </span>
              )}
            </div>
          </div>

          <div className="relative min-h-0 px-4 pb-4 sm:px-6 sm:pb-6 lg:col-span-7 lg:py-6 lg:pl-0">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[110px]"
            />
            <Window chrome={p.chrome} className={`relative ${PREVIEW_H[p.preview]} sm:h-[480px] lg:h-full`}>
              <Preview />
            </Window>
          </div>
        </div>
        <m.div aria-hidden className="pointer-events-none absolute inset-0 bg-bg" style={{ opacity: stacked ? dim : 0 }} />
      </m.article>
    </div>
  );
}

export default function Projects() {
  const stackRef = useRef<HTMLDivElement>(null);
  const stacked = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <section id="projects" className="relative pt-24 md:pt-32 lg:pb-16">
      <div className="shell">
        <SectionHeading
          index="04"
          label="Projects"
          title="Making the invisible *visible.*"
          intro="Side projects that make hidden things visible: query round trips, a RAG pipeline, money moving, and your Claude Code limits. Each preview is a live animation of what the real thing does."
        />
        <div ref={stackRef} className="relative flex flex-col gap-6 lg:gap-0">
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              index={i}
              total={PROJECTS.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
