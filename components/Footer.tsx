import { LINKS } from "@/lib/data";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "32px 0",
        borderTop: "1px solid var(--border)",
        marginTop: 24,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>
          © 2026 · Built for performance and correctness.
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ fontSize: 12 }}>
            GitHub
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ fontSize: 12 }}>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
