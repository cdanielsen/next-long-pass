import {
  Collapse,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

import ConfigSlider from "./ConfigSlider";
import EntropyLabel from "./EntropyLabel";
import { MAX_WORDS, MIN_WORDS } from "../../shared/passphrase";
import { AI_MODES, isAiMode, type AiMode } from "../../shared/api";

export interface PassphraseConfig {
  wordCount: number;
  mode: AiMode;
}

const AI_MODE_LABELS: Record<AiMode, string> = {
  standard: "Standard",
  mcconaughey: "Matthew McConaughey",
};

interface ConfigPanelProps {
  isOpen: boolean;
  config: PassphraseConfig;
  onChange: (patch: Partial<PassphraseConfig>) => void;
}

const ConfigPanel = ({ isOpen, config, onChange }: ConfigPanelProps) => {
  const handleModeChange = (nextValue: string) => {
    if (isAiMode(nextValue)) {
      onChange({ mode: nextValue });
    }
  };

  return (
    <Collapse
      in={isOpen}
      transition={{ exit: { duration: 0.3 }, enter: { duration: 0.3 } }}
    >
      <Flex
        direction="column"
        align="flex-start"
        marginTop="2rem"
        padding={"0.5rem"}
      >
        <ConfigSlider
          title="Word Count"
          subtitle={<EntropyLabel wordCount={config.wordCount} />}
          minValue={MIN_WORDS}
          maxValue={MAX_WORDS}
          step={1}
          value={config.wordCount}
          onChange={(wordCount) => {
            onChange({ wordCount });
          }}
        />
        <Text fontSize={[".5rem", "1rem"]} marginBottom="0.5rem">
          AI Mode
        </Text>
        <RadioGroup
          name="AI Mode"
          onChange={handleModeChange}
          value={config.mode}
        >
          <Stack direction="column">
            {AI_MODES.map((mode) => (
              <Radio key={mode} value={mode} size="sm">
                {AI_MODE_LABELS[mode]}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Flex>
    </Collapse>
  );
};

export default ConfigPanel;
