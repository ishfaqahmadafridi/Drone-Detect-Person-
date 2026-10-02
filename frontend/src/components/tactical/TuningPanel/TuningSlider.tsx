"use client";

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
    <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono-code text-slate-300">
          {label}
        </span>
        <span className="font-mono-code text-xs font-bold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.1)]">
          {badgeValue}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease value"
          className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors font-bold text-sm leading-none shrink-0"
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
          className="flex-1 accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase value"
          className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors font-bold text-sm leading-none shrink-0"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TuningSlider;


