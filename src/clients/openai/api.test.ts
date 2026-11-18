import { afterEach, describe, expect, it, vi } from "vitest";

import { MnemonicError, fetchMnemonic } from "./api";

const REQUEST = { passphrase: "apple bring crane", mode: "standard" } as const;

const stubFetch = (response: Response | Error) => {
  const fetchMock = vi.fn(() =>
    response instanceof Error
      ? Promise.reject(response)
      : Promise.resolve(response),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const expectMnemonicError = async (
  promise: Promise<unknown>,
  { message, status }: { message: string | RegExp; status: number },
) => {
  const error: unknown = await promise.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(MnemonicError);
  expect((error as MnemonicError).message).toMatch(message);
  expect((error as MnemonicError).status).toBe(status);
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchMnemonic", () => {
  it("POSTs the request to the absolute endpoint and returns the message", async () => {
    const fetchMock = stubFetch(jsonResponse(200, { message: "A mnemonic." }));
    const controller = new AbortController();

    await expect(fetchMnemonic(REQUEST, controller.signal)).resolves.toBe(
      "A mnemonic.",
    );
    expect(fetchMock).toHaveBeenCalledWith("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(REQUEST),
      signal: controller.signal,
    });
  });

  it("uses the server's error message for non-OK responses", async () => {
    stubFetch(jsonResponse(502, { error: "AI provider request failed" }));
    await expectMnemonicError(fetchMnemonic(REQUEST), {
      message: "AI provider request failed",
      status: 502,
    });
  });

  it("falls back to a generic message for non-JSON error bodies", async () => {
    stubFetch(new Response("<html>Bad Gateway</html>", { status: 502 }));
    await expectMnemonicError(fetchMnemonic(REQUEST), {
      message: /Something went wrong/,
      status: 502,
    });
  });

  it.each([
    ["missing message", {}],
    ["empty message", { message: "" }],
    ["non-string message", { message: 42 }],
  ])("rejects a 200 with %s", async (_, body) => {
    stubFetch(jsonResponse(200, body));
    await expectMnemonicError(fetchMnemonic(REQUEST), {
      message: /Something went wrong/,
      status: 200,
    });
  });

  it("propagates aborts unchanged", async () => {
    const abort = new DOMException("Aborted", "AbortError");
    stubFetch(abort);
    await expect(fetchMnemonic(REQUEST)).rejects.toBe(abort);
  });
});
