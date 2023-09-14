interface PassphraseResponse {
  message: string;
}

export const fetchPassphraseDescription = (passphrase: string) => {
  return fetch("/api/passphrase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passphrase }),
  }).then((response) => response.json() as Promise<PassphraseResponse>);
};
