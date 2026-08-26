import type { TraceEvent } from "./types";

export type HarnessMetrics = {
  toolCalls: number;
  successes: number;
  successRate: number | null;
  avgLatencyMs: number | null;
  approvals: number;
  rejects: number;
  validationFailures: number;
  verificationFailures: number;
};

export function foldMetrics(events: readonly TraceEvent[]): HarnessMetrics {
  const completes = events.filter((event) => event.stage === "complete");
  const toolCalls = completes.length;
  const successes = completes.filter((event) => event.status === "success").length;
  const durations = completes
    .map((event) => event.durationMs)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  return {
    toolCalls,
    successes,
    successRate: toolCalls === 0 ? null : successes / toolCalls,
    avgLatencyMs:
      durations.length === 0
        ? null
        : Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length),
    approvals: events.filter(
      (event) => event.stage === "approval" && event.status === "success",
    ).length,
    rejects: completes.filter((event) => event.message === "APPROVAL_REJECTED").length,
    validationFailures: completes.filter((event) => event.message === "INVALID_INPUT")
      .length,
    verificationFailures: completes.filter(
      (event) => event.message === "VERIFICATION_FAILED",
    ).length,
  };
}

export function formatSuccessRate(rate: number | null): string {
  if (rate == null) return "—";
  return `${Math.round(rate * 100)}%`;
}

export function formatLatency(ms: number | null): string {
  if (ms == null) return "—";
  return `${ms}ms`;
}
