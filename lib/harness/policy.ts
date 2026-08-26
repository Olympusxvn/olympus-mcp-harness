import type { RiskLevel, ToolName } from "./types";

export interface PolicyRow {
  tool: ToolName;
  risk: RiskLevel;
  autoExecute: boolean;
  requiresApproval: boolean;
  retryOnTimeout: boolean;
}

export const POLICY_TABLE: Record<ToolName, PolicyRow> = {
  search_products: {
    tool: "search_products",
    risk: "low",
    autoExecute: true,
    requiresApproval: false,
    retryOnTimeout: true,
  },
  get_product: {
    tool: "get_product",
    risk: "low",
    autoExecute: true,
    requiresApproval: false,
    retryOnTimeout: true,
  },
  compare_products: {
    tool: "compare_products",
    risk: "low",
    autoExecute: true,
    requiresApproval: false,
    retryOnTimeout: true,
  },
  add_to_cart: {
    tool: "add_to_cart",
    risk: "medium",
    autoExecute: true,
    requiresApproval: false,
    retryOnTimeout: false,
  },
  checkout: {
    tool: "checkout",
    risk: "high",
    autoExecute: false,
    requiresApproval: true,
    retryOnTimeout: false,
  },
};

export function getPolicy(tool: ToolName): PolicyRow {
  return POLICY_TABLE[tool];
}

export function mayRetry(tool: ToolName): boolean {
  return POLICY_TABLE[tool].retryOnTimeout;
}
