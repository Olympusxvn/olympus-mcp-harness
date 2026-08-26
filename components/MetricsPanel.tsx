export function MetricsPanel() {
  return (
    <section className="luxe-glass p-5 sm:p-6" aria-labelledby="metrics-heading">
      <h2 id="metrics-heading" className="luxe-eyebrow">
        Metrics
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">Success</dt>
          <dd className="mt-1 text-foreground">—</dd>
        </div>
        <div>
          <dt className="text-muted">Avg latency</dt>
          <dd className="mt-1 text-foreground">—</dd>
        </div>
        <div>
          <dt className="text-muted">Tool calls</dt>
          <dd className="mt-1 text-foreground">0</dd>
        </div>
        <div>
          <dt className="text-muted">Approvals</dt>
          <dd className="mt-1 text-foreground">0</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted">
        Placeholders until the harness emits real events. Do not treat dashes as
        fake percentages.
      </p>
    </section>
  );
}
