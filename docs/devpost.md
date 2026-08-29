# Devpost — The WebMCP Challenge

Archive of the paste-ready copy. Submitted 29 Aug 2026; copy tightened 29 Aug 2026 for judging. **Do not rename the project.** Do not edit repo / live / Devpost after **3 Sep 2026 1:00pm PDT**.

## Software name

Olympus MCP Harness

## Tagline

Models are probabilistic. Execution shouldn't be.

Locked in-app tagline: *The model reasons. WebMCP connects. Olympus controls. The machine executes.*

## Who it's for (paste near the top of the pitch)

For developers exposing real actions to AI agents through WebMCP.

## Problem (paste)

WebMCP makes actions available to models. Olympus makes those actions safe to execute.

As WebMCP moves agents from reading websites to acting on them, execution becomes a trust boundary. Olympus engineers that boundary.

## Links

| | |
|:---|:---|
| Live | https://olympus-mcp-harness.vercel.app |
| GitHub | https://github.com/Olympusxvn/olympus-mcp-harness |
| License | MIT (`LICENSE`) |
| Challenge | https://webmcp.devpost.com/ |

No login. No API keys. Simulated checkout only.

## Built with

Next.js, React, TypeScript, WebMCP, Vercel, Zod, Tailwind CSS, Chrome

## Testing instructions (judges)

1. Open the live URL in **ChatGPT’s in-app browser** (WebMCP on by default) or Chrome 151+ with `chrome://flags/#enable-webmcp-testing` → Enabled → relaunch.
2. Optional Inspector: five tools — `search_products`, `get_product`, `compare_products`, `add_to_cart`, `checkout`.
3. Goal: *Find the best laptop under $1,500 for AI development and prepare it for purchase.*
4. Checkout pauses on **HUMAN APPROVAL REQUIRED**. Reject = no order.
5. Without WebMCP: Model-column **Simulate** buttons use the same `harness.run` path.

## Pitch (why WebMCP / UX / how)

Olympus is for **developers exposing real actions to AI agents through WebMCP**.

WebMCP makes actions available to models. Olympus makes those actions safe to execute.

As WebMCP moves agents from reading websites to acting on them, execution becomes a trust boundary. Olympus engineers that boundary.

WebMCP is the agent-to-web boundary (`registerTool` · discover · invoke). Olympus sits **behind** it: inspect, validate, authorize, execute, verify, trace. Discovery stays with WebMCP. The laptop catalog is a demo machine, not the product — the same runtime is:

```ts
await harness.run("tool_name", input);
getPolicy("tool_name");
// risk, requiresApproval, retryOnTimeout
```

The live page is Model | Harness | Machine. Checkout is high risk: human approval bound to exact cart lines and amount; no auto-retry. Thin `execute` wrappers call `harness.run`. Source: `lib/webmcp/registerTools.ts`, `lib/harness/runtime.ts`.

**Native ChatGPT test:** in-app browser discovered and invoked `search_products`, `get_product`, `compare_products`, `add_to_cart`. High-risk `checkout` was blocked by ChatGPT browser security before Olympus approval — defense in depth. When a client permits checkout, Olympus still requires HUMAN APPROVAL REQUIRED.

**Evals:** planned against Chrome WebMCP Evals methodology. No published success-rate until a run exists. In-app metrics fold from the live trace only.

Video script: `PROJECT.md` §22.
