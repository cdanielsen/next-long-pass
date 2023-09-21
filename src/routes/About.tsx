import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";

const About = () => {
  return (
    <Flex direction="column" justify="center" align="center" height="100%">
      <Text fontSize="lg" marginBottom="1rem">
        Inspired by xkcd
      </Text>
      <Link href="https://xkcd.com/936/">
        <Box boxSize={["xs", "sm", "md", "lg"]}>
          <Image
            src="https://imgs.xkcd.com/comics/password_strength_2x.png"
            alt="An xkcd cartoon explaining why long passwords are the most secure"
          />
        </Box>
      </Link>
    </Flex>
  );
};

export default About;
