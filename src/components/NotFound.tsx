import { Flex, Text } from "@chakra-ui/react";
import { useLocation } from "react-router";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <Flex
      direction="column"
      id="NotFound"
      justify="center"
      align="center"
      height="100%"
    >
      <Text fontSize="6xl">404</Text>
      <Text>{`Sorry, this route wasn't found: ${pathname}`}</Text>
    </Flex>
  );
}
