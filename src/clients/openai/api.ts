import type { TemperatureModes } from "../../lib/config";

export interface PassphraseRequest {
  passphrase: string;
  temperature: TemperatureModes;
}

export const MNEMONIC_ENDPOINT = "/api/openai";

const FALLBACK_MESSAGE = "Something went wrong generating the mnemonic";

/** A failed mnemonic request. `message` is safe to show to users. */
export class MnemonicError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "MnemonicError";
  }
}

interface ResponseBody {
  message?: unknown;
  error?: unknown;
}

/**
 * Request a mnemonic for `passphrase`. Throws `MnemonicError` for non-OK
 * responses (using the server's error text when present) or a malformed body.
 * Network errors and aborts propagate as-is.
 */
export const fetchMnemonic = async (
  request: PassphraseRequest,
  signal?: AbortSignal,
): Promise<string> => {
  const response = await fetch(MNEMONIC_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  const body = (await response.json().catch(() => null)) as ResponseBody | null;

  if (!response.ok) {
    const message =
      typeof body?.error === "string" && body.error
        ? body.error
        : FALLBACK_MESSAGE;
    throw new MnemonicError(message, response.status);
  }

  if (typeof body?.message !== "string" || !body.message) {
    throw new MnemonicError(FALLBACK_MESSAGE, response.status);
  }

  return body.message;
};
