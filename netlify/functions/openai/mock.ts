import {
  TemperatureValues,
  type TemperatureModes,
} from "../../../src/lib/config";

const capitalize = (word: string) => word[0].toUpperCase() + word.slice(1);

/**
 * Canned mnemonic for local dev (MOCK_AI=true) so testing doesn't spend
 * OpenAI budget. Deterministic and clearly labelled as fake.
 */
export const mockMnemonic = (
  words: string[],
  temperature: TemperatureModes,
): string => {
  const phrase = words.map(capitalize).join(", ");
  return temperature === TemperatureValues[0]
    ? `[mock] ${phrase}.`
    : `[mock] Alright, alright, alright... ${phrase}. Just keep livin'.`;
};
