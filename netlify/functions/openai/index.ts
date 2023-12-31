import OpenAI from "openai";
import { Handler } from "@netlify/functions";
import type { PassphraseRequest } from "../../../src/clients/openai";

const apiKey = process.env.OPEN_AI_KEY;
if (!apiKey) {
  throw new Error("Missing required env variable OPEN_AI_KEY");
}

const openai = new OpenAI({
  apiKey,
});

const handler: Handler = async (event) => {
  const { body } = event;
  if (!body) {
    throw new Error("Missing request body!");
  }

  const { passphrase, temperature } = JSON.parse(body) as PassphraseRequest;

  const content = `Create a short phrase or mnemonic where the following words all appear: ${passphrase
    .split(" ")
    .join(", ")}.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content }],
    model: "gpt-3.5-turbo",
    temperature,
  });

  const { content: message } = completion.choices[0].message;

  return {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
};

export { handler };
