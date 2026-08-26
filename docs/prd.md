# Olympus MCP Harness — Product Requirements

## Problem Statement
Agents can now call websites through WebMCP, but the call itself is ungoverned. A shopper (or a judge acting as one) can watch an agent search laptops, dump junk into a cart, and fire checkout with bad prices or no consent. Developers exposing tools have no shared place to validate arguments, classify risk, require a human, verify the world actually changed, or show a trace. That gap is frequent (every multi-step agent session) and costly (wrong purchase, silent failure, unreproducible demo). Olympus MCP Harness is the control layer behind the WebMCP boundary for one coherent commerce demo — not a new agent.

## User Stories

### Epic: First impression & thesis

- As a **judge landing on the live URL**, I want the architecture and tagline visible in the first viewport so that I understand the product before any tool runs.
  - [ ] Header shows **Olympus MCP Harness** and **The model reasons. WebMCP connects. Olympus controls. The machine executes.**
  - [ ] Three columns labeled Model / Harness / Machine are visible without scrolling on a 1280px desktop.
  - [ ] Luxury glass/gold treatment is applied (obsidian base, gold accents, frosted panels). No neon, no Walrus/World Cup branding.
  - [ ] Edge: narrow viewport stacks columns; thesis remains readable.

- As a **judge without WebMCP enabled**, I want a clear status and a working simulate path so that Execution is not a dead page.
  - [ ] Banner states whether `document.modelContext` is available.
  - [ ] Simulate-agent controls still drive the harness and update the storefront.
  - [ ] Edge: never display “7 tools registered” if the browser API is missing.

### Epic: Catalog & agent tools

- As an **in-page agent**, I want `search_products` so that I can find laptops under a budget without scraping cards.
  - [ ] Input: `query` (string, required), `maxPrice` (number, optional).
  - [ ] Returns a bounded list of products with id, name, price (number), and a short spec blurb.
  - [ ] Edge: empty query / non-numeric maxPrice → `INVALID_INPUT`, no catalog mutation.
  - [ ] Edge: zero matches → `ok: true` with empty array and verification note, not a crash.

- As an **in-page agent**, I want `get_product` so that I can inspect one SKU before comparing.
  - [ ] Input: `productId` (string, required).
  - [ ] Unknown id → structured error, not a 500-style blank.

- As an **in-page agent**, I want `compare_products` so that I can justify a pick in the Model panel.
  - [ ] Input: array of 2–3 product ids.
  - [ ] Returns a comparison table the UI can render (price, RAM/GPU-style attributes from demo data).
  - [ ] Edge: 1 id or >3 ids or duplicate unknown ids → `INVALID_INPUT`.

- As a **human**, I want the Machine column to reflect catalog results so that I can see the agent and I share the same page.
  - [ ] Search/compare/get update visible product cards or a comparison strip.
  - [ ] Edge: first load shows a small seeded catalog, not an empty void.

### Epic: Cart mutation

- As an **in-page agent**, I want `add_to_cart` so that a chosen laptop is prepared for purchase.
  - [ ] Input: `productId`, `qty` (positive integer).
  - [ ] Cart total and line items update in the Machine column.
  - [ ] Medium risk: auto-executes after validate/authorize; no approval dialog.
  - [ ] Edge: qty 0, negative, or missing product → `INVALID_INPUT` / not found; cart unchanged.
  - [ ] Verification: cart contains the product at requested qty; total matches sum of lines.

### Epic: High-risk checkout & human approval

- As a **human**, I want checkout to stop for explicit approval so that an agent cannot spend money silently.
  - [ ] `checkout` is high risk, `requiresApproval: true`, no auto-retry.
  - [ ] Dialog (impossible to miss) shows product summary, **exact** total, risk High, reason “Irreversible purchase action”, Reject and Approve.
  - [ ] Until Approve, machine does not create an order.
  - [ ] Reject → `APPROVAL_REJECTED`, no order, trace records reject.
  - [ ] Approve binds to exact arguments (items + total). If cart/total changed after the prompt, previous approval is invalid and the gate reappears.
  - [ ] Success → order id, amount matching approved amount, receipt in Model + Machine.
  - [ ] Edge: checkout with empty cart → blocked, no dialog-as-success.
  - [ ] Demo safety: simulated order only; copy states no real charge.

### Epic: Harness pipeline & observability

- As a **developer watching the demo**, I want every invocation to pass Inspect → Validate → Authorize → Execute → Verify so that I can trust the control layer.
  - [ ] Trace timeline appends real events with timestamps, stage, tool, status, message, duration.
  - [ ] Structured result envelope: `ok`, `tool`, `data`/`error`, `verification`, `traceId`, `durationMs`.
  - [ ] Error codes used: `TOOL_NOT_FOUND`, `INVALID_INPUT`, `UNAUTHORIZED`, `APPROVAL_REQUIRED`, `APPROVAL_REJECTED`, `EXECUTION_TIMEOUT`, `EXECUTION_FAILED`, `VERIFICATION_FAILED`, `RATE_LIMITED`, `INTERNAL_ERROR`.
  - [ ] Metrics (success rate, avg latency, tool calls, approvals, rejects, validation failures, verification failures) come from the same in-memory log — not placeholders.

- As a **judge**, I want one visible failure handled safely so that Execution is not only the happy path.
  - [ ] A demo control or agent-callable bad input shows `INVALID_INPUT` (or timeout / verification fail) with a red/error chip and no silent retry on high-risk tools.
  - [ ] Low-risk search may retry once on timeout; checkout never auto-retries.

### Epic: Submission surfaces

- As a **contestant**, I want README + live URL + repo license so that judges can test without a call.
  - [ ] README: thesis, tool list, Chrome flag steps, ChatGPT in-app browser note, simulate-agent fallback, “no real payments”.
  - [ ] Public repo, visible open-source license, English Devpost description drafted from this PRD.

## What We're Building

1. Luxury single-page demo: Model | Harness | Machine + trace + metrics.
2. Five WebMCP tools, thin wrappers, harness as the only executor.
3. Policy table: search/get/compare = low + retry; add_to_cart = medium auto; checkout = high + approval, no retry.
4. Approval dialog bound to exact checkout arguments.
5. Result verification after every tool.
6. Live trace + honest metrics.
7. Simulate-agent panel + WebMCP feature detection.
8. One scripted failure path.
9. Seeded laptop catalog aimed at the prompt: “Find the best laptop under $1,500 for AI development and prepare it for purchase.”
10. Vercel deploy + MIT (or Apache-2.0) LICENSE + README.

## What We'd Add With More Time
- `get_cart` / `remove_from_cart` if the demo needs them.
- Side-by-side “without harness vs with harness” eval harness.
- Persistence (KV/Postgres) across refresh.
- OpenTelemetry export.
- Declarative HTML tools for forms.
- Multi-user auth.

## Non-Goals
- Not an autonomous agent platform — the model stays outside; we do not pick “which laptop is best.”
- Not a real store — no Stripe, no PII, no inventory.
- Not MemWal/Walrus/blockchain.
- Not a replacement for WebMCP discovery — we enrich risk/approval metadata only.
- Not a general policy product — one explicit table for five tools.

## Open Questions
- **WebMCP runtime variance** (ChatGPT Sites vs Chrome flag vs Inspector) — handle with feature detect + simulate path. Can wait for /build; do not block spec.
- **Exact `execute` return shape** the ChatGPT in-app browser prefers (string vs JSON vs `{ content: [...] }`) — confirm against live Inspector during tool registration. Spec should return JSON-serializable envelopes and also a short text summary for agents.
- **License pick** (MIT vs Apache-2.0) — default MIT unless contestant says otherwise. Before /build is fine.
