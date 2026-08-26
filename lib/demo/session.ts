import type { HarnessResult } from "@/lib/harness/types";
import type { Product } from "./products";
import { PRODUCTS } from "./products";

type SessionSnapshot = {
  lastResult: HarnessResult | null;
  lastDecision: string;
  catalog: Product[];
  compared: Product[];
  selected: Product | null;
};

const session: SessionSnapshot = {
  lastResult: null,
  lastDecision: "Waiting for agent or simulate path.",
  catalog: PRODUCTS,
  compared: [],
  selected: null,
};

const listeners = new Set<() => void>();
let version = 0;

export function subscribeDemo(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDemoVersion(): number {
  return version;
}

export function getDemoSnapshot(): SessionSnapshot {
  return {
    lastResult: session.lastResult,
    lastDecision: session.lastDecision,
    catalog: session.catalog,
    compared: session.compared,
    selected: session.selected,
  };
}

export function applyHarnessResult(result: HarnessResult): void {
  session.lastResult = result;
  if (!result.ok) {
    session.lastDecision = `${result.tool} → ${result.error?.code ?? "error"}`;
    emit();
    return;
  }

  session.lastDecision = `${result.tool} → ok`;
  if (result.tool === "search_products" && Array.isArray(result.data)) {
    session.catalog = result.data as Product[];
  }
  if (result.tool === "get_product" && result.data) {
    session.selected = result.data as Product;
  }
  if (result.tool === "compare_products" && Array.isArray(result.data)) {
    session.compared = result.data as Product[];
  }
  emit();
}

function emit(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}
