import { Box, BoxProps } from "@chakra-ui/react";

import { useTypedText } from "../hooks/useTypedText";

interface TypedPhraseProps {
  phrase: string;
  ariaLabel: string;
  /** Milliseconds per character. */
  delay?: number;
  containerOptions?: Partial<BoxProps>;
}

const TypedText = ({ text, delay }: { text: string; delay?: number }) => (
  <>{useTypedText(text, delay)}</>
);

const TypedPhrase = ({
  phrase,
  ariaLabel,
  delay,
  containerOptions = {},
}: TypedPhraseProps) => (
  <Box
    as="section"
    margin="0.5rem 0"
    fontSize={[".75rem", "1.5rem"]}
    maxWidth="30rem"
    {...containerOptions}
    aria-label={ariaLabel}
  >
    {/* The partially typed text isn't screen reader friendly, so hide it from
        the a11y tree; the container's aria-label carries the full phrase. */}
    <div aria-hidden>
      {/* key restarts the animation when the phrase changes */}
      <TypedText key={phrase} text={phrase} delay={delay} />
    </div>
  </Box>
);

export default TypedPhrase;
