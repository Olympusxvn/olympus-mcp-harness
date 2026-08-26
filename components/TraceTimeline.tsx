"use client";

import { useDemoState } from "@/components/useDemoState";
import type { TraceEvent } from "@/lib/harness/types";

export function TraceTimeline() {
  const { events } = useDemoState();
  const recent = events.slice(-24).reverse();

  return (
    <section
      id="trace"
      className="luxe-glass luxe-glass-strong p-5 sm:p-6"
      aria-labelledby="trace-heading"
    >
      <p className="luxe-eyebrow">Observability</p>
      <h2 id="trace-heading" className="luxe-display mt-2 text-xl">
        Execution trace
      </h2>
      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          No events yet. Simulate a search to append real timestamps.
        </p>
      ) : (
        <ol className="mt-4 max-h-64 space-y-2 overflow-y-auto font-mono text-xs">
          {recent.map((event, index) => (
            <li
              key={`${event.traceId}-${event.timestamp}-${index}`}
              style={{ color: statusColor(event.status) }}
            >
              <span className="text-foreground">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>{" "}
              <span className="uppercase tracking-wide">{event.stage}</span>{" "}
              {event.tool ?? ""} {event.message}
              {typeof event.durationMs === "number" ? ` · ${event.durationMs}ms` : ""}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function statusColor(status: TraceEvent["status"]): string {
  if (status === "error") return "var(--fail)";
  if (status === "warning") return "var(--approval)";
  if (status === "success") return "var(--text-gold)";
  return "var(--text-muted)";
}
