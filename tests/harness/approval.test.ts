import { describe, expect, it } from "vitest";

import { addToCart, getCart, resetCart } from "@/lib/demo/cart";
import { getLastOrder, resetOrders } from "@/lib/demo/checkout";
import { createDemoTools } from "@/lib/demo/tools";
import { ApprovalController } from "@/lib/harness/approval";
import { Harness } from "@/lib/harness/runtime";
import { ToolRegistry } from "@/lib/harness/registry";
import { TraceLog } from "@/lib/harness/trace";

function setup() {
  resetCart();
  resetOrders();
  const registry = new ToolRegistry();
  for (const tool of createDemoTools()) {
    registry.register(tool);
  }
  const traces = new TraceLog();
  const approval = new ApprovalController();
  const harness = new Harness(registry, traces, 4000, approval);
  return { harness, approval, traces };
}

describe("approval-gated checkout", () => {
  it("blocks empty cart without opening an approval gate", async () => {
    const { harness, approval } = setup();
    const result = await harness.run("checkout", {});
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("INVALID_INPUT");
    expect(approval.getPending()).toBeNull();
    expect(getLastOrder()).toBeNull();
  });

  it("rejects without creating an order", async () => {
    const { harness, approval } = setup();
    const added = await harness.run("add_to_cart", {
      productId: "atlas-15",
      qty: 1,
    });
    expect(added.ok).toBe(true);

    const pending = harness.run("checkout", {});
    expect(approval.getPending()?.amount).toBe(1199);
    expect(getLastOrder()).toBeNull();

    approval.reject();
    const result = await pending;
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("APPROVAL_REJECTED");
    expect(getLastOrder()).toBeNull();
    expect(getCart().total).toBe(1199);
  });

  it("approves and creates a simulated order matching the amount", async () => {
    const { harness, approval, traces } = setup();
    await harness.run("add_to_cart", { productId: "atlas-15", qty: 1 });

    const pending = harness.run("checkout", {});
    expect(approval.getPending()?.amount).toBe(1199);
    approval.approve();
    const result = await pending;

    expect(result.ok).toBe(true);
    expect(result.data).toMatchObject({
      amount: 1199,
      status: "success",
      simulated: true,
    });
    expect(getLastOrder()?.amount).toBe(1199);
    expect(getLastOrder()?.orderId).toMatch(/^ord_/);
    expect(getCart().lines).toEqual([]);

    const stages = traces.forTrace(result.traceId).map((event) => event.stage);
    expect(stages).toEqual(
      expect.arrayContaining(["authorize", "approval", "execute", "verify", "complete"]),
    );
  });

  it("invalidates approval when the cart changes before approve", async () => {
    const { harness, approval } = setup();
    await harness.run("add_to_cart", { productId: "atlas-15", qty: 1 });

    const pending = harness.run("checkout", {});
    expect(approval.getPending()?.amount).toBe(1199);

    addToCart("helios-14", 1);
    expect(approval.approve()).toBe(false);

    const result = await pending;
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("APPROVAL_REQUIRED");
    expect(getLastOrder()).toBeNull();
  });
});
