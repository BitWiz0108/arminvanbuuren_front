import { FC, useCallback, useEffect, useRef } from "react";

import { secondsToHHMMSS } from "@/libs/utils";

type Props = {
  min: number;
  max: number;
  value: number;
  step: number;
  onChange: Function;
};

const AudioSlider: FC<Props> = ({ min, max, value, step, onChange }) => {
  const valueRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => ((value - min) / (max - min)) * 100,
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (valueRef.current) {
      const widthPercent = getPercent(value);

      if (range.current) {
        range.current.style.width = `${widthPercent}%`;
      }
    }
  }, [getPercent, value, range, valueRef]);

  return (
    <div
      className="slider-container"
      onMouseDown={(event) => {
        const slider = event.target as HTMLDivElement;
        const rect = slider.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const sliderWidth = rect.width;
        const newValue = max * (offsetX / sliderWidth);

        onChange(newValue);
      }}
    >
      <input
        type="range"
        min={min}
        max={max ? max : 0}
        step={step}
        value={value}
        ref={valueRef}
        onChange={(event) => {
          const value = Number(event.target.value);
          onChange(value);
        }}
        className="thumb z-10"
      />

      <div className="slider">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
      </div>

      <span className="absolute right-2 -bottom-7 text-primary text-xs">
        {secondsToHHMMSS(value)} / {secondsToHHMMSS(max)}
      </span>
    </div>
  );
};

export default AudioSlider;
