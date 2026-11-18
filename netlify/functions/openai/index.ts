import OpenAI from "openai";
import type { Handler, HandlerResponse } from "@netlify/functions";
import { validateRequest } from "./validate";
import { mockMnemonic } from "./mock";

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

  if (process.env.MOCK_AI === "true") {
    return json(200, { message: mockMnemonic(words, temperature) });
  }

  const apiKey = process.env.OPEN_AI_KEY;
  if (!apiKey) {
    console.error("Missing required env variable OPEN_AI_KEY");
    return json(500, { error: "Server is not configured" });
  }

  const content = `Create a short phrase or mnemonic where the following words all appear: ${words.join(
    ", ",
  )}.`;

  try {
    const completion = await getClient(apiKey).chat.completions.create({
      messages: [{ role: "user", content }],
      model: "gpt-3.5-turbo",
      temperature,
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
