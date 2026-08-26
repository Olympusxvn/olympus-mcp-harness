/** JSON Schema for WebMCP `inputSchema`. Keep in sync with Zod in validator.ts. */

export const searchProductsSchema = {
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "Natural-language product search. Pass the raw user phrase.",
    },
    maxPrice: {
      type: "number",
      description: "Optional maximum price in USD. Do not convert currency.",
    },
  },
  required: ["query"],
  additionalProperties: false,
} as const;

export const getProductSchema = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      description: "Catalog product id, e.g. atlas-15.",
    },
  },
  required: ["productId"],
  additionalProperties: false,
} as const;

export const compareProductsSchema = {
  type: "object",
  properties: {
    ids: {
      type: "array",
      description: "Two or three product ids to compare.",
      minItems: 2,
      maxItems: 3,
      items: { type: "string" },
    },
  },
  required: ["ids"],
  additionalProperties: false,
} as const;

export const addToCartSchema = {
  type: "object",
  properties: {
    productId: { type: "string", description: "Catalog product id to add." },
    qty: {
      type: "integer",
      description: "Positive integer quantity. Do not compute totals.",
      minimum: 1,
    },
  },
  required: ["productId", "qty"],
  additionalProperties: false,
} as const;

export const checkoutSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
  description: "Checkout the current cart. No extra arguments.",
} as const;

export const TOOL_INPUT_SCHEMAS = {
  search_products: searchProductsSchema,
  get_product: getProductSchema,
  compare_products: compareProductsSchema,
  add_to_cart: addToCartSchema,
  checkout: checkoutSchema,
} as const;
