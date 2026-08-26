import type { TraceEvent } from "./types";

export class TraceLog {
  private readonly events: TraceEvent[] = [];

  append(event: Omit<TraceEvent, "timestamp"> & { timestamp?: number }): TraceEvent {
    const full: TraceEvent = {
      ...event,
      timestamp: event.timestamp ?? Date.now(),
    };
    this.events.push(full);
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
  }
}

export const traces = new TraceLog();
