"use client";

import { useState } from "react";

import { useDemoState, useSimulate } from "@/components/useDemoState";

const DEMO_GOAL =
  "Find the best laptop under $1,500 for AI development and prepare it for purchase.";

export function ModelPanel() {
  const { lastDecision, lastResult } = useDemoState();
  const simulate = useSimulate();
  const [busy, setBusy] = useState<string | null>(null);

  async function run(label: string, tool: string, input: unknown) {
    setBusy(label);
    try {
      await simulate(tool, input);
    } finally {
      setBusy(null);
    }
  }

  return (
    <section
      className="luxe-glass luxe-glass-strong stage-model flex min-h-[280px] flex-col p-5 sm:p-6"
      aria-labelledby="model-heading"
    >
      <p className="luxe-eyebrow" style={{ color: "var(--model)" }}>
        Model
      </p>
      <h2 id="model-heading" className="luxe-display mt-2 text-xl">
        Reason
      </h2>
      <p className="mt-4 text-sm text-muted">Intent</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{DEMO_GOAL}</p>
      <p className="mt-4 text-sm text-muted">Decision</p>
      <p className="mt-1 text-sm text-foreground">{lastDecision}</p>
      {lastResult ? (
        <p className="mt-2 text-xs text-muted">
          {lastResult.ok ? "ok" : lastResult.error?.code} · {lastResult.durationMs}ms
        </p>
      ) : null}
      <p className="mt-4 text-sm text-muted">Simulate agent</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-luxe-ghost px-3 py-1.5 text-xs"
          disabled={busy !== null}
          onClick={() =>
            run("search", "search_products", {
              query: "laptop for AI development",
              maxPrice: 1500,
            })
          }
        >
          {busy === "search" ? "…" : "Search ≤ $1,500"}
        </button>
        <button
          type="button"
          className="btn-luxe-ghost px-3 py-1.5 text-xs"
          disabled={busy !== null}
          onClick={() => run("get", "get_product", { productId: "atlas-15" })}
        >
          {busy === "get" ? "…" : "Get Atlas 15"}
        </button>
        <button
          type="button"
          className="btn-luxe-ghost px-3 py-1.5 text-xs"
          disabled={busy !== null}
          onClick={() =>
            run("compare", "compare_products", {
              ids: ["helios-14", "atlas-15", "forge-16"],
            })
          }
        >
          {busy === "compare" ? "…" : "Compare 3"}
        </button>
        <button
          type="button"
          className="btn-luxe-ghost px-3 py-1.5 text-xs"
          disabled={busy !== null && busy !== "checkout"}
          onClick={() =>
            run("cart", "add_to_cart", { productId: "atlas-15", qty: 1 })
          }
        >
          {busy === "cart" ? "…" : "Add Atlas to cart"}
        </button>
        <button
          type="button"
          className="btn-luxe px-3 py-1.5 text-xs"
          disabled={busy !== null}
          onClick={() => run("checkout", "checkout", {})}
        >
          {busy === "checkout" ? "…" : "Checkout"}
        </button>
      </div>
    </section>
  );
}
