import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {
  TemperatureValues,
  type TemperatureModes,
} from "../../../src/lib/config";

const BASE_INSTRUCTIONS =
  "You write mnemonics that help people remember a passphrase. " +
  "Write one short, vivid sentence (at most 25 words) that contains every given word exactly as written and in the given order. " +
  "Reply with the sentence only: plain text, no quotes, no markdown.";

/**
 * The UI still sends a "temperature" per AI mode, but current models only
 * accept the default temperature, so each mode is expressed as a style
 * instruction instead.
 */
const STYLE_BY_MODE: Record<TemperatureModes, string> = {
  [TemperatureValues[0]]: "Keep it clear and memorable.",
  [TemperatureValues[1]]:
    "Say it in a laid-back, philosophical, Matthew McConaughey-style voice.",
};

export const buildMessages = (
  words: string[],
  mode: TemperatureModes,
): ChatCompletionMessageParam[] => [
  { role: "system", content: `${BASE_INSTRUCTIONS} ${STYLE_BY_MODE[mode]}` },
  { role: "user", content: words.join(", ") },
];
