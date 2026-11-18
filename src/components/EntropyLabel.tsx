import { Text } from "@chakra-ui/react";

import {
  EntropyStrength,
  entropyBits,
  entropyStrength,
} from "../lib/passphrase";

const strengthColor: Record<EntropyStrength, string> = {
  weak: "red.500",
  fair: "yellow.600",
  strong: "green.500",
};

interface EntropyLabelProps {
  wordCount: number;
}

const EntropyLabel = ({ wordCount }: EntropyLabelProps) => {
  const bits = entropyBits(wordCount);
  const strength = entropyStrength(bits);

  return (
    <Text
      as="span"
      color={strengthColor[strength]}
      marginLeft="0.5rem"
      aria-live="polite"
    >
      {`(~${Math.round(bits)} bits · ${strength})`}
    </Text>
  );
};

export default EntropyLabel;
