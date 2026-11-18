import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { AiMode } from "../../../shared/api";

const BASE_INSTRUCTIONS =
  "You write mnemonics that help people remember a passphrase. " +
  "Write one short, vivid sentence (at most 25 words) that contains every given word exactly as written and in the given order. " +
  "Reply with the sentence only: plain text, no quotes, no markdown.";

const STYLE_BY_MODE: Record<AiMode, string> = {
  standard: "Keep it clear and memorable.",
  mcconaughey:
    "Say it in a laid-back, philosophical, Matthew McConaughey-style voice.",
};

export const buildMessages = (
  words: string[],
  mode: AiMode,
): ChatCompletionMessageParam[] => [
  { role: "system", content: `${BASE_INSTRUCTIONS} ${STYLE_BY_MODE[mode]}` },
  { role: "user", content: words.join(", ") },
];
