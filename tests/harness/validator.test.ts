import { describe, expect, it } from "vitest";

import { ToolRegistry } from "@/lib/harness/registry";
import type { HarnessContext, HarnessTool } from "@/lib/harness/types";
import { validateInput } from "@/lib/harness/validator";

const stub: HarnessTool = {
  name: "search_products",
  description: "stub",
  risk: "low",
  requiresApproval: false,
  inputSchema: {},
  async execute(_input: unknown, _ctx: HarnessContext) {
    return [];
  },
};

describe("registry", () => {
  it("returns TOOL_NOT_FOUND for an unknown tool", () => {
    const registry = new ToolRegistry();
    registry.register(stub);
    const result = registry.resolve("not_a_tool");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TOOL_NOT_FOUND");
      expect(result.error.retryable).toBe(false);
    }
  });

  it("resolves a registered tool", () => {
    const registry = new ToolRegistry();
    registry.register(stub);
    const result = registry.resolve("search_products");
    expect(result.ok).toBe(true);
  });
});

describe("validator", () => {
  it("rejects empty search query as INVALID_INPUT", () => {
    const result = validateInput("search_products", { query: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_INPUT");
      expect(result.error.retryable).toBe(false);
    }
  });

  it("rejects missing search query as INVALID_INPUT", () => {
    const result = validateInput("search_products", { maxPrice: 1500 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_INPUT");
    }
  });

  it("rejects non-numeric maxPrice as INVALID_INPUT", () => {
    const result = validateInput("search_products", {
      query: "laptop",
      maxPrice: "cheap",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_INPUT");
    }
  });

  it("normalizes a valid search query", () => {
    const result = validateInput("search_products", {
      query: "  laptop  ",
      maxPrice: 1500,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ query: "laptop", maxPrice: 1500 });
    }
  });

  it("rejects compare with one id as INVALID_INPUT", () => {
    const result = validateInput("compare_products", { ids: ["atlas-15"] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_INPUT");
    }
  });

  it("rejects add_to_cart with qty 0 as INVALID_INPUT", () => {
    const result = validateInput("add_to_cart", {
      productId: "atlas-15",
      qty: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_INPUT");
    }
  });
});
