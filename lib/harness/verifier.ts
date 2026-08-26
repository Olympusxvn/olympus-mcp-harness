import type { Product } from "@/lib/demo/products";

import type { ToolName, VerificationResult } from "./types";

function fail(checks: string[]): VerificationResult {
  return { passed: false, checks };
}

function ok(checks: string[]): VerificationResult {
  return { passed: true, checks };
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.name === "string" &&
    typeof row.price === "number" &&
    Number.isFinite(row.price) &&
    typeof row.blurb === "string"
  );
}

export function verifySearch(output: unknown): VerificationResult {
  const checks: string[] = [];
  if (!Array.isArray(output)) {
    return fail(["result is an array"]);
  }
  checks.push("result is an array");
  if (output.length > 50) {
    return fail([...checks, "result count is reasonable"]);
  }
  checks.push("result count is reasonable");
  for (const item of output) {
    if (!isProduct(item)) {
      return fail([...checks, "required product fields exist", "prices are numeric"]);
    }
  }
  checks.push("required product fields exist", "prices are numeric");
  return ok(checks);
}

export function verifyGetProduct(output: unknown): VerificationResult {
  if (!isProduct(output)) {
    return fail(["product has id, name, numeric price, blurb"]);
  }
  return ok(["product has id, name, numeric price, blurb"]);
}

export function verifyCompare(output: unknown): VerificationResult {
  if (!Array.isArray(output) || output.length < 2 || output.length > 3) {
    return fail(["compare returns 2–3 products"]);
  }
  if (!output.every(isProduct)) {
    return fail(["compare rows are valid products"]);
  }
  return ok(["compare returns 2–3 products", "compare rows are valid products"]);
}

export function verifyAddToCart(output: unknown): VerificationResult {
  if (!output || typeof output !== "object") {
    return fail(["cart payload is an object"]);
  }
  const cart = output as {
    lines?: unknown;
    total?: unknown;
  };
  if (!Array.isArray(cart.lines)) {
    return fail(["cart contains lines"]);
  }
  if (typeof cart.total !== "number" || !Number.isFinite(cart.total)) {
    return fail(["cart total is numeric"]);
  }
  const sum = cart.lines.reduce((acc: number, line: unknown) => {
    if (!line || typeof line !== "object") return acc;
    const row = line as { qty?: unknown; unitPrice?: unknown };
    if (typeof row.qty === "number" && typeof row.unitPrice === "number") {
      return acc + row.qty * row.unitPrice;
    }
    return acc;
  }, 0);
  if (Math.abs(sum - cart.total) > 0.01) {
    return fail(["cart total matches line items"]);
  }
  return ok(["cart contains lines", "cart total is numeric", "cart total matches line items"]);
}

export function verifyCheckout(output: unknown): VerificationResult {
  if (!output || typeof output !== "object") {
    return fail(["order is an object"]);
  }
  const order = output as Record<string, unknown>;
  if (typeof order.orderId !== "string" || !order.orderId) {
    return fail(["order ID exists"]);
  }
  if (typeof order.amount !== "number" || !Number.isFinite(order.amount)) {
    return fail(["final amount is numeric"]);
  }
  if (order.status !== "success") {
    return fail(["status indicates success"]);
  }
  return ok(["order ID exists", "final amount is numeric", "status indicates success"]);
}

export function verifyOutput(tool: ToolName, output: unknown): VerificationResult {
  switch (tool) {
    case "search_products":
      return verifySearch(output);
    case "get_product":
      return verifyGetProduct(output);
    case "compare_products":
      return verifyCompare(output);
    case "add_to_cart":
      return verifyAddToCart(output);
    case "checkout":
      return verifyCheckout(output);
  }
}
