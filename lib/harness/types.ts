export type RiskLevel = "low" | "medium" | "high";

export type HarnessErrorCode =
  | "TOOL_NOT_FOUND"
  | "INVALID_INPUT"
  | "UNAUTHORIZED"
  | "APPROVAL_REQUIRED"
  | "APPROVAL_REJECTED"
  | "EXECUTION_TIMEOUT"
  | "EXECUTION_FAILED"
  | "VERIFICATION_FAILED"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface HarnessError {
  code: HarnessErrorCode;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export interface HarnessContext {
  traceId: string;
  sessionId: string;
  userId?: string;
  startedAt: number;
  metadata?: Record<string, unknown>;
}

export interface VerificationResult {
  passed: boolean;
  checks: string[];
}

export interface HarnessResult<T = unknown> {
  ok: boolean;
  tool: string;
  data?: T;
  error?: HarnessError;
  verification: VerificationResult;
  traceId: string;
  durationMs: number;
}

export interface ApprovalLine {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface ApprovalBinding {
  argsCanonical: string;
  amount: number;
  lines: ApprovalLine[];
}

export interface HarnessTool<I = unknown, O = unknown> {
  name: string;
  description: string;
  risk: RiskLevel;
  requiresApproval: boolean;
  inputSchema: unknown;
  execute(input: I, context: HarnessContext): Promise<O>;
  verify?(output: O, context: HarnessContext): Promise<VerificationResult>;
  bindApproval?(
    input: I,
  ): { ok: true; binding: ApprovalBinding } | { ok: false; error: HarnessError };
}

export interface TraceEvent {
  traceId: string;
  timestamp: number;
  stage:
    | "inspect"
    | "validate"
    | "authorize"
    | "approval"
    | "execute"
    | "verify"
    | "recover"
    | "complete";
  tool?: string;
  status: "start" | "success" | "warning" | "error";
  message: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export const TOOL_NAMES = [
  "search_products",
  "get_product",
  "compare_products",
  "add_to_cart",
  "checkout",
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];
