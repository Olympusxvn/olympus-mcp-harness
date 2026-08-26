import { describe, expect, it } from "vitest";

import { getPolicy, POLICY_TABLE } from "@/lib/harness/policy";
import { TOOL_NAMES } from "@/lib/harness/types";

describe("policy table", () => {
  it("covers every MVP tool", () => {
    expect(Object.keys(POLICY_TABLE).sort()).toEqual([...TOOL_NAMES].sort());
  });

  it("marks search/get/compare as low risk with timeout retry", () => {
    for (const tool of ["search_products", "get_product", "compare_products"] as const) {
      const row = getPolicy(tool);
      expect(row.risk).toBe("low");
      expect(row.autoExecute).toBe(true);
      expect(row.requiresApproval).toBe(false);
      expect(row.retryOnTimeout).toBe(true);
    }
  });

  it("marks add_to_cart as medium auto-execute without approval", () => {
    const row = getPolicy("add_to_cart");
    expect(row.risk).toBe("medium");
    expect(row.autoExecute).toBe(true);
    expect(row.requiresApproval).toBe(false);
    expect(row.retryOnTimeout).toBe(false);
  });

  it("marks checkout as high risk requiring approval and no retry", () => {
    const row = getPolicy("checkout");
    expect(row.risk).toBe("high");
    expect(row.autoExecute).toBe(false);
    expect(row.requiresApproval).toBe(true);
    expect(row.retryOnTimeout).toBe(false);
  });
});
