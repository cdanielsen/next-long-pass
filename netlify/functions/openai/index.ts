import { Handler } from "@netlify/functions";

// eslint-disable-next-line @typescript-eslint/require-await
const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};

export { handler };
