# Olympus MCP Harness

> **The model reasons. WebMCP connects. Olympus controls. The machine executes.**
>
> Olympus MCP Harness engineers the execution control layer behind the WebMCP boundary.
>
> Olympus enables controlled delegation: agents handle routine actions autonomously while humans retain authority over consequential ones.

---

## 1. Project Overview

**Olympus MCP Harness** is a WebMCP-native execution harness for developers exposing real actions to AI agents through WebMCP.

It sits behind the WebMCP boundary and turns model decisions into **controlled, observable, policy-aware, verifiable execution**.

The project is built for **The WebMCP Challenge** and is designed to demonstrate that reliable agentic web systems need more than tool exposure: they need an engineering layer that governs how tools are validated, authorized, executed, verified, traced, and recovered.

### Core Thesis

> **Models are probabilistic. Execution shouldn't be.**

The model should decide **what** to do and **why**.
WebMCP is how the agent talks to the web.
Olympus decides **can / should / did it work**.
The machine deterministically **does the work**.

---

## 2. Problem

WebMCP makes actions available to models. Olympus makes those actions safe to execute.

WebMCP makes websites legible and actionable by exposing structured tools and capabilities. Exposing tools alone does not guarantee reliable execution.

An agent can still:

- choose the wrong tool,
- pass invalid or ambiguous arguments,
- attempt actions that violate permissions or policy,
- execute sensitive actions without explicit user approval,
- mis-handle tool failures,
- trust malformed or inconsistent results,
- lose execution context across multi-step workflows,
- become difficult to debug because the action path is opaque.

The missing layer is an **execution harness** that makes agent-to-web actions controlled, observable, safe, and verifiable.

As WebMCP moves agents from reading websites to acting on them, execution becomes a trust boundary. Olympus engineers that boundary.

---

## 3. Solution

Olympus MCP Harness introduces five execution primitives. These run **after** WebMCP has already registered, discovered, and invoked a tool — they do not replace WebMCP discovery.

1. **INSPECT** — resolve and enrich a capability WebMCP already exposed (risk, policy metadata, filters). Do not rediscover the catalog.
2. **VALIDATE** — validate tool arguments, types, schemas, constraints, and normalized values.
3. **AUTHORIZE** — enforce permissions, risk policies, rate limits, and human approval rules.
4. **EXECUTE** — invoke the selected machine action through a controlled runtime.
5. **VERIFY** — validate the result, detect failures, confirm expected state changes, and return structured context.

A cross-cutting **trace** records every step.

```text
USER GOAL
   ↓
MODEL
Reason · Plan · Decide
   ↓
WEBMCP BOUNDARY
registerTool · discover · invoke
   ↓
OLYMPUS MCP HARNESS
Inspect → Validate → Authorize
        → Execute → Verify
        → Trace
   ↓
MACHINE
App Logic · APIs · Database · State
   ↓
STRUCTURED RESULT
   └────────────────────────→ MODEL
```

---

## 4. Design Philosophy

### 4.1 Separation of Reasoning and Execution

The model owns:

- understanding intent,
- decomposition,
- reasoning,
- planning,
- tool choice,
- interpretation of results,
- deciding the next step.

The harness owns:

- capability metadata,
- argument validation,
- authorization,
- execution policy,
- approval gates,
- retries and recovery,
- output verification,
- state handoff,
- traces and metrics.

The machine owns:

- deterministic application logic,
- browser state changes,
- API calls,
- database operations,
- external service calls.

### 4.2 The Harness Must Not Become Another Agent

Olympus MCP Harness must not duplicate model reasoning.

The harness should never decide business intent such as:

> “Which laptop is best for AI development?”

It may decide execution constraints such as:

> “This checkout action is high risk and requires explicit approval.”

### 4.3 No Hidden Actions

Every consequential action must be traceable.

Sensitive actions must never execute silently.

### 4.4 Least Privilege

Tools should expose the minimum capabilities required for the workflow.

### 4.5 Human-in-the-Loop by Design

High-risk or irreversible actions require explicit user approval.

---

## 5. Target Demo

The primary demo uses a lightweight commerce workflow because it makes WebMCP actions visually understandable and allows the harness to demonstrate read actions, write actions, policy checks, approval gates, and verification.

### User Goal

> “Find the best laptop under $1,500 for AI development and prepare it for purchase.”

### Example Workflow

```text
1. Model decides it needs product candidates.
2. WebMCP invokes search_products().
3. Harness validates arguments.
4. Harness authorizes read-only execution.
5. Machine executes search.
6. Harness verifies structured results.
7. Model selects candidates.
8. WebMCP invokes compare_products().
9. Harness validates and executes.
10. Model selects a preferred laptop.
11. WebMCP invokes add_to_cart().
12. Harness allows the action.
13. WebMCP invokes checkout().
14. Harness detects high-risk action.
15. Human approval is required.
16. User approves.
17. Harness executes checkout.
18. Harness verifies success and returns a structured receipt.
```

### Demo Moment That Must Be Memorable

The flow must visibly stop at the approval boundary:

```text
HUMAN APPROVAL REQUIRED

Purchase: Laptop X
Price: $1,399
Risk: High
Reason: Irreversible purchase action

[Reject]   [Approve]
```

This is the moment that proves the harness is more than a logging layer.

---

## 6. Product Scope

### 6.1 MVP Features — Required

#### WebMCP Tool Registration

The web app must expose a small, coherent set of WebMCP tools.

Recommended tool set:

- `search_products`
- `get_product`
- `compare_products`
- `add_to_cart`
- `checkout`

Optional:

- `remove_from_cart`
- `get_cart`

Do **not** add tools unless they improve the primary demo.

#### Harness Runtime

The runtime must implement:

- tool registry metadata,
- schema validation,
- input normalization,
- risk classification,
- authorization rules,
- human approval gates,
- execution wrappers,
- timeout handling,
- retry policy for safe actions,
- structured errors,
- result verification,
- execution trace generation.

#### Harness Trace UI

The UI must show the execution lifecycle in real time.

Example:

```text
12:01:03  INSPECT     search_products resolved · risk low
12:01:03  VALIDATE    input OK
12:01:04  AUTHORIZE   allowed / low risk
12:01:04  EXECUTE     search_products()
12:01:05  VERIFY      8 valid products
```

#### Human Approval

At least one tool must require explicit approval.

Recommended:

- `checkout` = high risk / approval required
- `add_to_cart` = medium risk / allowed without approval
- search and read tools = low risk

#### Result Verification

Every tool invocation must return a structured result envelope.

Example:

```ts
interface HarnessResult<T> {
  ok: boolean;
  tool: string;
  data?: T;
  error?: HarnessError;
  verification: {
    passed: boolean;
    checks: string[];
  };
  traceId: string;
  durationMs: number;
}
```

---

## 7. Non-Goals

The MVP is **not**:

- a multi-agent framework,
- an MCP server marketplace,
- an n8n-style workflow builder,
- a general-purpose browser automation platform,
- a blockchain application,
- a RAG application,
- a vector database product,
- an autonomous agent platform,
- a full e-commerce product,
- a complete enterprise policy engine.

Avoid scope expansion until the core demo is reliable.

---

## 8. WebMCP Integration Strategy

WebMCP is the agent-to-web boundary.

The harness is the execution control layer behind that boundary.

### Recommended Pattern

```ts
document.modelContext.registerTool({
  name: "search_products",
  description: "Search products using structured criteria.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      maxPrice: { type: "number" }
    },
    required: ["query"]
  },
  async execute(input) {
    return harness.run("search_products", input);
  }
});
```

The WebMCP tool should be thin.

Business execution policy belongs inside the harness.

### Discovery Rule

WebMCP owns discovery. Olympus does not rediscover.

The harness **inspects** capabilities already exposed by `registerTool`:

- resolve the named tool against the local registry,
- enrich tool metadata,
- classify tools by risk,
- filter capabilities based on policy,
- attach constraints,
- attach approval requirements.

It should not pretend to replace the WebMCP lifecycle (`registerTool · discover · invoke`).

---

## 9. Harness Runtime Specification

### 9.1 Tool Definition

```ts
type RiskLevel = "low" | "medium" | "high";

interface HarnessTool<I, O> {
  name: string;
  description: string;
  risk: RiskLevel;
  requiresApproval: boolean;
  inputSchema: unknown;
  execute(input: I, context: HarnessContext): Promise<O>;
  verify?(output: O, context: HarnessContext): Promise<VerificationResult>;
}
```

### 9.2 Execution Context

```ts
interface HarnessContext {
  traceId: string;
  sessionId: string;
  userId?: string;
  startedAt: number;
  metadata?: Record<string, unknown>;
}
```

### 9.3 Execution Pipeline

```text
receive invocation (WebMCP execute or Simulate)
      ↓
inspect capability (resolve + risk; do not rediscover)
      ↓
validate schema
      ↓
normalize input
      ↓
calculate risk
      ↓
check authorization
      ↓
request approval if required
      ↓
execute with timeout
      ↓
verify result
      ↓
record trace
      ↓
return structured result
```

### 9.4 Failure Model

The runtime should classify failures.

Recommended error codes:

- `TOOL_NOT_FOUND`
- `INVALID_INPUT`
- `UNAUTHORIZED`
- `APPROVAL_REQUIRED`
- `APPROVAL_REJECTED`
- `EXECUTION_TIMEOUT`
- `EXECUTION_FAILED`
- `VERIFICATION_FAILED`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

Example:

```ts
interface HarnessError {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}
```

---

## 10. Policy Model

Keep the first policy engine intentionally small.

### Example Policy Table

| Tool | Risk | Auto Execute | Human Approval | Retry |
|---|---|---:|---:|---:|
| `search_products` | Low | Yes | No | Yes |
| `get_product` | Low | Yes | No | Yes |
| `compare_products` | Low | Yes | No | Yes |
| `add_to_cart` | Medium | Yes | No | Limited |
| `checkout` | High | No | Yes | No |

### Policy Principles

- read-only actions should be easy to execute,
- reversible mutations may be auto-executed if safe,
- irreversible or financial actions require approval,
- high-risk tools should not auto-retry,
- approval should bind to exact action arguments,
- changed arguments invalidate previous approval.

---

## 11. Verification Model

Verification is required because “tool executed” is not equal to “goal achieved.”

### Verification Examples

#### Search

Verify:

- result is an array,
- result count is reasonable,
- required product fields exist,
- prices are numeric,
- result is not stale or malformed.

#### Add to Cart

Verify:

- cart contains the product,
- requested quantity matches,
- cart total changed as expected.

#### Checkout

Verify:

- order ID exists,
- final amount matches approved amount,
- status indicates success,
- receipt can be returned to the model.

---

## 12. Observability

Observability is a core feature, not a polish item.

### Trace Event Shape

```ts
interface TraceEvent {
  traceId: string;
  timestamp: number;
  stage:
    | "inspect"
    | "validate"
    | "authorize"
    | "approval"
    | "execute"
    | "verify"
    | "recover"
    | "complete";
  tool?: string;
  status: "start" | "success" | "warning" | "error";
  message: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}
```

### Minimum Metrics

Display:

- success rate,
- average execution latency,
- total tool calls,
- approval count,
- rejected actions,
- validation failures,
- verification failures.

Do not fake metrics.
Use real execution data from the demo runtime.

---

## 13. UX Specification

The UI should make the philosophy understandable without reading documentation.

### Primary Layout

```text
┌─────────────────────────────────────────────────────────┐
│ OLYMPUS MCP HARNESS                                     │
│ The model reasons. WebMCP connects.                     │
│ Olympus controls. The machine executes.                 │
├──────────────┬──────────────────────┬────────────────────┤
│ MODEL        │ HARNESS              │ MACHINE            │
│ WHAT / WHY   │ CAN / SHOULD / DID   │ DO THE WORK        │
│              │                      │                    │
│ Intent       │ Inspect              │ App logic          │
│ Reasoning    │ Validate             │ APIs · State       │
│ Decision     │ Authorize            │ Simulated checkout │
│ Next step    │ Execute              │                    │
│              │ Verify · Trace       │                    │
├──────────────┴──────────────────────┴────────────────────┤
│ EXECUTION TRACE                                         │
└─────────────────────────────────────────────────────────┘
```

### UI Priorities

1. Show the current model decision.
2. Show the harness stage currently running.
3. Show the machine action.
4. Show success/failure visibly.
5. Make approval gates impossible to miss.
6. Make traces readable in the demo video.

### Visual Direction

Recommended:

- dark technical interface,
- blue = reasoning,
- purple = harness/control,
- green = machine/execution,
- amber = approval/warning,
- red = failure,
- high contrast,
- restrained animation.

Avoid decorative complexity that competes with the execution flow.

---

## 14. Suggested Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### WebMCP

- Chrome WebMCP imperative API
- thin tool registration layer

### Harness

- TypeScript runtime
- Zod or JSON Schema validator
- explicit policy engine
- structured result envelope
- in-memory state for MVP

### Persistence

Optional for MVP.

If needed:

- Vercel Postgres / Neon / Supabase, or
- Vercel KV / Upstash Redis for traces and sessions.

Do not add persistence unless the demo requires it.

### Deployment

- Vercel

### Observability

Start with app-level structured logs.

Optional:

- OpenTelemetry,
- Vercel Analytics / logging.

---

## 15. Suggested Repository Structure

```text
mcp-harness/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── api/
│   └── demo/
│
├── components/
│   ├── ModelPanel.tsx
│   ├── HarnessPanel.tsx
│   ├── MachinePanel.tsx
│   ├── TraceTimeline.tsx
│   ├── ApprovalDialog.tsx
│   └── MetricsPanel.tsx
│
├── lib/
│   ├── webmcp/
│   │   ├── registerTools.ts
│   │   └── toolSchemas.ts
│   │
│   ├── harness/
│   │   ├── runtime.ts
│   │   ├── registry.ts
│   │   ├── validator.ts
│   │   ├── policy.ts
│   │   ├── approval.ts
│   │   ├── executor.ts
│   │   ├── verifier.ts
│   │   ├── errors.ts
│   │   ├── trace.ts
│   │   └── types.ts
│   │
│   ├── demo/
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   └── checkout.ts
│   │
│   └── utils/
│
├── public/
│
├── tests/
│   ├── harness/
│   ├── tools/
│   └── evals/
│
├── PROJECT.md
├── README.md
├── LICENSE
├── package.json
└── tsconfig.json
```

---

## 16. Build Order

Build backward from the final demo.

### Phase 1 — Foundation

- create Next.js project,
- create visual shell,
- define shared types,
- define demo product data,
- confirm WebMCP registration works in target browser environment.

### Phase 2 — Tool Layer

Implement:

- `search_products`,
- `get_product`,
- `compare_products`,
- `add_to_cart`,
- `checkout`.

All tools must work before adding advanced UI.

### Phase 3 — Harness Core

Implement in this order:

1. registry,
2. validator,
3. policy,
4. executor,
5. verifier,
6. trace.

### Phase 4 — Human Approval

Add:

- approval state,
- approval dialog,
- reject path,
- exact-arguments binding.

### Phase 5 — Trace UI

Visualize:

- current stage,
- tool name,
- status,
- latency,
- error state,
- result state.

### Phase 6 — Failure / Recovery Demo

Introduce one controlled failure case.

Recommended:

- invalid argument,
- timeout on a low-risk tool,
- verification mismatch.

Show the harness catching it and recovering or failing safely.

### Phase 7 — Evals

**Planned.** Repeatable tests for invalid schema, unauthorized blocking, approval, checkout after approve, verification failure, trace completeness.

Do **not** publish a success-rate percentage until a real run exists. After a run, cite “evaluated using Chrome WebMCP Evals methodology” — not before.

### Phase 8 — Polish

Only after the complete flow works:

- animation,
- landing copy,
- metrics,
- responsive design,
- screenshots,
- demo video.

---

## 17. Testing Strategy

### Unit Tests

Test:

- validator,
- policy rules,
- approval state,
- result verifier,
- error classification.

### Integration Tests

Test full harness pipelines:

```text
valid request
→ validate
→ authorize
→ execute
→ verify
→ success
```

and:

```text
high-risk request
→ validate
→ authorize
→ approval required
→ reject
→ no machine execution
```

### Required Failure Tests

- invalid schema,
- unknown tool,
- tool timeout,
- execution exception,
- verification failure,
- rejected approval.

---

## 18. Evaluation Strategy

Do not rely only on claims.
Measure reliability.

### Core Metrics

- tool-call success rate,
- validation failure rate,
- authorization block rate,
- verification success rate,
- average execution latency,
- percentage of high-risk actions correctly gated,
- trace completeness.

### Optional Comparative Eval

If time allows, compare:

**Without Harness**

vs.

**With Olympus MCP Harness**

Use a fixed set of tasks and report real results only.

Example categories:

- valid arguments,
- safe execution,
- correct state changes,
- recovery behavior,
- observability.

---

## 19. Security Requirements

The project must demonstrate security as an execution property.

### Required

- validate all tool inputs,
- do not trust model-supplied values blindly,
- never execute high-risk actions without approval,
- bind approvals to exact arguments,
- reject modified requests after approval,
- avoid exposing secrets in traces,
- sanitize user-visible error messages,
- avoid auto-retrying irreversible actions,
- enforce deterministic tool boundaries.

### Demo Safety

Use simulated or sandboxed commerce execution.

Do not require a real credit-card purchase for judging.

---

## 20. Product Messaging

### Project Name

**Olympus MCP Harness**

### Primary Tagline

> **The model reasons. WebMCP connects. Olympus controls. The machine executes.**

### Product Thesis

> **Models are probabilistic. Execution shouldn't be.**

### Technical Thesis

> **WebMCP defines the boundary. Olympus MCP Harness engineers the execution behind it.**

### One-Sentence Description

> **Olympus MCP Harness is a control and observability layer that turns WebMCP tool calls into validated, authorized, verifiable machine execution.**

### Avoid Saying

- “another MCP framework,”
- “AI agent operating system,”
- “universal autonomous agent platform,”
- “enterprise-grade” unless evidence supports it.

Keep the message specific and demonstrable.

---

## 21. Sponsor Strategy

Use sponsors only where they strengthen the product.

### OpenAI / ChatGPT

Role:

- reasoning agent,
- natural-language interaction,
- demonstration environment.

Message:

> The model reasons.

### Google Chrome / WebMCP

Role:

- structured agent-to-web boundary,
- WebMCP runtime and testing environment,
- tool discovery and invocation.

Message:

> WebMCP connects: registerTool, discover, invoke.

### Vercel

Role:

- frontend hosting,
- API/runtime deployment,
- production demo URL,
- optional observability/persistence.

Message:

> The app is deployable and testable as a real web product.

### Our Contribution

**Olympus MCP Harness**

Message:

> We engineer the execution layer behind the WebMCP boundary.

---

## 22. Demo Script Target

Keep the full demo under three minutes.

### 0:00–0:20 — Problem

Show the thesis:

> “Models can reason well, but execution must be controlled.”

### 0:20–0:45 — Architecture

Show:

```text
ChatGPT → WebMCP → Olympus MCP Harness → Machine
```

### 0:45–1:45 — Happy Path

Run the laptop task.

Show:

- search,
- comparison,
- cart mutation,
- trace events.

### 1:45–2:20 — Approval Boundary

Trigger checkout.

Pause.

Show:

- high-risk classification,
- human approval,
- approve,
- verified execution.

### 2:20–2:40 — Failure Handling

Trigger one invalid or failing action.

Show safe rejection/recovery.

### 2:40–3:00 — Closing Thesis

> **The model reasons. WebMCP connects. Olympus controls. The machine executes.**

---

## 23. Definition of Done

The project is **not ready to submit** until all required items pass.

### Product

- [x] Live app works from a clean session.
- [x] WebMCP tools are correctly registered.
- [x] At least five coherent tools work.
- [x] Harness controls every tool execution path.
- [x] High-risk action requires explicit approval.
- [x] Rejecting approval prevents machine execution.
- [x] Verification runs after execution.
- [x] Trace UI reflects real runtime events.
- [x] At least one failure path is handled safely.

### Engineering

- [x] Tool schemas are explicit.
- [x] No high-risk action bypass exists.
- [x] Errors are structured.
- [x] High-risk actions do not auto-retry.
- [x] Trace IDs connect all execution events.
- [x] Core harness logic has tests.
- [x] No production secrets are committed.

### UX

- [x] Judge understands the architecture within 20 seconds.
- [x] Current model decision is visible.
- [x] Current harness stage is visible.
- [x] Machine action is visible.
- [x] Approval is visually prominent.
- [x] Error states are understandable.
- [x] App is usable on the target judging browser.

### Submission

- [x] Public repository.
- [x] Open-source license.
- [x] Clear README.
- [x] Live deployment URL.
- [x] English project description.
- [x] Demo video under three minutes.
- [x] WebMCP implementation visible in source.
- [x] Setup and run instructions verified from a fresh clone.

---

## 24. Final Review Rubric

Before submission, score each category from **0–5**.

### A. WebMCP Leverage — 25%

**5/5** means:

- WebMCP is central to the product,
- the demo clearly depends on structured WebMCP tools,
- removing WebMCP would materially weaken or invalidate the concept,
- the harness meaningfully improves execution behind the WebMCP boundary.

### B. Execution Quality — 25%

**5/5** means:

- the app is stable,
- tool calls work repeatedly,
- approval works correctly,
- failure paths are handled,
- traces are accurate,
- no obvious demo-only fake behavior exists.

### C. Potential Impact — 25%

**5/5** means:

- the problem is clear,
- the solution generalizes beyond the demo,
- developers can understand why an execution harness matters,
- the architecture could become reusable infrastructure.

### D. Creativity & Ambition — 25%

**5/5** means:

- the project is not another chatbot wrapper,
- the thesis is distinct,
- the harness concept is technically meaningful,
- the demo communicates a new way to think about reliable agentic web execution.

### Internal Submission Threshold

Do not submit unless:

```text
WebMCP Leverage      >= 4.5 / 5
Execution Quality    >= 4.0 / 5
Potential Impact     >= 4.0 / 5
Creativity/Ambition  >= 4.0 / 5
```

Target:

```text
Total internal score >= 17 / 20
```

---

## 25. Final Review Questions

Before submission, the project must answer “yes” to all of these:

1. Can a judge understand the value in 30 seconds?
2. Is WebMCP essential rather than decorative?
3. Can we show one concrete action that the harness safely blocks?
4. Can we show one concrete action that the harness safely executes?
5. Can we prove the harness verified the result?
6. Can we inspect the full execution trace?
7. Does the demo show model reasoning and machine execution as separate responsibilities?
8. Is the human approval boundary real, not cosmetic?
9. Does the project still make sense if the shopping demo is replaced by another domain?
10. Can the repository explain the architecture without relying on the video?

If any answer is “no,” fix it before submission.

---

## 26. North Star

When considering a new feature, ask:

> **Does this strengthen the boundary between model reasoning and machine execution?**

If yes, consider it.

If no, defer it.

The project should remain focused on one idea:

> **The model reasons. WebMCP connects. Olympus controls. The machine executes.**

> **WebMCP discovers. Olympus inspects. The machine executes.**

---

## 27. Reference Resources

Use current official documentation while implementing because WebMCP is evolving.

Key references:

- The WebMCP Challenge resources and rules on Devpost
- WebMCP specification / explainer
- Google Chrome WebMCP developer documentation
- Google Chrome WebMCP security guidance
- Google Chrome WebMCP eval guidance
- Chrome DevTools WebMCP debugging tools
- OpenAI WebMCP Showcase
- Vercel WebMCP Storefront reference implementation

Do not copy examples blindly. Use them to validate API behavior, security expectations, and judging compatibility.

---

**Status:** Strategy locked. Build against this document unless a tested implementation constraint requires a deliberate revision.
