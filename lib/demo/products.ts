export type Product = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  attrs: Record<string, string>;
};

/** Seeded demo catalog. Prices are USD numbers. At least three SKUs under $1500. */
export const PRODUCTS: Product[] = [
  {
    id: "helios-14",
    name: "Helios 14 Nano",
    price: 1299,
    blurb: "32GB RAM, RTX 4050 — compact box for local LLM experiments.",
    attrs: { ram: "32GB", gpu: "RTX 4050", display: "14-inch OLED" },
  },
  {
    id: "atlas-15",
    name: "Atlas Book 15",
    price: 1199,
    blurb: "32GB RAM, RTX 4060 laptop GPU — the default under-$1500 pick.",
    attrs: { ram: "32GB", gpu: "RTX 4060", display: "15.6-inch 165Hz" },
  },
  {
    id: "forge-16",
    name: "Forge 16 Air",
    price: 1399,
    blurb: "64GB unified-ish kit, RTX 4070 — training-adjacent workloads.",
    attrs: { ram: "64GB", gpu: "RTX 4070", display: "16-inch 240Hz" },
  },
  {
    id: "pulse-13",
    name: "Pulse 13",
    price: 999,
    blurb: "16GB RAM, RTX 3050 — budget inference, not training.",
    attrs: { ram: "16GB", gpu: "RTX 3050", display: "13.3-inch" },
  },
  {
    id: "nova-studio",
    name: "Nova Studio 14",
    price: 1449,
    blurb: "48GB RAM, RTX 4060 — quiet chassis for long compile + inference.",
    attrs: { ram: "48GB", gpu: "RTX 4060", display: "14-inch mini-LED" },
  },
  {
    id: "quanta-15",
    name: "Quanta 15",
    price: 1349,
    blurb: "32GB RAM, RTX 4070 — thermals tuned for sustained CUDA.",
    attrs: { ram: "32GB", gpu: "RTX 4070", display: "15.6-inch QHD" },
  },
  {
    id: "coreframe-14",
    name: "CoreFrame 14",
    price: 1099,
    blurb: "32GB RAM, RTX 4050 — Linux-friendly firmware, under budget.",
    attrs: { ram: "32GB", gpu: "RTX 4050", display: "14-inch 120Hz" },
  },
  {
    id: "ember-mini",
    name: "Ember Mini",
    price: 899,
    blurb: "16GB RAM, iGPU + optional eGPU path — light demos only.",
    attrs: { ram: "16GB", gpu: "iGPU", display: "13-inch" },
  },
  {
    id: "orion-pro",
    name: "Orion Pro 16",
    price: 1699,
    blurb: "64GB RAM, RTX 4080 — over the $1,500 demo cap on purpose.",
    attrs: { ram: "64GB", gpu: "RTX 4080", display: "16-inch OLED" },
  },
  {
    id: "vertex-ultra",
    name: "Vertex Ultra",
    price: 1899,
    blurb: "96GB RAM, RTX 4090 laptop — overkill, over budget.",
    attrs: { ram: "96GB", gpu: "RTX 4090", display: "16-inch mini-LED" },
  },
  {
    id: "titan-18",
    name: "Titan 18 Max",
    price: 2499,
    blurb: "Desktop replacement. Not a $1,500 candidate.",
    attrs: { ram: "64GB", gpu: "RTX 4090", display: "18-inch" },
  },
  {
    id: "aether-16",
    name: "Aether 16",
    price: 2199,
    blurb: "Creator SKU with 48GB RAM — above the demo budget line.",
    attrs: { ram: "48GB", gpu: "RTX 4080", display: "16-inch 4K" },
  },
];

export function formatUsd(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === productId);
}

export function searchProducts(query: string, maxPrice?: number): Product[] {
  const needle = query.toLowerCase();
  const generic = /laptop|notebook|ai|dev/.test(needle);
  return PRODUCTS.filter((product) => {
    const hay =
      `${product.name} ${product.blurb} ${product.attrs.ram} ${product.attrs.gpu}`.toLowerCase();
    const textMatch =
      generic ||
      hay.includes(needle) ||
      needle.split(/\s+/).some((word) => word.length > 2 && hay.includes(word));
    const priceMatch = maxPrice == null || product.price <= maxPrice;
    return textMatch && priceMatch;
  });
}

export function compareProducts(ids: string[]): Product[] {
  return ids.map((id) => {
    const product = getProductById(id);
    if (!product) {
      throw new Error(`Unknown product: ${id}`);
    }
    return product;
  });
}
