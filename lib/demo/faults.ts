let pendingDelayMs = 0;

/** Arm a one-shot delay for the next search_products execute (timeout demo). */
export function armSearchDelayOnce(ms: number): void {
  pendingDelayMs = Math.max(0, ms);
}

export function resetFaults(): void {
  pendingDelayMs = 0;
}

export async function consumeInjectedDelay(): Promise<void> {
  const ms = pendingDelayMs;
  pendingDelayMs = 0;
  if (ms <= 0) return;
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
