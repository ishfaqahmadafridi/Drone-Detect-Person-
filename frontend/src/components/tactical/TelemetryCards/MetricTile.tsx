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
  progressBarColor = "bg-blue-500",
  isAlertActive = false,
  alertBorderColor = "border-red-500/40 bg-red-950/15",
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
        "glass-panel p-3.5 rounded-lg flex flex-col justify-between gap-2 transition-all duration-150 select-none",
        isAlertActive ? alertBorderColor : "border-slate-800 hover:border-slate-700",
        clickable && "group cursor-pointer hover:border-slate-600/80 active:scale-[0.995]",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-slate-400">{title}</span>
          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">{icon}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-100 font-mono-code tracking-tight">{value}</span>
          <span className="text-xs text-slate-400">{subValue}</span>
        </div>
      </div>

      {/* Clean Enterprise Progress Indicator */}
      {showProgressLine && progressPercent !== undefined && (
        <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden mt-1">
          <div
            className={cn("h-full transition-all duration-200", progressBarColor)}
            style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          />
        </div>
      )}

      {/* Sub-action hint */}
      {actionHint && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-400 pt-1.5 border-t border-slate-800/70 transition-colors">
          <span className="font-normal">{actionHint}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
        </div>
      )}
    </div>
  );
};

export default MetricTile;
