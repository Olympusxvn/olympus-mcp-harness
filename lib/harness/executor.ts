import { harnessError } from "./errors";
import type { HarnessContext, HarnessError, HarnessTool } from "./types";

const DEFAULT_TIMEOUT_MS = 4000;

export async function executeWithTimeout<I, O>(
  tool: HarnessTool<I, O>,
  input: I,
  context: HarnessContext,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  external?: AbortSignal,
): Promise<{ ok: true; data: O } | { ok: false; error: HarnessError }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  external?.addEventListener("abort", onExternalAbort);

  try {
    const data = await Promise.race([
      tool.execute(input, {
        ...context,
        metadata: { ...context.metadata, signal: controller.signal },
      }),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener("abort", () => {
          reject(Object.assign(new Error("EXECUTION_TIMEOUT"), { code: "TIMEOUT" }));
        });
      }),
    ]);
    return { ok: true, data };
  } catch (error) {
    if (controller.signal.aborted) {
      return {
        ok: false,
        error: harnessError(
          "EXECUTION_TIMEOUT",
          `${tool.name} timed out after ${timeoutMs}ms`,
          true,
          { timeoutMs },
        ),
      };
    }
    const message = error instanceof Error ? error.message : "Execution failed";
    return {
      ok: false,
      error: harnessError("EXECUTION_FAILED", message, false),
    };
  } finally {
    clearTimeout(timer);
    external?.removeEventListener("abort", onExternalAbort);
  }
}
