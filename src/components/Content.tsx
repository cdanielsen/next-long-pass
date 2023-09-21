import { useState } from "react";
import { Button, ButtonGroup, Flex, Icon } from "@chakra-ui/react";
import { generate } from "random-words";
import { IconType } from "react-icons";
import { GiRobotAntennas, GiHouseKeys } from "react-icons/gi";

import TypedPhrase from "./TypedPhrase";
import { useDescription } from "../clients/openai";
import CopyButton from "./CopyButton";

const Content = () => {
  const [currentPassphrase, setCurrentPassphrase] = useState<string | null>(
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

  const { description, isLoading, isError, refetch } =
    useDescription(currentPassphrase);

  return (
    <Flex
      as="main"
      direction="column"
      justify="center"
      minWidth={[100, 200, 400, 600]}
    >
      {currentPassphrase && (
        <Flex direction="row" align="center">
          <Icon
            boxSize={[6, 12]}
            marginRight="0.5rem"
            as={GiHouseKeys as IconType}
          />
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            width="100%"
          >
            <TypedPhrase phrase={currentPassphrase} />
            <CopyButton
              textToCopy={currentPassphrase}
              ariaLabel="Copy passphrase"
            />
          </Flex>
        </Flex>
      )}
      {isError && (
        <TypedPhrase phrase={"An error occured. Please try again later"} />
      )}
      {!isError && description && (
        <Flex direction="row" align="center">
          <Icon
            boxSize={[6, 12]}
            marginRight="0.5rem"
            as={GiRobotAntennas as IconType}
          />
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            width="100%"
          >
            <TypedPhrase
              phrase={description}
              containerOptions={{
                fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,monospace",
              }}
            />
            <CopyButton textToCopy={description} ariaLabel="Copy description" />
          </Flex>
        </Flex>
      )}
      <ButtonGroup
        marginTop="2rem"
        orientation="vertical"
        alignItems="flex-start"
        width="fit-content"
      >
        <Button
          colorScheme="red"
          onClick={updatePassphrase}
          size={["xs", "sm", "md"]}
          width="100%"
        >
          {`Make me ${!currentPassphrase ? "one" : "another"}`}
        </Button>
        {currentPassphrase && (
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            size={["xs", "sm", "md"]}
            onClick={refetch}
          >
            Regenerate AI mnemonic
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  );
};

export default Content;
