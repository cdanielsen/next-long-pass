import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { generate } from "random-words";
import Passphrase from "./Passphrase";
import "./Content.css";

const Content = () => {
  const [currentPassphrase, setCurrentPassphrase] = useState<string | null>(
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

  return (
    <main id="Content">
      <Passphrase passPhrase={currentPassphrase} />
      <Button colorScheme="red" width="32 px" onClick={updatePassphrase}>
        Make me one
      </Button>
    </main>
  );
};

export default Content;
