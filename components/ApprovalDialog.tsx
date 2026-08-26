"use client";

import { useEffect, useRef } from "react";
import { useSyncExternalStore } from "react";

import { formatUsd } from "@/lib/demo/products";
import { approvals } from "@/lib/harness/approval";

export function ApprovalDialog() {
  useSyncExternalStore(approvals.subscribe, approvals.getVersion, approvals.getVersion);
  const pending = approvals.getPending();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!pending) return;
    titleRef.current?.focus();
  }, [pending?.id]);

  useEffect(() => {
    if (!pending) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        approvals.reject();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending]);

  if (!pending) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: "rgba(7, 7, 11, 0.82)" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-title"
        className="luxe-glass luxe-glass-strong w-full max-w-md p-6 sm:p-8"
        style={{ borderColor: "var(--approval)", borderWidth: 2 }}
      >
        <p className="luxe-eyebrow" style={{ color: "var(--approval)" }}>
          Approval required
        </p>
        <h2
          id="approval-title"
          ref={titleRef}
          tabIndex={-1}
          className="luxe-display mt-3 text-2xl outline-none"
        >
          Confirm simulated checkout
        </h2>
        <p className="mt-3 text-sm text-muted">
          Irreversible purchase action. This is a simulated order — no real
          charge.
        </p>
        <p className="mt-4 text-sm text-muted">Risk</p>
        <p className="mt-1 text-sm font-medium" style={{ color: "var(--approval)" }}>
          High
        </p>
        <p className="mt-4 text-sm text-muted">Items</p>
        <ul className="mt-2 space-y-1 text-sm">
          {pending.lines.map((line) => (
            <li key={line.productId}>
              {line.name} × {line.qty} · {formatUsd(line.unitPrice * line.qty)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-lg text-gold-soft">
          Total {formatUsd(pending.amount)}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-luxe-ghost px-5 py-2 text-sm"
            onClick={() => approvals.reject()}
          >
            Reject
          </button>
          <button
            type="button"
            className="btn-luxe px-5 py-2 text-sm"
            onClick={() => approvals.approve()}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
