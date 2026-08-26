const DEMO_GOAL =
  "Find the best laptop under $1,500 for AI development and prepare it for purchase.";

export function ModelPanel() {
  return (
    <section
      className="luxe-glass luxe-glass-strong stage-model flex min-h-[280px] flex-col p-5 sm:p-6"
      aria-labelledby="model-heading"
    >
      <p className="luxe-eyebrow" style={{ color: "var(--model)" }}>
        Model
      </p>
      <h2 id="model-heading" className="luxe-display mt-2 text-xl">
        Reason
      </h2>
      <p className="mt-4 text-sm text-muted">Intent</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{DEMO_GOAL}</p>
      <p className="mt-4 text-sm text-muted">Decision</p>
      <p className="mt-1 text-sm text-foreground">Waiting for agent or simulate path.</p>
      <p className="mt-4 text-sm text-muted">Next step</p>
      <p className="mt-1 text-sm text-muted">search_products when tools are live.</p>
    </section>
  );
}
