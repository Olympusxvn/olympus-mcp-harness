import { z } from "zod";

import { harnessError } from "./errors";
import type { HarnessError, ToolName } from "./types";

const searchInput = z
  .object({
    query: z.string().transform((value) => value.trim()),
    maxPrice: z.number().finite().nonnegative().optional(),
  })
  .strict();

const getProductInput = z
  .object({
    productId: z.string().trim().min(1),
  })
  .strict();

const compareInput = z
  .object({
    ids: z.array(z.string().trim().min(1)).min(2).max(3),
  })
  .strict();

const addToCartInput = z
  .object({
    productId: z.string().trim().min(1),
    qty: z.coerce.number().int().positive(),
  })
  .strict();

const checkoutInput = z.object({}).strict();

const schemas = {
  search_products: searchInput,
  get_product: getProductInput,
  compare_products: compareInput,
  add_to_cart: addToCartInput,
  checkout: checkoutInput,
} as const;

export type ValidatedInput = {
  search_products: z.infer<typeof searchInput>;
  get_product: z.infer<typeof getProductInput>;
  compare_products: z.infer<typeof compareInput>;
  add_to_cart: z.infer<typeof addToCartInput>;
  checkout: z.infer<typeof checkoutInput>;
};

export function validateInput(
  tool: string,
  input: unknown,
):
  | { ok: true; tool: ToolName; value: unknown }
  | { ok: false; error: HarnessError } {
  if (!(tool in schemas)) {
    return {
      ok: false,
      error: harnessError("TOOL_NOT_FOUND", `Unknown tool: ${tool}`, false, {
        tool,
      }),
    };
  }

  const name = tool as ToolName;
  const parsed = schemas[name].safeParse(input ?? {});

  if (!parsed.success) {
    return {
      ok: false,
      error: harnessError(
        "INVALID_INPUT",
        parsed.error.issues[0]?.message ?? "Invalid input",
        false,
        { issues: parsed.error.issues },
      ),
    };
  }

  if (name === "search_products") {
    const value = parsed.data as ValidatedInput["search_products"];
    if (!value.query) {
      return {
        ok: false,
        error: harnessError("INVALID_INPUT", "query must not be empty", false),
      };
    }
  }

  if (name === "compare_products") {
    const value = parsed.data as ValidatedInput["compare_products"];
    const unique = new Set(value.ids);
    if (unique.size !== value.ids.length) {
      return {
        ok: false,
        error: harnessError(
          "INVALID_INPUT",
          "compare ids must be unique",
          false,
        ),
      };
    }
  }

  return { ok: true, tool: name, value: parsed.data };
}
