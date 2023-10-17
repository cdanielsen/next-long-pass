import { useEffect, useState, useCallback } from "react";
import { TemperatureModes } from "../../components/Content";

interface PassphraseResponse {
  message: string;
}

export interface PassphraseRequest {
  passphrase: string;
  temperature: TemperatureModes;
}

export const useDescription = (
  passphrase: string | null,
  temperature: TemperatureModes,
) => {
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchDescriptionData = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const result = await fetch("api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase, temperature }),
      }).then((response) => response.json() as Promise<PassphraseResponse>);

      setDescription(result.message);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
    setIsLoading(false);
  }, [passphrase, temperature]);

  useEffect(() => {
    if (!passphrase) {
      return;
    }

    void fetchDescriptionData();
  }, [passphrase, fetchDescriptionData]);

  const refetch = () => {
    void fetchDescriptionData();
  };

  return { description, isLoading, isError, refetch };
};
