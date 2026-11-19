import OpenAI from "openai";
import type { Config } from "@netlify/functions";
import type { MnemonicResponse } from "../../../shared/api";
import { validateRequest } from "./validate";
import { mockMnemonic } from "./mock";
import { buildMessages } from "./prompt";

/**
 * Cheapest current-generation chat model as of 2026-11. It's a reasoning
 * model: it only supports the default temperature, and reasoning tokens count
 * against max_completion_tokens, so reasoning is disabled. An OPENAI_MODEL
 * override must also accept reasoning_effort "none".
 */
const DEFAULT_MODEL = "gpt-6-luna";

/** Mnemonics come back in ~20-30 tokens; cap spend on runaway output. */
const MAX_COMPLETION_TOKENS = 120;

const json = (
  status: number,
  body: MnemonicResponse,
  headers: Record<string, string> = {},
): Response => Response.json(body, { status, headers });

let client: OpenAI | undefined;
const getClient = (apiKey: string) => (client ??= new OpenAI({ apiKey }));

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" }, { Allow: "POST" });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Request body must be valid JSON" });
  }

  const validation = validateRequest(body);
  if (!validation.ok) {
    return json(400, { error: validation.error });
  }
  const { words, mode } = validation.value;
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;

  if (process.env.MOCK_AI === "true") {
    return json(200, { message: mockMnemonic(words, mode) });
  }

  const apiKey = process.env.OPEN_AI_KEY;
  if (!apiKey) {
    console.error("Missing required env variable OPEN_AI_KEY");
    return json(500, { error: "Server is not configured" });
  }

  try {
    const completion = await getClient(apiKey).chat.completions.create({
      messages: buildMessages(words, mode),
      model,
      reasoning_effort: "none",
      max_completion_tokens: MAX_COMPLETION_TOKENS,
    });

    const message = completion.choices[0]?.message.content?.trim();
    if (!message) {
      return json(502, { error: "Empty response from AI provider" });
    }

    return json(200, { message });
  } catch (error) {
    console.error(error);
    return json(502, { error: "AI provider request failed" });
  }
};

/**
 * Netlify reads this statically at build time, so values must be literals:
 * an imported constant (e.g. MNEMONIC_ENDPOINT) is silently ignored.
 */
export const config: Config = {
  path: "/api/mnemonic",
  // Per-visitor cap enforced by the platform before the function runs (a 429
  // with no JSON body), so blocked requests cost nothing. Not enforced by
  // `netlify dev`. Max windowSize is 180s.
  rateLimit: {
    windowLimit: 10,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
