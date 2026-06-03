export const SKILLS = [
  { cat: "Languages", items: ["Go", "PHP", "Python", "JavaScript"] },
  { cat: "Frontend", items: ["Vue.js", "Livewire", "REST APIs"] },
  { cat: "Backend", items: ["Laravel", "Kafka", "AWS SQS", "SSO / Identity Server"] },
  { cat: "Data", items: ["PostgreSQL", "MySQL", "Redis", "Schema Design", "Query Optimization"] },
  { cat: "Infrastructure", items: ["AWS (SQS, EC2, RDS)", "Docker", "CI/CD Pipelines"] },
  { cat: "AI & Tooling", items: ["AI-assisted development", "Prompt engineering", "LLM workflow automation"] },
  { cat: "Practices", items: ["High-Concurrency Architecture", "PHPUnit", "Technical Mentorship", "0-to-1 Builds"] },
];

export const EXPERIENCE = [
  {
    period: "Jan 2026 → present",
    role: "Senior Software Engineer, Backend",
    company: "GXBank",
    industry: "Digital Banking",
    highlights: [
      "Architect high-concurrency Go microservices for real-time digital banking — onboarding, eKYC, and risk assessment — engineered for 99.99% availability.",
      "Drive reliability and observability across core banking infrastructure, enabling seamless scaling with rapid user growth.",
      "Deliver audit-compliant systems with rigorous testing standards for regulated financial workloads.",
    ],
  },
  {
    period: "Sep 2023 → Jan 2026",
    role: "Senior Software Developer → Lead Developer",
    company: "Skribble Lab",
    industry: "Edtech",
    highlights: [
      "Promoted to Lead Developer — owned full solution architecture, infrastructure planning, and technical mentorship for a team of 5–6 engineers on a 0-to-1 product build.",
      "Shipped the full Skribble Learn platform in 12 months, delivering a 50% improvement in processing speed versus legacy systems.",
      "Built a PHPUnit testing culture at 80%+ coverage, enabling safe, frequent releases without sacrificing velocity.",
      "Secured 2 enterprise clients in year one, directly creating the company's first in-house revenue stream.",
      "Introduced AI-assisted development tools to the team workflow, helping reduce repetitive coding tasks and freeing up time for higher-leverage work.",
    ],
  },
  {
    period: "Apr 2021 → Dec 2023",
    role: "Senior Full Stack Developer",
    company: "qBayar",
    industry: "Fintech",
    highlights: [
      "Engineered a centralized SSO Identity Server with QR-based frictionless login, eliminating manual credential entry across the entire product ecosystem.",
      "Led legacy system migration from Yii1/Zend to Laravel, delivering a 30% faster feature release cycle.",
      "Authored a reusable API Wrapper package standardizing third-party integrations, cutting integration time by 40% across the team.",
    ],
  },
  {
    period: "Jun 2023 → Aug 2023",
    role: "Senior PHP Developer",
    company: "Offgamers",
    industry: "E-commerce",
    highlights: [
      "Redesigned legacy SQL queries cutting execution time from 120s to under 3s — a 97.5% improvement — dramatically increasing throughput under peak load.",
      "Engineered a Mutex locking mechanism to resolve critical race conditions in a high-concurrency transactional environment, guaranteeing 100% data consistency.",
      "Implemented AWS SQS message queue system, decoupling heavy processes and ensuring high availability during traffic spikes.",
    ],
  },
];

export const PROJECTS = [
  {
    slug: "webhook-playground",
    title: "WebSocket Transaction Visualizer",
    description:
      "Makes the hidden pipeline of a bank transfer visible. Trigger each step — balance check, limit check, receiver verification, fund transfer, confirmation — and watch the result animate in real time via WebSocket events.",
    tags: ["Go", "Encore", "Next.js", "WebSocket", "PostgreSQL"],
    repoUrl: "https://github.com/lucassimzq/webhook-playground",
    demoUrl: "https://webhook-playground.lucascodes.dev",
  },
];

export const ACCENT_OPTIONS = ["#4ade80", "#fbbf24", "#22d3ee", "#818cf8"];

export const LINKS = {
  github: "https://github.com/lucassimzq",
  linkedin: "https://linkedin.com/in/zhen-quan-sim-7bb389116/",
};
