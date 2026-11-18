import { Flex, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

import CopyButton from "./CopyButton";
import TypedPhrase from "./TypedPhrase";

const MONOSPACE_FONT = "SFMono-Regular,Menlo,Monaco,Consolas,monospace";

interface PhraseRowProps {
  icon: IconType;
  iconLabel: string;
  phrase: string;
  /** Accessible label for the phrase (the typed text itself is aria-hidden). */
  phraseLabel: string;
  copyLabel: string;
  monospace?: boolean;
}

/** An icon, an animated typed phrase, and a copy button on one row. */
const PhraseRow = ({
  icon,
  iconLabel,
  phrase,
  phraseLabel,
  copyLabel,
  monospace = false,
}: PhraseRowProps) => (
  <Flex direction="row" align="center">
    <Icon
      boxSize={[6, 12]}
      marginRight="0.5rem"
      as={icon}
      aria-label={iconLabel}
    />
    <Flex direction="row" justify="space-between" align="center" width="100%">
      <TypedPhrase
        phrase={phrase}
        ariaLabel={phraseLabel}
        containerOptions={monospace ? { fontFamily: MONOSPACE_FONT } : {}}
      />
      <CopyButton textToCopy={phrase} ariaLabel={copyLabel} />
    </Flex>
  </Flex>
);

export default PhraseRow;
