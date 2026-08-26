import { describe, expect, it } from "vitest";

import { resetCart } from "@/lib/demo/cart";
import { createDemoTools } from "@/lib/demo/tools";
import { Harness } from "@/lib/harness/runtime";
import { ToolRegistry } from "@/lib/harness/registry";
import { TraceLog } from "@/lib/harness/trace";

function harnessWithDemoTools() {
  resetCart();
  const registry = new ToolRegistry();
  for (const tool of createDemoTools()) {
    registry.register(tool);
  }
  return new Harness(registry, new TraceLog());
}

describe("demo machine tools", () => {
  it("searches under $1500", async () => {
    const harness = harnessWithDemoTools();
    const result = await harness.run("search_products", {
      query: "laptop for AI development",
      maxPrice: 1500,
    });
    expect(result.ok).toBe(true);
    const rows = result.data as { price: number }[];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.price <= 1500)).toBe(true);
  });

  it("gets one product and adds it to the cart", async () => {
    const harness = harnessWithDemoTools();
    const got = await harness.run("get_product", { productId: "atlas-15" });
    expect(got.ok).toBe(true);
    const added = await harness.run("add_to_cart", {
      productId: "atlas-15",
      qty: 1,
    });
    expect(added.ok).toBe(true);
    expect(added.data).toMatchObject({
      total: 1199,
      lines: [{ productId: "atlas-15", qty: 1 }],
    });
  });

  it("compares three products", async () => {
    const harness = harnessWithDemoTools();
    const result = await harness.run("compare_products", {
      ids: ["helios-14", "atlas-15", "forge-16"],
    });
    expect(result.ok).toBe(true);
    expect((result.data as unknown[]).length).toBe(3);
  });
});
