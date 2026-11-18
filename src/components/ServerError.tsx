import { Flex, Text } from "@chakra-ui/react";

export default function ServerError() {
  return (
    <Flex
      direction="column"
      id="ServerError"
      justify="center"
      align="center"
      height="100%"
    >
      <Text fontSize="6xl">500</Text>
      <Text>{`Oh dear, something unexpected has happened`}</Text>
    </Flex>
  );
}
