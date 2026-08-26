import { applyHarnessResult } from "@/lib/demo/session";
import { registerDemoTools } from "@/lib/demo/tools";
import { harness } from "@/lib/harness/runtime";
import type { HarnessResult, ToolName } from "@/lib/harness/types";
import { TOOL_NAMES } from "@/lib/harness/types";
import { getModelContext } from "./detect";
import { TOOL_INPUT_SCHEMAS } from "./toolSchemas";

const READ_ONLY: Record<ToolName, boolean> = {
  search_products: true,
  get_product: true,
  compare_products: true,
  add_to_cart: false,
  checkout: false,
};

const TOOL_META: Record<
  ToolName,
  { title: string; description: string }
> = {
  search_products: {
    title: "Search products",
    description:
      "Search the laptop catalog by phrase and optional maxPrice in USD. Returns id, name, numeric price, and blurb.",
  },
  get_product: {
    title: "Get product",
    description: "Get one catalog product by id (for example atlas-15).",
  },
  compare_products: {
    title: "Compare products",
    description: "Compare two or three products by id. Pass unique ids.",
  },
  add_to_cart: {
    title: "Add to cart",
    description: "Add a catalog product to the cart. Medium risk; no human approval.",
  },
  checkout: {
    title: "Checkout",
    description:
      "Checkout the current cart. High risk: the page asks a human to approve. Simulated order — no real charge.",
  },
};

export type AgentPayload = {
  message: string;
  envelope: string;
};

export function toAgentPayload(result: HarnessResult): AgentPayload {
  const error = result.error
    ? {
        code: result.error.code,
        message: result.error.message,
        retryable: result.error.retryable,
      }
    : undefined;

  const envelope = {
    ok: result.ok,
    tool: result.tool,
    data: result.data,
    error,
    verification: result.verification,
    traceId: result.traceId,
    durationMs: result.durationMs,
  };

  return {
    message: result.ok
      ? `${result.tool} succeeded`
      : `${result.tool} failed: ${result.error?.code ?? "error"}`,
    envelope: JSON.stringify(envelope),
  };
}

export async function executeWebmcpTool(
  name: string,
  input: unknown,
  signal?: AbortSignal,
): Promise<AgentPayload> {
  registerDemoTools();
  const result = await harness.run(name, input, { signal });
  applyHarnessResult(result);
  return toAgentPayload(result);
}

export function webmcpToolDefinitions(): WebMCP.ModelContextTool[] {
  return TOOL_NAMES.map((name) => {
    const meta = TOOL_META[name];
    return {
      name,
      title: meta.title,
      description: meta.description,
      inputSchema: cloneSchema(TOOL_INPUT_SCHEMAS[name]),
      annotations: { readOnlyHint: READ_ONLY[name] },
      execute: (input, { signal }) => executeWebmcpTool(name, input, signal),
    };
  });
}

export async function registerWebmcpTools(
  signal: AbortSignal,
): Promise<{ registered: number }> {
  if (signal.aborted) return { registered: 0 };

  const ctx = getModelContext();
  if (!ctx) return { registered: 0 };

  registerDemoTools();
  let registered = 0;

  for (const tool of webmcpToolDefinitions()) {
    if (signal.aborted) break;
    try {
      await ctx.registerTool(tool, { signal });
      registered += 1;
    } catch (error) {
      if (signal.aborted) break;
      if (isDuplicateRegistration(error)) {
        registered += 1;
        continue;
      }
      throw error;
    }
  }

  if (signal.aborted) return { registered: 0 };

  if (typeof ctx.getTools === "function") {
    try {
      const listed = await ctx.getTools();
      const names = new Set(TOOL_NAMES);
      const counted = listed.filter((tool) => names.has(tool.name as ToolName)).length;
      if (counted > 0) return { registered: counted };
    } catch {
      // Banner falls back to the register loop count.
    }
  }

  return { registered };
}

function cloneSchema(schema: object): object {
  return JSON.parse(JSON.stringify(schema)) as object;
}

function isDuplicateRegistration(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const name = error instanceof Error ? error.name : "";
  return /already|duplicate|registered/i.test(`${name} ${message}`);
}
