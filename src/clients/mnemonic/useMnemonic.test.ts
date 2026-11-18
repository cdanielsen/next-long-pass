// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MnemonicRequest } from "../../../shared/api";
import { MnemonicError } from "./api";
import { useMnemonic } from "./useMnemonic";

const { fetchMnemonic } = vi.hoisted(() => ({
  fetchMnemonic: vi.fn<[MnemonicRequest, AbortSignal?], Promise<string>>(),
}));

vi.mock("./api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./api")>()),
  fetchMnemonic,
}));

/** A promise whose resolution the test controls. */
const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

/** Make fetchMnemonic reject with AbortError when its signal aborts, like real fetch. */
const abortable = <T>(d: ReturnType<typeof deferred<T>>) =>
  vi.fn((_req: MnemonicRequest, signal?: AbortSignal) => {
    signal?.addEventListener("abort", () => {
      d.reject(new DOMException("Aborted", "AbortError"));
    });
    return d.promise;
  });

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  fetchMnemonic.mockReset();
});

describe("useMnemonic", () => {
  it("does not fetch until generate is called", () => {
    const { result } = renderHook(() => useMnemonic());
    expect(fetchMnemonic).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({
      mnemonic: null,
      error: null,
      isLoading: false,
    });
  });

  it("loads then exposes the mnemonic", async () => {
    const d = deferred<string>();
    fetchMnemonic.mockReturnValue(d.promise);
    const { result } = renderHook(() => useMnemonic());

    let pending!: Promise<void>;
    act(() => {
      pending = result.current.generate("apple bring crane", "standard");
    });
    expect(result.current.isLoading).toBe(true);
    expect(fetchMnemonic).toHaveBeenCalledWith(
      { passphrase: "apple bring crane", mode: "standard" },
      expect.any(AbortSignal),
    );

    await act(async () => {
      d.resolve("A mnemonic.");
      await pending;
    });
    expect(result.current).toMatchObject({
      mnemonic: "A mnemonic.",
      error: null,
      isLoading: false,
    });
  });

  it("clears the previous mnemonic when a new request starts", async () => {
    fetchMnemonic.mockResolvedValueOnce("First.");
    const { result } = renderHook(() => useMnemonic());
    await act(() => result.current.generate("apple bring crane", "standard"));
    expect(result.current.mnemonic).toBe("First.");

    fetchMnemonic.mockReturnValueOnce(deferred<string>().promise);
    act(() => {
      void result.current.generate("delta echo fox", "standard");
    });
    expect(result.current.mnemonic).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("keeps the latest result when responses resolve out of order", async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    fetchMnemonic
      .mockImplementationOnce(abortable(first))
      .mockReturnValueOnce(second.promise);
    const { result } = renderHook(() => useMnemonic());

    let p1!: Promise<void>;
    let p2!: Promise<void>;
    act(() => {
      p1 = result.current.generate("apple bring crane", "standard");
    });
    act(() => {
      p2 = result.current.generate("delta echo fox", "standard");
    });

    expect(fetchMnemonic.mock.calls[0][1]?.aborted).toBe(true);

    await act(async () => {
      second.resolve("Second.");
      await p2;
    });
    // A late resolution of a superseded request must not win either
    await act(async () => {
      first.resolve("First (stale).");
      await p1;
    });

    expect(result.current).toMatchObject({
      mnemonic: "Second.",
      error: null,
      isLoading: false,
    });
  });

  it("does not surface errors from superseded requests", async () => {
    const first = deferred<string>();
    fetchMnemonic
      .mockImplementationOnce(abortable(first))
      .mockResolvedValueOnce("Second.");
    const { result } = renderHook(() => useMnemonic());

    let p1!: Promise<void>;
    act(() => {
      p1 = result.current.generate("apple bring crane", "standard");
    });
    await act(() => result.current.generate("delta echo fox", "standard"));
    await act(() => p1);

    expect(result.current.error).toBeNull();
    expect(result.current.mnemonic).toBe("Second.");
  });

  it("exposes errors and clears them on the next attempt", async () => {
    fetchMnemonic.mockRejectedValueOnce(
      new MnemonicError("AI provider request failed", 502),
    );
    const { result } = renderHook(() => useMnemonic());
    await act(() => result.current.generate("apple bring crane", "standard"));

    expect(result.current.error?.message).toBe("AI provider request failed");
    expect(result.current.isLoading).toBe(false);

    fetchMnemonic.mockReturnValueOnce(deferred<string>().promise);
    act(() => {
      void result.current.generate("apple bring crane", "standard");
    });
    expect(result.current.error).toBeNull();
  });

  it("aborts the in-flight request on unmount", () => {
    fetchMnemonic.mockReturnValue(deferred<string>().promise);
    const { result, unmount } = renderHook(() => useMnemonic());
    act(() => {
      void result.current.generate("apple bring crane", "standard");
    });

    unmount();
    expect(fetchMnemonic.mock.calls[0][1]?.aborted).toBe(true);
  });
});
