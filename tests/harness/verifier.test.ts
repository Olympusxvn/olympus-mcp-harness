import { describe, expect, it, beforeEach } from "vitest";

import { getCart, resetCart } from "@/lib/demo/cart";
import { Harness } from "@/lib/harness/runtime";
import { ToolRegistry } from "@/lib/harness/registry";
import { TraceLog } from "@/lib/harness/trace";
import type { HarnessContext, HarnessTool } from "@/lib/harness/types";
import { TOOL_INPUT_SCHEMAS } from "@/lib/webmcp/toolSchemas";
import {
  verifyCheckout,
  verifyGetProduct,
  verifyOutput,
  verifySearch,
} from "@/lib/harness/verifier";

function brokenSearch(): HarnessTool {
  return {
    name: "search_products",
    description: "Returns a payload that fails verification",
    risk: "low",
    requiresApproval: false,
    inputSchema: TOOL_INPUT_SCHEMAS.search_products,
    async execute(_input: unknown, _ctx: HarnessContext) {
      return { not: "an array of products" };
    },
  };
}

describe("result verification", () => {
  beforeEach(() => {
    resetCart();
  });

  it("fails search when the machine returns a non-array", () => {
    const result = verifySearch({ not: "products" });
    expect(result.passed).toBe(false);
    expect(result.checks).toContain("result is an array");
  });

  it("fails get_product without a numeric price", () => {
    const result = verifyGetProduct({
      id: "atlas-15",
      name: "Atlas Book 15",
      price: "1199",
      blurb: "nope",
    });
    expect(result.passed).toBe(false);
  });

  it("fails checkout without an order id", () => {
    const result = verifyCheckout({
      amount: 1199,
      status: "success",
    });
    expect(result.passed).toBe(false);
    expect(result.checks).toContain("order ID exists");
  });

  it("routes VERIFICATION_FAILED through harness.run and leaves the cart alone", async () => {
    const registry = new ToolRegistry();
    const traces = new TraceLog();
    registry.register(brokenSearch());
    const harness = new Harness(registry, traces);

    const result = await harness.run("search_products", {
      query: "laptop for AI development",
      maxPrice: 1500,
    });

    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("VERIFICATION_FAILED");
    expect(result.verification.passed).toBe(false);
    expect(verifyOutput("search_products", { not: "array" }).passed).toBe(false);
    expect(getCart().lines).toEqual([]);

    const stages = traces.forTrace(result.traceId).map((event) => event.stage);
    expect(stages).toContain("verify");
    expect(stages).toContain("complete");
  });
});
