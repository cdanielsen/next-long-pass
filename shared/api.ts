/**
 * Contract between the frontend and the mnemonic Netlify function.
 * See shared/passphrase.ts for import constraints.
 */

export const MNEMONIC_ENDPOINT = "/api/mnemonic";

/** Style of the generated mnemonic. */
export const AI_MODES = ["standard", "mcconaughey"] as const;
export type AiMode = (typeof AI_MODES)[number];
export const DEFAULT_AI_MODE: AiMode = "standard";

export const isAiMode = (value: unknown): value is AiMode =>
  (AI_MODES as readonly unknown[]).includes(value);

export interface MnemonicRequest {
  passphrase: string;
  mode: AiMode;
}

export interface MnemonicSuccess {
  message: string;
}

export interface MnemonicFailure {
  /** User-safe description of what went wrong. */
  error: string;
}

export type MnemonicResponse = MnemonicSuccess | MnemonicFailure;
