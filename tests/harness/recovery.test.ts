import { describe, expect, it, beforeEach } from "vitest";

import { ApprovalController } from "@/lib/harness/approval";
import { getCart, resetCart } from "@/lib/demo/cart";
import { getLastOrder, resetOrders } from "@/lib/demo/checkout";
import { armSearchDelayOnce, resetFaults } from "@/lib/demo/faults";
import { createDemoTools } from "@/lib/demo/tools";
import { Harness } from "@/lib/harness/runtime";
import { ToolRegistry } from "@/lib/harness/registry";
import { TraceLog } from "@/lib/harness/trace";
import { mayRetry } from "@/lib/harness/policy";

describe("failure and recovery demo", () => {
  beforeEach(() => {
    resetCart();
    resetOrders();
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

  it("does not auto-retry checkout after EXECUTION_TIMEOUT", async () => {
    const registry = new ToolRegistry();
    const traces = new TraceLog();
    const approval = new ApprovalController();
    let executeCount = 0;

    for (const tool of createDemoTools()) {
      if (tool.name !== "checkout") {
        registry.register(tool);
        continue;
      }
      registry.register({
        ...tool,
        async execute(input, context) {
          executeCount += 1;
          await new Promise((resolve) => setTimeout(resolve, 80));
          return tool.execute(input, context);
        },
      });
    }

    const harness = new Harness(registry, traces, 20, approval);
    await harness.run("add_to_cart", { productId: "atlas-15", qty: 1 });

    const pending = harness.run("checkout", {});
    approval.approve();
    const result = await pending;

    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("EXECUTION_TIMEOUT");
    expect(executeCount).toBe(1);
    expect(mayRetry("checkout")).toBe(false);
    expect(getLastOrder()).toBeNull();
    expect(getCart().total).toBe(1199);

    const stages = traces.forTrace(result.traceId).map((event) => event.stage);
    expect(stages).not.toContain("recover");
  });
});
