# Olympus MCP Harness — Judge Testing Guide

Thank you for reviewing **Olympus MCP Harness**.

This guide provides a fast, repeatable way to verify the project in ChatGPT or Codex. The core workflow takes approximately **2–3 minutes**.

> **Live application:** https://olympus-mcp-harness.vercel.app/
>
> **Recommended test task:** `Find a laptop under $1,500 suitable for AI development.`

## What You Are Testing

Olympus MCP Harness is an execution-control layer behind WebMCP tools. It demonstrates how a web application can expose structured capabilities to an agent while keeping execution validated, policy-aware, observable, and subject to human approval for high-risk actions.

The demo exposes five WebMCP tools:

| Tool | Purpose | Risk level |
| --- | --- | --- |
| `search_products` | Search the laptop catalog using structured filters | Low |
| `get_product` | Retrieve details for one product | Low |
| `compare_products` | Compare selected laptops | Low |
| `add_to_cart` | Add a selected laptop to the cart | Medium |
| `checkout` | Prepare or execute the purchase flow | High — human approval required |

Every tool routes through the same Olympus execution pipeline:

`Inspect → Validate → Authorize → Execute → Verify → Recover → Trace`

## Quick Test A — ChatGPT In-App Browser

This is the recommended evaluation path and the environment used for native testing.

1. Open the [live application](https://olympus-mcp-harness.vercel.app/) in ChatGPT's in-app browser.
2. Confirm that the storefront loads and the Olympus execution panel is visible.
3. Ask ChatGPT:

   ```text
   Find a laptop under $1,500 suitable for AI development.
   Compare the best options and recommend one.
   ```

4. Observe ChatGPT discovering and invoking the site's WebMCP tools.
5. Inspect the Olympus panel while the task runs.

### Expected result

- ChatGPT discovers the structured WebMCP tools exposed by the page.
- `search_products`, `get_product`, and/or `compare_products` are invoked with structured arguments.
- Olympus validates the invocation and applies the relevant execution policy.
- Product results and a recommendation are returned to ChatGPT.
- The Olympus interface displays the execution stage, machine action, result, and trace.

### Optional cart test

Continue with:

```text
Add the recommended laptop to the cart, but do not complete checkout.
```

Expected result: `add_to_cart` is invoked, the cart is updated, and the action appears in the Olympus execution trace.

## Quick Test B — Codex

Use this path in a Codex environment that provides a WebMCP-capable browser integration.

1. Ask Codex to open the live application.
2. Use this prompt:

   ```text
   Open https://olympus-mcp-harness.vercel.app/ and use its WebMCP tools to find a laptop under $1,500 suitable for AI development. Compare the strongest options and recommend one. Do not check out.
   ```

3. Confirm that Codex uses the site's registered tools rather than relying only on page text or DOM interaction.
4. Review the execution trace in the Olympus interface.

### Expected result

The expected tool behavior is the same as the ChatGPT test: structured discovery and invocation, argument validation, policy authorization, execution, verification, and a visible trace.

> WebMCP availability can depend on the Codex host and browser build. If the current Codex environment does not expose page-registered WebMCP tools, use the ChatGPT test above or the live simulator described below. This host-level limitation does not prevent the application itself from loading.

## Human-Approval Test

Checkout is intentionally classified as a high-risk action.

After adding a product to the cart, try:

```text
Proceed to checkout, but stop before any irreversible action unless I explicitly approve it.
```

The intended Olympus behavior is:

1. The action is classified as high risk.
2. Automatic execution pauses.
3. A human-approval request is displayed.
4. Checkout cannot proceed until the user explicitly approves it.
5. Approval or rejection is recorded in the execution trace.

### Important client-security behavior

ChatGPT's browser security may block the `checkout` invocation before it reaches the Olympus approval layer. This is expected defense-in-depth behavior:

`Agent → Client/browser security → WebMCP → Olympus → Human approval → Machine action`

If the client blocks checkout, the earlier protection layer is functioning as designed. To inspect Olympus's own approval UI directly, use the approval scenario in the application's live simulator or a WebMCP-enabled Chrome environment that permits the invocation.

## Live Simulator Fallback

The application includes an in-page simulator so judges can inspect the harness stages even when a client prevents a high-risk call.

Use it to verify:

- schema and argument validation;
- risk classification and policy authorization;
- the non-skippable checkout approval gate;
- execution traces and stage transitions;
- result verification; and
- safe failure and recovery behavior.

The simulator demonstrates Olympus behavior only; the ChatGPT test remains the recommended path for verifying native WebMCP discovery and invocation.

## Pass Criteria

The evaluation passes when the following behaviors are observable:

- [ ] The live application opens without authentication.
- [ ] An agent discovers one or more registered WebMCP tools.
- [ ] Product search uses structured arguments.
- [ ] Results respect the `$1,500` budget constraint.
- [ ] The agent can retrieve or compare product details.
- [ ] Olympus displays a trace of the execution path.
- [ ] Invalid or disallowed execution does not silently proceed.
- [ ] Checkout requires explicit human approval when the invocation reaches Olympus.
- [ ] The project behaves consistently with the submitted demo and description.

## Troubleshooting

### The agent does not discover the tools

- Confirm that the page is open in ChatGPT's in-app browser or a WebMCP-enabled Chrome/Codex environment.
- Reload the page once, then repeat the recommended prompt.
- Confirm that browser or client support for WebMCP is enabled.
- Use the ChatGPT path if the current Codex host does not expose page-registered tools.

### Search returns no suitable laptop

- Use the exact budget phrasing: `under $1,500`.
- Start a new browser session and rerun the recommended task.
- Check that the application loaded completely before prompting the agent.

### Checkout is blocked before the approval dialog

This can be an independent browser/client security decision. Use the live simulator to inspect Olympus's approval flow. Do not treat an upstream client block as proof that Olympus attempted or completed checkout.

### The application or repository appears unavailable

Open the submitted live URL and public repository in a private/incognito window to rule out cached sessions or account-specific access.

## Scope and Evaluation Notes

- The storefront is a demonstration machine for a generic execution harness.
- Olympus is not another reasoning agent; the client/model reasons while Olympus governs execution behind the WebMCP boundary.
- The project does **not** claim unmeasured reliability improvements.
- Any future comparative benchmark must use fixed tasks and report results from repeatable evaluations.

## Evaluation Summary

**Product thesis:** The model reasons. WebMCP connects. Olympus controls. The machine executes.

**What to look for:** native WebMCP tool use, shared execution governance, visible traces, and a human-controlled boundary for consequential actions.
