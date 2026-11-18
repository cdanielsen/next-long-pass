import { useCallback, useEffect, useRef, useState } from "react";

import type { TemperatureModes } from "../../lib/config";
import { fetchMnemonic } from "./api";

/**
 * Generates AI mnemonics on demand. Requests only go out when `generate` is
 * called (never from an effect), so config changes and StrictMode re-renders
 * don't trigger paid API calls.
 *
 * Each call aborts the previous in-flight request and clears the previous
 * mnemonic, so a slow earlier response can never overwrite a newer one.
 */
export const useMnemonic = () => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const generate = useCallback(
    async (passphrase: string, temperature: TemperatureModes) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setMnemonic(null);
      setError(null);
      setIsLoading(true);

      try {
        const next = await fetchMnemonic(
          { passphrase, temperature },
          controller.signal,
        );
        // Superseded by a newer call (or unmounted) while awaiting
        if (controller.signal.aborted) return;
        setMnemonic(next);
      } catch (e) {
        if (controller.signal.aborted) return;
        console.error(e);
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (controllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  return { mnemonic, error, isLoading, generate };
};
