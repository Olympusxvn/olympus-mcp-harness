"use client";

import { useEffect, useState } from "react";

import { detectWebmcp } from "@/lib/webmcp/detect";
import { registerWebmcpTools } from "@/lib/webmcp/registerTools";

type BannerState =
  | { kind: "checking" }
  | { kind: "unsupported" }
  | { kind: "registering" }
  | { kind: "ready"; registered: number }
  | { kind: "error"; message: string };

export function WebmcpStatus() {
  const [state, setState] = useState<BannerState>({ kind: "checking" });

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      const { supported } = detectWebmcp();
      if (!supported) {
        if (!controller.signal.aborted) {
          setState({ kind: "unsupported" });
        }
        return;
      }

      setState({ kind: "registering" });
      try {
        const { registered } = await registerWebmcpTools(controller.signal);
        if (controller.signal.aborted) return;
        setState({ kind: "ready", registered });
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : "Registration failed";
        setState({ kind: "error", message });
      }
    })();

    return () => controller.abort();
  }, []);

  const copy = bannerCopy(state);

  return (
    <div
      role="status"
      aria-live="polite"
      className="luxe-glass mx-auto mt-6 max-w-3xl px-4 py-3 text-left sm:px-5"
    >
      <p className="luxe-eyebrow text-[0.65rem]">{copy.eyebrow}</p>
      <p className="mt-2 text-sm text-foreground">{copy.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{copy.detail}</p>
    </div>
  );
}

function bannerCopy(state: BannerState): {
  eyebrow: string;
  title: string;
  detail: string;
} {
  switch (state.kind) {
    case "checking":
      return {
        eyebrow: "WebMCP",
        title: "Checking for document.modelContext…",
        detail: "Simulate controls work either way.",
      };
    case "unsupported":
      return {
        eyebrow: "WebMCP unavailable",
        title: "This browser does not expose document.modelContext.",
        detail:
          "Simulate still works. For the agent path: Chrome 151+ with chrome://flags/#enable-webmcp-testing, or ChatGPT’s in-app browser.",
      };
    case "registering":
      return {
        eyebrow: "WebMCP",
        title: "Registering five tools…",
        detail: "AbortSignal unregisters them if this page unmounts (Strict Mode safe).",
      };
    case "ready":
      return {
        eyebrow: "WebMCP available",
        title:
          state.registered === 5
            ? "5 tools registered via document.modelContext.registerTool."
            : `${state.registered} of 5 tools registered via document.modelContext.registerTool.`,
        detail:
          "search_products, get_product, compare_products, add_to_cart, checkout. Simulate remains available.",
      };
    case "error":
      return {
        eyebrow: "WebMCP error",
        title: "Tool registration failed. Simulate still works.",
        detail: state.message,
      };
  }
}
