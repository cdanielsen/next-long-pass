import { useEffect, useState, useCallback } from "react";
import type { TemperatureModes } from "../../lib/config";
import { fetchMnemonic } from "./api";

export type { PassphraseRequest } from "./api";

export const useDescription = (
  passphrase: string | null,
  temperature: TemperatureModes,
) => {
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchDescriptionData = useCallback(async () => {
    if (!passphrase) {
      return;
    }

    setIsError(false);
    setIsLoading(true);

    try {
      setDescription(await fetchMnemonic({ passphrase, temperature }));
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
    setIsLoading(false);
  }, [passphrase, temperature]);

  useEffect(() => {
    void fetchDescriptionData();
  }, [fetchDescriptionData]);

  const refetch = () => {
    void fetchDescriptionData();
  };

  return { description, isLoading, isError, refetch };
};
