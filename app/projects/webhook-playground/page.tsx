import type { Metadata } from "next";
import ArticleShell from "@/components/article/ArticleShell";
import { Code, CodeBlock, Colophon, Divider, H2, H3, P, Table, Ul } from "@/components/article/Prose";

export const metadata: Metadata = {
  title: "WebSocket Transaction Visualizer",
  description:
    "Building a full-stack project that makes the hidden pipeline of a bank transfer visible using Go, Encore, WebSockets, and Next.js.",
};

export default function WebhookPlaygroundPage() {
  return (
    <ArticleShell
      index="02"
      slug="webhook-playground"
      title="Watching Money Move in Real Time"
      subtitle="Building a WebSocket Transaction Visualizer"
      dek="Building a full-stack project that makes the hidden pipeline of a bank transfer visible using Go, Encore, WebSockets, and Next.js."
      tags={["Go", "Encore", "Next.js", "WebSocket", "PostgreSQL"]}
      demoUrl="https://webhook-playground.lucascodes.dev"
      repoUrl="https://github.com/lucassimzq/webhook-playground"
      next={{ href: "/projects/rag-playground", title: "RAG Playground", kicker: "Visualising semantic search" }}
    >
      <P>
        I&apos;ve always found it interesting how financial transactions <em>feel</em>{" "}
        instant from the user&apos;s side, but under the hood they&apos;re a chain of discrete steps, each one capable of
        failing. Balance check, daily limit check, receiver verification, fund transfer, confirmation. Five
        things that happen in sequence, each with its own potential failure mode.
      </P>
      <P>
        So I built <strong>webhook-playground</strong>: a full-stack project
        that makes that hidden pipeline visible. You enter a sender, receiver, and amount. A job is created.
        Then you manually trigger each step and watch the result animate in real time: success, failure, or
        retry; driven entirely by WebSocket events from the backend.
      </P>

      <Divider />

      <H2>The Real-World Architecture Behind a Bank Transfer</H2>
      <P>
        Here&apos;s something most developers don&apos;t think about: real banks don&apos;t run a single monolithic
        service that knows everything about you. They operate in{" "}
        <strong>microservices</strong>, and for good reason {"->"} security
        and data isolation.
      </P>
      <P>
        When you tap &quot;Transfer&quot; in your banking app, the request touches multiple independent services,
        each owned by a different team, each with access to only the data they need:
      </P>
      <Ul
        items={[
          <><strong>Balance Service</strong> {"->"} knows your account balance. Nothing else.</>,
          <><strong>Limits Service</strong> {"->"} knows your daily transaction cap. Not your balance, not your account details.</>,
          <><strong>Account Verification Service</strong> {"->"} knows whether a given account number exists and belongs to a real person. Not what&apos;s in it.</>,
          <><strong>Transaction Service</strong> {"->"} executes the fund movement between accounts.</>,
        ]}
      />
      <P>
        The developer working on the Limits Service cannot query your balance. The developer on Account
        Verification cannot see your transaction history. This isn&apos;t just good architecture, it&apos;s a
        deliberate security boundary. If any one service is compromised, the blast radius is contained.
      </P>
      <P>
        What connects these services isn&apos;t a direct function call. It&apos;s{" "}
        <strong>events</strong>. Each service completes its step, emits
        an event, and the next service in the chain picks it up. The whole pipeline is event-driven,
        asynchronous, and ordered. That&apos;s exactly what this project visualizes.
      </P>

      <Divider />

      <H2>What Problem Does This Solve?</H2>
      <P>There&apos;s no shortage of CRUD tutorials. But most of them skip the interesting parts:</P>
      <Ul
        items={[
          <>What does an <strong>event-driven, asynchronous state machine</strong> actually look like end-to-end?</>,
          <>How do you model <strong>isolated, ordered services</strong> where each step only knows what it needs to?</>,
          <>How do you push state changes from server to client <strong>without polling</strong>?</>,
          <>How do you handle <strong>failure and retry</strong> in a sequential pipeline?</>,
        ]}
      />
      <P>
        This project is my answer to that gap. The failures are randomized on purpose, and the five steps
        run in a single backend rather than separate deployed services. But the{" "}
        <em>patterns</em> are real: each step is an isolated unit of
        work with its own success/failure logic, communicating via events rather than direct calls.
      </P>

      <Divider />

      <H2>Tech Stack</H2>
      <Table
        headers={["Layer", "Choice", "Why"]}
        rows={[
          ["Backend", "Go + Encore", "Native PostgreSQL, automatic API docs, built-in tracing"],
          ["Realtime", "WebSocket (gorilla/websocket)", "Raw, bidirectional, zero polling"],
          ["Database", "PostgreSQL (managed by Encore)", "Persistent job + step state"],
          ["Frontend", "Next.js (App Router)", "SSR for initial hydration, client-side WS from there"],
          ["Styling", "Tailwind CSS", "Fast iteration"],
          ["Backend Deploy", "Encore Cloud", "Native from Encore's"],
          ["Frontend Deploy", "Vercel", "Zero-config Next.js deployment"],
        ]}
      />
      <P>
        One deliberate choice: <strong>Encore</strong> as the backend
        framework. Encore manages your PostgreSQL instance automatically — locally on{" "}
        <Code>encore run</Code>, and in production on deploy. No connection strings in code, no{" "}
        <Code>.env</Code> juggling for the database. It also gives you built-in distributed tracing at{" "}
        <Code>localhost:9400</Code> while you develop, which was genuinely useful when debugging the async
        step flow.
      </P>

      <Divider />

      <H2>How It Works</H2>

      <H3>1. Creating a Job</H3>
      <P>
        <Code>POST /jobs</Code> accepts a sender, receiver, and amount. It creates a <Code>jobs</Code> row
        and five <Code>steps</Code> rows — all in <Code>idle</Code> state — then returns the full job
        payload.
      </P>
      <CodeBlock lang="go">{`// jobs/jobs.go
//encore:api public method=POST path=/jobs
func (s *Service) CreateJob(ctx context.Context, req *CreateJobRequest) (*JobResponse, error) {
  jobID := uuid.New().String()
  title := fmt.Sprintf("Transfer: %s → %s", req.Sender, req.Receiver)
  _, err := db.Exec(ctx, \`INSERT INTO jobs (id, title, amount, sender, receiver, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')\`, jobID, title, req.Amount, req.Sender, req.Receiver)
  // ... insert 5 steps with status='idle'
}`}</CodeBlock>
      <P>
        The frontend navigates to <Code>/jobs/:id</Code>, fetches the initial state via{" "}
        <Code>GET /jobs/:id</Code>, then opens a WebSocket connection and switches entirely to
        event-driven updates.
      </P>

      <H3>2. Triggering a Step</H3>
      <P>
        <Code>POST /jobs/:id/steps/:stepId/trigger</Code> is where the interesting validation lives. If
        the step is already <Code>processing</Code> → <Code>409 Aborted</Code>. If it already{" "}
        <Code>succeeded</Code> → <Code>400 Failed Precondition</Code>. If the previous step
        hasn&apos;t succeeded yet → <Code>400 Failed Precondition</Code>.
      </P>
      <P>
        Once validation passes, the handler marks the step as <Code>processing</Code>, broadcasts a{" "}
        <Code>step.processing</Code> WebSocket event, spawns a goroutine, and{" "}
        <strong>returns immediately with 202 Accepted</strong>. The
        client never waits for the outcome — it just watches for events.
      </P>
      <CodeBlock lang="go">{`hub.Global.Broadcast(id, hub.WSEvent{
  Event:   "step.processing",
  JobID:   id,
  StepID:  stepId,
  Message: "Processing...",
})
go processStep(id, stepId, stepOrder, sender, receiver, amount)
return &TriggerResponse{Accepted: true}, nil`}</CodeBlock>

      <H3>3. The Simulation Engine</H3>
      <P>
        <Code>steps/engine.go</Code>{" "}handles each step in a goroutine. It sleeps for 2 seconds
        (simulating real processing time), then randomly determines the outcome based on each step&apos;s
        configured failure probability.
      </P>
      <Table
        headers={["Step", "Failure Rate"]}
        rows={[
          ["Check Balance", "20%"],
          ["Check Daily Limit", "20%"],
          ["Verify Receiver Account", "10%"],
          ["Process Transfer", "10%"],
          ["Confirmation", "0%"],
        ]}
      />
      <P>
        On failure, the step resets to <Code>idle</Code> after 2 seconds — so the user can hit RETRY. On
        success, the engine checks if all steps are done. If they are, it marks the job{" "}
        <Code>completed</Code> and broadcasts <Code>job.completed</Code>.
      </P>

      <H3>4. The WebSocket Hub</H3>
      <P>
        The hub is a package-level singleton that maps job IDs to a slice of active connections.{" "}
        <Code>Broadcast</Code>{" "}writes to every connection registered for a given job. If a write fails
        (client disconnected), it&apos;s silently removed — no blocking, no panics.
      </P>
      <CodeBlock lang="go">{`// hub/hub.go
type Hub struct {
  mu      sync.RWMutex
  clients map[string][]*websocket.Conn
}

func (h *Hub) Broadcast(jobID string, event WSEvent) {
  data, _ := json.Marshal(event)
  h.mu.Lock()
  defer h.mu.Unlock()
  conns := h.clients[jobID]
  alive := conns[:0]
  for _, c := range conns {
      if err := c.WriteMessage(websocket.TextMessage, data); err == nil {
          alive = append(alive, c)
      }
  }
  h.clients[jobID] = alive
}`}</CodeBlock>

      <H3>5. WebSocket Events</H3>
      <P>All events use a consistent envelope:</P>
      <CodeBlock lang="json">{`{
"event": "step.processing | step.success | step.failed | job.completed",
"jobId": "uuid",
"stepId": "uuid",
"message": "Human readable message"
}`}</CodeBlock>
      <P>
        The frontend&apos;s <Code>useWebSocket</Code> hook receives these and updates step state locally
        — no re-fetching from the server required.
      </P>

      <H3>6. What the UI Shows</H3>
      <P>
        Each step card has five visual states: idle (locked), ready (pulsing blue border), processing
        (amber + spinner), success (green checkmark), and failed (red X with RETRY button). State
        transitions are driven entirely by WebSocket events — the UI never polls.
      </P>
      <P>
        Think of each card as a window into a different microservice. In a real bank, these are separate
        codebases, separate databases, separate teams. Here, they&apos;re separate units of logic that
        communicate through the same event-driven pattern.
      </P>

      <Divider />

      <H2>Why WebSockets Over Polling?</H2>
      <P>
        The straightforward alternative would be polling <Code>GET /jobs/:id</Code> every second. It
        would work. But:
      </P>
      <Ul
        items={[
          <><strong>Latency:</strong> WebSocket events arrive the moment they&apos;re broadcast. Polling introduces up to 1 second of lag per step.</>,
          <><strong>Load:</strong> With WebSockets, the server pushes to all connected clients in one broadcast call. With polling, every client fires its own request.</>,
          <><strong>State machine clarity:</strong> The event stream is the source of truth for the UI. Polling creates a reconciliation problem — with events, you react to exactly what happened.</>,
        ]}
      />

      <Divider />

      <H2>What Encore Brings to the Table</H2>
      <Ul
        items={[
          <><strong>Zero-config PostgreSQL locally.</strong> Run <Code>encore run</Code> and your database is provisioned and migrated automatically. No Docker Compose, no manual <Code>createdb</Code>.</>,
          <><strong>Structured API definitions.</strong> The <Code>{"//encore:api"}</Code> annotation generates API documentation, handles JSON marshaling, and integrates with tracing — all from a regular Go function signature.</>,
          <><strong>Built-in observability.</strong> Every request is traced at <Code>localhost:9400</Code>. When the async goroutine fires and the WebSocket event lands, you can see the full timing without adding any instrumentation yourself.</>,
          <><strong>Docker build for self-hosting.</strong> <Code>encore build docker webhook-playground:latest --arch=amd64</Code> produces a production-ready image. Deploying to Render was straightforward from there.</>,
        ]}
      />

      <H2>The Cleanup Cron</H2>
      <P>
        A weekly cron job prunes jobs older than 7 days. Encore&apos;s cron API is declarative — you
        define the schedule and point it at a private endpoint. It doesn&apos;t run locally or in preview
        environments — only in production, exactly as intended.
      </P>
      <CodeBlock lang="go">{`var _ = cron.NewJob("weekly-cleanup", cron.JobConfig{
  Title:    "Clean up old jobs",
  Schedule: "0 0 * * 0",
  Endpoint: CleanupJobs,
})

//encore:api private
func CleanupJobs(ctx context.Context) error {
  _, err := db.Exec(ctx, \`
      DELETE FROM steps WHERE job_id IN (
          SELECT id FROM jobs WHERE created_at < NOW() - INTERVAL '7 days'
      )\`)
  // ... delete jobs
}`}</CodeBlock>

      <Divider />

      <H2>TL;DR</H2>
      <P>
        Real banks run microservices. The developer who works on daily limit checks has no access to your
        account balance. Each service owns its slice of data, and the whole pipeline is stitched together
        through events — not direct calls, not shared databases.
      </P>
      <P>
        webhook-playground makes that invisible architecture visible. Trigger a step, watch it process,
        see it succeed or fail, and retry if it doesn&apos;t. Each card on screen represents what would
        be an independent service in production — isolated, ordered, communicating through events.
      </P>
      <P>
        The interesting engineering is in the combination: a 202-returning HTTP endpoint that hands off
        to a goroutine, a concurrency-safe WebSocket hub that broadcasts state changes to all connected
        clients, and a frontend that reacts to events rather than polling. Encore handles the
        infrastructure glue so the code stays focused on the domain logic.
      </P>

      <Divider />

      <Colophon>
        Built with Go, Encore, Next.js, PostgreSQL, and gorilla/websocket.
      </Colophon>
    </ArticleShell>
  );
}
