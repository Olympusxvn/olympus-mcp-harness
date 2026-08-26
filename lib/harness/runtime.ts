import { harnessError } from "./errors";
import { executeWithTimeout } from "./executor";
import { getPolicy, mayRetry } from "./policy";
import type { ToolRegistry } from "./registry";
import { registry } from "./registry";
import type { TraceLog } from "./trace";
import { traces } from "./trace";
import type {
  HarnessContext,
  HarnessResult,
  ToolName,
  TraceEvent,
} from "./types";
import { validateInput } from "./validator";
import { verifyOutput } from "./verifier";

const EMPTY_VERIFICATION = { passed: false, checks: ["not executed"] };

export class Harness {
  constructor(
    private readonly registry: ToolRegistry,
    private readonly traces: TraceLog,
    private readonly timeoutMs = 4000,
  ) {}

  async run(
    toolName: string,
    input: unknown,
    options?: { sessionId?: string; signal?: AbortSignal },
  ): Promise<HarnessResult> {
    const startedAt = Date.now();
    const traceId = createTraceId();
    const sessionId = options?.sessionId ?? "session";
    const context: HarnessContext = {
      traceId,
      sessionId,
      startedAt,
    };

    const fail = (
      error: HarnessResult["error"],
      stage: TraceEvent["stage"],
      message: string,
    ): HarnessResult => {
      this.traces.append({
        traceId,
        stage,
        tool: toolName,
        status: "error",
        message,
      });
      this.traces.append({
        traceId,
        stage: "complete",
        tool: toolName,
        status: "error",
        message: error?.code ?? "error",
        durationMs: Date.now() - startedAt,
      });
      return {
        ok: false,
        tool: toolName,
        error,
        verification: EMPTY_VERIFICATION,
        traceId,
        durationMs: Date.now() - startedAt,
      };
    };

    this.traces.append({
      traceId,
      stage: "discover",
      tool: toolName,
      status: "start",
      message: `resolve ${toolName}`,
    });

    const resolved = this.registry.resolve(toolName);
    if (!resolved.ok) {
      return fail(resolved.error, "discover", resolved.error.message);
    }

    const tool = resolved.tool;
    this.traces.append({
      traceId,
      stage: "discover",
      tool: toolName,
      status: "success",
      message: `risk ${tool.risk}`,
      metadata: { risk: tool.risk },
    });

    this.traces.append({
      traceId,
      stage: "validate",
      tool: toolName,
      status: "start",
      message: "schema",
    });

    const validated = validateInput(toolName, input);
    if (!validated.ok) {
      return fail(validated.error, "validate", validated.error.message);
    }

    this.traces.append({
      traceId,
      stage: "validate",
      tool: toolName,
      status: "success",
      message: "input OK",
    });

    const policy = getPolicy(validated.tool);
    this.traces.append({
      traceId,
      stage: "authorize",
      tool: toolName,
      status: "start",
      message: "policy",
    });

    if (policy.requiresApproval) {
      const error = harnessError(
        "APPROVAL_REQUIRED",
        "High-risk action requires explicit human approval",
        false,
        { tool: toolName },
      );
      this.traces.append({
        traceId,
        stage: "authorize",
        tool: toolName,
        status: "warning",
        message: error.message,
      });
      return fail(error, "approval", error.message);
    }

    this.traces.append({
      traceId,
      stage: "authorize",
      tool: toolName,
      status: "success",
      message: `allowed / ${policy.risk} risk`,
    });

    const attempt = async () =>
      executeWithTimeout(
        tool,
        validated.value,
        context,
        this.timeoutMs,
        options?.signal,
      );

    this.traces.append({
      traceId,
      stage: "execute",
      tool: toolName,
      status: "start",
      message: `${toolName}()`,
    });

    let executed = await attempt();
    if (!executed.ok && executed.error.code === "EXECUTION_TIMEOUT" && mayRetry(validated.tool)) {
      this.traces.append({
        traceId,
        stage: "recover",
        tool: toolName,
        status: "warning",
        message: "retry after timeout",
      });
      executed = await attempt();
    }

    if (!executed.ok) {
      return fail(executed.error, "execute", executed.error.message);
    }

    this.traces.append({
      traceId,
      stage: "execute",
      tool: toolName,
      status: "success",
      message: "machine returned",
    });

    this.traces.append({
      traceId,
      stage: "verify",
      tool: toolName,
      status: "start",
      message: "result checks",
    });

    const verification = verifyOutput(validated.tool as ToolName, executed.data);
    if (!verification.passed) {
      const error = harnessError(
        "VERIFICATION_FAILED",
        "Result failed verification",
        false,
        { checks: verification.checks },
      );
      this.traces.append({
        traceId,
        stage: "verify",
        tool: toolName,
        status: "error",
        message: error.message,
      });
      this.traces.append({
        traceId,
        stage: "complete",
        tool: toolName,
        status: "error",
        message: "VERIFICATION_FAILED",
        durationMs: Date.now() - startedAt,
      });
      return {
        ok: false,
        tool: toolName,
        data: executed.data,
        error,
        verification,
        traceId,
        durationMs: Date.now() - startedAt,
      };
    }

    this.traces.append({
      traceId,
      stage: "verify",
      tool: toolName,
      status: "success",
      message: verification.checks.join("; "),
    });
    this.traces.append({
      traceId,
      stage: "complete",
      tool: toolName,
      status: "success",
      message: "ok",
      durationMs: Date.now() - startedAt,
    });

    return {
      ok: true,
      tool: toolName,
      data: executed.data,
      verification,
      traceId,
      durationMs: Date.now() - startedAt,
    };
  }
}

function createTraceId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export const harness = new Harness(registry, traces);
