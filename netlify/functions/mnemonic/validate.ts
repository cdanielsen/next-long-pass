import { MAX_WORDS, MIN_WORDS, WORD_PATTERN } from "../../../shared/passphrase";
import { AI_MODES, isAiMode, type MnemonicRequest } from "../../../shared/api";

export type ValidationResult =
  | { ok: true; value: MnemonicRequest & { words: string[] } }
  | { ok: false; error: string };

const fail = (error: string): ValidationResult => ({ ok: false, error });

/**
 * Only accept requests the UI could actually produce, so the function can't
 * be used as a general-purpose OpenAI proxy.
 */
export const validateRequest = (input: unknown): ValidationResult => {
  if (typeof input !== "object" || input === null) {
    return fail("Request body must be a JSON object");
  }

  const { passphrase, mode } = input as Record<string, unknown>;

  if (typeof passphrase !== "string") {
    return fail("passphrase must be a string");
  }

  const words = passphrase.split(" ");
  if (words.length < MIN_WORDS || words.length > MAX_WORDS) {
    return fail(`passphrase must contain ${MIN_WORDS}-${MAX_WORDS} words`);
  }
  if (!words.every((word) => WORD_PATTERN.test(word))) {
    return fail("passphrase contains invalid words");
  }

  if (!isAiMode(mode)) {
    return fail(`mode must be one of ${AI_MODES.join(", ")}`);
  }

  return { ok: true, value: { passphrase, mode, words } };
};
