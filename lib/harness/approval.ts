import type { ApprovalBinding, ApprovalLine } from "./types";

export type ApprovalDecision = "approved" | "rejected" | "invalidated";

export type PendingApproval = {
  id: string;
  traceId: string;
  tool: string;
  argsCanonical: string;
  amount: number;
  createdAt: number;
  lines: ApprovalLine[];
};

export class ApprovalController {
  private pending: PendingApproval | null = null;
  private waiter: ((decision: ApprovalDecision) => void) | null = null;
  private matches: (() => boolean) | null = null;
  private version = 0;
  private readonly listeners = new Set<() => void>();

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getVersion = (): number => this.version;

  getPending = (): PendingApproval | null => this.pending;

  async request(
    payload: Omit<PendingApproval, "id" | "createdAt">,
    matches: () => boolean,
  ): Promise<ApprovalDecision> {
    if (this.waiter) {
      this.settle("invalidated");
    }

    this.pending = {
      ...payload,
      id: createApprovalId(),
      createdAt: Date.now(),
    };
    this.matches = matches;
    this.emit();

    return new Promise((resolve) => {
      this.waiter = resolve;
    });
  }

  approve(): boolean {
    if (!this.pending) return false;
    if (!this.matches?.()) {
      this.settle("invalidated");
      return false;
    }
    this.settle("approved");
    return true;
  }

  reject(): void {
    if (!this.pending) return;
    this.settle("rejected");
  }

  invalidate(): void {
    if (!this.pending) return;
    this.settle("invalidated");
  }

  reset(): void {
    if (this.waiter) {
      this.settle("invalidated");
      return;
    }
    this.pending = null;
    this.matches = null;
    this.emit();
  }

  private settle(decision: ApprovalDecision): void {
    const waiter = this.waiter;
    this.waiter = null;
    this.pending = null;
    this.matches = null;
    this.emit();
    waiter?.(decision);
  }

  private emit(): void {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
  }
}

function createApprovalId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `appr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function bindingMatches(
  binding: ApprovalBinding,
  current: ApprovalBinding,
): boolean {
  return (
    binding.argsCanonical === current.argsCanonical &&
    binding.amount === current.amount
  );
}

export const approvals = new ApprovalController();
