# Watching Money Move in Real Time: Building a WebSocket Transaction Visualizer

*What event-driven microservices actually look like in motion*

---

Every time you tap "Transfer" in your banking app, you get a result in under a second. Approved. Done.

But that instant feeling is a lie. There's a polished UI hiding something far more interesting underneath. Your request doesn't hit one service and come back. It travels through a chain of independent systems, each one checking something different, each one capable of failing. And most developers never get to see that chain in motion.

So I built something to make it visible.

**webhook-playground** is a full-stack project that simulates a bank transfer pipeline and visualizes every step in real time. You enter a sender, receiver, and amount. A job is created. Then you manually trigger each step (balance check, daily limit check, receiver verification, fund transfer, confirmation) and watch each one animate through processing, success, or failure, driven entirely by WebSocket events from the backend.

This article is about why I built it, the design decisions that shaped it, and what I learned along the way.

---

## The Architecture Behind a Real Bank Transfer

Here's something most developers don't think about: real banks don't run a single monolithic service that knows everything about you. They operate in **microservices**, and the separation is deliberate, not just for scaling.

When you initiate a transfer, your request touches multiple independent services, each owned by a different team, each with access to only the data it needs:

- The **Balance Service** knows your account balance. Nothing else.
- The **Limits Service** knows your daily transaction cap. Not your balance, not your account details.
- The **Account Verification Service** knows whether a given account number exists and belongs to a real person. Not what's in it.
- The **Transaction Service** executes the fund movement between accounts.

This isn't just good architecture. It's a deliberate security boundary. The developer working on daily limit checks cannot query your balance. The developer on account verification cannot see your transaction history. If any one service is compromised, the blast radius is contained.

What connects these services isn't a direct function call either. It's **events**. Each service completes its step, emits an event, and the next service in the chain picks it up. The whole pipeline is event-driven, asynchronous, and ordered.

That's exactly what this project visualizes.

---

## What Problem Does This Solve?

There's no shortage of CRUD tutorials online. But most of them skip the parts that actually become relevant once you're working on real systems:

- What does an **event-driven, asynchronous state machine** look like end-to-end?
- How do you model **isolated, ordered services** where each step only knows what it needs to?
- How do you push live state changes from server to client **without polling**?
- How do you handle **failure and retry** in a sequential pipeline?

This project is my answer to that gap. The failures are randomized on purpose, and the five steps run in a single backend rather than separate deployed services. But the *patterns* are real. Each step is an isolated unit of work with its own success/failure logic, communicating via events rather than direct calls. It's a working model of how microservices in a bank actually talk to each other.

---

## Tech Stack and Why

For the backend I chose **Go** with **Encore** as the framework. Encore manages PostgreSQL automatically, both locally on `encore run` and in production on deploy. No connection strings in code, no `.env` juggling for the database. It also gives you built-in distributed tracing at `localhost:9400` while you develop, which was genuinely useful when debugging async step flows.

The real-time layer is **WebSocket** using `gorilla/websocket`. The frontend is **Next.js** (App Router) with Tailwind CSS. Backend deploys to Render via `encore build docker`, frontend to Vercel.

One deliberate choice worth calling out: I used Encore specifically because it lets you define APIs as regular Go functions with an annotation, generates documentation automatically, and handles the infrastructure glue without a separate config layer. For a project where the interesting part is the domain logic and not the plumbing, that actually mattered.

---

## How It Works

### Creating a Job

`POST /jobs` accepts a sender, receiver, and amount. It creates a `jobs` row and five `steps` rows, all in `idle` state, then returns the full job payload.

```go
//encore:api public method=POST path=/jobs
func (s *Service) CreateJob(ctx context.Context, req *CreateJobRequest) (*JobResponse, error) {
    jobID := uuid.New().String()
    title := fmt.Sprintf("Transfer: %s → %s", req.Sender, req.Receiver)
    _, err := db.Exec(ctx, `INSERT INTO jobs (id, title, amount, sender, receiver, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')`,
        jobID, title, req.Amount, req.Sender, req.Receiver)
    // ... insert 5 steps with status='idle'
}
```

The frontend navigates to `/jobs/:id`, fetches the initial state, then opens a WebSocket connection and switches entirely to event-driven updates. No more polling.

### Triggering a Step

`POST /jobs/:id/steps/:stepId/trigger` is where the interesting validation lives. The handler enforces ordering strictly:

- If the step is already `processing`, it returns `409 Aborted`
- If it already `succeeded`, it returns `400 Failed Precondition`
- If the previous step hasn't succeeded yet, same thing

Once validation passes, the handler marks the step as `processing`, broadcasts a `step.processing` WebSocket event, spawns a goroutine, then **returns immediately with 202 Accepted**. The client never waits for the outcome. It just watches for events.

```go
hub.Global.Broadcast(id, hub.WSEvent{
    Event:   "step.processing",
    JobID:   id,
    StepID:  stepId,
    Message: "Processing...",
})
go processStep(id, stepId, stepOrder, sender, receiver, amount)
return &TriggerResponse{Accepted: true}, nil
```

This is the pattern that makes the whole thing feel real. The HTTP endpoint is just the trigger. The actual work happens asynchronously, and the UI stays in sync through events.

### The Simulation Engine

Each step has a configured failure probability that loosely mirrors what a real pipeline might look like. Balance checks and limit checks fail more often (20% each) because these are the most common rejection points in real transfers. Receiver verification is less likely to fail (10%). The confirmation step never fails because once you've cleared everything else, it's just bookkeeping.

On failure, the step resets to `idle` after a 2-second delay so the user can hit RETRY. On success, the engine checks if all steps are done. If they are, it marks the job `completed` and broadcasts `job.completed`.

### The WebSocket Hub

The hub is a package-level singleton that maps job IDs to active connections. The key detail is the cleanup pattern. If a write fails because the client disconnected, the connection gets silently removed from the slice with no blocking and no panics:

```go
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
}
```

The `ws` package (which upgrades HTTP connections) and the `steps` package (which calls `Broadcast`) both import `hub`. The hub is the shared communication layer between them, which keeps the dependency graph clean.

### The Event Envelope

All WebSocket events use a consistent shape:

```json
{
  "event": "step.processing | step.success | step.failed | job.completed",
  "jobId": "uuid",
  "stepId": "uuid",
  "message": "Human readable message"
}
```

The frontend's `useWebSocket` hook receives these and updates step state locally. No re-fetching from the server required. The UI is purely reactive.

### What the UI Shows

Each step card has five visual states: **idle** (locked, waiting for the previous step), **ready** (pulsing blue border, ready to trigger), **processing** (amber with a spinner), **success** (green checkmark), and **failed** (red X with a RETRY button).

Think of each card as a window into a different microservice. "Check Balance" is your Balance Service responding. "Check Daily Limit" is your Limits Service. In a real bank, these are separate codebases, separate databases, separate teams. Here, they're separate units of logic communicating through the same event-driven pattern.

---

## Why WebSockets Over Polling?

The simpler alternative would be polling `GET /jobs/:id` every second. It would work. But there are three reasons WebSockets are the right call here.

**Latency.** WebSocket events arrive the moment they're broadcast. Polling introduces up to a second of lag per step, and in a visualizer that lag defeats the whole point.

**Load.** With WebSockets, the server pushes to all connected clients in one broadcast call. With polling, every client fires its own request and that scales linearly with users.

**State machine clarity.** The event stream is the source of truth for the UI. Polling creates a reconciliation problem: what changed since my last fetch? With events, you react to exactly what happened, in order.

For a general CRUD app, polling is totally fine. For a real-time visualizer of a sequential state machine, WebSockets are the only honest choice.

---

## What Encore Brings to the Table

A few things worth calling out for Go developers who haven't tried Encore:

**Zero-config PostgreSQL locally.** Run `encore run` and your database is provisioned and migrated automatically. This sounds small until you've spent 20 minutes debugging a Docker Compose networking issue at 11pm.

**Structured API definitions.** The `//encore:api` annotation generates API documentation and handles JSON marshaling from a regular Go function signature. No separate OpenAPI spec to maintain.

**Built-in observability.** Every request is traced at `localhost:9400`. When the async goroutine fires and the WebSocket event lands, you can see the full timing in the trace view without adding any instrumentation yourself. Honestly this was the feature I leaned on most while debugging.

**Docker build for self-hosting.** `encore build docker webhook-playground:latest --arch=amd64` produces a production-ready image with the PostgreSQL runtime config embedded. Deploying to Render from there was pretty straightforward.

---

## The Cleanup Cron

One small thing worth mentioning: a weekly cron job prunes jobs older than 7 days. Encore's cron API is declarative, you just define the schedule and point it at a private endpoint. It doesn't run locally or in preview environments, only in production:

```go
var _ = cron.NewJob("weekly-cleanup", cron.JobConfig{
    Title:    "Clean up old jobs",
    Schedule: "0 0 * * 0",
    Endpoint: CleanupJobs,
})

//encore:api private
func CleanupJobs(ctx context.Context) error {
    _, err := db.Exec(ctx, `
        DELETE FROM steps WHERE job_id IN (
            SELECT id FROM jobs WHERE created_at < NOW() - INTERVAL '7 days'
        )`)
    // ... delete jobs
}
```

Small thing, but I like how Encore makes this feel like a first-class part of the application rather than some afterthought cron script.

---

## Wrapping Up

Real banks run microservices. The developer who works on daily limit checks has no access to your account balance. Each service owns its slice of data, and the whole pipeline is stitched together through events, not direct calls, not shared databases.

webhook-playground makes that invisible architecture visible. Trigger a step, watch it process, see it succeed or fail, and retry if it doesn't. Each card on screen represents what would be an independent service in production, isolated, ordered, communicating through events.

The interesting engineering is in the combination: a 202-returning HTTP endpoint that hands off to a goroutine, a concurrency-safe WebSocket hub that broadcasts state changes to all connected clients, and a frontend that reacts to events rather than polling. Encore handles the infrastructure glue so the code stays focused on the domain logic.

If you've ever wondered what event-driven microservices look like in motion, this is a working model of one.

---

**Try the live demo:** [webhook-playground.lucascodes.dev](https://webhook-playground.lucascodes.dev)

**Full writeup on my portfolio:** [lucascodes.dev](https://lucascodes.dev)

*Built with Go, Encore, Next.js, PostgreSQL, and gorilla/websocket.*

---

*Tags: Go, Backend Development, System Design, Software Engineering, Web Development*
