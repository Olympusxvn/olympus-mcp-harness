# Build Checklist

## Build Preferences

- **Build mode:** Step-by-step
- **Comprehension checks:** No
- **Git:** Commit after each item with message `Complete step N: [title]` only when the learner asks to commit; never push unless asked
- **Verification:** Yes — after every item (learner confirms in the browser / terminal)
- **Check-in cadence:** Speed-run (brief narration; PROJECT.md is the lock)

This is a ~10-day WebMCP Challenge MVP, not a 3-hour classroom app. Items are larger than the curriculum’s 15–30 minute slices; sequence still respects dependencies.

## Checklist

- [x] **1. Scaffold Next.js app and luxury design system**
  Spec ref: `spec.md > Stack` + `spec.md > Luxury shell > Tokens and utilities`
  What to build: `create-next-app` (App Router, TS, Tailwind) in the repo root without wiping `PROJECT.md` / `docs/`. Add CSS variables, `.luxe-*` utilities, Sora + Inter, `LuxuryNav`, `HarnessBackground`. Brand: Olympus MCP Harness. No Walrus/World Cup strings. `webmcp-types` in tsconfig.
  Acceptance: Home page renders obsidian/gold glass chrome and the tagline. Reduced-motion CSS present.
  Verify: `npm run dev` — first viewport matches luxury skill; no neon.

- [x] **2. Three-column demo shell and seeded catalog**
  Spec ref: `spec.md > Luxury shell > Layout components` + `spec.md > Demo machine > Catalog`
  What to build: Model / Harness / Machine columns; `products.ts` with 8–12 laptops including sub-$1500 AI-dev options; empty cart and placeholder trace/metrics panels.
  Acceptance: Catalog visible in Machine column; layout readable at 1280px; stacked on small screens.
  Verify: Load `/` and confirm three labeled columns and product cards with numeric prices.

- [x] **3. Harness types, registry, validator, policy (no UI wiring yet)**
  Spec ref: `spec.md > Harness runtime > Types` through `Policy`
  What to build: `types.ts`, `errors.ts`, `registry.ts`, `validator.ts` (Zod aligned to JSON Schema), `policy.ts` table. Unit tests for invalid schema and unknown tool.
  Acceptance: Tests prove `INVALID_INPUT` and `TOOL_NOT_FOUND`. Policy matches PRD table.
  Verify: `npx vitest run` — validator/policy tests pass.
  **Checkpoint:** Learner confirms error codes and policy table look right.

- [x] **4. Executor, verifier, trace, runtime pipeline**
  Spec ref: `spec.md > Harness runtime > Executor` through `Runtime facade`
  What to build: timeout wrapper, per-tool verifiers, append-only trace, `harness.run` pipeline. Integration test: valid search → success envelope with `traceId`.
  Acceptance: One successful `search_products` through the pipeline returns `ok: true` and verification checks.
  Verify: Vitest pipeline test + optional node REPL/script calling `harness.run`.

- [x] **5. Demo machine: search, get, compare, add_to_cart**
  Spec ref: `spec.md > Demo machine` + `spec.md > WebMCP registration > Schemas`
  What to build: Implement the four tools’ `execute` bodies against in-memory store; wire Machine panel to cart/results. Simulate-agent buttons in Model panel call `harness.run` (not WebMCP yet).
  Acceptance: From the UI, search under $1500, open one product, compare two, add to cart; totals update; traces append.
  Verify: Click simulate search → cards filter; add to cart → line items + total change.

- [x] **6. Approval-gated checkout**
  Spec ref: `spec.md > Harness runtime > Approval` + `prd.md > High-risk checkout & human approval`
  What to build: `approval.ts`, `ApprovalDialog`, `checkout` tool. Bind approval to canonical args + amount. Reject path. Empty cart block. Simulated receipt.
  Acceptance: Checkout opens the modal; Reject creates no order; Approve creates order id matching amount; changing cart after prompt invalidates approval.
  Verify: Simulate add + checkout → modal → Reject (no receipt) → checkout again → Approve → receipt. Change qty while modal open if possible and confirm stale approve fails.
  **Checkpoint:** Learner confirms the approval moment is impossible to miss.

- [x] **7. WebMCP thin registration + status banner**
  Spec ref: `spec.md > WebMCP registration` + `spec.md > Runtime & Deployment`
  What to build: `detect.ts`, `registerTools.ts` with AbortSignal lifecycle, `readOnlyHint` annotations, execute → `harness.run`. `WebmcpStatus` banner. Fallback copy for unsupported browsers.
  Acceptance: In Chrome with flag, Inspector (or `getTools`) lists five tools. Unsupported browser still has simulate path. Duplicate-registration handled (Strict Mode).
  Verify: Chrome 151+ flag on — tools listed. Flag off — banner says unsupported, simulate still works.

- [x] **8. Trace timeline, harness stage, honest metrics**
  Spec ref: `spec.md > Harness runtime > Trace` + `prd.md > Harness pipeline & observability`
  What to build: `TraceTimeline`, live current-stage in Harness column, `MetricsPanel` folding real events.
  Acceptance: A run shows Inspect…Complete with timestamps; metrics move; no hardcoded 96% success.
  Verify: Run search then a bad query; timeline shows success then `INVALID_INPUT`; counters change.

- [x] **9. Scripted failure / recovery demo**
  Spec ref: `spec.md > Harness runtime > Executor` + `prd.md` failure story
  What to build: UI control “Trigger invalid search” and/or timeout injection on a low-risk tool (retry once). Checkout still never auto-retries. High-contrast error chip.
  Acceptance: Judge can provoke one safe failure without opening DevTools.
  Verify: Click failure control — error in trace, cart unchanged, checkout still gated.
  **Checkpoint:** Happy path + approval + failure all demoable.

- [x] **10. Harness tests and README**
  Spec ref: `spec.md > File Structure` + `prd.md > Submission surfaces`
  What to build: Remaining tests (approval reject, verification fail, high-risk no retry). README: thesis, tools, Chrome flag, ChatGPT in-app browser, simulate fallback, no real payments, license. MIT `LICENSE`.
  Acceptance: `vitest` green; clone instructions work from README.
  Verify: Fresh `npm i && npm test && npm run build`.

- [x] **11. Deploy to Vercel**
  Spec ref: `spec.md > Runtime & Deployment`
  What to build: Production deploy, HTTPS live URL, confirm client bundle registers tools only in browser.
  Acceptance: Live URL loads the luxury shell; simulate path works without local Chrome flags; document URL in README.
  Verify: Open production URL; run simulate search + checkout approval.

- [ ] **12. Submit your project to Devpost**
  Spec ref: `prd.md > What We're Building` (the core submission story)
  What to build: Devpost form for [The WebMCP Challenge](https://webmcp.devpost.com/). Name **Olympus MCP Harness** (human-chosen, already locked — do not let an agent rename it). Tagline from scope. Description: why WebMCP, human+agent loop, how `registerTool` + harness were implemented. Built-with: Next.js, WebMCP, TypeScript, Vercel. Screenshots: three-column thesis, trace, **approval modal**, failure. Link public repo + license + live URL. Upload `docs/` artifacts. Demo video < 3 min with audio (script in `PROJECT.md` §22). Do not edit repo/live/Devpost after 3 Sep 2026 1:00pm PDT.
  Acceptance: Submission complete with required fields; judges can test live URL in ChatGPT browser or Chrome+flag; video shows WebMCP + approval.
  Verify: Devpost shows submitted; README testing steps match what you just did on the live URL.
  **Checkpoint:** Definition of done in `PROJECT.md` §23.
