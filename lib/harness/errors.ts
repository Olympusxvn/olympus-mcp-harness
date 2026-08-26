import type { HarnessError, HarnessErrorCode } from "./types";

export function harnessError(
  code: HarnessErrorCode,
  message: string,
  retryable: boolean,
  details?: Record<string, unknown>,
): HarnessError {
  return { code, message, retryable, details };
}
