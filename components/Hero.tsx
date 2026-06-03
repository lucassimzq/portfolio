"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [progress, setProgress] = useState(0);
  const cmd = "$ ./portfolio --init";

  // Type the command
  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setTyped(cmd.slice(0, i));
        if (i >= cmd.length) {
          clearInterval(iv);
          setTimeout(() => setStep(1), 350);
        }
      }, 35);
      return () => clearInterval(iv);
    }, 500);
    return () => clearTimeout(delay);
  }, []);

  // Progress bar
  useEffect(() => {
    if (step !== 1) return;
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => setStep(2), 200);
      }
      setProgress(Math.min(p, 100));
    }, 50);
    return () => clearInterval(iv);
  }, [step]);

  // Status → content
  useEffect(() => {
    if (step !== 2) return;
    const t = setTimeout(() => setStep(3), 500);
    return () => clearTimeout(t);
  }, [step]);

  const barLen = 22;
  const filled = Math.floor((progress / 100) * barLen);
  const bar = "█".repeat(filled) + "░".repeat(barLen - filled);

  return (
    <section
      id="hero"
      data-screen-label="hero"
      style={{ padding: "80px 0 48px", position: "relative", overflow: "hidden" }}
    >
      <div className="hero-glow" />
      <div className="container" style={{ position: "relative" }}>
        {/* Terminal lines */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, lineHeight: 2, color: "var(--text-2)" }}>
            <span style={{ color: "var(--accent)", marginRight: 8 }}>→</span>
            {typed}
            {step === 0 && <span className="cursor-blink">▌</span>}
          </div>

          {step >= 1 && (
            <div
              style={{
                fontSize: 12,
                lineHeight: 2,
                color: "var(--text-3)",
                animation: "fadeUp 0.2s ease-out",
              }}
            >
              [{bar}] {progress >= 100 ? "done" : `${Math.floor(progress)}%`}
            </div>
          )}

          {step >= 2 && (
            <div
              style={{
                fontSize: 13,
                lineHeight: 2,
                color: "var(--text-2)",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <span style={{ color: "var(--accent)", marginRight: 6 }}>✓</span>
              profile loaded
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            opacity: step >= 3 ? 1 : 0,
            transform: step >= 3 ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            Senior Software Engineer
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-2)",
              maxWidth: 480,
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            Full-stack across the whole product — backend systems, frontend interfaces,
            and AI-accelerated workflows. Strong in Go and Laravel, comfortable anywhere
            in the stack.
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              fontSize: 12,
              color: "var(--text-3)",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span>7+ yrs experience</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span>Malaysia</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span>
              Currently{" "}
              <span style={{ color: "var(--accent)" }}>@GXBank</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
