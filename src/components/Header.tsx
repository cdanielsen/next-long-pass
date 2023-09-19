import { Flex } from "@chakra-ui/react";

const Header = () => {
  const titleWords = ["You", "Need", "A", "Pass", "Phrase"];
  return (
    <Flex
      as="header"
      direction="column"
      justify="center"
      fontSize={["2.5rem", "5rem", "8rem"]}
      lineHeight="125%"
      marginRight="1.5rem"
    >
      {titleWords.map((word) => (
        <div key={word}>{word}</div>
      ))}
    </Flex>
  );
};

export default Header;
