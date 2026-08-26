import { describe, expect, it } from "vitest";

import { foldMetrics, formatSuccessRate } from "@/lib/harness/metrics";
import type { TraceEvent } from "@/lib/harness/types";

function event(
  partial: Pick<TraceEvent, "stage" | "status" | "message"> &
    Partial<TraceEvent>,
): TraceEvent {
  return {
    traceId: partial.traceId ?? "tr_1",
    timestamp: partial.timestamp ?? 1,
    tool: partial.tool ?? "search_products",
    durationMs: partial.durationMs,
    ...partial,
  };
}

describe("foldMetrics", () => {
  it("returns null rates when there are no complete events", () => {
    const metrics = foldMetrics([
      event({ stage: "inspect", status: "start", message: "inspect" }),
    ]);
    expect(metrics.toolCalls).toBe(0);
    expect(metrics.successRate).toBeNull();
    expect(formatSuccessRate(metrics.successRate)).toBe("—");
    expect(metrics.avgLatencyMs).toBeNull();
  });

  it("folds success then INVALID_INPUT from complete events", () => {
    const metrics = foldMetrics([
      event({
        stage: "complete",
        status: "success",
        message: "ok",
        durationMs: 10,
        traceId: "a",
      }),
      event({
        stage: "complete",
        status: "error",
        message: "INVALID_INPUT",
        durationMs: 4,
        traceId: "b",
      }),
    ]);
    expect(metrics.toolCalls).toBe(2);
    expect(metrics.successes).toBe(1);
    expect(metrics.successRate).toBe(0.5);
    expect(metrics.avgLatencyMs).toBe(7);
    expect(metrics.validationFailures).toBe(1);
    expect(metrics.verificationFailures).toBe(0);
  });

  it("counts approvals and rejects from the same log", () => {
    const metrics = foldMetrics([
      event({
        stage: "approval",
        status: "success",
        message: "approved",
        tool: "checkout",
        traceId: "c",
      }),
      event({
        stage: "complete",
        status: "success",
        message: "ok",
        tool: "checkout",
        durationMs: 20,
        traceId: "c",
      }),
      event({
        stage: "complete",
        status: "error",
        message: "APPROVAL_REJECTED",
        tool: "checkout",
        durationMs: 8,
        traceId: "d",
      }),
    ]);
    expect(metrics.approvals).toBe(1);
    expect(metrics.rejects).toBe(1);
    expect(metrics.toolCalls).toBe(2);
  });
});
