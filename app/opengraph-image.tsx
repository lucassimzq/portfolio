import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PROFILE } from "@/lib/data";

export const alt =
  "Lucas Sim, backend engineer. I make money move safely, queries run fast, and AI agents behave. Open to senior roles in Australia and New Zealand.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Pulls a TTF from Google Fonts at build time; falls back to the default face if offline. */
async function googleFont(query: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${query}`)).text();
    const url = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const [avatar, sans, serif] = await Promise.all([
    readFile(join(process.cwd(), "public/icon.png")),
    googleFont("Instrument+Sans:wght@500"),
    googleFont("Instrument+Serif:ital@1"),
  ]);

  const fonts = [];
  if (sans) fonts.push({ name: "Sans", data: sans, weight: 500 as const, style: "normal" as const });
  if (serif) fonts.push({ name: "Serif", data: serif, weight: 400 as const, style: "italic" as const });
  const accent = { color: "#ff6a0a", fontFamily: serif ? "Serif" : undefined, fontStyle: "italic" as const };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(circle at 85% 20%, #2a1405 0%, #0a0a0b 55%)",
          color: "#f3f0ea",
          fontFamily: sans ? "Sans" : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#b1aca3", letterSpacing: 1 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#5ee08f" }} />
          Open to senior roles · Australia / New Zealand
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <div style={{ fontSize: 132, lineHeight: 0.95, letterSpacing: -6 }}>{PROFILE.name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 28, fontSize: 40, lineHeight: 1.2, color: "#b1aca3" }}>
              {/* Spaces trail each piece so a wrapped line never starts indented. */}
              <span>I make&nbsp;</span>
              <span style={accent}>money&nbsp;</span>
              <span>move safely,&nbsp;</span>
              <span style={accent}>queries&nbsp;</span>
              <span>run fast, and&nbsp;</span>
              <span style={accent}>AI agents&nbsp;</span>
              <span>behave.</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: 260,
              height: 260,
              borderRadius: 999,
              padding: 10,
              border: "2px solid #ff6a0a",
            }}
          >
            <img
              src={`data:image/png;base64,${avatar.toString("base64")}`}
              width={236}
              height={236}
              style={{ borderRadius: 999 }}
              alt=""
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #303036",
            paddingTop: 26,
            fontSize: 24,
            color: "#85807a",
          }}
        >
          <span>
            {PROFILE.role} · {PROFILE.years} years · Go · Redis · PostgreSQL · MCP
          </span>
          <span style={{ color: "#ff6a0a" }}>Kuala Lumpur → AU / NZ</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
