"use client";

import type { CSSProperties } from "react";

import { useDemoState } from "@/components/useDemoState";
import type { TraceEvent } from "@/lib/harness/types";

const STAGES = [
  "inspect",
  "validate",
  "authorize",
  "approval",
  "execute",
  "recover",
  "verify",
] as const;

export function HarnessPanel() {
  const { events } = useDemoState();
  const last = events.at(-1);
  const run = last ? events.filter((event) => event.traceId === last.traceId) : [];
  const active =
    last && last.stage !== "complete" ? last.stage : last?.stage;
  const seen = new Set(run.map((event) => event.stage));
  const errorStage = run.find((event) => event.status === "error")?.stage;

  return (
    <section
      className="luxe-glass luxe-glass-strong stage-harness flex min-h-[280px] flex-col p-5 sm:p-6"
      aria-labelledby="harness-heading"
    >
      <p className="luxe-eyebrow" style={{ color: "var(--harness)" }}>
        Harness
      </p>
      <h2 id="harness-heading" className="luxe-display mt-2 text-xl">
        Control
      </h2>
      <p className="mt-4 text-sm text-muted">Current stage</p>
      <p className="mt-1 text-sm text-foreground">
        {active
          ? `${active}${last?.tool ? ` · ${last.tool}` : ""}`
          : "Idle — no invocation yet."}
      </p>
      <ol className="mt-4 flex flex-wrap gap-2">
        {STAGES.map((stage) => (
          <li
            key={stage}
            className={`luxe-chip text-xs capitalize ${
              active === stage ? "luxe-chip-gold" : ""
            }`}
            style={chipStyle(stage, active, seen, errorStage)}
          >
            {stage}
          </li>
        ))}
      </ol>
    </section>
  );
}

function chipStyle(
  stage: (typeof STAGES)[number],
  active: string | undefined,
  seen: Set<TraceEvent["stage"]>,
  errorStage: TraceEvent["stage"] | undefined,
): CSSProperties | undefined {
  if (errorStage === stage) {
    return { borderColor: "var(--fail)", color: "var(--fail)" };
  }
  if (stage === "recover" && (active === "recover" || seen.has("recover"))) {
    return { borderColor: "var(--approval)", color: "var(--approval)" };
  }
  if (stage === "approval" && active === "approval") {
    return { borderColor: "var(--approval)", color: "var(--approval)" };
  }
  if (seen.has(stage) && active !== stage) {
    return { borderColor: "var(--gold-glow)", color: "var(--text-gold)" };
  }
  return undefined;
}
