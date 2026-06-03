import Label from "./Label";
import Reveal from "./Reveal";
import { EXPERIENCE } from "@/lib/data";

export default function Experience() {
  return (
    <Reveal id="experience" style={{ padding: "48px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <Label text="experience" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="exp-entry">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "2px 8px",
                    background: "var(--accent-dim)",
                    border: "1px solid var(--accent-border)",
                    color: "var(--accent)",
                    borderRadius: 3,
                  }}
                >
                  {exp.industry}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>{exp.period}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>
                {exp.company}
              </h3>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 10 }}>
                {exp.role}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {exp.highlights.map((h, j) => (
                  <li key={j} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>›</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
