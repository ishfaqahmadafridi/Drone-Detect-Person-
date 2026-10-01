import React from "react";
import { cn } from "@/lib/utils";
import { MetricTileProps } from "@/types";
import { ChevronRight } from "lucide-react";

export const MetricTile: React.FC<MetricTileProps> = ({
  title,
  icon,
  value,
  subValue,
  progressPercent,
  progressBarColor = "bg-cyan-400",
  isAlertActive = false,
  alertBorderColor = "border-red-500/60 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  className,
  onClick,
  actionHint,
  isClickable,
  showProgressLine = progressPercent !== undefined,
}) => {
  const clickable = isClickable || Boolean(onClick);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (clickable && onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "glass-panel p-3.5 rounded-lg flex flex-col justify-between gap-1.5 transition-all duration-200 select-none",
        isAlertActive ? alertBorderColor : "border-slate-800 hover:border-cyan-500/40",
        clickable && "group cursor-pointer hover:border-cyan-400/60 hover:shadow-[0_0_16px_rgba(0,242,254,0.15)] active:scale-[0.99]",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="font-mono-code text-[11px] uppercase tracking-wider">{title}</span>
          {icon}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-white tracking-tight">{value}</span>
          <span className="text-xs text-slate-400">{subValue}</span>
        </div>
      </div>

      {/* Optional Tactical Progress Line */}
      {showProgressLine && progressPercent !== undefined && (
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mt-1">
          <div
            className={cn("h-full transition-all duration-300", progressBarColor)}
            style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          />
        </div>
      )}

      {/* Action Hint (e.g. "> Click to open") */}
      {actionHint && (
        <div className="flex items-center justify-between text-[10px] font-mono-code text-cyan-400/80 group-hover:text-cyan-300 pt-1 border-t border-slate-800/60 transition-colors">
          <span className="font-medium tracking-wide">{actionHint}</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}
    </div>
  );
};

