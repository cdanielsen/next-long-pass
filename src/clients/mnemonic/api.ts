import {
  MNEMONIC_ENDPOINT,
  type MnemonicFailure,
  type MnemonicRequest,
  type MnemonicSuccess,
} from "../../../shared/api";

/**
 * Used when the server didn't send its own message, e.g. a platform error
 * page. The platform rate limiter answers 429 before our function runs.
 */
const FALLBACK_MESSAGE =
  "Something went wrong generating the mnemonic. Please try again.";
const RATE_LIMITED_MESSAGE = "Too many requests. Wait a minute and try again.";

/** Shown for failures without a response (offline, DNS, CORS, …). */
export const NETWORK_ERROR_MESSAGE =
  "Couldn't reach the server. Check your connection and try again.";

/** A failed mnemonic request. `message` is a complete, user-facing sentence. */
export class MnemonicError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "MnemonicError";
  }
}

/** The response JSON is untrusted: same keys as MnemonicResponse, unknown values. */
type UntrustedBody = Partial<
  Record<keyof MnemonicSuccess | keyof MnemonicFailure, unknown>
>;

/**
 * Request a mnemonic for `passphrase`. Throws `MnemonicError` for non-OK
 * responses (using the server's error text when present) or a malformed body.
 * Network errors and aborts propagate as-is.
 */
export const fetchMnemonic = async (
  request: MnemonicRequest,
  signal?: AbortSignal,
): Promise<string> => {
  const response = await fetch(MNEMONIC_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  const body = (await response
    .json()
    .catch(() => null)) as UntrustedBody | null;

  if (!response.ok) {
    const message =
      typeof body?.error === "string" && body.error
        ? body.error
        : response.status === 429
          ? RATE_LIMITED_MESSAGE
          : FALLBACK_MESSAGE;
    throw new MnemonicError(message, response.status);
  }

  if (typeof body?.message !== "string" || !body.message) {
    throw new MnemonicError(FALLBACK_MESSAGE, response.status);
  }

  return body.message;
};
