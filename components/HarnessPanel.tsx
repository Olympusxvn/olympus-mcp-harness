"use client";

import { useDemoState } from "@/components/useDemoState";

const STAGES = [
  "discover",
  "validate",
  "authorize",
  "approval",
  "execute",
  "verify",
] as const;

export function HarnessPanel() {
  const { events } = useDemoState();
  const last = events.at(-1);
  const current = last && last.stage !== "complete" ? last.stage : last?.stage;

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
        {current
          ? `${current}${last?.tool ? ` · ${last.tool}` : ""}`
          : "Idle — no invocation yet."}
      </p>
      <ol className="mt-4 flex flex-wrap gap-2">
        {STAGES.map((stage) => (
          <li
            key={stage}
            className={`luxe-chip text-xs capitalize ${
              current === stage ? "luxe-chip-gold" : ""
            }`}
            style={
              stage === "approval" && current === "approval"
                ? { borderColor: "var(--approval)", color: "var(--approval)" }
                : undefined
            }
          >
            {stage}
          </li>
        ))}
      </ol>
    </section>
  );
}
