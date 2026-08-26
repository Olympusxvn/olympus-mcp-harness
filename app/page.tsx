import { ApprovalDialog } from "@/components/ApprovalDialog";
import { HarnessPanel } from "@/components/HarnessPanel";
import { MachinePanel } from "@/components/MachinePanel";
import { MetricsPanel } from "@/components/MetricsPanel";
import { ModelPanel } from "@/components/ModelPanel";
import { TraceTimeline } from "@/components/TraceTimeline";
import { HarnessBackground } from "@/components/luxury/HarnessBackground";
import { LuxuryNav } from "@/components/luxury/LuxuryNav";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <HarnessBackground />
      <LuxuryNav active="/" brand="Olympus MCP Harness" />
      <ApprovalDialog />
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

        <div className="grid animate-fade-in gap-4 lg:grid-cols-3">
          <ModelPanel />
          <HarnessPanel />
          <MachinePanel />
        </div>

        <div className="mt-4 grid animate-fade-in gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TraceTimeline />
          </div>
          <MetricsPanel />
        </div>
      </main>
    </div>
  );
}
