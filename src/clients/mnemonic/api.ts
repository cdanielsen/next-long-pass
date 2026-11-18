import {
  MNEMONIC_ENDPOINT,
  type MnemonicFailure,
  type MnemonicRequest,
  type MnemonicSuccess,
} from "../../../shared/api";

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
        : FALLBACK_MESSAGE;
    throw new MnemonicError(message, response.status);
  }

  if (typeof body?.message !== "string" || !body.message) {
    throw new MnemonicError(FALLBACK_MESSAGE, response.status);
  }

  return body.message;
};
