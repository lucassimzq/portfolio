import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RAG Playground — Lucas Sim",
  description:
    "Visualizing how RAG, vector embeddings, and semantic search work under the hood — built as an interactive talent search demo.",
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        color: "var(--text-1)",
        margin: "40px 0 16px",
        lineHeight: 1.3,
      }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "var(--text-1)",
        margin: "28px 0 10px",
      }}
    >
      <span style={{ color: "var(--accent)", marginRight: 8 }}>###</span>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 14,
        color: "var(--text-2)",
        lineHeight: 1.8,
        margin: "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "var(--font)",
        fontSize: 12,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 3,
        padding: "1px 6px",
        color: "var(--accent)",
      }}
    >
      {children}
    </code>
  );
}

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ position: "relative", paddingLeft: 16, fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>
          <span style={{ position: "absolute", left: 0, top: 0, color: "var(--accent)" }}>›</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: "auto", margin: "16px 0 24px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--accent)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-2)",
                    lineHeight: 1.6,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "32px 0" }} />;
}

export default function RagPlaygroundPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,10,12,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", height: 48, gap: 16 }}
        >
          <Link href="/" className="nav-link">
            ← back
          </Link>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>projects</span>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>rag-playground</span>
        </div>
      </nav>

      {/* Article */}
      <article className="container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 720 }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {["Go", "Encore", "Next.js", "PostgreSQL", "pgvector", "Gemini"].map((tag) => (
              <span key={tag} className="skill-tag">{tag}</span>
            ))}
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            Making RAG visible
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>Lucas Sim · rag-playground</p>
            <a
              href="https://rag-playground.lucascodes.dev"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                color: "var(--accent)",
                textDecoration: "none",
                border: "1px solid var(--accent-border)",
                background: "var(--accent-dim)",
                padding: "3px 10px",
                borderRadius: 3,
              }}
            >
              Live demo →
            </a>
          </div>
        </div>

        <Divider />

        <P>
          Ever searched for something and gotten back results that don&apos;t even contain the words you typed?
          That&apos;s not magic. There&apos;s a whole pipeline running underneath. Most people have heard the
          term RAG thrown around but have no real picture of what it actually does.
        </P>
        <P>
          So I built something to show it. <strong style={{ color: "var(--text-1)" }}>rag-playground</strong>{" "}
          is a recruiter search tool framed as a demo. You type a query like{" "}
          <em style={{ color: "var(--text-1)" }}>&quot;find me a backend engineer with fintech experience&quot;</em>,
          and instead of just showing you results, it shows you every step of how those results got found:
          the query turning into numbers, those numbers being compared against 50 candidate profiles, the
          closest ones getting pulled, and an LLM writing a recommendation from exactly that context,
          streamed back word by word.
        </P>

        <Divider />

        <H2>Why keyword search isn&apos;t enough</H2>
        <P>
          Traditional search is exact match. Search for &quot;backend engineer fintech&quot; and you get
          documents containing those words. But what if a candidate&apos;s profile says{" "}
          <em style={{ color: "var(--text-1)" }}>payment infrastructure at scale</em> instead?
          Keyword search misses them entirely.
        </P>
        <P>
          Semantic search understands meaning rather than text. Both phrases end up near each other in vector
          space, so the right candidate still surfaces. That difference is immediately visible in the
          similarity scores the demo shows you.
        </P>
        <P>
          RAG takes this further. Instead of asking an LLM to answer from its training data, you first fetch
          the most relevant content from your own database, then hand that to the model as context. The answer
          is grounded in real data rather than whatever the model happened to learn.
        </P>

        <Divider />

        <H2>The pipeline</H2>
        <P>
          The demo runs every query through four stages, each one lighting up as it completes.
        </P>

        <H3>① Embed the query</H3>
        <P>
          The query text gets sent to OpenAI&apos;s <Code>text-embedding-3-small</Code> model, which converts it
          into a 768-number vector. Similar meanings end up close together in that space. The UI shows you
          the first 8 numbers as a preview so the concept doesn&apos;t stay abstract.
        </P>

        <H3>② Semantic search</H3>
        <P>
          That vector gets compared against precomputed embeddings for all 50 candidate profiles using cosine
          similarity in PostgreSQL via <Code>pgvector</Code>. The top 5 closest matches come back with a
          score between 0 and 1. This is the step where a profile about &quot;payment systems&quot; can rank
          above one that literally says &quot;fintech&quot; because the vectors are closer in meaning.
        </P>

        <H3>③ Context assembly</H3>
        <P>
          The top 5 profile bios get assembled into a structured prompt block. The UI shows you a preview of
          exactly what gets handed to the LLM, along with an estimated token count.
        </P>

        <H3>④ LLM generation</H3>
        <P>
          Gemini writes a recruiter recommendation using only the retrieved profiles as context. The response
          streams back token by token over WebSocket so you watch it build rather than waiting for a full
          response to drop.
        </P>

        <Divider />

        <H2>Stack</H2>
        <Table
          headers={["Layer", "Choice"]}
          rows={[
            ["Backend", "Go + Encore framework"],
            ["Embeddings", "OpenAI (text-embedding-3-small)"],
            ["Completion", "Google Gemini (gemini-2.5-flash)"],
            ["Vector Search", "PostgreSQL + pgvector with HNSW index"],
            ["Realtime", "WebSocket for pipeline events, SSE for token streaming"],
            ["Frontend", "Next.js App Router + Tailwind CSS"],
            ["Deploy", "Encore Cloud (backend) + Vercel (frontend)"],
          ]}
        />
        <P>
          I kept vectors in PostgreSQL with pgvector rather than pulling in a dedicated vector database.
          For 50 profiles it&apos;s the right call and the HNSW index keeps similarity search fast. The
          architecture stays simple without giving anything up.
        </P>

        <Divider />

        <p style={{ fontSize: 12, color: "var(--text-3)", fontStyle: "italic" }}>
          Built with Go, Encore, Next.js, PostgreSQL, pgvector, and Google Gemini.
        </p>

      </article>
    </div>
  );
}
