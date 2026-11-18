import { MAX_WORDS, MIN_WORDS, WORD_PATTERN } from "../../../shared/passphrase";
import {
  TemperatureValues,
  type MnemonicRequest,
  type TemperatureModes,
} from "../../../shared/api";

export type ValidationResult =
  | { ok: true; value: MnemonicRequest & { words: string[] } }
  | { ok: false; error: string };

const fail = (error: string): ValidationResult => ({ ok: false, error });

const isTemperature = (value: unknown): value is TemperatureModes =>
  (TemperatureValues as readonly unknown[]).includes(value);

/**
 * Only accept requests the UI could actually produce, so the function can't
 * be used as a general-purpose OpenAI proxy.
 */
export const validateRequest = (input: unknown): ValidationResult => {
  if (typeof input !== "object" || input === null) {
    return fail("Request body must be a JSON object");
  }

  const { passphrase, temperature } = input as Record<string, unknown>;

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

  if (!isTemperature(temperature)) {
    return fail(`temperature must be one of ${TemperatureValues.join(", ")}`);
  }

  return { ok: true, value: { passphrase, temperature, words } };
};
