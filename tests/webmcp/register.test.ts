import { describe, expect, it, vi, afterEach } from "vitest";

import { detectWebmcp, getModelContext } from "@/lib/webmcp/detect";
import {
  registerWebmcpTools,
  toAgentPayload,
  webmcpToolDefinitions,
} from "@/lib/webmcp/registerTools";
import type { HarnessResult } from "@/lib/harness/types";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("detectWebmcp", () => {
  it("reports unsupported when modelContext is missing", () => {
    expect(detectWebmcp()).toEqual({ supported: false });
    expect(getModelContext()).toBeUndefined();
  });

  it("reports supported when document.modelContext.registerTool exists", () => {
    vi.stubGlobal("document", {
      modelContext: {
        registerTool: async () => undefined,
        getTools: async () => [],
      },
    });
    expect(detectWebmcp()).toEqual({ supported: true });
  });
});

describe("webmcp tool wrappers", () => {
  it("defines five tools with the correct readOnlyHint annotations", () => {
    const defs = webmcpToolDefinitions();
    expect(defs.map((tool) => tool.name)).toEqual([
      "search_products",
      "get_product",
      "compare_products",
      "add_to_cart",
      "checkout",
    ]);
    expect(defs[0]?.annotations?.readOnlyHint).toBe(true);
    expect(defs[1]?.annotations?.readOnlyHint).toBe(true);
    expect(defs[2]?.annotations?.readOnlyHint).toBe(true);
    expect(defs[3]?.annotations?.readOnlyHint).toBe(false);
    expect(defs[4]?.annotations?.readOnlyHint).toBe(false);
  });

  it("returns an agent payload without error details internals", () => {
    const result: HarnessResult = {
      ok: false,
      tool: "search_products",
      error: {
        code: "INVALID_INPUT",
        message: "query must not be empty",
        retryable: false,
        details: { stack: "secret", issues: [{ path: "query" }] },
      },
      verification: { passed: false, checks: ["not executed"] },
      traceId: "tr_test",
      durationMs: 3,
    };
    const payload = toAgentPayload(result);
    expect(payload.message).toBe("search_products failed: INVALID_INPUT");
    expect(payload.envelope).not.toContain("secret");
    expect(payload.envelope).not.toContain("issues");
    const parsed = JSON.parse(payload.envelope) as {
      error?: { code: string; details?: unknown };
    };
    expect(parsed.error?.code).toBe("INVALID_INPUT");
    expect(parsed.error?.details).toBeUndefined();
  });

  it("does not register when WebMCP is missing", async () => {
    const { registered } = await registerWebmcpTools(new AbortController().signal);
    expect(registered).toBe(0);
  });

  it("registers five tools and passes the AbortSignal", async () => {
    const registerTool = vi.fn(async () => undefined);
    const getTools = vi.fn(async () =>
      webmcpToolDefinitions().map((tool) => ({
        name: tool.name,
        title: tool.title ?? tool.name,
        description: tool.description,
        window: {} as Window,
        origin: "http://localhost:3000",
      })),
    );
    vi.stubGlobal("document", {
      modelContext: { registerTool, getTools },
    });
    const controller = new AbortController();
    const { registered } = await registerWebmcpTools(controller.signal);
    expect(registerTool).toHaveBeenCalledTimes(5);
    expect(registerTool.mock.calls[0]?.[1]).toEqual({ signal: controller.signal });
    expect(registered).toBe(5);
  });

  it("treats duplicate-registration errors as already registered", async () => {
    const registerTool = vi.fn(async () => {
      throw new Error("Tool already registered");
    });
    vi.stubGlobal("document", {
      modelContext: {
        registerTool,
        getTools: async () => [],
      },
    });
    const { registered } = await registerWebmcpTools(new AbortController().signal);
    expect(registered).toBe(5);
  });
});
