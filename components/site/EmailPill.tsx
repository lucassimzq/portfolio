"use client";

import { useEffect, useState } from "react";
import { useEmail } from "@/components/site/Email";

const Clip = () => (
  <svg className="icopy-a" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" />
    <path d="M10.75 5.25V4a1.75 1.75 0 0 0-1.75-1.75H4A1.75 1.75 0 0 0 2.25 4v5c0 .97.78 1.75 1.75 1.75h1.25" />
  </svg>
);
const Tick = () => (
  <svg className="icopy-b" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);

/** The address as a command you could paste, with a copy button at its end. */
export default function EmailPill({ className = "" }: { className?: string }) {
  const email = useEmail();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <div className={`pill ${className}`}>
      <span className="pill-line">
        <span className="pill-prompt">$ mail </span>
        <a href={email ? `mailto:${email}` : "#contact"} className="text-ink">
          {email || "hello@…"}
        </a>
      </span>
      <button
        type="button"
        className="icopy"
        data-copied={copied ? "" : undefined}
        disabled={!email}
        onClick={() => {
          navigator.clipboard
            ?.writeText(email)
            .then(() => setCopied(true))
            .catch(() => {});
        }}
        aria-label={copied ? "Email address copied" : "Copy email address"}
      >
        <Clip />
        <Tick />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}
