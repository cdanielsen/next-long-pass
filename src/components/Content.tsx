import { useState } from "react";
import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { generate } from "random-words";
import Passphrase from "./Passphrase";
import Description from "./Description";
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
    <Flex as="main" direction="column" justify="center">
      {currentPassphrase && <Passphrase passphrase={currentPassphrase} />}
      {currentDescription && <Description description={currentDescription} />}
      <ButtonGroup
        marginTop="2rem"
        orientation="vertical"
        alignItems={"flex-start"}
      >
        <Button
          colorScheme="red"
          onClick={updatePassphrase}
          size={["xs", "sm", "md"]}
        >
          Make me one
        </Button>
        {currentPassphrase && (
          <Button
            colorScheme="blue"
            size={["xs", "sm", "md"]}
            onClick={generatePassphraseDescription(currentPassphrase)}
          >
            Generate AI description
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  );
};

export default Content;
