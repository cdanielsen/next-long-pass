import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { GoArrowSwitch } from "react-icons/go";

const labelStyles = (idx: number) => ({
  marginTop: "3",
  // Very weird but the initial mark is off w/out this
  marginLeft: idx ? "-2" : "0",
  fontSize: [".75rem", "1rem"],
});

interface ConfigSliderProps {
  title: string;
  subtitle?: ReactNode;
  minValue: number;
  maxValue: number;
  step: number;
  value: number;
  onChange: (nextValue: number) => void;
}

const ConfigSlider = ({
  title,
  subtitle,
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
            {...labelStyles(idx)}
          >
            {idx * step + minValue}
          </SliderMark>
        );
      });
  return (
    <>
      <Text fontSize={[".75rem", "1rem"]} marginBottom="0.5rem">
        {title}
        {subtitle}
      </Text>
      <Slider
        min={minValue}
        max={maxValue}
        step={step}
        value={value}
        width="100%"
        onChange={onChange}
        marginBottom={"3rem"}
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
