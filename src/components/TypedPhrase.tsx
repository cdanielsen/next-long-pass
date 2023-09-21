import { Box, BoxProps } from "@chakra-ui/react";
import Typewriter, { Options } from "typewriter-effect";

interface TypedPhraseProps {
  phrase: string;
  typewriterOptions?: Partial<Options>;
  containerOptions?: Partial<BoxProps>;
}

const TypedPhrase = ({
  phrase,
  containerOptions = {},
  typewriterOptions = {},
}: TypedPhraseProps) => {
  return (
    <Box
      as="section"
      margin="0.5rem 0"
      fontSize={[".75rem", "1.5rem"]}
      maxWidth="30rem"
      {...containerOptions}
    >
      <Typewriter
        options={{
          strings: phrase,
          autoStart: true,
          delay: 40,
          cursor: "",
          ...typewriterOptions,
        }}
      />
    </Box>
  );
};

export default TypedPhrase;
