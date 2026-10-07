import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PROFILE } from "@/lib/data";

export const alt =
  "Lucas Sim, backend engineer. I make money move safely and queries run fast. Open to senior roles in Australia and New Zealand.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (...parts: string[]) => readFile(join(process.cwd(), ...parts)).catch(() => null);

/** The link preview in the site's own look: white, ink, one serif word, mono for the small print. */
export default async function Image() {
  const [avatar, sans, mono, serif] = await Promise.all([
    readFile(join(process.cwd(), "app/icon.png")),
    font("node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf"),
    font("node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf"),
    font("app/fonts/instrument-serif-latin-400-italic.woff"),
  ]);

  const fonts = [];
  if (sans) fonts.push({ name: "Sans", data: sans, weight: 500 as const, style: "normal" as const });
  if (mono) fonts.push({ name: "Mono", data: mono, weight: 400 as const, style: "normal" as const });
  if (serif) fonts.push({ name: "Serif", data: serif, weight: 400 as const, style: "italic" as const });
  const em = { fontFamily: serif ? "Serif" : undefined, fontStyle: "italic" as const, fontSize: "1.1em" };
  const small = { fontFamily: mono ? "Mono" : undefined, fontSize: 20, letterSpacing: 1.5, color: "#737373" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          background: "#ffffff",
          color: "#0a0a0a",
          fontFamily: sans ? "Sans" : undefined,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", ...small }}>
          <span>FIG 0.1 · LUCASCODES.DEV</span>
          <span>OPEN TO AU / NZ</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
            <div style={{ display: "flex", fontSize: 30, color: "#737373" }}>{`${PROFILE.name} · ${PROFILE.role}`}</div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 18, fontSize: 76, lineHeight: 1.08, letterSpacing: -3 }}>
              {/* Spaces trail each piece so a wrapped line never starts indented. */}
              <span>I make money move&nbsp;</span>
              <span style={em}>safely,&nbsp;</span>
              <span>queries run&nbsp;</span>
              <span style={em}>fast</span>
              <span>.</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: 240,
              height: 240,
              borderRadius: 999,
              padding: 8,
              border: "1.5px solid #e5e5e5",
            }}
          >
            <img src={`data:image/png;base64,${avatar.toString("base64")}`} width={222} height={222} style={{ borderRadius: 999 }} alt="" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e5e5", paddingTop: 24, ...small }}>
          <span>{`${PROFILE.years} YRS · GO · REDIS · POSTGRESQL · MCP`}</span>
          <span style={{ color: "#0a0a0a" }}>KUALA LUMPUR → AU / NZ</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
