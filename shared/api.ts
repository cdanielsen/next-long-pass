/**
 * Contract between the frontend and the mnemonic Netlify function.
 * See shared/passphrase.ts for import constraints.
 */

export const MNEMONIC_ENDPOINT = "/api/openai";

export const TemperatureValues = [0.5, 1.5] as const;
export type TemperatureModes = (typeof TemperatureValues)[number];

export interface MnemonicRequest {
  passphrase: string;
  temperature: TemperatureModes;
}

export interface MnemonicSuccess {
  message: string;
}

export interface MnemonicFailure {
  /** User-safe description of what went wrong. */
  error: string;
}

export type MnemonicResponse = MnemonicSuccess | MnemonicFailure;
