import { APIError } from "openai";
import { describe, expect, it } from "vitest";

import { describeError, ERROR_MESSAGES, toErrorResponse } from "./errors";

const KEY_FRAGMENT = "sk-proj-****abcd";

/** Build errors the way the OpenAI client does from an HTTP response. */
const apiError = (
  status: number,
  code: string | null,
  headers: Record<string, string> = {},
) =>
  APIError.generate(
    status,
    {
      error: {
        code,
        type: "test_error",
        message: `Incorrect API key provided: ${KEY_FRAGMENT}`,
      },
    },
    undefined,
    new Headers({ "x-request-id": "req_123", ...headers }),
  );

describe("toErrorResponse", () => {
  it("maps an upstream rate limit to 503 busy with Retry-After", () => {
    expect(
      toErrorResponse(
        apiError(429, "rate_limit_exceeded", { "retry-after": "20" }),
      ),
    ).toEqual({
      status: 503,
      message: ERROR_MESSAGES.busy,
      headers: { "Retry-After": "20" },
    });
  });

  it.each([undefined, "soon", "1.5"])(
    "defaults Retry-After to 60s when upstream sends %s",
    (value) => {
      const headers: Record<string, string> =
        value === undefined ? {} : { "retry-after": value };
      expect(
        toErrorResponse(apiError(429, "rate_limit_exceeded", headers)).headers,
      ).toEqual({ "Retry-After": "60" });
    },
  );

  it.each([
    ["exhausted quota", 429, "insufficient_quota"],
    ["bad key", 401, "invalid_api_key"],
    ["missing permission", 403, null],
    ["unknown model", 404, "model_not_found"],
  ])("maps %s to 503 unavailable without a retry hint", (_, status, code) => {
    expect(toErrorResponse(apiError(status, code))).toEqual({
      status: 503,
      message: ERROR_MESSAGES.unavailable,
    });
  });

  it.each([
    ["upstream 500", apiError(500, null)],
    ["upstream 400", apiError(400, "invalid_request_error")],
    [
      "connection error",
      APIError.generate(undefined, undefined, "", undefined),
    ],
    ["unknown error", new Error("boom")],
    ["non-error", "boom"],
  ])("maps %s to 502 failed", (_, error) => {
    expect(toErrorResponse(error)).toEqual({
      status: 502,
      message: ERROR_MESSAGES.failed,
    });
  });
});

describe("describeError", () => {
  it("keeps diagnostics but never the upstream message", () => {
    const details = describeError(apiError(401, "invalid_api_key"));
    expect(details).toEqual({
      name: "AuthenticationError",
      status: 401,
      code: "invalid_api_key",
      type: "test_error",
      requestID: "req_123",
    });
    expect(JSON.stringify(details)).not.toContain(KEY_FRAGMENT);
  });

  it("describes non-API errors by name and message", () => {
    expect(describeError(new TypeError("fetch failed"))).toEqual({
      name: "TypeError",
      message: "fetch failed",
    });
  });
});
