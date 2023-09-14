import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { generate } from "random-words";
import Passphrase from "./Passphrase";
import "./Content.css";
import { fetchPassphraseDescription } from "../clients/openai";

const Content = () => {
  const [currentPassphrase, setCurrentPassphrase] = useState<string | null>(
    null,
  );
  const [currentDescription, setCurrentDescription] = useState<string | null>(
    null,
  );

  const updatePassphrase = () => {
    const nextWords = generate({
      minLength: 3,
      maxLength: 5,
      exactly: 4,
      join: " ",
    });
    setCurrentPassphrase(nextWords);
  };

  // Rather convulted construction to satisfy TS wanting
  // a void returning function for a click handler
  const generatePassphraseDescription = (passphrase: string) => () => {
    void (async () => {
      try {
        const { message } = await fetchPassphraseDescription(passphrase);
        setCurrentDescription(message);
      } catch (e) {
        console.error(e);
      }
    })();
  };

  return (
    <main id="Content">
      <Passphrase passPhrase={currentPassphrase} />
      <Button
        colorScheme="red"
        id="Content__generate-passphrase-button"
        onClick={updatePassphrase}
      >
        Make me one
      </Button>
      {currentPassphrase && (
        <Button
          colorScheme="blue"
          id="Content__generate-description-button"
          onClick={generatePassphraseDescription(currentPassphrase)}
        >
          Generate AI description
        </Button>
      )}
      {/* TODO: Shouldn't reuse this component */}
      {currentDescription && <Passphrase passPhrase={currentDescription} />}
    </main>
  );
};

export default Content;
