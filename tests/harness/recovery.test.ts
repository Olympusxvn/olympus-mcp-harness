import { describe, expect, it, beforeEach } from "vitest";

import { getCart, resetCart } from "@/lib/demo/cart";
import { armSearchDelayOnce, resetFaults } from "@/lib/demo/faults";
import { createDemoTools } from "@/lib/demo/tools";
import { Harness } from "@/lib/harness/runtime";
import { ToolRegistry } from "@/lib/harness/registry";
import { TraceLog } from "@/lib/harness/trace";
import { mayRetry } from "@/lib/harness/policy";

describe("failure and recovery demo", () => {
  beforeEach(() => {
    resetCart();
    resetFaults();
  });

  it("does not retry checkout on timeout", () => {
    expect(mayRetry("checkout")).toBe(false);
    expect(mayRetry("search_products")).toBe(true);
  });

  it("leaves the cart unchanged after INVALID_INPUT search", async () => {
    const registry = new ToolRegistry();
    const traces = new TraceLog();
    for (const tool of createDemoTools()) registry.register(tool);
    const harness = new Harness(registry, traces);

    const added = await harness.run("add_to_cart", {
      productId: "atlas-15",
      qty: 1,
    });
    expect(added.ok).toBe(true);
    expect(getCart().total).toBe(1199);

    const bad = await harness.run("search_products", { query: "   " });
    expect(bad.ok).toBe(false);
    expect(bad.error?.code).toBe("INVALID_INPUT");
    expect(getCart().total).toBe(1199);
  });

  it("retries search once after an injected timeout and recovers", async () => {
    const registry = new ToolRegistry();
    const traces = new TraceLog();
    for (const tool of createDemoTools()) registry.register(tool);
    const harness = new Harness(registry, traces);

    armSearchDelayOnce(80);
    const result = await harness.run(
      "search_products",
      { query: "laptop for AI development", maxPrice: 1500 },
      { timeoutMs: 20 },
    );

    expect(result.ok).toBe(true);
    const stages = traces.forTrace(result.traceId).map((event) => event.stage);
    expect(stages).toContain("recover");
    expect(getCart().lines).toEqual([]);
  });
});
