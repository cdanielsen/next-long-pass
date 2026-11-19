import { APIError } from "openai";

/** Seconds to suggest waiting when OpenAI doesn't send a usable Retry-After. */
const DEFAULT_RETRY_AFTER_SECONDS = 60;

/**
 * User-facing copy. Only suggest retrying when it can help: quota, auth and
 * model problems persist until someone fixes the account or config.
 */
export const ERROR_MESSAGES = {
  busy: "The AI service is busy. Try again in a minute.",
  unavailable: "AI mnemonics are unavailable right now.",
  failed: "The AI service had a problem. Please try again.",
} as const;

export interface ErrorResponse {
  status: number;
  message: string;
  headers?: Record<string, string>;
}

const retryAfter = (headers: Headers | undefined): string => {
  const value = headers?.get("retry-after")?.trim();
  return value && /^\d+$/.test(value)
    ? value
    : String(DEFAULT_RETRY_AFTER_SECONDS);
};

/** `instanceof` narrows APIError's generics to `any`; pin them to defaults. */
const asApiError = (error: unknown): APIError | undefined =>
  error instanceof APIError ? error : undefined;

/** Map an error thrown by the OpenAI client to a response for our users. */
export const toErrorResponse = (error: unknown): ErrorResponse => {
  const apiError = asApiError(error);
  if (!apiError) {
    return { status: 502, message: ERROR_MESSAGES.failed };
  }

  const { status, code } = apiError;

  if (status === 429 && code !== "insufficient_quota") {
    return {
      status: 503,
      message: ERROR_MESSAGES.busy,
      headers: { "Retry-After": retryAfter(apiError.headers) },
    };
  }

  if (status === 429 || status === 401 || status === 403 || status === 404) {
    return { status: 503, message: ERROR_MESSAGES.unavailable };
  }

  return { status: 502, message: ERROR_MESSAGES.failed };
};

/**
 * Log enough to diagnose without the raw error: OpenAI's 401 message echoes
 * a fragment of the API key.
 */
export const describeError = (error: unknown): Record<string, unknown> => {
  const apiError = asApiError(error);
  if (apiError) {
    const { status, code, type, requestID } = apiError;
    // SDK subclasses (AuthenticationError, …) don't set `name`
    return { name: apiError.constructor.name, status, code, type, requestID };
  }
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return { value: String(error) };
};
