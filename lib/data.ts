// Everything on the site is sourced from Lucas's resume (AU/NZ edition, 2026); the side
// projects come from their own repositories. Keep claims here in sync with the PDF in /public.

export const PROFILE = {
  name: "Lucas Sim",
  fullName: "Sim Zhen Quan (Lucas)",
  role: "Backend Engineer",
  years: "8+",
  location: "Kuala Lumpur, Malaysia",
  timezone: "Asia/Kuala_Lumpur",
  current: { role: "AI Platform Engineer", company: "YTL AI Labs" },
  summary:
    "Backend engineer with 8+ years building production systems across fintech, SaaS, and AI platform work. Experienced in Go microservices for digital banking, PHP/Laravel product platforms, and practical AI tooling including MCP for internal operational systems.",
  seeking: "Senior backend or full-stack roles in Australia or New Zealand",
  workAuth:
    "Malaysian citizen. Requires employer sponsorship to work in Australia or New Zealand. Open to relocate.",
  workAuthShort: "Malaysian citizen · needs AU / NZ sponsorship · ready to relocate",
};

// Kept in two halves so the address never sits whole in the HTML or the JS bundle,
// where scrapers look for it; components/site/Email.tsx joins it in the browser.
export const EMAIL = { user: "hello", domain: "lucascodes.dev" };

export const LINKS = {
  github: "https://github.com/lucassimzq",
  linkedin: "https://linkedin.com/in/zhen-quan-sim-7bb389116/",
  resume: "/Sim_Zhen_Quan_Lucas_Resume_AUNZ.pdf",
};

export const NAV = [
  { id: "about", label: "About" },
  { id: "impact", label: "Proof" },
  { id: "experience", label: "Career" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Where Lucas has worked. `logo` is a file in /public/logos; until there is one the
 * tile shows `mark` instead.
 */
export const ORGS = {
  ytl: { name: "YTL AI Labs", mark: "YTL", logo: null as string | null },
  gxbank: { name: "GXBank", mark: "GX", logo: null as string | null },
  skribble: { name: "Skribble Lab", mark: "Sk", logo: null as string | null },
  qbayar: { name: "qBayar", mark: "qB", logo: null as string | null },
};

export type OrgId = keyof typeof ORGS;

/** The three numbers a recruiter should leave with, counted up under the hero. */
export const PROOF: { to: number; prefix?: string; suffix?: string; text?: string; label: string }[] = [
  { prefix: "~", to: 12, suffix: "×", label: "faster heavy queries" },
  { text: "5–6", to: 6, label: "person team led to launch" },
  { to: 20, suffix: "M", label: "rows migrated live" },
];

export type Role = {
  id: string;
  role: string;
  company: string;
  org: OrgId;
  period: string;
  startYear: number;
  /** Decimal years for the career rail; `end: null` means present. */
  start: number;
  end: number | null;
  location: string;
  domain: string;
  /** The headline result for the role, read before the bullets. */
  win: { metric: string; label: string };
  /** Wrap a phrase in *asterisks* to emphasise it. */
  highlights: string[];
  tags: string[];
};

export const EXPERIENCE: Role[] = [
  {
    id: "ytl",
    role: "AI Platform Engineer",
    company: "YTL AI Labs",
    org: "ytl",
    period: "Jul 2026 — Present",
    startYear: 2026,
    start: 2026.5,
    end: null,
    location: "Kuala Lumpur",
    domain: "AI platform",
    win: { metric: "2 min → <10 s", label: "heavy platform queries" },
    highlights: [
      "Built *MCP for the internal operational portal* so teammates can pull data and run approved actions through an agent instead of only using the UI.",
      "Wired existing market MCP servers into day-to-day workflows (credentials based) for tools such as Datadog, Grafana, GitHub, and cloud systems.",
      "Designed *guardrails for agent workflows* beyond simple permission checks, including behavioural boundaries for safer production use.",
      "Cut heavy platform query runtimes from *around 2 minutes to under 10 seconds.*",
      "Migrated a *20 million row table* with *zero external downtime.*",
    ],
    tags: ["MCP", "AI agents", "Guardrails", "Datadog", "Grafana", "SQL performance"],
  },
  {
    id: "gxbank",
    role: "Senior Software Engineer, Backend",
    company: "GXBank",
    org: "gxbank",
    period: "Jan 2026 — Jul 2026",
    startYear: 2026,
    start: 2026.0,
    end: 2026.5,
    location: "Kuala Lumpur",
    domain: "Digital banking",
    win: { metric: "Race condition", label: "fixed in onboarding with a Redis mutex" },
    highlights: [
      "Built and maintained *high-concurrency backend microservices in Go* for digital banking services designed for high availability and high-volume financial traffic.",
      "Resolved a *critical race condition* in the onboarding flow using Redis-based mutex locking.",
      "Optimised *Redis hash slot distribution* to reduce hotspotting as traffic grew.",
      "Delivered backend changes with banking-grade testing and deployment discipline alongside cross-functional squads.",
    ],
    tags: ["Go", "Microservices", "Redis", "High concurrency"],
  },
  {
    id: "skribble",
    role: "Senior Software Developer → Lead Developer",
    company: "Skribble Lab",
    org: "skribble",
    period: "Sep 2023 — Jan 2026",
    startYear: 2023,
    start: 2023.67,
    end: 2026.0,
    location: "Malaysia",
    domain: "SaaS · edtech",
    win: { metric: "Team of 5–6", label: "led from zero to launch in ~12 months" },
    highlights: [
      "Promoted to *Lead Developer* for Skribble Learn. Owned solution architecture, infrastructure planning, and mentorship for a team of 5 to 6.",
      "Shipped the Skribble Learn platform *within about 12 months,* with major gains in processing speed and usability versus legacy systems.",
      "Built *CI/CD from scratch* and pushed a testing culture (PHPUnit, high coverage targets) to support safer releases.",
      "Helped establish the company's *first in-house product revenue stream* and secured early enterprise clients.",
      "Filled BA gaps: stakeholder management, Jira planning, and primary technical consulting.",
    ],
    tags: ["PHP", "Laravel", "PHPUnit", "CI/CD", "Architecture", "Mentorship"],
  },
  {
    id: "qbayar-senior",
    role: "Senior Full Stack Developer",
    company: "qBayar",
    org: "qbayar",
    period: "Apr 2021 — Sep 2023",
    startYear: 2021,
    start: 2021.25,
    end: 2023.67,
    location: "Malaysia",
    domain: "Fintech · payments",
    win: { metric: "1 login", label: "SSO with QR sign-in across products" },
    highlights: [
      "Built a centralised *Identity Server (SSO)* and auth package, including QR-based login across products.",
      "Led *legacy migration from Yii1/Zend to Laravel,* improving release speed and reducing technical debt.",
      "Created a reusable API wrapper package that cut third-party integration time for the team.",
      "Lead programmer on a School Management System; reduced client-reported issues *from daily to weekly.*",
    ],
    tags: ["Laravel", "SSO / Identity", "QR login", "Legacy migration"],
  },
  {
    id: "qbayar",
    role: "Full Stack Developer",
    company: "qBayar",
    org: "qbayar",
    period: "Nov 2018 — Sep 2020",
    startYear: 2018,
    start: 2018.83,
    end: 2020.67,
    location: "Malaysia",
    domain: "Fintech · payments",
    win: { metric: "RHB H2H", label: "payment gateway integration, led" },
    highlights: [
      "Led *RHB Host-to-Host payment gateway* integration and related finance automation workflows.",
      "Built petty cash claims with RHB payouts and led purchase/inventory tracking systems.",
    ],
    tags: ["Payment gateway", "Finance automation", "Inventory systems"],
  },
];

/** Contract work, kept off the dated timeline on purpose. */
export const CONTRACT = {
  role: "Contract Backend Engineer",
  company: "Transaction systems for a former employer",
  location: "Remote",
  highlights: [
    "Backend work for a former employer on systems involving *race conditions, locking, workflows* and money movement.",
    "Deepened experience with *correctness under concurrent updates* where financial state must stay consistent.",
  ],
  tags: ["Concurrency", "Locking", "Money movement"],
};

export const EDUCATION = [
  { degree: "Bachelor of Computer Science", school: "UOWM KDU University College", year: "2021" },
  { degree: "Diploma in Computer Studies", school: "KDU University College", year: "2019" },
];

export type Skill = string | { label: string; note: string };

export const SKILLS: { cat: string; items: Skill[] }[] = [
  {
    cat: "Backend",
    items: ["Microservices", "REST APIs", "High-concurrency systems", "Message queues", "SSO / Identity"],
  },
  {
    cat: "Languages",
    items: ["Go", "PHP", "Python", "SQL", { label: "JavaScript / TypeScript", note: "ramping" }],
  },
  {
    cat: "Frameworks",
    items: ["Laravel", "FastAPI", "Vue.js", "Livewire", "Next.js", { label: "React", note: "ramping" }],
  },
  { cat: "Data", items: ["PostgreSQL", "MySQL", "Redis"] },
  { cat: "Cloud & infra", items: ["AWS (SQS, EC2, RDS)", "GCP", "Kubernetes", "Docker", "CI/CD"] },
  {
    cat: "AI tooling",
    items: [
      "MCP (custom ops portal)",
      "MCP market servers",
      "Agent guardrails",
      { label: "RAG / pgvector", note: "exposure" },
    ],
  },
  {
    cat: "Practices",
    items: ["Agile / Scrum", "Automated testing", "Code review", "Production debugging", "Mentorship"],
  },
];

// The "Known for" band under the hero: specialties large, the everyday stack small.
export const SPECIALTY_TAGS = [
  "Query performance",
  "Team leadership",
  "High-concurrency Go",
  "Race conditions",
  "Zero-downtime migrations",
  "MCP + guardrails",
  "Payments",
];

export const STACK = ["Go", "PHP · Laravel", "Python", "PostgreSQL", "Redis", "AWS", "Kubernetes", "Docker", "CI/CD"];

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  /** One line; the animated preview tells the rest. */
  blurb: string;
  tags: string[];
  demoUrl?: string;
  /** Button text for demoUrl; defaults to "Live demo". */
  demoLabel?: string;
  repoUrl?: string;
  caseStudy?: string;
  /** Shown next to the links, e.g. a release stage. */
  status?: string;
  /** Small print under the blurb. */
  note?: string;
  /** The preview's title bar: a URL for web demos, a window title for apps. */
  chrome: { url: string } | { title: string };
  preview: "inlet" | "rag" | "transfer" | "crab";
};

export const PROJECTS: Project[] = [
  {
    slug: "inletdb",
    title: "InletDB",
    kicker: "A Mac database app in Rust",
    blurb: "Keyboard-first Postgres and SQLite. One round trip per query, a safe mode for risky writes, and a guarded MCP server for agents.",
    tags: ["Rust", "Tauri 2", "PostgreSQL", "MCP"],
    demoUrl: "https://inlet-db.lucascodes.dev",
    demoLabel: "Website",
    status: "Private alpha · macOS",
    chrome: { title: "InletDB · shop-eu" },
    preview: "inlet",
  },
  {
    slug: "rag-playground",
    title: "RAG Playground",
    kicker: "Semantic search, visible",
    blurb: "A recruiter query, embedded, matched against 50 profiles in pgvector, answered by a streaming LLM.",
    tags: ["Go", "Encore", "pgvector", "Gemini"],
    demoUrl: "https://rag-playground.lucascodes.dev",
    repoUrl: "https://github.com/lucassimzq/rag-playground",
    caseStudy: "/projects/rag-playground",
    chrome: { url: "rag-playground.lucascodes.dev" },
    preview: "rag",
  },
  {
    slug: "webhook-playground",
    title: "WebSocket Transaction Visualizer",
    kicker: "Money moving, in real time",
    blurb: "Every step of a bank transfer, from balance check to confirmation, streamed live over WebSocket.",
    tags: ["Go", "Encore", "WebSocket", "PostgreSQL"],
    demoUrl: "https://webhook-playground.lucascodes.dev",
    repoUrl: "https://github.com/lucassimzq/webhook-playground",
    caseStudy: "/projects/webhook-playground",
    chrome: { url: "webhook-playground.lucascodes.dev" },
    preview: "transfer",
  },
  {
    slug: "claude-usage-mod",
    title: "Claude Usage Mod",
    kicker: "A Claude Code plugin",
    blurb: "Context and rate limits above the Claude Code prompt, watched by a pixel crab whose mood follows the highest one.",
    tags: ["TypeScript", "Claude Code", "SVG"],
    demoUrl: "https://claude-usage-hud.lucascodes.dev",
    demoLabel: "Website",
    repoUrl: "https://github.com/lucassimzq/claude-usage-mod",
    note: "Unofficial fan project, not affiliated with Anthropic.",
    chrome: { title: "Claude Code · payments-api" },
    preview: "crab",
  },
];

export type Impact = {
  id: string;
  company: string;
  year: string;
  metric: string;
  /** A few words under the metric; the visual carries the rest. */
  title: string;
  /** Set on the two results the section leads with. */
  specialty?: string;
};

export const IMPACT: Record<string, Impact> = {
  query: {
    id: "query",
    company: "YTL AI Labs",
    year: "2026",
    metric: "2 min → <10 s",
    title: "Heavy platform queries",
    specialty: "Performance",
  },
  ship: {
    id: "ship",
    company: "Skribble Lab",
    year: "2023 — 2026",
    metric: "Team of 5–6",
    title: "Zero to launch in ~12 months",
    specialty: "Leadership",
  },
  migration: {
    id: "migration",
    company: "YTL AI Labs",
    year: "2026",
    metric: "20M rows",
    title: "Migrated live, zero downtime",
  },
  guardrails: {
    id: "guardrails",
    company: "YTL AI Labs",
    year: "2026",
    metric: "MCP + guardrails",
    title: "Agents with boundaries",
  },
  race: {
    id: "race",
    company: "GXBank",
    year: "2026",
    metric: "Redis mutex",
    title: "Onboarding race, fixed",
  },
  slots: {
    id: "slots",
    company: "GXBank",
    year: "2026",
    metric: "Hotspots",
    title: "Redis hash slots, rebalanced",
  },
  sso: {
    id: "sso",
    company: "qBayar",
    year: "2021 — 2023",
    metric: "1 login",
    title: "SSO with QR sign-in",
  },
};
