import { afterEach, describe, expect, it, vi } from "vitest";

import { EFF_LARGE_WORDLIST } from "./wordlist";
import {
  entropyBits,
  entropyStrength,
  generatePassphrase,
  secureRandomInt,
} from "./passphrase";

afterEach(() => {
  vi.restoreAllMocks();
});

/** Stub crypto.getRandomValues to emit the given uint32 values in order. */
const stubRandomValues = (values: number[]) => {
  const queue = [...values];
  return vi
    .spyOn(crypto, "getRandomValues")
    .mockImplementation(<T extends ArrayBufferView | null>(array: T): T => {
      const next = queue.shift();
      if (next === undefined) throw new Error("stub exhausted");
      (array as unknown as Uint32Array)[0] = next;
      return array;
    });
};

describe("EFF_LARGE_WORDLIST", () => {
  it("has 7776 unique words of 3-9 characters", () => {
    expect(EFF_LARGE_WORDLIST).toHaveLength(7776);
    expect(new Set(EFF_LARGE_WORDLIST).size).toBe(7776);
    for (const word of EFF_LARGE_WORDLIST) {
      expect(word).toMatch(/^[a-z-]{3,9}$/);
    }
  });
});

describe("secureRandomInt", () => {
  it("returns values within [0, max)", () => {
    for (let i = 0; i < 1000; i++) {
      const n = secureRandomInt(6);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(6);
    }
  });

  it("rejects values in the biased tail and resamples", () => {
    // For max = 1296, limit = 2^32 - (2^32 % 1296). Anything >= limit is rejected.
    const max = 1296;
    const limit = 2 ** 32 - (2 ** 32 % max);
    const spy = stubRandomValues([limit, 2 ** 32 - 1, max + 7]);

    expect(secureRandomInt(max)).toBe(7);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("throws on invalid max", () => {
    expect(() => secureRandomInt(0)).toThrow(RangeError);
    expect(() => secureRandomInt(1.5)).toThrow(RangeError);
    expect(() => secureRandomInt(2 ** 32 + 1)).toThrow(RangeError);
  });
});

describe("generatePassphrase", () => {
  it("returns the requested number of words from the list", () => {
    for (const count of [3, 5, 6]) {
      const words = generatePassphrase(count).split(" ");
      expect(words).toHaveLength(count);
      for (const word of words) {
        expect(EFF_LARGE_WORDLIST).toContain(word);
      }
    }
  });

  it("maps random indices to wordlist entries", () => {
    stubRandomValues([0, 2, 1]);
    expect(generatePassphrase(3, ["alpha", "bravo", "charlie"])).toBe(
      "alpha charlie bravo",
    );
  });
});

describe("entropy", () => {
  it("computes bits as wordCount * log2(poolSize)", () => {
    expect(entropyBits(1, 2)).toBe(1);
    expect(entropyBits(4, 1024)).toBe(40);
    expect(entropyBits(5)).toBeCloseTo(64.62, 2);
  });

  it("labels strength by threshold", () => {
    expect(entropyStrength(44.9)).toBe("weak");
    expect(entropyStrength(45)).toBe("fair");
    expect(entropyStrength(59.9)).toBe("fair");
    expect(entropyStrength(60)).toBe("strong");
  });
});
