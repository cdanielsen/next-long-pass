import raw from "./eff-large.txt?raw";

/**
 * EFF Large Wordlist: 7,776 words, 3-9 characters.
 * https://www.eff.org/dice (CC BY 3.0 US)
 */
export const EFF_LARGE_WORDLIST: readonly string[] = raw
  .split("\n")
  .map((word) => word.trim())
  .filter(Boolean);
