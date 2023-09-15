import { useState } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { generate } from "random-words";
import Passphrase from "./Passphrase";
import Description from "./Description";
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
    const nextPassphrase = generate({
      minLength: 3,
      maxLength: 5,
      exactly: 4,
      join: " ",
    });
    setCurrentPassphrase(nextPassphrase);
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
        setCurrentDescription("An error occurred: please try again later");
      }
    })();
  };

  return (
    <main id="Content">
      {currentPassphrase && (
        <Passphrase passphrase={`"${currentPassphrase}"`} />
      )}
      {currentDescription && <Description description={currentDescription} />}
      <ButtonGroup>
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
      </ButtonGroup>
    </main>
  );
};

export default Content;
