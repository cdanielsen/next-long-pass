import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { generate } from "random-words";
import { IconType } from "react-icons";
import { GiRobotAntennas, GiHouseKeys, GiCog } from "react-icons/gi";
import { GoArrowSwitch } from "react-icons/go";

import TypedPhrase from "./TypedPhrase";
import { useDescription } from "../clients/openai";
import CopyButton from "./CopyButton";

interface PassphraseConfig {
  maxLength: number;
}

const Content = () => {
  const [currentPassphrase, setCurrentPassphrase] = useState<string | null>(
    null,
  );
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [passphraseConfig, setPassphraseConfig] = useState<PassphraseConfig>({
    maxLength: 5,
  });

  const toggleConfig = () => {
    setIsConfigOpen((openState) => !openState);
  };
  const updatePassphrase = ({ maxLength }: PassphraseConfig) => {
    const nextPassphrase = generate({
      minLength: 3,
      maxLength,
      exactly: 4,
      join: " ",
    });
    setCurrentPassphrase(nextPassphrase);
  };

  const { description, isLoading, isError, refetch } =
    useDescription(currentPassphrase);

  const labelStyles = {
    marginTop: "3",
    fontSize: [".5rem", "1rem"],
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
      {isConfigOpen && (
        <Flex
          direction="column"
          align="flex-start"
          marginTop="1rem"
          padding="1rem 1rem 2rem 1rem"
          border="2px solid darkgrey"
        >
          <Text fontSize={[".5rem", "1rem"]} marginBottom="1rem">
            Max Word Length
          </Text>
          <Slider
            min={3}
            max={5}
            step={1}
            value={passphraseConfig.maxLength}
            width="100%"
            onChange={(value) => {
              setPassphraseConfig({
                ...passphraseConfig,
                maxLength: value,
              });
            }}
          >
            <SliderMark value={3} {...labelStyles}>
              3
            </SliderMark>
            <SliderMark value={4} {...labelStyles}>
              4
            </SliderMark>
            <SliderMark value={5} {...labelStyles}>
              5
            </SliderMark>
            <SliderTrack bg="blue.50">
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={[4, 5]}>
              <Box color="blue.500" as={GoArrowSwitch as IconType} />
            </SliderThumb>
          </Slider>
        </Flex>
      )}
      <ButtonGroup
        marginTop="2rem"
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
