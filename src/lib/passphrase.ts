import { EFF_SHORT_WORDLIST } from "./wordlist";

const UINT32_RANGE = 2 ** 32;

/**
 * Returns a uniformly distributed integer in [0, max) using the Web Crypto
 * CSPRNG. Uses rejection sampling to avoid modulo bias.
 */
export const secureRandomInt = (max: number): number => {
  if (!Number.isInteger(max) || max <= 0 || max > UINT32_RANGE) {
    throw new RangeError(`max must be an integer in (0, 2^32], got ${max}`);
  }

  // Largest multiple of `max` that fits in the uint32 range; values at or
  // above it would over-represent the low end of [0, max) after `% max`.
  const limit = UINT32_RANGE - (UINT32_RANGE % max);
  const buffer = new Uint32Array(1);

  for (;;) {
    crypto.getRandomValues(buffer);
    const value = buffer[0];
    if (value < limit) {
      return value % max;
    }
  }
};

export const generatePassphrase = (
  wordCount: number,
  wordlist: readonly string[] = EFF_SHORT_WORDLIST,
): string =>
  Array.from(
    { length: wordCount },
    () => wordlist[secureRandomInt(wordlist.length)],
  ).join(" ");

/** Bits of entropy for `wordCount` words drawn independently from the list. */
export const entropyBits = (
  wordCount: number,
  poolSize: number = EFF_SHORT_WORDLIST.length,
): number => wordCount * Math.log2(poolSize);

export type EntropyStrength = "weak" | "fair" | "strong";

export const entropyStrength = (bits: number): EntropyStrength => {
  if (bits < 45) return "weak";
  if (bits < 60) return "fair";
  return "strong";
};
