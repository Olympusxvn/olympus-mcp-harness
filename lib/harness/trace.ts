import type { TraceEvent } from "./types";

export class TraceLog {
  private readonly events: TraceEvent[] = [];
  private readonly listeners = new Set<() => void>();
  private version = 0;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getVersion = (): number => this.version;

  append(event: Omit<TraceEvent, "timestamp"> & { timestamp?: number }): TraceEvent {
    const full: TraceEvent = {
      ...event,
      timestamp: event.timestamp ?? Date.now(),
    };
    this.events.push(full);
    this.emit();
    return full;
  }

  all(): TraceEvent[] {
    return [...this.events];
  }

  forTrace(traceId: string): TraceEvent[] {
    return this.events.filter((event) => event.traceId === traceId);
  }

  clear(): void {
    this.events.length = 0;
    this.emit();
  }

  private emit(): void {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
  }
}

export const traces = new TraceLog();
