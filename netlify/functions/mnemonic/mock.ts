import type { AiMode } from "../../../shared/api";

const capitalize = (word: string) => word[0].toUpperCase() + word.slice(1);

const MOCK_BY_MODE: Record<AiMode, (phrase: string) => string> = {
  standard: (phrase) => `[mock] ${phrase}.`,
  mcconaughey: (phrase) =>
    `[mock] Alright, alright, alright... ${phrase}. Just keep livin'.`,
};

/**
 * Canned mnemonic for local dev (MOCK_AI=true) so testing doesn't spend
 * OpenAI budget. Deterministic and clearly labelled as fake.
 */
export const mockMnemonic = (words: string[], mode: AiMode): string =>
  MOCK_BY_MODE[mode](words.map(capitalize).join(", "));
