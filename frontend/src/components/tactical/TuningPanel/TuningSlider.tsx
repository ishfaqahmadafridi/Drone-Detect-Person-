"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { TuningSliderProps } from "@/types";

export const TuningSlider: React.FC<TuningSliderProps> = ({
  label,
  badgeValue,
  value,
  min,
  max,
  step = 1,
  onChange,
}) => {
  const decrement = () =>
    onChange(Math.max(min, parseFloat((value - step).toFixed(10))));
  const increment = () =>
    onChange(Math.min(max, parseFloat((value + step).toFixed(10))));

  return (
    <div className={TACTICAL_VIEW_STYLES.TuningSlider_div_className}>
      <div className="flex items-center justify-between">
        <span className={TACTICAL_VIEW_STYLES.TuningSlider_span_className}>
          {label}
        </span>
        <span className={TACTICAL_VIEW_STYLES.TuningSlider_span_className_2}>
          {badgeValue}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease value"
          className={TACTICAL_VIEW_STYLES.TuningSlider_button_className}
        >
          −
        </button>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={TACTICAL_VIEW_STYLES.TuningSlider_input_className}
        />

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase value"
          className={TACTICAL_VIEW_STYLES.TuningSlider_button_className}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TuningSlider;


