// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedCallback } from "./useDebouncedCallback";

const fn = vi.fn<(value: string) => void>();

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  fn.mockReset();
});

const setup = () => renderHook(() => useDebouncedCallback(fn, 1000));

describe("useDebouncedCallback", () => {
  it("calls once with the last arguments after the delay", () => {
    const { result } = setup();
    act(() => {
      result.current.run("a");
      vi.advanceTimersByTime(600);
      result.current.run("b");
      vi.advanceTimersByTime(600);
      result.current.run("c");
    });
    expect(result.current.isPending).toBe(true);

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(fn).toHaveBeenCalledExactlyOnceWith("c");
    expect(result.current.isPending).toBe(false);
  });

  it("cancel drops the pending call", () => {
    const { result } = setup();
    act(() => {
      result.current.run("a");
      result.current.cancel();
      vi.advanceTimersByTime(2000);
    });
    expect(fn).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(false);
  });

  it("unmounting drops the pending call", () => {
    const { result, unmount } = setup();
    act(() => {
      result.current.run("a");
    });
    unmount();
    vi.advanceTimersByTime(2000);
    expect(fn).not.toHaveBeenCalled();
  });
});
