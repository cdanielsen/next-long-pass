import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { GoArrowSwitch } from "react-icons/go";

const labelStyles = {
  marginTop: "3",
  fontSize: [".5rem", "1rem"],
};

interface ConfigSliderProps {
  title: string;
  minValue: number;
  maxValue: number;
  step: number;
  value: number;
  onChange: (nextValue: number) => void;
}

const ConfigSlider = ({
  title,
  minValue,
  maxValue,
  step,
  value,
  onChange,
}: ConfigSliderProps) => {
  const generateMarks = () =>
    Array(Math.ceil((maxValue - minValue + 1) / step))
      .fill("")
      .map((_, idx) => {
        return (
          <SliderMark
            key={`mark-${idx}`}
            value={idx * step + minValue}
            {...labelStyles}
          >
            {idx * step + minValue}
          </SliderMark>
        );
      });
  return (
    <>
      <Text fontSize={[".5rem", "1rem"]} marginBottom="1rem">
        {title}
      </Text>
      <Slider
        min={minValue}
        max={maxValue}
        step={step}
        value={value}
        width="100%"
        onChange={onChange}
      >
        {generateMarks()}
        <SliderTrack bg="blue.100">
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={[4, 5]}>
          <Box color="blue.500" as={GoArrowSwitch as IconType} />
        </SliderThumb>
      </Slider>
    </>
  );
};

export default ConfigSlider;
