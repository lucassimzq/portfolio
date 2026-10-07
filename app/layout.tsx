import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import MotionProvider from "@/components/ui/MotionProvider";
import { LINKS, PROFILE } from "@/lib/data";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans-face",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-face",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

const description =
  "Lucas Sim is a backend engineer with 8+ years building production systems across fintech, SaaS and AI platforms: Go microservices for digital banking, PHP/Laravel product platforms, and MCP tooling with agent guardrails. Open to senior roles in Australia and New Zealand.";

export const metadata: Metadata = {
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
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.fullName,
  alternateName: PROFILE.name,
  jobTitle: PROFILE.role,
  email: PROFILE.email,
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
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <MotionProvider>{children}</MotionProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
