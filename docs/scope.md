# Olympus MCP Harness

## Idea
Olympus MCP Harness is a WebMCP-native execution control layer. ChatGPT (or another in-browser agent) reasons about a shopping goal; WebMCP registers, discovers, and invokes five structured tools; Olympus inspects, validates, authorizes, executes, and verifies every call — and stops the human at checkout. Tagline: **The model reasons. WebMCP connects. Olympus controls. The machine executes.**

## Who It's For
**Developers exposing real actions to AI agents through WebMCP.** The live demo also has two seats on one page:

- **Human shopper / judge** — sees a luxury storefront, the current model decision, harness stage, machine action, and a non-skippable approval gate on purchase.
- **In-page agent** (ChatGPT in-app browser, or Chrome 151+ with WebMCP testing enabled) — must use `document.modelContext` tools instead of scraping the DOM, because the harness is the only path to cart and checkout.

Unmet need: WebMCP makes actions available to models. Olympus makes those actions safe to execute. Callable is not the same as safe. As WebMCP moves agents from reading websites to acting on them, execution becomes a trust boundary. Olympus engineers that boundary.

## Inspiration & References
- Strategy lock: root `PROJECT.md` + architecture/roadmap images in the repo.
- Challenge: [The WebMCP Challenge](https://webmcp.devpost.com/) — deadline 3 Sep 2026, 1:00pm PDT. Criteria: WebMCP Leverage, Execution, Potential Impact, Creativity & Ambition (equal weight).
- Spec / explainer: [webmachinelearning/webmcp](https://github.com/webmachinelearning/webmcp), [WebMCP explainer](https://webmachinelearning.github.io/webmcp/).
- Chrome: [WebMCP developer docs](https://developer.chrome.com/docs/ai/webmcp), [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api), [Best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices), [Tool security](https://developer.chrome.com/docs/ai/webmcp/security) (see Resources tab), origin trial / `chrome://flags/#enable-webmcp-testing`.
- Types: [`webmcp-types`](https://www.npmjs.com/package/webmcp-types) v0.1.5.
- React helper (optional, not required): [use-webmcp-tool](https://github.com/GoogleChromeLabs/use-webmcp-tool).
- Commerce demos to steal structure from, not clone: [Vercel storefront WebMCP](https://webmcp.devpost.com/resources), Cloudflare coffee-store, Chrome travel / zaMaker demos.
- Testing: Chrome Model Context Tool Inspector extension; ChatGPT in-app browser.
- Visual: `luxury-wc-ui` skill — obsidian/midnight, gold `#FFD700`, champagne/platinum, frosted glass, Sora + Inter. Brand copy stays Olympus MCP Harness. **Do not** import Walrus / World Cup titles. Stage color from `PROJECT.md` §13 (blue/purple/green) is overridden: stages read as gold/champagne chips + labels (`INSPECT` / `VALIDATE` / …), approval is gold-amber, failure is deep red (not neon).

## Goals
- A judge understands the thesis in 20–30 seconds without reading the README.
- WebMCP is load-bearing: removing `registerTool` would break the agent path.
- One memorable demo moment: checkout pauses on **HUMAN APPROVAL REQUIRED**; Reject means the machine never runs.
- Learner walks away with a real WebMCP integration and a real harness pipeline, not a chatbot wrapper.

## What "Done" Looks Like
A public Vercel URL + public GitHub repo with an OSI license. Live app: luxury three-column shell (Model | Harness | Machine), five tools registered, full Inspect→Validate→Authorize→Execute→Verify pipeline, checkout approval bound to exact arguments, live trace + real metrics, at least one safe failure path (invalid input / timeout / verification miss), simulated purchase (no real card). Demo video < 3 minutes. English README with Chrome flag + ChatGPT browser test steps.

Time box: WebMCP Challenge window (~10 days), not a 3-hour classroom build. MVP is the `PROJECT.md` definition of done, not a toy.

## What's Explicitly Cut
- Multi-agent frameworks, MCP server marketplaces, n8n-style builders, browser-automation platforms.
- Blockchain, MemWal, Walrus, RAG, vector DBs.
- Full e-commerce (payments, inventory, accounts, tax).
- Enterprise policy engines, OpenTelemetry-as-product, Postgres/KV unless the demo actually needs them.
- Extra tools (`remove_from_cart`, `get_cart`) unless a verification hole appears during build.
- Declarative HTML `toolname` API — imperative `registerTool` only, so the harness stays the single execution path.

## Loose Implementation Notes
Next.js App Router + TypeScript + Tailwind. Thin `registerTool` wrappers call `harness.run(name, input)`. Zod validates inside the harness. In-memory catalog/cart/session. A **Simulate agent** panel on the Model column invokes the same `harness.run` path so judges without a WebMCP client still see the product. Feature-detect `document.modelContext`; show a clear unsupported banner, do not fake registration.
