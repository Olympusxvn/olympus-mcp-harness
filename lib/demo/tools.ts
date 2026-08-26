import { addToCart } from "./cart";
import {
  compareProducts,
  getProductById,
  searchProducts,
} from "./products";
import { getPolicy } from "@/lib/harness/policy";
import { registry, ToolRegistry } from "@/lib/harness/registry";
import type { HarnessTool } from "@/lib/harness/types";
import { TOOL_INPUT_SCHEMAS } from "@/lib/webmcp/toolSchemas";

export function createDemoTools(): HarnessTool[] {
  return [
    {
      name: "search_products",
      description: "Search products using structured criteria.",
      risk: getPolicy("search_products").risk,
      requiresApproval: getPolicy("search_products").requiresApproval,
      inputSchema: TOOL_INPUT_SCHEMAS.search_products,
      async execute(input) {
        const { query, maxPrice } = input as {
          query: string;
          maxPrice?: number;
        };
        return searchProducts(query, maxPrice);
      },
    },
    {
      name: "get_product",
      description: "Get one catalog product by id.",
      risk: getPolicy("get_product").risk,
      requiresApproval: getPolicy("get_product").requiresApproval,
      inputSchema: TOOL_INPUT_SCHEMAS.get_product,
      async execute(input) {
        const { productId } = input as { productId: string };
        const product = getProductById(productId);
        if (!product) {
          throw new Error(`Unknown product: ${productId}`);
        }
        return product;
      },
    },
    {
      name: "compare_products",
      description: "Compare two or three products by id.",
      risk: getPolicy("compare_products").risk,
      requiresApproval: getPolicy("compare_products").requiresApproval,
      inputSchema: TOOL_INPUT_SCHEMAS.compare_products,
      async execute(input) {
        const { ids } = input as { ids: string[] };
        return compareProducts(ids);
      },
    },
    {
      name: "add_to_cart",
      description: "Add a product to the cart.",
      risk: getPolicy("add_to_cart").risk,
      requiresApproval: getPolicy("add_to_cart").requiresApproval,
      inputSchema: TOOL_INPUT_SCHEMAS.add_to_cart,
      async execute(input) {
        const { productId, qty } = input as { productId: string; qty: number };
        return addToCart(productId, qty);
      },
    },
  ];
}

export function registerDemoTools(target: ToolRegistry = registry): void {
  for (const tool of createDemoTools()) {
    if (!target.get(tool.name)) {
      target.register(tool);
    }
  }
}
