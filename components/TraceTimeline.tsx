export function TraceTimeline() {
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
      <p className="mt-3 text-sm text-muted">
        No events yet. Invocations will append real timestamps here.
      </p>
    </section>
  );
}
