import { Box, BoxProps } from "@chakra-ui/react";
import Typewriter, { Options } from "typewriter-effect";

interface TypedPhraseProps {
  phrase: string;
  ariaLabel: string;
  typewriterOptions?: Partial<Options>;
  containerOptions?: Partial<BoxProps>;
}

const TypedPhrase = ({
  phrase,
  ariaLabel,
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
      aria-label={ariaLabel}
    >
      {/* The generated output from this effect is not screen reader friendly, so hide this content from the a11y tree / use an aria-label for the container */}
      <div aria-hidden>
        <Typewriter
          options={{
            strings: phrase,
            autoStart: true,
            delay: 40,
            cursor: "",
            ...typewriterOptions,
          }}
        />
      </div>
    </Box>
  );
};

export default TypedPhrase;
