"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { getCart } from "@/lib/demo/cart";
import { applyHarnessResult, getDemoSnapshot, getDemoVersion, subscribeDemo } from "@/lib/demo/session";
import { registerDemoTools } from "@/lib/demo/tools";
import { harness } from "@/lib/harness/runtime";
import { traces } from "@/lib/harness/trace";
import type { HarnessResult } from "@/lib/harness/types";

export function useDemoState() {
  useSyncExternalStore(subscribeDemo, getDemoVersion, getDemoVersion);
  const snapshot = getDemoSnapshot();
  const cart = getCart();
  const events = traces.all();
  return { ...snapshot, cart, events };
}

export function useSimulate() {
  useEffect(() => {
    registerDemoTools();
  }, []);

  return useCallback(async (tool: string, input: unknown): Promise<HarnessResult> => {
    const result = await harness.run(tool, input);
    applyHarnessResult(result);
    return result;
  }, []);
}
