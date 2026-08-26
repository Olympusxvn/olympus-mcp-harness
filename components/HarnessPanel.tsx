const STAGES = [
  "Discover",
  "Validate",
  "Authorize",
  "Execute",
  "Verify",
] as const;

export function HarnessPanel() {
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
      <p className="mt-1 text-sm text-foreground">Idle — no invocation yet.</p>
      <ol className="mt-4 space-y-2">
        {STAGES.map((stage) => (
          <li key={stage} className="luxe-chip text-xs">
            {stage}
          </li>
        ))}
      </ol>
    </section>
  );
}
