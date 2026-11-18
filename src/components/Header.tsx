import { Flex, Heading, useMediaQuery } from "@chakra-ui/react";

const titleWords = ["You", "Need", "A", "Pass", "Phrase"];
const landscapeSizes = ["1rem", "2.5rem", "3.5rem", "6rem", "8rem"];
const portraitSizes = ["2rem", "3rem", "4rem", "6rem", "8rem"];

const Header = () => {
  const [isLandscapeMode] = useMediaQuery("(orientation: landscape)");

  return (
    <Flex as="header" direction="column" justify="center" marginRight="1.5rem">
      {/* Pin Heading's theme defaults (bold, size, line-height) so it looks
          exactly like the previous plain divs; Alfa Slab One has no bold. */}
      <Heading
        as="h1"
        // Stacked block spans would otherwise be announced as "YouNeedAPassPhrase"
        aria-label={titleWords.join(" ")}
        display="flex"
        flexDirection="column"
        fontSize={isLandscapeMode ? landscapeSizes : portraitSizes}
        fontWeight="normal"
        lineHeight="125%"
      >
        {titleWords.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </Heading>
    </Flex>
  );
};

export default Header;
