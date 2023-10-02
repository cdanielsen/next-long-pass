import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonGroup,
  Collapse,
  Flex,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { generate } from "random-words";
import { IconType } from "react-icons";
import { GiRobotAntennas, GiHouseKeys, GiCog } from "react-icons/gi";

import TypedPhrase from "./TypedPhrase";
import { useDescription } from "../clients/openai";
import CopyButton from "./CopyButton";
import ConfigSlider from "./ConfigSlider";

interface PassphraseConfig {
  maxLength: number;
  wordCount: number;
}

const Content = () => {
  const [currentPassphrase, setCurrentPassphrase] = useState<string | null>(
    null,
  );
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [passphraseConfig, setPassphraseConfig] = useState<PassphraseConfig>({
    maxLength: 5,
    wordCount: 4,
  });

  const toggleConfig = () => {
    setIsConfigOpen((openState) => !openState);
  };

  const updatePassphrase = ({ maxLength, wordCount }: PassphraseConfig) => {
    const nextPassphrase = generate({
      minLength: 3,
      maxLength,
      exactly: wordCount,
      join: " ",
    });
    setCurrentPassphrase(nextPassphrase);
  };

  const { description, isLoading, isError, refetch } =
    useDescription(currentPassphrase);

  const handleMaxLengthChange = (nextMaxLength: number) => {
    setPassphraseConfig((priorConfig) => ({
      ...priorConfig,
      maxLength: nextMaxLength,
    }));
  };

  const handleWordCountChange = (nextWordCount: number) => {
    setPassphraseConfig((priorConfig) => ({
      ...priorConfig,
      wordCount: nextWordCount,
    }));
  };

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
        <Alert status="error" margin={"1rem 0"}>
          <AlertIcon />
          <AlertTitle>Error fetching description.</AlertTitle>
          <AlertDescription>Please try again later</AlertDescription>
        </Alert>
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
      <Collapse
        in={isConfigOpen}
        transition={{ exit: { duration: 0.3 }, enter: { duration: 0.3 } }}
      >
        <Flex
          direction="column"
          align="flex-start"
          marginTop="2rem"
          padding={"0.5rem"}
        >
          <ConfigSlider
            title="Max Word Length"
            minValue={3}
            maxValue={5}
            step={1}
            value={passphraseConfig.maxLength}
            onChange={handleMaxLengthChange}
          />
          <ConfigSlider
            title="Word Count"
            minValue={3}
            maxValue={5}
            step={1}
            value={passphraseConfig.wordCount}
            onChange={handleWordCountChange}
          />
        </Flex>
      </Collapse>
      <ButtonGroup
        marginTop={["0.5rem", "1rem", "2rem"]}
        orientation="vertical"
        alignItems="flex-start"
        width="fit-content"
      >
        <ButtonGroup
          isAttached
          orientation="horizontal"
          alignItems="center"
          width="100%"
        >
          <Button
            colorScheme="red"
            onClick={() => {
              updatePassphrase(passphraseConfig);
            }}
            size={["xs", "sm", "md"]}
            width="100%"
          >
            {`Make me ${!currentPassphrase ? "one" : "another"}`}
          </Button>
          <IconButton
            colorScheme="red"
            variant={"outline"}
            size={["xs", "sm", "md"]}
            aria-label="Passphrase configuration"
            onClick={toggleConfig}
            icon={<GiCog />}
          />
        </ButtonGroup>
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
