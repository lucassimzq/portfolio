"use client";

import Link from "next/link";
import Label from "./Label";
import Reveal from "./Reveal";
import { PROJECTS } from "@/lib/data";

export default function Projects() {
  return (
    <Reveal id="projects" style={{ padding: "48px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <Label text="projects" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  padding: "20px",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  background: "var(--bg-card)",
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-border)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--accent-dim)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 10,
                    gap: 12,
                  }}
                >
                  <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
                    {project.title}
                  </h3>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--accent)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Read more →
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-2)",
                    lineHeight: 1.6,
                    marginBottom: 14,
                  }}
                >
                  {project.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {project.tags.map((tag) => (
                      <span key={tag} className="skill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: 11,
                        color: "var(--accent)",
                        textDecoration: "none",
                        border: "1px solid var(--accent-border)",
                        background: "var(--accent-dim)",
                        padding: "3px 10px",
                        borderRadius: 3,
                        flexShrink: 0,
                      }}
                    >
                      Live demo →
                    </a>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
