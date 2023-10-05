import { Flex, useMediaQuery } from "@chakra-ui/react";

const titleWords = ["You", "Need", "A", "Pass", "Phrase"];
const landscapeSizes = ["1rem", "2.5rem", "3.5rem", "6rem", "8rem"];
const portraitSizes = ["2rem", "3rem", "4rem", "6rem", "8rem"];

const Header = () => {
  const [isLandscapeMode] = useMediaQuery("(orientation: landscape)");

  return (
    <Flex
      as="header"
      direction="column"
      justify="center"
      fontSize={isLandscapeMode ? landscapeSizes : portraitSizes}
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
