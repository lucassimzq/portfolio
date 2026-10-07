"use client";

import Image from "next/image";
import { useZonedTime } from "@/components/ui/hooks";
import { useEmail } from "@/components/site/Email";
import { LINKS, PROFILE } from "@/lib/data";
import skyline from "@/assets/me/skyline.webp";

/** One line under a hairline: who, where and when, then the ways to reach him. */
export default function Footer({ year }: { year: number }) {
  const { time } = useZonedTime(PROFILE.timezone);
  const email = useEmail();

  return (
    <footer className="shell">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-5 border-t border-line py-8 text-[13px] text-ink-3">
        <div className="flex items-center gap-3">
          <span className="photo relative block h-9 w-9 shrink-0 !rounded-full">
            <Image src={skyline} alt="" fill sizes="36px" className="object-cover" />
          </span>
          <p>
            © {year} <span className="text-ink">{PROFILE.fullName}</span> · Kuala Lumpur{" "}
            <span className="font-mono text-[12px] tabular-nums">{time}</span>
          </p>
        </div>
        <nav className="flex flex-wrap gap-5 md:ml-auto" aria-label="Elsewhere">
          <a className="text-ink draw-underline" href={email ? `mailto:${email}` : "#contact"}>
            Email
          </a>
          <a className="text-ink draw-underline" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="text-ink draw-underline" href={LINKS.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="text-ink draw-underline" href={LINKS.resume} target="_blank" rel="noopener">
            Résumé
          </a>
        </nav>
      </div>
      <p className="pb-8 text-[12px] text-faint">
        Line figures by{" "}
        <a className="doc-more" href="https://github.com/lucasmarkes/hairline" target="_blank" rel="noopener noreferrer">
          hairline
        </a>
        . Built with Next.js.
      </p>
    </footer>
  );
}
