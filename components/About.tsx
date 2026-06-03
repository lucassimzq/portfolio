import Label from "./Label";
import Reveal from "./Reveal";

export default function About() {
  return (
    <Reveal id="about" style={{ padding: "48px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <Label text="about" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 580 }}>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
            Senior Software Engineer with 7+ years across the full stack — backend-heavy by
            training, but comfortable owning frontend when the product needs it. Currently
            at GXBank building Go microservices engineered for{" "}
            <span style={{ color: "var(--text-1)", fontWeight: 500 }}>99.99% availability</span>{" "}
            under real-time financial transaction load.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
            I've shipped across fintech, edtech, and e-commerce — from resolving{" "}
            <span style={{ color: "var(--text-1)", fontWeight: 500 }}>
              critical race conditions
            </span>{" "}
            and cutting SQL query times by 97.5%, to leading 0-to-1 product builds with Vue.js
            frontends, Laravel backends, and teams of 5–6 engineers.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
            Comfortable working with{" "}
            <span style={{ color: "var(--text-1)", fontWeight: 500 }}>
              AI-assisted development
            </span>{" "}
            — using LLM tooling day-to-day to move faster on repetitive work, think through
            problems, and keep focus on what actually matters. Still very much learning, but
            it's become a natural part of how I work.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--text-3)",
              marginTop: 4,
            }}
          >
            <span style={{ color: "var(--accent)", fontSize: 8 }}>◉</span>
            Based in Malaysia
          </div>
        </div>
      </div>
    </Reveal>
  );
}
