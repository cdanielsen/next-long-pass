/**
 * Passphrase limits shared by the UI and the Netlify function.
 *
 * Everything in shared/ is bundled by both Vite (frontend) and esbuild
 * (function), so keep it free of React, Vite-only (e.g. `?raw`) and Node
 * imports.
 */

export const MIN_WORDS = 3;
export const MAX_WORDS = 6;
export const DEFAULT_WORDS = 5;

/** Matches every entry in the EFF large wordlist (3-9 chars, a few hyphenated). */
export const WORD_PATTERN = /^[a-z-]{3,9}$/;
