"use client";

import { useDemoState } from "@/components/useDemoState";

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
        <ol className="mt-4 max-h-64 space-y-2 overflow-y-auto font-mono text-xs text-muted">
          {recent.map((event, index) => (
            <li key={`${event.traceId}-${event.timestamp}-${index}`}>
              <span className="text-foreground">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>{" "}
              {event.stage.padEnd(10, " ")} {event.tool ?? ""} {event.message}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
