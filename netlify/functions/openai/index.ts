import OpenAI from "openai";
import type { ReasoningEffort } from "openai/resources/shared";
import type { Handler, HandlerResponse } from "@netlify/functions";
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

type ResponseBody = { message: string } | { error: string };

const json = (
  statusCode: number,
  body: ResponseBody,
  headers: Record<string, string> = {},
): HandlerResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json", ...headers },
  body: JSON.stringify(body),
});

let client: OpenAI | undefined;
const getClient = (apiKey: string) => (client ??= new OpenAI({ apiKey }));

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" }, { Allow: "POST" });
  }

  let body: unknown;
  try {
    body = JSON.parse(event.body ?? "");
  } catch {
    return json(400, { error: "Request body must be valid JSON" });
  }

  const validation = validateRequest(body);
  if (!validation.ok) {
    return json(400, { error: validation.error });
  }
  const { words, temperature } = validation.value;
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;

  if (process.env.MOCK_AI === "true") {
    return json(200, { message: mockMnemonic(words, temperature) });
  }

  const apiKey = process.env.OPEN_AI_KEY;
  if (!apiKey) {
    console.error("Missing required env variable OPEN_AI_KEY");
    return json(500, { error: "Server is not configured" });
  }

  try {
    const completion = await getClient(apiKey).chat.completions.create({
      messages: buildMessages(words, temperature),
      model,
      // openai@4 types predate "none" (the API accepts it). Drop the cast
      // once the SDK is upgraded to a major version that types it.
      reasoning_effort: "none" as unknown as ReasoningEffort,
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

export { handler };
