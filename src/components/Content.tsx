import { useState } from "react";
import { Button, ButtonGroup, Flex, Icon, Stack } from "@chakra-ui/react";
import { GiRobotAntennas, GiHouseKeys } from "react-icons/gi";
import { generate } from "random-words";
import Passphrase from "./Passphrase";
import Description from "./Description";
import { useDescription } from "../clients/openai";
import { IconType } from "react-icons";

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
    <Flex as="main" direction="column" justify="center">
      {currentPassphrase && (
        <Stack direction="row" align="center">
          <Icon boxSize={[6, 12]} as={GiHouseKeys as IconType} />
          <Passphrase passphrase={currentPassphrase} />
        </Stack>
      )}
      {isError && (
        <Description description={"An error occured. Please try again later"} />
      )}
      {!isError && description && (
        <Stack direction="row" align="center">
          <Icon boxSize={[6, 12]} as={GiRobotAntennas as IconType} />
          <Description description={description} />
        </Stack>
      )}
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
