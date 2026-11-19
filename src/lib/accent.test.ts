// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { applyAccent, readStoredAccent, storeAccent } from "./accent";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  delete document.documentElement.dataset.accent;
});

describe("accent", () => {
  it("defaults to teal", () => {
    expect(readStoredAccent()).toBe("teal");
  });

  it("round-trips a stored accent", () => {
    storeAccent("plum");
    expect(readStoredAccent()).toBe("plum");
  });

  it("ignores unknown stored values", () => {
    localStorage.setItem("accent", "chartreuse");
    expect(readStoredAccent()).toBe("teal");
  });

  it("falls back when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(() => {
      storeAccent("blue");
    }).not.toThrow();
    expect(readStoredAccent()).toBe("teal");
  });

  it("applies the accent to the root element", () => {
    applyAccent("blue");
    expect(document.documentElement.dataset.accent).toBe("blue");
  });
});
