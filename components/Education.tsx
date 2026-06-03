import Label from "./Label";
import Reveal from "./Reveal";

const EDUCATION = [
  {
    degree: "Bachelor of Computer Science",
    school: "UOWM KDU University College",
    year: "2021",
  },
  {
    degree: "Diploma in Computer Studies",
    school: "KDU University College",
    year: "2019",
  },
];

export default function Education() {
  return (
    <Reveal id="education" style={{ padding: "48px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <Label text="education" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EDUCATION.map((edu, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                border: "1px solid var(--border)",
                borderRadius: 4,
                background: "var(--bg-card)",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {edu.degree}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-2)" }}>{edu.school}</p>
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  background: "var(--accent-dim)",
                  border: "1px solid var(--accent-border)",
                  color: "var(--accent)",
                  borderRadius: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {edu.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
