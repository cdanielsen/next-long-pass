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
import {
  MAX_WORDS,
  MIN_WORDS,
  TemperatureModes,
  TemperatureValues,
} from "../lib/config";

export interface PassphraseConfig {
  wordCount: number;
  temperature: TemperatureModes;
}

const AI_MODE_OPTIONS: readonly { value: TemperatureModes; label: string }[] = [
  { value: TemperatureValues[0], label: "Standard" },
  { value: TemperatureValues[1], label: "Matthew McConaughey" },
];

interface ConfigPanelProps {
  isOpen: boolean;
  config: PassphraseConfig;
  onChange: (patch: Partial<PassphraseConfig>) => void;
}

const ConfigPanel = ({ isOpen, config, onChange }: ConfigPanelProps) => {
  const handleModeChange = (nextValue: string) => {
    const option = AI_MODE_OPTIONS.find(
      ({ value }) => String(value) === nextValue,
    );
    if (option) {
      onChange({ temperature: option.value });
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
          value={String(config.temperature)}
        >
          <Stack direction="column">
            {AI_MODE_OPTIONS.map(({ value, label }) => (
              <Radio key={value} value={String(value)} size="sm">
                {label}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Flex>
    </Collapse>
  );
};

export default ConfigPanel;
