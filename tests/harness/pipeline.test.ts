import { describe, expect, it } from "vitest";

import { PRODUCTS } from "@/lib/demo/products";
import { Harness } from "@/lib/harness/runtime";
import { ToolRegistry } from "@/lib/harness/registry";
import { TraceLog } from "@/lib/harness/trace";
import type { HarnessContext, HarnessTool } from "@/lib/harness/types";
import { TOOL_INPUT_SCHEMAS } from "@/lib/webmcp/toolSchemas";

function searchTool(delayMs = 0): HarnessTool {
  return {
    name: "search_products",
    description: "Search products",
    risk: "low",
    requiresApproval: false,
    inputSchema: TOOL_INPUT_SCHEMAS.search_products,
    async execute(input: unknown, _ctx: HarnessContext) {
      if (delayMs) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      const { query, maxPrice } = input as { query: string; maxPrice?: number };
      const needle = query.toLowerCase();
      return PRODUCTS.filter((product) => {
        const hay = `${product.name} ${product.blurb}`.toLowerCase();
        const textMatch = hay.includes(needle) || needle.includes("laptop");
        const priceMatch = maxPrice == null || product.price <= maxPrice;
        return textMatch && priceMatch;
      });
    },
  };
}

describe("harness.run pipeline", () => {
  it("returns ok envelope with traceId for valid search_products", async () => {
    const registry = new ToolRegistry();
    const traces = new TraceLog();
    registry.register(searchTool());
    const harness = new Harness(registry, traces);

    const result = await harness.run("search_products", {
      query: "laptop",
      maxPrice: 1500,
    });

    expect(result.ok).toBe(true);
    expect(result.tool).toBe("search_products");
    expect(result.traceId).toMatch(/./);
    expect(result.verification.passed).toBe(true);
    expect(result.verification.checks.length).toBeGreaterThan(0);
    expect(Array.isArray(result.data)).toBe(true);
    expect((result.data as unknown[]).length).toBeGreaterThan(0);

    const events = traces.forTrace(result.traceId);
    expect(events.map((event) => event.stage)).toEqual(
      expect.arrayContaining([
        "discover",
        "validate",
        "authorize",
        "execute",
        "verify",
        "complete",
      ]),
    );
  });

  it("returns TOOL_NOT_FOUND without executing", async () => {
    const harness = new Harness(new ToolRegistry(), new TraceLog());
    const result = await harness.run("nope", { query: "x" });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("TOOL_NOT_FOUND");
  });

  it("returns INVALID_INPUT for empty query", async () => {
    const registry = new ToolRegistry();
    registry.register(searchTool());
    const harness = new Harness(registry, new TraceLog());
    const result = await harness.run("search_products", { query: "  " });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("INVALID_INPUT");
  });

  it("returns EXECUTION_TIMEOUT when the tool exceeds the budget", async () => {
    const registry = new ToolRegistry();
    registry.register(searchTool(80));
    const harness = new Harness(registry, new TraceLog(), 20);
    const result = await harness.run("search_products", { query: "laptop" });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("EXECUTION_TIMEOUT");
  });
});
