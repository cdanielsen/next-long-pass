import raw from "./eff-short-1.txt?raw";

/**
 * EFF Short Wordlist #1: 1,296 memorable words, all 5 characters or fewer.
 * https://www.eff.org/dice (CC BY 3.0 US)
 */
export const EFF_SHORT_WORDLIST: readonly string[] = raw
  .split("\n")
  .map((word) => word.trim())
  .filter(Boolean);
