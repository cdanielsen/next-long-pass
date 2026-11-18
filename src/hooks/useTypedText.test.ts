// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useTypedText } from "./useTypedText";

const stubReducedMotion = (reduce: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: reduce && query === "(prefers-reduced-motion: reduce)",
      media: query,
    })),
  );
};

/** Each tick's next timeout is scheduled after React commits, so step one at a time. */
const tick = (times: number, delay: number) => {
  for (let i = 0; i < times; i++) {
    act(() => {
      vi.advanceTimersByTime(delay);
    });
  }
};

beforeEach(() => {
  vi.useFakeTimers();
  stubReducedMotion(false);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("useTypedText", () => {
  it("reveals one character per delay", () => {
    const { result } = renderHook(() => useTypedText("abc", 40));
    expect(result.current).toBe("");

    tick(1, 40);
    expect(result.current).toBe("a");

    tick(2, 40);
    expect(result.current).toBe("abc");
  });

  it("stops scheduling once the text is fully shown", () => {
    const { result } = renderHook(() => useTypedText("ab", 10));
    tick(5, 10);
    expect(result.current).toBe("ab");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("shows the full text immediately with reduced motion", () => {
    stubReducedMotion(true);
    const { result } = renderHook(() => useTypedText("abc", 40));
    expect(result.current).toBe("abc");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears its timer on unmount", () => {
    const { unmount } = renderHook(() => useTypedText("abc", 40));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
