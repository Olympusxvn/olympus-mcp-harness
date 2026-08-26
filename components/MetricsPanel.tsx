"use client";

import { useDemoState } from "@/components/useDemoState";
import {
  foldMetrics,
  formatLatency,
  formatSuccessRate,
} from "@/lib/harness/metrics";

export function MetricsPanel() {
  const { events } = useDemoState();
  const metrics = foldMetrics(events);

  return (
    <section className="luxe-glass p-5 sm:p-6" aria-labelledby="metrics-heading">
      <h2 id="metrics-heading" className="luxe-eyebrow">
        Metrics
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Metric label="Success" value={formatSuccessRate(metrics.successRate)} />
        <Metric label="Avg latency" value={formatLatency(metrics.avgLatencyMs)} />
        <Metric label="Tool calls" value={String(metrics.toolCalls)} />
        <Metric label="Approvals" value={String(metrics.approvals)} />
        <Metric label="Rejects" value={String(metrics.rejects)} />
        <Metric label="Invalid input" value={String(metrics.validationFailures)} />
        <Metric
          label="Verify fails"
          value={String(metrics.verificationFailures)}
        />
      </dl>
      <p className="mt-3 text-xs text-muted">
        Folded from the live trace. An em dash means no complete runs yet — not a
        fake percentage.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
