// Everything on the site is sourced from Lucas's resume (AU/NZ edition, 2026).
// Keep claims here in sync with the PDF in /public.

export const PROFILE = {
  name: "Lucas Sim",
  fullName: "Sim Zhen Quan (Lucas)",
  role: "Backend Engineer",
  years: "8+",
  location: "Kuala Lumpur, Malaysia",
  timezone: "Asia/Kuala_Lumpur",
  email: "lucas.simzq@gmail.com",
  current: { role: "AI Platform Engineer", company: "YTL AI Labs" },
  summary:
    "Backend engineer with 8+ years building production systems across fintech, SaaS, and AI platform work. Experienced in Go microservices for digital banking, PHP/Laravel product platforms, and practical AI tooling including MCP for internal operational systems.",
  seeking: "Senior backend or full-stack roles in Australia or New Zealand",
  workAuth:
    "Malaysian citizen. Requires employer sponsorship to work in Australia or New Zealand. Open to relocate.",
};

export const LINKS = {
  github: "https://github.com/lucassimzq",
  linkedin: "https://linkedin.com/in/zhen-quan-sim-7bb389116/",
  email: `mailto:${PROFILE.email}`,
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

export type Role = {
  id: string;
  role: string;
  company: string;
  period: string;
  /** null for side work that has no fixed start on the resume */
  startYear: number | null;
  location: string;
  domain: string;
  /** Wrap a phrase in *asterisks* to emphasise it. */
  highlights: string[];
  tags: string[];
  side?: boolean;
};

export const EXPERIENCE: Role[] = [
  {
    id: "ytl",
    role: "AI Platform Engineer",
    company: "YTL AI Labs",
    period: "Jul 2026 — Present",
    startYear: 2026,
    location: "Kuala Lumpur",
    domain: "AI platform",
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
    id: "casino",
    role: "Contract Backend Engineer",
    company: "Casino platform",
    period: "Recent · after hours",
    startYear: null,
    location: "Remote",
    domain: "Contract",
    highlights: [
      "Helping an ex-employer build casino backend systems involving race conditions, locking, workflows, and money movement.",
      "Deepened experience with *correctness under concurrent updates* where financial state must stay consistent.",
    ],
    tags: ["Concurrency", "Locking", "Money movement"],
    side: true,
  },
  {
    id: "gxbank",
    role: "Senior Software Engineer, Backend",
    company: "GXBank",
    period: "Jan 2026 — Jul 2026",
    startYear: 2026,
    location: "Kuala Lumpur",
    domain: "Digital banking",
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
    period: "Sep 2023 — Jan 2026",
    startYear: 2023,
    location: "Malaysia",
    domain: "SaaS · edtech",
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
    period: "Apr 2021 — Sep 2023",
    startYear: 2021,
    location: "Malaysia",
    domain: "Fintech · payments",
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
    period: "Nov 2018 — Sep 2020",
    startYear: 2018,
    location: "Malaysia",
    domain: "Fintech · payments",
    highlights: [
      "Led *RHB Host-to-Host payment gateway* integration and related finance automation workflows.",
      "Built petty cash claims with RHB payouts and led purchase/inventory tracking systems.",
    ],
    tags: ["Payment gateway", "Finance automation", "Inventory systems"],
  },
];

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

export const MARQUEE = [
  "Go",
  "Microservices",
  "Redis",
  "PostgreSQL",
  "MCP",
  "Laravel",
  "Kubernetes",
  "AWS",
  "High concurrency",
  "Python",
  "FastAPI",
  "CI/CD",
  "SSO / Identity",
  "Docker",
  "Message queues",
  "Agent guardrails",
];

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  demoUrl: string;
  repoUrl?: string;
  caseStudy?: string;
  /** The pipeline the demo makes visible, step by step. */
  flow: string[];
  preview: "rag" | "transfer" | "statement";
};

export const PROJECTS: Project[] = [
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
    flow: ["Trigger step", "Isolated service", "WebSocket event", "Retry on failure"],
    preview: "transfer",
  },
  {
    slug: "statement-parser",
    title: "Statement Parser",
    kicker: "Expense consolidator",
    description:
      "An expense tracker that parses PDF bank and card statements and consolidates the transactions into one place. FastAPI does the parsing; Next.js does the rest.",
    tags: ["Python", "FastAPI", "Next.js", "PDF parsing"],
    demoUrl: "https://lucascodes.dev",
    flow: ["PDF statements", "FastAPI parser", "Merged ledger", "Next.js UI"],
    preview: "statement",
  },
];

export type Impact = {
  id: string;
  company: string;
  year: string;
  metric: string;
  title: string;
  body: string;
};

export const IMPACT: Record<string, Impact> = {
  query: {
    id: "query",
    company: "YTL AI Labs",
    year: "2026",
    metric: "2 min → <10 s",
    title: "Heavy platform queries, collapsed",
    body: "Cut heavy platform query runtimes from around 2 minutes to under 10 seconds.",
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
  ship: {
    id: "ship",
    company: "Skribble Lab",
    year: "2023 — 2026",
    metric: "~12 months",
    title: "Led a team of 5–6 to launch",
    body: "Shipped Skribble Learn in about a year as Lead Developer, with CI/CD built from scratch and a PHPUnit testing culture.",
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
