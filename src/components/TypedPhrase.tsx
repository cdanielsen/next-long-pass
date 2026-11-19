import type { ElementType } from "react";

import { useTypedText } from "../hooks/useTypedText";

interface TypedPhraseProps {
  phrase: string;
  /** Milliseconds per character. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

const TypedText = ({ text, delay }: { text: string; delay?: number }) => (
  <>{useTypedText(text, delay)}</>
);

/**
 * Types `phrase` out one character at a time. Screen readers get the full
 * phrase at once; the partially typed copy is hidden from them.
 */
const TypedPhrase = ({
  phrase,
  delay,
  as: Tag = "span",
  className,
}: TypedPhraseProps) => (
  <Tag className={className}>
    <span className="visually-hidden">{phrase}</span>
    <span aria-hidden="true">
      {/* key restarts the animation when the phrase changes */}
      <TypedText key={phrase} text={phrase} delay={delay} />
    </span>
  </Tag>
);

export default TypedPhrase;
