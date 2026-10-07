import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import MotionProvider from "@/components/ui/MotionProvider";
import { LINKS, PROFILE } from "@/lib/data";
import "./globals.css";

// Every face ships with the build (no font fetch at build time): Geist from its
// package, the one serif word per heading from app/fonts (SIL OFL).
const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-serif-face",
  display: "swap",
});

const description =
  "Lucas Sim is a backend engineer with 8+ years building production systems across fintech, SaaS and AI platforms: Go microservices for digital banking, PHP/Laravel product platforms, and MCP tooling with agent guardrails. Open to senior roles in Australia and New Zealand.";

export const metadata: Metadata = {
  // Absolute base for the link-preview image and other metadata URLs.
  metadataBase: new URL("https://lucascodes.dev"),
  title: {
    default: "Lucas Sim — Backend Engineer",
    template: "%s — Lucas Sim",
  },
  description,
  keywords: [
    "Lucas Sim",
    "Sim Zhen Quan",
    "Backend Engineer",
    "Go",
    "Golang",
    "Microservices",
    "Laravel",
    "Redis",
    "PostgreSQL",
    "MCP",
    "Fintech",
    "Australia",
    "New Zealand",
  ],
  authors: [{ name: PROFILE.fullName, url: LINKS.linkedin }],
  openGraph: {
    type: "profile",
    title: "Lucas Sim — Backend Engineer",
    description,
    siteName: "Lucas Sim",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Sim — Backend Engineer",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.fullName,
  alternateName: PROFILE.name,
  jobTitle: PROFILE.role,
  address: { "@type": "PostalAddress", addressLocality: "Kuala Lumpur", addressCountry: "MY" },
  worksFor: { "@type": "Organization", name: PROFILE.current.company },
  sameAs: [LINKS.github, LINKS.linkedin],
  knowsAbout: ["Go", "Microservices", "Redis", "PostgreSQL", "Laravel", "Model Context Protocol"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
