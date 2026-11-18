/**
 * Passphrase limits shared by the UI and the Netlify function.
 *
 * Keep this module free of browser/Vite-only imports (e.g. `?raw`) so the
 * function bundler (esbuild) can import it.
 */

export const MIN_WORDS = 3;
export const MAX_WORDS = 6;
export const DEFAULT_WORDS = 5;

/** Matches every entry in the EFF large wordlist (3-9 chars, a few hyphenated). */
export const WORD_PATTERN = /^[a-z-]{3,9}$/;

export const TemperatureValues = [0.5, 1.5] as const;
export type TemperatureModes = (typeof TemperatureValues)[number];
