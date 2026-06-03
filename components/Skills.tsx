import Label from "./Label";
import Reveal from "./Reveal";
import { SKILLS } from "@/lib/data";

export default function Skills() {
  return (
    <Reveal id="skills" style={{ padding: "48px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <Label text="skills" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SKILLS.map((group, i) => (
            <div
              key={i}
              className="skill-row-inner"
              style={{ display: "flex", alignItems: "baseline", gap: 16 }}
            >
              <div
                className="skill-label"
                style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  minWidth: 120,
                  flexShrink: 0,
                  fontWeight: 500,
                }}
              >
                {group.cat}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {group.items.map((item, j) => (
                  <span key={j} className="skill-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
