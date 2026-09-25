import React from "react";
import { TuningSliderProps } from "@/types";

export const TuningSlider: React.FC<TuningSliderProps> = ({
  label,
  badgeValue,
  min,
  max,
  step = 1,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span className="font-mono-code text-cyan-400 font-bold">{badgeValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
      />
    </div>
  );
};
