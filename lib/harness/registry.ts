import type { HarnessError, HarnessTool } from "./types";
import { harnessError } from "./errors";

export class ToolRegistry {
  private readonly tools = new Map<string, HarnessTool>();

  register(tool: HarnessTool): void {
    this.tools.set(tool.name, tool);
  }

  get(name: string): HarnessTool | undefined {
    return this.tools.get(name);
  }

  resolve(
    name: string,
  ): { ok: true; tool: HarnessTool } | { ok: false; error: HarnessError } {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        ok: false,
        error: harnessError(
          "TOOL_NOT_FOUND",
          `Unknown tool: ${name}`,
          false,
          { tool: name },
        ),
      };
    }
    return { ok: true, tool };
  }

  names(): string[] {
    return [...this.tools.keys()];
  }
}

export const registry = new ToolRegistry();
