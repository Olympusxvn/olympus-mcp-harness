export type WebmcpProbe = {
  supported: boolean;
};

/**
 * Capability probe for the WebMCP imperative API.
 * Prefer `document.modelContext` (current Chrome). `navigator.modelContext`
 * is deprecated as of Chromium 150 but still probed for Chrome 149.
 */
export function detectWebmcp(): WebmcpProbe {
  const ctx = getModelContext();
  return { supported: Boolean(ctx && typeof ctx.registerTool === "function") };
}

export function getModelContext(): WebMCP.ModelContext | undefined {
  if (typeof document !== "undefined") {
    const fromDocument = document.modelContext;
    if (fromDocument && typeof fromDocument.registerTool === "function") {
      return fromDocument;
    }
  }

  if (typeof navigator !== "undefined") {
    const fromNavigator = (
      navigator as Navigator & { modelContext?: WebMCP.ModelContext }
    ).modelContext;
    if (fromNavigator && typeof fromNavigator.registerTool === "function") {
      return fromNavigator;
    }
  }

  return undefined;
}
