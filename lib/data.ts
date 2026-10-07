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
};

// Kept in two halves so the address never sits whole in the HTML or the JS bundle,
// where scrapers look for it; components/site/Email.tsx joins it in the browser.
export const EMAIL = { user: "lucas.simzq", domain: "gmail.com" };

export const LINKS = {
  github: "https://github.com/lucassimzq",
  linkedin: "https://linkedin.com/in/zhen-quan-sim-7bb389116/",
  resume: "/Sim_Zhen_Quan_Lucas_Resume_AUNZ.pdf",
};

export const NAV = [
  { id: "about", label: "About" },
  { id: "impact", label: "Impact" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
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

/** The three numbers a recruiter should leave with, shown under the hero. */
export const PROOF = [
  { value: "~12×", label: "faster heavy queries", detail: "2 min → under 10 s" },
  { value: "5–6", label: "person team led as Lead Developer", detail: "0 → 1 launch in ~12 months" },
  { value: "20M", label: "row table migrated live", detail: "zero external downtime" },
];

export type Role = {
  id: string;
  role: string;
  company: string;
  org: OrgId;
  period: string;
  startYear: number;
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

/** What Lucas is known for, each with the proof behind it. Leads the skills section. */
export const SPECIALTIES = [
  {
    id: "performance",
    title: "Query & data performance",
    proof: ["Heavy queries cut from ~2 min to under 10 s", "20M-row table migrated with zero external downtime"],
    where: "YTL AI Labs",
    tools: ["SQL", "PostgreSQL", "MySQL", "Redis"],
  },
  {
    id: "leadership",
    title: "Technical leadership",
    proof: ["Led and mentored a team of 5–6", "Shipped a 0 → 1 platform in about 12 months", "Built CI/CD from scratch"],
    where: "Skribble Lab",
    tools: ["Architecture", "Mentorship", "CI/CD", "Agile / Scrum"],
  },
  {
    id: "concurrency",
    title: "Concurrency & money movement",
    proof: ["Critical race condition fixed with a Redis mutex", "Go microservices for a digital bank", "Led an RHB Host-to-Host gateway integration"],
    where: "GXBank · qBayar",
    tools: ["Go", "Microservices", "Redis", "Message queues"],
  },
  {
    id: "ai",
    title: "AI platform tooling",
    proof: ["MCP for an internal operations portal", "Guardrails for agent workflows beyond permission checks"],
    where: "YTL AI Labs",
    tools: ["MCP", "Agent guardrails", "Python", "FastAPI"],
  },
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

// Specialties first, then the stack, so the ticker says what Lucas is known for.
export const MARQUEE = [
  "Query performance",
  "Team leadership",
  "High-concurrency Go",
  "Race conditions",
  "Zero-downtime migrations",
  "MCP + guardrails",
  "Payments",
  "Redis",
  "PostgreSQL",
  "Laravel",
  "CI/CD from scratch",
  "Kubernetes",
  "SSO / Identity",
  "AWS",
];

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  caseStudy?: string;
  /** Shown in place of links when there is nothing public to open. */
  status?: string;
  /** Small print under the description. */
  note?: string;
  /** The preview's title bar: a URL for web demos, a window title for apps. */
  chrome: { url: string } | { title: string };
  /** The pipeline the preview makes visible, step by step. */
  flow: string[];
  preview: "inlet" | "rag" | "transfer" | "crab";
};

export const PROJECTS: Project[] = [
  {
    slug: "inletdb",
    title: "InletDB",
    kicker: "A Mac database app in Rust",
    description:
      "A keyboard-first Mac app for Postgres and SQLite, with a Rust core in a Tauri shell. Every tab stays connected, so a query is one round trip instead of four. Safe mode holds a risky write until you confirm it, and a built-in MCP server gives AI agents guarded, read-only access.",
    tags: ["Rust", "Tauri 2", "React", "PostgreSQL", "SQLite", "MCP"],
    status: "Private alpha · macOS",
    chrome: { title: "InletDB · shop-eu" },
    flow: ["⌘K", "Warm tab", "1 round trip", "Safe mode"],
    preview: "inlet",
  },
  {
    slug: "rag-playground",
    title: "RAG Playground",
    kicker: "Visualising semantic search",
    description:
      "Makes the RAG pipeline visible end to end. Type a natural-language recruiter query, watch it get embedded into a vector, run semantic search against 50 candidate profiles via pgvector, and see the LLM stream back a grounded recommendation in real time.",
    tags: ["Go", "Encore", "Next.js", "pgvector", "Gemini"],
    demoUrl: "https://rag-playground.lucascodes.dev",
    repoUrl: "https://github.com/lucassimzq/rag-playground",
    caseStudy: "/projects/rag-playground",
    chrome: { url: "rag-playground.lucascodes.dev" },
    flow: ["Query", "Embedding", "pgvector top 5", "Gemini stream"],
    preview: "rag",
  },
  {
    slug: "webhook-playground",
    title: "WebSocket Transaction Visualizer",
    kicker: "Watching money move in real time",
    description:
      "Makes the hidden pipeline of a bank transfer visible. Trigger each step (balance check, limit check, receiver verification, fund transfer, confirmation) and watch the result animate in real time via WebSocket events.",
    tags: ["Go", "Encore", "Next.js", "WebSocket", "PostgreSQL"],
    demoUrl: "https://webhook-playground.lucascodes.dev",
    repoUrl: "https://github.com/lucassimzq/webhook-playground",
    caseStudy: "/projects/webhook-playground",
    chrome: { url: "webhook-playground.lucascodes.dev" },
    flow: ["Trigger step", "Isolated service", "WebSocket event", "Retry on failure"],
    preview: "transfer",
  },
  {
    slug: "claude-usage-mod",
    title: "Claude Usage Mod",
    kicker: "A Claude Code plugin",
    description:
      "Keeps your context window, 5-hour and weekly limits in view above the Claude Code prompt, watched over by a pixel crab whose mood follows the highest one. He levels up as you work, with progress shared by every session, and a one-click update fast-forwards your clone to the newest release tag.",
    tags: ["TypeScript", "Claude Code", "SVG", "Git"],
    repoUrl: "https://github.com/lucassimzq/claude-usage-mod",
    note: "Unofficial fan project, not affiliated with Anthropic.",
    chrome: { title: "Claude Code · payments-api" },
    flow: ["Turn ends", "Read limits", "Sync sessions", "Crab reacts"],
    preview: "crab",
  },
];

export type Impact = {
  id: string;
  company: string;
  year: string;
  metric: string;
  title: string;
  body: string;
  /** Set on the two results the section leads with. */
  specialty?: string;
};

export const IMPACT: Record<string, Impact> = {
  query: {
    id: "query",
    company: "YTL AI Labs",
    year: "2026",
    metric: "2 min → <10 s",
    title: "Heavy platform queries, collapsed",
    body: "Cut heavy platform query runtimes from around 2 minutes to under 10 seconds.",
    specialty: "Performance",
  },
  ship: {
    id: "ship",
    company: "Skribble Lab",
    year: "2023 — 2026",
    metric: "Team of 5–6",
    title: "Led a 0 → 1 platform to launch",
    body: "Promoted to Lead Developer: owned the architecture, infrastructure plan and mentoring, built CI/CD from scratch, and shipped Skribble Learn in about 12 months, helping establish the company's first in-house product revenue.",
    specialty: "Leadership",
  },
  migration: {
    id: "migration",
    company: "YTL AI Labs",
    year: "2026",
    metric: "20M rows",
    title: "Zero external downtime",
    body: "Migrated a 20 million row table while the platform kept serving traffic.",
  },
  guardrails: {
    id: "guardrails",
    company: "YTL AI Labs",
    year: "2026",
    metric: "MCP + guardrails",
    title: "Agents with boundaries",
    body: "Built MCP for the internal ops portal, wired Datadog, Grafana, GitHub and cloud MCP servers into daily workflows, and designed behavioural guardrails beyond permission checks.",
  },
  race: {
    id: "race",
    company: "GXBank",
    year: "2026",
    metric: "Race condition",
    title: "Fixed with a Redis mutex",
    body: "Resolved a critical race condition in the digital bank's onboarding flow using Redis-based mutex locking.",
  },
  slots: {
    id: "slots",
    company: "GXBank",
    year: "2026",
    metric: "Hotspots",
    title: "Hash slots, rebalanced",
    body: "Optimised Redis hash slot distribution to reduce hotspotting as traffic grew.",
  },
  sso: {
    id: "sso",
    company: "qBayar",
    year: "2021 — 2023",
    metric: "1 login",
    title: "SSO with QR sign-in",
    body: "Built a centralised Identity Server and auth package, including QR-based login across products.",
  },
};
