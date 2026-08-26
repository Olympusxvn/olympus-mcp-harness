import { HarnessBackground } from "@/components/luxury/HarnessBackground";
import { LuxuryNav } from "@/components/luxury/LuxuryNav";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <HarnessBackground />
      <LuxuryNav active="/" brand="Olympus MCP Harness" />
      <main className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 animate-fade-in text-center">
          <p className="luxe-eyebrow">WebMCP Challenge</p>
          <h1 className="luxe-display mt-4 text-5xl sm:text-6xl">
            Olympus MCP <span className="luxe-gold-text">Harness</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            The model reasons. The machine executes.
          </p>
        </header>

        <section className="luxe-glass luxe-glass-strong animate-fade-in p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="luxe-chip" style={{ borderColor: "var(--model)" }}>
              Model · reason
            </span>
            <span
              className="luxe-chip"
              style={{ borderColor: "var(--harness)" }}
            >
              Harness · control
            </span>
            <span
              className="luxe-chip"
              style={{ borderColor: "var(--machine)" }}
            >
              Machine · execute
            </span>
            <span
              className="luxe-chip"
              style={{ borderColor: "var(--approval)" }}
            >
              Approval
            </span>
            <span className="luxe-chip" style={{ borderColor: "var(--fail)" }}>
              Failure
            </span>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-muted">
            WebMCP defines the boundary. Olympus MCP Harness engineers the execution
            behind it.
          </p>
        </section>
      </main>
    </div>
  );
}
