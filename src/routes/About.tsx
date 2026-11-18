import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";

const About = () => {
  return (
    <Flex direction="column" justify="center" align="center" flexGrow={1}>
      <Text fontSize="lg" marginBottom="1rem">
        Inspired by{" "}
        <Link
          href="https://xkcd.com/936/"
          color="blue.500"
          _hover={{ textDecoration: "none" }}
        >
          xkcd
        </Link>
      </Text>
      <Link href="https://xkcd.com/936/">
        <Box boxSize={["xs", "sm", "md", "lg"]}>
          <Image
            src="https://imgs.xkcd.com/comics/password_strength_2x.png"
            alt="An xkcd cartoon explaining why long passwords are the most secure"
          />
        </Box>
      </Link>
      <Text fontSize="sm" marginTop="1rem">
        Words from the{" "}
        <Link
          href="https://www.eff.org/dice"
          color="blue.500"
          _hover={{ textDecoration: "none" }}
        >
          EFF large wordlist
        </Link>{" "}
        (CC BY 3.0 US)
      </Text>
    </Flex>
  );
};

export default About;
