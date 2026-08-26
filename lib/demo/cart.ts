import { approvals } from "@/lib/harness/approval";

import { getProductById } from "./products";

export type CartLine = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type CartSnapshot = {
  lines: CartLine[];
  total: number;
};

const lines: CartLine[] = [];

export function getCart(): CartSnapshot {
  const snapshot = lines.map((line) => ({ ...line }));
  const total = snapshot.reduce((sum, line) => sum + line.qty * line.unitPrice, 0);
  return { lines: snapshot, total };
}

export function addToCart(productId: string, qty: number): CartSnapshot {
  const product = getProductById(productId);
  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }
  const existing = lines.find((line) => line.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    lines.push({
      productId,
      name: product.name,
      qty,
      unitPrice: product.price,
    });
  }
  approvals.invalidate();
  return getCart();
}

export function resetCart(): void {
  const hadItems = lines.length > 0;
  lines.length = 0;
  if (hadItems) {
    approvals.invalidate();
  }
}
