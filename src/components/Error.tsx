import { Flex, Text } from "@chakra-ui/react";

export default function Error() {
  return (
    <Flex
      direction="column"
      id="NotFound"
      justify="center"
      align="center"
      height="100%"
    >
      <Text fontSize="6xl">500</Text>
      <Text>{`Oh dear, something unexpected has happened`}</Text>
    </Flex>
  );
}
