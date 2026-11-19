import { AI_MODES, type AiMode } from "../../shared/api";

/** "off" is client-only: no request is made and the server never sees it. */
export type MnemonicChoice = AiMode | "off";

export const DEFAULT_MNEMONIC_CHOICE: MnemonicChoice = "off";

export const MNEMONIC_CHOICES: readonly MnemonicChoice[] = ["off", ...AI_MODES];

export const MNEMONIC_CHOICE_LABELS: Record<MnemonicChoice, string> = {
  off: "Off",
  standard: "Standard",
  mcconaughey: "McConaughey",
};
