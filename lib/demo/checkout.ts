import { getCart, resetCart, type CartLine, type CartSnapshot } from "./cart";
import { harnessError } from "@/lib/harness/errors";
import type { ApprovalBinding, HarnessError } from "@/lib/harness/types";

export type SimulatedOrder = {
  orderId: string;
  amount: number;
  status: "success";
  createdAt: number;
  simulated: true;
};

let lastOrder: SimulatedOrder | null = null;

export function canonicalCheckoutArgs(cart: CartSnapshot = getCart()): string {
  const lines = cart.lines
    .map((line) => ({
      productId: line.productId,
      qty: line.qty,
      unitPrice: line.unitPrice,
    }))
    .sort((a, b) => a.productId.localeCompare(b.productId));
  return JSON.stringify({ lines, total: cart.total });
}

export function bindCheckout():
  | { ok: true; binding: ApprovalBinding }
  | { ok: false; error: HarnessError } {
  const cart = getCart();
  if (cart.lines.length === 0) {
    return {
      ok: false,
      error: harnessError("INVALID_INPUT", "Cart is empty", false),
    };
  }
  return {
    ok: true,
    binding: {
      argsCanonical: canonicalCheckoutArgs(cart),
      amount: cart.total,
      lines: cart.lines.map(toApprovalLine),
    },
  };
}

export function createSimulatedOrder(amount: number): SimulatedOrder {
  const order: SimulatedOrder = {
    orderId: createOrderId(),
    amount,
    status: "success",
    createdAt: Date.now(),
    simulated: true,
  };
  lastOrder = order;
  resetCart();
  return order;
}

export function getLastOrder(): SimulatedOrder | null {
  return lastOrder;
}

export function resetOrders(): void {
  lastOrder = null;
}

function toApprovalLine(line: CartLine) {
  return {
    productId: line.productId,
    name: line.name,
    qty: line.qty,
    unitPrice: line.unitPrice,
  };
}

function createOrderId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `ord_${crypto.randomUUID()}`;
  }
  return `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
