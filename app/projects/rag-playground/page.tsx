import type { Metadata } from "next";
import ArticleShell from "@/components/article/ArticleShell";
import { Code, Colophon, Divider, H2, H3, P, Table } from "@/components/article/Prose";

export const metadata: Metadata = {
  title: "RAG Playground",
  description:
    "Visualizing how RAG, vector embeddings, and semantic search work under the hood — built as an interactive talent search demo.",
};

export default function RagPlaygroundPage() {
  return (
    <ArticleShell
      index="01"
      slug="rag-playground"
      title="Making RAG visible"
      dek="Visualizing how RAG, vector embeddings, and semantic search work under the hood — built as an interactive talent search demo."
      tags={["Go", "Encore", "Next.js", "PostgreSQL", "pgvector", "Gemini"]}
      demoUrl="https://rag-playground.lucascodes.dev"
      repoUrl="https://github.com/lucassimzq/rag-playground"
      next={{ href: "/projects/webhook-playground", title: "WebSocket Transaction Visualizer", kicker: "Watching money move in real time" }}
    >
      <P>
        Ever searched for something and gotten back results that don&apos;t even contain the words you typed?
        That&apos;s not magic. There&apos;s a whole pipeline running underneath. Most people have heard the
        term RAG thrown around but have no real picture of what it actually does.
      </P>
      <P>
        So I built something to show it. <strong>rag-playground</strong>{" "}
        is a recruiter search tool framed as a demo. You type a query like{" "}
        <em>&quot;find me a backend engineer with fintech experience&quot;</em>,
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
        <em>payment infrastructure at scale</em> instead?
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
        The query text gets sent to OpenAI&apos;s <Code>text-embedding-3-small</Code>{" "}model, which converts it
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

      <Colophon>
        Built with Go, Encore, Next.js, PostgreSQL, pgvector, and Google Gemini.
      </Colophon>
    </ArticleShell>
  );
}
